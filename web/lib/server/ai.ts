import Anthropic from '@anthropic-ai/sdk';
import type { Lang, Ranked, Resource } from '@/lib/engine/types';

// Optional AI layer. The demo works without it. Claude only:
//  (1) pulls a location phrase out of a messy message, which the deterministic resolver then looks up;
//  (2) rewrites a reply that was built from lookup results, in a warmer voice.
// It never adds places: rewrites that drop a listed place, mention an unlisted one, or change links are rejected.

const MODEL = 'claude-haiku-5-5';
const TIMEOUT_MS = 2500;

let client: Anthropic | null | undefined;
function getClient(): Anthropic | null {
  if (client === undefined) {
    client = process.env.ANTHROPIC_API_KEY && process.env.FOODLINE_AI !== 'off'
      ? new Anthropic({ maxRetries: 0, timeout: TIMEOUT_MS })
      : null;
  }
  return client;
}
export const aiEnabled = () => getClient() !== null;

async function ask(system: string, user: string, maxTokens: number): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const res = await c.messages.create(
      {
        model: MODEL,
        max_tokens: maxTokens,
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        system,
        messages: [{ role: 'user', content: user }],
      },
      { timeout: TIMEOUT_MS, maxRetries: 0 },
    );
    if (res.stop_reason !== 'end_turn') return null;
    const text = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('').trim();
    return text || null;
  } catch {
    return null; // timeout, network, auth: fall back to templates
  }
}

export async function aiExtractLocation(message: string): Promise<string | null> {
  const out = await ask(
    'You read text messages sent to a food-finder service in Washington, DC. Extract only the location the sender gave: a ZIP code, a neighborhood name, or two cross streets written as "<street> and <street>". Reply with that location text and nothing else. If there is no location, reply NONE.',
    message.slice(0, 400),
    60,
  );
  if (!out || /^none$/i.test(out) || out.length > 80) return null;
  return out.replace(/^["']|["']$/g, '');
}

export async function aiRephrase(reply: string, results: Ranked[], lang: Lang, all: Resource[]): Promise<string | null> {
  if (!results.length) return null;
  const out = await ask(
    `You polish text-message replies for a free food-finder line in Washington, DC. Rewrite the reply to sound warm, short and respectful, in ${lang === 'es' ? 'Spanish' : 'English'}, for someone on a basic phone. Keep every place name, address, distance, hours and link exactly as given and in the same order. Do not add any place, fact, phone number or advice that is not in the reply. Plain text only, no markdown.`,
    reply,
    700,
  );
  if (!out || out.length > reply.length * 1.4) return null;
  const listed = new Set(results.map((r) => r.resource.id));
  if (!results.every((r) => out.includes(r.resource.name))) return null;
  if (all.some((r) => !listed.has(r.id) && out.includes(r.name))) return null;
  const links = reply.match(/https?:\/\/\S+/g) ?? [];
  if (!links.every((l) => out.includes(l))) return null;
  return out;
}
