// Every number shown on screen, with its source. Verified in research/findings.md (accessed 2026-10-10).
export interface Stat { id: string; value: string; label: string; source: string; url: string }

export const DCHS_2025 = 'https://www.dchunger.org/wp-content/uploads/2025/11/Minding-Grocery-Gap-2025.pdf';
export const ACS_2024 = 'https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013,B01003,B08201,B22001&geo_ids=61000US11001,61000US11002,61000US11003,61000US11004,61000US11005,61000US11006,61000US11007,61000US11008,04000US11';
export const CAFB_DC_2025 = 'https://dcfoodpolicy.org/wp-content/uploads/2025/10/CAFB-DC-2025-Data.pdf';
export const CAFB_2026 = 'https://hunger-report.capitalareafoodbank.org/report-2026/';
export const OPENDATA_GROCERY = 'https://opendata.dc.gov/datasets/DCGIS::grocery-store-locations';
export const OPENDATA_LFA = 'https://opendata.dc.gov/datasets/DCGIS::low-food-access-areas';

export const STATS: Record<string, Stat> = {
  eastStores: { id: 'S1', value: '5 of 80', label: 'full-service grocery stores in DC are east of the Anacostia',
    source: 'D.C. Hunger Solutions, Minding the Grocery Gap 2025 (pp. 6–7)', url: DCHS_2025 },
  wardGap: { id: 'S2', value: '17 vs 3', label: 'grocery stores in Ward 3 vs Ward 7',
    source: 'D.C. Hunger Solutions, Grocery Gap 2025', url: DCHS_2025 },
  snap: { id: 'S3', value: '38.5%', label: 'of Ward 8 households receive SNAP (DC: 14.3%)',
    source: 'U.S. Census Bureau, ACS 2020–2024 5-year, B22001', url: ACS_2024 },
  noCar: { id: 'S4', value: '43%', label: 'of Ward 8 households have no car',
    source: 'U.S. Census Bureau, ACS 2020–2024 5-year, B08201', url: ACS_2024 },
  income: { id: 'S5', value: '$52,769', label: 'Ward 8 median household income (Ward 3: $144,877)',
    source: 'U.S. Census Bureau, ACS 2020–2024 5-year, B19013', url: ACS_2024 },
  dcInsecure: { id: 'S6', value: '40%', label: 'of DC households were food insecure in 2025 (±5.4 pts)',
    source: 'Capital Area Food Bank, 2025 Hunger Report DC briefing', url: CAFB_DC_2025 },
  regionInsecure: { id: 'S7', value: '38%', label: 'of DC-region households food insecure in 2026, a five-year high',
    source: 'Capital Area Food Bank, Hunger Report 2026', url: CAFB_2026 },
};

export const MAP_SOURCES = [
  { label: 'Grocery stores: Open Data DC (updated Aug 2026)', url: OPENDATA_GROCERY },
  { label: 'Low food access areas: Open Data DC (2017 analysis)', url: OPENDATA_LFA },
];
