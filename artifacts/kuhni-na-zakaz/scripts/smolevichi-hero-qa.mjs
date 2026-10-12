import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3007';
const output = path.resolve(process.argv[3] || '../../outputs/smolevichi-hero-v2-20261012/local');
const before = JSON.parse(await fs.readFile(new URL('../../../outputs/smolevichi-hero-v2-20261012/unchanged-images-before.json', import.meta.url), 'utf8'));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    assert.equal((await page.goto(`${base}/locations/smolevichi`, { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://kuhni.minsk.by/locations/smolevichi');
    const rest = await page.locator('#smolevichi-page img:not([data-smolevichi-hero])').evaluateAll(images => images.map(image => ({ src: image.getAttribute('src'), alt: image.alt })));
    assert.deepEqual(rest, before, 'Other blocks must retain their images');
    const img = page.locator('[data-smolevichi-hero]');
    assert.ok((await img.getAttribute('src')).endsWith('/smolevichi-hero-v2-20261012/corner.webp'));
    await page.screenshot({ path: `${output}/initial-${width}.png` });
    for (const [label, id] of [['Угловая', 'corner'], ['Прямая', 'straight'], ['Компактная', 'small'], ['Для дома', 'house']]) {
      await page.getByRole('group', { name: 'Выберите планировку кухни', exact: true }).getByRole('button', { name: label, exact: true }).click();
      await img.evaluate(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); }));
      const current = await img.evaluate(image => ({ src: image.currentSrc, width: image.naturalWidth, alt: image.alt }));
      assert.ok(current.width > 0);
      assert.ok(current.src.includes(`smolevichi-hero-v2-20261012/${id}`));
      assert.ok(current.src.endsWith(width < 768 ? '-mobile.webp' : '.webp'));
      assert.ok(!/smolevichi-visual-l2a|smolevichi-20261012\//.test(current.src));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator('section[aria-label="Выбор кухни для Смолевичей"]').screenshot({ path: `${output}/${id}-${width}.png` });
      checks.push({ width, label, ...current });
    }
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await fs.writeFile(`${output}/results.json`, JSON.stringify({ base, checks, otherImagesUnchanged: before.length, errors }, null, 2));
  console.log(JSON.stringify({ base, heroChecks: checks.length, otherImagesUnchanged: before.length, errors }));
} finally { await browser.close(); }
