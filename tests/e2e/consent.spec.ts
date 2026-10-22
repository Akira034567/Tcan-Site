import { test, expect, type Page } from '@playwright/test';

const GA_ID = 'G-TEST1234';

/** Records (and stubs) every request to Google; nothing reaches the network. */
async function trackGoogle(page: Page) {
  const hits: string[] = [];
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return hits;
}

const consentCookie = async (page: Page) => (await page.context().cookies()).find((c) => c.name === 'tcan_consent');

test('nothing from Google loads before a choice', async ({ page }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await expect(page.locator('[data-consent-banner]')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
});

test('reject: no analytics, choice remembered', async ({ page }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await page.locator('[data-consent-banner] [data-consent="reject"]').click();
  await expect(page.locator('[data-consent-banner]')).toBeHidden();
  const cookie = await consentCookie(page);
  expect(decodeURIComponent(cookie!.value)).toContain('"analytics":false');
  await page.reload();
  await expect(page.locator('[data-consent-banner]')).toBeHidden();
  await page.waitForTimeout(800);
  expect(hits).toEqual([]);
});

test('accept loads GA4 with the configured ID', async ({ page }) => {
  const hits = await trackGoogle(page);
  await page.goto('/');
  await page.locator('[data-consent-banner] [data-consent="accept"]').click();
  await expect.poll(() => hits.some((u) => u.includes(`gtag/js?id=${GA_ID}`))).toBe(true);
  const config = await page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer.map((a) => Array.from(a as ArrayLike<unknown>)));
  expect(JSON.stringify(config)).toContain('"allow_google_signals":false');
  expect(JSON.stringify(config)).toContain('"ad_storage":"denied"');
});

test('withdrawing consent disables GA and deletes its cookies', async ({ page }) => {
  await trackGoogle(page);
  await page.goto('/');
  await page.locator('[data-consent-banner] [data-consent="accept"]').click();
  await page.evaluate(() => {
    document.cookie = '_ga=GA1.1.123.456; Path=/';
    document.cookie = '_ga_TEST1234=GS1.1.789; Path=/';
  });
  const opener = page.locator('footer [data-consent-open]');
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  const dialog = page.locator('[data-consent-dialog]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#consent-analytics')).toBeChecked();
  await page.locator('label.switch', { has: page.locator('#consent-analytics') }).click();
  await dialog.locator('[data-consent="save"]').click();
  await expect(dialog).toBeHidden();
  const names = (await page.context().cookies()).map((c) => c.name);
  expect(names.filter((n) => n.startsWith('_ga'))).toEqual([]);
  expect(await page.evaluate((id) => (window as unknown as Record<string, boolean>)[`ga-disable-${id}`], GA_ID)).toBe(true);
  await expect(opener).toBeFocused();
});

test('preferences: nothing pre-ticked, Esc closes and returns focus', async ({ page }) => {
  await page.goto('/');
  const customize = page.locator('[data-consent-banner] [data-consent-open]');
  await customize.click();
  await expect(page.locator('#consent-analytics')).not.toBeChecked();
  await expect(page.locator('#consent-necessary')).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-consent-dialog]')).toBeHidden();
  await expect(customize).toBeFocused();
});
