// Merge the two researched resource lists into data/resources.json (curated core,
// 30-50 entries for hand-checking) and data/resources-extended.json (everything else).
// Ward and east-of-river are recomputed from the 2022 ward polygons and DC GIS's
// "East of the River" polygon, and any disagreement with the researched ward is reported.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as turf from '@turf/turf';
import { NOTES, wardOf, isEastOfficial } from './lib.mjs';

const OUT = path.resolve(NOTES, '../../../data');
const load = (f) => JSON.parse(readFileSync(path.join(NOTES, f), 'utf8'));
const all = [...load('resources_stores_markets.json'), ...load('resources_free_food.json')];

const ids = new Set();
for (const r of all) {
  if (ids.has(r.id)) throw new Error(`duplicate id ${r.id}`);
  ids.add(r.id);
  const pt = turf.point([r.lng, r.lat]);
  const ward = wardOf(pt);
  if (r.ward != null && ward != null && r.ward !== ward) {
    console.warn(`ward mismatch ${r.id}: researched ${r.ward}, computed ${ward}`);
  }
  r.ward = ward;
  r.east_of_river = isEastOfficial(pt);
}

// Curated core: places a resident can act on with a known schedule.
// - every grocery store, farmers market and mobile market east of the river
// - every free site with weekly hours, plus the monthly CAFB mobile markets
// - 7 Healthy Corners stores, chosen by farthest-point sampling for geographic spread
// Excluded from core (kept in extended): Joyful Food Markets (school families, hours
// unpublished), monthly-only pantries, the rest of the corner stores, west-of-river stores.
const isCore = (r) =>
  r.east_of_river &&
  ((['grocery', 'farmers_market', 'mobile_market'].includes(r.type)) ||
    (r.free && r.hours && !r.id.startsWith('jfm-')) ||
    r.id === 'bread-for-the-city-southeast-free-farmers-market');

const core = all.filter(isCore);
const corners = all.filter((r) => r.type === 'corner_store' && r.east_of_river);
const picked = [];
const dist = (a, b) => turf.distance([a.lng, a.lat], [b.lng, b.lat]);
while (picked.length < 7 && corners.length) {
  let best = 0, bestD = -1;
  corners.forEach((c, i) => {
    const d = Math.min(...[...core, ...picked].map((p) => dist(c, p)));
    if (d > bestD) { bestD = d; best = i; }
  });
  picked.push(...corners.splice(best, 1));
}
const coreAll = [...core, ...picked];
const coreIds = new Set(coreAll.map((r) => r.id));
const extended = all.filter((r) => !coreIds.has(r.id));

const meta = (set, note) => ({
  generated_at: new Date().toISOString(),
  generated_by: 'scripts/geo/build-resources.mjs',
  note,
  count: set.length,
  resources: set,
});
writeFileSync(path.join(OUT, 'resources.json'), JSON.stringify(meta(coreAll,
  'Curated core directory for Wards 7 and 8 (east of the Anacostia). Every entry needs a human check before the event.'), null, 2));
writeFileSync(path.join(OUT, 'resources-extended.json'), JSON.stringify(meta(extended,
  'Additional researched entries not in the core list (Joyful Food Markets, monthly pantries, more corner stores, west-of-river stores).'), null, 2));

const tally = (set, k) => set.reduce((m, r) => ((m[r[k]] = (m[r[k]] || 0) + 1), m), {});
console.log('core', coreAll.length, tally(coreAll, 'type'), tally(coreAll, 'confidence'), 'wards', tally(coreAll, 'ward'));
console.log('extended', extended.length, tally(extended, 'type'));
console.log('corner picks', picked.map((r) => r.id).join(', '));
