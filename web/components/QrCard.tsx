'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Points phones at /chat. Order of preference: ?url=… override, then (when this page is open on
// localhost) the public tunnel URL, then this laptop's Wi-Fi address; otherwise the address in use.
export default function QrCard() {
  const [url, setUrl] = useState('');
  const [svg, setSvg] = useState('');
  const [note, setNote] = useState('');
  useEffect(() => {
    (async () => {
      const override = new URLSearchParams(window.location.search).get('url');
      let base = override || window.location.origin;
      let hint = '';
      if (!override && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) {
        try {
          const info = (await (await fetch('/api/info', { cache: 'no-store' })).json()) as { publicUrl: string | null; lanUrl: string | null };
          if (info.publicUrl) { base = info.publicUrl; hint = 'Public link: works from any phone.'; }
          else if (info.lanUrl) { base = info.lanUrl; hint = 'Phone must be on the same Wi-Fi as this laptop.'; }
        } catch { /* keep origin */ }
      }
      const target = `${base.replace(/\/$/, '')}/chat`;
      setUrl(target); setNote(hint);
      setSvg(await QRCode.toString(target, { type: 'svg', margin: 0, color: { dark: '#0d1411', light: '#eeeadf' }, errorCorrectionLevel: 'M' }).catch(() => ''));
    })();
  }, []);
  return (
    <figure className="grid gap-4 rounded-3xl border border-line bg-panel p-6">
      <div className="aspect-square w-full rounded-2xl bg-ink p-5" aria-label="QR code that opens the FoodLine text line" role="img"
        dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption>
        <h2 className="font-serif text-3xl leading-tight">Text the line</h2>
        <p className="mt-1 text-base text-muted">Scan with your phone camera. It works like a text conversation.</p>
        <p className="mt-2 break-all font-mono text-[15px] text-faint">{url}</p>
        {note && <p className="mt-1 text-[15px] text-faint">{note}</p>}
      </figcaption>
    </figure>
  );
}
