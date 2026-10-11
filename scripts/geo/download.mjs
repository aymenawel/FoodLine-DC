// Step 1: download every layer in layers.mjs from the DC GIS ArcGIS REST services
// as GeoJSON in EPSG:4326, plus the Open Data DC (Hub) metadata for each dataset.
//
// Usage:  node download.mjs            (all layers)
//         node download.mjs grocery-stores wards-2022   (selected layers)
//
// Output (data/raw/):
//   <key>.geojson      raw features (all attributes, outSR=4326)
//   <key>.layer.json   ArcGIS REST layer metadata (fields, etc.)
//   <key>.hub.json     Open Data DC Hub v3 dataset metadata (title, slug, dates, license)
//   manifest.json      summary of URLs, dates, licence and feature counts
//
// Downloaded content is treated as untrusted data: it is only parsed with JSON.parse.

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYERS, REST_BASE, HUB_BASE } from './layers.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.resolve(here, '../../data/raw');

async function fetchJson(url, { tries = 4 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'dc-food-access-hackathon/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const text = await res.text();
      const json = JSON.parse(text);
      if (json && json.error) throw new Error(`ArcGIS error for ${url}: ${JSON.stringify(json.error)}`);
      return json;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

const stripHtml = (s) =>
  s == null ? null : String(s).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const iso = (ms) => (typeof ms === 'number' && ms > 0 ? new Date(ms).toISOString() : null);

async function downloadLayer(layer) {
  const layerUrl = `${REST_BASE}/${layer.service}`;
  const meta = await fetchJson(`${layerUrl}?f=json`);
  await writeFile(path.join(RAW, `${layer.key}.layer.json`), JSON.stringify(meta, null, 1));

  const countUrl = `${layerUrl}/query?where=1%3D1&returnCountOnly=true&f=json`;
  const { count } = await fetchJson(countUrl);
  const pageSize = Math.min(meta.maxRecordCount || 1000, 2000);

  const features = [];
  const queryTemplate = `${layerUrl}/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson`;
  for (let offset = 0; offset < count; offset += pageSize) {
    const url = `${queryTemplate}&resultOffset=${offset}&resultRecordCount=${pageSize}`;
    const page = await fetchJson(url);
    if (!Array.isArray(page.features)) throw new Error(`No features array in ${url}`);
    features.push(...page.features);
    process.stdout.write(`  ${layer.key}: ${features.length}/${count}\r`);
    if (page.features.length === 0) break;
  }
  process.stdout.write('\n');
  if (features.length !== count) {
    throw new Error(`${layer.key}: downloaded ${features.length} features but service reports ${count}`);
  }
  const fc = { type: 'FeatureCollection', features };
  await writeFile(path.join(RAW, `${layer.key}.geojson`), JSON.stringify(fc));

  // Hub metadata (Open Data DC page)
  let hub = null;
  try {
    hub = await fetchJson(`${HUB_BASE}/api/v3/datasets/${layer.hubId}`);
    await writeFile(path.join(RAW, `${layer.key}.hub.json`), JSON.stringify(hub, null, 1));
  } catch (e) {
    console.warn(`  ! hub metadata failed for ${layer.key}: ${e.message}`);
  }
  const a = hub?.data?.attributes ?? {};
  const itemId = layer.hubId.split('_')[0];
  const layerIdx = layer.hubId.split('_')[1];
  return {
    key: layer.key,
    title: a.name ?? layer.title,
    hub_title: layer.title,
    page_url: a.slug ? `${HUB_BASE}/datasets/${a.slug}` : `${HUB_BASE}/datasets/${layer.hubId}`,
    page_url_by_id: `${HUB_BASE}/datasets/${layer.hubId}`,
    rest_layer_url: layerUrl,
    download_url: `${queryTemplate}&resultOffset=<n>&resultRecordCount=${pageSize}`,
    download_url_first_page: `${queryTemplate}&resultOffset=0&resultRecordCount=${pageSize}`,
    hub_geojson_download_url: `${HUB_BASE}/api/download/v1/items/${itemId}/geojson?layers=${layerIdx}`,
    page_size: pageSize,
    feature_count: features.length,
    service_reported_count: count,
    hub_record_count: a.recordCount ?? null,
    hub_modified: iso(a.modified),
    hub_modified_provenance: a.modifiedProvenance ?? null,
    hub_item_modified: iso(a.itemModified),
    hub_created: iso(a.created),
    service_data_last_edit: iso(meta.editingInfo?.dataLastEditDate ?? meta.editingInfo?.lastEditDate),
    license: a.license ?? null,
    license_name: a.structuredLicense?.name ?? null,
    license_url: a.structuredLicense?.url ?? null,
    license_text: stripHtml(a.licenseInfo),
    source: a.source ?? null,
    geometry_type: meta.geometryType,
    fields: (meta.fields || []).map((f) => f.name),
    downloaded_at: new Date().toISOString(),
  };
}

async function main() {
  await mkdir(RAW, { recursive: true });
  const only = process.argv.slice(2);
  const manifestPath = path.join(RAW, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : { layers: {} };
  for (const layer of LAYERS) {
    if (only.length && !only.includes(layer.key)) continue;
    console.log(`Downloading ${layer.key} (${layer.title})`);
    try {
      manifest.layers[layer.key] = await downloadLayer(layer);
      console.log(`  ok: ${manifest.layers[layer.key].feature_count} features, hub modified ${manifest.layers[layer.key].hub_modified}`);
    } catch (e) {
      console.error(`  FAILED ${layer.key}: ${e.message}`);
      manifest.layers[layer.key] = { key: layer.key, title: layer.title, error: e.message, attempted_at: new Date().toISOString() };
    }
  }
  manifest.generated_at = new Date().toISOString();
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
