import { milesBetween } from './lookup';

export interface Cell {
  id: number;
  lat: number;
  lng: number;
  hood: string | null;
  nearestGroceryKm: number;
  within1km: Record<string, number>;
  freeWithin1km: number;
  stop: { a: string; b: string; lat: number; lng: number } | null;
}

export interface Gap {
  cellId: number;
  lat: number;
  lng: number;
  hood: string | null;
  requests: number;
  supply: number;
  nearestGroceryKm: number;
  freeWithin1km: number;
  stop: Cell['stop'];
  score: number;
}

// How much each resource type within 1 km counts toward "supply".
const WEIGHT: Record<string, number> = {
  grocery: 3, free_market: 2, pantry: 2, mobile_market: 1.5, farmers_market: 1, corner_store: 0.5,
};

const KM_PER_MI = 1.609344;

export function topGaps(
  requests: { lat: number; lng: number; ts: string }[],
  cells: Cell[],
  now: Date,
  o: { windowHours?: number; n?: number } = {},
): Gap[] {
  const since = now.getTime() - (o.windowHours ?? 24) * 3600_000;
  const demand = new Map<number, number>();
  for (const r of requests) {
    if (Date.parse(r.ts) < since) continue;
    let best: Cell | null = null, bestKm = Infinity;
    for (const c of cells) {
      const km = milesBetween(r, c) * KM_PER_MI;
      if (km < bestKm) { bestKm = km; best = c; }
    }
    if (best && bestKm <= 0.8) demand.set(best.id, (demand.get(best.id) ?? 0) + 1);
  }
  const scored = cells
    .filter((c) => demand.has(c.id))
    .map((c): Gap => {
      const supply = Object.entries(c.within1km).reduce((s, [t, n]) => s + (WEIGHT[t] ?? 1) * n, 0);
      const requests = demand.get(c.id)!;
      const score = (requests * (1 + Math.min(c.nearestGroceryKm, 3) / 3)) / (1 + supply);
      return { cellId: c.id, lat: c.lat, lng: c.lng, hood: c.hood, requests, supply, nearestGroceryKm: c.nearestGroceryKm,
        freeWithin1km: c.freeWithin1km, stop: c.stop, score: Math.round(score * 100) / 100 };
    })
    .sort((a, b) => b.score - a.score || b.requests - a.requests);
  // keep picks at least ~1 km apart so the top 3 are distinct places
  const picks: Gap[] = [];
  for (const g of scored) {
    if (picks.every((p) => milesBetween(p, g) * KM_PER_MI >= 1)) picks.push(g);
    if (picks.length === (o.n ?? 3)) break;
  }
  return picks;
}
