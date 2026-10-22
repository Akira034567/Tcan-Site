import { test, expect, type Page } from '@playwright/test';

async function capture(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __opened?: string };
    window.open = ((url: string) => {
      w.__opened = url;
      return null;
    }) as typeof window.open;
  });
}

async function fill(page: Page) {
  await page.getByLabel('Nome').fill('Maria Teste');
  await page.getByLabel('E-mail corporativo').fill('maria@empresa.com.br');
  await page.getByLabel('Empresa').fill('Empresa Teste');
  await page.getByLabel('Como podemos ajudar?').fill('Queremos reduzir o consumo de água nas lojas.');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/contato/');
  await page.locator('[data-consent-banner] [data-consent="reject"]').click();
});

test('shows an error summary and marks invalid fields', async ({ page }) => {
  await page.getByRole('button', { name: /Enviar pelo WhatsApp/ }).click();
  const summary = page.locator('[data-error-summary]');
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(summary.locator('li')).toHaveCount(4);
  await expect(page.getByLabel('E-mail corporativo')).toHaveAttribute('aria-invalid', 'true');
  await summary.getByText('Informe o nome da empresa.').click();
  await expect(page.getByLabel('Empresa')).toBeFocused();
});

test('WhatsApp fallback routes by area and carries the message', async ({ page }) => {
  await capture(page);
  await fill(page);
  await page.getByLabel('Área de interesse').selectOption('esg');
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: /Enviar pelo WhatsApp/ }).click();
  const url = await page.evaluate(() => (window as unknown as { __opened?: string }).__opened);
  expect(url).toContain('https://wa.me/5511996195800?text=');
  const text = decodeURIComponent(url!.split('text=')[1]);
  expect(text).toContain('Maria Teste');
  expect(text).toContain('ESG & Inovação Sustentável');
  await expect(page.locator('[data-form-status]')).toContainText('WhatsApp de Ricardo');
});

test('area preset from the URL routes to the right founder', async ({ page }) => {
  await page.goto('/contato/?interesse=marca');
  await capture(page);
  await expect(page.getByLabel('Área de interesse')).toHaveValue('marca');
  await fill(page);
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: /Enviar pelo WhatsApp/ }).click();
  const url = await page.evaluate(() => (window as unknown as { __opened?: string }).__opened);
  expect(url).toContain('https://wa.me/5511996000721');
});

test('honeypot blocks bots', async ({ page }) => {
  await capture(page);
  await fill(page);
  await page.locator('#f-website').fill('spam', { force: true });
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: /Enviar pelo WhatsApp/ }).click();
  expect(await page.evaluate(() => (window as unknown as { __opened?: string }).__opened)).toBeUndefined();
});
