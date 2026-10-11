# Map layers for the DC food-access app (`data/geo/`)

Render-ready GeoJSON for MapLibre GL JS, focused on Wards 7 and 8 (east of the Anacostia River).
All files are **WGS84 / EPSG:4326** (longitude, latitude), coordinates rounded to **5 decimals** (~1 m).
Generated 2026-10-11T01:50:24.518Z (UTC) by the pipeline in `scripts/geo/`.

- GeoJSON total: **1810.9 KB** (13 files); whole folder incl. stats.json and this README: 1898.1 KB.
- Headline numbers: `stats.json` (each stat has `value`, `method`, `dataset`, `dataset_last_updated`).
- Raw downloads (untouched, all attributes): `data/raw/*.geojson`, with ArcGIS layer metadata (`*.layer.json`), Open Data DC Hub metadata (`*.hub.json`) and `manifest.json`.

## Rebuild

```bash
cd "scripts/geo"
npm install          # mapshaper + @turf/turf (local to scripts/geo)
npm run all          # download.mjs -> process.mjs -> stats.mjs -> readme.mjs
# or, to rebuild from the existing data/raw without re-downloading:
node process.mjs && node stats.mjs && node readme.mjs
```

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
| `grocery-stores.geojson` | 93 | 34.7 KB | [Grocery Store Locations](https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations) | 2026-08-20 |
| `low-food-access.geojson` | 381 | 444.6 KB | [Low Food Access Areas](https://opendata.dc.gov/datasets/DCGIS::low-food-access-areas) | 2023-03-30 |
| `farmers-markets.geojson` | 64 | 33.2 KB | [Farmers Market Locations](https://opendata.dc.gov/datasets/DCGIS::farmers-market-locations) | 2026-09-27 |
| `healthy-corners.geojson` | 50 | 14.2 KB | [Healthy Corner Stores](https://opendata.dc.gov/datasets/DCGIS::healthy-corner-stores) | 2024-10-04 |
| `wards.geojson` | 8 | 47.1 KB | [Wards from 2022](https://opendata.dc.gov/datasets/DCGIS::wards-from-2022) | 2025-01-17 |
| `dc-boundary.geojson` | 1 | 14.5 KB | [Washington DC Administrative Boundary](https://opendata.dc.gov/datasets/DCGIS::washington-dc-administrative-boundary) | 2013-07-03 |
| `east-of-river.geojson` | 1 | 5.8 KB | [East of the River](https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1) | 2024-04-10 |
| `water.geojson` | 97 | 156.4 KB | [Waterbodies](https://opendata.dc.gov/datasets/DCGIS::waterbodies) | 2026-02-20 |
| `zipcodes.geojson` | 172 | 171.8 KB | [Zip Codes](https://opendata.dc.gov/datasets/DCGIS::zip-codes) | 2022-10-14 |
| `neighborhood-clusters.geojson` | 46 | 104.4 KB | [Neighborhood Clusters](https://opendata.dc.gov/datasets/DCGIS::neighborhood-clusters) | 2024-09-05 |
| `neighborhoods.geojson` | 178 | 49.7 KB | [Neighborhood Labels](https://opendata.dc.gov/datasets/DCGIS::neighborhood-labels) | 2019-05-03 |
| `intersections-w78.geojson` | 2732 | 567.4 KB | [Intersection Points](https://opendata.dc.gov/datasets/DCGIS::intersection-points) | 2026-10-10 |
| `bus-stops-w78.geojson` | 824 | 167.0 KB | [Metro Bus Stops](https://opendata.dc.gov/datasets/DCGIS::metro-bus-stops) | 2026-10-04 |

Auxiliary sources used for computed fields: [Wards from 2022](https://opendata.dc.gov/datasets/DCGIS::wards-from-2022), [East of the River](https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1).

### What "last updated" means

Dates come from the Open Data DC (ArcGIS Hub v3) metadata for each dataset: `modified` is the date the Hub shows as
"Updated"; its provenance is either the dataset metadata revision date (`reviseDate`) or, where that is missing, the
item's modified timestamp. "Info updated" is the Hub item's own modified timestamp. The DC GIS MapServer layers do not
publish an `editingInfo` edit date. **The Low Food Access Areas content is from November 2017** (stated in its
description) even though its Hub item was touched in 2023.

## Source datasets in detail

### Grocery Store Locations  (`data/raw/grocery-stores.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations  (also https://opendata.dc.gov/datasets/1d7c9d0e3aac49c1aa88d377a3bae430_4)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Business_Goods_and_Service_WebMercator/MapServer/4
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Business_Goods_and_Service_WebMercator/MapServer/4/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/1d7c9d0e3aac49c1aa88d377a3bae430/geojson?layers=4
- Last updated (Hub): **2026-08-20** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2026-08-24; downloaded 2026-10-11T01:26:38.230Z
- Publisher/source: Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **93** (service count 93, Hub recordCount 93)
- Used for: `grocery-stores.geojson`

### Low Food Access Areas  (`data/raw/low-food-access.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::low-food-access-areas  (also https://opendata.dc.gov/datasets/9b4355a8e1e345ea8350b77516163dd4_61)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/61
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/61/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/9b4355a8e1e345ea8350b77516163dd4/geojson?layers=61
- Last updated (Hub): **2023-03-30** (item.modified); Hub item info updated 2023-03-30; downloaded 2026-10-11T01:26:39.064Z
- Publisher/source: City of Washington, DC; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **381** (service count 381, Hub recordCount 381)
- Used for: `low-food-access.geojson`

### Farmers Market Locations  (`data/raw/farmers-markets.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::farmers-market-locations  (also https://opendata.dc.gov/datasets/f2e1c2ef9eb44f2899f4a310a80ecec9_2)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Business_Goods_and_Service_WebMercator/MapServer/2
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Business_Goods_and_Service_WebMercator/MapServer/2/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/f2e1c2ef9eb44f2899f4a310a80ecec9/geojson?layers=2
- Last updated (Hub): **2026-09-27** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2026-09-27; downloaded 2026-10-11T01:26:39.300Z
- Publisher/source: City of Washington, DC; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **64** (service count 64, Hub recordCount 64)
- Used for: `farmers-markets.geojson`

### Healthy Corner Stores  (`data/raw/healthy-corners.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::healthy-corner-stores  (also https://opendata.dc.gov/datasets/9a2df4a51ce646819d0dedfecb7f466a_57)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/57
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/57/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/9a2df4a51ce646819d0dedfecb7f466a/geojson?layers=57
- Last updated (Hub): **2024-10-04** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2024-10-07; downloaded 2026-10-11T01:26:39.517Z
- Publisher/source: City of Washington, DC; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **50** (service count 50, Hub recordCount 50)
- Used for: `healthy-corners.geojson`

### Wards from 2022  (`data/raw/wards-2022.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::wards-from-2022  (also https://opendata.dc.gov/datasets/c5cd8b40fb784548a6680aead5f919ed_53)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/53
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/53/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/c5cd8b40fb784548a6680aead5f919ed/geojson?layers=53
- Last updated (Hub): **2025-01-17** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2026-06-23; downloaded 2026-10-11T01:26:39.982Z
- Publisher/source: City of Washington, DC; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **8** (service count 8, Hub recordCount 8)
- Used for: `wards.geojson`

### Washington DC Administrative Boundary  (`data/raw/dc-boundary.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::washington-dc-administrative-boundary  (also https://opendata.dc.gov/datasets/7241f6d500b44288ad983f0942b39663_10)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/10
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/10/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/7241f6d500b44288ad983f0942b39663/geojson?layers=10
- Last updated (Hub): **2013-07-03** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2025-12-12; downloaded 2026-10-11T01:26:40.309Z
- Publisher/source: D.C. Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **1** (service count 1, Hub recordCount 1)
- Used for: `dc-boundary.geojson`

### Waterbodies  (`data/raw/waterbodies.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::waterbodies  (also https://opendata.dc.gov/datasets/db65ff0038ed4270acb1435d931201cf_24)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Environment_Water_WebMercator/MapServer/24
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Environment_Water_WebMercator/MapServer/24/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/db65ff0038ed4270acb1435d931201cf/geojson?layers=24
- Last updated (Hub): **2026-02-20** (item.modified); Hub item info updated 2026-02-20; downloaded 2026-10-11T01:26:41.684Z
- Publisher/source: Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **1293** (service count 1293, Hub recordCount 1293)
- Used for: `water.geojson`

### Zip Codes  (`data/raw/zipcodes.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::zip-codes  (also https://opendata.dc.gov/datasets/5637d4bb43a34668b19fe630120d2b70_4)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/FeatureServer/4
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/FeatureServer/4/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/5637d4bb43a34668b19fe630120d2b70/geojson?layers=4
- Last updated (Hub): **2022-10-14** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2025-06-04; downloaded 2026-10-11T01:26:43.545Z
- Publisher/source: US Postal Service; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **172** (service count 172, Hub recordCount 172)
- Used for: `zipcodes.geojson`

### Neighborhood Labels  (`data/raw/neighborhood-labels.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::neighborhood-labels  (also https://opendata.dc.gov/datasets/c4b0cd43d50949e98e57de9f22b455fc_35)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/35
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/35/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/c4b0cd43d50949e98e57de9f22b455fc/geojson?layers=35
- Last updated (Hub): **2019-05-03** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2024-09-05; downloaded 2026-10-11T01:26:43.756Z
- Publisher/source: D.C. Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **132** (service count 132, Hub recordCount 132)
- Used for: `neighborhoods.geojson`

### Neighborhood Clusters  (`data/raw/neighborhood-clusters.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::neighborhood-clusters  (also https://opendata.dc.gov/datasets/f6c703ebe2534fc3800609a07bad8f5b_17)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/17
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/17/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/f6c703ebe2534fc3800609a07bad8f5b/geojson?layers=17
- Last updated (Hub): **2024-09-05** (item.modified); Hub item info updated 2024-09-05; downloaded 2026-10-11T01:26:44.806Z
- Publisher/source: D.C. Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **46** (service count 46, Hub recordCount 46)
- Used for: `neighborhood-clusters.geojson`

### East of the River  (`data/raw/east-of-the-river.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1  (also https://opendata.dc.gov/datasets/ae515dab59184b70832746bf66e103fe_56)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/56
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Administrative_Other_Boundaries_WebMercator/MapServer/56/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=1000` (paged with `resultOffset` = 0, 1000, ...; 1 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/ae515dab59184b70832746bf66e103fe/geojson?layers=56
- Last updated (Hub): **2024-04-10** (item.modified); Hub item info updated 2024-04-10; downloaded 2026-10-11T01:26:45.733Z
- Publisher/source: Office of the Deputy Mayor for Planning and Economic Development; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **1** (service count 1, Hub recordCount 1)
- Used for: `east-of-river.geojson`

### Intersection Points  (`data/raw/intersections.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::intersection-points  (also https://opendata.dc.gov/datasets/96a9bbbb475648769e311d03c78698a7_2)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/FeatureServer/2
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/FeatureServer/2/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 10 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/96a9bbbb475648769e311d03c78698a7/geojson?layers=2
- Last updated (Hub): **2026-10-10** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2026-10-10; downloaded 2026-10-11T01:27:02.588Z
- Publisher/source: Office of the Chief Technology Officer; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **19088** (service count 19088, Hub recordCount 19088)
- Used for: `intersections-w78.geojson`

### Metro Bus Stops  (`data/raw/bus-stops.geojson`)
- Open Data DC page: https://opendata.dc.gov/datasets/DCGIS::metro-bus-stops  (also https://opendata.dc.gov/datasets/e85b5321a5a84ff9af56fd614dab81b3_53)
- REST layer: https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Transportation_Rail_Bus_WebMercator/MapServer/53
- Download used: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Transportation_Rail_Bus_WebMercator/MapServer/53/query?where=1%3D1&outFields=*&outSR=4326&orderByFields=OBJECTID%20ASC&f=geojson&resultOffset=<n>&resultRecordCount=2000` (paged with `resultOffset` = 0, 2000, ...; 5 page(s))
- Hub GeoJSON alternative: https://opendata.dc.gov/api/download/v1/items/e85b5321a5a84ff9af56fd614dab81b3/geojson?layers=53
- Last updated (Hub): **2026-10-04** (metadata.metadata.dataIdInfo.idCitation.date.reviseDate); Hub item info updated 2026-10-05; downloaded 2026-10-11T01:27:04.764Z
- Publisher/source: City of Washington, DC; licence: Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0)
- Raw feature count: **8335** (service count 8335, Hub recordCount 8335)
- Used for: `bus-stops-w78.geojson`

## Output layers: processing and properties

### `grocery-stores.geojson` (93 features, 34.7 KB)
- Processing: All 93 records kept (open and closed). Coordinates rounded to 5 decimals. `ward` = point-in-polygon against unsimplified 2022 wards; `east_of_river` = point-in-polygon against the official East of the River polygon. PRESENTyy "Yes"/"No" strings converted to booleans.
- Properties: `id` (OBJECTID), `name`, `address`, `zipcode`, `ward` (2022, computed), `ward_src` (dataset WARD attribute), `east_of_river`, `open_2026` (= PRESENT26 "Yes"), `present_2022` ... `present_2026`, `notes`, `mar_id`. **Filter on `open_2026` to show only operating stores.**

### `low-food-access.geojson` (381 features, 444.6 KB)
- Processing: mapshaper `-simplify visvalingam weighted interval=5 keep-shapes`, 5-decimal precision. `ward` = 2022 ward holding the largest share of the polygon area (turf.intersect on unsimplified geometry), `ward_share` = that share; `east_of_river` = more than 50% of the polygon area inside the East of the River polygon.
- Properties: `gis_id`, `ward` (2022, computed), `ward_share`, `ward_src` (dataset WARD attribute, pre-2022 lines), `east_of_river`, `PARTPOP2` (est. residents), `PRTOVR185` (est. residents above 185% FPL), `PRTUND185` (est. residents below 185% FPL = "food insecure" per dataset), `PERCENTUND185` (0-1 fraction), `area_km2`.

### `farmers-markets.geojson` (64 features, 33.2 KB)
- Processing: All 64 records kept, including 14 Maryland markets (`in_dc` = false, `ward` = null). Ward/east_of_river as for grocery stores.
- Properties: `id`, `name`, `address`, `city`, `state`, `zipcode`, `in_dc`, `ward`, `ward_src`, `east_of_river`, `days`, `times`, `season_start`, `season_end`, `benefits` (SNAP/WIC/Produce Plus...), `website`, `location_description`.

### `healthy-corners.geojson` (50 features, 14.2 KB)
- Processing: All records kept. Ward/east_of_river as for grocery stores. "x" flags converted to booleans.
- Properties: `id`, `name`, `address`, `zipcode` (often null in source), `ward`, `ward_src`, `east_of_river`, `snap_match`, `wic_vendor`, `mar_id`.

### `wards.geojson` (8 features, 47.1 KB)
- Processing: mapshaper simplify interval=5 m, keep-shapes, 5-decimal precision.
- Properties: `ward` (1-8), `name`, `label`.

### `dc-boundary.geojson` (1 features, 14.5 KB)
- Processing: mapshaper simplify interval=5 m, keep-shapes, 5-decimal precision.
- Properties: `name`, `gis_id`.

### `east-of-river.geojson` (1 features, 5.8 KB)
- Processing: Official DC GIS "East of the River" polygon, simplified (interval=5 m). Used for shading the focus area. Note it extends to mid-river, so it contains water.
- Properties: `name`, `gis_id`.

### `water.geojson` (97 features, 156.4 KB)
- Processing: Kept DESCRIPTION = River (71) and Lake (6) plus Ponds of at least 2,000 m2; dropped Wastewater Holding Ponds (Blue Plains) and small ponds. Simplified interval=5 m, keep-shapes. The source has no name field: the single large "River" polygon (OBJECTID 30) covers BOTH the Potomac and the Anacostia, so it is named "Potomac and Anacostia Rivers"; other features are unnamed streams/lakes/ponds.
- Properties: `kind` (river | lake | pond), `name` (only on the main river polygon), `objectid`.

### `zipcodes.geojson` (172 features, 171.8 KB)
- Processing: All 172 ZIP polygons kept: 26 TYPE = STANDARD delivery ZIPs plus 139 UNIQUE (single organisation/building, e.g. federal agencies) and 7 PO BOX ZIPs. The non-standard ZIPs are cut out of the standard ones (no overlap; checked), so dropping them would leave holes; filter on `type` = "STANDARD" for neighbourhood-level ZIP shading. Simplified interval=8 m.
- Properties: `zipcode`, `name`, `type` (STANDARD | UNIQUE | POST OFFICE BOX).

### `neighborhood-clusters.geojson` (46 features, 104.4 KB)
- Processing: Simplified interval=8 m. A guaranteed-interior label point (turf.pointOnFeature) is stored as `label_lon`/`label_lat`; ward and east_of_river are evaluated at that point.
- Properties: `name` ("Cluster n"), `nbh_names`, `type` (Original/Additional), `ward_at_label`, `east_of_river`, `label_lon`, `label_lat`.

### `neighborhoods.geojson` (178 features, 49.7 KB)
- Processing: 132 Neighborhood Labels points (`kind` = "neighborhood") plus one label point per Neighborhood Cluster (`kind` = "cluster", 46). `aliases` are derived mechanically: LABEL_NAME if different, the parts of "/"-separated names, "Anacostia" for "Historic Anacostia", "Fort Davis" for "Fort Davis Park"; for clusters, each name in NBH_NAMES (the cluster point is only an approximate location for those names). Match `kind` = "neighborhood" first.
- Properties: `kind`, `name`, `label`, `aliases` ("|"-separated), `ward`, `east_of_river`, `cluster`, `source`.

### `intersections-w78.geojson` (2732 features, 567.4 KB)
- Processing: Clipped to points inside 2022 Wards 7 and 8 (point-in-polygon, unsimplified wards). The source stores most intersections twice ("A AND B" and "B AND A" at the same point); duplicates with the same rounded coordinate and the same street pair were collapsed. Other source fields dropped.
- Properties: `name` (e.g. "MINNESOTA AVENUE NE AND BENNING ROAD NE"), `street1`, `street2` (full names incl. type and quadrant, upper case), `ward` (7|8), `type` (only present when not REGULAR: RAMP, ALLEY, OVERPASS, UNDERPASS). Note: there is no "GOOD HOPE ROAD SE AND MARTIN LUTHER KING JR AVENUE SE" point; the Historic Anacostia crossroads is "MARION BARRY AVENUE SE AND MARTIN LUTHER KING JR AVENUE SE" (that stretch of Good Hope Rd now carries the Marion Barry Ave name), so the chat should alias Good Hope Rd to Marion Barry Ave there. Street names are upper case with full type words (AVENUE, ROAD, STREET) and quadrant, so normalise user input (Ave -> AVENUE, Rd -> ROAD, St -> STREET, add quadrant if missing).

### `bus-stops-w78.geojson` (824 features, 167.0 KB)
- Processing: Clipped to stops inside 2022 Wards 7 and 8. Source reflects WMATA's Better Bus network (launched 29 June 2025).
- Properties: `id` (WMATA REG_ID), `name` (stop message text), `on_street`, `at_street`, `ward`.

## How "east of the river" is decided

1. **Primary (used for every `east_of_river` flag and stat):** point-in-polygon against the official DC GIS
   ["East of the River"](https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1) polygon (Office of the Deputy Mayor for Planning
   and Economic Development; "boundaries in DC east of the Anacostia River"). It is the District's own definition, so it is the
   most defensible choice, and it is independent of ward lines (Ward 7 includes Kingman Park and the RFK campus west of the river; since
   2022 Ward 8 includes Navy Yard/Capitol Riverfront west of the river).
2. **Independent check:** DC boundary minus the main Waterbodies "River" polygon (buffered 5 m to close hairline gaps), keeping
   the land piece that contains a seed point at Frederick Douglass NHS. 99.91% of that derived land
   (42.736 km2) lies inside the official polygon (51.787 km2; the rest of the
   official polygon is mostly river water to mid-channel).
3. **Coarse check:** Neighborhood Clusters 28-39, 43 (Saint Elizabeths) and 44 (JBAB).

Point-level disagreements between the methods (method 3 is skipped for points in cluster 46, which straddles the river):
grocery stores 0, healthy corner stores 0,
DC farmers markets 0 (details in `*_east_method_disagreements` in stats.json).

## Known data caveats

- **Grocery Store Locations** contains closed stores. Use `open_2026` (PRESENT26 = "Yes"): 78 of 93 records.
  The dataset WARD attribute is wrong for at least one store (Aldi, 5300 SOUTH DAKOTA AVENUE NE: "Ward 2", actually Ward 5); use the computed `ward`.
  Lidl at Skyland Town Center (2224 Town Center Dr SE) **is** in the dataset. The Marion Barry Avenue Market (1303 Marion Barry Ave SE, opened Sept 2025) is **not**; whether it meets the full-service definition is unverified.
- **Low Food Access Areas** is a 2017 model (grocery stores and population of that time) — it predates Lidl Skyland (2022) and the openings/closures since, and uses pre-2022 ward lines. 15 grocery records (including Lidl Skyland) sit inside LFA polygons (`lfa_staleness_stores_inside_lfa` in stats.json). Its two ward attributes (NAME, WARD) disagree on 55 polygons; use the computed `ward`.
- **Farmers markets** are mostly seasonal; the layer includes Maryland markets.
- **Healthy Corner Stores** last revised 2024-10-04; DC Central Kitchen's live list may differ.
- **Neighborhood Labels** were last revised 2019-05-03; names are informal, not official boundaries.
- **Geometry validity:** a handful of polygons (about a dozen in low-food-access, a few in zipcodes and water) fail turf's strict
  `booleanValid` check (turf reports touching/crossing points between parts of the same MultiPolygon); this is mostly
  inherited from the source (16 raw LFA MultiPolygons fail the same test).
  They drew correctly in a mapshaper SVG check and MapLibre fill layers generally tolerate this; all area statistics were
  computed on the raw, unsimplified geometry.
- **Ward 8 vs "east of the river":** since the 2022 redistricting Ward 8 also covers Navy Yard / Near Southeast west of the river
  (Neighborhood Labels "Navy Yard" and "Near Southeast" fall in Ward 8; "Buzzard Point" and "Southwest/Waterfront" fall in Ward 6).
  Ward 7 likewise includes Kingman Park / RFK west of the river. Do not use ward as a proxy for east of the river.

## Missing layers

None. Every requested layer was found on Open Data DC and downloaded in full (feature counts match the service counts). Street
intersections exist as a published layer (Intersection Points), so no derivation from street centerlines was needed.
