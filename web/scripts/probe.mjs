import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', (m) => console.log('[console]', m.type(), m.text().slice(0, 300)));
p.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 500)));
p.on('requestfailed', (r) => console.log('[failed]', r.url(), r.failure()?.errorText));
await p.goto('http://localhost:3000/' + (process.argv[2] ?? 'map')); await p.waitForTimeout(6000);
console.log(await p.evaluate(() => ({ h1: getComputedStyle(document.querySelector('h1')).opacity, canvas: !!document.querySelector('canvas') })));
await b.close();
