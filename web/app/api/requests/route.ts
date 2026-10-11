import { NextResponse, connection } from 'next/server';
import { listRequests } from '@/lib/server/store';

export const runtime = 'nodejs';

// Polling fallback + initial load for the map. ?since=<ISO> returns only newer requests.
export async function GET(req: Request) {
  await connection();
  const since = new URL(req.url).searchParams.get('since');
  const all = listRequests();
  const requests = since ? all.filter((r) => r.ts > since) : all;
  return NextResponse.json({ requests, total: all.length, now: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
