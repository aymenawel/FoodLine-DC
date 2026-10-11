'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Points at /chat on whatever address this page was opened from (localhost, LAN IP or a tunnel URL).
// Override with ?url=https://example.trycloudflare.com
export default function QrCard() {
  const [url, setUrl] = useState('');
  const [svg, setSvg] = useState('');
  useEffect(() => {
    const base = new URLSearchParams(window.location.search).get('url') || window.location.origin;
    const target = `${base.replace(/\/$/, '')}/chat`;
    setUrl(target);
    QRCode.toString(target, { type: 'svg', margin: 0, color: { dark: '#0d1411', light: '#eeeadf' }, errorCorrectionLevel: 'M' })
      .then(setSvg).catch(() => setSvg(''));
  }, []);
  return (
    <figure className="grid gap-4 rounded-3xl border border-line bg-panel p-6">
      <div className="aspect-square w-full rounded-2xl bg-ink p-5" aria-label={`QR code for ${url}`} role="img"
        dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption>
        <p className="font-serif text-3xl leading-tight">Text the line</p>
        <p className="mt-1 text-sm text-muted">Scan with your phone camera. It works like a text conversation.</p>
        <p className="mt-2 break-all font-mono text-xs text-faint">{url}</p>
      </figcaption>
    </figure>
  );
}
