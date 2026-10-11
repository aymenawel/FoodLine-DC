# Findings: grocery and food access east of the Anacostia (Wards 7 & 8)

Accessed and checked 2026-10-10. This file is the source of truth for every number in the app. Detailed notes with verbatim quotes are in `research/notes/Food access east of the Anacostia/`; the map data pipeline is documented in `data/geo/README.md`.

## 1. Numbers cleared for the screen

| ID | On screen | Value | Source (publisher, title, date) | Status |
|---|---|---|---|---|
| S1 | Full-service grocery stores east of the river | **5 of 80** in DC (Ward 7: 3, all east of the river; Ward 8: 2 of its 4 are east) | D.C. Hunger Solutions, *Minding the Grocery Gap in D.C.: A 2025 Update*, Nov 2025, pp. 6–7 — [PDF](https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf) | Cleared |
| S2 | Stores by ward | Ward 3: 17 · Ward 7: 3 · Ward 8: 4 (W1 13, W2 13, W4 11, W5 9, W6 10) | same PDF, p. 6; [press release, Nov 19, 2025](https://www.dchunger.org/uncategorized/residents-in-wards-7-and-8-still-have-limited-access-to-grocery-stores-d-c-hunger-solutions-report-finds/) | Cleared |
| S3 | Ward 8 households on SNAP | 38.5% (Ward 7 29.0%, DC 14.3%, Ward 3 2.8%) | U.S. Census Bureau ACS 2020–2024 5-year, B22001, via [Census Reporter API](https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11) | Cleared (ward totals include west-of-river parts) |
| S4 | Ward 8 households with no car | 43.0% (Ward 7 33.1%, DC 36.0%) | ACS 2020–2024, B08201 (same link) | Cleared for Ward 8 only — Ward 7 is below the DC average |
| S5 | Median household income | Ward 8 $52,769 ±4,643 · Ward 7 $71,088 · Ward 3 $144,877 · DC $109,870 | ACS 2020–2024, B19013 (same link) | Cleared (replaces the Claritas figures, see §2) |
| S6 | DC households food insecure | 40% in 2025 (36% 2022, 35% 2023, 38% 2024), ±5.4 pts | Capital Area Food Bank, *2025 Hunger Report* DC briefing — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2025/10/CAFB-DC-2025-Data.pdf) | Cleared |
| S7 | DC-region households food insecure | 38% in 2026, "a five-year high" | CAFB, *Hunger Report 2026*, launched Sept 15, 2026 — [report](https://hunger-report.capitalareafoodbank.org/report-2026/) | Say "DC region (DMV)", never "DC" |
| S8 | People east of the river | "over 150,000 residents" | DC Food Policy Council, *Food System Assessment* (2023) — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf) | Cleared |
| S9 | Office of Planning count | "only 4 [full-service stores] for the 158,000 residents living east of the Anacostia River" (64 citywide, April 2024) | DC Food Policy Council & Office of Planning, *Food Access & Food Economy Report FY2024*, transmitted Sept 9, 2025 — [PDF](https://dcfoodpolicy.org/wp-content/uploads/2025/09/FY24-Food-Access-Food-Economy-Report.pdf) | Cleared as a 2024 figure (the 5th store opened Sept 2025) |
| S10 | Our own count from Open Data DC | 78 stores operating in 2026; 4 east of the river (Safeway 2845 Alabama Ave SE, Safeway 322 40th St NE, Lidl 2224 Town Center Dr SE, Giant 1535 Alabama Ave SE). Ward 8's other two dataset stores (Whole Foods 101 H St SE, Harris Teeter 401 M St SE) are in Navy Yard, west of the river. | Open Data DC *Grocery Store Locations* (revised 2026-08-20) + DC GIS *East of the River* polygon — `data/geo/stats.json` | Cleared. The dataset does not yet include the Marion Barry Avenue Market (1303 Marion Barry Ave SE, opened Sept 27, 2025), which DCHS counts — so ours is 4, theirs is 5. The map adds that market as a 5th dot and says so. |
| S11 | Residents in DC's low food access areas east of the river | 126,582 (65,189 below 185% of poverty) | Open Data DC *Low Food Access Areas*, fields PARTPOP2 / PRTUND185 | Use with caveat: the layer is a **2017** analysis on pre-2022 ward lines |

**Ward 8 nuance (why the ward count overstates access).** The June 2022 redistricting moved Navy Yard into Ward 8. D.C. Hunger Solutions: "In Ward 8, just two full-service grocery stores are located east of the Anacostia River -- one being the recently opened Marion Barry Avenue Market" (p. 6–7).

**ZIP codes.** Ward 7: 20019 (all), 20020 (part), small parts of 20002 and 20003. Ward 8: 20020 (~79%), 20032 (all), 20003 (Navy Yard part), and non-residential federal ZIPs (20373, 20374, 20375). East-of-river share of each ZIP area is computed in `web/data/places.json`.

## 2. Numbers not to show

| Lead | Why |
|---|---|
| Claritas/DC Health Matters 2025 incomes ($57,900 / $50,900 / $153,300 / $106,000) | DC Health Matters is offline; values match only search snippets. D.C. Hunger Solutions itself says the portal "is no longer active". Use ACS (S5). |
| "38% of DC" food insecure | 38% is the DMV region (S7). No DC-only or ward-level 2026 figure was published. |
| "Four-fifths of DC's food-desert area is in Wards 7 and 8" | D.C. Policy Center, Mar 13, 2017 (Ward 8 51% + Ward 7 31%), 2015–16 data, old wards. Too old; our own area share from the 2017 DC layer is 32.6% (Wards 7+8, area-weighted), so the claims are not comparable. Dropped. |
| A 2026 Grocery Gap update | None published as of 2026-10-10. |
| DCHS 2024→2025 income/poverty "changes" | Artifact of a data-source switch (DC Health Matters → ACS), not a trend. |

## 3. The grocery gap east of the river: a short history

- **Dec 6, 2007:** Giant opens at Camp Simms, 1535 Alabama Ave SE — "the first grocery store built in Ward 8 in decades" ([DMPED](https://dmped.dc.gov/release/fenty-giant-open-first-new-grocery-store-ward-8)).
- **2016:** Walmart withdraws from Capitol Gateway (East Capitol St & 58th St NE, Ward 7) ([DCist, Jan 28, 2022](https://dcist.com/story/22/01/28/bowser-plans-to-use-eminent-domain-to-bring-grocery-store-to-long-vacant-lot-east-of-the-anacostia-river/)).
- **Nov 2021:** Good Food Markets opens in Bellevue, Ward 8's second full-service store ([DCist](https://dcist.com/story/21/11/13/ward-8-gets-a-second-supermarket/)); it closes about a year later ([Washington Informer](https://www.washingtoninformer.com/litigation-stalls-replacement-for-fresh-food-grocer-anc-commissioner-says/)).
- **2022:** The city moves to take Capitol Gateway by eminent domain; Giant signs a tentative deal (DCist, above).
- **Sept 27, 2022:** Lidl opens at Skyland Town Center, "the first full-service grocery store to open East of the River in more than a decade" ([DMPED](https://dmped.dc.gov/release/mayor-bowser-celebrates-grand-opening-dc%E2%80%99s-first-lidl-food-market)).
- **2021–2024:** The Food Access Fund distributes more than $23M of federal ARPA money; with ARPA expiring at the end of 2024 its future is "uncertain" ([FY2024 report](https://dcfoodpolicy.org/wp-content/uploads/2025/09/FY24-Food-Access-Food-Economy-Report.pdf)).
- **2025:** DC's FY2026 budget repeals "Give SNAP a Raise," the local SNAP supplement ([DC Food Policy Council, Aug 6, 2025](https://dcfoodpolicy.org/2025/08/06/what-is-in-the-fy2026-district-budget-for-dc-food-system/)). Under the federal H.R. 1 law, about 17,000 DC SNAP participants are at risk of losing benefits ([DCHS, June 25, 2026](https://www.dchunger.org/?p=4473)).
- **Sept 27, 2025:** Dreaming Out Loud opens the Marion Barry Avenue Market & Cafe in Anacostia (DCHS 2025, p. 8).
- **Sept 17, 2026:** The city now owns Capitol Gateway, but the Giant deal "has fallen apart"; the city is looking for a new grocer ([The 51st](https://51st.news/capitol-gateway-marketplace-grocery-store-ward-7/)).

The pattern for the pitch: store fixes take years and are fragile. Between openings, nobody measures where people are actually asking for food.

## 4. Existing tools and why they fall short

| Tool | What it does | Gap |
|---|---|---|
| CAFB "Get Help" map, findhelp.org | Web search for pantries | Needs a smartphone or browser; no demand signal |
| DC 211 Warmline | Phone referrals, Mon–Fri 9–5 ([FAQ](https://211warmline.dc.gov/page/211-faqs)) | Business hours only; no DC text line found |
| Propel app | SNAP balance + EBT store map | Smartphone app; no pantries |
| USDA summer meals text line (FOOD/COMIDA to 304-304) | Texts back nearby sites | Summer-only, children's meals only; no published demand data |
| DC Low Food Access layer, USDA Food Access Research Atlas | Planning maps | 2017 (DC) and 2019 stores / older census population (USDA, [atlas](https://www.ers.usda.gov/data-products/food-access-research-atlas)); measure supply, not requests |

**Defensible "what's new" sentence:** *We found no tool in DC that works by text on any phone, all year, and turns each request into an anonymous, real-time signal of where need is going unmet.* (Do not say "no tool exists"; FoodFinder and GetCalFresh were not researched.)

## 5. Open datasets used (Open Data DC, CC BY 4.0)

Grocery Store Locations (revised 2026-08-20), Low Food Access Areas (2017 analysis; page shows 2023 edit), Farmers Market Locations, Healthy Corner Stores, Wards from 2022, DC boundary, East of the River, Waterbodies, ZIP codes, Neighborhood Labels and Clusters, Intersection Points (Wards 7–8), Metro bus stops. URLs, dates, counts and processing: `data/geo/README.md`.

## 6. Food resource directory

`data/resources.json` — **50 curated entries** east of the river: 5 grocery (incl. the small Marion Barry Avenue Market), 10 farmers markets, 8 mobile markets, 4 free markets, 16 pantries, 7 Healthy Corners stores. 20 high / 30 medium confidence. `data/resources-extended.json` — 65 more (35 Joyful Food Market schools, 22 corner stores, 7 monthly-only pantries, 1 west-of-river Safeway).

**Hand-check before the event (most important first):**
1. All 16 CAFB partner pantries — hours are partner-reported; call ahead. Salvation Army Solomon G. Brown is appointment-only; Assumption Outreach serves Ward 8 residents only; Atonement's schedule conflicts between directories.
2. Seasonal markets: most FRESHFARM / Dreaming Out Loud markets end Nov 21, 2026; THEARC Food & Farm Fridays end Nov 13; DPR Lederer giveaway ends Nov 25. Ward 8 Farmers Market may already be closed for the season (sources say Sept or Oct).
3. Marion Barry Avenue Market Sunday hours (sources disagree; encoded closed).
4. Arcadia mobile market stop addresses and start time (2:30 vs 3:00).
5. Healthy Corners hours are unknown for all corner stores (shown as "Call ahead for hours").
6. Bread for the City document rules (ID, proof of address) are not on its site.

## 7. Real SMS: feasibility and cost (for judge Q&A)

- Twilio: $0.0083 per SMS segment each way + carrier fees ~$0.0025–0.005; local number $1.15/month ([pricing](https://www.twilio.com/en-us/sms/pricing/us)). Telnyx: ~$0.004/segment, $1/month.
- A2P 10DLC registration (required for app-to-person texting on local numbers): brand fee ~$4.50–$46, campaign vetting $15, then $1.50–$10/month; reviews take ~10–15 days. Toll-free verification ~1–3 weeks; short codes 6–10+ weeks and $1,000+/month.
- Our estimate: ~$0.03–0.05 per request (1 inbound + a 3-segment reply), i.e. roughly $300–500 per 10,000 requests.
- Privacy: the app's `/api/sms` webhook hashes the phone number in memory only to keep the conversation; it never writes it. Twilio itself retains message data; Message Redaction can mask numbers and bodies.
- Language: ~8.7% of DC households speak Spanish at home; DC's Language Access Act (2004) requires translation for groups of 3% or 500 people served.

## 8. Could not verify

- Claritas/DC Health Matters 2025 incomes (portal offline).
- A DC-only or ward-level figure in CAFB's 2026 report.
- Exact closing date of Good Food Markets Bellevue.
- DMPED "$73M invested" vs "$23M+ distributed" for the Food Access Fund.
- Ward-level Spanish / limited-English shares from official ACS (only a low-confidence commercial estimate: ~5% Ward 7, ~4% Ward 8).
- Whether DC actually made locally funded November 2025 SNAP payments during the federal shutdown.
- Community fridges east of the river active in 2026 (newest source 2021 — excluded).
- The Farm at Fort Stanton's 2026 schedule (excluded).
