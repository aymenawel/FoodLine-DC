'use client';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Gap } from '@/lib/engine/gap';
import { adminAction, useLive } from '@/lib/client/useLive';
import { MAP_SOURCES, STATS, type Stat } from '@/lib/stats';
import type { MapView, Padding } from './LiveMap';

const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false, loading: () => <div className="absolute inset-0 bg-bg" /> });

const VIEWS: { id: MapView; label: string }[] = [
  { id: 'city', label: 'Citywide' },
  { id: 'focus', label: 'Wards 7 & 8 live' },
  { id: 'gap', label: 'Gap view' },
];
const TITLES: Record<MapView, [string, string]> = {
  city: ['Most of DC’s grocery stores', 'are west of the river.'],
  focus: ['Every text', 'becomes a dot.'],
  gap: ['Where a mobile market', 'would help most.'],
};
const NEED: Record<string, string> = { any: 'Any food', free: 'Free food', open_now: 'Open now' };
const mi = (km: number) => (km / 1.609344).toFixed(1);
const pretty = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  .replace(/\b(Ne|Se|Sw|Nw)\b/g, (q) => q.toUpperCase()).replace(/\bAvenue\b/g, 'Ave').replace(/\bStreet\b/g, 'St').replace(/\bRoad\b/g, 'Rd').replace(/\bPlace\b/g, 'Pl');

function Source({ s }: { s: Pick<Stat, 'source' | 'url'> }) {
  return <a href={s.url} target="_blank" rel="noreferrer" className="text-[15px] text-faint underline decoration-line underline-offset-2 hover:text-muted">{s.source}</a>;
}

function Legend({ view }: { view: MapView }) {
  const items: [string, string, string?][] = view === 'city'
    ? [['#233634', 'Full-service grocery store'], ['#2f7a2b', 'Grocery store east of the river']]
    : [['#233634', 'Grocery store'], ['#1f7a8c', 'Free food (pantry, free market)', 'ring'], ['#479442', 'Farmers or mobile market'],
       ['#8c7a5b', 'Corner store with produce'], ['#fe5921', 'Request (live)'], ['#c98a12', 'Request (sample)'],
       ...(view === 'focus' ? [['#d9531e', 'Low food access area (DC, 2017)', 'square'] as [string, string, string]] : [])];
  return (
    <ul className="grid gap-1.5 text-base text-muted">
      {items.map(([c, l, shape]) => (
        <li key={l} className="flex items-center gap-2.5">
          <i aria-hidden className={`inline-block size-3 shrink-0 ${shape === 'square' ? 'rounded-[2px] opacity-70' : 'rounded-full'}`}
            style={shape === 'ring' ? { border: `3px solid ${c}` } : { background: c }} />{l}
        </li>
      ))}
    </ul>
  );
}

export default function MapScreen({ compact = false, initialView = 'city' }: { compact?: boolean; initialView?: MapView }) {
  const [view, setView] = useState<MapView>(initialView);
  const [present, setPresent] = useState(false);
  const [streets, setStreets] = useState(true);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [basis, setBasis] = useState({ requests24h: 0, sample: 0 });
  const [busy, setBusy] = useState(false);
  const { requests, latest, route, mode } = useLive();
  const labelFor = useRef<(lat: number, lng: number) => string>(() => '');
  const [announce, setAnnounce] = useState('');
  const lastAnnounce = useRef(0);
  useEffect(() => {
    if (!latest || Date.now() - lastAnnounce.current < 8000) return;
    lastAnnounce.current = Date.now();
    const where = latest.zip ?? labelFor.current(latest.lat, latest.lng).replace('Historic ', '');
    setAnnounce(`New request${where ? ` near ${where}` : ''}: ${NEED[latest.need].toLowerCase()}.`);
  }, [latest]);

  const live = useMemo(() => requests.filter((r) => r.source !== 'sample'), [requests]);
  const sampleCount = requests.length - live.length;
  const recent = useMemo(() => [...live].sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, compact ? 4 : 6), [live, compact]);

  // Gap ranking is recomputed on the server from the request log whenever it changes.
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const j = await (await fetch('/api/gap', { cache: 'no-store' })).json();
        setGaps(j.gaps); setBasis(j.basis);
      } catch { /* keep last */ }
    }, 250);
    return () => clearTimeout(t);
  }, [requests]);

  const step = useCallback((dir: 1 | -1) => {
    setView((v) => VIEWS[Math.min(VIEWS.length - 1, Math.max(0, VIEWS.findIndex((x) => x.id === v) + dir))].id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      if ((e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
      if (e.key.toLowerCase() === 'p') setPresent((p) => !p);
      if (e.key === '1') setView('city');
      if (e.key === '2') setView('focus');
      if (e.key === '3') setView('gap');
      if (e.key === 'S' && e.shiftKey) adminAction('seed');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const panelW = compact ? 360 : 440;
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  // On phones the panel sits at the bottom, so the map gets the top half of the screen.
  const padding: Padding = useMemo(() => narrow
    ? { top: 150, right: 16, bottom: Math.round(window.innerHeight * 0.45), left: 16 }
    : { top: 90, right: 40, bottom: compact ? 40 : 150, left: panelW + 40 }, [compact, panelW, narrow]);
  const run = async (a: 'seed' | 'unseed' | 'reset') => { setBusy(true); await adminAction(a); setBusy(false); };
  const [t1, t2] = TITLES[view];

  return (
    <div className={`relative h-full min-h-[600px] w-full overflow-hidden bg-bg ${compact ? '' : '[&_.maplibregl-ctrl-bottom-right]:!bottom-[112px]'}`}>
      <LiveMap view={view} requests={requests} latest={latest} route={route} gaps={gaps} streets={streets} padding={padding} onLabelFor={(fn) => (labelFor.current = fn)} />

      {/* Left editorial panel */}
      <section className="pointer-events-none absolute inset-y-0 left-0 flex w-full flex-col justify-between gap-5 p-4 pt-16 md:justify-start md:p-6" style={{ maxWidth: narrow ? undefined : panelW }}>
        <div className="pointer-events-auto -mx-4 -mt-16 w-[calc(100%+32px)] bg-gradient-to-b from-bg via-bg/90 to-transparent px-4 pb-6 pt-16 md:mx-0 md:mt-0 md:w-[min(640px,calc(100vw-48px))] md:bg-none md:p-0">
          <p className="kicker hidden md:block">FoodLine DC · {view === 'city' ? 'All of DC' : 'Wards 7 & 8, east of the Anacostia'}</p>
          <AnimatePresence mode="wait">
            <motion.h1 key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
              className={`mt-3 font-serif leading-[1.02] tracking-[-0.01em] ${compact ? 'text-[38px]' : 'text-[34px] sm:text-[50px]'}`}>
              {t1}<br /><em className="text-cta">{t2}</em>
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto max-h-[42dvh] overflow-y-auto rounded-2xl border border-line bg-panel/92 p-5 backdrop-blur-sm md:max-h-[calc(100dvh-220px)]" tabIndex={0} aria-label="Map details">
          {view === 'city' && (
            <div className="grid gap-4">
              <div>
                <p className="num text-[56px] font-medium leading-none">5<span className="text-muted"> of 80</span></p>
                <p className="mt-2 text-[17px] leading-snug">full-service grocery stores in DC are east of the river, where more than 150,000 people live.</p>
                <div className="mt-1.5 flex flex-col gap-1.5"><Source s={STATS.eastStores} />
                  <a className="text-[15px] text-faint underline decoration-line underline-offset-2" href="https://dcfoodpolicy.org/wp-content/uploads/2023/09/2022-assessment-of-the-food-system-in-the-district-of-columbia-report.pdf" target="_blank" rel="noreferrer">Population: DC Food Policy Council, Food System Assessment 2023</a></div>
              </div>
              <Legend view="city" />
              <p className="text-[15px] text-faint">Dots: {MAP_SOURCES[0].label}, plus the Marion Barry Avenue Market (opened Sept 2025).</p>
            </div>
          )}

          {view === 'focus' && (
            <div className="grid gap-4">
              <div className="flex items-end gap-6">
                <div><p className="num text-[56px] font-medium leading-none text-accent-text">{live.length}</p><p className="text-base text-muted">live requests</p></div>
                {sampleCount > 0 && <div><p className="num text-3xl leading-none text-[#8a5a0a]">{sampleCount}</p><p className="text-base text-muted">sample</p></div>}
                <p className="ml-auto flex items-center gap-2 text-[15px] text-muted">
                  <span className={`size-2 rounded-full ${mode === 'live' ? 'bg-food-east' : mode === 'polling' ? 'bg-[#c98a12]' : 'bg-faint'}`} />
                  {mode === 'live' ? 'Live' : mode === 'polling' ? 'Live (polling)' : 'Connecting'}
                </p>
              </div>
              <ul className="grid gap-1" aria-label="Latest requests">
                <AnimatePresence initial={false}>
                  {recent.length === 0 && <li className="text-base text-muted">Waiting for the first text. Scan the code or open /chat.</li>}
                  {recent.map((r) => (
                    <motion.li key={r.id} layout initial={{ opacity: 0, x: -12, backgroundColor: 'rgba(254,89,33,.22)' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(254,89,33,0)' }} transition={{ duration: 1.2 }}
                      className="flex items-baseline justify-between gap-3 rounded-md px-2 py-1 text-base">
                      <span className="num text-muted">{new Date(r.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                      <span className="flex-1 truncate">{r.zip ?? (labelFor.current(r.lat, r.lng).replace('Historic ', '') || 'Ward 7/8')}</span>
                      <span className="text-muted">{NEED[r.need]}{r.lang === 'es' ? ' · ES' : ''}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <Legend view="focus" />
              <p className="text-[15px] text-faint">Each dot stores only time, ZIP or rounded location, need and language. No names, numbers or message text.</p>
            </div>
          )}

          {view === 'gap' && (
            <div className="grid gap-4">
              {gaps.length === 0 ? (
                <p className="text-[15px] text-muted">Not enough requests yet. Send a few texts, or load the labelled sample data.</p>
              ) : (
                <ol className="grid gap-4">
                  {gaps.map((g, i) => (
                    <li key={g.cellId} className="grid grid-cols-[36px_1fr] gap-3">
                      <span className="num grid size-9 place-items-center rounded-full bg-ink text-lg font-semibold text-bg">{i + 1}</span>
                      <div>
                        <h2 className="font-serif text-2xl leading-tight">{g.hood === 'Historic Anacostia' ? 'Anacostia' : g.hood ?? 'East of the river'}</h2>
                        <p className="text-base leading-snug text-muted">
                          <span className="text-ink">{g.requests} request{g.requests === 1 ? '' : 's'}</span> in 24 h · nearest grocery {mi(g.nearestGroceryKm)} mi ·{' '}
                          {g.freeWithin1km === 0 ? 'no free food site' : `${g.freeWithin1km} free site${g.freeWithin1km > 1 ? 's' : ''}`} within 0.6 mi
                        </p>
                        {g.stop && <p className="mt-0.5 text-base">Suggested stop: <span className="font-semibold text-accent-text">{pretty(g.stop.a)} &amp; {pretty(g.stop.b)}</span></p>}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <p className="text-[15px] text-faint">Score = requests × distance-to-grocery factor ÷ (1 + nearby food sites). Based on {basis.requests24h} requests in the last 24 h{basis.sample ? `, ${basis.sample} of them SAMPLE data` : ''}.</p>
            </div>
          )}
        </div>
      </section>

      {/* View switcher + demo controls */}
      <div className={`absolute right-3 top-3 flex flex-col items-end gap-2 transition-opacity sm:right-5 sm:top-5 ${present ? 'opacity-0 hover:opacity-100 focus-within:opacity-100' : ''}`}>
        <div role="group" aria-label="Map view" className="flex max-w-[calc(100vw-24px)] flex-wrap justify-end rounded-[22px] border border-line bg-panel/90 p-1 backdrop-blur-sm">
          {VIEWS.map((v) => (
            <button key={v.id} onClick={() => setView(v.id)} aria-pressed={view === v.id}
              className={`min-h-10 rounded-full px-4 text-base font-semibold transition ${view === v.id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>{v.label}</button>
          ))}
        </div>
        <button onClick={() => setStreets((v) => !v)} aria-pressed={streets} className="min-h-11 rounded-full border border-line-strong bg-panel/90 px-4 text-base font-semibold text-ink">Streets {streets ? 'on' : 'off'}</button>
        <div className="hidden gap-2 text-base md:flex">
          {sampleCount > 0
            ? <button disabled={busy} onClick={() => run('unseed')} className="min-h-9 rounded-full border border-line bg-panel/90 px-3 text-muted hover:text-ink">Remove sample data</button>
            : <button disabled={busy} onClick={() => run('seed')} className="min-h-9 rounded-full border border-line bg-panel/90 px-3 text-muted hover:text-ink">Load sample data</button>}
          <button disabled={busy || live.length === 0} onClick={() => run('reset')} className="min-h-9 rounded-full border border-line bg-panel/90 px-3 text-muted hover:text-ink disabled:opacity-40">Clear live requests</button>
        </div>
      </div>

      {sampleCount > 0 && view !== 'city' && (
        <p className="absolute right-5 top-[176px] hidden rounded-md md:block border border-dashed border-[#8a5a0a] bg-panel/90 px-3 py-1.5 font-mono text-[15px] uppercase tracking-[.12em] text-[#8a5a0a]">
          Includes {sampleCount} sample requests · not real residents
        </p>
      )}

      <p role="status" className="sr-only">{announce}</p>

      {/* Stats strip */}
      {!compact && (
        <footer className="absolute inset-x-0 bottom-0 hidden grid-cols-4 gap-px border-t border-line bg-line/60 lg:grid">
          {[STATS.wardGap, STATS.snap, STATS.noCar, STATS.dcInsecure].map((s) => (
            <div key={s.id} className="bg-bg/92 px-6 py-4 backdrop-blur-sm">
              <p className="num text-3xl font-medium leading-none">{s.value}</p>
              <p className="mt-1.5 text-base leading-snug">{s.label}</p>
              <Source s={s} />
            </div>
          ))}
        </footer>
      )}
    </div>
  );
}
