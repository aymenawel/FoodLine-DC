import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:3000/map'); await p.waitForTimeout(3500);
await p.keyboard.press('2'); await p.waitForTimeout(4500);
await p.mouse.click(1096, 670); await p.waitForTimeout(700); // grocery dot, 6 px off
console.log('grocery:', await p.locator('.maplibregl-popup-content').allInnerTexts());
await p.screenshot({ path: '../shots/ui-popup-grocery.png' });
await p.mouse.click(1130, 681); await p.waitForTimeout(700); // free-food ring, 8 px off
console.log('pantry:', await p.locator('.maplibregl-popup-content').allInnerTexts());
await p.mouse.move(1090, 664); await p.mouse.wheel(0, -900); await p.waitForTimeout(3500);
await p.screenshot({ path: '../shots/ui-streets.png' });
await b.close();
