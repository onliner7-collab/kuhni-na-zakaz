import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3007';
const output = path.resolve(process.argv[3] || '../../outputs/smolevichi-planning-v2-20261012/local');
const before = JSON.parse(await fs.readFile(new URL('../../../outputs/smolevichi-hero-v2-20261012/unchanged-images-before.json', import.meta.url), 'utf8')).slice(4);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    const requested = [];
    const listener = request => requested.push(request.url());
    page.on('request', listener);
    assert.equal((await page.goto(base + '/locations/smolevichi', { waitUntil: 'networkidle' })).status(), 200);
    const section = page.locator('#smolevichi-layouts');
    await section.scrollIntoViewIfNeeded();
    const details = section.locator('details');
    await expect(details).not.toHaveAttribute('open', '');
    assert.equal(await details.locator('img').count(), 0, 'No photos mounted before expansion');
    assert.equal(requested.some(url => /planning-v2-20261012\/(ceiling|appliances)/.test(url)), false);
    await expect(section.locator('[data-planning-card]')).toHaveCount(4);
    for (const card of await section.locator('[data-planning-card]').all()) {
      const image = card.locator('img');
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      assert.ok(await image.evaluate(el => el.naturalWidth > 0));
      assert.ok((await image.getAttribute('src')).includes('smolevichi-planning-v2-20261012/'));
      assert.equal(await card.locator('li').count(), 2);
      assert.ok(/[А-Яа-я]/.test(await image.getAttribute('alt')));
    }
    const summary = details.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('img')).toHaveCount(2);
    for (const image of await details.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      assert.ok(await image.evaluate(el => el.naturalWidth > 0));
    }
    await details.screenshot({ path: output + '/details-open-' + width + '.png' });
    await summary.click();
    await expect(details).not.toHaveAttribute('open', '');
    await expect(details.locator('img')).toHaveCount(0);
    const rest = await page.locator('#smolevichi-page img:not([data-smolevichi-hero]):not(#smolevichi-layouts img)').evaluateAll(images => images.map(image => ({ src: image.getAttribute('src'), alt: image.alt })));
    assert.deepEqual(rest, before, 'Price and preparation images remain unchanged');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://kuhni.minsk.by/locations/smolevichi');
    for (const [label,id] of [['Угловая','corner'],['Прямая','straight'],['Компактная','small'],['Для дома','house']]) {
      await page.getByRole('group', { name: 'Выберите планировку кухни', exact: true }).getByRole('button', { name: label, exact: true }).click();
      const hero = page.locator('[data-smolevichi-hero]');
      await expect(hero).toHaveAttribute('src', '/uploads/locations/smolevichi-hero-v2-20261012/' + id + '.webp');
      await expect(hero).toHaveJSProperty('complete', true);
      assert.ok(await hero.evaluate(el => el.naturalWidth > 0));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await section.screenshot({ path: output + '/planning-' + width + '.png' });
    page.off('request', listener);
    results.push({ width, cards: 4, expandedPhotos: 2, keyboardToggle: true, noImagesBeforeOpen: true, heroStates: 4, otherImagesUnchanged: rest.length });
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(output + '/results.json', JSON.stringify({ base, results, errors }, null, 2));
  console.log(JSON.stringify({ base, viewports: results.length, results, errors }));
} finally { await browser.close(); }
