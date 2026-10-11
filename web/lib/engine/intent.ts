import { norm } from './normalize';
import type { Lang } from './types';

const ES = /\b(hola|necesito|necesitamos|comida|comer|donde|cerca|gratis|gratuita?|abiert[oa]s?|ayuda|mas|alimentos|tienda|mercado|buenas|gracias|quiero|hay|favor|direcciones|llego|espanol|despensa|hoy|ahora|mi|codigo|barrio|calle|esquina)\b/g;
const EN = /\b(food|need|near|free|open|help|where|store|grocery|hi|hello|thanks|please|more|directions|market|pantry|english|today|now|my|zip|street|corner|eat|hungry|close)\b/g;

// Returns the language a message is clearly written in, or null if it gives no signal (e.g. just a ZIP).
export function detectLang(text: string): Lang | null {
  if (/[¿¡ñ]/i.test(text)) return 'es';
  const t = norm(text);
  const es = t.match(ES)?.length ?? 0;
  const en = t.match(EN)?.length ?? 0;
  if (es > en) return 'es';
  if (en > 0) return 'en';
  return null;
}

export type Command =
  | { kind: 'more' }
  | { kind: 'directions'; n: number }
  | { kind: 'help' }
  | { kind: 'lang'; lang: Lang }
  | { kind: 'all' };

export function parseCommand(text: string): Command | null {
  const t = norm(text);
  if (/^(espanol|spanish|en espanol)$/.test(t)) return { kind: 'lang', lang: 'es' };
  if (/^(english|ingles|en ingles)$/.test(t)) return { kind: 'lang', lang: 'en' };
  if (/^(more|more please|mas|next|siguiente|otros|otras|mas lugares|more places)$/.test(t)) return { kind: 'more' };
  if (/^(help|ayuda|menu|info|\?|start)$/.test(t) || text.trim() === '?') return { kind: 'help' };
  if (/^(all|todo|todos|reset|start over|clear|show all|ver todo)$/.test(t)) return { kind: 'all' };
  const d = t.match(/^(?:directions?|direcciones|direccion|how do i get there|como llego|map|mapa)(?:\s+(?:to|a|al|for|para|#)?\s*(\d))?$/);
  if (d) return { kind: 'directions', n: d[1] ? Number(d[1]) : 1 };
  return null;
}

export const wantsFree = (text: string) => /\b(free|gratis|gratuit[oa]s?|no cost|sin costo)\b/.test(norm(text));
export const wantsOpen = (text: string) => /\b(open|opened|abiert[oa]s?)\b/.test(norm(text));
