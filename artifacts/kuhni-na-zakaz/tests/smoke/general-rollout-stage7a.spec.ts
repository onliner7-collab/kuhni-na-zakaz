import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/catalog",
  "/catalog/uglovye-kuhni",
  "/catalog/pryamye-kuhni",
  "/catalog/p-obraznye-kuhni",
  "/catalog/kuhni-s-ostrovom",
  "/catalog/malenkie-kuhni",
  "/catalog/kuhni-do-potolka",
  "/catalog/kuhni-bez-ruchek",
] as const;

async function currentSource(page: Page, selector: string) {
  return page.locator(selector).evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
}

test.describe("general rollout stage 7A", () => {
  for (const route of routes) {
    for (const width of [360, 390, 412, 768, 1440]) {
      test(`${route}: SEO, media and mobile layout at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width >= 768 ? 960 : 844 });
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
        const broken = await page.locator("img").evaluateAll((images) =>
          (images as HTMLImageElement[]).filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
        );
        expect(broken).toEqual([]);
        expect(await page.locator("img:not([alt])").count()).toBe(0);
      });
    }
  }

  test("каталог меняет визуальный результат и сохраняет форму", async ({ page }) => {
    await page.goto("/catalog", { waitUntil: "domcontentloaded" });
    const result = "#catalog-shape-result img";
    const before = await currentSource(page, result);
    const tab = page.getByRole("tab", { name: "Остров" });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => currentSource(page, result)).not.toBe(before);
    await expect(page.getByRole("tabpanel")).toContainText("проходы");
    const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
    expect(stored).toContain("Остров");
  });

  test("переключатель каталога поддерживает Arrow, Home и End", async ({ page }) => {
    await page.goto("/catalog", { waitUntil: "domcontentloaded" });
    const first = page.getByRole("tab", { name: "Две стены" });
    await first.focus();
    await first.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Одна стена" })).toBeFocused();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Чистый фасад" })).toBeFocused();
    await page.keyboard.press("Home");
    await expect(first).toBeFocused();
  });

  test("восемь маршрутов имеют осмысленные crawlable следующие шаги", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const links = page.locator('[data-component="RelatedExplorationRail"] a[href]');
      await expect(links.first()).toBeVisible();
      expect(await links.count()).toBeGreaterThanOrEqual(3);
      expect(await links.count()).toBeLessThanOrEqual(4);
    }
  });
});
