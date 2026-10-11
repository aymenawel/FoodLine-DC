import { NextResponse, connection } from 'next/server';
import cells from '@/data/cells.json';
import { topGaps, type Cell } from '@/lib/engine/gap';
import { listRequests } from '@/lib/server/store';

export const runtime = 'nodejs';

export async function GET() {
  await connection();
  const now = new Date();
  const reqs = listRequests();
  const gaps = topGaps(reqs, cells as Cell[], now, { windowHours: 24, n: 3 });
  return NextResponse.json({
    gaps,
    basis: { requests24h: reqs.filter((r) => Date.parse(r.ts) > now.getTime() - 86400_000).length,
      sample: reqs.filter((r) => r.source === 'sample').length },
  }, { headers: { 'Cache-Control': 'no-store' } });
}
