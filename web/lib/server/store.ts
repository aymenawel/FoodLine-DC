import { EventEmitter } from 'node:events';
import { appendFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { LogEntry } from '@/lib/engine/types';
import { generateSample } from './sample';

// Anonymous request log: NDJSON on disk + in-memory copy + event bus for live updates.
// Stored fields only: ts, zip, lat/lng (3 dp), need, lang, source. Never message text or numbers.

export type StoredRequest = LogEntry & { id: string };
export type BusEvent =
  | { type: 'request'; request: StoredRequest; route?: RoutePoint[] }
  | { type: 'reset' }
  | { type: 'seed'; count: number };

const FILE = process.env.FOODLINE_LOG ?? path.join(/*turbopackIgnore: true*/ process.cwd(), '.data', 'requests.ndjson');
// Sample data is a persisted on/off switch, regenerated relative to "now" so it never ages out of the 24 h window.
const SAMPLE_FLAG = path.join(path.dirname(FILE), 'sample-on');

interface Store { requests: StoredRequest[]; bus: EventEmitter; seq: number; sampleOn: boolean }
const g = globalThis as unknown as { __foodline?: Store };

function load(): StoredRequest[] {
  if (!existsSync(FILE)) return [];
  return readFileSync(FILE, 'utf8').split('\n').filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l) as StoredRequest]; } catch { return []; }
  });
}

export function store(): Store {
  if (!g.__foodline) {
    const bus = new EventEmitter();
    bus.setMaxListeners(200);
    const requests = load().filter((r) => r.source !== 'sample');
    g.__foodline = { requests, bus, seq: requests.length, sampleOn: existsSync(SAMPLE_FLAG) };
  }
  return g.__foodline;
}

function persist(lines: StoredRequest[], append: boolean) {
  mkdirSync(path.dirname(FILE), { recursive: true });
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + (lines.length ? '\n' : '');
  if (append) appendFileSync(FILE, body); else writeFileSync(FILE, body);
}

const pick = (e: LogEntry): LogEntry => ({ ts: e.ts, zip: e.zip, lat: e.lat, lng: e.lng, need: e.need, lang: e.lang, source: e.source });

// The places a request was sent to. Shown on the live map for a few seconds only; never written to the log.
export interface RoutePoint { name: string; lat: number; lng: number }

export function addRequest(entry: LogEntry, route?: RoutePoint[]): StoredRequest {
  const s = store();
  const req: StoredRequest = { id: `r${Date.now().toString(36)}${(s.seq++).toString(36)}`, ...pick(entry) };
  s.requests.push(req);
  persist([req], true);
  s.bus.emit('event', { type: 'request', request: req, route } satisfies BusEvent);
  return req;
}

export function setSample(on: boolean) {
  const s = store();
  s.sampleOn = on;
  mkdirSync(path.dirname(SAMPLE_FLAG), { recursive: true });
  if (on) writeFileSync(SAMPLE_FLAG, new Date().toISOString());
  else if (existsSync(SAMPLE_FLAG)) unlinkSync(SAMPLE_FLAG);
  s.bus.emit('event', { type: 'seed', count: on ? sample(new Date()).length : 0 } satisfies BusEvent);
}

const sample = (now: Date): StoredRequest[] => generateSample(now).map((e, i) => ({ id: `s${i}`, ...pick(e), source: 'sample' }));

// 'live' clears texts from the demo; 'all' also turns sample data off
export function reset(scope: 'live' | 'all' = 'live') {
  const s = store();
  s.requests = [];
  persist([], false);
  if (scope === 'all') setSample(false);
  s.bus.emit('event', { type: 'reset' } satisfies BusEvent);
}

export function listRequests(now = new Date()): StoredRequest[] {
  const s = store();
  return s.sampleOn ? [...sample(now), ...s.requests] : s.requests;
}

export function subscribe(fn: (e: BusEvent) => void): () => void {
  const { bus } = store();
  bus.on('event', fn);
  return () => bus.off('event', fn);
}
