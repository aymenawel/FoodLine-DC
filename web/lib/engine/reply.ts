import { localParts } from './hours';
import type { Lang, OpenStatus, Place, Ranked, Resource, ResourceType } from './types';

const TYPE: Record<Lang, Record<ResourceType, string>> = {
  en: {
    grocery: 'Grocery store', farmers_market: 'Farmers market', mobile_market: 'Mobile market',
    corner_store: 'Corner store with fresh produce', pantry: 'Food pantry', free_market: 'Free market',
    community_fridge: 'Community fridge', meal_site: 'Free meals', produce_plus_site: 'Produce Plus site',
  },
  es: {
    grocery: 'Supermercado', farmers_market: 'Mercado de agricultores', mobile_market: 'Mercado móvil',
    corner_store: 'Tienda con frutas y verduras', pantry: 'Despensa de alimentos', free_market: 'Mercado gratis',
    community_fridge: 'Refrigerador comunitario', meal_site: 'Comidas gratis', produce_plus_site: 'Sitio de Produce Plus',
  },
};
const DAY: Record<Lang, Record<string, string>> = {
  en: { sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' },
  es: { sun: 'dom', mon: 'lun', tue: 'mar', wed: 'mié', thu: 'jue', fri: 'vie', sat: 'sáb' },
};

export function clock(hhmm: string, lang: Lang): string {
  if (hhmm === '24:00') return lang === 'es' ? 'medianoche' : 'midnight';
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
}

const short = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
export const street = (r: Resource) => r.address.split(',')[0];

export function statusLine(r: Resource, s: OpenStatus, lang: Lang, now: Date): string {
  const es = lang === 'es';
  switch (s.state) {
    case 'open': return es ? `Abierto ahora, hasta las ${clock(s.closesAt!, lang)}` : `Open now, until ${clock(s.closesAt!, lang)}`;
    case 'closed': {
      if (!s.opensAt) return es ? 'Cerrado' : 'Closed';
      const today = s.inDays === 0;
      if (today) return es ? `Abre hoy a las ${clock(s.opensAt, lang)}` : `Opens today at ${clock(s.opensAt, lang)}`;
      return es ? `Cerrado ahora · abre ${DAY.es[s.opensDay!]} ${clock(s.opensAt, lang)}` : `Closed now · opens ${DAY.en[s.opensDay!]} ${clock(s.opensAt, lang)}`;
    }
    case 'out_of_season': return es ? 'Cerrado por temporada' : 'Closed for the season';
    default:
      if (r.schedule_note && !/not published/i.test(r.schedule_note)) return `${es ? 'Horario: ' : ''}${short(r.schedule_note, 70)}`;
      return es ? 'Llame para confirmar el horario' : 'Call ahead for hours';
  }
}

function tags(r: Resource, lang: Lang): string[] {
  const t: string[] = [];
  if (r.free) t.push(lang === 'es' ? 'Gratis' : 'Free');
  if (r.snap === true) t.push('SNAP/EBT');
  return t;
}

export function listReply(o: {
  lang: Lang; place: Place; results: Ranked[]; now: Date; freeOnly: boolean; openNow: boolean; offset: number;
}): string {
  const { lang, place, results, now } = o;
  const es = lang === 'es';
  const what = o.freeOnly && o.openNow ? (es ? 'lugares gratis abiertos ahora' : 'free places open now')
    : o.freeOnly ? (es ? 'lugares gratis' : 'free places')
    : o.openNow ? (es ? 'lugares abiertos ahora' : 'places open now')
    : (es ? 'lugares para conseguir comida' : 'places to get food');
  if (!results.length) {
    if (o.offset > 0) return es ? 'Esos son todos los lugares cercanos en nuestra lista. Responda FREE/GRATIS, OPEN/ABIERTO o un nuevo código postal.' : "That's every nearby place on our list. Reply FREE, OPEN, or a new ZIP code.";
    return es ? `No encontré ${what} cerca de ${place.label} en este momento. Responda TODO para ver todos los lugares.` : `I couldn't find ${what} near ${place.label} right now. Reply ALL to see every place.`;
  }
  const head = o.offset > 0
    ? (es ? `Más ${what} cerca de ${place.label}:` : `More ${what} near ${place.label}:`)
    : (es ? `Aquí hay ${results.length} ${what} cerca de ${place.label}:` : `Here are ${results.length} ${what} near ${place.label}:`);
  const body = results.map((x, i) => {
    const r = x.resource;
    const dist = `${x.distanceMi.toFixed(1)} ${es ? 'millas' : 'mi'}`;
    const extra = [statusLine(r, x.status, lang, now), ...tags(r, lang)].join(' · ');
    return `${i + 1}) ${r.name}\n${TYPE[lang][r.type]} · ${dist}\n${street(r)}\n${extra}`;
  }).join('\n\n');
  const far = results[0].distanceMi > 2.5
    ? (es ? '\n\nFoodLine cubre los Distritos 7 y 8. Estos son los más cercanos de nuestra lista.' : '\n\nFoodLine covers Wards 7 and 8. These are the closest places on our list.')
    : '';
  const foot = es
    ? '\n\nResponda MÁS, GRATIS, ABIERTO o DIRECCIONES 1. Text ENGLISH for English.'
    : '\n\nReply MORE, FREE, OPEN or DIRECTIONS 1. Texto ESPAÑOL para español.';
  return `${head}\n\n${body}${far}${foot}`;
}

export function directionsReply(x: Ranked, lang: Lang, now: Date): string {
  const r = x.resource;
  const es = lang === 'es';
  const walk = Math.max(1, Math.round(x.distanceMi * 20));
  const spans = r.hours?.[localParts(now).dow] ?? null;
  const today = spans === null ? null
    : spans.length ? spans.map(([a, b]) => `${clock(a, lang)}–${clock(b, lang)}`).join(', ')
    : (es ? 'cerrado' : 'closed');
  const lines = [
    r.name,
    r.address,
    es ? `Unos ${walk} min a pie (${x.distanceMi.toFixed(1)} millas)` : `About a ${walk} min walk (${x.distanceMi.toFixed(1)} mi)`,
    today ? `${es ? 'Hoy' : 'Today'}: ${today}` : statusLine(r, x.status, lang, now),
    !r.eligibility || /not published/i.test(r.eligibility) ? (es ? 'Llame para preguntar quién puede ir' : 'Call to ask who can go')
      : r.eligibility === 'Open to all' ? (es ? 'Abierto a todos' : 'Open to all')
      : `${es ? 'Quién puede ir' : 'Who can go'}: ${short(r.eligibility, 140)}`,
    r.phone ? `${es ? 'Teléfono' : 'Call'}: ${r.phone}` : null,
    `${es ? 'Mapa' : 'Map'}: https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export const askLocation = (lang: Lang) => lang === 'es'
  ? '¡Hola! Envíe su código postal, su barrio o una esquina (por ejemplo "Minnesota Ave y Benning Rd") y le mando los 3 lugares más cercanos para conseguir comida.'
  : 'Hi! Text your ZIP code, neighborhood, or a cross street (like "Minnesota Ave and Benning Rd") and I\'ll send the 3 closest places to get food.';

export const notFound = (lang: Lang) => lang === 'es'
  ? 'No reconocí ese lugar. Pruebe con un código postal (20019, 20020, 20032), un barrio (Anacostia, Deanwood) o dos calles que se cruzan.'
  : "I didn't recognize that place. Try a ZIP code (20019, 20020, 20032), a neighborhood (Anacostia, Deanwood) or two cross streets.";

export const helpReply = (lang: Lang) => lang === 'es'
  ? 'FoodLine encuentra comida cerca de usted en los Distritos 7 y 8.\nEnvíe: un código postal, barrio o esquina.\nDespués: MÁS, GRATIS, ABIERTO, DIRECCIONES 1, TODO.\nNo guardamos su número ni su mensaje.'
  : 'FoodLine finds food near you in Wards 7 and 8.\nSend: a ZIP code, neighborhood or cross street.\nThen: MORE, FREE, OPEN, DIRECTIONS 1, ALL.\nWe never store your number or your message.';

export const langSet = (lang: Lang) => lang === 'es'
  ? 'Listo, le responderé en español. Envíe su código postal, barrio o una esquina.'
  : "Got it, I'll reply in English. Send your ZIP code, neighborhood or a cross street.";

export const filterPending = (lang: Lang) => lang === 'es'
  ? 'Entendido. Ahora envíe su código postal, barrio o una esquina.'
  : 'Got it. Now send your ZIP code, neighborhood or a cross street.';

export const noSuchResult = (lang: Lang, n: number) => lang === 'es'
  ? `No tengo un lugar número ${n}. Responda DIRECCIONES 1, 2 o 3.`
  : `I don't have a place number ${n}. Reply DIRECTIONS 1, 2 or 3.`;
