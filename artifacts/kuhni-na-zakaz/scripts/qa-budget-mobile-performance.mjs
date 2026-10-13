import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.budgetMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.budgetMetrics.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.budgetMetrics.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto((process.env.QA_BASE_URL || 'http://127.0.0.1:3114') + '/scenarios/byudzhetnaya-kuhnya', { waitUntil: 'networkidle' });
  const initial = await page.evaluate(() => ({ ...window.budgetMetrics, images: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').map(r => ({ url: r.name, bytes: r.transferSize })), overflow: document.documentElement.scrollWidth > innerWidth }));
  assert.equal(initial.overflow, false);
  assert.ok(initial.images.every(r => !/\.png(?:\?|$)/.test(r.url)));
  assert.ok(initial.images.filter(r => r.url.includes('budget-kitchens-20261013')).length < 15, 'Below-fold photos should load lazily');
  await page.locator('#budget-parts').scrollIntoViewIfNeeded();
  const sample = page.locator('#budget-parts img').first();
  await sample.evaluate(img => img.decode());
  const mobileImage = await sample.evaluate(img => ({ source: img.currentSrc, width: img.clientWidth, naturalWidth: img.naturalWidth }));
  assert.match(mobileImage.source, /-(480|800)\.webp$/);
  const result = { conditions: { viewport: '390x844', dpr: 2, cpuSlowdown: 4, bandwidthMbps: 1.6, latencyMs: 150 }, initial, mobileImage };
  console.log(JSON.stringify(result, null, 2));
  if (process.env.QA_OUTPUT) { await fs.mkdir(process.env.QA_OUTPUT, { recursive: true }); await fs.writeFile(process.env.QA_OUTPUT + '/mobile-performance.json', JSON.stringify(result, null, 2)); }
} finally { await browser.close(); }
