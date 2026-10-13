import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3113';
const output = process.env.QA_OUTPUT || '../../outputs/budget-kitchen-20261013/local';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    assert.equal((await page.goto(base + '/scenarios/byudzhetnaya-kuhnya', { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://kuhni.minsk.by/scenarios/byudzhetnaya-kuhnya');
    assert.equal(await page.locator('#budget-parts article img').count(), 6);
    const covers = await page.locator('#budget-savings [data-budget-gallery] > img').evaluateAll(nodes => nodes.map(img => img.getAttribute('src')));
    assert.equal(covers.length, 8);
    assert.equal(new Set(covers).size, 8);
    const galleries = await page.locator('[data-budget-gallery]').all();
    assert.equal(galleries.length, 14);
    for (const gallery of galleries) {
      const buttons = gallery.getByRole('button');
      const first = await gallery.locator(':scope > img').getAttribute('src');
      await buttons.nth(1).click();
      await expect(gallery.locator(':scope > img')).not.toHaveAttribute('src', first);
      await gallery.locator(':scope > img').evaluate(img => img.decode());
      assert.notEqual(await gallery.locator(':scope > img').getAttribute('src'), first);
      await buttons.nth(0).click();
      await expect(gallery.locator(':scope > img')).toHaveAttribute('src', first);
    }
    for (const img of await page.locator('main img').all()) {
      if (await img.isVisible()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(img => img.decode()); }
      else assert.equal((await page.request.get(base + await img.getAttribute('src'))).status(), 200);
      assert.ok((await img.getAttribute('src')).endsWith('.webp'));
    }
    assert.ok(await page.locator('main img:not([alt=""])').evaluateAll(images => images.every(img => /[А-Яа-яЁё]/.test(img.alt) && img.naturalWidth > 0)));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('#budget-section-select').selectOption('budget-parts');
    await page.waitForFunction(() => document.getElementById('budget-parts').getBoundingClientRect().top > 0 && document.getElementById('budget-parts').getBoundingClientRect().top < innerHeight);
    if ([390, 1440].includes(width)) {
      for (const id of ['budget-parts', 'budget-savings', 'budget-comparison', 'budget-country']) await page.locator('#' + id).screenshot({ path: `${output}/${id}-${width}.png` });
    }
    await page.getByRole('navigation', { name: 'Быстрый переход по разделам' }).getByRole('link', { name: '↑ К выбору', exact: true }).click();
    await page.waitForFunction(() => document.getElementById('budget-topics').getBoundingClientRect().top > 0 && document.getElementById('budget-topics').getBoundingClientRect().top < innerHeight);
    assert.deepEqual(errors, []);
    result.push({ width, galleries: galleries.length, illustratedParts: 6, distinctSavings: 8, errors, overflow: false });
    await page.close();
  }
  console.log(JSON.stringify(result));
  await fs.writeFile(`${output}/qa.json`, JSON.stringify(result, null, 2));
} finally { await browser.close(); }
