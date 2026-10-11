import { NextResponse } from 'next/server';
import { handleMessage } from '@/lib/server/handle';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { sessionId?: string; text?: string; lang?: 'en' | 'es' } | null;
  const text = body?.text?.toString().slice(0, 500).trim();
  const sessionId = body?.sessionId?.toString().slice(0, 64);
  if (!text || !sessionId) return NextResponse.json({ error: 'sessionId and text are required' }, { status: 400 });
  const lang = body?.lang === 'es' || body?.lang === 'en' ? body.lang : undefined;
  return NextResponse.json(await handleMessage(sessionId, text, { lang, source: 'live' }));
}
