// Text normalization shared by the location resolver and intent parser.

export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SUFFIX: Record<string, string> = {
  ave: 'avenue', av: 'avenue', avenue: 'avenue', avn: 'avenue',
  rd: 'road', road: 'road', st: 'street', str: 'street', street: 'street',
  pl: 'place', place: 'place', dr: 'drive', drive: 'drive',
  ter: 'terrace', terr: 'terrace', terrace: 'terrace', ct: 'court', court: 'court',
  pkwy: 'parkway', pky: 'parkway', parkway: 'parkway', blvd: 'boulevard', boulevard: 'boulevard',
  ln: 'lane', lane: 'lane', cir: 'circle', circle: 'circle', hwy: 'highway', way: 'way',
};
const QUAD = new Set(['ne', 'se', 'sw', 'nw']);
const ORD: Record<string, string> = {
  first: '1st', second: '2nd', third: '3rd', fourth: '4th', fifth: '5th', sixth: '6th',
  seventh: '7th', eighth: '8th', ninth: '9th', tenth: '10th',
};
const ordinal = (n: string) => {
  const v = Number(n);
  const t = v % 100;
  if (t >= 11 && t <= 13) return `${v}th`;
  return `${v}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[v % 10] ?? 'th'}`;
};

export interface Street {
  base: string;       // e.g. "minnesota avenue", "4th street", "martin luther king jr avenue"
  name: string;       // base without the suffix, e.g. "minnesota"
  quad: string | null;
}

// Normalize a street phrase typed by a person or stored in the intersections layer.
export function parseStreet(raw: string): Street {
  let s = ` ${norm(raw)} `;
  s = s
    .replace(/ (mlk|m l k) (jr )?/g, ' martin luther king jr ')
    .replace(/ martin luther king (?!jr)/g, ' martin luther king jr ')
    .replace(/ good hope (road|rd) /g, ' marion barry avenue ')
    .replace(/ good hope /g, ' marion barry ');
  const toks = s.trim().split(' ').filter(Boolean)
    .map((t) => ORD[t] ?? (/^\d+$/.test(t) ? ordinal(t) : t));
  let quad: string | null = null;
  if (toks.length && QUAD.has(toks[toks.length - 1])) quad = toks.pop()!;
  const full = toks.map((t, i) => (i > 0 && SUFFIX[t] ? SUFFIX[t] : t));
  const last = full[full.length - 1];
  const hasSuffix = full.length > 1 && Object.values(SUFFIX).includes(last);
  return { base: full.join(' '), name: hasSuffix ? full.slice(0, -1).join(' ') : full.join(' '), quad };
}

// Levenshtein distance, small inputs only.
export function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const TITLE_SUFFIX: Record<string, string> = {
  avenue: 'Ave', road: 'Rd', street: 'St', place: 'Pl', drive: 'Dr', terrace: 'Ter', court: 'Ct',
  parkway: 'Pkwy', boulevard: 'Blvd', lane: 'Ln', circle: 'Cir', highway: 'Hwy',
};
// "MARTIN LUTHER KING JR AVENUE SE" -> "Martin Luther King Jr Ave SE"
export function prettyStreet(raw: string): string {
  return raw.toLowerCase().split(' ').map((t) =>
    QUAD.has(t) ? t.toUpperCase() : TITLE_SUFFIX[t] ?? (/^\d/.test(t) ? t : t[0].toUpperCase() + t.slice(1)),
  ).join(' ');
}
