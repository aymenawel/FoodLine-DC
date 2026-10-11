import { editDistance, norm, parseStreet, prettyStreet, type Street } from './normalize';
import type { Place, Places } from './types';

const FILLER = /^(i m |im |i am |we re |were |at |near |by |around |corner of |the corner of |close to |estoy en |estoy cerca de |cerca de |cerca |en |por |la esquina de |esquina de |esquina )+/;
const SPLIT = /\s+(?:and|at|y|con|e)\s+|\s*\/\s*/;
const NEIGHBORHOOD_FIXES: [RegExp, string][] = [[/\bhts\b/g, 'heights'], [/\bft\b/g, 'fort'], [/\bst\.? elizabeths?\b/g, 'saint elizabeths']];

export function resolveLocation(text: string, places: Places): Place | null {
  const t = norm(text);
  if (!t) return null;
  return byAddress(t, places) ?? byZip(t, places) ?? byIntersection(t, places) ?? byNeighborhood(t, places);
}

function byZip(t: string, places: Places): Place | null {
  const m = t.match(/\b(\d{5})\b/);
  if (!m) return null;
  const z = places.zips[m[1]];
  return z ? { kind: 'zip', label: z.zip, zip: z.zip, lat: z.lat, lng: z.lng } : null;
}

// Score how well a typed street matches a stored one: 3 exact, 2 name+suffix, 1 name only, 0 none.
function streetScore(typed: Street, stored: Street): number {
  if (typed.quad && stored.quad && typed.quad !== stored.quad) return 0;
  if (typed.base === stored.base) return 3;
  if (typed.name === stored.name && typed.base !== typed.name) return 0; // e.g. "stanton road" vs "stanton terrace"
  if (typed.name === stored.name) return 1;
  if (typed.base.length >= 5 && stored.base.startsWith(typed.base + ' ')) return 1;
  return 0;
}

const addressCache: WeakMap<object, [string, Street][]> = new WeakMap();

const STREET_WORD = /^(ave|av|avenue|st|str|street|rd|road|pl|place|dr|drive|ter|terr|terrace|ct|court|pkwy|parkway|blvd|boulevard|ln|lane|cir|circle|way)$/;
// "alabama ave se i need free food" -> "alabama ave se": stop after the quadrant, or after the street type.
function streetPart(rest: string): string {
  const toks = rest.split(' ');
  const q = toks.findIndex((t) => /^(ne|se|sw|nw)$/.test(t));
  if (q > 0) return toks.slice(0, q + 1).join(' ');
  const s = toks.findIndex((t, i) => i > 0 && STREET_WORD.test(t));
  return s > 0 ? toks.slice(0, s + 1).join(' ') : rest;
}

// "1535 Alabama Ave SE" -> the DC address point (or the nearest house number on that street).
function byAddress(t: string, places: Places): Place | null {
  const book = places.addresses;
  if (!book) return null;
  const m = t.match(/(?:^|\s)(\d{1,5})\s+([a-z].*)$/);
  if (!m) return null;
  const num = Number(m[1]);
  const rest = m[2].replace(/\b(washington|d ?c)\b/g, ' ').replace(/\b\d{5}\b/g, ' ').replace(/\s+/g, ' ').trim();
  const typed = parseStreet(streetPart(rest));
  if (!typed.name) return null;
  let keys = addressCache.get(book);
  if (!keys) { keys = Object.keys(book).map((k) => [k, parseStreet(k)]); addressCache.set(book, keys); }
  let best: string | null = null, bestScore = 0;
  for (const [k, st] of keys) {
    const sc = streetScore(typed, st);
    if (sc > bestScore) { bestScore = sc; best = k; }
  }
  if (!best) return null;
  let hit: [number, number, number] | null = null, gap = Infinity;
  for (const p of book[best]) {
    const d = Math.abs(p[0] - num) + (p[0] % 2 === num % 2 ? 0 : 0.5); // same side of the street first
    if (d < gap) { gap = d; hit = p; }
  }
  if (!hit || gap > 300) return null;
  return { kind: 'address', label: `${num} ${prettyStreet(best)}`, lat: hit[1], lng: hit[2] };
}

let streetCache: WeakMap<Places, { a: Street; b: Street }[]> = new WeakMap();
function parsedIntersections(places: Places) {
  let c = streetCache.get(places);
  if (!c) {
    c = places.intersections.map((i) => ({ a: parseStreet(i.a), b: parseStreet(i.b) }));
    streetCache.set(places, c);
  }
  return c;
}

function byIntersection(t: string, places: Places): Place | null {
  const cleaned = t.replace(FILLER, '');
  const parts = cleaned.split(SPLIT).map((p) => p.replace(FILLER, '').trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const [s1, s2] = parts.map(parseStreet);
  if (!s1.name || !s2.name) return null;
  const parsed = parsedIntersections(places);
  let best = -1, bestScore = 0;
  parsed.forEach(({ a, b }, i) => {
    const x = Math.min(streetScore(s1, a), streetScore(s2, b));
    const y = Math.min(streetScore(s1, b), streetScore(s2, a));
    const score = Math.max(x, y);
    if (score > bestScore) { bestScore = score; best = i; }
  });
  if (best < 0) return null;
  const hit = places.intersections[best];
  return { kind: 'intersection', label: `${prettyStreet(hit.a)} & ${prettyStreet(hit.b)}`, lat: hit.lat, lng: hit.lng };
}

function byNeighborhood(t: string, places: Places): Place | null {
  let text = t;
  for (const [re, to] of NEIGHBORHOOD_FIXES) text = text.replace(re, to);
  const padded = ` ${text} `;
  let best: { n: Places['neighborhoods'][number]; len: number } | null = null;
  for (const n of places.neighborhoods) {
    for (const name of n.names) {
      const k = norm(name);
      if (k.length < 4 || !padded.includes(` ${k} `)) continue;
      const better = !best || k.length > best.len || (k.length === best.len && n.east && !best.n.east);
      if (better) best = { n, len: k.length };
    }
  }
  if (!best) {
    // one-typo tolerance on 1–3 word windows, for names of 6+ letters
    const words = text.split(' ');
    for (const n of places.neighborhoods) for (const name of n.names) {
      const k = norm(name);
      if (k.length < 6) continue;
      const span = k.split(' ').length;
      for (let i = 0; i + span <= words.length; i++) {
        const w = words.slice(i, i + span).join(' ');
        if (editDistance(w, k) <= (k.length >= 9 ? 2 : 1) && (!best || n.east)) best = { n, len: k.length };
      }
    }
  }
  if (!best) return null;
  return { kind: 'neighborhood', label: best.n.name, lat: best.n.lat, lng: best.n.lng };
}

// exposed for tests that rebuild the bundle
export function _resetCache() { streetCache = new WeakMap(); }
