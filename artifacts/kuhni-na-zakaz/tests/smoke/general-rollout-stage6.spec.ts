import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/design-proekt-kuhni", "/locations/minsk", "/locations/minskaya-oblast", "/materials/furnitura"] as const;

async function currentSource(page: Page, selector: string) {
  return page.locator(selector).evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
}

test.describe("general rollout stage 6", () => {
  for (const route of routes) {
    for (const width of [360, 390, 412, 768, 1440]) {
    test(`${route}: SEO, links, media and layout stay healthy at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 768 ? 960 : 844 });
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
      await expect(page.locator('[data-component="RelatedExplorationRail"] [data-transition]')).toHaveCount(3);
      expect(await page.locator('[data-component="RelatedExplorationRail"] a[href]').count()).toBe(3);
      const broken = await page.locator("img").evaluateAll((images) => images.filter((item) => item.complete && item.naturalWidth === 0).map((item) => item.getAttribute("src")));
      expect(broken).toEqual([]);
      const missingAlt = await page.locator("img").evaluateAll((images) => images.filter((item) => !item.hasAttribute("alt")).length);
      expect(missingAlt).toBe(0);
    });
    }
  }

  test("главная меняет visual и сохраняет жизненный сценарий", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const selector = "[data-stage6-home-result] img";
    const before = await currentSource(page, selector);
    await page.locator('[data-stage6-scenario-id="studio"]').click();
    await expect.poll(() => currentSource(page, selector)).not.toBe(before);
    const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
    expect(stored).toContain("Для студии");
  });

  test("дизайн-проект меняет preview и сохраняет форму, стиль и ограничения", async ({ page }) => {
    await page.goto("/design-proekt-kuhni", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const selector = "#idea-builder .sticky img";
    const before = await currentSource(page, selector);
    await page.locator('[data-stage6-shape="П-образная"]').click();
    await expect.poll(() => currentSource(page, selector)).not.toBe(before);
    await page.getByRole("button", { name: "Теплая кухня с деревом" }).click();
    await page.getByRole("button", { name: "Кухня до потолка", exact: true }).click();
    const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
    expect(stored).toContain("П-образная");
    expect(stored).toContain("Теплая кухня с деревом");
    expect(stored).toContain("Кухня до потолка");
  });

  for (const [route, button, id] of [["/locations/minsk", "Новостройка", "newbuild"], ["/locations/minskaya-oblast", "Молодечно", "molodechno"]] as const) {
    test(`${route}: route-specific choice changes visual and location context`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      const selector = "[data-stage6-location-result] img";
      const before = await currentSource(page, selector);
      await page.locator(`[data-stage6-location-id="${id}"]`).click();
      await expect.poll(() => currentSource(page, selector)).not.toBe(before);
      const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
      expect(stored).toContain(button);
    });
  }

  test("фурнитура меняет механизм, сохраняет context и оставляет 15 изображений", async ({ page }) => {
    await page.goto("/materials/furnitura", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const selector = "#mechanisms figure img";
    const before = await currentSource(page, selector);
    await page.locator('[data-stage6-mechanism-id="corner"]').click();
    await expect.poll(() => currentSource(page, selector)).not.toBe(before);
    await expect(page.locator("[data-furnitura-image-index]")).toHaveCount(15);
    await expect(page.getByRole("button", { name: /^Показать ещё 15/ })).toBeVisible();
    const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
    expect(stored).toContain("Угол");
  });
});
