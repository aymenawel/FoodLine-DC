import { converse } from '@/lib/engine/converse';
import { places, resources } from '@/lib/engine/data';
import type { Lang } from '@/lib/engine/types';
import { aiEnabled, aiExtractLocation, aiRephrase } from './ai';
import { getSession, saveSession } from './sessions';
import { addRequest, type StoredRequest } from './store';

export interface HandleResult {
  reply: string;
  lang: Lang;
  place: { label: string; lat: number; lng: number; kind: string } | null;
  results: { id: string; name: string; type: string; lat: number; lng: number; distanceMi: number; open: string }[];
  logged: StoredRequest | null;
  ai: boolean;
}

// One message in, one reply out. Shared by the web text line and the SMS webhook.
export async function handleMessage(sessionId: string, text: string, opts: { lang?: Lang; source: 'live' | 'sms' }): Promise<HandleResult> {
  const now = new Date();
  const prev = getSession(sessionId);
  let out = converse(prev, text, { now, places, resources, forcedLang: opts.lang });
  let usedAi = false;

  // Rules couldn't find a place: let the model pull one out of the message, then resolve it with the same rules.
  if (!out.place && !out.results.length && text.trim().split(/\s+/).length >= 3 && aiEnabled()) {
    const phrase = await aiExtractLocation(text);
    if (phrase) {
      const filters = [/\b(free|gratis)\b/i.test(text) ? 'free' : '', /\b(open|abiert)/i.test(text) ? 'open' : ''].join(' ');
      const retry = converse(prev, `${phrase} ${filters}`.trim(), { now, places, resources, forcedLang: opts.lang ?? out.lang });
      if (retry.place) { out = retry; usedAi = true; }
    }
  }

  let reply = out.reply;
  if (out.results.length && aiEnabled()) {
    const better = await aiRephrase(reply, out.results, out.lang, resources);
    if (better) { reply = better; usedAi = true; }
  }

  saveSession(sessionId, out.state);
  const logged = out.logEntry ? addRequest({ ...out.logEntry, source: opts.source }) : null;
  return {
    reply,
    lang: out.lang,
    place: out.place ? { label: out.place.label, lat: out.place.lat, lng: out.place.lng, kind: out.place.kind } : null,
    results: out.results.map((r) => ({
      id: r.resource.id, name: r.resource.name, type: r.resource.type, lat: r.resource.lat, lng: r.resource.lng,
      distanceMi: Math.round(r.distanceMi * 10) / 10, open: r.status.state,
    })),
    logged,
    ai: usedAi,
  };
}
