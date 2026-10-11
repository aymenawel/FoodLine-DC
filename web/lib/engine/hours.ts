import type { Day, OpenStatus, Resource } from './types';

export const DAYS: Day[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const TZ = 'America/New_York';
const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23',
});

export function localParts(d: Date): { dow: Day; minutes: number; ymd: string } {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    dow: p.weekday.toLowerCase().slice(0, 3) as Day,
    minutes: Number(p.hour) * 60 + Number(p.minute),
    ymd: `${p.year}-${p.month}-${p.day}`,
  };
}

const mins = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function inSeason(r: Resource, ymd: string): boolean {
  return !r.season || (ymd >= r.season.start && ymd <= r.season.end);
}

export function openStatus(r: Resource, now: Date): OpenStatus {
  if (!r.hours) return { state: 'unknown' };
  const { dow, minutes, ymd } = localParts(now);
  if (!inSeason(r, ymd)) return { state: 'out_of_season' };
  for (const [from, to] of r.hours[dow] ?? []) {
    if (minutes >= mins(from) && minutes < mins(to)) return { state: 'open', closesAt: to };
  }
  const today = DAYS.indexOf(dow);
  for (let k = 0; k < 7; k++) {
    const day = DAYS[(today + k) % 7];
    const spans = (r.hours[day] ?? []).filter(([from]) => k > 0 || mins(from) > minutes);
    if (spans.length) return { state: 'closed', opensAt: spans[0][0], opensDay: day };
  }
  return { state: 'closed' };
}
