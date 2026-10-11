import { NextResponse } from 'next/server';
import { reset, setSample } from '@/lib/server/store';
import { clearSessions } from '@/lib/server/sessions';

export const runtime = 'nodejs';

// Demo controls: seed labelled sample data, clear it, or clear live requests between judges.
export async function POST(req: Request) {
  // Only the presenter's laptop may change the demo: anything arriving through the public tunnel is refused.
  if (req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')) {
    return NextResponse.json({ error: 'Demo controls are only available on the presenting laptop.' }, { status: 403 });
  }
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  switch (action) {
    case 'seed': setSample(true); return NextResponse.json({ ok: true });
    case 'unseed': setSample(false); return NextResponse.json({ ok: true });
    case 'reset': reset('live'); clearSessions(); return NextResponse.json({ ok: true });
    case 'reset-all': reset('all'); clearSessions(); return NextResponse.json({ ok: true });
    default: return NextResponse.json({ error: 'action must be seed | unseed | reset | reset-all' }, { status: 400 });
  }
}
