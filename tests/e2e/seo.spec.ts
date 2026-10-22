import { test, expect } from '@playwright/test';
import { routes } from './routes.ts';

for (const route of routes) {
  test(`SEO basics: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('h1')).toHaveCount(1);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(65);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0).toBeGreaterThan(50);
    expect(description?.length ?? 0).toBeLessThanOrEqual(165);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${route.replace(/\//g, '\\/')}$`));
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const res = await page.request.get(new URL(og!).pathname);
    expect(res.status()).toBe(200);
    // Non-production builds must never be indexed.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
}

test('all internal links resolve', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!));
    hrefs.forEach((h) => seen.add(h.split('#')[0].split('?')[0]));
  }
  for (const path of seen) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
});

test('anchors to solutions exist', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href*="/solucoes/"][href*="#"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')!));
  for (const href of new Set(hrefs)) {
    const [path, hash] = href.split('#');
    await page.goto(path);
    await expect(page.locator(`#${hash}`)).toHaveCount(1);
  }
});

test('robots.txt blocks non-production builds and sitemap lists pages', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const route of routes) expect(sitemap).toContain(`${route}<`);
});
