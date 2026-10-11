import { NextResponse } from 'next/server';
import { addSample, reset } from '@/lib/server/store';
import { generateSample } from '@/lib/server/sample';

export const runtime = 'nodejs';

// Demo controls: seed labelled sample data, clear it, or clear live requests between judges.
export async function POST(req: Request) {
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  switch (action) {
    case 'seed': { const s = generateSample(new Date()); addSample(s); return NextResponse.json({ ok: true, seeded: s.length }); }
    case 'unseed': addSample([]); return NextResponse.json({ ok: true });
    case 'reset': reset('live'); return NextResponse.json({ ok: true });
    case 'reset-all': reset('all'); return NextResponse.json({ ok: true });
    default: return NextResponse.json({ error: 'action must be seed | unseed | reset | reset-all' }, { status: 400 });
  }
}
