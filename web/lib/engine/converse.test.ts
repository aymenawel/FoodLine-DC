import { describe, expect, it } from 'vitest';
import { converse } from './converse';
import { detectLang } from './intent';
import { nearest } from './lookup';
import { places, resources } from './data';
import type { ConvState } from './types';

const now = new Date('2026-10-14T18:00:00Z'); // Wed 2pm in DC
const say = (text: string, state?: ConvState) => converse(state, text, { now, places, resources });

describe('detectLang', () => {
  it('spots Spanish', () => {
    expect(detectLang('necesito comida cerca de 20032')).toBe('es');
    expect(detectLang('¿dónde hay comida gratis?')).toBe('es');
  });
  it('defaults to English', () => {
    expect(detectLang('20032')).toBe(null);
    expect(detectLang('food near Congress Heights')).toBe('en');
  });
});

describe('nearest', () => {
  it('returns 3 resources sorted by distance', () => {
    const r = nearest({ kind: 'zip', label: '20032', lat: 38.8336, lng: -77.0061 }, resources, { now });
    expect(r).toHaveLength(3);
    expect(r[0].distanceMi).toBeLessThanOrEqual(r[1].distanceMi);
    expect(r[1].distanceMi).toBeLessThanOrEqual(r[2].distanceMi);
  });
  it('filters to free places', () => {
    const r = nearest({ kind: 'zip', label: '20032', lat: 38.8336, lng: -77.0061 }, resources, { now, freeOnly: true });
    expect(r.every((x) => x.resource.free)).toBe(true);
  });
  it('leaves out places that are closed for the season', () => {
    const december = new Date('2026-12-05T16:00:00Z'); // a Saturday after the Nov 21 market season ends
    const r = nearest({ kind: 'neighborhood', label: 'Anacostia', lat: 38.8632, lng: -76.9847 }, resources, { now: december, limit: 50 });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.status.state !== 'out_of_season')).toBe(true);
  });
  it('filters to places open now', () => {
    const r = nearest({ kind: 'zip', label: '20032', lat: 38.8336, lng: -77.0061 }, resources, { now, openNow: true });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.status.state === 'open')).toBe(true);
  });
});

describe('converse', () => {
  it('answers a ZIP with three places and logs the request', () => {
    const out = say('20032');
    expect(out.results).toHaveLength(3);
    expect(out.reply).toContain('1)');
    expect(out.reply).toContain(out.results[0].resource.name);
    expect(out.logEntry).toMatchObject({ zip: '20032', need: 'any', lang: 'en' });
  });

  it('never logs message text', () => {
    const out = say('my name is Dana, zip 20020');
    expect(JSON.stringify(out.logEntry)).not.toMatch(/Dana/);
  });

  it('asks for a location when none is given, in the user language', () => {
    expect(say('hi').reply).toMatch(/ZIP/);
    const es = say('necesito comida');
    expect(es.lang).toBe('es');
    expect(es.reply).toMatch(/código postal/i);
    expect(es.logEntry).toBeNull();
  });

  it('pages with MORE and keeps the location', () => {
    const first = say('Congress Heights');
    const more = say('more', first.state);
    expect(more.results).toHaveLength(3);
    expect(more.results[0].resource.id).not.toBe(first.results[0].resource.id);
    expect(more.logEntry).toBeNull();
  });

  it('handles MORE with no earlier search', () => {
    expect(say('more').reply).toMatch(/ZIP/);
  });

  it('applies FREE and OPEN follow-ups', () => {
    const first = say('20019');
    const free = say('free only', first.state);
    expect(free.results.every((r) => r.resource.free)).toBe(true);
    expect(free.logEntry).toMatchObject({ need: 'free' });
    const open = say('open now?', first.state);
    expect(open.results.every((r) => r.status.state === 'open')).toBe(true);
  });

  it('understands a filter inside the first message', () => {
    const out = say('free food in Anacostia');
    expect(out.results.every((r) => r.resource.free)).toBe(true);
  });

  it('gives directions for a numbered result', () => {
    const first = say('20032');
    const d = say('directions 2', first.state);
    expect(d.reply).toContain(first.results[1].resource.name);
    expect(d.reply).toMatch(/google\.com\/maps/);
  });

  it('switches language on request and stays switched', () => {
    const es = say('español');
    expect(es.lang).toBe('es');
    const next = say('20032', es.state);
    expect(next.lang).toBe('es');
    expect(next.reply).toMatch(/lugares/);
  });

  it('replies in Spanish to a Spanish search', () => {
    const out = say('comida gratis cerca de Congress Heights');
    expect(out.lang).toBe('es');
    expect(out.results.every((r) => r.resource.free)).toBe(true);
  });
});
