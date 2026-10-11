import { describe, expect, it } from 'vitest';
import { resolveLocation } from './locate';
import { places } from './data';

const loc = (t: string) => resolveLocation(t, places);

describe('resolveLocation', () => {
  it('reads a bare ZIP code', () => {
    const p = loc('20032');
    expect(p).toMatchObject({ kind: 'zip', zip: '20032' });
    expect(p!.lat).toBeCloseTo(38.83, 1);
  });

  it('reads a ZIP inside a sentence', () => {
    expect(loc('hi my zip is 20019 thanks')).toMatchObject({ kind: 'zip', zip: '20019' });
  });

  it('ignores ZIPs outside DC', () => {
    expect(loc('20743')).toBeNull();
  });

  it('matches a neighborhood by name and abbreviation', () => {
    expect(loc('Congress Heights')).toMatchObject({ kind: 'neighborhood', label: 'Congress Heights' });
    expect(loc('food in congress hts please')).toMatchObject({ kind: 'neighborhood', label: 'Congress Heights' });
  });

  it('matches an alias (Anacostia -> Historic Anacostia), not the river', () => {
    expect(loc('Anacostia')).toMatchObject({ kind: 'neighborhood', label: 'Historic Anacostia' });
  });

  it('tolerates a small typo in a neighborhood', () => {
    expect(loc('Deanwod')).toMatchObject({ kind: 'neighborhood', label: 'Deanwood' });
  });

  it('matches cross streets with abbreviations and any case', () => {
    const p = loc('Minnesota Ave and Benning Rd');
    expect(p).toMatchObject({ kind: 'intersection' });
    expect(p!.lat).toBeCloseTo(38.895, 2);
    expect(loc('minnesota ave & benning rd ne')).toMatchObject({ kind: 'intersection' });
  });

  it('matches cross streets written with "at", numbered streets and Spanish "y"', () => {
    expect(loc('Alabama Ave SE at Stanton Rd')!.lat).toBeCloseTo(38.8469, 3);
    expect(loc('4th St and Atlantic St SE')!.lng).toBeCloseTo(-77.0006, 3);
    expect(loc('Benning Rd y Minnesota Ave')).toMatchObject({ kind: 'intersection' });
  });

  it('maps the old name Good Hope Rd and MLK abbreviations', () => {
    const p = loc('MLK Ave and Good Hope Rd');
    expect(p).toMatchObject({ kind: 'intersection' });
    expect(p!.lat).toBeCloseTo(38.8674, 3);
  });

  it('finds a street address from DC address points', () => {
    const p = loc('1535 Alabama Ave SE');
    expect(p).toMatchObject({ kind: 'address', label: '1535 Alabama Ave SE' });
    expect(p!.lat).toBeCloseTo(38.8449, 3);
    expect(loc('I live at 1535 alabama avenue')).toMatchObject({ kind: 'address' });
  });

  it('uses the nearest house number when the exact one is missing', () => {
    const p = loc('1537 Alabama Ave SE');
    expect(p?.kind).toBe('address');
    expect(p!.lat).toBeCloseTo(38.845, 2);
  });

  it('prefers the street address over a ZIP in the same message', () => {
    expect(loc('1535 Alabama Ave SE 20032')).toMatchObject({ kind: 'address' });
  });

  it('finds an address followed by more words, in English or Spanish', () => {
    expect(loc('1535 Alabama Ave SE, I need free food')).toMatchObject({ kind: 'address', label: '1535 Alabama Ave SE' });
    expect(loc('vivo en 2845 Alabama Ave SE, necesito comida gratis')).toMatchObject({ kind: 'address', label: '2845 Alabama Ave SE' });
    expect(loc('4001 South Capitol St near the library')).toMatchObject({ kind: 'address' });
  });

  it('does not read a ZIP plus words as an address', () => {
    expect(loc('20019 thanks')).toMatchObject({ kind: 'zip', zip: '20019' });
  });

  it('returns null for text with no place', () => {
    expect(loc('hello')).toBeNull();
    expect(loc('i need food')).toBeNull();
  });
});
