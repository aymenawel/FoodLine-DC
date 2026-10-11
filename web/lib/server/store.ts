import { EventEmitter } from 'node:events';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { LogEntry } from '@/lib/engine/types';

// Anonymous request log: NDJSON on disk + in-memory copy + event bus for live updates.
// Stored fields only: ts, zip, lat/lng (3 dp), need, lang, source. Never message text or numbers.

export type StoredRequest = LogEntry & { id: string };
export type BusEvent =
  | { type: 'request'; request: StoredRequest }
  | { type: 'reset' }
  | { type: 'seed'; count: number };

const FILE = process.env.FOODLINE_LOG ?? path.join(/*turbopackIgnore: true*/ process.cwd(), '.data', 'requests.ndjson');

interface Store { requests: StoredRequest[]; bus: EventEmitter; seq: number }
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
    const requests = load();
    g.__foodline = { requests, bus, seq: requests.length };
  }
  return g.__foodline;
}

function persist(lines: StoredRequest[], append: boolean) {
  mkdirSync(path.dirname(FILE), { recursive: true });
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + (lines.length ? '\n' : '');
  if (append) appendFileSync(FILE, body); else writeFileSync(FILE, body);
}

const pick = (e: LogEntry): LogEntry => ({ ts: e.ts, zip: e.zip, lat: e.lat, lng: e.lng, need: e.need, lang: e.lang, source: e.source });

export function addRequest(entry: LogEntry): StoredRequest {
  const s = store();
  const req: StoredRequest = { id: `r${Date.now().toString(36)}${(s.seq++).toString(36)}`, ...pick(entry) };
  s.requests.push(req);
  persist([req], true);
  s.bus.emit('event', { type: 'request', request: req } satisfies BusEvent);
  return req;
}

export function addSample(entries: LogEntry[]) {
  const s = store();
  const reqs = entries.map((e, i) => ({ id: `s${i}`, ...pick({ ...e, source: 'sample' }) }));
  s.requests = [...s.requests.filter((r) => r.source !== 'sample'), ...reqs];
  persist(s.requests, false);
  s.bus.emit('event', { type: 'seed', count: reqs.length } satisfies BusEvent);
}

// scope 'live' clears texts from the demo; 'all' also clears sample data
export function reset(scope: 'live' | 'all' = 'live') {
  const s = store();
  s.requests = scope === 'all' ? [] : s.requests.filter((r) => r.source === 'sample');
  persist(s.requests, false);
  s.bus.emit('event', { type: 'reset' } satisfies BusEvent);
}

export function listRequests(): StoredRequest[] {
  return store().requests;
}

export function subscribe(fn: (e: BusEvent) => void): () => void {
  const { bus } = store();
  bus.on('event', fn);
  return () => bus.off('event', fn);
}
