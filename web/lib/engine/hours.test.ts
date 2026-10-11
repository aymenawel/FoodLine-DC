import { describe, expect, it } from 'vitest';
import { openStatus, localParts } from './hours';
import type { Resource } from './types';

// 2026-10-14 is a Wednesday. 18:00Z = 14:00 in Washington (EDT, UTC-4).
const at = (iso: string) => new Date(iso);
const base = { hours: null, season: null, schedule_note: null } as unknown as Resource;
const weekly = (spans: Record<string, [string, string][]>) => ({ ...base, hours: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [], ...spans } }) as Resource;

describe('localParts', () => {
  it('converts to Washington local time', () => {
    expect(localParts(at('2026-10-14T18:00:00Z'))).toEqual({ dow: 'wed', minutes: 14 * 60, ymd: '2026-10-14' });
  });
});

describe('openStatus', () => {
  it('is open inside today\'s span and reports the closing time', () => {
    const s = openStatus(weekly({ wed: [['07:00', '21:00']] }), at('2026-10-14T18:00:00Z'));
    expect(s).toMatchObject({ state: 'open', closesAt: '21:00' });
  });

  it('is closed before opening and reports when it opens today', () => {
    const s = openStatus(weekly({ wed: [['15:00', '17:00']] }), at('2026-10-14T18:00:00Z'));
    expect(s).toMatchObject({ state: 'closed', opensAt: '15:00', opensDay: 'wed' });
  });

  it('finds the next open day when closed today', () => {
    const s = openStatus(weekly({ sat: [['10:00', '14:00']] }), at('2026-10-14T18:00:00Z'));
    expect(s).toMatchObject({ state: 'closed', opensAt: '10:00', opensDay: 'sat' });
  });

  it('treats a 24:00 close as end of day', () => {
    const s = openStatus(weekly({ wed: [['05:00', '24:00']] }), at('2026-10-15T03:30:00Z')); // 23:30 Wed
    expect(s.state).toBe('open');
  });

  it('never claims unknown hours are open', () => {
    expect(openStatus(base, at('2026-10-14T18:00:00Z')).state).toBe('unknown');
  });

  it('is out of season after the season ends, even during listed hours', () => {
    const r = { ...weekly({ sat: [['10:00', '14:00']] }), season: { start: '2026-06-06', end: '2026-11-21' } } as Resource;
    expect(openStatus(r, at('2026-11-28T16:00:00Z')).state).toBe('out_of_season');
    expect(openStatus(r, at('2026-10-17T16:00:00Z')).state).toBe('open');
  });
});
