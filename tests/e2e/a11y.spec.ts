import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from './routes.ts';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Scan the final visual state: reveal-on-scroll fades would otherwise be measured mid-transition.
test.use({ reducedMotion: 'reduce' });

for (const route of routes) {
  test(`WCAG 2.2 AA: ${route}`, async ({ page }) => {
    await page.goto(route);
    // With the consent banner visible…
    let results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations, JSON.stringify(results.violations.map((v) => [v.id, v.nodes.map((n) => n.target)]), null, 1)).toEqual([]);
    // …and after dismissing it.
    await page.locator('[data-consent-banner] [data-consent="reject"]').click();
    results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations, JSON.stringify(results.violations.map((v) => [v.id, v.nodes.map((n) => n.target)]), null, 1)).toEqual([]);
  });
}

test('consent dialog is accessible', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-consent-banner] [data-consent-open]').click();
  await expect(page.locator('[data-consent-dialog]')).toBeVisible();
  const results = await new AxeBuilder({ page }).include('[data-consent-dialog]').withTags(tags).analyze();
  expect(results.violations).toEqual([]);
});

test('reduced motion keeps the CSS card (no WebGL)', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForTimeout(2500);
  await expect(page.locator('[data-card-stage]')).not.toHaveClass(/is-3d/);
  await expect(page.locator('[data-gl] canvas')).toHaveCount(0);
  await context.close();
});
