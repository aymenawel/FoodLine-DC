import { detectLang, parseCommand, wantsFree, wantsOpen } from './intent';
import { resolveLocation } from './locate';
import { nearest, milesBetween } from './lookup';
import { openStatus } from './hours';
import * as R from './reply';
import type { ConvState, Lang, LogEntry, Place, Places, Ranked, Resource } from './types';

export interface ConverseOptions {
  now: Date;
  places: Places;
  resources: Resource[];
  forcedLang?: Lang;               // the on-screen EN/ES toggle
  locate?: (text: string) => Place | null; // optional fallback (AI extraction) when rules fail
}

export interface ConverseResult {
  state: ConvState;
  reply: string;
  lang: Lang;
  place: Place | null;
  results: Ranked[];
  logEntry: LogEntry | null;
}

export const initialState = (): ConvState => ({
  lang: 'en', langLocked: false, place: null, freeOnly: false, openNow: false, offset: 0, lastIds: [],
});

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export function converse(prev: ConvState | undefined, text: string, o: ConverseOptions): ConverseResult {
  const state: ConvState = { ...(prev ?? initialState()) };
  const done = (reply: string, extra: Partial<ConverseResult> = {}): ConverseResult =>
    ({ state, reply, lang: state.lang, place: state.place, results: [], logEntry: null, ...extra });

  if (o.forcedLang) { state.lang = o.forcedLang; state.langLocked = true; }
  const cmd = parseCommand(text);
  if (cmd?.kind === 'lang') {
    state.lang = cmd.lang; state.langLocked = true;
    return done(R.langSet(cmd.lang));
  }
  const detected = detectLang(text);
  if (!state.langLocked && detected) state.lang = detected;
  const lang = state.lang;

  const search = (log: boolean): ConverseResult => {
    const place = state.place!;
    const results = nearest(place, o.resources, { now: o.now, freeOnly: state.freeOnly, openNow: state.openNow, offset: state.offset });
    state.lastIds = results.length ? results.map((r) => r.resource.id) : state.lastIds;
    const reply = R.listReply({ lang, place, results, now: o.now, freeOnly: state.freeOnly, openNow: state.openNow, offset: state.offset });
    const logEntry: LogEntry | null = log ? {
      ts: o.now.toISOString(), zip: place.zip ?? null, lat: round3(place.lat), lng: round3(place.lng),
      need: state.freeOnly ? 'free' : state.openNow ? 'open_now' : 'any', lang, source: 'live',
    } : null;
    return done(reply, { results, logEntry, place });
  };

  if (cmd?.kind === 'help') return done(R.helpReply(lang));

  if (cmd?.kind === 'more') {
    if (!state.place) return done(R.askLocation(lang));
    state.offset += 3;
    return search(false);
  }

  if (cmd?.kind === 'directions') {
    const id = state.lastIds[cmd.n - 1];
    if (!state.place || !state.lastIds.length) return done(R.askLocation(lang));
    const r = o.resources.find((x) => x.id === id);
    if (!r) return done(R.noSuchResult(lang, cmd.n));
    const ranked: Ranked = { resource: r, distanceMi: milesBetween(state.place, r), status: openStatus(r, o.now) };
    return done(R.directionsReply(ranked, lang, o.now), { results: [ranked] });
  }

  if (cmd?.kind === 'all') {
    state.freeOnly = false; state.openNow = false; state.offset = 0;
    return state.place ? search(false) : done(R.askLocation(lang));
  }

  const free = wantsFree(text);
  const open = wantsOpen(text);
  const place = resolveLocation(text, o.places) ?? o.locate?.(text) ?? null;

  if (place) {
    state.place = place; state.offset = 0;
    state.freeOnly = free || (state.freeOnly && !prev?.place); // a filter sent before the first location carries over
    state.openNow = open || (state.openNow && !prev?.place);
    return search(true);
  }

  if (free || open) {
    if (free) state.freeOnly = true;
    if (open) state.openNow = true;
    state.offset = 0;
    return state.place ? search(true) : done(R.filterPending(lang));
  }

  if (/\b\d{5}\b/.test(text)) return done(R.notFound(lang));
  return done(state.place || text.trim().split(/\s+/).length > 2 ? R.notFound(lang) : R.askLocation(lang));
}
