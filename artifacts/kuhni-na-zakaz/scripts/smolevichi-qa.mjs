import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3007';
const out = path.resolve(process.argv[3] || '../../outputs/smolevichi-20261012/local');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = { base, responsive: [], galleries: [], form: null, errors: [] };
try {
  const page = await browser.newPage();
  page.on('pageerror', error => result.errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${base}/locations/smolevichi`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText(), 'Кухни на заказ в Смолевичах');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://kuhni.minsk.by/locations/smolevichi');
    assert.equal(await page.locator('[data-smolevichi-price-card]').count(), 3);
    for (const img of await page.locator('#smolevichi-page img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); }));
      assert.ok(await img.evaluate(image => image.naturalWidth > 0), await img.getAttribute('src'));
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `Overflow at ${width}`);
    for (const anchor of await page.locator('#smolevichi-page a[href^="#"]').all()) {
      const href = await anchor.getAttribute('href');
      assert.equal(await page.locator(href).count(), 1, `Broken anchor ${href}`);
    }
    const schema = await page.locator('#smolevichi-page script[type="application/ld+json"]').allTextContents();
    const items = schema.flatMap(text => JSON.parse(text));
    assert.ok(items.some(item => item['@type'] === 'BreadcrumbList'));
    assert.ok(items.some(item => item['@type'] === 'FAQPage' && item.mainEntity.length === 8));
    assert.ok(!JSON.stringify(items).includes('Offer'));
    await page.locator('#smolevichi-page').screenshot({ path: `${out}/page-${width}.png` });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/hero-${width}.png` });
    result.responsive.push({ width, status: response.status(), overflow, images: await page.locator('#smolevichi-page img').count() });
  }
  await page.setViewportSize({ width: 390, height: 900 });
  for (const card of await page.locator('[data-smolevichi-price-card]').all()) {
    const sources = [];
    for (const label of ['Общий вид', 'Другой ракурс', 'Рабочая зона', 'Хранение']) {
      await card.getByRole('button', { name: label, exact: true }).click();
      const img = card.locator('img');
      await img.evaluate(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); }));
      assert.ok(await img.evaluate(image => image.naturalWidth > 0));
      sources.push(await img.getAttribute('src'));
    }
    assert.equal(new Set(sources).size, 4);
    await card.getByRole('button', { name: 'Общий вид', exact: true }).click();
    result.galleries.push({ name: await card.locator('h3').innerText(), sources });
  }
  await page.locator('#smolevichi-prices').screenshot({ path: `${out}/price-galleries-390.png` });
  for (const label of ['Угловая', 'Прямая', 'Компактная', 'Для дома']) {
    await page.getByRole('group', { name: 'Выберите планировку кухни', exact: true }).getByRole('button', { name: label, exact: true }).click();
    const img = page.locator('[data-smolevichi-hero]');
    await img.evaluate(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); }));
    assert.ok(await img.evaluate(image => image.naturalWidth > 0));
  }
  await page.locator('[data-location-visual-explorer]').getByRole('tab', { name: 'Дом', exact: true }).click();
  await page.getByRole('group', { name: 'Приоритет комплектации', exact: true }).getByRole('button', { name: 'Сохранить бюджет', exact: true }).click();
  await page.locator('[data-smolevichi-price-card]').last().getByRole('link', { name: 'Рассчитать похожую кухню', exact: true }).click();
  await page.locator('#form').getByRole('button', { name: 'Частный дом', exact: true }).click();
  await page.getByLabel('Населённый пункт района, если кухня за городом', { exact: true }).fill('Тестовый населённый пункт');
  const form = page.getByTestId('contact-form');
  await form.getByLabel('Имя', { exact: false }).fill('Тест проверки');
  await form.getByLabel('Телефон', { exact: false }).fill('+375291234567');
  await form.getByLabel('Примерные размеры', { exact: true }).fill('3200 × 2100 мм');
  await form.getByLabel('Комментарий', { exact: true }).fill('Тест: сохранить мои размеры и комментарий');
  await form.getByRole('checkbox').check();
  let payload;
  await page.route('**/kapi/leads', async route => { payload = route.request().postDataJSON(); await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
  await form.getByRole('button', { name: 'Получить расчёт', exact: true }).click();
  await page.getByTestId('form-success').waitFor();
  assert.equal(payload.sourcePage, '/locations/smolevichi');
  assert.equal(payload.cityKey, 'smolevichi');
  assert.equal(payload.city, 'Смолевичи');
  assert.equal(payload.dimensions, '3200 × 2100 мм');
  assert.equal(payload.comment, 'Тест: сохранить мои размеры и комментарий');
  assert.equal(payload.answers.smolevichiKitchenSelection.modelId, 'modern-corner-3x2');
  assert.equal(payload.answers.smolevichiKitchenSelection.layout, 'Угловая');
  assert.equal(payload.answers.smolevichiKitchenSelection.objectType, 'Частный дом');
  assert.equal(payload.answers.smolevichiKitchenSelection.budget, 'Сохранить бюджет');
  assert.equal(payload.answers.smolevichiKitchenSelection.settlement, 'Тестовый населённый пункт');
  result.form = { intercepted: true, sourcePage: payload.sourcePage, cityKey: payload.cityKey, selection: payload.answers.smolevichiKitchenSelection, preservesEditedFields: true };
  const sitemapResponse = await page.request.get(`${base}/sitemap.xml`);
  assert.equal(sitemapResponse.status(), 200);
  const sitemap = await sitemapResponse.text();
  assert.ok(sitemap.includes('<loc>https://kuhni.minsk.by/locations/smolevichi</loc>'));
  const block = sitemap.match(/<url>\s*<loc>https:\/\/kuhni\.minsk\.by\/locations\/smolevichi<\/loc>[\s\S]*?<\/url>/)?.[0];
  assert.ok(block?.includes('2026-10-12'));
  assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
  await fs.writeFile(`${out}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
