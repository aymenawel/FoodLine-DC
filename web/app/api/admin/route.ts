import { NextResponse } from 'next/server';
import { reset, setSample } from '@/lib/server/store';

export const runtime = 'nodejs';

// Demo controls: seed labelled sample data, clear it, or clear live requests between judges.
export async function POST(req: Request) {
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  switch (action) {
    case 'seed': setSample(true); return NextResponse.json({ ok: true });
    case 'unseed': setSample(false); return NextResponse.json({ ok: true });
    case 'reset': reset('live'); return NextResponse.json({ ok: true });
    case 'reset-all': reset('all'); return NextResponse.json({ ok: true });
    default: return NextResponse.json({ error: 'action must be seed | unseed | reset | reset-all' }, { status: 400 });
  }
}
