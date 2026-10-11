import { places } from '@/lib/engine/data';
import type { LogEntry, Need } from '@/lib/engine/types';

// Generates clearly-labelled SAMPLE requests for the gap view. These are not real residents:
// points are scattered around east-of-the-river neighborhood centers, spread over the last 24 hours.
// A seeded PRNG keeps the sample identical between runs so the demo is predictable.

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Relative weights so the sample is uneven, as real demand would be (illustrative only).
const WEIGHTS: Record<string, number> = {
  'Congress Heights': 6, 'Washington Highlands': 6, 'Bellevue': 5, 'Barry Farm': 4, 'Historic Anacostia': 4,
  'Deanwood': 5, 'Lincoln Heights': 4, 'Marshall Heights': 4, 'Benning Ridge': 3, 'Kenilworth': 3,
  'Hillcrest': 2, 'Fort Dupont': 2, 'Shipley': 4, 'Knox Hill/Buena Vista': 3, 'Garfield Heights': 3,
};

export function generateSample(now: Date, count = 140): LogEntry[] {
  const rnd = mulberry32(20261010);
  const hoods = places.neighborhoods.filter((n) => n.east && n.names.length && !/Joint Base/.test(n.name));
  const bag = hoods.flatMap((n) => Array(WEIGHTS[n.name] ?? 1).fill(n));
  const needs: Need[] = ['any', 'any', 'any', 'free', 'free', 'open_now'];
  return Array.from({ length: count }, () => {
    const n = bag[Math.floor(rnd() * bag.length)];
    const ageMin = Math.floor(rnd() * 23 * 60) + 30;
    return {
      ts: new Date(now.getTime() - ageMin * 60000).toISOString(),
      zip: null,
      lat: Math.round((n.lat + (rnd() - 0.5) * 0.008) * 1000) / 1000,
      lng: Math.round((n.lng + (rnd() - 0.5) * 0.01) * 1000) / 1000,
      need: needs[Math.floor(rnd() * needs.length)],
      lang: rnd() < 0.12 ? 'es' : 'en',
      source: 'sample',
    };
  });
}
