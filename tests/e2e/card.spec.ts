import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Skip the banner in these tests.
  await context.addCookies([
    {
      name: 'tcan_consent',
      value: encodeURIComponent(JSON.stringify({ v: 1, ts: new Date().toISOString(), choices: { analytics: false } })),
      url: 'http://localhost:4322',
    },
  ]);
});

test('controls flip the card and switch the founder', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('[data-card-stage]');
  const status = stage.locator('[data-card-status]');

  await stage.getByRole('radio', { name: 'Verso' }).check();
  await expect(stage.locator('input[value="back"]')).toBeChecked();
  await expect(status).toHaveText(/verso do cartão de Ricardo Watanabe/);

  await stage.getByRole('radio', { name: 'Trícia' }).check();
  await expect(status).toHaveText(/Trícia Cristilli/);
  await expect(stage.locator('.person-tricia')).toBeVisible();
  await expect(stage.locator('.person-ricardo')).toBeHidden();
  await expect(stage.locator('.person-tricia a[href^="https://wa.me/5511996000721"]')).toBeVisible();

  await stage.getByRole('radio', { name: 'Frente' }).check();
  await expect(status).toHaveText(/frente do cartão/);
});

test('choosing a founder while the front shows turns the card', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('[data-card-stage]');
  await stage.getByRole('radio', { name: 'Trícia' }).check();
  await expect(stage.locator('input[value="back"]')).toBeChecked();
});

test('keyboard operates the card controls', async ({ page }) => {
  await page.goto('/');
  const front = page.locator('[data-card-stage] input[value="front"]');
  await front.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-card-stage] input[value="back"]')).toBeChecked();
});

test('card faces are served as SVG', async ({ request }) => {
  for (const face of ['frente', 'verso-tricia', 'verso-ricardo', 'frente-uv']) {
    const res = await request.get(`/cartao/${face}.svg`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/svg');
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('CSS card still flips with the radios', async ({ page }) => {
    await page.goto('/');
    const inner = page.locator('.css-card-inner');
    const before = await inner.evaluate((el) => getComputedStyle(el).transform);
    await page.locator('[data-card-stage]').getByRole('radio', { name: 'Verso' }).check();
    await expect.poll(() => inner.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
  });
});
