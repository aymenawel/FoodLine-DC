'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RoutePoint, StoredRequest } from '@/lib/server/store';

export type LiveMode = 'connecting' | 'live' | 'polling';

// Keeps the request list in sync: SSE when available, 1 s polling otherwise
// (Cloudflare quick tunnels and some proxies don't pass SSE through).
export function useLive() {
  const [requests, setRequests] = useState<StoredRequest[]>([]);
  const [latest, setLatest] = useState<StoredRequest | null>(null);
  const [mode, setMode] = useState<LiveMode>('connecting');
  const [route, setRoute] = useState<{ id: string; to: RoutePoint[] } | null>(null); // where the latest text was sent
  const ids = useRef(new Set<string>());
  const lastTs = useRef<string>('');

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/requests', { cache: 'no-store' });
      const j = (await res.json()) as { requests: StoredRequest[] };
      ids.current = new Set(j.requests.map((r) => r.id));
      lastTs.current = j.requests.reduce((m, r) => (r.ts > m ? r.ts : m), '');
      setRequests(j.requests);
    } catch { /* keep what we have */ }
  }, []);

  const add = useCallback((r: StoredRequest) => {
    if (ids.current.has(r.id)) return;
    ids.current.add(r.id);
    if (r.ts > lastTs.current) lastTs.current = r.ts;
    setRequests((prev) => [...prev, r]);
    if (r.source !== 'sample') setLatest(r);
  }, []);

  useEffect(() => {
    reload();
    let poll: ReturnType<typeof setInterval> | null = null;
    let es: EventSource | null = null;
    const startPolling = () => {
      if (poll) return;
      es?.close();
      setMode('polling');
      poll = setInterval(async () => {
        try {
          const res = await fetch(`/api/requests?since=${encodeURIComponent(lastTs.current)}`, { cache: 'no-store' });
          const j = (await res.json()) as { requests: StoredRequest[]; total: number };
          j.requests.forEach(add);
          if (j.total < ids.current.size) reload(); // a reset happened
          else if (j.total > ids.current.size && !j.requests.length) reload(); // a seed happened
        } catch { /* offline blip */ }
      }, 1000);
    };
    const fallback = setTimeout(startPolling, 3000);
    try {
      es = new EventSource('/api/stream');
      // on every (re)connect, reload once so anything sent during a dropped connection appears
      es.addEventListener('hello', () => { clearTimeout(fallback); setMode('live'); reload(); });
      es.addEventListener('request', (e) => {
        const d = JSON.parse((e as MessageEvent).data) as { request: StoredRequest; route?: RoutePoint[] };
        add(d.request);
        if (d.request.source !== 'sample' && d.route?.length) setRoute({ id: d.request.id, to: d.route });
      });
      es.addEventListener('reset', () => { setLatest(null); reload(); });
      es.addEventListener('seed', () => reload());
      es.onerror = () => { if (es?.readyState === EventSource.CLOSED) startPolling(); };
    } catch { startPolling(); }
    return () => { clearTimeout(fallback); es?.close(); if (poll) clearInterval(poll); };
  }, [add, reload]);

  return { requests, latest, route, mode, reload };
}

export async function adminAction(action: 'seed' | 'unseed' | 'reset' | 'reset-all') {
  await fetch('/api/admin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) });
}
