import { NextResponse, connection } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';

export const runtime = 'nodejs';

// Where phones should go: the public tunnel URL (written by `npm run demo:tunnel`) or this laptop's Wi-Fi address.
const VIRTUAL = /vethernet|vmware|virtualbox|hyper-v|wsl|docker|loopback|bluetooth/i;

export async function GET() {
  await connection();
  const file = path.join(/*turbopackIgnore: true*/ process.cwd(), '.data', 'public-url');
  const publicUrl = existsSync(file) ? readFileSync(file, 'utf8').trim() || null : null;
  const lan = Object.entries(networkInterfaces())
    .filter(([name]) => !VIRTUAL.test(name))
    .flatMap(([name, list]) => (list ?? []).filter((i) => i.family === 'IPv4' && !i.internal).map((i) => ({ name, ip: i.address })))
    .sort((a, b) => Number(/wi-?fi|wlan|wireless/i.test(b.name)) - Number(/wi-?fi|wlan|wireless/i.test(a.name)));
  return NextResponse.json({ publicUrl, lanUrl: lan[0] ? `http://${lan[0].ip}:3000` : null }, { headers: { 'Cache-Control': 'no-store' } });
}
