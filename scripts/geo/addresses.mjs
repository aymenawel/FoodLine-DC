// Downloads active DC address points in Wards 7 and 8 (Open Data DC / MAR, CC BY 4.0) and writes a compact
// offline lookup for the text line: web/data/addresses.json = { "ALABAMA AVENUE SE": [[1535, 38.8464, -76.9818], ...], ... }
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { GEO } from './lib.mjs';

const LAYER = 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Location_WebMercator/MapServer/0/query';
const where = "WARD IN ('Ward 7','Ward 8') AND STATUS='ACTIVE'";
const fields = 'ADDRESS_NUMBER,STREET_NAME,STREET_TYPE,QUADRANT,LATITUDE,LONGITUDE';
const r5 = (n) => Math.round(n * 1e5) / 1e5;

const streets = {};
let offset = 0, total = 0;
for (;;) {
  const url = `${LAYER}?where=${encodeURIComponent(where)}&outFields=${fields}&returnGeometry=false&orderByFields=OBJECTID&resultOffset=${offset}&resultRecordCount=2000&f=json`;
  const res = await fetch(url);
  const j = await res.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  for (const { attributes: a } of j.features) {
    const num = Number(a.ADDRESS_NUMBER);
    if (!num || !a.STREET_NAME || a.LATITUDE == null) continue;
    const key = [a.STREET_NAME, a.STREET_TYPE, a.QUADRANT].filter(Boolean).join(' ').toUpperCase();
    (streets[key] ??= []).push([num, r5(a.LATITUDE), r5(a.LONGITUDE)]);
    total++;
  }
  if (!j.exceededTransferLimit && j.features.length < 2000) break;
  offset += j.features.length;
}
// one point per house number, sorted for binary search
for (const k of Object.keys(streets)) {
  const seen = new Map();
  for (const p of streets[k]) if (!seen.has(p[0])) seen.set(p[0], p);
  streets[k] = [...seen.values()].sort((a, b) => a[0] - b[0]);
}
const out = path.resolve(GEO, '../../web/data/addresses.json');
writeFileSync(out, JSON.stringify({ source: 'Open Data DC Address Points (MAR), Wards 7 and 8, ACTIVE; CC BY 4.0', downloaded: new Date().toISOString(), streets }));
console.log(`addresses ${total}, streets ${Object.keys(streets).length} -> ${out}`);
