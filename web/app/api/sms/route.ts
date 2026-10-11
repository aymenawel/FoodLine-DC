import { createHash } from 'node:crypto';
import { handleMessage } from '@/lib/server/handle';

export const runtime = 'nodejs';

// Twilio-compatible SMS webhook (POST, form-encoded). Point a Twilio number's "A message comes in" URL here
// to run the same engine over real SMS. The phone number is only hashed in memory to keep the conversation;
// it is never written to disk or logged.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const body = form?.get('Body')?.toString().slice(0, 500) ?? '';
  const from = form?.get('From')?.toString() ?? 'anon';
  const sessionId = 'sms-' + createHash('sha256').update(from).digest('hex').slice(0, 16);
  const out = body.trim()
    ? await handleMessage(sessionId, body, { source: 'sms' })
    : { reply: 'Text your ZIP code, neighborhood or cross street to find food nearby.' };
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${esc(out.reply)}</Message></Response>`, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}
