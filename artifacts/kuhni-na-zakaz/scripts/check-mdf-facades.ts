import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { MDF_PHOTOS } from "../data/mdf-gallery";

async function main() {
  const base = process.env.MDF_QA_URL || "http://127.0.0.1:3017";
  const out = path.resolve(process.env.MDF_QA_OUT || "../../docs/seo/materials-comparison/stage-2/qa-local");
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route("**/*", r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const report: Record<string, unknown> = { base, errors };
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("kuhni-materials-v1")!));
  const goto = async (route: string) => { const r = await page.goto(base + route, { waitUntil: "domcontentloaded" }); assert.equal(r?.status(), 200); await expect(page.getByTestId("materials-selection")).not.toHaveAttribute("inert"); };
  try {
    await goto("/materials/mdf-fasady");
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://kuhni.minsk.by/materials/mdf-fasady");
    assert.deepEqual((await state()).comparisonIds, []);
    await expect(page.locator("#gallery figure")).toHaveCount(6);
    await page.locator("#gallery").getByRole("button", { name: "Показать ещё ракурсы и детали" }).click();
    await expect(page.locator("#gallery figure")).toHaveCount(12);
    await page.locator('#gallery button[aria-label^="Увеличить:"]').first().click();
    await expect(page.getByRole("dialog", { name: "Примеры фасадов МДФ" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    assert.ok((await page.evaluate(() => document.activeElement?.getAttribute("aria-label")))?.startsWith("Увеличить:"));
    assert.deepEqual((await state()).comparisonIds, []);
    await page.locator("#surface").getByRole("button", { name: "Тёплый свет", exact: true }).click();
    await expect(page.locator("#surface img")).toHaveAttribute("src", /profile-warm.webp/);
    assert.deepEqual((await state()).comparisonIds, []);
    report.viewing = "12 images, lightbox, focus return and lighting do not change selection";

    await page.locator("#gallery").getByLabel("Планировка и ракурс").selectOption("Деталь");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("#gallery").getByLabel("Планировка и ракурс")).toHaveValue("Деталь");
    await goto("/materials");
    const hubFilters = JSON.stringify((await state()).galleryFilters);
    await goto("/materials/mdf-fasady");
    await expect(page.locator("#gallery").getByLabel("Планировка и ракурс")).toHaveValue("Деталь");
    assert.equal(JSON.stringify((await state()).galleryFilters), hubFilters);
    await page.locator("#gallery").getByRole("button", { name: "Сбросить фильтры галереи" }).click();
    report.filters = "MDF filter survives refresh and round trip; hub filters unchanged";

    await page.locator("#plenka").getByRole("button", { name: "Предпочитаю этот вариант", exact: true }).click();
    await page.locator('#alternatives').getByRole('button', { name: 'Добавить к сравнению', exact: true }).first().click();
    await page.locator('[data-material-id="hpl"]').getByRole("button", { name: "Добавить к сравнению", exact: true }).click();
    await page.locator('[data-material-id="acrylic"]').getByRole("button", { name: "Добавить к сравнению", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "В сравнении уже три варианта" })).toBeVisible();
    await page.getByRole("button", { name: "Отмена", exact: true }).click();
    assert.deepEqual((await state()).comparisonIds, ["mdf-film", "ldsp", "hpl"]);
    await page.getByTestId("materials-selection").getByRole("link", { name: /Моё сравнение/ }).click();
    await expect(page).toHaveURL(/\/materials\?.*#compare/);
    assert.equal((await state()).preferredId, "mdf-film");
    await page.getByRole("navigation", { name: "Другие материалы", exact: true }).getByRole("link", { name: "МДФ и плёнка", exact: true }).click();
    await expect(page.locator("#plenka")).toBeVisible();
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal((await state()).preferredId, "mdf-film");
    assert.deepEqual((await state()).comparisonIds, ["mdf-film", "ldsp", "hpl"]);
    report.selection = "explicit film preference, 3 solutions, fourth cancelled, hub round trip and refresh PASS";

    let payload: any;
    await page.route("**/kapi/leads", async route => { payload = route.request().postDataJSON(); await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) }); });
    const form = page.locator("#materials-form");
    await form.locator('input[name="name"]').fill("Проверка формы");
    await form.locator('input[name="phone"]').fill("+375291234567");
    await form.locator('input[name="agreement"]').check();
    await form.getByRole("button", { name: "Рассчитать кухню", exact: true }).click();
    await page.getByTestId("form-success").waitFor();
    assert.deepEqual(payload.answers.materialSelection.comparisonIds, ["mdf-film", "ldsp", "hpl"]);
    assert.equal(payload.answers.materialSelection.preferredId, "mdf-film");
    assert.equal(payload.source, "material-mdf-facades");
    assert.ok(!JSON.stringify(await state()).includes("Проверка формы"));
    assert.ok(!page.url().includes("375291234567"));
    report.form = { method: "POST intercepted; no real lead or notification", selection: payload.answers.materialSelection, source: payload.source };

    report.images = [];
    for (const p of MDF_PHOTOS) {
      const r = await context.request.get(base + p.src);
      assert.equal(r.status(), 200, p.src);
      const size = await page.evaluate(async src => { const i = new Image(); i.src = src; await i.decode(); return i.naturalWidth; }, p.src);
      assert.ok(size > 0);
      (report.images as unknown[]).push({ src: p.src, status: r.status(), naturalWidth: size });
    }
    const watermark = await context.request.get(base + "/kapi/watermarked-image?src=" + encodeURIComponent(MDF_PHOTOS[0].src) + "&w=600");
    assert.equal(watermark.status(), 200);
    report.watermark = 200;
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await goto("/materials/mdf-fasady");
      await page.locator('img[src$="film-apartment.webp"]').first().evaluate((i: HTMLImageElement) => i.decode());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
      await page.screenshot({ path: path.join(out, `hero-${width}.png`), timeout: 15000 });
    }
    report.responsive = "360/390/768/1440 PASS";
    await page.getByRole("link", { name: "Проверьте декор ЛДСП в четырёх ракурсах →", exact: true }).click();
    await expect(page).toHaveURL(/\/materials\/ldsp\?.*#material-explorer/);
    await expect(page.getByRole("heading", { name: "Проверьте декор ЛДСП в четырёх ракурсах", exact: true })).toBeVisible();
    for (const button of await page.locator("#material-explorer button[data-frame-id]").all()) {
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("#material-explorer img")).toHaveAttribute("src", new RegExp((await button.getAttribute("data-frame-id"))!));
      await expect.poll(() => page.locator("#material-explorer img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    }
    await expect(page.getByRole("heading", { name: "Как выглядит ЛДСП для кухни в образцах и интерьере", exact: true })).toBeVisible();
    assert.ok(await page.locator("#material-detail-gallery img").count() >= 4);
    assert.equal((await state()).preferredId, "mdf-film");
    report.ldspBlocks = "Both existing photo blocks preserved; four angles load; explicit preference retained";
    assert.equal(errors.length, 0);
    report.status = "PASS";
    console.log(JSON.stringify(report));
  } catch (e) { report.status = "FAIL"; report.error = String(e); throw e; }
  finally { await fs.writeFile(path.join(out, "browser-report.json"), JSON.stringify(report, null, 2)); await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
