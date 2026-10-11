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

  it('returns null for text with no place', () => {
    expect(loc('hello')).toBeNull();
    expect(loc('i need food')).toBeNull();
  });
});
