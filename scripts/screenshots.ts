/**
 * Full-page screenshots for visual review.
 * Usage: npm run preview (in another terminal), then
 *   node scripts/screenshots.ts <outDir> [path ...]
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [outDir = 'screenshots', ...paths] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:4321';
const routes = paths.length ? paths : ['/'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', (msg) => msg.type() === 'error' && console.log(`[${vp.name}] console:`, msg.text()));
  page.on('pageerror', (err) => console.log(`[${vp.name}] pageerror:`, err.message));
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    if (process.env.KEEP_BANNER !== '1') {
      const reject = page.locator('[data-consent-banner] [data-consent="reject"]');
      if (await reject.isVisible()) await reject.click();
    }
    await page.mouse.move(200, 200); // the 3D card loads on first interaction
    await page.waitForTimeout(Number(process.env.WAIT ?? 2500));
    // Scroll through the page so reveal-on-scroll content is shown, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(900);
    const fileBase = (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '--')) + `-${vp.name}`;
    // Capture in chunks: very tall full-page captures wrap around in Chromium (~8192 px).
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const chunk = vp.width > 1000 ? 1800 : 2400;
    for (let y = 0, i = 0; y < height; y += chunk, i++) {
      const clip = { x: 0, y, width: vp.width, height: Math.min(chunk, height - y) };
      await page.screenshot({ path: join(outDir, `${fileBase}-part${i}.png`), fullPage: true, clip });
    }
    console.log("saved", fileBase, Math.ceil(height / chunk), 'parts');
  }
  await context.close();
}
await browser.close();
