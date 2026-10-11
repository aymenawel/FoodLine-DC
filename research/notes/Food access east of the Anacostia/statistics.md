# Food access east of the Anacostia: verified statistics (DC Wards 7 and 8)

All sources accessed 2026-10-10 unless noted. "Verbatim" means the text was copied from the PDF text layer or from a quoted page fetch. Anything I calculated is marked **[calc]**, and anything I inferred is marked **[inference]**. Where a lead could not be confirmed at a primary source, it is listed under "Could not verify" at the end.

Three caveats apply throughout:
1. **Ward boundaries changed in 2022.** Ward 8 now crosses the river into Navy Yard, and Ward 7 extends west into part of Capitol Hill. Ward-level numbers are therefore not the same as "east of the river" numbers.
2. **The Grocery Gap 2025 report changed its income and poverty data source.** It switched from DC Health Matters to the ACS. Its "2024 vs 2025" income and poverty changes are not like-for-like comparisons.
3. **The CAFB 38% figure is regional (DMV), not a DC figure.**

---

## Screen-ready summary (figures that survived verification)

### Takeaway
The strongest on-screen figures come from three sources: the D.C. Hunger Solutions 2025 store counts (80 citywide, Ward 3 has 17, Ward 7 has 3, Ward 8 has 4, and only 2 of Ward 8's stores are east of the river); ACS 2020–2024 ward estimates for income, SNAP, poverty and car-free households; and the CAFB DC food-insecurity trend (40% in 2025). The 2026 CAFB report gives 38% for the DMV but no DC-only number that I could find.

### Cited Findings
| On-screen claim | Figure | Source (publisher, date) |
|---|---|---|
| Full-service grocery stores in DC | 80 (up from 76) | D.C. Hunger Solutions, *Minding the Grocery Gap in the District of Columbia: A 2025 Update*, Nov 2025 — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf) |
| Ward 3 / Ward 7 / Ward 8 stores | 17 / 3 / 4 | same PDF; also [press release, Nov 19, 2025](https://www.dchunger.org/uncategorized/residents-in-wards-7-and-8-still-have-limited-access-to-grocery-stores-d-c-hunger-solutions-report-finds/) |
| Ward 8 stores actually east of the river | 2 (Giant on Alabama Ave + Marion Barry Avenue Market) | same PDF, p. 6–7 |
| Wards 7+8 share of DC's stores vs share of DC's population | 7 of 80 stores (8.75%) vs 26.4% of population **[calc from report table]** | same PDF table |
| Residents per full-service store | Ward 7 ≈ 30,300; Ward 8 ≈ 21,600; Ward 3 ≈ 4,600; DC ≈ 8,400 **[calc from report table populations ÷ stores]** | same PDF table |
| Median household income (ACS 2020–2024) | Ward 8 $52,769; Ward 7 $71,088; Ward 3 $144,877; DC $109,870 | U.S. Census Bureau ACS 2020–2024 5-yr, table B19013, via [Census Reporter API](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11) |
| Households receiving SNAP (ACS 2020–2024) | Ward 8 38.5%; Ward 7 29.0%; DC 14.3%; Ward 3 2.8% **[calc]** | ACS B22001 (same API call) |
| Households with no vehicle (ACS 2020–2024) | Ward 8 43.0%; Ward 7 33.1%; DC 36.0% **[calc]** | ACS B08201 (same API call) |
| DC household food insecurity (CAFB) | 40% in 2025 (36% 2022, 35% 2023, 38% 2024), MOE ±5.4 pts | CAFB *2025 Hunger Report Briefing* (DC data), posted by DC Food Policy Council Oct 2025 — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2025/10/CAFB-DC-2025-Data.pdf) |
| DMV household food insecurity (CAFB 2026) | 38%, described as a five-year high | CAFB *Hunger Report 2026* — [web report](https://hunger-report.capitalareafoodbank.org/report-2026/); launched Sept 15, 2026 ([NBC4](https://www.nbcwashington.com/news/local/food-insecurity-at-5-year-high-in-dc-region-hunger-study-says/4154778/), [WJLA](https://wjla.com/news/local/capital-area-food-bank-hunger-report-2026-insecurity-dmv-dc-virginia-maryland-prince-georges-county-arlington-household-finances-cost-of-living-federal-jobs-inflation-immigrant-families-economy)) |

### Inferences
- Wards 7 and 8 contain roughly a quarter of DC residents but fewer than 1 in 11 of its full-service grocery stores. East of the river the share is lower still: about 5 of 80 stores **[inference, see Q1]**.

### Gaps
- No DC-only or ward-level 2026 CAFB figure was found (see Q4).

---

## Q1. D.C. Hunger Solutions, "Minding the Grocery Gap in D.C.: A 2025 Update": ward counts, definition, and the east-of-river count

### Takeaway
All four leads are **confirmed**: 80 stores total, Ward 3 has 17, Ward 7 has 3, and Ward 8 has 4. The report itself says that only **two of Ward 8's four stores are east of the Anacostia**, and that the 2022 redistricting added higher-income areas west of the river to Wards 7 and 8. Ward 8's other two stores are in Navy Yard: the report lists Whole Foods at 101 H St SE, and the fourth is very likely the Navy Yard Harris Teeter. The implied east-of-river total is 5 stores (Ward 7's 3 plus Ward 8's 2) **[inference]**.

### Cited Findings
**Publication facts.** [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)
- Cover: "November 2025".
- Authors: "LaMonika N. Jones, director, Corey N. Thompson, SNAP and WIC outreach associate".
- Data window (p. 3): "This report includes data from October 2024 to September 2025."
- [Press release](https://www.dchunger.org/uncategorized/residents-in-wards-7-and-8-still-have-limited-access-to-grocery-stores-d-c-hunger-solutions-report-finds/) dated **November 19, 2025**, titled "Residents in Wards 7 and 8 Still Have Limited Access to Grocery Stores, D.C. Hunger Solutions Report Finds".

**Citywide count (p. 6, verbatim):** "In 2025, the total number of full-service grocery stores in Washington, D.C., increased from 76 to 80." — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Ward counts (p. 6, verbatim):** "Ward 1 gained one store, bringing its total to 13. Ward 2 reported a small decrease from 14 to 13 stores with one new store in the pipeline to be developed in the coming years. Ward 3 increased from 16 to 17 stores with two new stores in the pipeline. Ward 4 remained steady at 11 stores, and Ward 5 grew from eight to nine. Ward 6 added one store, increasing its total to 10 with two additional stores are in the pipeline. Wards 7 and 8 … saw little improvement: Ward 7 continues to have only three full-service grocery stores, while Ward 8 now has one additional grocery store bringing the total to four." — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Press release quote (LaMonika Jones):** "While Ward 3, with the highest-income households, has 17 grocery stores, … the lowest-income households east of the Anacostia River in Wards 7 and 8, have three and four full-service grocery stores, respectively." — [press release](https://www.dchunger.org/uncategorized/residents-in-wards-7-and-8-still-have-limited-access-to-grocery-stores-d-c-hunger-solutions-report-finds/)

**Report table (p. 6).** Title: "Change in Number of Full-Service Grocery Stores and Poverty Rate in D.C. Overall and by Ward, 2024–2025". Listed sources: Washington D.C. Economic Partnership; Open Data D.C.; D.C. Office of Planning Demographic Data Hub. Footnote: "*Two additional grocery stores opened following the release of the 2024 report." In the PDF text layer the 2024-stores column is offset by one row; I reconciled it against the narrative above, and both columns sum correctly (76 and 80). — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

| Ward | Population | Stores 2024 | Stores 2025 | Pipeline 2024 | Pipeline 2025 | Median HH income "2024" | Median HH income "2025" | Poverty "2024" | Poverty "2025" |
|---|---|---|---|---|---|---|---|---|---|
| D.C. | 672,079 | 76 | 80 | 3 | 5 | $98,916 | $106,287 | 11.86% | 14.50% |
| 1 | 79,373 | 12 | 13 | 0 | 0 | $120,010 | $126,387 | 8.58% | 11.60% |
| 2 | 78,878 | 14 | 13 | 0 | 1 | $116,285 | $131,405 | 5.67% | 11.20% |
| 3 | 78,404 | 16 | 17 | 1 | 2 | $147,968 | $141,849 | 2.44% | 7.40% |
| 4 | 85,587 | 11 | 11 | 0 | 0 | $109,966 | $128,210 | 7.43% | 8.70% |
| 5 | 88,426 | 8 | 9 | 2 | 0 | $98,326 | $97,817 | 9.16% | 14.70% |
| 6 | 84,004 | 9 | 10 | 0 | 2 | $120,943 | $138,047 | 9.39% | 11.30% |
| 7 | 90,898 | 3 | 3 | 0 | 0 | $49,814 | $69,109 | 23.85% | 22.40% |
| 8 | 86,509 | 3 | 4 | 0 | 0 | $45,598 | $50,931 | 23.85% | 26.80% |

**Definition (p. 5–6, verbatim):** "For purposes of this report, full-service grocery stores are defined as business establishments with a minimum of 50 percent of the store's total square footage, or 6,000 square feet, primarily engaged in retailing designated food products for home consumption and preparation. The data for this report were collected from various sources, including local government databases and economic reports." The store list on p. 7 is labeled "Data provided from Washington D.C. Economic Partnership". — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Change of data source (p. 6, verbatim):** "Unlike previous editions of this report, demographic and economic data were drawn from the U.S. Census Bureau's 2019–2023 American Community Survey (ACS) 5-Year Estimates rather than the D.C. Health Matters portal, which is no longer active." — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**East of the river, Ward 8 (p. 6–7, verbatim):** "In Ward 8, just two full-service grocery stores are located east of the Anacostia River -- one being the recently opened Marion Barry Avenue Market. Prior to its opening, the Giant on Alabama Avenue was the single full-service grocery option for residents in that area. According to 2021 data before the ward boundaries were redrawn to include a section west of the Anacostia River, more than 80,000 people lived east of the river with just this one grocery store serving their community." — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Redistricting (p. 3, verbatim):** "This distinction is particularly important following the June 2022 redistricting, which expanded the boundaries of Wards 7 and 8 to include areas west of the Anacostia river with comparatively higher-income residents." — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Store-address list (p. 7, "Top Grocery Store Chains").** The list covers 12 Safeway, 8 Whole Foods, 8 Streets Market, 7 Giant and 6 Trader Joe's locations (41 addresses). Ward 7 and Ward 8 entries:
- 2845 Alabama Avenue SE — Ward 7 (Safeway)
- 322 40th Street NE — Ward 7 (Safeway)
- 101 H Street SE — Ward 8 (Whole Foods block; this is Navy Yard, west of the river)
- 1535 Alabama Avenue SE — Ward 8 (Giant block)

The chain labels are graphic blocks, so I assigned addresses to chains by order and count. — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Marion Barry Avenue Market (p. 8, verbatim):** "September 2025, Dreaming Out Loud opened the Marion Barry Avenue Market and Cafe in Anacostia". — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf). The address, 1303 Marion Barry Ave SE, comes from *Washington Informer*, Demarco Rush, July 17, 2024; that pre-opening article said it would be Ward 8's second full-service store. — [Washington Informer](https://www.washingtoninformer.com/?p=1210648)

**Supermarket tax incentive (p. 9):** the Supermarket Tax Exemption Act of 2000 "has largely failed to draw new supermarkets to Wards 7 and 8". — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

**Redistricting, sources other than the report:**
- The proposed map (DCist, Martin Austermuhle, Nov 18, 2021) moved into Ward 8 the part of Navy Yard bounded by I-695 and South Capitol Street, which "would include Nationals Park, Yards Park, Canal Park, and the surrounding residential buildings". The same proposal extended Ward 7 west into Capitol Hill, to 15th Street south of C Street NE and along Potomac Avenue SE. — [DCist](https://dcist.com/story/21/11/18/proposed-redistricted-dc-map-would-transfer-navy-yard-to-ward-8-extend-ward-7-west-into-capitol-hill)
- The DC Council passed the ward map on first vote; "The second and final vote … will occur at the Council's next Legislative Meeting on December 21" (2021). ANC/SMD redrawing was to wrap up in June (2022). — [DC Council, Dec 8, 2021](https://dccouncil.gov/council-advances-next-decades-ward-maps-covid-vaccine-mandate-for-students/)
- After the new map took effect, FRAC (Melissa Jensen and Sakina Musa, March 29, 2022) wrote that Ward 8 gained two grocery stores, a Harris Teeter and a Whole Foods Market, because "the new redistricting map extends Ward 8 across the Anacostia River for the first time". FRAC added that these stores are hard to reach for most Ward 8 residents and "are not within the budgets of most lower-income residents." — [FRAC blog](https://frac.org/blog/disparities-to-grocery-store-accessibility-remain)

**DC Food Policy Council / Office of Planning, *2022 Assessment of the Food System in the District of Columbia* (transmitted Sept 28, 2023, "Summer 2023"), p. 12, verbatim:** "Although the District has 68 full-service grocery stores … While Ward 6 has 11 grocery stores, or one for every 9,200 residents, there are just four full-service grocery stores for the over 150,000 residents living East of the River." The same page says Lidl "opening in Ward 7 in 2022", and that Good Food Markets (Ward 8, 2021) "closed in late 2022". — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf)

**News coverage (context only):**
- *East of the River News* (Matthew McClure, June 4, 2025), written before the market opened: Wards 7 and 8 "have access to only five full-service grocery stores" for "over 160,000 residents". The five stores are not named. — [East of the River News](https://eastoftheriverdcnews.com/2025/06/04/safeway-a-ward-apart/)
- AFRO covered the 2025 report ("Food insecurity persists in D.C. despite new stores"), but the page returned 403, so I could not read it. According to search snippets, it repeated the "three and four, respectively" figures. — [AFRO](https://afro.com/dc-food-access-inequality/)
- I did not find any Washington Post, WAMU, Axios DC or Greater Greater Washington coverage of the 2025 report.

### Inferences
- **East-of-river count is 5 as of Sept 2025 [inference].** Ward 7 has 3 stores: the two named Safeways are east of the river, and the third is very likely Lidl at Skyland, which opened in 2022 according to the 2023 Food System Assessment. Ward 8 has 2 east of the river: Giant at 1535 Alabama Ave SE and Marion Barry Avenue Market. This matches the 2023 Food System Assessment's count of "four … East of the River" plus the September 2025 market opening.
- **Ward 8's two west-of-river stores are in Navy Yard [inference].** The report names Whole Foods at 101 H St SE. The fourth Ward 8 store is not named, but FRAC (2022) identifies a Navy Yard Harris Teeter (at 401 M St SE per DCist 2014; search snippet only). So Ward 8 went from 3 to 4 stores because the Marion Barry Avenue Market opened; the boundary change is why Ward 8's count was already above 1.
- **Buzzard Point is very likely not in Ward 8 [inference].** DC's Master Address Repository shows **no** Ward 8 addresses in ZIP 20024 (Southwest/Buzzard Point); all are in Ward 6, plus 5 in Ward 2 (see Q6). The Navy Yard transfer area was described as east of South Capitol St.
- **Why counts differ between sources.** Some count stores by ward (Ward 8 = 4, including Navy Yard). Others count east of the river (Ward 8 = 2). Counts also shift with the definition of "full-service" and the count date. *East of the River News* gave "five" before the market opened, which matches neither the ward-based count (6) nor the east-of-river count (4) at that time. I treat it as unreliable.
- **Do not present the table's income and poverty "changes" as real trends.** The 2024 column used DC Health Matters and the 2025 column used ACS 2019–2023. Ward 7's +$19,295 "increase" is almost certainly a data-source artifact.
- **Possible error in the report.** Ward 7 and Ward 8 both show "23.85%" poverty for 2024, which is likely a copy error in the report.

### Gaps
- The report does not name the third Ward 7 store or the fourth Ward 8 store. The Lidl and Harris Teeter identifications are inferences.
- I could not read the AFRO article (HTTP 403).
- I found no WaPo, WAMU, Axios or GGW coverage that states an east-of-river count for the 2025 report.

---

## Q2. Is there a 2026 Grocery Gap update?

### Takeaway
As of 2026-10-10 there is **no 2026 edition** on dchunger.org, and no news coverage of one. The 2025 update (Nov 2025) is still the latest edition.

### Cited Findings
- The dchunger.org homepage, read 2026-10-10, shows 2026 items: a September 2026 poverty-data release ("New Poverty Data Underscores Need for Congress to Reverse SNAP Cuts…"), the May 2026 School Breakfast Scorecard, and an October 2026 SNAP tip. The newest grocery report listed is "Minding the Grocery Gap in the District of Columbia: A 2025 Update". — [dchunger.org](https://www.dchunger.org/)
- The 2025 press release page links no 2026 report. — [press release](https://www.dchunger.org/uncategorized/residents-in-wards-7-and-8-still-have-limited-access-to-grocery-stores-d-c-hunger-solutions-report-finds/)
- Earlier editions came out at different times: 2023 update in Aug 2023 ([PDF](https://www.dchunger.org/wp-content/uploads/2023/08/DCHS-Report_Still-Minding-the-Grocery-Gap-2023_FV.pdf)), 2024 update in Nov 2024 ([PDF](https://www.dchunger.org/wp-content/uploads/2024/11/Minding-Grocery-Gap-2024.pdf)), and 2025 update on Nov 19, 2025.

### Inferences
- If the pattern holds, a 2026 update would likely appear around November 2026, after the live judging date. This is speculation. Re-check dchunger.org right before the demo.

### Gaps
- No primary source on 2026 timing was found.

---

## Q3. Median household income by ward

### Takeaway
The Claritas/DC Health Matters lead (Ward 7 ≈ $57,900, Ward 8 ≈ $50,900, Ward 3 ≈ $153,300, DC ≈ $106,000) **cannot be verified at a live primary source**. DC Health Matters is offline; D.C. Hunger Solutions says it is "no longer active". The newest verifiable ward figures are **ACS 2020–2024 5-year**: Ward 8 $52,769, Ward 7 $71,088, Ward 3 $144,877, DC $109,870. Use these, labeled "ACS 2020–2024".

### Cited Findings
**ACS 2020–2024 5-year, table B19013**, release "ACS 2024 5-year". DC wards are Census "State Legislative District (Upper Chamber)" geographies on current (2022) ward boundaries. Retrieved through the Census Reporter API, a mirror of Census Bureau ACS tables; the Census Bureau's own API now requires a key. — [Census Reporter API](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11)

| Geography | Median HH income | MOE (±) |
|---|---|---|
| District of Columbia | $109,870 | $1,937 |
| Ward 1 | $132,588 | $7,079 |
| Ward 2 | $132,753 | $6,757 |
| Ward 3 | $144,877 | $7,347 |
| Ward 4 | $127,583 | $7,976 |
| Ward 5 | $102,771 | $3,893 |
| Ward 6 | $138,170 | $6,459 |
| Ward 7 | $71,088 | $2,837 |
| Ward 8 | $52,769 | $4,643 |

- **ACS 2019–2023, as cited by the 2025 Grocery Gap report** from the DC Office of Planning profiles ([opdatahub.dc.gov](https://opdatahub.dc.gov/pages/district-of-columbia-profiles)): "Ward 3 continues to have the highest household income at about $141,849, while Wards 7 and 8 trail behind at roughly $69,109 and $50,931, respectively." DC is $106,287 in the report table. — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)
- **DC Health Matters is offline.** https://www.dchealthmatters.org/ failed with a TLS "unrecognized name" error on 2026-10-10. The Grocery Gap 2025 report calls the portal "no longer active". — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)
- **Where the Claritas numbers appear.** They show up only in search-engine snippets of a test mirror, `test-washingtondc.thehcn.net/demographicdata/index/view?id=2419`, which returns HTTP 401 Unauthorized. The snippets read: Ward 7 $57,940; Ward 8 $50,855; DC $106,049; Ward 3 $153,348; "Claritas, updated May 2025". These are unverifiable and should not go on screen.
- **Note on Ward 7 sources.** The Claritas estimate (~$57.9k) and the ACS estimates ($69.1k for 2019–23, $71.1k for 2020–24) disagree substantially. The Ward 8 figures agree across sources ($50.9k–$52.8k).

### Inferences
- Ward 7's ACS median (~$71k) includes the Capitol Hill blocks added in 2022, which are west of the river and higher-income. East-of-river Ward 7 is probably lower, but I found no source isolating it.
- On screen, the strongest comparison is Ward 8's median ($52,769), which is about 48% of the DC median ($109,870) **[calc]**. This uses ACS 2020–2024; note the ±$4,643 margin of error.

### Gaps
- The DC Health Matters figures are unverifiable (see the last section).
- No ACS 1-year data exist for wards (the Census Reporter acs2024_1yr call returned no ward geographies). The ACS 2021–2025 5-year release is not out as of 2026-10-10.

---

## Q4. Capital Area Food Bank Hunger Report 2026 (and 2025 for trend)

### Takeaway
**Confirmed:** in the CAFB 2026 Hunger Report, 38% of **DMV households** experienced food insecurity in the past year, and the report calls this a "five-year high". It was launched Sept 15, 2026. **No DC-only figure and no ward or east-of-river figures** appear in the 2026 web report text. The latest DC-specific figure is **40% (2025)**, from CAFB's DC briefing.

### Cited Findings
**2026 report** — [CAFB Hunger Report 2026](https://hunger-report.capitalareafoodbank.org/report-2026/) (page fetch; quotes as returned):
- Headline: "in the DMV, 38% of households—over one in three—experienced food insecurity in the past year." The report also says "food insecurity in greater Washington is now at a five-year high."
- The page notes the 2-point rise from the prior year is within the margin of error.
- Definition: USDA's "a lack of consistent access to enough food for an active, healthy life", measured with the USDA 18-question module. Respondents reporting 3 or more food-related hardships in the past 12 months are classified food insecure.
- Survey: NORC at the University of Chicago, funded by CAFB. Fielded **May 4–16, 2026**, adults 18+, web or phone, English and Spanish. n = 3,804, MOE ±2.6 points. **DC subsample n = 549, MOE ±5.6**, but no DC rate appears in the text.
- Other figures: children 34% ("34% of children in the DMV experienced food insecurity in the past year"); very low food security 22%; range from 22% (Arlington) to 56% (Prince George's). 2022 baseline was 33%.
- DC-specific, as paraphrased by the page fetch (verify wording before quoting): DC SNAP enrollment fell by 8,812 people (6.3%) between May 2025 and May 2026, and new SNAP time limits took effect in DC on June 1, 2026.

**Launch date:** Sept 15, 2026, at a CSIS event ([CSIS](https://www.csis.org/events/cafb-2026-hunger-report)). NBC4 (Megan McGrath, Sept 15, 2026) and WJLA (Ida Domingo, Sept 15, 2026) cover the 38% and 34% figures, and neither gives a DC-only rate. — [NBC4](https://www.nbcwashington.com/news/local/food-insecurity-at-5-year-high-in-dc-region-hunger-study-says/4154778/); [WJLA](https://wjla.com/news/local/capital-area-food-bank-hunger-report-2026-insecurity-dmv-dc-virginia-maryland-prince-georges-county-arlington-household-finances-cost-of-living-federal-jobs-inflation-immigrant-families-economy)

**2025 trend, CAFB "2025 Hunger Report Briefing" (DC data)**, posted on dcfoodpolicy.org Oct 2025. — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2025/10/CAFB-DC-2025-Data.pdf)
- Key Finding #5 (verbatim): "In DC, food insecurity has been slowly rising since 2023 … Food insecurity has risen from 35% to 40% in Washington DC between 2023 and 2025 … The margin of error is 5.4 percentage points."
- Chart "Food insecurity in DC, 2022-2025": 36% (2022), 35% (2023), 38% (2024), 40% (2025).
- DMV: "As of June 2025, when the survey was fielded, 36% of households in the DMV experienced food insecurity -- nearly unchanged from 37% in 2024, but up from 32% in 2023".
- Key Finding #4 headline: "Food insecurity in DC is more severe than in other jurisdictions".
- Appendix C (Urban Institute for CAFB): SNAP cuts are projected to affect **18,000 DC families**, with an average loss of **$231/month**.

**2025 web report** — [report-2025](https://hunger-report.capitalareafoodbank.org/report-2025/):
- 36% of DMV households, nearly unchanged from 37% (2024), up from 32% (2023).
- Field dates May 19–June 1, 2025; n = 3,712 (±2.7); DC subsample 525 (±5.4).

**Cross-check:** the Grocery Gap 2025 report cites the CAFB 2025 report: "40 percent of households in the District of Columbia and 36 percent of total households in the … (DMV) region face food insecurity". — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf)

### Inferences
- On screen, say "38% of households in the DC region (DMV), 2026". Do not say "38% of DC". For DC itself, use "40% of DC households (2025, ±5.4 pts)".

### Gaps
- No DC-only 2026 rate was found in the report text or in the 2026 news coverage. It may exist in a chart image or in a DC briefing deck that has not been posted yet.
- No ward-level or east-of-river CAFB figures exist in the 2025 or 2026 materials I read.

---

## Q5. "About four-fifths of DC's food-desert area is in Wards 7 and 8" (DC Policy Center)

### Takeaway
**Original found:** Randy Smith, "Food access in D.C is deeply connected to poverty and transportation", D.C. Policy Center, **March 13, 2017**. It states that Ward 8 holds 51% and Ward 7 holds 31% of food-desert area. That sums to 82% **[calc]**; the article's own wording is "more than three-quarters". The lead is supported in substance, but the data are from **2015–2016 and use pre-2022 ward boundaries**. If shown at all, label it "2017 study".

### Cited Findings
- Verbatim, from the [D.C. Policy Center article](https://www.dcpolicycenter.org/publications/food-access-d-c-deeply-connected-poverty-transportation/):
  - "More than three-quarters of the food deserts in D.C. are located in Wards 7 and 8."
  - "By area, the majority (51 percent) of all food deserts are located in Ward 8".
  - "Ward 7 contains the second largest portion of food deserts (31 percent)".
  - "Ward 3 has no areas considered a food desert".
  - "Food deserts make up about 11 percent percent of D.C.'s total area (6.5 square miles)".
- Definition, from the same article: "The walking distance to a supermarket or grocery store is more than 0.5 miles," "Over 40 percent of households have no vehicle available, and" "The median household income is less than 185 percent of the federal poverty level for a family of four."
- Data, from the same article: "American Community Survey, 2015"; store locations from "D.C. Open Data, 2016 and Yelp 2016".
- Secondary versions of the figure vary:
  - DCist (Mar 15, 2017) says Ward 8 holds 46% "by area" — [DCist](https://dcist.com/story/17/03/15/food-desserts-latest/)
  - The DC Policy Center's media page (Mar 17, 2017, WUSA9 coverage) gives 51% and 31% — [DC Policy Center](https://www.dcpolicycenter.org/publications/wusa-channel-9-covers-d-c-policy-centers-study-food-deserts/)
  - The Washington Post (2019) cited 80% (search snippet only; not read).
- **Newer official layer: DC Office of Planning "Low Food Access".** Low-access areas are "estimated to be more than a 10-minute walk from the nearest full-service grocery store". Residents are counted as food insecure if "below 185% of the federal poverty line" and living in a low-access area. The layer's description says "Last updated November 2017". — [DC GIS layer metadata](https://maps2.dcgis.dc.gov/DCGIS/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/61/iteminfo?f=pjson); also on [data.gov](https://catalog.data.gov/dataset/low-food-access-areas)
- The DC Food Policy Council's 2022 Food System Assessment (2023) gives store counts ("four … East of the River") but no food-desert-area share. — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf)

### Inferences
- The "four-fifths" figure is defensible only as "a 2017 D.C. Policy Center analysis found more than three-quarters (51% in Ward 8, 31% in Ward 7) of DC's food-desert area east of the river". It predates Lidl (2022), the Marion Barry Avenue Market (2025) and the 2022 ward redraw. **Recommendation: drop it, or show it with the "2017" label.**

### Gaps
- I found no post-2017 DC Policy Center update. The official OP Low Food Access layer is also 2017-vintage and has no published ward totals.

---

## Q6. ZIP codes covering Wards 7 and 8

### Takeaway
- **Ward 7:** 20019 (all of it), 20020 (part), plus the west-of-river slivers of 20002 and 20003.
- **Ward 8:** 20020 (most of it), 20032 (all of it), plus 20003 (the Navy Yard portion) and several non-residential federal/military ZIPs (20373, 20374, 20375 and others).
- 20024 (Southwest/Buzzard Point) has **no** Ward 7 or Ward 8 addresses.

### Cited Findings
**Source:** DC Master Address Repository (MAR) "Address Points" layer, published by DC OCTO / Department of Buildings. I queried its official ArcGIS REST service on 2026-10-10, counting ACTIVE addresses grouped by WARD and ZIPCODE. Endpoint: `https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/MapServer/0/query` (layer description: "locations and attributes of address points, created as part of the Master Address Repository (MAR)"). — [layer](https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/MapServer/0)

| Ward | ZIP | Active addresses | Residential units (field sum; incomplete) |
|---|---|---|---|
| 7 | 20019 | 15,026 | 17,118 |
| 7 | 20020 | 3,771 | 3,912 |
| 7 | 20002 | 2,111 | 2,092 |
| 7 | 20003 | 1,384 | 1,290 |
| 8 | 20020 | 7,419 | 14,354 |
| 8 | 20032 | 7,303 | 12,855 |
| 8 | 20003 | 596 | 6,777 |
| 8 | 20375 / 20373 / 20374 / 20376 / 20340 / 20593 / 20223 / 20590 / 20388 / 20398 / 20509 | 88 / 74 / 70 / 7 / 4 / 5 / 2 / 1 / 1 / 1 / 1 | 0 |

**How each candidate ZIP splits across wards** (share of residential units **[calc]**):
- 20019 → 100% Ward 7
- 20032 → 100% Ward 8
- 20020 → Ward 8 78.6%, Ward 7 21.4%
- 20003 → Ward 6 61.8%, Ward 8 32.1%, Ward 7 6.1%
- 20002 → Ward 5 48.9%, Ward 6 45.4%, Ward 7 5.7%
- 20024 → Ward 6 (2,380 addresses) and Ward 2 (5 addresses); none in Wards 7 or 8
- 20373, 20374 and 20375 → Ward 8 only, with no residential units

### Inferences
- For an app filter, the core residential ZIPs are 20019, 20020 and 20032. 20002 and 20003 are mostly outside Wards 7/8; their Ward 7/8 portions are the west-of-river additions (Hill East/Capitol Hill and Navy Yard).
- 20373 (Naval Support Facility Anacostia / JBAB area) and 20374 (Washington Navy Yard) are non-residential federal ZIPs. That interpretation is general knowledge and not verified here; the ward assignment comes from the MAR data.
- The residential-unit field is incomplete: Ward 7 sums to 24,412 units against 37,360 ACS households. Use address counts or the qualitative split, not the unit totals.

### Gaps
- I found no official published ZIP-to-ward crosswalk document. The table above is my tabulation of the official MAR data.

---

## Q7. Other headline statistics (population, Low Food Access share, vehicles, SNAP, poverty, USDA atlas)

### Takeaway
Population, SNAP, poverty and car-free household figures by ward come from ACS 2020–2024 and are strong.

Two cautions:
- **Ward 7's car-free share (33.1%) is below the DC average (36.0%).** "No car" is a strong talking point for Ward 8 (43.0%) but not for Ward 7.
- **USDA's atlas changed in July 2026.** It added a new SNAP-retailer-based map (SRAM, 2025 data). The legacy supermarket-based map (LRAM, formerly the Food Access Research Atlas) still uses 2019 stores and 2010 Census population, with an update "expected Winter 2026–27".

### Cited Findings
**Population (ACS 2020–2024, B01003):**
- Ward 7: 90,540 (±3,009)
- Ward 8: 87,724 (±3,508)
- DC: 681,294
- Wards 7+8 = 178,264, or 26.2% of DC **[calc]**

Source: [Census Reporter API](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11). These are ward totals and include the west-of-river areas. Other east-of-river population figures: "over 150,000 residents living East of the River" ([Food System Assessment 2023](https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf)) and "over 160,000 residents" ([East of the River News, June 2025](https://eastoftheriverdcnews.com/2025/06/04/safeway-a-ward-apart/)).

**Households with no vehicle (ACS 2020–2024, B08201; share [calc]):**
- Ward 8: 16,615 of 38,645 = 43.0%
- Ward 7: 12,372 of 37,360 = 33.1%
- DC: 116,851 of 324,491 = 36.0%
- Ward 3: 23.8%; Ward 2: 51.6%; Ward 1: 44.4%

Source: same [API call](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11).

**Households receiving SNAP in the past 12 months (ACS 2020–2024, B22001; share [calc]):**
- Ward 8: 14,866 of 38,645 = 38.5%
- Ward 7: 10,824 of 37,360 = 29.0%
- DC: 46,408 of 324,491 = 14.3%
- Other wards: Ward 1 9.6%, Ward 2 3.6%, Ward 3 2.8%, Ward 4 11.8%, Ward 5 17.2%, Ward 6 6.3%

Source: same API call. Other SNAP figures:
- Citywide administrative figure: "SNAP provides critical support to more than 140,000 D.C. residents" ([Grocery Gap 2025](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf), citing FRAC 2025).
- CAFB 2026: DC SNAP enrollment fell by 8,812 people (6.3%) between May 2025 and May 2026 ([CAFB 2026](https://hunger-report.capitalareafoodbank.org/report-2026/); paraphrased via page fetch).

**Poverty, individuals (ACS 2020–2024, B17001; share [calc]):**
- Ward 8: 26,226 of 85,677 = 30.6%
- Ward 7: 20,153 of 88,069 = 22.9%
- DC: 101,008 of 654,224 = 15.4%
- Ward 3: 7.7%

Source: [Census Reporter API, B17001](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B17001&geo_ids=61000US11007,61000US11008,61000US11003,04000US11).

**USDA Food Access Research Atlas** — [ERS main page](https://www.ers.usda.gov/data-products/food-access-research-atlas), [documentation](https://www.ers.usda.gov/data-products/food-access-research-atlas/documentation) (page "Updated: 7/27/2026"):
- **SRAM:** "SNAP-authorized Retailer Access Map", "Initially released in July 2026". Uses SNAP retailers (STARS) as of June 2025, the 2020 Census, LandScan USA 2020, and ACS 2020–24. Note: it measures access to *any* SNAP-authorized retailer, not only supermarkets.
- **LRAM:** "Large Retailer Access Map", formerly FARA, "Last updated in 2021", "Next update expected Winter 2026–27". Uses the 2019 supermarket list (stores authorized as of June 15, 2019), **2010 Census population**, and ACS 2014–18.
- Definitions: low-income means a poverty rate of 20% or more, or median family income at or below 80% of the state/metro median. Low-access (urban) means more than 0.5 or 1 mile from a store.
- Data files on the [download page](https://www.ers.usda.gov/data-products/food-access-research-atlas/download-the-data):
  - SRAM 2025: XLSX 107.39 MB / ZIP 18.06 MB, dated 7/27/2026
  - LRAM 2019: XLSX 81.83 MB / ZIP 8.65 MB, dated 4/27/2021

**DC official Low Food Access layer:** Office of Planning, "Last updated November 2017"; 10-minute-walk definition; no ward totals published. — [metadata](https://maps2.dcgis.dc.gov/DCGIS/rest/services/DCGIS_DATA/Public_Service_WebMercator/MapServer/61/iteminfo?f=pjson)

**WIC (older, 2023 report):** "Nearly three out of every four WIC customers live in Wards 4 (22.8%), 7 (17.2%), and 8 (30%)." — [Food System Assessment 2023](https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf)

### Inferences
- **For the pitch:** the legacy USDA "food desert" (LRAM/FARA) map still uses 2010 population and a 2019 store list. It predates Lidl Skyland (2022), the Marion Barry Avenue Market (2025) and the 2022 ward redraw. DC's own Low Food Access map is from 2017. This is a defensible "the official maps are stale" argument.
- The new USDA SRAM counts corner stores and other SNAP retailers. It will probably show *less* low access in DC than a supermarket-based measure, so be careful which USDA map you cite.

### Gaps
- **DC low-income/low-access tract counts:** I did not compute these from either USDA file, because that requires downloading the XLSX/ZIP files above (LRAM ZIP 8.65 MB or SRAM ZIP 18.06 MB from ers.usda.gov). I can compute them if the user approves the download.
- **Share of residents in DC's official Low Food Access Areas by ward:** no published figure exists. It would need a spatial join of the 2017 OP layer with ward boundaries, which I did not do.
- **SNAP participation by ward from administrative data (DC DHS):** not found. Only the ACS household-receipt figures above.

---

## Could not verify

- **DC Health Matters / Claritas 2025 median household income** (Ward 7 ≈ $57,900, Ward 8 ≈ $50,900, Ward 3 ≈ $153,300, DC ≈ $106,000). What I tried:
  - dchealthmatters.org failed with a TLS unrecognized-name error.
  - The test mirror test-washingtondc.thehcn.net returned HTTP 401.
  - D.C. Hunger Solutions states the portal is "no longer active".
  - The values match search-engine snippets of the test mirror exactly (Ward 7 $57,940; Ward 8 $50,855; Ward 3 $153,348; DC $106,049; "Claritas, updated May 2025"), but there is no readable primary page.
  - **Use ACS 2020–2024 instead** (Q3).
- **CAFB 2026 DC-specific food insecurity rate.** What I tried:
  - Read the full 2026 web report text (both halves of the page).
  - Read NBC4 and WJLA coverage.
  - Searched for a 2026 DC briefing on dcfoodpolicy.org.
  - Only the DMV figure (38%) and the DC subsample size (n = 549) were found.
- **Ward-level or east-of-river CAFB figures:** none exist in the 2025 or 2026 materials read.
- **A 2026 Grocery Gap update:** none exists as of 2026-10-10 (checked the dchunger.org homepage and searched news).
- **Exact identity of Ward 7's third and Ward 8's fourth full-service store:** not named in the 2025 report. Lidl Skyland and the Navy Yard Harris Teeter are inferences from the 2023 Food System Assessment and FRAC 2022.
- **News coverage of the 2025 report by the Washington Post, WAMU/DCist, Axios DC, Washington Informer or Greater Greater Washington:** none found in searches. AFRO coverage exists but returned 403.
- **Civil Eats (May 13, 2026) quote** from Marion Barry Avenue Market founder Chris Bradshaw that there are "only two other full-service grocery stores in Ward 8, for more than 75,000 people": seen only in a search summary; the page returned 403. This conflicts with the report's Ward 8 = 4 (it may exclude Navy Yard).
- **Washington Post 2019 "80 percent" citation of the DC Policy Center study:** search snippet only. The original study (2017) is verified instead.
- **DMPED FY22 Food Access Fund claim** that new food access points would put "95–99%" of Ward 7/8 residents within a mile of one: seen only in a search summary. It is a projection, not a measurement, and I did not read the RFA PDF.
- **Official effective date of the 2022 ward boundaries:** the DC Council page confirms only the Dec 21, 2021 final-vote scheduling. The report's "June 2022 redistricting" wording likely refers to the completion of ANC/SMD redrawing. Not resolved.
