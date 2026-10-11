// Step 4: write data/geo/README.md from data/raw/manifest.json, the files in data/geo/ and
// data/geo/stats.json. Re-run after download/process/stats so counts, sizes and dates stay true.
//
// Usage: node readme.mjs

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { GEO, loadManifest } from './lib.mjs';

const manifest = loadManifest();
const stats = JSON.parse(readFileSync(path.join(GEO, 'stats.json'), 'utf8'));
const S = (k) => stats.stats[k];
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const day = (iso) => (iso ? iso.slice(0, 10) : 'n/a');
const count = (file) => JSON.parse(readFileSync(path.join(GEO, file), 'utf8')).features.length;

// Output file -> source layer(s), processing and properties
const OUT = [
  {
    file: 'grocery-stores.geojson', sources: ['grocery-stores', 'wards-2022', 'east-of-the-river'],
    processing: 'All 93 records kept (open and closed). Coordinates rounded to 5 decimals. `ward` = point-in-polygon against unsimplified 2022 wards; `east_of_river` = point-in-polygon against the official East of the River polygon. PRESENTyy "Yes"/"No" strings converted to booleans.',
    props: '`id` (OBJECTID), `name`, `address`, `zipcode`, `ward` (2022, computed), `ward_src` (dataset WARD attribute), `east_of_river`, `open_2026` (= PRESENT26 "Yes"), `present_2022` ... `present_2026`, `notes`, `mar_id`. **Filter on `open_2026` to show only operating stores.**',
  },
  {
    file: 'low-food-access.geojson', sources: ['low-food-access', 'wards-2022', 'east-of-the-river'],
    processing: 'mapshaper `-simplify visvalingam weighted interval=5 keep-shapes`, 5-decimal precision. `ward` = 2022 ward holding the largest share of the polygon area (turf.intersect on unsimplified geometry), `ward_share` = that share; `east_of_river` = more than 50% of the polygon area inside the East of the River polygon.',
    props: '`gis_id`, `ward` (2022, computed), `ward_share`, `ward_src` (dataset WARD attribute, pre-2022 lines), `east_of_river`, `PARTPOP2` (est. residents), `PRTOVR185` (est. residents above 185% FPL), `PRTUND185` (est. residents below 185% FPL = "food insecure" per dataset), `PERCENTUND185` (0-1 fraction), `area_km2`.',
  },
  {
    file: 'farmers-markets.geojson', sources: ['farmers-markets', 'wards-2022', 'east-of-the-river'],
    processing: 'All 64 records kept, including 14 Maryland markets (`in_dc` = false, `ward` = null). Ward/east_of_river as for grocery stores.',
    props: '`id`, `name`, `address`, `city`, `state`, `zipcode`, `in_dc`, `ward`, `ward_src`, `east_of_river`, `days`, `times`, `season_start`, `season_end`, `benefits` (SNAP/WIC/Produce Plus...), `website`, `location_description`.',
  },
  {
    file: 'healthy-corners.geojson', sources: ['healthy-corners', 'wards-2022', 'east-of-the-river'],
    processing: 'All records kept. Ward/east_of_river as for grocery stores. "x" flags converted to booleans.',
    props: '`id`, `name`, `address`, `zipcode` (often null in source), `ward`, `ward_src`, `east_of_river`, `snap_match`, `wic_vendor`, `mar_id`.',
  },
  {
    file: 'wards.geojson', sources: ['wards-2022'],
    processing: 'mapshaper simplify interval=5 m, keep-shapes, 5-decimal precision.',
    props: '`ward` (1-8), `name`, `label`.',
  },
  {
    file: 'dc-boundary.geojson', sources: ['dc-boundary'],
    processing: 'mapshaper simplify interval=5 m, keep-shapes, 5-decimal precision.',
    props: '`name`, `gis_id`.',
  },
  {
    file: 'east-of-river.geojson', sources: ['east-of-the-river'],
    processing: 'Official DC GIS "East of the River" polygon, simplified (interval=5 m). Used for shading the focus area. Note it extends to mid-river, so it contains water.',
    props: '`name`, `gis_id`.',
  },
  {
    file: 'water.geojson', sources: ['waterbodies'],
    processing: 'Kept DESCRIPTION = River (71) and Lake (6) plus Ponds of at least 2,000 m2; dropped Wastewater Holding Ponds (Blue Plains) and small ponds. Simplified interval=5 m, keep-shapes. The source has no name field: the single large "River" polygon (OBJECTID 30) covers BOTH the Potomac and the Anacostia, so it is named "Potomac and Anacostia Rivers"; other features are unnamed streams/lakes/ponds.',
    props: '`kind` (river | lake | pond), `name` (only on the main river polygon), `objectid`.',
  },
  {
    file: 'zipcodes.geojson', sources: ['zipcodes'],
    processing: 'All 172 ZIP polygons kept: 26 TYPE = STANDARD delivery ZIPs plus 139 UNIQUE (single organisation/building, e.g. federal agencies) and 7 PO BOX ZIPs. The non-standard ZIPs are cut out of the standard ones (no overlap; checked), so dropping them would leave holes; filter on `type` = "STANDARD" for neighbourhood-level ZIP shading. Simplified interval=8 m.',
    props: '`zipcode`, `name`, `type` (STANDARD | UNIQUE | POST OFFICE BOX).',
  },
  {
    file: 'neighborhood-clusters.geojson', sources: ['neighborhood-clusters', 'wards-2022', 'east-of-the-river'],
    processing: 'Simplified interval=8 m. A guaranteed-interior label point (turf.pointOnFeature) is stored as `label_lon`/`label_lat`; ward and east_of_river are evaluated at that point.',
    props: '`name` ("Cluster n"), `nbh_names`, `type` (Original/Additional), `ward_at_label`, `east_of_river`, `label_lon`, `label_lat`.',
  },
  {
    file: 'neighborhoods.geojson', sources: ['neighborhood-labels', 'neighborhood-clusters', 'wards-2022', 'east-of-the-river'],
    processing: '132 Neighborhood Labels points (`kind` = "neighborhood") plus one label point per Neighborhood Cluster (`kind` = "cluster", 46). `aliases` are derived mechanically: LABEL_NAME if different, the parts of "/"-separated names, "Anacostia" for "Historic Anacostia", "Fort Davis" for "Fort Davis Park"; for clusters, each name in NBH_NAMES (the cluster point is only an approximate location for those names). Match `kind` = "neighborhood" first.',
    props: '`kind`, `name`, `label`, `aliases` ("|"-separated), `ward`, `east_of_river`, `cluster`, `source`.',
  },
  {
    file: 'intersections-w78.geojson', sources: ['intersections', 'wards-2022'],
    processing: 'Clipped to points inside 2022 Wards 7 and 8 (point-in-polygon, unsimplified wards). The source stores most intersections twice ("A AND B" and "B AND A" at the same point); duplicates with the same rounded coordinate and the same street pair were collapsed. Other source fields dropped.',
    props: '`name` (e.g. "MINNESOTA AVENUE NE AND BENNING ROAD NE"), `street1`, `street2` (full names incl. type and quadrant, upper case), `ward` (7|8), `type` (only present when not REGULAR: RAMP, ALLEY, OVERPASS, UNDERPASS). Note: there is no "GOOD HOPE ROAD SE AND MARTIN LUTHER KING JR AVENUE SE" point; the Historic Anacostia crossroads is "MARION BARRY AVENUE SE AND MARTIN LUTHER KING JR AVENUE SE" (that stretch of Good Hope Rd now carries the Marion Barry Ave name), so the chat should alias Good Hope Rd to Marion Barry Ave there. Street names are upper case with full type words (AVENUE, ROAD, STREET) and quadrant, so normalise user input (Ave -> AVENUE, Rd -> ROAD, St -> STREET, add quadrant if missing).',
  },
  {
    file: 'bus-stops-w78.geojson', sources: ['bus-stops', 'wards-2022'],
    processing: 'Clipped to stops inside 2022 Wards 7 and 8. Source reflects WMATA\'s Better Bus network (launched 29 June 2025).',
    props: '`id` (WMATA REG_ID), `name` (stop message text), `on_street`, `at_street`, `ward`.',
  },
];

const files = readdirSync(GEO).filter((f) => f.endsWith('.geojson'));
const total = readdirSync(GEO).reduce((s, f) => s + statSync(path.join(GEO, f)).size, 0);
const totalGeojson = files.reduce((s, f) => s + statSync(path.join(GEO, f)).size, 0);

let md = `# Map layers for the DC food-access app (\`data/geo/\`)

Render-ready GeoJSON for MapLibre GL JS, focused on Wards 7 and 8 (east of the Anacostia River).
All files are **WGS84 / EPSG:4326** (longitude, latitude), coordinates rounded to **5 decimals** (~1 m).
Generated ${stats.generated_at} (UTC) by the pipeline in \`scripts/geo/\`.

- GeoJSON total: **${kb(totalGeojson)}** (${files.length} files); whole folder incl. stats.json and this README: ${kb(total)}.
- Headline numbers: \`stats.json\` (each stat has \`value\`, \`method\`, \`dataset\`, \`dataset_last_updated\`).
- Raw downloads (untouched, all attributes): \`data/raw/*.geojson\`, with ArcGIS layer metadata (\`*.layer.json\`), Open Data DC Hub metadata (\`*.hub.json\`) and \`manifest.json\`.

## Rebuild

\`\`\`bash
cd "scripts/geo"
npm install          # mapshaper + @turf/turf (local to scripts/geo)
npm run all          # download.mjs -> process.mjs -> stats.mjs -> readme.mjs
# or, to rebuild from the existing data/raw without re-downloading:
node process.mjs && node stats.mjs && node readme.mjs
\`\`\`

## Attribution (required, CC BY 4.0)

All layers come from **Open Data DC** (https://opendata.dc.gov), published by the District of Columbia
(Office of the Chief Technology Officer and the agencies named below). Every dataset used carries the licence
statement: *"This work is licensed under a Creative Commons Attribution 4.0 International License."*
(https://creativecommons.org/licenses/by/4.0/).

Suggested on-map / credits text:

> Data: Open Data DC (District of Columbia), CC BY 4.0. Layers simplified, clipped and re-attributed by the project team; changes were made.

## Layers

| File | Features | Size | Source dataset (Open Data DC) | Source "last updated" |
|---|---:|---:|---|---|
`;
for (const o of OUT) {
  const p = path.join(GEO, o.file);
  const m = manifest.layers[o.sources[0]];
  md += `| \`${o.file}\` | ${count(o.file)} | ${kb(statSync(p).size)} | [${m.title}](${m.page_url}) | ${day(m.hub_modified)} |\n`;
}
md += `\nAuxiliary sources used for computed fields: [${manifest.layers['wards-2022'].title}](${manifest.layers['wards-2022'].page_url}), [${manifest.layers['east-of-the-river'].title}](${manifest.layers['east-of-the-river'].page_url}).\n`;

md += `\n### What "last updated" means\n
Dates come from the Open Data DC (ArcGIS Hub v3) metadata for each dataset: \`modified\` is the date the Hub shows as
"Updated"; its provenance is either the dataset metadata revision date (\`reviseDate\`) or, where that is missing, the
item's modified timestamp. "Info updated" is the Hub item's own modified timestamp. The DC GIS MapServer layers do not
publish an \`editingInfo\` edit date. **The Low Food Access Areas content is from November 2017** (stated in its
description) even though its Hub item was touched in 2023.\n`;

md += `\n## Source datasets in detail\n`;
for (const [key, m] of Object.entries(manifest.layers)) {
  const outs = OUT.filter((o) => o.sources[0] === key).map((o) => `\`${o.file}\``);
  md += `
### ${m.title}  (\`data/raw/${key}.geojson\`)
- Open Data DC page: ${m.page_url}  (also ${m.page_url_by_id})
- REST layer: ${m.rest_layer_url}
- Download used: \`${m.download_url}\` (paged with \`resultOffset\` = 0, ${m.page_size}, ...; ${Math.ceil(m.feature_count / m.page_size)} page(s))
- Hub GeoJSON alternative: ${m.hub_geojson_download_url}
- Last updated (Hub): **${day(m.hub_modified)}** (${m.hub_modified_provenance}); Hub item info updated ${day(m.hub_item_modified)}; downloaded ${m.downloaded_at}
- Publisher/source: ${m.source}; licence: ${m.license_name ?? m.license} (${m.license_url ?? 'https://creativecommons.org/licenses/by/4.0/'})
- Raw feature count: **${m.feature_count}** (service count ${m.service_reported_count}, Hub recordCount ${m.hub_record_count})
- Used for: ${outs.length ? outs.join(', ') : key === 'east-of-the-river' ? '`east-of-river.geojson` and every `east_of_river` flag' : key === 'wards-2022' ? '`wards.geojson` and every `ward` field' : 'computed fields'}
`;
}

md += `\n## Output layers: processing and properties\n`;
for (const o of OUT) {
  md += `\n### \`${o.file}\` (${count(o.file)} features, ${kb(statSync(path.join(GEO, o.file)).size)})\n- Processing: ${o.processing}\n- Properties: ${o.props}\n`;
}

const agree = S('east_of_river_method_agreement').value;
md += `
## How "east of the river" is decided

1. **Primary (used for every \`east_of_river\` flag and stat):** point-in-polygon against the official DC GIS
   ["East of the River"](${manifest.layers['east-of-the-river'].page_url}) polygon (Office of the Deputy Mayor for Planning
   and Economic Development; "boundaries in DC east of the Anacostia River"). It is the District's own definition, so it is the
   most defensible choice, and it is independent of ward lines (Ward 7 includes Kingman Park and the RFK campus west of the river; since
   2022 Ward 8 includes Navy Yard/Capitol Riverfront west of the river).
2. **Independent check:** DC boundary minus the main Waterbodies "River" polygon (buffered 5 m to close hairline gaps), keeping
   the land piece that contains a seed point at Frederick Douglass NHS. ${(agree.derived_inside_official_share * 100).toFixed(2)}% of that derived land
   (${agree.derived_land_polygon_km2} km2) lies inside the official polygon (${agree.official_polygon_km2} km2; the rest of the
   official polygon is mostly river water to mid-channel).
3. **Coarse check:** Neighborhood Clusters 28-39, 43 (Saint Elizabeths) and 44 (JBAB).

Point-level disagreements between the methods (method 3 is skipped for points in cluster 46, which straddles the river):
grocery stores ${S('grocery_east_method_disagreements').value.length}, healthy corner stores ${S('healthy_corners_east_method_disagreements').value.length},
DC farmers markets ${S('farmers_markets_east_method_disagreements').value.length} (details in \`*_east_method_disagreements\` in stats.json).

## Known data caveats

- **Grocery Store Locations** contains closed stores. Use \`open_2026\` (PRESENT26 = "Yes"): ${S('grocery_open_2026_total').value} of ${S('grocery_records_total').value} records.
  The dataset WARD attribute is wrong for at least one store (${S('grocery_ward_attribute_mismatches').value.map((x) => `${x.name}, ${x.address}: "${x.ward_in_dataset}", actually Ward ${x.ward_point_in_polygon}`).join('; ')}); use the computed \`ward\`.
  Lidl at Skyland Town Center (2224 Town Center Dr SE) **is** in the dataset. The Marion Barry Avenue Market (1303 Marion Barry Ave SE, opened Sept 2025) is **not**; whether it meets the full-service definition is unverified.
- **Low Food Access Areas** is a 2017 model (grocery stores and population of that time) — it predates Lidl Skyland (2022) and the openings/closures since, and uses pre-2022 ward lines. ${S('lfa_staleness_stores_inside_lfa').value} grocery records (including Lidl Skyland) sit inside LFA polygons (\`lfa_staleness_stores_inside_lfa\` in stats.json). Its two ward attributes (NAME, WARD) disagree on 55 polygons; use the computed \`ward\`.
- **Farmers markets** are mostly seasonal; the layer includes Maryland markets.
- **Healthy Corner Stores** last revised ${day(manifest.layers['healthy-corners'].hub_modified)}; DC Central Kitchen's live list may differ.
- **Neighborhood Labels** were last revised ${day(manifest.layers['neighborhood-labels'].hub_modified)}; names are informal, not official boundaries.
- **Geometry validity:** a handful of polygons (about a dozen in low-food-access, a few in zipcodes and water) fail turf's strict
  \`booleanValid\` check (turf reports touching/crossing points between parts of the same MultiPolygon); this is mostly
  inherited from the source (16 raw LFA MultiPolygons fail the same test).
  They drew correctly in a mapshaper SVG check and MapLibre fill layers generally tolerate this; all area statistics were
  computed on the raw, unsimplified geometry.
- **Ward 8 vs "east of the river":** since the 2022 redistricting Ward 8 also covers Navy Yard / Near Southeast west of the river
  (Neighborhood Labels "Navy Yard" and "Near Southeast" fall in Ward 8; "Buzzard Point" and "Southwest/Waterfront" fall in Ward 6).
  Ward 7 likewise includes Kingman Park / RFK west of the river. Do not use ward as a proxy for east of the river.

## Missing layers

None. Every requested layer was found on Open Data DC and downloaded in full (feature counts match the service counts). Street
intersections exist as a published layer (Intersection Points), so no derivation from street centerlines was needed.
`;

writeFileSync(path.join(GEO, 'README.md'), md);
console.log('wrote README.md');
