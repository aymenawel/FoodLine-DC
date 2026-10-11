// Step 2: build render-ready GeoJSON layers (EPSG:4326) in data/geo/ from data/raw/.
//
// Usage: node process.mjs
//
// - Polygons are simplified with mapshaper (Visvalingam/weighted, keep-shapes) using a
//   distance interval (metres) chosen for city zooms 11-14, then rounded to 5 decimals.
// - Points are rounded to 5 decimals (~1 m) and given `ward` (2022 wards, point-in-polygon
//   on the unsimplified ward polygons) and, for food sources, `east_of_river`.
// - Properties are trimmed to what the app needs.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import mapshaper from 'mapshaper';
import {
  GEO, loadRaw, round5, clean, turf,
  wardOf, isEastOfficial, clusterOf, eorFeature, intersectionArea, wards,
} from './lib.mjs';

const pt = (f) => turf.point(f.geometry.coordinates);
const roundPt = (coords) => [round5(coords[0]), round5(coords[1])];
const yes = (v) => String(v ?? '').trim().toLowerCase() === 'yes';

async function simplify(fc, { interval = 5, extra = '' } = {}) {
  const cmd = `-i in.json -simplify visvalingam weighted interval=${interval} keep-shapes ${extra} -o out.json format=geojson precision=0.00001`;
  const out = await mapshaper.applyCommands(cmd, { 'in.json': fc });
  return JSON.parse(String(out['out.json']));
}

async function save(name, fc) {
  const file = path.join(GEO, name);
  const text = JSON.stringify(fc);
  await writeFile(file, text);
  console.log(`${name.padEnd(32)} ${String(fc.features.length).padStart(6)} features  ${(Buffer.byteLength(text) / 1024).toFixed(1).padStart(8)} KB`);
  return fc;
}

const pointFC = (features) => ({ type: 'FeatureCollection', features });
const pointFeature = (coords, properties) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: roundPt(coords) }, properties });

async function main() {
  await mkdir(GEO, { recursive: true });

  // ---------------------------------------------------------------- polygons
  // DC boundary
  {
    const raw = loadRaw('dc-boundary');
    raw.features = raw.features.map((f) => ({ ...f, properties: { name: 'Washington, DC', gis_id: f.properties.GIS_ID } }));
    await save('dc-boundary.geojson', await simplify(raw, { interval: 5 }));
  }

  // Wards 2022
  {
    const raw = loadRaw('wards-2022');
    raw.features = raw.features
      .map((f) => ({ ...f, properties: { ward: Number(f.properties.WARD), name: f.properties.NAME, label: f.properties.LABEL } }))
      .sort((a, b) => a.properties.ward - b.properties.ward);
    await save('wards.geojson', await simplify(raw, { interval: 5 }));
  }

  // East of the River (official DC GIS polygon) - handy for shading the focus area
  {
    const raw = loadRaw('east-of-the-river');
    raw.features = raw.features.map((f) => ({ ...f, properties: { name: f.properties.NAME, gis_id: f.properties.GIS_ID } }));
    await save('east-of-river.geojson', await simplify(raw, { interval: 5 }));
  }

  // Water: rivers + lakes + ponds >= 2,000 m2 (wastewater holding ponds dropped)
  {
    const raw = loadRaw('waterbodies');
    const rivers = raw.features.filter((f) => f.properties.DESCRIPTION === 'River');
    const mainId = rivers.sort((a, b) => turf.area(b) - turf.area(a))[0].properties.OBJECTID;
    raw.features = raw.features
      .filter((f) => {
        const d = f.properties.DESCRIPTION;
        if (d === 'River' || d === 'Lake') return true;
        if (d === 'Pond') return turf.area(f) >= 2000;
        return false; // Wastewater Holding Ponds
      })
      .map((f) => ({
        ...f,
        properties: {
          kind: f.properties.DESCRIPTION.toLowerCase(),
          name: f.properties.OBJECTID === mainId ? 'Potomac and Anacostia Rivers' : null,
          objectid: f.properties.OBJECTID,
        },
      }));
    await save('water.geojson', await simplify(raw, { interval: 5 }));
  }

  // ZIP codes: all polygons kept. STANDARD delivery ZIPs plus UNIQUE (single organisation /
  // building) and PO BOX ZIPs, which are cut out of (not overlapping) the standard ZIPs, so
  // dropping them would leave holes. Filter on `type` in the app if needed.
  {
    const raw = loadRaw('zipcodes');
    raw.features = raw.features
      .map((f) => ({ ...f, properties: { zipcode: String(f.properties.ZIPCODE), name: clean(f.properties.NAME), type: f.properties.TYPE } }));
    await save('zipcodes.geojson', await simplify(raw, { interval: 8 }));
  }

  // Low Food Access Areas: keep the dataset's population/poverty fields, add 2022 ward
  // (largest-area share, unsimplified geometry) and east_of_river (>50% of area inside the
  // official East of the River polygon).
  {
    const raw = loadRaw('low-food-access');
    const eor = eorFeature();
    raw.features = raw.features.map((f) => {
      const p = f.properties;
      const area = turf.area(f);
      let best = null, bestShare = 0;
      for (const { f: w } of wards()) {
        const s = intersectionArea(f, w) / area;
        if (s > bestShare) { bestShare = s; best = Number(w.properties.WARD); }
      }
      const eorShare = intersectionArea(f, eor) / area;
      return {
        ...f,
        properties: {
          gis_id: p.GIS_ID,
          ward: best,
          ward_share: Math.round(bestShare * 1000) / 1000,
          ward_src: p.WARD, // ward recorded in the 2017 dataset (pre-2022 ward lines)
          east_of_river: eorShare > 0.5,
          PARTPOP2: p.PARTPOP2,
          PRTOVR185: p.PRTOVR185,
          PRTUND185: p.PRTUND185,
          PERCENTUND185: p.PERCENTUND185 == null ? null : Math.round(p.PERCENTUND185 * 10000) / 10000,
          area_km2: Math.round(area / 1e3) / 1e3,
        },
      };
    });
    await save('low-food-access.geojson', await simplify(raw, { interval: 5 }));
  }

  // Neighborhood Clusters polygons (+ label point inside each polygon)
  const clusterLabelPoints = [];
  {
    const raw = loadRaw('neighborhood-clusters');
    raw.features = raw.features.map((f) => {
      const p = f.properties;
      const lp = turf.pointOnFeature(f);
      const w = wardOf(lp);
      const east = isEastOfficial(lp);
      const props = {
        name: p.NAME,
        nbh_names: clean(p.NBH_NAMES),
        type: p.TYPE,
        ward_at_label: w,
        east_of_river: east,
        label_lon: round5(lp.geometry.coordinates[0]),
        label_lat: round5(lp.geometry.coordinates[1]),
      };
      clusterLabelPoints.push(pointFeature(lp.geometry.coordinates, {
        kind: 'cluster', name: p.NAME, label: clean(p.NBH_NAMES), aliases: clean(p.NBH_NAMES)?.split(/\s*,\s*/).join('|') ?? null,
        ward: w, east_of_river: east, cluster: p.NAME, source: 'Neighborhood Clusters (pointOnFeature)',
      }));
      return { ...f, properties: props };
    });
    raw.features.sort((a, b) => Number(a.properties.name.replace(/\D+/g, '')) - Number(b.properties.name.replace(/\D+/g, '')));
    await save('neighborhood-clusters.geojson', await simplify(raw, { interval: 8 }));
  }

  // ---------------------------------------------------------------- points
  // Grocery stores
  {
    const raw = loadRaw('grocery-stores');
    const feats = raw.features.filter((f) => f.geometry).map((f) => {
      const p = f.properties;
      const P = pt(f);
      return pointFeature(f.geometry.coordinates, {
        id: p.OBJECTID,
        name: clean(p.STORENAME),
        address: clean(p.ADDRESS),
        zipcode: clean(p.ZIPCODE),
        ward: wardOf(P),
        ward_src: clean(p.WARD),
        east_of_river: isEastOfficial(P),
        open_2026: yes(p.PRESENT26),
        present_2022: yes(p.PRESENT22),
        present_2023: yes(p.PRESENT23),
        present_2024: yes(p.PRESENT24),
        present_2025: yes(p.PRESENT25),
        present_2026: yes(p.PRESENT26),
        notes: clean(p.NOTES),
        mar_id: p.MAR_ID ?? null,
      });
    });
    await save('grocery-stores.geojson', pointFC(feats));
  }

  // Farmers markets (dataset also lists Montgomery & Prince George's County, MD markets)
  {
    const raw = loadRaw('farmers-markets');
    const feats = raw.features.filter((f) => f.geometry).map((f) => {
      const p = f.properties;
      const P = pt(f);
      const ward = wardOf(P);
      return pointFeature(f.geometry.coordinates, {
        id: p.OBJECTID,
        name: clean(p.NAME),
        address: clean(p.ADDRESS),
        city: clean(p.CITY),
        state: clean(p.STATE),
        zipcode: clean(p.ZIPCODE),
        in_dc: ward != null,
        ward,
        ward_src: clean(p.WARD),
        east_of_river: isEastOfficial(P),
        days: clean(p.DAYS),
        times: clean(p.TIMES),
        season_start: clean(p.STARTDATE),
        season_end: clean(p.ENDDATE),
        benefits: clean(p.BENEFITS),
        website: clean(p.WEBSITE),
        location_description: clean(p.LOCATION_DESCRIPTION),
      });
    });
    await save('farmers-markets.geojson', pointFC(feats));
  }

  // Healthy Corner Stores (DC Central Kitchen Healthy Corners)
  {
    const raw = loadRaw('healthy-corners');
    const feats = raw.features.filter((f) => f.geometry).map((f) => {
      const p = f.properties;
      const P = pt(f);
      return pointFeature(f.geometry.coordinates, {
        id: p.OBJECTID,
        name: clean(p.STORE),
        address: clean(p.ADDRESS),
        zipcode: clean(p.ZIPCODE),
        ward: wardOf(P),
        ward_src: clean(p.WARD),
        east_of_river: isEastOfficial(P),
        snap_match: clean(p.SNAP_MATCH)?.toLowerCase() === 'x',
        wic_vendor: clean(p.WIC_VENDOR)?.toLowerCase() === 'x',
        mar_id: p.MAR_ID ?? null,
      });
    });
    await save('healthy-corners.geojson', pointFC(feats));
  }

  // Neighborhood names (points) for chat lookup: Neighborhood Labels + cluster label points.
  // `aliases` are derived mechanically: names containing "/" are split into parts, and
  // "Historic Anacostia" also answers to "Anacostia".
  {
    const raw = loadRaw('neighborhood-labels');
    const extraAliases = { 'Historic Anacostia': ['Anacostia'], 'Fort Davis Park': ['Fort Davis'] };
    const feats = raw.features.filter((f) => f.geometry).map((f) => {
      const p = f.properties;
      const P = pt(f);
      const name = clean(p.NAME);
      const aliases = new Set();
      if (clean(p.LABEL_NAME) && clean(p.LABEL_NAME) !== name) aliases.add(clean(p.LABEL_NAME));
      if (name.includes('/')) name.split('/').map((s) => s.trim()).filter(Boolean).forEach((s) => aliases.add(s));
      (extraAliases[name] || []).forEach((s) => aliases.add(s));
      return pointFeature(f.geometry.coordinates, {
        kind: 'neighborhood',
        name,
        label: clean(p.LABEL_NAME),
        aliases: aliases.size ? [...aliases].join('|') : null,
        ward: wardOf(P),
        east_of_river: isEastOfficial(P),
        cluster: clusterOf(P),
        source: 'Neighborhood Labels',
      });
    });
    feats.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
    await save('neighborhoods.geojson', pointFC([...feats, ...clusterLabelPoints]));
  }

  // Street intersections in Wards 7 and 8 (2022 wards). The source stores most intersections
  // twice (A and B / B and A at the same point); these are collapsed into one feature.
  {
    const raw = loadRaw('intersections');
    const w78 = wards().filter(({ f }) => [7, 8].includes(Number(f.properties.WARD)));
    const seen = new Map();
    let inW78 = 0;
    for (const f of raw.features) {
      if (!f.geometry) continue;
      const P = pt(f);
      const hit = w78.find(({ f: w, bbox }) => {
        const [x, y] = f.geometry.coordinates;
        return x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3] && turf.booleanPointInPolygon(P, w);
      });
      if (!hit) continue;
      inW78++;
      const p = f.properties;
      const s1 = clean(p.STREET_1_FULL), s2 = clean(p.STREET_2_FULL);
      const c = roundPt(f.geometry.coordinates);
      const key = `${c[0]},${c[1]}|${[s1, s2].sort().join('|')}`;
      if (seen.has(key)) continue;
      seen.set(key, pointFeature(f.geometry.coordinates, {
        name: clean(p.NAME),
        street1: s1,
        street2: s2,
        ward: Number(hit.f.properties.WARD),
        type: p.INTERSECTION_TYPE === 'REGULAR' ? undefined : p.INTERSECTION_TYPE,
      }));
    }
    const feats = [...seen.values()];
    console.log(`  intersections: ${inW78} source points in Wards 7-8 -> ${feats.length} after collapsing A/B duplicates`);
    await save('intersections-w78.geojson', pointFC(feats));
  }

  // Metro bus stops in Wards 7 and 8 (WMATA Better Bus network, via Open Data DC)
  {
    const raw = loadRaw('bus-stops');
    const feats = [];
    for (const f of raw.features) {
      if (!f.geometry) continue;
      const P = pt(f);
      const w = wardOf(P);
      if (w !== 7 && w !== 8) continue;
      const p = f.properties;
      feats.push(pointFeature(f.geometry.coordinates, {
        id: p.REG_ID ?? null,
        name: clean(p.BSTP_MSG_TEXT),
        on_street: clean(p.ON_STR),
        at_street: clean(p.AT_STR),
        ward: w,
      }));
    }
    await save('bus-stops-w78.geojson', pointFC(feats));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
