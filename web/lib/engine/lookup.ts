import { openStatus } from './hours';
import type { Place, Ranked, Resource } from './types';

export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface LookupOptions {
  now: Date;
  freeOnly?: boolean;
  openNow?: boolean;
  offset?: number;
  limit?: number;
}

export function nearest(place: Place, resources: Resource[], o: LookupOptions): Ranked[] {
  return resources
    .filter((r) => !o.freeOnly || r.free)
    .map((r) => ({ resource: r, distanceMi: milesBetween(place, r), status: openStatus(r, o.now) }))
    .filter((x) => x.status.state !== 'out_of_season') // a market closed for the season is not somewhere to send anyone
    .filter((x) => !o.openNow || x.status.state === 'open')
    .sort((a, b) => a.distanceMi - b.distanceMi)
    .slice(o.offset ?? 0, (o.offset ?? 0) + (o.limit ?? 3));
}
