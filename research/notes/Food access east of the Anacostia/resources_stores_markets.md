# Stores, markets and Healthy Corners east of the Anacostia: verification notes

Data file: `resources_stores_markets.json` (48 entries, last verified 2026-10-10).

- **By type:** 6 grocery, 10 farmers_market, 3 mobile_market, 29 corner_store, 0 produce_plus_site.
- **By confidence:** 16 high, 32 medium, 0 low.
- **Count vs. target:** the total is above the 18-28 target. All 29 DC Central Kitchen Healthy Corners stores east of the river were kept because each is confirmed by DCCK's own April 2026 list. To trim, filter `type == "corner_store"`. Keeping only stores with SNAP Match leaves 25 (all except Dollar Plus Penn Ave, E Market, Minnesota Big Market and Alabama Convenience).

## Main sources

- **DC Health "2026 DC Farmers' Markets" guide** (July 2026, hosted by FRESHFARM): https://www.freshfarm.org/app/uploads/2026/07/2026-Farmers-Market-Mini-Guide.pdf. It gives market day, time and season by month, plus SNAP / Produce Plus-Senior-WIC FMNP / Matching icons. The icons were read visually from the rendered PDF.
- **DCCK Healthy Corners participating-store PDF**, updated 2026-04-28 (PDF created 2026-04-28): https://dccentralkitchen.org/wp-content/uploads/2026/04/Website-Copy-of-HC-Store-List-w-benefits-updated-4.28.26.pdf. The SNAP / SNAP Match / WIC checkmarks were extracted from the PDF's image positions and cross-checked against the rendered page.
- **USDA FNS SNAP retailer location data** (ArcGIS feature service, last edited 2026-10-07): used to confirm SNAP authorization at each store address.
- **Open Data DC layers:**
  - Farmers Market Locations (created 2026-06-09, edited 2026-09-27)
  - Grocery Store Locations (has a PRESENT26 flag)
  - Healthy Corner Store (2024 edition): used for some wards and one fallback coordinate.
- **Operator pages:**
  - Giant, Lidl and Safeway store pages (hours, phone)
  - FRESHFARM market pages (exact 2026 dates)
  - Dreaming Out Loud farmers-markets and market pages
  - Arcadia 2026 Mobile Market schedule and its public Google Calendar (ICS)
  - Ward 8 Farmers Market site
- **Coordinates:** US Census geocoder for 46 entries; Open Data DC for 2 (Ken Mart: no Census match; Bellevue Library: Census matched the wrong quadrant, SE instead of SW). All points fall inside the DC bounding box. A DC Ward 2022 point-in-polygon check agreed with every ward value filled in.

## Entries

### Grocery (6)

- **giant-alabama-ave-se** (high): Giant store page gives 7am-9pm daily and the phone. SNAP per USDA (Oct 2026). WIC per an older DC Health list. Ward 8 per Open Data DC.
- **lidl-skyland-town-center** (high): Lidl store page gives 8am-9pm daily. SNAP per USDA. WIC unknown. Ward 7.
- **safeway-alabama-ave-se** (high): Safeway page gives 6am-10pm and lists SNAP/EBT/WIC/eWIC. SNAP also confirmed by USDA. Ward 7.
- **safeway-40th-st-ne** (high): Safeway page gives 6am-10pm and lists SNAP/WIC. This is the Benning Rd / Minnesota Ave Safeway. Ward 7. USDA data shows only two Safeways east of the river (this one and Alabama Ave); no "Hayes St" Safeway exists.
- **dol-marion-barry-avenue-market** (medium): Small Dreaming Out Loud market and cafe, opened Sept 2025, so not a full-service supermarket. DOL pages give Wed-Sat 8am-7pm, but the two pages disagree about Sunday. SNAP-authorized per USDA (Oct 2026).
- **safeway-14th-st-se-hill-east** (high): The single just-across-the-line store (Ward 6, Hill East, 5am-midnight, SNAP/WIC). It was included as a judgment call because it is the nearest supermarket across the Pennsylvania Ave bridge. No source was found saying east-of-river residents commonly use it.

### Farmers markets (10)

- **freshfarm-thearc** (high): Sat 10-2, 2026-06-06 to 2026-11-21. FRESHFARM page and DC Health guide agree.
- **freshfarm-anacostia-community-museum** (high): Farm stand, Sat 10-2, 2026-04-18 to 2026-11-21.
- **freshfarm-minnesota-ave** (high): Thu 1-4, 2026-06-04 to 2026-11-19, in the 322 40th St NE (Safeway) lot.
- **freshfarm-kenilworth-rec-center** (high): Sat 9-1, 2026-06-06 to 2026-11-21.
- **freshfarm-cesar-chavez** (high): Sat 9-1, 2026-06-06 to 2026-11-21, Parkside.
- **freshfarm-simon-elementary-farm-stand** (high): Thu 2:30-5:30, 2026-05-07 to 2026-11-19. It is at a school, and public access is not stated.
- **dol-kelly-miller-farmers-market** (high): DOL page says Saturdays June 6 - Nov 21 (2026), 10am-1pm. Benefit icons from the DC Health guide.
- **dol-anacostia-farmers-market** (high): DOL page says Saturdays June 6 - Nov 21, 11am-2pm, at 1303 Marion Barry Ave SE. The DC Health guide and Open Data DC say 1301.
- **ward-8-farmers-market** (medium): The DC Health 2026 guide and the Open Data DC 2026 layer give Sat 10-2, June-October. The market's own undated site says June-September. Exact dates unknown.
- **udc-east-capitol-farmers-market** (medium): In the DC Health 2026 guide (Sat 10-3, May-Oct, Produce Plus icon only). No operator page was found (the linked page returns 404). SNAP is set to "unknown" because sources conflict.

### Mobile markets (3, all Arcadia, confirmed by Arcadia's 2026 schedule and calendar)

- **arcadia-mobile-market-parkside-mayfair** (high): Wed 3-5 (the web page says 2:30), weekly since 2026-05-20.
  - The address is given three ways: 600 Kenilworth Ter NE (Arcadia page), "600 Kenilworth Avenue NE" (Arcadia calendar) and 650 Kenilworth Ter NE (DC Health guide).
- **arcadia-mobile-market-oxon-run** (high): Thu 10:30-12:30, weekly since 2026-05-21.
  - Arcadia gives 3700 9th St SE; the DC Health guide gives Wheeler Rd & Valley Ave SE (about 220 m away).
- **arcadia-mobile-market-bellevue-library** (high): Thu 3-5 (the web page says 2:30), weekly since 2026-05-21, at 115 Atlantic St SW.
  - Coordinates come from Open Data DC (see "Main sources").

Arcadia's season end is not published; the DC Health guide says May-December. For this reason `season` is null for these three.

### Corner stores: DCCK Healthy Corners (29, all medium)

All 29 are on DCCK's 2026-04-28 list and, except E Market, also appear in USDA SNAP data at the same address. Hours are unknown for every store.

**Ward 7 (10):**

- **hc-a-1-grocery** (615 Division Ave NE): SNAP, Match and WIC checked.
- **hc-circle-seven-express** (740 Kenilworth Ave NE): SNAP and Match.
- **hc-dollar-plus-division-ave** (609 Division Ave NE): SNAP and Match. Ward null; the DC boundary check puts it in Ward 7.
- **hc-dollar-plus-pennsylvania-ave** (2529 Pennsylvania Ave SE): SNAP only.
- **hc-e-market** (4202 Benning Rd NE): no checks on the DCCK list. USDA lists "Menkem LLC" at this address, so SNAP is "unknown".
- **hc-ken-mart** (1507 Kenilworth Ave NE): SNAP and Match. Coordinates from Open Data DC.
- **hc-menicks-market** (4401 Nannie Helen Burroughs Ave NE): SNAP and Match. Ward null (Ward 7 by the DC boundary check).
- **hc-minnesota-big-market** (2924 Minnesota Ave SE): SNAP. Formerly "G&G Market".
- **hc-texas-avenue-convenience** (4350 Texas Ave SE): SNAP and Match.
- **hc-thomas-and-sons-food-market** (3425 Benning Rd NE): SNAP and Match.

**Ward 8 (19):**

- **hc-alabama-convenience** (2209 Alabama Ave SE): SNAP. Ward null (Ward 8 by the DC boundary check).
- **hc-best-convenience-store** (1535 U St SE): SNAP and Match. Ward null (Ward 8 by the DC boundary check).
- **hc-chesapeake-big-market** (601 Chesapeake St SE): SNAP, Match and WIC.
- **hc-dc-food-market** (2200 16th St SE): SNAP and Match.
- **hc-elmira-market** (4401 South Capitol St SW): SNAP, Match and WIC.
- **hc-fort-drum-market** (4686 MLK Jr Ave **SW**; DCCK writes SE): SNAP, Match and WIC.
- **hc-grubbs-southeast-pharmacy** (1800 MLK Jr Ave SE): SNAP, Match and WIC. It is a pharmacy/mini-mart.
- **hc-holiday-market** (3509 Wheeler Rd SE): SNAP and Match. USDA lists the address as "Ram Grocery".
- **hc-liffs-market** (600 Alabama Ave SE): SNAP and Match.
- **hc-mellon-market** (2921 MLK Jr Ave SE): SNAP and Match.
- **hc-nams-market** (1327 W St SE): SNAP and Match.
- **hc-quality-convenience-store** (2922 MLK Jr Ave SE; USDA writes "2922 1/2"): SNAP and Match. Ward null.
- **hc-shipley-super-market** (2283 Savannah St SE): SNAP, Match and WIC.
- **hc-stanton-supermarket** (1453 Howard Rd SE): SNAP, Match and WIC. DCCK highlights a produce expansion here.
- **hc-surprise-grocery** (2233 Minnesota Ave SE): SNAP and Match.
- **hc-the-fresh-food-factory** (1110 Oak Dr SE): SNAP and Match. It moved from 1231 Good Hope Rd SE. Ward null.
- **hc-top-mart** (3109 MLK Jr Ave SE): SNAP and Match.
- **hc-wheeler-market** (4133 Wheeler Rd SE): SNAP and Match.
- **hc-zemen-market** (2401 MLK Jr Ave SE): SNAP and Match. Formerly "Service Quick".

**SNAP Match** (from DCCK's benefit-programs page): add one piece of produce (50 cents or more) to any EBT purchase and get a $5 produce coupon, up to 2 coupons per day.

## Excluded, and why

- **"The Farm at Fort Stanton":** no 2026 source found. DOL's 2026 farmers-markets page lists only the Anacostia and Kelly Miller markets. The only "DOL Fort Stanton Market" item found is a July 2024 online-ordering promo. The FRESHFARM Anacostia Community Museum farm stand (1901 Fort Pl SE, next to Fort Stanton Park) may be what was meant, and it is included.
- **Curbside Groceries (mobile grocer):** its weekly schedule lists 5 SE stops:
  - Tue: 820 & 800 Southern Ave SE
  - Wed: 3600 B St SE
  - Fri: 4660 MLK Jr Ave SE and 3418 4th St SE

  The schedule is undated (site copyright 2020), so a 2026 schedule could not be confirmed. DCCK's April 2026 list does name Curbside Groceries as a participating partner that accepts SNAP. **Candidate to add after a phone or social-media check.**
- **Produce Plus distribution sites:** none published for 2026.
  - The program now uses a benefit card ($40/month, June 1 - Nov 30); approved participants activate it at "card activation locations" that are not listed publicly.
  - Produce Plus redemption sites are the markets in the 2026 guide, already in the data with `produce_plus: true`.
  - Hotline: (202) 888-4834.
- **"Grocery on the go" bus:** no evidence found. My web-search quota ran out late in the session, so this was not fully re-checked.
- **ALDI:** there is no ALDI east of the river in USDA data. The nearest, 901 17th St NE, is in Ward 5 and its store page only loads with JavaScript, so its hours could not be verified.
- **Harris Teeter (401 M St SE) and Whole Foods (101 H St SE):** both are in **Ward 8 under the 2022 boundaries** but sit in Navy Yard, west of the river. Only one just-across store was used. If the app's computed ward filter is used, note that Navy Yard counts as Ward 8.
- **Closed or not public:**
  - Good Food Markets, 4001 S Capitol St SW: Open Data DC marks it not present 2024-2026.
  - Yes! Organic, 2323 Pennsylvania Ave SE: closed.
  - Bolling commissary: military only.
- **Healthy Corners sites that are not stores:**
  - DCCK Café at THEARC (1901 Mississippi Ave SE)
  - Nationals Youth Baseball Academy stand (3675 Ely Pl SE)

  Both have no benefit checkmarks.
- **Stores in the 2024 Open Data DC Healthy Corners layer but not on DCCK's April 2026 list:**
  - Dan Akil Convenience, 1223 Good Hope Rd SE
  - Night N Day 24 Hour Store, 5026 Benning Rd SE
  - Secrets of Nature, 3923 S Capitol St SW
  - Dollar Plus Food Mart (Central), 5575 Central Ave SE
  - Minnesota Food Mart, 3728 Minnesota Ave NE
  - Economy Market, 1804 D St NE: "temporarily closed" in 2026 and west of the river
  - The Cupboard, 1504 E Capitol St NE: west of the river
- **SNAP-authorized farm outlets in USDA data with no 2026 public schedule** (not in the DC Health guide):
  - Educare Parkside Market
  - FRESHFARM Educare Idea Market (4501 Lee St NE)
  - Freshfarm Kiddies Ms (1130 Varney St SE)
  - K Fresh Market (2726 MLK Jr Ave SE)
  - Minnesota Ave Farmers' Market (4701 Minnesota Ave NE)
  - House of Ruth Family Share
  - Royal Oats Farms
  - Souf East Earthlings
- **Out of area:**
  - RFK Open Air Market (2615 Benning Rd NE): in the 2026 guide but west of the river.
  - Arcadia's Wah Luck and Sibley stops.
- **Covered by the other researcher:** Martha's Table, Joyful Food Markets, CAFB, Bread for the City, free markets, pantries and community fridges.

## Please hand-check

1. **Ward 8 Farmers Market.** Is it still running in October 2026? The DC Health guide says June-October; its own site says June-September. Phone 202-549-4786.
2. **UDC East Capitol Farmers Market.**
   - Does it accept SNAP? The guide shows no SNAP icon, but Open Data DC lists SNAP.
   - Does it end in October or November?
   - Is it operating at all? No operator page was found.
3. **Marion Barry Avenue Market.** Check Sunday hours (DOL pages conflict) and whether it accepts WIC or Produce Plus.
4. **Arcadia stop locations and times.**
   - Parkside: 600 vs 650 Kenilworth Ter NE.
   - Oxon Run: 3700 9th St SE vs Wheeler & Valley.
   - Start time 2:30 vs 3:00 at Parkside and Bellevue.
5. **DOL Anacostia market address.** 1303 vs 1301 Marion Barry Ave SE.
6. **Corner stores.**
   - All hours are unknown.
   - Holiday Market vs "Ram Grocery": confirm the storefront name.
   - E Market: does it accept SNAP?
   - Fort Drum Market: confirm the SW quadrant.
   - The Fresh Food Factory: confirm the move to 1110 Oak Dr SE.
7. **Grocery WIC status.** Giant's WIC status comes from an old (c. 2019-2020) DC Health list; Lidl's is unknown.
8. **Simon Elementary farm stand.** Is it open to the public?
9. **WIC at farmers markets and Arcadia.** `wic: true` means WIC Farmers Market Nutrition Program benefits, not necessarily the regular eWIC card.
10. **Data-format items.**
    - Safeway 14th St SE closes at midnight and is encoded as `"24:00"`; check the app's time parser.
    - `ward` is null for 6 corner stores, because no source states a ward for them. The DC Ward 2022 check puts them in Ward 7 (2) and Ward 8 (4).
