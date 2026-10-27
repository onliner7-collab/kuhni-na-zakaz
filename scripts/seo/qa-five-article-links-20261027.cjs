const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const req = createRequire(path.resolve('artifacts/kuhni-na-zakaz/package.json'));
const { chromium, expect } = req('@playwright/test');
const base = 'https://kuhni.minsk.by';
const output = path.resolve('docs/seo/audit-20261027/five-article-links');
const pairs = [
  ['/catalog/kuhni-bez-ruchek', '/blog/kakie-fasady-luchshe', 'Сравнить материалы фасадов'],
  ['/scenarios/s-ostrovom', '/blog/kuhnya-s-ostrovom', 'Как спланировать остров'],
  ['/scenarios/do-potolka', '/blog/kuhnya-do-potolka-plyusy-minusy-cena', 'Планирование кухни до потолка'],
  ['/scenarios/dlya-semi', '/blog/kakuyu-planirovku-kuhni-vybrat', 'Как выбрать планировку кухни'],
  ['/scenarios/dlya-studii', '/blog/kuhnya-pod-scenarij-semi-studii-doma', 'Как выбрать кухню для студии'],
];
const old = ['kuhnya-bez-ruchek-plyusy-minusy', 'kuhnya-s-ostrovom-planirovka-razmery-cena', 'kuhnya-do-potolka-proektirovanie-cena', 'ergonomika-kuhni-rabochiy-treugolnik', 'kuhnya-gostinaya-planirovka-zonirovanie-cena'].map(s => '/blog/' + s);
const transientResponses = [];
async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'manual' });
    const html = await r.text();
    if (![429, 502, 503, 504].includes(r.status) || attempt === 3) return { status: r.status, html };
    transientResponses.push({ url, status: r.status, attempt });
    await new Promise(resolve => setTimeout(resolve, attempt * 2000));
  }
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const results = { date: '2026-10-27', pages: [], articles: [], browser: [] };
  const browser = await chromium.launch({ headless: true, args: ['--no-proxy-server'] });
  try {
    const page = await browser.newPage();
    const sitemap = await get(base + '/sitemap.xml');
    if (sitemap.status !== 200) throw Error('Sitemap HTTP ' + sitemap.status);
    const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    if (urls.length !== 111) throw Error('Unexpected sitemap count ' + urls.length);
    results.sitemapCount = urls.length;
    const articles = new Set();
    for (let i = 0; i < urls.length; i += 4) {
      const batch = await Promise.all(urls.slice(i, i + 4).map(async url => ({ url, ...await get(url) })));
      for (const row of batch) {
        if (row.status !== 200) throw Error('Page HTTP ' + row.status + ': ' + row.url);
        const links = await page.evaluate(html => {
          const d = new DOMParser().parseFromString(html, 'text/html');
          return [...d.querySelectorAll('a[href]')].map(e => e.getAttribute('href'));
        }, row.html);
        for (const href of links) {
          const u = new URL(href, row.url);
          if (u.origin !== base) continue;
          if (old.includes(u.pathname.replace(/\/$/, ''))) throw Error('Old article link on ' + row.url + ': ' + href);
          if (u.pathname.startsWith('/blog/')) articles.add(u.origin + u.pathname);
        }
        results.pages.push({ url: row.url, status: row.status });
      }
      await new Promise(resolve => setTimeout(resolve, 900));
    }
    for (const url of articles) {
      const r = await get(url);
      if (r.status !== 200) throw Error('Article HTTP ' + r.status + ': ' + url);
      results.articles.push({ url, status: r.status });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    console.log('CRAWL_PASS', results.pages.length, 'pages;', results.articles.length, 'article targets');
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [source, target, label] of pairs) {
        const errors = [];
        const onError = e => errors.push(e.message);
        page.on('pageerror', onError);
        const response = await page.goto(base + source, { waitUntil: 'networkidle' });
        if (response.status() !== 200) throw Error('Source failed: ' + source);
        const link = page.getByRole('link', { name: label });
        await expect(link).toHaveAttribute('href', target);
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        await link.focus();
        await expect(link).toBeFocused();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        if (overflow) throw Error('Source overflow ' + source);
        if (width === 390) await page.screenshot({ path: path.join(output, source.slice(1).replaceAll('/', '-') + '.png') });
        await link.click();
        await expect(page).toHaveURL(base + target);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', base + target);
        const state = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth }));
        if (state.overflow || errors.length) throw Error(JSON.stringify({ source, target, width, errors, state }));
        page.off('pageerror', onError);
        results.browser.push({ source, target, label, width, keyboardFocus: true, ...state, errors });
      }
    }
    results.pass = true;
    results.transientResponses = transientResponses;
    fs.writeFileSync(path.join(output, 'production-qa.json'), JSON.stringify(results, null, 2));
    console.log('FIVE_ARTICLE_LINKS_PRODUCTION_QA_PASS', results.browser.length, 'clicks');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
