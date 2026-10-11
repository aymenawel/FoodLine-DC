// Screenshots at projector and phone sizes using the installed Microsoft Edge (no browser download).
// Usage: node scripts/shoot.mjs <name> <path> [width] [height] [keys...]
import { chromium } from 'playwright-core';
const [name, path = '/', w = '1920', h = '1080', ...keys] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
if (process.env.THEME) await page.addInitScript((t) => localStorage.setItem('foodline-theme', t), process.env.THEME);
await page.goto(`http://localhost:3000/${path.replace(/^\/+/, '')}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
for (const k of keys) {
  if (k.startsWith('type:')) { await page.fill('#msg', k.slice(5)); await page.keyboard.press('Enter'); await page.waitForTimeout(3500); }
  else if (k.startsWith('wait:')) await page.waitForTimeout(+k.slice(5));
  else { await page.keyboard.press(k); await page.waitForTimeout(2800); }
}
await page.screenshot({ path: `../shots/${name}.png` });
if (errors.length) console.log('ERRORS:', errors.slice(0, 5).join('\n'));
console.log('saved', name);
await browser.close();
