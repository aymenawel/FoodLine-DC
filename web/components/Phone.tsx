'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'es';
interface Msg { id: number; from: 'me' | 'line'; text: string; at: Date }
export interface SendResult { reply: string; lang: Lang; place: { label: string; lat: number; lng: number } | null; logged: unknown }

const WELCOME: Record<Lang, string> = {
  en: 'Hi, this is FoodLine. Text your ZIP code, neighborhood, or a cross street and I\'ll send the 3 closest places to get food. Reply HELP anytime.',
  es: 'Hola, le habla FoodLine. Envíe su código postal, barrio o una esquina y le mando los 3 lugares más cercanos para conseguir comida. Responda AYUDA cuando quiera.',
};
const STARTERS: Record<Lang, string[]> = {
  en: ['20032', 'Congress Heights', 'Minnesota Ave and Benning Rd'],
  es: ['20020', 'comida gratis en Anacostia', 'Benning Rd y Minnesota Ave'],
};
const FOLLOWUPS: Record<Lang, string[]> = {
  en: ['OPEN', 'FREE', 'MORE', 'DIRECTIONS 1'],
  es: ['ABIERTO', 'GRATIS', 'MÁS', 'DIRECCIONES 1'],
};

function newSessionId() {
  try {
    const k = 'foodline-session';
    const v = sessionStorage.getItem(k) ?? `web-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(k, v);
    return v;
  } catch { return `web-${Math.random().toString(36).slice(2, 10)}`; }
}

function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return <>{parts.map((p, i) => /^https?:\/\//.test(p)
    ? <a key={i} href={p} target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-2 break-all">Open map</a>
    : <span key={i}>{p}</span>)}</>;
}

const time = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function Phone({ framed = true, onResult }: { framed?: boolean; onResult?: (r: SendResult) => void }) {
  const [lang, setLang] = useState<Lang>('en');
  const manualLang = useRef(false); // only force a language after the person taps EN/ES; otherwise detect it
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const session = useRef('');
  const seq = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    session.current = newSessionId();
    setMsgs([{ id: 0, from: 'line', text: WELCOME.en, at: new Date() }]); // client-only, so times match the viewer's clock
  }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);

  const switchLang = (l: Lang) => {
    if (l === lang) return;
    manualLang.current = true;
    setLang(l);
    setMsgs((m) => [...m, { id: seq.current++, from: 'line', text: WELCOME[l], at: new Date() }]);
  };

  async function send(raw: string) {
    const body = raw.trim();
    if (!body || typing) return;
    setText('');
    setMsgs((m) => [...m, { id: seq.current++, from: 'me', text: body, at: new Date() }]);
    const started = Date.now();
    await new Promise((r) => setTimeout(r, 350)); // "delivered" beat before the typing bubble
    setTyping(true);
    let out: SendResult;
    try {
      const res = await fetch('/api/message', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: session.current, text: body, lang: manualLang.current ? lang : undefined }),
      });
      out = await res.json();
    } catch {
      out = { reply: lang === 'es' ? 'No se pudo enviar. Intente otra vez.' : 'Message failed to send. Please try again.', lang, place: null, logged: null };
    }
    onResult?.(out);
    const wait = Math.max(0, 900 + Math.min(out.reply.length * 3, 900) - (Date.now() - started));
    await new Promise((r) => setTimeout(r, wait));
    setTyping(false);
    if (out.lang && out.lang !== lang) setLang(out.lang);
    setHasResults(/\n1\)/.test(out.reply) || hasResults);
    setMsgs((m) => [...m, { id: seq.current++, from: 'line', text: out.reply, at: new Date() }]);
  }

  const chips = hasResults ? FOLLOWUPS[lang] : STARTERS[lang];

  const screen = (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 pb-3 pt-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span aria-hidden className="grid size-9 place-items-center rounded-full bg-accent font-serif text-xl text-accent-ink">F</span>
            <div>
              <p className="font-semibold leading-tight">FoodLine</p>
              <p className="text-xs text-muted">Simulated text line · Wards 7 &amp; 8</p>
            </div>
          </div>
        </div>
        <div role="group" aria-label="Language" className="flex rounded-full border border-line p-0.5 text-sm">
          {(['en', 'es'] as Lang[]).map((l) => (
            <button key={l} onClick={() => switchLang(l)} aria-pressed={lang === l}
              className={`min-h-9 rounded-full px-3 font-semibold ${lang === l ? 'bg-ink text-bg' : 'text-muted'}`}>
              {l === 'en' ? 'EN' : 'ES'}
            </button>
          ))}
        </div>
      </header>

      <div ref={scroller} className="flex-1 overflow-y-auto px-3 py-4" aria-live="polite">
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {msgs.map((m) => (
              <motion.li key={m.id} layout initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[86%] whitespace-pre-wrap rounded-[20px] px-3.5 py-2.5 text-[15px] leading-snug ${
                  m.from === 'me' ? 'rounded-br-md bg-accent font-medium text-accent-ink' : 'rounded-bl-md bg-panel-2 text-ink'}`}>
                  <Linkified text={m.text} />
                </div>
                <span className="mt-1 px-1 text-[11px] text-faint">{m.from === 'me' ? `Delivered ${time(m.at)}` : time(m.at)}</span>
              </motion.li>
            ))}
            {typing && (
              <motion.li key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex w-fit gap-1.5 rounded-[20px] rounded-bl-md bg-panel-2 px-4 py-3.5" aria-label="FoodLine is typing">
                <i className="dot" /><i className="dot [animation-delay:.15s]" /><i className="dot [animation-delay:.3s]" />
              </motion.li>
            )}
          </AnimatePresence>
        </ul>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 pb-2" aria-label="Suggested replies">
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)} disabled={typing}
            className="min-h-9 shrink-0 rounded-full border border-line px-3 text-sm text-ink transition hover:border-accent disabled:opacity-50">
            {c}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2 border-t border-line p-3">
        <label htmlFor="msg" className="sr-only">Message</label>
        <input id="msg" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" enterKeyHint="send"
          placeholder={lang === 'es' ? 'Código postal, barrio o esquina' : 'ZIP, neighborhood or cross street'}
          className="min-h-11 flex-1 rounded-full border border-line bg-panel px-4 text-base text-ink placeholder:text-faint focus:border-accent focus:outline-none" />
        <button type="submit" disabled={!text.trim() || typing} aria-label="Send"
          className="grid size-11 place-items-center rounded-full bg-accent text-accent-ink transition active:scale-95 disabled:opacity-40">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
    </div>
  );

  if (!framed) return <div className="h-full w-full">{screen}</div>;
  // Full-screen on a phone; drawn as a device on larger screens.
  return (
    <div className="relative h-dvh w-full sm:h-[min(780px,calc(100dvh-48px))] sm:w-[380px] sm:rounded-[52px] sm:bg-[#070b09] sm:p-3 sm:shadow-[0_40px_80px_-30px_rgba(0,0,0,.8),inset_0_0_0_1.5px_#2a3a32]">
      <div aria-hidden className="absolute left-1/2 top-5 z-10 hidden h-6 w-24 -translate-x-1/2 rounded-full bg-[#070b09] sm:block" />
      <div className="h-full overflow-hidden sm:rounded-[42px] sm:pt-6">{screen}</div>
    </div>
  );
}
