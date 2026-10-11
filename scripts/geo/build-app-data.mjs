// Build the app's offline data bundle from data/geo + data/resources.json:
//   web/data/places.json     ZIP centroids, neighborhood points (+aliases), Ward 7/8 intersections
//   web/data/resources.json  curated directory (copied)
//   web/data/cells.json      gap-analysis hex cells east of the river with precomputed supply facts
//   web/public/geo/*.geojson map layers served to the browser
// Nothing here calls a network service.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import * as turf from '@turf/turf';
import { GEO } from './lib.mjs';

const ROOT = path.resolve(GEO, '../..');
const WEB = path.join(ROOT, 'web');
const load = (f) => JSON.parse(readFileSync(path.join(GEO, f), 'utf8'));
const r6 = (n) => Math.round(n * 1e6) / 1e6;
mkdirSync(path.join(WEB, 'data'), { recursive: true });
mkdirSync(path.join(WEB, 'public/geo'), { recursive: true });

const east = load('east-of-river.geojson').features[0];
const wards = load('wards.geojson');

// ---- ZIP centroids (standard ZIPs only; single-building ZIPs are skipped)
const zips = {};
for (const f of load('zipcodes.geojson').features) {
  const { zipcode, type } = f.properties;
  if (!zipcode || (type && type !== 'STANDARD')) continue;
  let pt = turf.centerOfMass(f);
  if (!turf.booleanPointInPolygon(pt, f)) pt = turf.pointOnFeature(f);
  const [lng, lat] = pt.geometry.coordinates;
  const eastShare = (() => {
    try { const i = turf.intersect(turf.featureCollection([f, east])); return i ? turf.area(i) / turf.area(f) : 0; }
    catch { return 0; }
  })();
  if (!zips[zipcode] || zips[zipcode].area < turf.area(f)) {
    zips[zipcode] = { zip: zipcode, lat: r6(lat), lng: r6(lng), area: turf.area(f), eastShare: Math.round(eastShare * 100) / 100 };
  }
}
for (const z of Object.values(zips)) delete z.area;

// ---- Neighborhoods (labels + cluster aliases)
const hoods = [];
const seen = new Set();
const nb = load('neighborhoods.geojson').features;
for (const f of nb.filter((f) => f.properties.kind === 'neighborhood')) {
  const p = f.properties;
  const names = [p.name, ...(p.aliases ? p.aliases.split('|') : [])];
  const [lng, lat] = f.geometry.coordinates;
  hoods.push({ name: p.name, names, lat: r6(lat), lng: r6(lng), ward: p.ward, east: !!p.east_of_river });
  names.forEach((n) => seen.add(n.toLowerCase()));
}
for (const f of nb.filter((f) => f.properties.kind === 'cluster')) {
  const p = f.properties;
  const [lng, lat] = f.geometry.coordinates;
  for (const alias of (p.aliases || '').split('|').filter(Boolean)) {
    if (seen.has(alias.toLowerCase())) continue;
    seen.add(alias.toLowerCase());
    hoods.push({ name: alias, names: [alias], lat: r6(lat), lng: r6(lng), ward: p.ward, east: !!p.east_of_river });
  }
}

// ---- Intersections (Wards 7 & 8), de-duplicated
const inter = [];
const ikey = new Set();
for (const f of load('intersections-w78.geojson').features) {
  const { street1, street2, ward } = f.properties;
  if (!street1 || !street2 || /RAMP/.test(street1 + street2)) continue;
  const k = [street1, street2].sort().join('|');
  if (ikey.has(k)) continue;
  ikey.add(k);
  const [lng, lat] = f.geometry.coordinates;
  inter.push({ a: street1, b: street2, lat: r6(lat), lng: r6(lng), ward });
}

writeFileSync(path.join(WEB, 'data/places.json'), JSON.stringify({
  generated_by: 'scripts/geo/build-app-data.mjs', source: 'Open Data DC (CC BY 4.0)',
  zips, neighborhoods: hoods, intersections: inter,
}));

// ---- Resources
const res = JSON.parse(readFileSync(path.join(ROOT, 'data/resources.json'), 'utf8'));
// The text line also knows every other full-service grocery store in DC (Open Data DC), so someone texting from just
// west of the river is sent to the grocery store next door instead of a pantry 2 miles east. Hours are not in that
// dataset, so replies say to check with the store; nothing is invented.
const QUAD = new Set(['NE', 'SE', 'SW', 'NW']);
const titleAddr = (a) => a.toLowerCase().split(' ').map((w) => (QUAD.has(w.toUpperCase()) ? w.toUpperCase() : /^\d/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
  .join(' ').replace(/\bAvenue\b/, 'Ave').replace(/\bStreet\b/, 'St').replace(/\bRoad\b/, 'Rd');
const have = res.resources.filter((r) => r.type === 'grocery');
const extra = load('grocery-stores.geojson').features.filter((f) => f.properties.open_2026)
  .filter((f) => !have.some((r) => Math.hypot((r.lat - f.geometry.coordinates[1]) * 111, (r.lng - f.geometry.coordinates[0]) * 86) < 0.15))
  .map((f) => ({
    id: `ods-grocery-${f.properties.id}`, name: f.properties.name, type: 'grocery',
    address: `${titleAddr(f.properties.address)}, Washington, DC ${f.properties.zipcode}`, zip: f.properties.zipcode, neighborhood: null,
    lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], geocode_source: 'open-data-dc', ward: f.properties.ward,
    east_of_river: f.properties.east_of_river, hours: null, schedule_note: 'Hours not listed here; check with the store.', season: null,
    free: false, snap: 'unknown', wic: 'unknown', produce_plus: 'unknown', eligibility: 'Open to all', languages: ['en'], phone: null, website: null,
    source_url: 'https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations', extra_source_urls: [], last_verified: '2026-10-11', confidence: 'medium',
    notes: 'Full-service grocery store from Open Data DC Grocery Store Locations (operating in 2026). Hours and SNAP not verified.',
  }));
writeFileSync(path.join(WEB, 'data/resources.json'), JSON.stringify({ ...res, count: res.resources.length + extra.length, resources: [...res.resources, ...extra] }));
console.log(`lookup list: ${res.resources.length} curated + ${extra.length} citywide grocery stores`);

// ---- Gap cells: ~0.45 km hexes clipped to the east-of-river area
const groceries = load('grocery-stores.geojson').features.filter((f) => f.properties.open_2026);
const hex = turf.hexGrid(turf.bbox(east), 0.45, { units: 'kilometers' });
const cells = [];
const cellFeatures = [];
let id = 0;
for (const h of hex.features) {
  const c = turf.centroid(h);
  if (!turf.booleanPointInPolygon(c, east)) continue;
  const [lng, lat] = c.geometry.coordinates;
  const dist = (x, y) => turf.distance(c, turf.point([x, y]), { units: 'kilometers' });
  const near = res.resources.filter((r) => dist(r.lng, r.lat) <= 1);
  const nearestGrocery = Math.min(...groceries.map((g) => dist(...g.geometry.coordinates)));
  let bestI = null, bestD = Infinity;
  for (const i of inter) { const d = dist(i.lng, i.lat); if (d < bestD) { bestD = d; bestI = i; } }
  let hood = null, hoodD = Infinity;
  for (const n of hoods.filter((n) => n.east)) { const d = dist(n.lng, n.lat); if (d < hoodD) { hoodD = d; hood = n.name; } }
  const cell = {
    id: id++, lat: r6(lat), lng: r6(lng), hood,
    nearestGroceryKm: Math.round(nearestGrocery * 100) / 100,
    within1km: near.reduce((m, r) => ((m[r.type] = (m[r.type] || 0) + 1), m), {}),
    freeWithin1km: near.filter((r) => r.free).length,
    stop: bestI ? { a: bestI.a, b: bestI.b, lat: bestI.lat, lng: bestI.lng } : null,
  };
  cells.push(cell);
  cellFeatures.push({ type: 'Feature', properties: { id: cell.id }, geometry: {
    type: 'Polygon', coordinates: h.geometry.coordinates.map((ring) => ring.map(([x, y]) => [r6(x), r6(y)])) } });
}
writeFileSync(path.join(WEB, 'data/cells.json'), JSON.stringify(cells));
writeFileSync(path.join(WEB, 'public/geo/cells.geojson'), JSON.stringify({ type: 'FeatureCollection', features: cellFeatures }));

// ---- Map layers for the browser
for (const f of ['dc-boundary', 'east-of-river', 'water', 'wards', 'low-food-access', 'grocery-stores', 'neighborhoods']) {
  copyFileSync(path.join(GEO, `${f}.geojson`), path.join(WEB, `public/geo/${f}.geojson`));
}
writeFileSync(path.join(WEB, 'public/geo/resources.geojson'), JSON.stringify({ type: 'FeatureCollection', features:
  res.resources.map((r) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [r.lng, r.lat] },
    properties: { id: r.id, name: r.name, type: r.type, free: r.free, address: r.address.split(',')[0], snap: r.snap === true, note: (r.schedule_note || '').slice(0, 140) } })) }));

console.log(`zips ${Object.keys(zips).length}, neighborhoods ${hoods.length}, intersections ${inter.length}, cells ${cells.length}, resources ${res.resources.length}`);
console.log('east-of-river ZIPs:', Object.values(zips).filter((z) => z.eastShare > 0.05).map((z) => `${z.zip}(${z.eastShare})`).join(' '));
