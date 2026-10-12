import { test, expect } from '@playwright/test';

test('small kitchen choices, views and responsive layout', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/catalog/malenkie-kuhni');
  await expect(page.locator('h1')).toHaveText('Маленькие кухни на заказ');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://kuhni.minsk.by/catalog/malenkie-kuhni');
  await page.screenshot({ path: '../../artifacts/small-kitchens-20261011/first-screen-1440.png' });
  const explorer = page.getByTestId('small-priority-explorer');
  for (const id of ['worktop', 'storage', 'appliances', 'passage', 'compromise']) {
    const before = await page.locator('#small-priority-result h3').textContent();
    await explorer.locator(`[data-priority="${id}"]`).click();
    await expect(explorer.locator(`[data-priority="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#small-priority-result h3')).not.toHaveText(before!);
    await expect(explorer.locator(`[data-zone-overlay="${id}"]`)).toBeVisible();
    await expect.poll(() => explorer.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  }
  await explorer.getByRole('button', { name: 'Сравнить с общим видом' }).click();
  await expect(page.getByTestId('small-priority-comparison')).toBeVisible();
  await explorer.getByRole('button', { name: 'Убрать подсветку' }).click();
  await expect(explorer.locator('[data-zone-overlay]')).toHaveCount(0);
  await explorer.getByRole('button', { name: 'Один крупный вид' }).click();
  for (const card of await page.locator('[data-idea-id]').all()) {
    for (const button of await card.locator('button[aria-label]').all()) {
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => card.locator('img').first().evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  }
  await explorer.locator('[data-priority="storage"]').press('Enter');
  await explorer.getByRole('button', { name: 'Подсветить зоны' }).click();
  await expect(explorer.locator('[data-priority="storage"]')).toHaveAttribute('aria-pressed', 'true');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `../../artifacts/small-kitchens-20261011/preview-${width}.png` });
  }
  expect(errors).toEqual([]);
});

test('chosen layout and priority reach the intercepted form without losing user input', async ({ page }) => {
  await page.goto('/catalog/malenkie-kuhni');
  await page.locator('[data-priority="storage"]').click();
  await page.locator('[data-idea-id="corner-ceiling"]').getByRole('button', { name: 'Выбрать для расчёта' }).click();
  const form = page.locator('#form');
  await expect(form.getByTestId('form-kitchen-type')).toHaveValue('Угловая');
  await form.getByTestId('form-name').fill('Тест локальной формы');
  await form.getByTestId('form-phone').fill('+375291234567');
  await form.getByTestId('form-city').fill('Жодино');
  await form.getByTestId('form-dimensions').fill('2,4 × 1,8 м');
  await page.locator('[data-idea-id="straight-table"]').getByRole('button', { name: 'Выбрать для расчёта' }).click();
  await expect(form.getByTestId('form-kitchen-type')).toHaveValue('Прямая');
  await expect(form.getByTestId('form-city')).toHaveValue('Жодино');
  await expect(form.getByTestId('form-dimensions')).toHaveValue('2,4 × 1,8 м');
  let payload: Record<string, any> | undefined;
  await page.route('**/kapi/leads', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  await form.getByTestId('form-agreement').check();
  await form.getByTestId('form-submit').click();
  await expect.poll(() => payload?.sourcePage).toBe('/catalog/malenkie-kuhni');
  expect(payload?.kitchenType).toBe('Прямая');
  expect(payload?.city).toBe('Жодино');
  expect(payload?.answers.selectedIdea).toBe('straight-table');
  expect(payload?.answers.priority).toBe('Маленькая кухня: Хранение');
});

test('protected routes still render', async ({ request }) => {
  test.setTimeout(120_000);
  for (const route of ['/', '/design-proekt-kuhni', '/locations/minskaya-oblast', '/locations/minsk', '/materials/furnitura', '/locations/borisov']) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(await response.text(), route).toContain('<h1');
  }
});

test('server content, FAQ and relevant links are available without JavaScript', async ({ request }) => {
  const response = await request.get('/catalog/malenkie-kuhni');
  const html = await response.text();
  const schemas = Array.from(html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g), match => JSON.parse(match[1]));
  const nodes = schemas.flatMap(schema => Array.isArray(schema) ? schema : schema['@graph'] || [schema]);
  const faq = nodes.find(node => node['@type'] === 'FAQPage');
  expect(faq.mainEntity).toHaveLength(7);
  for (const item of faq.mainEntity) {
    expect(html).toContain(item.name);
    expect(item.acceptedAnswer.text.length).toBeGreaterThan(50);
  }
  expect(nodes.some(node => node['@type'] === 'CollectionPage')).toBe(true);
  expect(nodes.some(node => node['@type'] === 'Product')).toBe(false);
  for (const route of ['/prices', '/scenarios/byudzhetnaya-kuhnya', '/scenarios/dlya-malenkoy-kuhni', '/blog/kuhnya-6-kv-m-v-hruschevke', '/catalog/pryamye-kuhni', '/catalog/uglovye-kuhni', '/catalog/kuhni-do-potolka', '/materials/ldsp', '/materials/mdf-fasady', '/design-proekt-kuhni', '/locations']) {
    expect(html).toContain(`href="${route}"`);
    expect((await request.get(route)).status(), route).toBe(200);
  }
});
