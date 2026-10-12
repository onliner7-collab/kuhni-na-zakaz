import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3112";
const output = path.resolve("../../outputs/budget-kitchen-20261012");
const routePath = "/scenarios/byudzhetnaya-kuhnya";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = { viewports: [], links: [], form: null };
try {
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1440, 960]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/kapi/leads", route => route.abort());
    const response = await page.goto(base + routePath, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("h1").innerText(), "Недорогие кухни на заказ");
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://kuhni.minsk.by" + routePath);
    assert.ok((await page.title()).startsWith("Недорогие кухни на заказ"));
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    assert.ok(description.includes("Как сделать кухню дешевле"));
    const schemas = JSON.stringify((await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse));
    assert.ok(schemas.includes("BreadcrumbList") && schemas.includes("FAQPage") && schemas.includes("WebPage"));
    assert.ok(!schemas.includes('"@type":"Offer"'));
    assert.equal(await page.locator("#budget-savings article").count(), 8);
    assert.equal(await page.locator("#budget-comparison article").count(), 3);
    assert.equal(await page.locator("#budget-country article").count(), 3);
    const galleries = await page.locator("[data-budget-gallery]").all();
    assert.equal(galleries.length, 14);
    for (const gallery of galleries) {
      const buttons = gallery.getByRole("button");
      assert.equal(await buttons.count(), 2);
      const firstSrc = await gallery.locator(":scope > img").getAttribute("src");
      await buttons.nth(1).click();
      await gallery.locator(":scope > img").evaluate(img => img.decode());
      assert.notEqual(await gallery.locator(":scope > img").getAttribute("src"), firstSrc);
      assert.equal(await buttons.nth(1).getAttribute("aria-pressed"), "true");
      await buttons.nth(0).click();
      await gallery.locator(":scope > img").evaluate(img => img.decode());
    }
    await page.locator("#budget-savings summary").first().click();
    assert.equal(await page.locator("#budget-savings details").first().getAttribute("open"), "");
    for (const img of await page.locator("main img").all()) {
      if (!(await img.isVisible())) {
        const r = await page.request.get(base + await img.getAttribute("src"));
        assert.equal(r.status(), 200);
        continue;
      }
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(image => image.decode());
    }
    const images = await page.locator("main img").evaluateAll(nodes => nodes.map(img => ({ src: img.currentSrc || img.src, naturalWidth: img.naturalWidth, alt: img.alt, visible: getComputedStyle(img).display !== "none" })));
    assert.ok(images.length >= 40, "Image audit must include the actual page images");
    assert.ok(images.filter(img => img.visible).every(img => img.naturalWidth > 0));
    assert.ok(images.filter(img => !img.src.includes("-thumb")).every(img => img.alt && /[А-Яа-яЁё]/.test(img.alt)));
    assert.ok(images.every(img => !/\.png(?:\?|$)/.test(img.src)));
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    assert.equal(dimensions.scroll, dimensions.client, `Overflow at ${width}`);
    const anchors = await page.locator("main a[href^='#']").evaluateAll(nodes => nodes.map(a => a.getAttribute("href")));
    for (const anchor of anchors) assert.equal(await page.locator(anchor).count(), 1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, `hero-${width}.png`) });
    if (width === 390 || width === 1440) {
      await page.locator("#budget-savings").screenshot({ path: path.join(output, `savings-${width}.png`) });
      await page.locator("#budget-country").screenshot({ path: path.join(output, `country-${width}.png`) });
    }
    if (width === 390) {
      await page.unroute("**/kapi/leads");
      let payload;
      await page.route("**/kapi/leads", async intercepted => {
        payload = intercepted.request().postDataJSON();
        await intercepted.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
      });
      const form = page.locator("#budget-request form");
      await form.getByTestId("form-name").fill("Проверка бюджетной кухни");
      await form.getByTestId("form-phone").fill("+375291112233");
      await form.getByTestId("form-city").fill("Деревня, Смолевичский район");
      await form.getByTestId("form-dimensions").fill("Одна стена 240 см");
      await form.getByTestId("form-comment").fill("Бюджет до 3000 BYN. Для дачи; техника уже есть.");
      await form.getByTestId("form-agreement").check();
      await form.getByTestId("form-submit").click();
      await page.getByText("Заявка отправлена", { exact: false }).waitFor();
      assert.equal(payload.sourcePage, routePath);
      assert.equal(payload.city, "Деревня, Смолевичский район");
      assert.equal(payload.dimensions, "Одна стена 240 см");
      assert.ok(payload.comment.includes("3000 BYN"));
      result.form = { intercepted: true, sourcePage: payload.sourcePage, city: payload.city, dimensions: payload.dimensions };
    }
    if (width === 1440) {
      const hrefs = await page.locator("main a[href^='/']").evaluateAll(nodes => [...new Set(nodes.map(a => a.getAttribute("href")))]);
      assert.ok(hrefs.length >= 12, "Link audit must include internal content links");
      for (const href of hrefs) {
        const r = await page.request.get(base + href);
        result.links.push({ href, status: r.status() });
        assert.equal(r.status(), 200, href);
      }
      const xml = await (await page.request.get(base + "/sitemap.xml")).text();
      assert.match(xml, /byudzhetnaya-kuhnya<\/loc>\s*<lastmod>2026-10-12/);
    }
    assert.deepEqual(errors, []);
    result.viewports.push({ width, height, galleries: galleries.length, images: images.length, overflow: false, errors });
    await page.close();
  }
  await fs.writeFile(path.join(output, "qa.json"), JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
