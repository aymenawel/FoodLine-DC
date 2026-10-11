# Geo analysis: food access east of the Anacostia (Wards 7 & 8)

Prepared 2026-10-10. All numbers come from `data/geo/stats.json`, which `scripts/geo/stats.mjs` computes from the
unsimplified Open Data DC layers in `data/raw/` (downloaded 2026-10-10 local time). Licence: CC BY 4.0, Open Data DC.
Layer documentation: `data/geo/README.md`.

## Headline numbers

| Measure | Value | Dataset (Open Data DC "updated" date) |
|---|---|---|
| Full-service grocery stores operating in DC (PRESENT26 = "Yes") | **78** (of 93 records; 15 are flagged closed) | Grocery Store Locations (2026-08-20) |
| ...of which east of the Anacostia | **4** (5.1% of DC's 78) | same + East of the River (2024-04-10) |
| ...of which west of the Anacostia | 74 | same |
| Operating stores in Ward 7 / Ward 8 (2022 wards) | **3 / 3** | same + Wards from 2022 (2025-01-17) |
| Ward 8 operating stores that are actually east of the river | **1** (Giant, 1535 Alabama Ave SE) | same |
| Residents in Low Food Access Areas, all DC (PARTPOP2) | **336,449** | Low Food Access Areas (content Nov 2017) |
| ...below 185% of the poverty line (PRTUND185) | **111,261** (33.1%) | same |
| LFA residents in Wards 7+8 (area-weighted, 2022 wards) | **132,424** (39.4% of DC's LFA residents) | same + Wards from 2022 |
| LFA residents below 185% FPL in Wards 7+8 | **66,764** (60.0% of DC's total) | same |
| LFA residents east of the river (area-weighted) | **126,582** (37.6%); below 185% FPL **65,189** (58.6% of DC's; 51.5% of the area's LFA residents) | same + East of the River |
| Share of DC's low-food-access **area** in Wards 7+8 | **32.6%** (Ward 7 16.9%, Ward 8 15.7%; 27.78 of 85.30 km2) | same |
| Share of DC's low-food-access area east of the river | **30.9%** (26.39 km2) | same |
| Healthy Corner Stores east of the river | 29 of 50 (Ward 7: 13, Ward 8: 18 in total) | Healthy Corner Stores (2024-10-04) |
| Farmers markets east of the river | 13 of 50 DC markets (mostly seasonal) | Farmers Market Locations (2026-09-27) |

Context: Wards 7+8 cover 31.8% of DC's area and the East of the River polygon 29.2% (both including river water).
Low-food-access polygons cover 60.1% of Ward 7, 41.4% of Ward 8 and 48.1% of DC overall. So by **area** the
east side has roughly its proportional share of low-access land. The concentration shows up in **poverty**: 60% of
all low-access residents below 185% FPL live in Wards 7 and 8.

## Grocery stores

Dataset: [Grocery Store Locations](https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations), OCTO/DMPED, Hub
"updated" 2026-08-20 (every record's EDITED date is 2026-08-20). Stores meet, or come very close to, the ABCA
full-service grocery store definition. The layer keeps recently closed stores and has PRESENTyy Yes/No columns. I
counted a store as operating if **PRESENT26 = "Yes"**. Wards were assigned by point-in-polygon against the
official 2022 ward polygons, not the dataset's WARD text.

Operating stores by ward (2026; 2022 wards): W1 13, W2 13, W3 14, W4 11, W5 11, W6 10, **W7 3, W8 3**. Total 78.
All 93 records by ward: 14, 17, 16, 12, 13, 13, 4, 4. The same count for PRESENT22 (2022): 12, 15, 14, 11, 9, 12, 3, 4.

### Every store east of the Anacostia (6 records)

| id | Store | Address | Ward | Status per dataset |
|---|---|---|---|---|
| 707 | Safeway | 2845 Alabama Ave SE | 7 | operating (present 2000-2026) |
| 708 | Giant ("Camp Simms") | 1535 Alabama Ave SE | 8 | operating (present 2008-2026) |
| 718 | Safeway | 322 40th St NE | 7 | operating (present 1990-2026) |
| 721 | Lidl | 2224 Town Center Dr SE (Skyland Town Center) | 7 | operating (present 2022-2026) |
| 719 | Yes! Organic | 2323 Pennsylvania Ave SE | 7 | closed (present only 2010-2012) |
| 722 | Good Food Markets | 4001 South Capitol St SW (Bellevue) | 8 | closed (present 2022 only) |

**East of the river: 4 operating stores** (3 in Ward 7, 1 in Ward 8). There were 5 in 2022, when Good Food Markets
was still open.

### Every Ward 8 store (2022 ward lines)

| id | Store | Address | Side of river | Status |
|---|---|---|---|---|
| 703 | Whole Foods Market | 101 H St SE | **west** (Navy Yard / Capitol Riverfront) | operating |
| 706 | Harris Teeter | 401 M St SE ("Navy Yard") | **west** | operating |
| 708 | Giant | 1535 Alabama Ave SE | east | operating |
| 722 | Good Food Markets | 4001 South Capitol St SW | east | closed (2023 onward) |

After the 2022 redistricting, Ward 8 includes Navy Yard / Near Southeast, which is west of the river. Buzzard Point and
Southwest/Waterfront are still in Ward 6. So "Ward 8 has 3 grocery stores" is true on paper but misleading: residents
east of the river have one (Giant). Press accounts that say Ward 8 had "only one full-service grocery store" before
2025 match the east-of-river count.

Ward 7 has 3 operating stores, all east of the river. Ward 7 also extends west of the river (Kingman Park / RFK), but
no grocery store sits there.

### Currency checks (dataset not edited; discrepancies only flagged)

- **Lidl, Skyland Town Center: in the dataset.** Record 721, 2224 Town Center Dr SE, Ward 7, present 2022-2026.
  Skyland Town Center sits on the Alabama Ave SE corridor near the 2800 block. Press reports put the Lidl opening in
  late September 2022 (ribbon cutting 27 Sep 2022), which is consistent with PRESENT22 = Yes.
  Sources: [Mayor's office release](https://mayor.dc.gov/release/mayor-bowser-celebrates-grand-opening-dc%E2%80%99s-first-lidl-food-market),
  [NBC Washington](https://www.nbcwashington.com/news/local/dcs-first-lidl-grocery-store-opens-in-southeast/3167908/).
- **Marion Barry Avenue Market and Cafe: not in the dataset.** It is run by Dreaming Out Loud at 1303 Marion Barry
  Ave SE, Ward 8, east of the river, and opened 27 Sep 2025. It is about 4,770 sq ft and press calls it a
  fresh-food access point. Whether it meets the ABCA full-service definition is **not established**, so it may be
  absent by design. If counted, east of the river would have 5 stores and Ward 8 east of the river would have 2.
  Source: [Washingtonian, 2025-10-10](https://washingtonian.com/2025/10/10/new-anacostia-market-is-a-dream-come-true-for-community/).
- **Wrong WARD attribute:** Aldi, 5300 South Dakota Ave NE, is labelled "Ward 2" but falls in Ward 5. Two newer
  records use "1" and "5" instead of "Ward n". The pipeline's computed `ward` is used everywhere.
- The layer otherwise looks current. It includes 2025 openings: Streets Market at 3146 Mount Pleasant St NW
  (opened 31 Jan 2025) and Trader Joe's at 701 Monroe St NE (opened 15 May 2025). It also notes the Metro Supermarket
  closure (21 May 2025). I did not check every DC store against outside sources.

## Low Food Access Areas (LFA)

Dataset: [Low Food Access Areas](https://opendata.dc.gov/datasets/DCGIS::low-food-access-areas), DC Office of
Planning. The Hub item was modified 2023-03-30, but the description says **"Last updated November 2017"**. The
polygons are areas more than a 10-minute walk from a full-service grocery store, with non-residential land (parks,
etc.) and Joint Base Anacostia-Bolling removed. They are split by Census tract.

Fields summed (the dataset's own):

- `PARTPOP2`: estimated residents in the polygon. The tract population is spread evenly over residential land.
- `PRTUND185`: the part of PARTPOP2 below 185% of the federal poverty line. The dataset calls this "food insecure".
- `PRTOVR185`: the remainder. PRTOVR185 + PRTUND185 = PARTPOP2 for all 381 polygons (checked).

Checks: there are 381 polygons, with no overlaps (pairwise turf.intersect, 0 overlapping pairs) and no
duplicate IDs, so summing does not double count.

| Ward (2022 lines, area-weighted) | LFA area km2 | Share of DC LFA area | PARTPOP2 | PRTUND185 | % below 185% FPL |
|---|---:|---:|---:|---:|---:|
| 1 | 1.71 | 2.0% | 12,253 | 4,003 | 32.7% |
| 2 | 4.52 | 5.3% | 12,829 | 2,478 | 19.3% |
| 3 | 14.69 | 17.2% | 48,938 | 6,724 | 13.7% |
| 4 | 12.38 | 14.5% | 50,280 | 10,332 | 20.6% |
| 5 | 18.55 | 21.7% | 54,146 | 16,731 | 30.9% |
| 6 | 5.67 | 6.6% | 25,577 | 4,228 | 16.5% |
| **7** | **14.40** | **16.9%** | **66,659** | **29,150** | **43.7%** |
| **8** | **13.38** | **15.7%** | **65,765** | **37,615** | **57.2%** |
| DC total | 85.30 | 100% | 336,449 | 111,261 | 33.1% |
| East of the river | 26.39 | 30.9% | 126,582 | 65,189 | 51.5% |

Method: each polygon was intersected with the 2022 ward polygons and with the East of the River polygon. Its
PARTPOP2 and PRTUND185 were split in proportion to area, using the same even-spread assumption as the dataset.
Ward figures are estimates rounded to whole people. Only 0.0007 km2 of LFA area falls outside every ward.

Cross-check using the dataset's own ward attributes (pre-2022 lines, no geometry):

- By `NAME`: W7 62,321 / 28,163 and W8 65,455 / 37,513 (PARTPOP2 / PRTUND185). This is close to the overlay. Ward 7's
  overlay total is higher because the 2022 lines moved 7 polygons in the Kingman Park / Hill East area (west of the
  river) from Ward 6 into Ward 7.
- The numeric `WARD` attribute disagrees with `NAME` on 55 polygons. It matches the 2022 majority ward on only
  331 of 381 polygons, against 370 for `NAME`. By `WARD`: W7 71,336 / 29,661 and W8 61,188 / 35,759.
  **Do not quote the WARD-field sums.**

### LFA caveats

- **Vintage.** The model reflects grocery stores and population as of 2017. It does not account for stores that
  opened or closed later: Lidl Skyland (2022), Good Food Markets Bellevue (opened 2021, closed by 2023 per the
  grocery layer), and the 2024-2025 openings and closures elsewhere in DC.
  - Direct evidence: the Lidl's own point, at 2224 Town Center Dr SE, lies **inside** an LFA polygon (about 30 m
    from its edge). So does the Good Food Markets point at 4001 South Capitol St SW. Both stores post-date the model.
  - The three long-standing east-of-river stores (both Safeways and the Giant) all sit outside LFA polygons, as
    expected.
  - Across DC, 15 grocery records sit inside LFA polygons (`lfa_staleness_stores_inside_lfa` in stats.json). These
    are newer stores, stores closed before 2017, or stores the 2017 model did not count.
  - So the LFA map overstates low access around Skyland today. Recomputing walksheds from the 2026 store list would
    be the fix (not done).
- **Modelled populations.** These are tract estimates spread evenly over residential land, not counts.
  "Food insecure" here only means below 185% FPL and living in an LFA.
- **Scale check.** PARTPOP2 sums to about 336k, roughly half of DC's population at the time. Area and population
  shares match (LFA covers 48.1% of DC's area). This is the dataset's own figure; compare it with Office of Planning
  publications before using it in a headline.
- **Area shares include water** in the denominators for ward/DC context figures. LFA polygons themselves exclude water.

## How "east of the river" was decided

1. **Primary:** the official DC GIS [East of the River](https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1)
   polygon (DMPED, Hub date 2024-04-10), "boundaries in DC east of the Anacostia River". It is the District's own
   definition and independent of ward lines, which matters because Wards 7 and 8 both reach west of the river.
2. **Independent check:** take the DC boundary and subtract the Waterbodies main "River" polygon. That single
   polygon covers both the Potomac and the Anacostia, and was buffered 5 m to close hairline gaps at the DC line.
   Keep the land piece containing Frederick Douglass NHS (Cedar Hill). 99.91% of that derived land (42.74 km2) lies
   inside the official polygon (51.79 km2). The official polygon runs to mid-river, so most of the difference is
   about 8.9 km2 of water.
3. **Coarse check:** Neighborhood Clusters 28-39, 43 (Saint Elizabeths) and 44 (JBAB). Cluster 46 (Arboretum,
   Anacostia River) straddles the river, so it is unresolved.

Result: 0 disagreements for all 93 grocery records, 50 healthy corner stores and 50 DC farmers markets. Using wards
instead would have misclassified Whole Foods (101 H St SE) and Harris Teeter (401 M St SE) in Ward 8. It would also
misclassify the RFK Open Air Market (Ward 7), Half Street Central Farm Market (Ward 8), and two Ward 7 healthy corner
stores (Economy Market, 1804 D St NE; The Cupboard, 1504 East Capitol St NE).

## Other food sources east of the river

- **Healthy Corner Stores** (DC Central Kitchen program, Office of Planning layer, updated 2024-10-04): 29 of 50
  stores are east of the river (Ward 7: 11 east + 2 west; Ward 8: 18).
- **Farmers markets** (updated 2026-09-27): 50 in DC plus 14 in Maryland. 13 are east of the river: Ward 8
  Farmers Market, Dreaming Out Loud's Kelly Miller and Anacostia markets, Arcadia Mobile Market (Parkside, Bellevue
  Library, Oxon Run), FRESHFARM (THEARC, Simon Elementary, Kenilworth Rec Center, Minnesota Ave, Anacostia Community
  Museum, Cesar Chavez) and UDC East Capitol. Almost all run one day a week, seasonally (roughly April/May-November/
  December). They supplement grocery stores but do not replace them.

## Data sources (all Open Data DC, CC BY 4.0)

| Layer | Page | Hub "updated" | Features |
|---|---|---|---:|
| Grocery Store Locations | https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations | 2026-08-20 | 93 |
| Low Food Access Areas | https://opendata.dc.gov/datasets/DCGIS::low-food-access-areas | 2023-03-30 (content Nov 2017) | 381 |
| Farmers Market Locations | https://opendata.dc.gov/datasets/DCGIS::farmers-market-locations | 2026-09-27 | 64 |
| Healthy Corner Stores | https://opendata.dc.gov/datasets/DCGIS::healthy-corner-stores | 2024-10-04 | 50 |
| Wards from 2022 | https://opendata.dc.gov/datasets/DCGIS::wards-from-2022 | 2025-01-17 | 8 |
| Washington DC Administrative Boundary | https://opendata.dc.gov/datasets/DCGIS::washington-dc-administrative-boundary | 2013-07-03 | 1 |
| East of the River | https://opendata.dc.gov/datasets/DCGIS::east-of-the-river-1 | 2024-04-10 | 1 |
| Waterbodies | https://opendata.dc.gov/datasets/DCGIS::waterbodies | 2026-02-20 | 1,293 |
| Zip Codes | https://opendata.dc.gov/datasets/DCGIS::zip-codes | 2022-10-14 | 172 |
| Neighborhood Labels | https://opendata.dc.gov/datasets/DCGIS::neighborhood-labels | 2019-05-03 | 132 |
| Neighborhood Clusters | https://opendata.dc.gov/datasets/DCGIS::neighborhood-clusters | 2024-09-05 | 46 |
| Intersection Points | https://opendata.dc.gov/datasets/DCGIS::intersection-points | 2026-10-10 | 19,088 (2,732 unique in W7-8 after clipping) |
| Metro Bus Stops | https://opendata.dc.gov/datasets/DCGIS::metro-bus-stops | 2026-10-04 | 8,335 (824 in W7-8) |

Exact REST query URLs are in `data/geo/README.md` and `data/raw/manifest.json`.

## Suggested next steps

- Recompute 10-minute walksheds from the 78 operating stores (plus the Marion Barry Avenue Market if the team
  counts it) to replace the 2017 LFA model, for example with an OSM pedestrian network.
- Add ward and east-of-river population (ACS 5-year, available on Open Data DC) to compute stores per resident.
