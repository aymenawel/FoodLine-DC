# Free food resources east of the Anacostia (Wards 7 & 8) -- verification notes

Compiled 2026-10-10 for `resources_free_food.json` (67 entries). Scope: free food only (pantries, free markets, mobile markets, fridges, meal sites). Grocery stores, farmers markets, Healthy Corners and Produce Plus are covered by another researcher.

**Counts** -- by type: free_market: 39, pantry: 23, mobile_market: 5. By confidence: high: 5, medium: 62. Geocoding: census-geocoder: 60, open-data-dc: 7.

## How fields were filled

- **Coordinates**: US Census one-line geocoder (Public_AR_Current). Every address was also checked against DC MAR address points (DC GIS `Location_WebMercator/MapServer/0`); all 66 distinct addresses exist in MAR and Census points were within ~260 m of MAR. Where Census failed (renamed Marion Barry Ave, 3600 Alabama Ave SE) or matched the wrong street/quadrant (301 53rd St SE matched NE; 3845 South Capitol St SW matched the SE side; 4399 South Capitol Ter SW matched South Capitol St), the MAR point was used (`geocode_source: "open-data-dc"`). All points are inside DC's bounding box and inside DC GIS's "East of the River" polygon.
- **Ward**: from the source when stated (CAFB map, DPR, operator); otherwise from the DC MAR address point (noted in each entry). No conflicts between CAFB wards and MAR wards.
- **Neighborhood**: derived, not operator-stated -- the nearest DC Office of Planning "Neighborhood Names" label point within the DC neighborhood cluster that contains the point (DC GIS). Treat as approximate.
- **SNAP/WIC/Produce Plus**: set to `false` for every entry because the food is free (no payment); not a statement about the operator's other programs.
- **Languages**: no source stated languages, so `["en"]` is a default everywhere.
- **CAFB entries**: from CAFB's "Get Help Map 2026" ArcGIS app (item d60aa14515d24ac494b37a42aa3dec9c, created Mar 2026) and its source layer `Get_Help_Map_Source_Data` (last edited 2026-09-28). These are partner-reported, so they are rated **medium** unless the operator corroborates.
- **Joyful Food Markets**: Martha's Table publishes no public school list or schedule (its page says "Reach out to your child's school" and "Hours vary based upon school schedule"). The sites and 2026 dates come from Martha's Table's own volunteer scheduling site (volunteer.marthastable.org, Galaxy Digital) -- each school has a listing with the school address and its upcoming shift dates. Shift windows include setup, so **public market hours are unknown** (`hours: null`, confidence medium). Addresses were cross-checked with the DC GIS public/charter school layer (edited Sep 2026) and DCPS's SY2026-27 swing-space table.

## Martha's Table, Bread for the City, other operator-confirmed sites (5)

| id | name | address | conf. | verification |
|---|---|---|---|---|
| marthas-table-market-the-commons | Martha's Table Market at The Commons | 2375 Elvans Rd SE, Washington, DC 20020 | high | Operator markets page (Mon-Fri 11-4, registration with photo ID, twice monthly) + operator 2026 events calendar listing daily market dates through Oct 30, 2026. |
| bread-for-the-city-southeast-food-pantry | Bread for the City Southeast Center Food Pantry (Michelle Obama Southeast Center) | 1700 Marion Barry Ave SE, Washington, DC 20020 | high | Operator food page with Oct 12, 2026 closure notice: Mon-Thu 9-3, once per month, DC households; also on CAFB map 2026 ("DC Residents Only"). |
| bread-for-the-city-southeast-free-farmers-market | Bread for the City Southeast Free Farmers Market | 1700 Marion Barry Ave SE, Washington, DC 20020 | high | Operator food page (2nd/4th/5th Fridays 9am) + 2026 events calendar (Oct 23, Dec 11, 2026, 9-12). |
| thearc-farm-food-and-farm-fridays | Food and Farm Fridays at THEARC Farm (Building Bridges Across the River) | 1901 Mississippi Ave SE, Washington, DC 20020 | high | Operator (Building Bridges/THEARC Farm) 2026 event calendar: Fridays 12-2pm through Nov 13, 2026; also on CAFB map. |
| dpr-lederer-gardens-veggie-giveaway | DPR Weekly Veggie Giveaway at Lederer Gardens | 4801 Nannie Helen Burroughs Ave NE, Washington, DC 20019 | high | DC DPR 2026 page + registration page: Wed 11-12 and Sat 10-11, May 12-Nov 25, 2026, Ward 7. |

## CAFB partner pantries and CAFB mobile markets (CAFB Get Help Map 2026) (27)

| id | name | address | conf. | verification |
|---|---|---|---|---|
| allen-chapel-ame-church-pantry | Allen Chapel AME Church Food Pantry | 2439 Ainger Pl SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Friday 9:30am-12pm. |
| good-success-christian-church-pantry | Good Success Christian Church Food Pantry | 4401 Sheriff Rd NE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Tuesday and Thursday 9am-12pm. |
| friends-of-douglass-community-center-pantry | Friends of Douglass Community Center Food Pantry | 1812 Erie St SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Walk-up listed Tuesdays 12-4pm. CAFB listing also shows Mon/Wed/Thu 10am-4pm, Sat 9am-12pm (appointment only) and Sun 10am-1pm (home delivery, appointment only) with the note "Please call to be added to delivery schedule" -- call to confirm which days serve walk-ups. |
| new-macedonia-baptist-church-pantry | New Macedonia Baptist Church Food Pantry | 4115 Alabama Ave SE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Wednesday 9-11am; drive-thru distribution (pre-selected loose groceries). |
| brighter-day-ministries-food-pantry | Brighter Day Ministries Food Pantry | 2525 12th Pl SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Thursday 11am-4pm; walk-up, full choice. CAFB note: "BRING BAG". |
| covenant-baptist-food-pantry | Covenant Baptist Food Pantry | 3845 South Capitol St SW, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Thursday 9:30am-12:30pm. CAFB note: "parking on Zenia St only". |
| assumption-outreach-food-pantry | Assumption Outreach Food Pantry (Assumption Catholic Church) | 220 Highview Pl SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Monday, Wednesday and Friday 9am-12pm; walk-up, pre-bagged groceries. |
| dupont-park-sda-church-pantry | Dupont Park Seventh-day Adventist Church Food Pantry | 3942 Alabama Ave SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Tuesday 10am-12pm; walk-up or drive-thru. |
| salvation-army-solomon-g-brown-pantry | The Salvation Army Solomon G. Brown Corps Community Center Food Pantry | 2300 Martin Luther King Jr Ave SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): APPOINTMENT ONLY. Friday 9am-2pm walk-up by appointment ("Closed for lunch from 12-12:30pm"); Wednesday 9am-2pm is home delivery by appointment. |
| our-lady-of-perpetual-help-pantry | Our Lady of Perpetual Help Church Food Pantry | 1600 Morris Rd SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Thursday 10:30am-12:30pm; walk-up (home delivery also listed). |
| paramount-baptist-church-pantry | Paramount Baptist Church Food Pantry | 3924 4th St SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Wednesday 11am-12pm; walk-up, full choice. |
| urban-outreach-inc-pantry | Urban Outreach Inc. Food Pantry | 5343 C St SE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Saturday 10am-2pm; walk-up. CAFB lists the address as 5343 C St SE Suite 204. |
| greater-fellowship-missionary-baptist-church-pantry | Greater Fellowship Missionary Baptist Church Food Pantry | 814 Alabama Ave SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Tuesday 9-10am; walk-up, pre-bagged groceries. |
| children-of-mine-pantry | Children of Mine Youth Center Food Pantry | 2263 Mount View Pl SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Every Tuesday 9-10am. |
| temple-of-praise-free-groceries | Temple of Praise Free Groceries | 700 Southern Ave SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Sundays about 1-2pm, after the 11am worship service ("Worship attendance OPTIONAL, not required"). Also "Third Saturday Community Days / 10:00 AM - 2:00 PM Free Groceries, Resources, and More" (3rd Saturday of each month). Bring your own cart or bags. |
| emmanuel-baptist-church-pantry | Emmanuel Baptist Church Food Pantry | 2409 Ainger Pl SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 3rd Wednesday of each month, 3-5pm; walk-up, drive-thru or home delivery. |
| hillcrest-children-family-center-pantry | Hillcrest Children and Family Center Food Distribution | 3029 Martin Luther King Jr Ave SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 1st Friday of each month, 12-4pm; walk-up, full choice. |
| rccg-new-wine-assembly-pantry | RCCG New Wine Assembly Food Pantry | 1625 Olive St NE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 2nd and last Saturday of each month, 10am-12pm (CAFB note: "We are on the 2nd and last Saturdays of a month"). |
| faith-tabernacle-of-prayer-pantry | Faith Tabernacle of Prayer Food Pantry | 2465 Alabama Ave SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 1st Saturday of each month, 11:30am-1:30pm; pre-bagged groceries. |
| st-francis-xavier-church-food-pantry | St. Francis Xavier Church Food Pantry | 2815 O St SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 2nd Saturday of each month, 9-11:30am; walk-up, pre-bagged groceries. |
| atonement-food-pantry | Atonement Food Pantry (Church of the Atonement) | 5073 East Capitol St SE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): Monthly: 3rd Monday 9am-1pm; 3rd Tuesday 10am-1pm (fresh produce first come, first served, non-perishables, meat if available); 1st Wednesday 4-7pm (non-perishables and meat if available); 4th Saturday 9am-1pm. Walk-up or drive-thru. |
| church-of-the-incarnation-svdp-pantry | Church of the Incarnation St. Vincent de Paul Society Food Pantry | 880 Eastern Ave NE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 3rd Tuesday of each month, 10:30am-1:30pm; walk-up, pre-bagged groceries. |
| cafb-mobile-market-ward-memorial-ame | CAFB Mobile Market at Ward Memorial AME Church | 241 42nd St NE, Washington, DC 20019 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 3rd Saturday of each month, 8am-12pm; walk-up or drive-thru. |
| cafb-mobile-market-congress-heights-family-success-center | CAFB Mobile Market at Congress Heights Family Success Center | 1345 Savannah St SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 3rd Monday of each month, 11am-2pm; walk-up. |
| cafb-mobile-market-southern-hills-community-center | CAFB Mobile Market at Southern Hills Community Center | 4335 4th St SE, Washington, DC 20032 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 4th Tuesday of each month, 11am-2pm; walk-up. |
| cafb-mobile-market-frederick-douglass-community-center | CAFB Mobile Market at Frederick Douglass Community Center | 2000 Alabama Ave SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 2nd Thursday of each month, 10am-1pm. |
| cafb-mobile-market-ambassador-baptist-church | CAFB Mobile Market at Ambassador Baptist Church | 1408 Minnesota Ave SE, Washington, DC 20020 | medium | CAFB Get Help Map 2026 (data edited 2026-09-28): 2nd Saturday of each month, 8-10am; walk-up. |

## Joyful Food Markets (Martha's Table + CAFB school markets) (35)

| id | name | address | conf. | verification |
|---|---|---|---|---|
| jfm-moten-elementary | Joyful Food Market at Moten Elementary School | 1565 Morris Rd SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Wed Nov 4 and Wed Dec 9, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-kipp-dc-smilow-campus | Joyful Food Market at KIPP DC Smilow Campus (Arts & Technology, Quest and Valor academies) | 5300 Blaine St NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Thu Oct 8 and Mon Dec 7, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-johnson-middle-school | Joyful Food Market at Johnson Middle School | 1400 Bruce Pl SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Thu Oct 15, Thu Nov 19 and Thu Dec 17, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-dc-prep-anacostia-elementary | Joyful Food Market at DC Prep PCS - Anacostia Elementary | 2330 Pomeroy Rd SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Wed Oct 14, Mon Nov 9 and Wed Dec 2, 2026; shift 1:00-3:30pm; address matches DC GIS school layer. |
| jfm-boone-elementary | Joyful Food Market at Boone Elementary School | 2200 Minnesota Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Mon Dec 14, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-patterson-elementary | Joyful Food Market at Patterson Elementary School | 4399 South Capitol Ter SW, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Tue Nov 10 and Tue Dec 1, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-plummer-elementary | Joyful Food Market at Plummer Elementary School | 4601 Texas Ave SE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Tue Nov 24 and Tue Dec 15, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-randle-highlands-elementary | Joyful Food Market at Randle Highlands Elementary School | 1650 30th St SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Tue Oct 20, Tue Nov 17 and Tue Dec 15, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-appletree-parklands | Joyful Food Market at AppleTree Early Learning PCS - Parklands @ THEARC | 1801 Mississippi Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Thu Oct 15, Thu Nov 19 and Thu Dec 17, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-friendship-southeast-elementary | Joyful Food Market at Friendship PCS - Southeast Elementary Academy | 645 Milwaukee Pl SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Thu Oct 15, Thu Nov 12 and Thu Dec 10, 2026; shift 2:30-5:00pm; address matches DC GIS school layer. |
| jfm-kipp-dc-douglass-campus | Joyful Food Market at KIPP DC Douglass Road Campus (AIM, Discover and Heights academies) | 2600 Douglass Rd SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Fri Oct 16 and Fri Dec 18, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-lee-montessori-east-end | Joyful Food Market at Lee Montessori PCS - East End | 2345 R St SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Fri Nov 13, 2026; shift 12:00-2:30pm; address matches DC GIS school layer. |
| jfm-kelly-miller-middle-school | Joyful Food Market at Kelly Miller Middle School | 301 49th St NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Tue Oct 20, Tue Nov 17 and Tue Dec 15, 2026; shift 2:15-5:00pm; address matches DC GIS school layer. |
| jfm-excel-academy | Joyful Food Market at Excel Academy (DCPS) | 2501 Martin Luther King Jr Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Wed Oct 21 and Mon Nov 30, 2026; shift 1:00-3:30pm; address matches DC GIS school layer. |
| jfm-achievement-prep-wahler-place | Joyful Food Market at Achievement Prep PCS - Wahler Place Elementary | 908 Wahler Pl SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Thu Oct 29 and Fri Dec 18, 2026; shift 2:00-5:30pm; address matches DC GIS school layer. |
| jfm-king-elementary | Joyful Food Market at King Elementary School (temporary McGogney building) | 3400 Wheeler Rd SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Thu Oct 22, Mon Nov 16 and Wed Dec 16, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-leckie-education-campus | Joyful Food Market at Leckie Education Campus | 4201 Martin Luther King Jr Ave SW, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Fri Oct 16 and Thu Dec 17, 2026; shift 12:00-4:30pm; address matches DC GIS school layer. |
| jfm-stokes-east-end | Joyful Food Market at Elsie Whitlow Stokes Community Freedom PCS - East End | 5600 East Capitol St NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Fri Oct 9 and Fri Nov 13, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-whitlock-elementary | Joyful Food Market at Lorraine H. Whitlock Elementary School | 533 48th Pl NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Thu Oct 8 and Thu Dec 10, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-turner-elementary | Joyful Food Market at Turner Elementary School | 3264 Stanton Rd SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Fri Nov 20 and Fri Dec 18, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-garfield-elementary | Joyful Food Market at Garfield Elementary School | 2435 Alabama Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Fri Oct 16, Mon Nov 23 and Mon Dec 14, 2026; shift 2:30-5:00pm; address matches DC GIS school layer. |
| jfm-savoy-elementary | Joyful Food Market at Savoy Elementary School | 2400 Shannon Pl SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Tue Nov 10 and Tue Dec 8, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-kimball-elementary | Joyful Food Market at Kimball Elementary School | 3375 Minnesota Ave SE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Thu Nov 5 and Thu Dec 3, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-early-childhood-academy | Joyful Food Market at Early Childhood Academy PCS (Barnaby St) | 885 Barnaby St SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Tue Dec 8, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-beers-elementary | Joyful Food Market at Beers Elementary School | 3600 Alabama Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Thu Oct 29, Mon Nov 9 and Tue Dec 1, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-rocketship-rise-academy | Joyful Food Market at Rocketship PCS - Rise Academy | 2335 Raynolds Pl SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Fri Dec 4, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-dc-scholars | Joyful Food Market at DC Scholars PCS | 5601 East Capitol St SE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Fri Oct 2, Fri Nov 6, Fri Dec 4, 2026 and Mon Jan 4, 2027; shift 11:30am-2:00pm; address matches DC GIS school layer. |
| jfm-kipp-dc-wheeler-road-campus | Joyful Food Market at KIPP DC Wheeler Road Campus | 3301 Wheeler Rd SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Wed Nov 4 and Wed Dec 2, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-stanton-elementary | Joyful Food Market at Stanton Elementary School | 2701 Naylor Rd SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Wed Oct 21, Wed Nov 18 and Wed Dec 16, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-cw-harris-elementary | Joyful Food Market at C.W. Harris Elementary School | 301 53rd St SE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Fri Oct 9, Fri Nov 13 and Mon Dec 7, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-appletree-douglas-knoll | Joyful Food Market at AppleTree Early Learning PCS - Douglas Knoll | 2017 Savannah Ter SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Thu Oct 22, Thu Nov 19 and Thu Dec 17, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-academy-of-hope-southeast | Joyful Food Market at Academy of Hope Adult PCS - Southeast (Ward 8) campus | 421 Alabama Ave SE, Washington, DC 20032 | medium | Martha's Table 2026 volunteer listing: Wed Oct 28, Wed Nov 18 and Wed Dec 9, 2026; shift 11:00am-1:30pm; address matches DC GIS school layer. |
| jfm-smothers-elementary | Joyful Food Market at Smothers Elementary School | 4400 Brooks St NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Fri Oct 2, Fri Nov 6 and Fri Dec 4, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-blue-montessori | Joyful Food Market at DC Wildflower PCS - Blue Montessori | 1516 Marion Barry Ave SE, Washington, DC 20020 | medium | Martha's Table 2026 volunteer listing: Tue Oct 6, Tue Nov 3 and Tue Dec 1, 2026; shift 2:00-4:30pm; address matches DC GIS school layer. |
| jfm-dc-prep-benning | Joyful Food Market at DC Prep PCS - Benning Campus | 100 41st St NE, Washington, DC 20019 | medium | Martha's Table 2026 volunteer listing: Wed Oct 7, Wed Nov 4 and Wed Dec 2, 2026; shift 1:00-3:30pm; address matches DC GIS school layer. |

## Excluded places and why

**Joyful Food Markets not included**
- **Malcolm X ES**: Martha's Table listing (dates Oct 20 and Nov 17, 2026) still gives 4430 H St SE, the Davis swing site. DCPS says Malcolm X @ Green ES returned to 1500 Mississippi Ave SE for SY2026-27, and Drew ES now uses the Davis site. The market location can't be confirmed.
- **Burrville ES**: the listing (Oct 23 and Dec 14, 2026) gives 801 Division Ave NE. DCPS's SY2026-27 table puts Burrville in swing space at the Kenilworth building, 1300 44th St NE. The location can't be confirmed.
- **AppleTree Oklahoma Ave (330 21st St NE)** and **Friendship Blow-Pierce (725 19th St NE)**: both have 2026 dates and are in Ward 7, but they sit west of the Anacostia.
- **Martha's Table ECE market (2375 Elvans Rd SE)**: this is for Martha's Table's own early-childhood families. It is mentioned in the Commons entry instead.
- **Schools only on the undated Google My Map** linked from marthastable.org/jfms ("JFM Partner Schools", 48 pins): Cedar Tree Academy, Center City PCS (Congress Heights), Drew ES, Hendley ES, Houston ES, J.C. Nalle ES, Ketcham ES, Neval Thomas ES, River Terrace, Horton's Kids (SW, west of the river) and others. None has a 2026 date on the volunteer calendar, so none is confirmed for 2026. Also excluded: summer JFMs at recreation centers, because the summer season has ended.

**CAFB Get Help Map sites not included**
- **Ward 7 Food Center of Peace Lutheran Church (4929 Ames St NE)**: listed with no hours.
- **Villages of East River (301 37th St SE)**: the address is an office. Distributions happen at housing properties (Galen Terrace, Copeland Manor, Savannah, 1659 W St SE, on 2nd/4th Mon/Wed/Fri) and look resident-focused.
- **Washington View Apartments (2629 Douglass Rd SE)**: an apartment complex run by the same agency, probably for residents only.
- **North Capitol Collaborative (3230 Pennsylvania Ave SE #202)**: home delivery only ("Must be a DC Resident"). There is nowhere to walk in.
- **Rosedale Recreation Center CAFB Community Marketplace (1701 Gales St NE, 1st Saturday 8:30-10:30am)** and **Saint Benedict the Moor (320 21st St NE, 3rd Monday)**: Ward 7, but west of the river. Add them if the app's scope is "Wards 7 & 8" rather than "east of the river".
- **The Women's Collective (1818 New York Ave NE)**: tagged ZIP 20020 on the map, but the address is in Ward 5.

**Other categories**
- **Community fridges**: Feed the Fridge at the Anacostia Community Museum (1901 Fort Place SE), Boys & Girls Club Clubhouse 14 (4103 Benning Rd NE) and DPR rec centers (Fort Stanton, etc.). None could be confirmed for 2026. feedthefridge.org lists no locations and has no current date. The newest site-specific source is a 2021 blog post, and the directories are undated. No independent mutual-aid fridge east of the river was found.
- **SOME (So Others Might Eat)**: no meal site east of the river. Its dining room is at 71 O St NW.
- **Thrive DC** (NW), **Martha's Table McKenna's Wagon** (downtown stops) and **DC Central Kitchen**: no public meal site east of the river was found. DCCK hands out prepared meals at THEARC's Food and Farm Fridays; this is noted in that entry.
- **CAFB Curbside Groceries**: a paid mobile grocery store that takes EBT, so it is not free. Pass it to the grocery researcher if it is still running.
- **Marshall Heights soup kitchen** and other blog-listed meal events: the newest is from 2023, with nothing for 2026.
- **DC DACL senior Community Dining sites** (age 60+ meals) and **Grocery Plus/CSFP** senior boxes: these are eligibility-restricted programs and were not researched site by site. They are worth a follow-up if seniors are a target group.
- **Food & Friends**: not relevant (medically tailored meals, referral only).

## Hand-check before launch (call or visit)

1. **All 27 CAFB-listed church and community pantries and mobile markets (medium)**: hours are partner-reported to CAFB. Call ahead, especially:
   - **Friends of Douglass Community Center**: CAFB mixes walk-up and delivery slots, so only Tuesday 12-4 is in the hours table.
   - **Salvation Army Solomon G. Brown**: appointment only.
   - **Atonement Food Pantry**: directories disagree on the schedule (monthly vs weekly Saturdays).
   - **Temple of Praise**: the Sunday 1-2pm slot follows the worship service.
   - **Assumption Outreach**: Ward 8 residents only. Directories add an ID and proof-of-residency requirement.
2. **Joyful Food Markets (35)**:
   - The actual public market time at each school isn't published; the dates/times are volunteer shifts.
   - Eligibility is "families at our partner schools" (CAFB: "School families").
   - The volunteer calendar may hide dates whose shifts are full.
   - Best practice: phone the school or Martha's Table (202-328-6608).
   - Specific address checks:
     - **AppleTree Douglas Knoll**: 2017 Savannah Ter SE (DC GIS) vs 2031 Savannah Ter SE #2127 (Martha's Table).
     - **AppleTree Parklands**: ZIP 20020 (operator and Census) vs 20032 (DC MAR).
     - **King ES**: now in the temporary McGogney building at 3400 Wheeler Rd SE.
3. **Bread for the City SE pantry**: the operator page states no ID, income or proof-of-address rule. Older third-party listings describe DC residency, income at or below 200% FPL, and documents. Confirm what to bring by calling (202) 265-2400.
4. **Bread for the City SE free farmers market**: the 2026 calendar lists only Oct 23 and Dec 11 (no November dates), although the stated pattern is the 2nd and 4th Friday. Check the calendar each month.
5. **Martha's Table Commons**: the operator page states no DC-residency rule (third-party directories say proof of DC residence is needed). A photo ID is required to register.
6. **Seasonal**:
   - **THEARC Food and Farm Fridays**: last listed date Nov 13, 2026. The season start of May 22 came from a search capture.
   - **DPR Lederer Gardens giveaway**: ends Nov 25, 2026. DPR asks people to register, and it is unclear whether walk-ups without registration are served.
7. **Covenant Baptist** (3845 South Capitol St SW): CAFB says "parking on Zenia St only", while a directory mentions a side entrance on "Xenia Street". Confirm the entrance.
