import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('response', (r) => { if (r.request().resourceType() === 'script' || r.status() >= 400) console.log(r.status(), r.url().slice(0, 140)); });
await p.goto('http://localhost:3000/map'); await p.waitForTimeout(5000);
console.log(await p.evaluate(() => ({ scripts: document.scripts.length, ready: document.readyState, next: typeof window.next, err: document.querySelector('nextjs-portal') ? 'overlay' : 'none' })));
await b.close();
