import { expect, test } from "@playwright/test";

const styleRoutes = ["/styles/neoklassika", "/styles/hay-tek", "/styles/provans", "/styles/loft", "/styles/sovremennye", "/styles/skandinavskie", "/styles/klassicheskie", "/styles/minimalizm"] as const;
const scenarioRoutes = ["/scenarios/s-ostrovom", "/scenarios/do-potolka", "/scenarios/dlya-semi", "/scenarios/dlya-studii", "/scenarios/dlya-malenkoy-kuhni", "/scenarios/byudzhetnaya-kuhnya"] as const;
const routes = ["/styles", "/scenarios", ...styleRoutes, ...scenarioRoutes] as const;

test.describe("general rollout stage 7C", () => {
  for (const route of routes) {
    for (const width of [360, 390, 412, 768, 1440]) {
      test(`${route}: SEO, media and layout at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width >= 768 ? 960 : 844 });
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
        expect(await page.locator("img:not([alt])").count()).toBe(0);
        const broken = await page.locator("img").evaluateAll((images) => (images as HTMLImageElement[]).filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
        expect(broken).toEqual([]);
      });
    }
  }

  for (const hub of ["/styles", "/scenarios"] as const) {
    test(`${hub}: visual-first выбор меняет результат`, async ({ page }) => {
      await page.goto(hub, { waitUntil: "domcontentloaded" });
      const explorer = page.locator(`[data-interaction-role="${hub === "/styles" ? "style" : "scenario"}-hub-explorer"]`);
      const before = await explorer.locator("img").evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
      const option = explorer.locator("button").nth(2);
      await option.click();
      await expect(option).toHaveAttribute("aria-pressed", "true");
      await expect.poll(() => explorer.locator("img").evaluate((image: HTMLImageElement) => image.currentSrc || image.src)).not.toBe(before);
      await expect(page.locator('[data-component="RelatedExplorationRail"] a[href]')).toHaveCount(3);
    });
  }

  for (const route of [...styleRoutes, ...scenarioRoutes]) {
    test(`${route}: detail explorer и 2–4 перехода`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const tabs = page.getByRole("tab");
      expect(await tabs.count()).toBeGreaterThanOrEqual(5);
      const option = tabs.nth(1);
      await option.click();
      await expect(option).toHaveAttribute("aria-selected", "true");
      const links = page.locator('a[data-transition][href]');
      expect(await links.count()).toBeGreaterThanOrEqual(2);
      expect(await links.count()).toBeLessThanOrEqual(4);
    });
  }
});
