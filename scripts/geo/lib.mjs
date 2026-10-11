// Shared helpers for process.mjs and stats.mjs.
// All spatial tests use the RAW (unsimplified) geometries from data/raw/.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as turf from '@turf/turf';

const here = path.dirname(fileURLToPath(import.meta.url));
export const RAW = path.resolve(here, '../../data/raw');
export const GEO = path.resolve(here, '../../data/geo');
export const NOTES = path.resolve(here, '../../research/notes/Food access east of the Anacostia');

export const loadRaw = (key) => JSON.parse(readFileSync(path.join(RAW, `${key}.geojson`), 'utf8'));
export const loadManifest = () => JSON.parse(readFileSync(path.join(RAW, 'manifest.json'), 'utf8'));

export const round5 = (n) => Math.round(n * 1e5) / 1e5;
export const clean = (s) => (s == null ? null : String(s).replace(/\s+/g, ' ').trim() || null);

// ---------------------------------------------------------------------------
// Polygon index with bbox pre-filter
export function polyIndex(features) {
  return features.map((f) => ({ f, bbox: turf.bbox(f) }));
}
export function findContaining(index, pt) {
  const [x, y] = pt.geometry.coordinates;
  for (const { f, bbox } of index) {
    if (x < bbox[0] || x > bbox[2] || y < bbox[1] || y > bbox[3]) continue;
    if (turf.booleanPointInPolygon(pt, f)) return f;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wards (2022)
let _wards;
export function wards() {
  if (!_wards) _wards = polyIndex(loadRaw('wards-2022').features);
  return _wards;
}
export function wardOf(pt) {
  const w = findContaining(wards(), pt);
  return w ? Number(w.properties.WARD) : null;
}

// ---------------------------------------------------------------------------
// East of the river
// Method A (primary): the official DC GIS "East of the River" polygon (Open Data DC).
let _eor;
export function eorFeature() {
  if (!_eor) _eor = loadRaw('east-of-the-river').features[0];
  return _eor;
}
export const isEastOfficial = (pt) => turf.booleanPointInPolygon(pt, eorFeature());

// Method B (independent check): derive "east of the Anacostia" from the DC boundary and
// the Waterbodies river polygon. The largest "River" polygon (one feature that covers both
// the Potomac and the Anacostia) is buffered by 5 m to close hairline gaps where it meets
// the DC boundary, subtracted from the DC boundary, and the land component that contains a
// seed point on the east bank (Frederick Douglass National Historic Site, Cedar Hill,
// 1411 W St SE: -76.9853, 38.8633) is taken as "east of the river".
export const EAST_SEED = [-76.9853, 38.8633];
let _derived;
export function derivedEastFeature() {
  if (_derived) return _derived;
  const dc = loadRaw('dc-boundary').features[0];
  const water = loadRaw('waterbodies').features.filter((f) => f.properties.DESCRIPTION === 'River');
  water.sort((a, b) => turf.area(b) - turf.area(a));
  const main = water[0];
  const buffered = turf.buffer(main, 5, { units: 'meters' });
  const land = turf.difference(turf.featureCollection([dc, buffered]));
  const rings = land.geometry.type === 'MultiPolygon' ? land.geometry.coordinates : [land.geometry.coordinates];
  const seed = turf.point(EAST_SEED);
  const comp = rings.map((c) => turf.polygon(c)).find((p) => turf.booleanPointInPolygon(seed, p));
  _derived = { feature: comp, mainRiverObjectId: main.properties.OBJECTID, mainRiverAreaKm2: turf.area(main) / 1e6 };
  return _derived;
}
export const isEastDerived = (pt) => turf.booleanPointInPolygon(pt, derivedEastFeature().feature);

// Method C (coarse check): Neighborhood Clusters wholly east of the Anacostia.
// Clusters 28-39 (Historic Anacostia ... Congress Heights/Bellevue/Washington Highlands),
// 43 (Saint Elizabeths) and 44 (Joint Base Anacostia-Bolling). Cluster 46
// ("Arboretum, Anacostia River") straddles the river, so points there are "unresolved".
export const EAST_CLUSTERS = new Set([28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 43, 44]);
let _clusters;
export function clusters() {
  if (!_clusters) _clusters = polyIndex(loadRaw('neighborhood-clusters').features);
  return _clusters;
}
export function clusterOf(pt) {
  const c = findContaining(clusters(), pt);
  return c ? c.properties.NAME : null;
}
export function isEastByCluster(pt) {
  const name = clusterOf(pt);
  if (!name) return null;
  const n = Number(String(name).replace(/\D+/g, ''));
  if (n === 46) return 'unresolved';
  return EAST_CLUSTERS.has(n);
}

// ---------------------------------------------------------------------------
// Area-weighted overlay helpers (m^2)
export function intersectionArea(a, b) {
  const ba = turf.bbox(a), bb = turf.bbox(b);
  if (ba[2] < bb[0] || bb[2] < ba[0] || ba[3] < bb[1] || bb[3] < ba[1]) return 0;
  const x = turf.intersect(turf.featureCollection([a, b]));
  return x ? turf.area(x) : 0;
}

export { turf };
