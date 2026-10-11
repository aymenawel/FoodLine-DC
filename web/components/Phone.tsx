'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'es';
interface Msg { id: number; from: 'me' | 'line'; text: string; at: Date; lang: Lang }
export interface SendResult { reply: string; lang: Lang; place: { label: string; lat: number; lng: number } | null; logged: unknown }

const WELCOME: Record<Lang, string> = {
  en: 'Hi, this is FoodLine. Text your ZIP code, neighborhood, street address or a cross street and I\'ll send the 3 closest places to get food. Reply HELP anytime.',
  es: 'Hola, le habla FoodLine. Envíe su código postal, barrio, dirección o una esquina y le mando los 3 lugares más cercanos para conseguir comida. Responda AYUDA cuando quiera.',
};
const STARTERS: Record<Lang, string[]> = {
  en: ['20032', 'Congress Heights', 'Minnesota Ave and Benning Rd'],
  es: ['20020', 'comida gratis en Anacostia', 'Benning Rd y Minnesota Ave'],
};
const FOLLOWUPS: Record<Lang, string[]> = {
  en: ['OPEN', 'FREE', 'MORE', 'DIRECTIONS 1'],
  es: ['ABIERTO', 'GRATIS', 'MÁS', 'DIRECCIONES 1'],
};
const UI = {
  en: { placeholder: 'ZIP, neighborhood or address', send: 'Send', message: 'Message', typing: 'FoodLine is typing', map: 'Open map', chips: 'Suggested replies', failed: 'Message failed to send. Please try again.' },
  es: { placeholder: 'Código postal, barrio o dirección', send: 'Enviar', message: 'Mensaje', typing: 'FoodLine está escribiendo', map: 'Abrir mapa', chips: 'Respuestas sugeridas', failed: 'No se pudo enviar. Intente otra vez.' },
};

// A fresh conversation on every page load, so a language picked by the last visitor never carries over.
const newSessionId = () => `web-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

function Linkified({ text, lang }: { text: string; lang: Lang }) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return <>{parts.map((p, i) => /^https?:\/\//.test(p)
    ? <a key={i} href={p} target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-2 break-all">{UI[lang].map}</a>
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
  const [announce, setAnnounce] = useState<{ text: string; lang: Lang }>({ text: '', lang: 'en' });
  const session = useRef('');
  const seq = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const busy = useRef(false); // set synchronously, so a double tap can't send twice

  useEffect(() => {
    session.current = newSessionId();
    setMsgs([{ id: 0, from: 'line', text: WELCOME.en, at: new Date(), lang: 'en' }]); // client-only, so times match the viewer's clock
  }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);

  const switchLang = (l: Lang) => {
    if (l === lang) return;
    manualLang.current = true;
    setLang(l);
    setMsgs((m) => [...m, { id: seq.current++, from: 'line', text: WELCOME[l], at: new Date(), lang: l }]);
    setAnnounce({ text: WELCOME[l], lang: l });
  };

  async function send(raw: string) {
    const body = raw.trim();
    if (!body || busy.current) return;
    busy.current = true;
    // after tapping a suggestion with a mouse or keyboard, bring focus back to the text box (not on touch, to avoid popping the keyboard)
    const fromChip = !!(document.activeElement as HTMLElement | null)?.closest?.('[data-chip]') && matchMedia('(pointer: fine)').matches;
    setText('');
    setMsgs((m) => [...m, { id: seq.current++, from: 'me', text: body, at: new Date(), lang }]);
    const started = Date.now();
    await new Promise((r) => setTimeout(r, 350)); // "delivered" beat before the typing bubble
    setTyping(true);
    let out: SendResult;
    try {
      const res = await fetch('/api/message', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: session.current, text: body, lang: manualLang.current ? lang : undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      out = await res.json();
    } catch {
      out = { reply: UI[lang].failed, lang, place: null, logged: null };
    }
    onResult?.(out);
    const wait = Math.max(0, 900 + Math.min(out.reply.length * 3, 900) - (Date.now() - started));
    await new Promise((r) => setTimeout(r, wait));
    setTyping(false);
    busy.current = false;
    const replyLang: Lang = out.lang === 'es' ? 'es' : 'en';
    if (replyLang !== lang) setLang(replyLang);
    setHasResults((h) => h || /\n1\)/.test(out.reply));
    setMsgs((m) => [...m, { id: seq.current++, from: 'line', text: out.reply, at: new Date(), lang: replyLang }]);
    setAnnounce({ text: out.reply, lang: replyLang });
    if (fromChip) input.current?.focus({ preventScroll: true });
  }

  const chips = hasResults ? FOLLOWUPS[lang] : STARTERS[lang];
  const t = UI[lang];

  const screen = (
    <div className="flex h-full flex-col bg-bg">
      <h1 className="sr-only">FoodLine text line</h1>
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 pb-3 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-cta font-serif text-xl text-cta-ink">F</span>
          <div>
            <p className="font-semibold leading-tight">FoodLine</p>
            <p className="text-[0.9375rem] text-muted">Simulated text line · Wards 7 &amp; 8</p>
          </div>
        </div>
        <div role="group" aria-label="Language / Idioma" className="flex rounded-full border border-line-strong p-0.5 text-base">
          <button onClick={() => switchLang('en')} aria-pressed={lang === 'en'} aria-label="English"
            className={`min-h-9 rounded-full px-3 font-semibold ${lang === 'en' ? 'bg-ink text-bg' : 'text-muted'}`}>EN</button>
          <button onClick={() => switchLang('es')} aria-pressed={lang === 'es'} aria-label="Español" lang="es"
            className={`min-h-9 rounded-full px-3 font-semibold ${lang === 'es' ? 'bg-ink text-bg' : 'text-muted'}`}>ES</button>
        </div>
      </header>

      <div ref={scroller} tabIndex={0} aria-label="Conversation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {msgs.map((m) => (
              <motion.li key={m.id} lang={m.lang} layout initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                <span className="sr-only">{m.from === 'me' ? 'You:' : 'FoodLine:'}</span>
                <div className={`max-w-[86%] whitespace-pre-wrap rounded-[20px] px-3.5 py-2.5 text-[1.125rem] leading-snug ${
                  m.from === 'me' ? 'rounded-br-md bg-cta font-medium text-cta-ink' : 'rounded-bl-md bg-panel-2 text-ink'}`}>
                  <Linkified text={m.text} lang={m.lang} />
                </div>
                <span aria-hidden className="mt-1 px-1 text-[0.8125rem] text-faint">{m.from === 'me' ? `Delivered ${time(m.at)}` : time(m.at)}</span>
              </motion.li>
            ))}
            {typing && (
              <motion.li key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex w-fit gap-1.5 rounded-[20px] rounded-bl-md bg-panel-2 px-4 py-3.5">
                <span className="sr-only">{t.typing}</span>
                <i aria-hidden className="dot" /><i aria-hidden className="dot [animation-delay:.15s]" /><i aria-hidden className="dot [animation-delay:.3s]" />
              </motion.li>
            )}
          </AnimatePresence>
        </ul>
      </div>
      {/* Screen readers hear only FoodLine's replies, once each. */}
      <p role="status" className="sr-only" lang={announce.lang}>{announce.text}</p>

      <div role="group" aria-label={t.chips} lang={lang} className="flex gap-2 overflow-x-auto px-3 py-1.5">
        {chips.map((c) => (
          <button key={c} data-chip onClick={() => send(c)} aria-disabled={typing}
            className="min-h-10 shrink-0 rounded-full border border-line-strong px-3 text-base text-ink transition hover:border-cta aria-disabled:opacity-50">
            {c}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2 border-t border-line p-3">
        <label htmlFor="msg" className="sr-only" lang={lang}>{t.message}</label>
        <input id="msg" ref={input} value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" enterKeyHint="send" lang={lang}
          placeholder={t.placeholder}
          className="min-h-11 flex-1 rounded-full border border-[color:var(--line-input)] bg-panel px-4 text-base text-ink placeholder:text-faint focus:border-cta" />
        <button type="submit" disabled={!text.trim() || typing} aria-label={t.send} lang={lang}
          className="grid size-11 place-items-center rounded-full bg-cta text-cta-ink transition active:scale-95 disabled:opacity-40">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
    </div>
  );

  if (!framed) return <div className="h-full w-full">{screen}</div>;
  // Full-screen on a phone; drawn as a device on larger screens.
  return (
    <div className="relative h-dvh w-full sm:h-[min(46rem,calc(100dvh-3rem))] sm:w-[20.5rem] sm:rounded-[52px] sm:bg-[color:var(--phone-frame)] sm:p-3 sm:[box-shadow:var(--phone-shadow)]">
      <div aria-hidden className="absolute left-1/2 top-5 z-10 hidden h-6 w-24 -translate-x-1/2 rounded-full bg-[color:var(--phone-frame)] sm:block" />
      <div className="h-full overflow-hidden sm:rounded-[42px] sm:pt-6">{screen}</div>
    </div>
  );
}
