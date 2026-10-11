import { connection } from 'next/server';
import { subscribe, type BusEvent } from '@/lib/server/store';

export const runtime = 'nodejs';

// Server-Sent Events: every logged request is pushed to open maps within milliseconds.
export async function GET(req: Request) {
  await connection();
  const enc = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try { controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)); } catch { cleanup(); }
      };
      send('hello', { at: Date.now() });
      const off = subscribe((e: BusEvent) => send(e.type, e));
      const ping = setInterval(() => {
        try { controller.enqueue(enc.encode(`: keepalive\n\n`)); } catch { cleanup(); }
      }, 15000);
      cleanup = () => { off(); clearInterval(ping); try { controller.close(); } catch {} };
      req.signal.addEventListener('abort', cleanup);
    },
    cancel() { cleanup(); },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
