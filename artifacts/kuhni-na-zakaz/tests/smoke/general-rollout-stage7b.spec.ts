import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/materials",
  "/materials/furnitura",
  "/materials/ldsp",
  "/materials/mdf-fasady",
  "/materials/plastik-hpl",
  "/materials/shpon",
  "/materials/akril",
  "/materials/mdf-emal",
] as const;

async function imageSource(page: Page, selector: string) {
  return page.locator(selector).evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
}

test.describe("general rollout stage 7B", () => {
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

  test("хаб меняет материал, изображение и сохраняет выбор", async ({ page }) => {
    await page.goto("/materials", { waitUntil: "domcontentloaded" });
    const image = '[data-interaction-role="materials-hub-explorer"] img';
    const before = await imageSource(page, image);
    const option = page.getByRole("button", { name: "Шпон", exact: true });
    await option.click();
    await expect(option).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => imageSource(page, image)).not.toBe(before);
    await expect(page.locator('[data-interaction-role="materials-hub-explorer"]')).toContainText("баланс дерева");
    expect(await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"))).toContain("Шпон");
  });

  for (const route of ["/materials/ldsp", "/materials/plastik-hpl", "/materials/shpon", "/materials/akril", "/materials/mdf-emal"]) {
    test(`${route}: визуальная проверка меняет ракурс`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const explorer = page.locator('[data-interaction-role="material-decision-explorer"]');
      const image = explorer.locator("img");
      const before = await image.evaluate((node: HTMLImageElement) => node.currentSrc || node.src);
      const button = explorer.locator("button").nth(2);
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.currentSrc || node.src)).not.toBe(before);
    });
  }

  test("все страницы дают от двух до четырёх следующих шагов", async ({ page }) => {
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const links = page.locator('[data-component="RelatedExplorationRail"] a[href]');
      await expect(links.first()).toBeVisible();
      expect(await links.count()).toBeGreaterThanOrEqual(2);
      expect(await links.count()).toBeLessThanOrEqual(4);
    }
  });
});
