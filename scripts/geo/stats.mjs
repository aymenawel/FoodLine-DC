// Step 3: compute headline numbers -> data/geo/stats.json
//
// Usage: node stats.mjs
//
// All spatial calculations use the unsimplified raw layers in data/raw/ (not the simplified
// render layers). Every stat records value, method, dataset and dataset_last_updated.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  GEO, loadRaw, loadManifest, clean, turf,
  wardOf, wards, isEastOfficial, isEastDerived, isEastByCluster, clusterOf,
  eorFeature, derivedEastFeature, intersectionArea, EAST_SEED, EAST_CLUSTERS,
} from './lib.mjs';

const manifest = loadManifest();
const M = (k) => manifest.layers[k];
const yes = (v) => String(v ?? '').trim().toLowerCase() === 'yes';
const pt = (f) => turf.point(f.geometry.coordinates);
const r = (n, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
const WARDS = [1, 2, 3, 4, 5, 6, 7, 8];
const zeroWards = () => Object.fromEntries(WARDS.map((w) => [w, 0]));

function ds(key, extra = {}) {
  const m = M(key);
  return {
    dataset: m.title,
    dataset_page: m.page_url,
    dataset_last_updated: m.hub_modified,
    dataset_last_updated_source: `Open Data DC Hub 'modified' (${m.hub_modified_provenance ?? 'item'})`,
    ...extra,
  };
}

const stats = {};
const add = (id, obj) => { stats[id] = obj; };

// ------------------------------------------------------------------ east-of-river method check
const eor = eorFeature();
const derived = derivedEastFeature();
const eorArea = turf.area(eor);
const derArea = turf.area(derived.feature);
const inter = intersectionArea(eor, derived.feature);
const derivedOutsideOfficial = derArea - inter;
add('east_of_river_method_agreement', {
  value: {
    official_polygon_km2: r(eorArea / 1e6, 3),
    derived_land_polygon_km2: r(derArea / 1e6, 3),
    derived_inside_official_share: r(inter / derArea, 4),
    derived_outside_official_km2: r(derivedOutsideOfficial / 1e6, 3),
    note: 'The official polygon also contains ~8.9 km2 of Anacostia/Potomac water (it runs to mid-river); the derived polygon is land only, so the area difference is mostly water.',
  },
  method: `Primary classification = point-in-polygon against the official DC GIS 'East of the River' polygon. Independent check = DC boundary minus the main Waterbodies 'River' polygon (OBJECTID ${derived.mainRiverObjectId}, ${r(derived.mainRiverAreaKm2, 2)} km2, covers both the Potomac and Anacostia) buffered 5 m, keeping the land component containing a seed point at Frederick Douglass NHS (${EAST_SEED.join(', ')}). Third coarse check = Neighborhood Clusters ${[...EAST_CLUSTERS].join(', ')}.`,
  ...ds('east-of-the-river'),
  other_datasets: [M('waterbodies').title, M('dc-boundary').title, M('neighborhood-clusters').title],
});

function eastChecks(features, nameOf) {
  const disagreements = [];
  for (const f of features) {
    const P = pt(f);
    const a = isEastOfficial(P), b = isEastDerived(P), c = isEastByCluster(P);
    if (a !== b || (c !== 'unresolved' && c !== null && c !== a)) {
      disagreements.push({ name: nameOf(f), official: a, derived: b, cluster_method: c, cluster: clusterOf(P) });
    }
  }
  return disagreements;
}

// ------------------------------------------------------------------ grocery stores
const groc = loadRaw('grocery-stores').features.filter((f) => f.geometry);
const G = groc.map((f) => {
  const p = f.properties;
  const P = pt(f);
  return {
    id: p.OBJECTID,
    name: clean(p.STORENAME),
    address: clean(p.ADDRESS),
    zipcode: clean(p.ZIPCODE),
    ward: wardOf(P),
    ward_in_dataset: clean(p.WARD),
    east_of_river: isEastOfficial(P),
    open_2026: yes(p.PRESENT26),
    present: { 2022: yes(p.PRESENT22), 2023: yes(p.PRESENT23), 2024: yes(p.PRESENT24), 2025: yes(p.PRESENT25), 2026: yes(p.PRESENT26) },
    notes: clean(p.NOTES),
    lon: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  };
});
const groceryDs = ds('grocery-stores', {
  dataset_note: 'Dataset lists currently operating stores plus some recently closed ones; PRESENTyy = "Yes" marks stores operating in that calendar year. Stores follow the ABCA full-service grocery store definition (see dataset description).',
});
const open = G.filter((g) => g.open_2026);
const byWard = (list) => { const o = zeroWards(); for (const g of list) if (g.ward) o[g.ward]++; return o; };
const brief = (g) => ({ id: g.id, name: g.name, address: g.address, ward: g.ward, east_of_river: g.east_of_river, open_2026: g.open_2026, years_present_2022_2026: Object.entries(g.present).filter(([, v]) => v).map(([y]) => Number(y)), notes: g.notes });

add('grocery_records_total', {
  value: G.length,
  method: 'Count of all features in the Grocery Store Locations layer (includes stores flagged as closed).',
  ...groceryDs,
});
add('grocery_open_2026_total', {
  value: open.length,
  method: 'Count of features with PRESENT26 = "Yes" (operating in 2026 per the dataset). This is the headline "full-service grocery stores in DC" number.',
  ...groceryDs,
});
add('grocery_open_2026_by_ward', {
  value: byWard(open),
  method: 'PRESENT26 = "Yes" stores, ward assigned by point-in-polygon against the official 2022 ward polygons (Wards from 2022), not the dataset WARD attribute.',
  ...groceryDs,
  other_datasets: [M('wards-2022').title],
});
add('grocery_all_records_by_ward', {
  value: byWard(G),
  method: 'All 93 records (open + closed), ward by point-in-polygon against 2022 wards.',
  ...groceryDs,
});
add('grocery_open_2022_by_ward', {
  value: byWard(G.filter((g) => g.present[2022])),
  method: 'PRESENT22 = "Yes" stores (operating in 2022), ward by point-in-polygon against 2022 wards. For trend context.',
  ...groceryDs,
});
const eastOpen = open.filter((g) => g.east_of_river);
add('grocery_open_2026_east_of_river', {
  value: eastOpen.length,
  stores: eastOpen.map(brief),
  method: 'PRESENT26 = "Yes" stores inside the official DC GIS "East of the River" polygon (cross-checked against a river-derived polygon and Neighborhood Clusters; see east_of_river_method_agreement and grocery_east_method_disagreements).',
  ...groceryDs,
  other_datasets: [M('east-of-the-river').title],
});
add('grocery_all_records_east_of_river', {
  value: G.filter((g) => g.east_of_river).length,
  stores: G.filter((g) => g.east_of_river).map(brief),
  method: 'All records (open and closed) inside the official East of the River polygon.',
  ...groceryDs,
});
add('grocery_open_2022_east_of_river', {
  value: G.filter((g) => g.east_of_river && g.present[2022]).length,
  method: 'PRESENT22 = "Yes" stores inside the East of the River polygon (trend context).',
  ...groceryDs,
});
add('grocery_open_2026_west_of_river', {
  value: open.length - eastOpen.length,
  method: 'grocery_open_2026_total minus grocery_open_2026_east_of_river.',
  ...groceryDs,
});
const w8 = G.filter((g) => g.ward === 8);
add('grocery_ward8_stores', {
  value: { all_records: w8.length, open_2026: w8.filter((g) => g.open_2026).length, open_2026_east_of_river: w8.filter((g) => g.open_2026 && g.east_of_river).length, open_2026_west_of_river: w8.filter((g) => g.open_2026 && !g.east_of_river).length },
  stores: w8.map(brief),
  method: 'Records whose point falls in the 2022 Ward 8 polygon, split by the East of the River polygon. Post-2022 Ward 8 includes Navy Yard / Capitol Riverfront west of the Anacostia.',
  ...groceryDs,
});
const w7 = G.filter((g) => g.ward === 7);
add('grocery_ward7_stores', {
  value: { all_records: w7.length, open_2026: w7.filter((g) => g.open_2026).length, open_2026_east_of_river: w7.filter((g) => g.open_2026 && g.east_of_river).length, open_2026_west_of_river: w7.filter((g) => g.open_2026 && !g.east_of_river).length },
  stores: w7.map(brief),
  method: 'Records whose point falls in the 2022 Ward 7 polygon, split by the East of the River polygon.',
  ...groceryDs,
});
add('grocery_ward_attribute_mismatches', {
  value: G.filter((g) => Number(String(g.ward_in_dataset ?? '').replace(/\D+/g, '')) !== g.ward).map((g) => ({ id: g.id, name: g.name, address: g.address, ward_in_dataset: g.ward_in_dataset, ward_point_in_polygon: g.ward })),
  method: 'Records whose WARD attribute differs from the ward computed by point-in-polygon (2022 wards).',
  ...groceryDs,
});
add('grocery_closed_records', {
  value: G.filter((g) => !g.open_2026).map(brief),
  method: 'Records with PRESENT26 not "Yes" (closed or not operating in 2026 per the dataset).',
  ...groceryDs,
});
add('grocery_east_method_disagreements', {
  value: eastChecks(groc, (f) => `${clean(f.properties.STORENAME)} (${clean(f.properties.ADDRESS)})`),
  method: 'Grocery points where the official polygon, the river-derived polygon and the Neighborhood Cluster method disagree (empty = all agree).',
  ...groceryDs,
});

// Currency spot-checks of the grocery layer against outside reporting (checked 2026-10-10).
// These are NOT used to edit the data; they only flag possible staleness.
const EXTERNAL_CHECKS = [
  {
    store: 'Lidl, Skyland Town Center',
    reported: 'Opened late September 2022 (ribbon cutting 27 Sep 2022) at 2224 Town Center Dr SE, Ward 7.',
    sources: [
      'https://mayor.dc.gov/release/mayor-bowser-celebrates-grand-opening-dc%E2%80%99s-first-lidl-food-market',
      'https://www.nbcwashington.com/news/local/dcs-first-lidl-grocery-store-opens-in-southeast/3167908/',
    ],
    match: (g) => /lidl/i.test(g.name) && /TOWN CENTER/i.test(g.address ?? ''),
  },
  {
    store: 'Marion Barry Avenue Market and Cafe (Dreaming Out Loud), Anacostia',
    reported: 'Opened 27 Sep 2025 at 1303 Marion Barry Ave SE, Ward 8; ~4,770 sq ft grocery/food hub. Press describes it as a fresh-food access point; whether it meets the ABCA full-service definition is not established.',
    sources: ['https://washingtonian.com/2025/10/10/new-anacostia-market-is-a-dream-come-true-for-community/'],
    match: (g) => /MARION BARRY/i.test(g.address ?? '') || /marion barry/i.test(g.name ?? ''),
  },
];
add('grocery_dataset_currency_checks', {
  value: EXTERNAL_CHECKS.map(({ match, ...c }) => {
    const hits = G.filter(match);
    return { ...c, in_dataset: hits.length > 0, dataset_records: hits.map(brief) };
  }),
  method: 'Name/address search of the grocery layer for stores reported in the press. Outside sources were read on 2026-10-10; the dataset was not modified.',
  ...groceryDs,
});

// ------------------------------------------------------------------ healthy corners & farmers markets
const hc = loadRaw('healthy-corners').features.filter((f) => f.geometry);
const hcInfo = hc.map((f) => ({ name: clean(f.properties.STORE), address: clean(f.properties.ADDRESS), ward: wardOf(pt(f)), east_of_river: isEastOfficial(pt(f)) }));
add('healthy_corners_total', { value: hc.length, method: 'Count of all Healthy Corner Stores features (DC Central Kitchen program participants as compiled by DC Office of Planning).', ...ds('healthy-corners') });
add('healthy_corners_by_ward', { value: byWard(hcInfo), method: 'Point-in-polygon against 2022 wards.', ...ds('healthy-corners') });
add('healthy_corners_east_of_river', { value: hcInfo.filter((s) => s.east_of_river).length, method: 'Point-in-polygon against the official East of the River polygon.', ...ds('healthy-corners') });
add('healthy_corners_east_method_disagreements', { value: eastChecks(hc, (f) => clean(f.properties.STORE)), method: 'As grocery_east_method_disagreements.', ...ds('healthy-corners') });

const fm = loadRaw('farmers-markets').features.filter((f) => f.geometry);
const fmInfo = fm.map((f) => ({ name: clean(f.properties.NAME), address: clean(f.properties.ADDRESS), ward: wardOf(pt(f)), east_of_river: isEastOfficial(pt(f)), days: clean(f.properties.DAYS), season: [clean(f.properties.STARTDATE), clean(f.properties.ENDDATE)].filter(Boolean).join(' - ') }));
const fmDc = fmInfo.filter((m) => m.ward != null);
add('farmers_markets_total_records', { value: fm.length, method: 'All features (dataset also lists markets in Montgomery and Prince George\'s counties, MD).', ...ds('farmers-markets') });
add('farmers_markets_in_dc', { value: fmDc.length, method: 'Markets whose point falls inside a 2022 DC ward polygon.', ...ds('farmers-markets') });
add('farmers_markets_by_ward', { value: byWard(fmDc), method: 'Point-in-polygon against 2022 wards.', ...ds('farmers-markets') });
add('farmers_markets_east_of_river', { value: fmInfo.filter((m) => m.east_of_river).length, markets: fmInfo.filter((m) => m.east_of_river), method: 'Point-in-polygon against the official East of the River polygon. Most are seasonal (see days/season).', ...ds('farmers-markets') });
add('farmers_markets_east_method_disagreements', { value: eastChecks(fm.filter((f) => wardOf(pt(f)) != null), (f) => clean(f.properties.NAME)), method: 'As grocery_east_method_disagreements (DC markets only).', ...ds('farmers-markets') });

// ------------------------------------------------------------------ low food access areas
const lfa = loadRaw('low-food-access').features;
const lfaDs = ds('low-food-access', {
  dataset_content_vintage: 'November 2017 (dataset description: "Last updated November 2017"); population from Census tract estimates of that period; grocery stores as of 2017.',
});
const sum = (k) => lfa.reduce((s, f) => s + (Number(f.properties[k]) || 0), 0);
const totPop = sum('PARTPOP2'), totUnd = sum('PRTUND185'), totOver = sum('PRTOVR185');
add('lfa_population_total', {
  value: { PARTPOP2: totPop, PRTUND185: totUnd, PRTOVR185: totOver, share_under_185pct_fpl: r(totUnd / totPop, 4) },
  method: 'Sum over all 381 Low Food Access Area polygons of PARTPOP2 (estimated residents), PRTUND185 (estimated residents below 185% of the federal poverty line = the dataset\'s "food insecure" population) and PRTOVR185. Polygons were checked for overlap (none found), so the sums do not double count.',
  ...lfaDs,
});
const groupBy = (fn) => {
  const o = {};
  for (const f of lfa) {
    const w = fn(f.properties);
    o[w] ??= { polygons: 0, PARTPOP2: 0, PRTUND185: 0 };
    o[w].polygons++; o[w].PARTPOP2 += f.properties.PARTPOP2 || 0; o[w].PRTUND185 += f.properties.PRTUND185 || 0;
  }
  return o;
};
const nameWardMismatch = lfa.filter((f) => f.properties.NAME !== `Ward ${f.properties.WARD}`).length;
add('lfa_population_by_ward_dataset_fields', {
  value: {
    by_WARD_attribute: groupBy((p) => p.WARD),
    by_NAME_attribute: groupBy((p) => String(p.NAME).replace(/\D+/g, '')),
  },
  method: `Plain sums grouped by the dataset's own attributes (no geometry). The dataset has two ward attributes that disagree on ${nameWardMismatch} of ${lfa.length} polygons: NAME ("Ward n") and WARD (number). Both predate the 2022 redistricting (layer built 2017). For current ward figures use lfa_population_by_ward_2022 (area-weighted overlay); NAME agrees with the 2022 overlay's majority ward far more often than WARD does (see lfa_ward_attribute_check).`,
  ...lfaDs,
});

// Area-weighted apportionment to 2022 wards and to East of the River
const wardAgg = Object.fromEntries(WARDS.map((w) => [w, { area_m2: 0, PARTPOP2: 0, PRTUND185: 0 }]));
const eastAgg = { area_m2: 0, PARTPOP2: 0, PRTUND185: 0 };
let totalArea = 0, unassignedArea = 0;
const wardFeatures = wards().map(({ f }) => f);
let majWARD = 0, majNAME = 0;
for (const f of lfa) {
  const a = turf.area(f);
  totalArea += a;
  let assigned = 0;
  let best = null, bestX = 0;
  for (const w of wardFeatures) {
    const x = intersectionArea(f, w);
    if (!x) continue;
    if (x > bestX) { bestX = x; best = Number(w.properties.WARD); }
    const share = x / a;
    const k = Number(w.properties.WARD);
    wardAgg[k].area_m2 += x;
    wardAgg[k].PARTPOP2 += share * (f.properties.PARTPOP2 || 0);
    wardAgg[k].PRTUND185 += share * (f.properties.PRTUND185 || 0);
    assigned += x;
  }
  unassignedArea += Math.max(0, a - assigned);
  if (Number(f.properties.WARD) === best) majWARD++;
  if (f.properties.NAME === `Ward ${best}`) majNAME++;
  const xe = intersectionArea(f, eor);
  if (xe) {
    const share = xe / a;
    eastAgg.area_m2 += xe;
    eastAgg.PARTPOP2 += share * (f.properties.PARTPOP2 || 0);
    eastAgg.PRTUND185 += share * (f.properties.PRTUND185 || 0);
  }
}
const wardOut = Object.fromEntries(WARDS.map((w) => [w, {
  area_km2: r(wardAgg[w].area_m2 / 1e6, 3),
  area_share_of_dc_lfa: r(wardAgg[w].area_m2 / totalArea, 4),
  PARTPOP2: r(wardAgg[w].PARTPOP2),
  PRTUND185: r(wardAgg[w].PRTUND185),
  share_under_185pct_fpl: wardAgg[w].PARTPOP2 ? r(wardAgg[w].PRTUND185 / wardAgg[w].PARTPOP2, 4) : null,
}]));
add('lfa_ward_attribute_check', {
  value: { polygons: lfa.length, WARD_equals_2022_majority_ward: majWARD, NAME_equals_2022_majority_ward: majNAME },
  method: 'For each LFA polygon, the 2022 ward holding the largest share of its area was compared with the dataset WARD and NAME attributes.',
  ...lfaDs,
});
const apportionMethod ='Each LFA polygon was intersected with the unsimplified 2022 ward polygons (turf.intersect); its PARTPOP2 and PRTUND185 were allocated in proportion to the share of its area in each ward (assumes even population spread within the polygon, the same assumption the dataset itself uses). Values are estimates, rounded to whole people.';
add('lfa_population_by_ward_2022', { value: wardOut, method: apportionMethod, ...lfaDs, other_datasets: [M('wards-2022').title] });
add('lfa_population_wards_7_8', {
  value: {
    PARTPOP2: r(wardAgg[7].PARTPOP2 + wardAgg[8].PARTPOP2),
    PRTUND185: r(wardAgg[7].PRTUND185 + wardAgg[8].PRTUND185),
    share_of_dc_lfa_population: r((wardAgg[7].PARTPOP2 + wardAgg[8].PARTPOP2) / totPop, 4),
    share_of_dc_lfa_under_185pct_fpl: r((wardAgg[7].PRTUND185 + wardAgg[8].PRTUND185) / totUnd, 4),
  },
  method: apportionMethod,
  ...lfaDs,
});
add('lfa_population_east_of_river', {
  value: {
    PARTPOP2: r(eastAgg.PARTPOP2),
    PRTUND185: r(eastAgg.PRTUND185),
    share_of_dc_lfa_population: r(eastAgg.PARTPOP2 / totPop, 4),
    share_of_dc_lfa_under_185pct_fpl: r(eastAgg.PRTUND185 / totUnd, 4),
    share_under_185pct_fpl: r(eastAgg.PRTUND185 / eastAgg.PARTPOP2, 4),
  },
  method: apportionMethod.replace('2022 ward polygons', 'official East of the River polygon'),
  ...lfaDs,
  other_datasets: [M('east-of-the-river').title],
});
add('lfa_area_total', {
  value: { km2: r(totalArea / 1e6, 3), area_not_in_any_2022_ward_km2: r(unassignedArea / 1e6, 4) },
  method: 'Geodesic area (turf.area) of the unsimplified LFA polygons; second number is a coverage check.',
  ...lfaDs,
});
add('lfa_area_share_wards_7_8', {
  value: r((wardAgg[7].area_m2 + wardAgg[8].area_m2) / totalArea, 4),
  detail: { ward7_share: r(wardAgg[7].area_m2 / totalArea, 4), ward8_share: r(wardAgg[8].area_m2 / totalArea, 4), wards_7_8_km2: r((wardAgg[7].area_m2 + wardAgg[8].area_m2) / 1e6, 3), dc_lfa_km2: r(totalArea / 1e6, 3) },
  method: 'Area of (LFA polygons intersect 2022 Ward 7 or Ward 8) / total LFA area, computed with turf on unsimplified geometry.',
  ...lfaDs,
  other_datasets: [M('wards-2022').title],
});
add('lfa_area_share_east_of_river', {
  value: r(eastAgg.area_m2 / totalArea, 4),
  detail: { east_km2: r(eastAgg.area_m2 / 1e6, 3), dc_lfa_km2: r(totalArea / 1e6, 3) },
  method: 'Area of (LFA polygons intersect official East of the River polygon) / total LFA area (turf, unsimplified).',
  ...lfaDs,
  other_datasets: [M('east-of-the-river').title],
});

// Staleness signal: grocery stores whose own location lies inside a "low food access" polygon.
// A store's location cannot be more than a 10-minute walk from itself, so any such store
// post-dates (or was not in) the 2017 model.
{
  const inside = [];
  for (const f of groc) {
    const P = pt(f);
    if (lfa.some((a) => turf.booleanPointInPolygon(P, a))) {
      const g = G.find((x) => x.id === f.properties.OBJECTID);
      inside.push(brief(g));
    }
  }
  add('lfa_staleness_stores_inside_lfa', {
    value: inside.length,
    stores: inside,
    method: 'Grocery records (any status) whose point falls inside a Low Food Access Area polygon. Because the LFA layer defines areas >10 minutes walk from a full-service grocery store, a store located inside one was not among the stores used by the Nov 2017 model (it opened later, closed earlier, or was not counted then). Not an error list by itself: check each store against its PRESENTyy history.',
    ...lfaDs,
    other_datasets: [M('grocery-stores').title],
  });
}

// Context: how much of DC do Wards 7/8 and East of the River cover?
const dc = loadRaw('dc-boundary').features[0];
const dcArea = turf.area(dc);
const wardAreas = Object.fromEntries(wardFeatures.map((w) => [Number(w.properties.WARD), turf.area(w)]));
add('context_area_shares', {
  value: {
    dc_km2_incl_water: r(dcArea / 1e6, 3),
    wards_7_8_share_of_dc_area: r((wardAreas[7] + wardAreas[8]) / dcArea, 4),
    east_of_river_share_of_dc_area: r(eorArea / dcArea, 4),
    lfa_share_of_ward7_area: r(wardAgg[7].area_m2 / wardAreas[7], 4),
    lfa_share_of_ward8_area: r(wardAgg[8].area_m2 / wardAreas[8], 4),
    lfa_share_of_east_of_river_area: r(eastAgg.area_m2 / eorArea, 4),
    lfa_share_of_dc_area: r(totalArea / dcArea, 4),
  },
  method: 'Geodesic areas (turf.area) of the DC boundary, 2022 wards, East of the River polygon and LFA overlaps. Areas include river water, so land-only shares would be somewhat higher.',
  ...ds('dc-boundary'),
  other_datasets: [M('wards-2022').title, M('east-of-the-river').title, M('low-food-access').title],
});

// ------------------------------------------------------------------ output
const out = {
  generated_at: new Date().toISOString(),
  generated_by: 'scripts/geo/stats.mjs',
  license: 'Source data: Open Data DC, Creative Commons Attribution 4.0 International (CC BY 4.0).',
  datasets: Object.fromEntries(Object.entries(manifest.layers).map(([k, m]) => [k, {
    title: m.title, page_url: m.page_url, rest_layer_url: m.rest_layer_url, feature_count: m.feature_count,
    last_updated: m.hub_modified, last_updated_source: m.hub_modified_provenance, item_info_updated: m.hub_item_modified, downloaded_at: m.downloaded_at,
  }])),
  stats,
};
await writeFile(path.join(GEO, 'stats.json'), JSON.stringify(out, null, 2));
console.log('wrote stats.json with', Object.keys(stats).length, 'stats');
