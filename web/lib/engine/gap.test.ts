import { describe, expect, it } from 'vitest';
import { topGaps, type Cell } from './gap';

const cell = (id: number, lat: number, lng: number, within1km: Record<string, number>, nearestGroceryKm: number): Cell =>
  ({ id, lat, lng, hood: `Hood ${id}`, within1km, freeWithin1km: 0, nearestGroceryKm, stop: null });

const cells: Cell[] = [
  cell(0, 38.84, -76.99, { grocery: 1, pantry: 3 }, 0.3),   // well served
  cell(1, 38.86, -76.95, {}, 2.4),                          // nothing nearby
  cell(2, 38.89, -76.93, { corner_store: 1 }, 1.8),
];
const now = new Date('2026-10-14T18:00:00Z');
const req = (lat: number, lng: number, minsAgo = 5) => ({ lat, lng, ts: new Date(now.getTime() - minsAgo * 60000).toISOString() });

describe('topGaps', () => {
  it('ranks unmet demand above demand near many resources', () => {
    const requests = [...Array(6)].map(() => req(38.84, -76.99)).concat([...Array(4)].map(() => req(38.86, -76.95)));
    const gaps = topGaps(requests, cells, now);
    expect(gaps[0].cellId).toBe(1);
    expect(gaps[0].requests).toBe(4);
  });

  it('ignores requests outside the time window and cells with no requests', () => {
    const gaps = topGaps([req(38.86, -76.95, 60 * 30), req(38.89, -76.93)], cells, now, { windowHours: 24 });
    expect(gaps.map((g) => g.cellId)).toEqual([2]);
  });

  it('returns at most n gaps', () => {
    const requests = [req(38.84, -76.99), req(38.86, -76.95), req(38.89, -76.93)];
    expect(topGaps(requests, cells, now, { n: 2 })).toHaveLength(2);
  });
});
