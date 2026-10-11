import { NextResponse } from 'next/server';
import { reset, setSample } from '@/lib/server/store';
import { clearSessions } from '@/lib/server/sessions';

export const runtime = 'nodejs';

// Demo controls: seed labelled sample data, clear it, or clear live requests between judges.
export async function POST(req: Request) {
  // Only the presenter's laptop may change the demo: anything arriving through the public tunnel is refused.
  // (Cloudflare adds these headers; Next.js itself sets x-forwarded-for on every request, so that one can't be used.)
  if (req.headers.get('cf-connecting-ip') || req.headers.get('cf-ray')) {
    return NextResponse.json({ error: 'Demo controls are only available on the presenting laptop.' }, { status: 403 });
  }
  // Hosted for judges: set FOODLINE_ADMIN_TOKEN and only the presenter (page opened with ?admin=TOKEN) can seed or clear.
  const token = process.env.FOODLINE_ADMIN_TOKEN;
  if (token && req.headers.get("x-admin-token") !== token) {
    return NextResponse.json({ error: "Demo controls are locked on the hosted site." }, { status: 403 });
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
