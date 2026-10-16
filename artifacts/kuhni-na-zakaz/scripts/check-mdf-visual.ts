import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { MATERIAL_ROUTES } from "../data/material-solutions";

async function main() {
  const base = process.env.MDF_VISUAL_URL || "http://127.0.0.1:3021";
  const out = process.env.MDF_VISUAL_OUT || "C:/Users/User/Desktop/kuhni-na-zakaz/docs/seo/materials-comparison/stage-2/visual-v2/local";
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, recordVideo: { dir: out, size: { width: 390, height: 844 } } });
  await context.route("**/*", r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const report: any = { base, errors, states: [] };
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("kuhni-materials-v1")!));
  const shot = (name: string) => page.screenshot({ path: path.join(out, name + ".png"), timeout: 15000 });
  try {
    const r = await page.goto(base + "/materials/mdf-fasady?compare=", { waitUntil: "domcontentloaded" });
    assert.equal(r?.status(), 200);
    const hero = page.getByTestId("mdf-visual-journey");
    await expect(hero.getByRole("button", { name: "Гладкие фасады", exact: true })).toBeEnabled();
    await hero.locator("img").first().evaluate((i: HTMLImageElement) => i.decode());
    report.initial = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="mdf-visual-journey"]')!;
      const h = hero.querySelector("h1")!;
      return { visibleWords: document.body.innerText.split(/\s+/).length, imageTop: hero.querySelector("img")!.getBoundingClientRect().top, firstChoiceTop: hero.querySelector('[aria-label="Примеры кухонь"]')!.getBoundingClientRect().top, h1Lines: h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight), overflow: document.documentElement.scrollWidth > innerWidth };
    });
    assert.ok(report.initial.visibleWords < 800);
    assert.ok(report.initial.imageTop < 500);
    assert.ok(report.initial.firstChoiceTop < 844 * 2);
    assert.ok(report.initial.h1Lines < 3.1);
    assert.equal(report.initial.overflow, false);
    await shot("01-initial");
    const initialUpdatedAt = (await state()).updatedAt;
    for (const [name, file] of [["Другой ракурс", "film-apartment-angle"], ["Фасад вблизи", "film-apartment-edge"], ["С фрезеровкой", "film-country"], ["Фасад вблизи", "film-country-profile"]]) {
      await hero.getByRole("button", { name, exact: true }).click();
      await expect(hero.locator("img").first()).toHaveAttribute("src", new RegExp(file + "\\.webp$"));
      await hero.locator("img").first().evaluate((i: HTMLImageElement) => i.decode());
      report.states.push(file);
    }
    assert.deepEqual((await state()).comparisonIds, []);
    assert.equal((await state()).updatedAt, initialUpdatedAt);
    await hero.scrollIntoViewIfNeeded(); await shot("02-closeup");
    await hero.getByRole("button", { name: "Предпочитаю", exact: true }).click();
    await page.waitForURL(/preferred=mdf-film/);
    assert.equal((await state()).preferredId, "mdf-film");
    await hero.getByRole("button", { name: "Моё сравнение", exact: true }).click();
    await page.waitForURL(/\/materials\?.*#compare/);
    await page.getByRole("navigation", { name: "Другие материалы", exact: true }).getByRole("link", { name: "МДФ и плёнка", exact: true }).click();
    await expect(hero.locator("img").first()).toHaveAttribute("src", /film-country-profile.webp$/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(hero.locator("img").first()).toHaveAttribute("src", /film-country-profile.webp$/);
    const compare = page.locator("#alternatives");
    await compare.getByRole("button", { name: "Вблизи", exact: true }).click();
    await expect(compare.locator("img").first()).toHaveAttribute("src", /film-country-profile.webp$/);
    await compare.scrollIntoViewIfNeeded(); await shot("03-comparison");
    await page.getByText("ЛДСП: четыре ракурса и фото в интерьере", { exact: true }).click();
    await expect(page.getByRole("heading", { name: "Проверьте декор ЛДСП в четырёх ракурсах", exact: true })).toBeVisible();
    for (const b of await page.locator("#material-explorer button[data-frame-id]").all()) { await b.click(); await expect(b).toHaveAttribute("aria-pressed", "true"); await expect.poll(() => page.locator("#material-explorer img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true); }
    await expect(page.getByRole("heading", { name: "Как выглядит ЛДСП для кухни в образцах и интерьере", exact: true })).toBeVisible();
    await page.locator("#material-detail-gallery").scrollIntoViewIfNeeded(); await shot("04-ldsp-blocks");
    assert.equal((await state()).preferredId, "mdf-film");
    const price = page.locator("#prices");
    await price.getByRole("button", { name: /Угловая кухня/ }).click();
    assert.equal((await state()).scenarioId, "corner-24-18");
    await price.scrollIntoViewIfNeeded(); await shot("05-equipment");
    const construction = page.getByTestId("mdf-construction-compare");
    for (const label of ["МДФ и ЛДСП", "Плёнка и эмаль", "Фасад и корпус"]) {
      await construction.getByRole("button", { name: label, exact: true }).click();
      await expect(construction.locator("figure")).toHaveCount(2);
      for (const image of await construction.locator("img").all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(() => image.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true); }
    }
    await construction.scrollIntoViewIfNeeded(); await shot("06-construction-comparison");
    report.constructionComparison = "3 illustrated pairs, both photos loaded and labelled";
    let payload: any;
    await page.route("**/kapi/leads", async r => { payload = r.request().postDataJSON(); await r.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }); });
    const form = page.locator("#materials-form");
    await expect(form.getByRole("button", { name: "Рассчитать кухню", exact: true })).toBeEnabled();
    await form.locator('input[name="name"]').fill("Проверка формы");
    await form.locator('input[name="phone"]').fill("+375291234567");
    await form.locator('input[name="agreement"]').check();
    await form.getByRole("button", { name: "Рассчитать кухню", exact: true }).click();
    await page.getByTestId("form-success").waitFor();
    assert.equal(payload.answers.materialSelection.preferredId, "mdf-film");
    assert.equal(payload.answers.materialSelection.scenarioId, "corner-24-18");
    report.form = { intercepted: true, selection: payload.answers.materialSelection };
    report.responsive = [];
    for (const width of [360, 390, 412, 768, 1440]) { await page.setViewportSize({ width, height: 900 }); await page.goto(base + "/materials/mdf-fasady"); await hero.locator("img").first().evaluate((i: HTMLImageElement) => i.decode()); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await shot("width-" + width); report.responsive.push(width); }
    report.transitions = [];
    const query = "?compare=mdf-film,ldsp&preferred=mdf-film";
    for (const from of MATERIAL_ROUTES) {
      for (const to of MATERIAL_ROUTES.filter(to => to !== from)) {
        await page.goto(base + from + query, { waitUntil: "domcontentloaded" });
        await expect(page.getByTestId("materials-selection")).not.toHaveAttribute("inert");
        const nav = page.getByRole("navigation", { name: "Другие материалы", exact: true });
        await expect(nav).not.toHaveAttribute("inert");
        const link = nav.locator("a").filter({ hasText: to === "/materials" ? /^Все материалы$/ : to === "/materials/mdf-fasady" ? /^МДФ и плёнка$/ : to === "/materials/ldsp" ? /^Фасады ЛДСП$/ : to === "/materials/mdf-emal" ? /^МДФ с эмалью$/ : to === "/materials/plastik-hpl" ? /^Фасады с HPL$/ : to === "/materials/akril" ? /^Акриловые фасады$/ : /^Шпонированные фасады$/ });
        await link.click();
        await page.waitForURL(url => url.pathname === to);
        await expect(page.getByTestId("materials-selection")).not.toHaveAttribute("inert");
        assert.deepEqual((await state()).comparisonIds, ["mdf-film", "ldsp"]);
        assert.equal((await state()).preferredId, "mdf-film");
        report.transitions.push({ from, to });
      }
    }
    assert.equal(report.transitions.length, 42);
    assert.equal(errors.length, 0);
    report.status = "PASS";
    console.log(JSON.stringify(report));
  } catch (e) { report.status = "FAIL"; report.error = String(e); throw e; }
  finally { await context.close(); await fs.writeFile(path.join(out, "report.json"), JSON.stringify(report, null, 2)); await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
