'use client';
import { useEffect, useRef } from 'react';
import type { Map as MLMap, Marker, StyleSpecification, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { StoredRequest } from '@/lib/server/store';
import type { Gap } from '@/lib/engine/gap';

export type MapView = 'city' | 'focus' | 'gap';
export interface Padding { top: number; right: number; bottom: number; left: number }

const DC_BOUNDS: [[number, number], [number, number]] = [[-77.12, 38.79], [-76.909, 38.996]];
const EAST_BOUNDS: [[number, number], [number, number]] = [[-77.03, 38.814], [-76.905, 38.912]];

const C = {
  bg: '#0d1411', land: '#151e1a', east: '#1d2b24', water: '#173843', ward: '#3a4d43', lfa: '#e26848',
  food: '#e9e3d0', foodEast: '#7fd1a8', free: '#8fc3ff', market: '#7fd1a8', corner: '#9fb5a9', accent: '#f4b740', ink: '#eeeadf',
};

const CITY_LABELS = ['Georgetown', 'Columbia Heights', 'Capitol Hill', 'Navy Yard', 'Brookland', 'Historic Anacostia', 'Congress Heights', 'Deanwood'];
const EAST_LABELS = ['Historic Anacostia', 'Congress Heights', 'Deanwood', 'Benning', 'Bellevue', 'Hillcrest', 'Marshall Heights',
  'Washington Highlands', 'Fort Dupont', 'Kenilworth', 'Barry Farm', 'Lincoln Heights', 'Fairlawn', 'Shipley'];

const empty = { type: 'FeatureCollection' as const, features: [] };
const toFC = (reqs: StoredRequest[]) => ({
  type: 'FeatureCollection' as const,
  features: reqs.map((r) => ({ type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: [r.lng, r.lat] },
    properties: { id: r.id, sample: r.source === 'sample' ? 1 : 0 } })),
});

function style(): StyleSpecification {
  const g = (f: string) => `/geo/${f}.geojson`;
  return {
    version: 8,
    sources: {
      dc: { type: 'geojson', data: g('dc-boundary') },
      east: { type: 'geojson', data: g('east-of-river') },
      water: { type: 'geojson', data: g('water') },
      wards: { type: 'geojson', data: g('wards') },
      lfa: { type: 'geojson', data: g('low-food-access') },
      grocery: { type: 'geojson', data: empty },
      resources: { type: 'geojson', data: g('resources') },
      requests: { type: 'geojson', data: empty },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': C.bg } },
      { id: 'land', type: 'fill', source: 'dc', paint: { 'fill-color': C.land, 'fill-color-transition': { duration: 900 } } },
      { id: 'east', type: 'fill', source: 'east', paint: { 'fill-color': C.east, 'fill-opacity': 0 , 'fill-opacity-transition': { duration: 900 } } },
      { id: 'lfa', type: 'fill', source: 'lfa', paint: { 'fill-color': C.lfa, 'fill-opacity': 0, 'fill-opacity-transition': { duration: 900 } } },
      { id: 'lfa-edge', type: 'line', source: 'lfa', paint: { 'line-color': C.lfa, 'line-width': 0.8, 'line-opacity': 0, 'line-opacity-transition': { duration: 900 } } },
      { id: 'water', type: 'fill', source: 'water', paint: { 'fill-color': C.water } },
      { id: 'wards', type: 'line', source: 'wards', paint: { 'line-color': C.ward, 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.2, 14, 2.2] } },
      { id: 'east-edge', type: 'line', source: 'east', paint: { 'line-color': C.foodEast, 'line-width': 1.6, 'line-dasharray': [2, 2], 'line-opacity': 0, 'line-opacity-transition': { duration: 900 } } },
      { id: 'dc-edge', type: 'line', source: 'dc', paint: { 'line-color': C.ink, 'line-width': 1, 'line-opacity': 0.35 } },
      { id: 'heat', type: 'heatmap', source: 'requests', paint: {
        'heatmap-weight': 1, 'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 15, 2],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 18, 15, 50],
        'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(244,183,64,0)', 0.25, 'rgba(244,183,64,0.25)', 0.6, 'rgba(244,183,64,0.55)', 1, 'rgba(255,214,120,0.85)'],
        'heatmap-opacity': 0, 'heatmap-opacity-transition': { duration: 900 } } },
      { id: 'grocery', type: 'circle', source: 'grocery', paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4.5, 14, 9],
        'circle-color': ['case', ['get', 'east_of_river'], C.foodEast, C.food],
        'circle-stroke-color': C.bg, 'circle-stroke-width': 1.5 } },
      { id: 'resources', type: 'circle', source: 'resources', filter: ['!=', ['get', 'type'], 'grocery'], layout: { visibility: 'none' }, paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, ['match', ['get', 'type'], 'corner_store', 3, 4.5], 15, ['match', ['get', 'type'], 'corner_store', 6, 9]],
        'circle-color': ['case', ['get', 'free'], C.free, ['match', ['get', 'type'], 'corner_store', C.corner, C.market]],
        'circle-stroke-color': C.bg, 'circle-stroke-width': 1.5 } },
      { id: 'requests', type: 'circle', source: 'requests', paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, ['case', ['==', ['get', 'sample'], 1], 2.2, 3.5], 15, ['case', ['==', ['get', 'sample'], 1], 4, 6.5]],
        'circle-color': ['case', ['==', ['get', 'sample'], 1], '#b98a34', C.accent],
        'circle-opacity': ['case', ['==', ['get', 'sample'], 1], 0.7, 1],
        'circle-stroke-color': C.bg, 'circle-stroke-width': 1 } },
    ],
  };
}

type Hood = { name: string; lng: number; lat: number };

export default function LiveMap({ view, requests, latest, gaps, padding, onLabelFor }: {
  view: MapView;
  requests: StoredRequest[];
  latest: StoredRequest | null;
  gaps: Gap[];
  padding: Padding;
  onLabelFor?: (fn: (lat: number, lng: number) => string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ml = useRef<typeof import('maplibre-gl') | null>(null);
  const ready = useRef(false);
  const hoodMarkers = useRef<{ name: string; m: Marker }[]>([]);
  const gapMarkers = useRef<Marker[]>([]);
  const hoods = useRef<Hood[]>([]);
  const state = useRef({ view, requests, gaps, padding });
  state.current = { view, requests, gaps, padding };

  const nearestHood = (lat: number, lng: number) => {
    let best = '', d = Infinity;
    for (const h of hoods.current) { const x = (h.lat - lat) ** 2 + ((h.lng - lng) * 0.78) ** 2; if (x < d) { d = x; best = h.name; } }
    return best;
  };

  // ---- init once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lib = await import('maplibre-gl');
      if (cancelled || !el.current) return;
      lib.setWorkerUrl('/vendor/maplibre-gl-worker.mjs');
      ml.current = lib;
      const m = new lib.Map({
        container: el.current, style: style(), bounds: DC_BOUNDS, fitBoundsOptions: { padding: state.current.padding },
        attributionControl: false, maxBounds: [[-77.35, 38.7], [-76.7, 39.1]], minZoom: 9.5, maxZoom: 16, dragRotate: false, pitchWithRotate: false,
      });
      m.addControl(new lib.AttributionControl({ compact: true, customAttribution: 'Open Data DC (CC BY 4.0) · FoodLine directory' }), 'bottom-right');
      map.current = m;
      m.on('load', async () => {
        ready.current = true;
        // Grocery stores operating in 2026 (Open Data DC) + the Marion Barry Avenue Market (opened Sept 2025, not yet in that dataset).
        const [gs, res, nb] = await Promise.all(['grocery-stores', 'resources', 'neighborhoods'].map((f) => fetch(`/geo/${f}.geojson`).then((r) => r.json())));
        const open = gs.features.filter((f: { properties: { open_2026: boolean } }) => f.properties.open_2026);
        const mbam = res.features.find((f: { properties: { id: string } }) => f.properties.id === 'dol-marion-barry-avenue-market');
        if (mbam) open.push({ ...mbam, properties: { name: mbam.properties.name, east_of_river: true } });
        (m.getSource('grocery') as GeoJSONSource).setData({ type: 'FeatureCollection', features: open });
        hoods.current = nb.features.filter((f: { properties: { kind: string; east_of_river: boolean } }) => f.properties.kind === 'neighborhood' && f.properties.east_of_river)
          .map((f: { properties: { name: string }; geometry: { coordinates: [number, number] } }) => ({ name: f.properties.name, lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }));
        onLabelFor?.(nearestHood);
        for (const f of nb.features as { properties: { name: string; kind: string }; geometry: { coordinates: [number, number] } }[]) {
          if (f.properties.kind !== 'neighborhood') continue;
          const name = f.properties.name;
          if (!CITY_LABELS.includes(name) && !EAST_LABELS.includes(name)) continue;
          const d = document.createElement('div');
          d.className = 'hood-label';
          d.textContent = name === 'Historic Anacostia' ? 'Anacostia' : name;
          hoodMarkers.current.push({ name, m: new lib.Marker({ element: d }).setLngLat(f.geometry.coordinates).addTo(m) });
        }
        // resource popups
        m.on('click', 'resources', (e) => {
          const f = e.features?.[0];
          if (!f) return;
          new lib.Popup({ closeButton: false, offset: 10 }).setLngLat(e.lngLat)
            .setHTML(`<strong>${f.properties.name}</strong><br><span style="color:#a3ada6">${String(f.properties.type).replace('_', ' ')}${f.properties.free ? ' · free' : ''}</span>`).addTo(m);
        });
        m.on('mouseenter', 'resources', () => (m.getCanvas().style.cursor = 'pointer'));
        m.on('mouseleave', 'resources', () => (m.getCanvas().style.cursor = ''));
        applyView(true);
        syncRequests();
        drawGaps();
      });
    })();
    return () => { cancelled = true; map.current?.remove(); map.current = null; ready.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncRequests() {
    const m = map.current;
    if (!m || !ready.current) return;
    (m.getSource('requests') as GeoJSONSource).setData(toFC(state.current.requests));
  }

  function applyView(instant = false) {
    const m = map.current;
    if (!m || !ready.current) return;
    const v = state.current.view;
    const focus = v !== 'city';
    m.setPaintProperty('land', 'fill-color', focus ? '#111915' : C.land);
    m.setPaintProperty('east', 'fill-opacity', focus ? 1 : 0);
    m.setPaintProperty('east-edge', 'line-opacity', focus ? 0.7 : 0);
    m.setPaintProperty('lfa', 'fill-opacity', v === 'focus' ? 0.13 : 0);
    m.setPaintProperty('lfa-edge', 'line-opacity', 0);
    m.setPaintProperty('heat', 'heatmap-opacity', v === 'gap' ? 0.9 : 0);
    m.setLayoutProperty('resources', 'visibility', focus ? 'visible' : 'none');
    m.setPaintProperty('requests', 'circle-opacity', v === 'gap'
      ? ['case', ['==', ['get', 'sample'], 1], 0.25, 1]
      : v === 'city' ? ['case', ['==', ['get', 'sample'], 1], 0, 1] : ['case', ['==', ['get', 'sample'], 1], 0.7, 1]);
    for (const { name, m: mk } of hoodMarkers.current) {
      const show = v === 'city' ? CITY_LABELS.includes(name) : EAST_LABELS.includes(name);
      mk.getElement().style.display = show ? '' : 'none';
    }
    m.fitBounds(focus ? EAST_BOUNDS : DC_BOUNDS, { padding: state.current.padding, duration: instant ? 0 : 2200, essential: true });
    drawGaps();
  }

  function drawGaps() {
    const m = map.current, lib = ml.current;
    gapMarkers.current.forEach((g) => g.remove());
    gapMarkers.current = [];
    if (!m || !lib || state.current.view !== 'gap') return;
    state.current.gaps.forEach((g, i) => {
      const d = document.createElement('div');
      d.setAttribute('aria-label', `Gap ${i + 1}`);
      d.style.cssText = 'display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#eeeadf;color:#0d1411;font:700 18px var(--font-geist-mono),monospace;box-shadow:0 0 0 4px rgba(13,20,17,.85),0 0 0 6px #f4b740';
      d.textContent = String(i + 1);
      gapMarkers.current.push(new lib.Marker({ element: d }).setLngLat([g.lng, g.lat]).addTo(m));
    });
  }

  useEffect(() => { applyView(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [view, padding.left, padding.right, padding.top, padding.bottom]);
  useEffect(() => { syncRequests(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [requests]);
  useEffect(() => { drawGaps(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [gaps]);

  // ---- live ping for each new real request
  useEffect(() => {
    const m = map.current, lib = ml.current;
    if (!latest || !m || !lib) return;
    const d = document.createElement('div');
    d.className = 'ping live';
    const label = document.createElement('span');
    label.className = 'ping-label';
    const hood = nearestHood(latest.lat, latest.lng);
    label.textContent = `New request${hood ? ` · ${hood === 'Historic Anacostia' ? 'Anacostia' : hood}` : ''}`;
    d.appendChild(label);
    const mk = new lib.Marker({ element: d }).setLngLat([latest.lng, latest.lat]).addTo(m);
    const t = setTimeout(() => mk.remove(), 7000);
    return () => { clearTimeout(t); mk.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest]);

  // maplibre-gl.css sets position:relative on the map element, so size it inside an absolute wrapper.
  return (
    <div className="absolute inset-0">
      <div ref={el} className="h-full w-full" role="img" aria-label="Map of Washington DC grocery stores, food resources in Wards 7 and 8, and anonymous live requests" />
    </div>
  );
}
