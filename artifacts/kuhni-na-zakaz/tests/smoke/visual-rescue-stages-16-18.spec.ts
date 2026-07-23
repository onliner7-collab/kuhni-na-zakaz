import { expect, test } from "@playwright/test";

const routes = [
  { path: "/styles/skandinavskie", series: "STYLE-SCANDINAVIAN-2026-07-23" },
  { path: "/styles/klassicheskie", series: "STYLE-CLASSIC-2026-07-23" },
  { path: "/styles/minimalizm", series: "STYLE-MINIMAL-2026-07-23" },
] as const;

test.describe("visual rescue stages 16–18", () => {
  for (const route of routes) {
    test(`${route.path}: six meaningful visual states stay in one stable block`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const response = await page.goto(route.path, { waitUntil: "networkidle" });

      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${route.path}$`));

      const explorer = page.locator(`[data-series-id="${route.series}"]`);
      const image = explorer.locator("img");
      const tabs = explorer.getByRole("tab");
      await expect(explorer).toBeVisible();
      await expect(tabs).toHaveCount(6);
      expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(1200);

      const initialHeight = await image.evaluate((node) => node.getBoundingClientRect().height);
      const sources = new Set<string>();
      for (let index = 0; index < 6; index += 1) {
        const tab = tabs.nth(index);
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        sources.add(await image.getAttribute("src") ?? "");
        expect(await image.evaluate((node) => node.getBoundingClientRect().height)).toBe(initialHeight);
        await expect(explorer.getByRole("tabpanel")).toBeVisible();
      }
      expect(sources.size).toBe(6);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
      await expect(image).toHaveCSS("animation-name", "none");
    });
  }

  test("keyboard arrows change the selected visual state with visible focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/styles/minimalizm", { waitUntil: "networkidle" });
    const tabs = page.locator('[data-series-id="STYLE-MINIMAL-2026-07-23"]').getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toBeFocused();
    expect(await tabs.nth(1).evaluate((node) => getComputedStyle(node).outlineStyle !== "none" || getComputedStyle(node).boxShadow !== "none")).toBe(true);
  });

  test("Dock hides on downward scroll, stays hidden during selection, and returns upward", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/styles/skandinavskie", { waitUntil: "networkidle" });
    const dock = page.getByTestId("mobile-bottom-nav");
    await expect(dock).not.toHaveClass(/mobile-page-dock--hidden/);

    await page.mouse.wheel(0, 700);
    if (await page.evaluate(() => window.scrollY < 100)) await page.keyboard.press("PageDown");
    await expect(dock).toHaveClass(/mobile-page-dock--hidden/);
    await page.getByRole("tab", { name: /Больше дерева/ }).click();
    await expect(dock).toHaveClass(/mobile-page-dock--hidden/);

    await page.mouse.wheel(0, -250);
    if (await page.evaluate(() => window.scrollY > 600)) await page.keyboard.press("PageUp");
    await expect(dock).toHaveClass(/mobile-page-dock--hidden/);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.wheel(0, -250);
    if (await page.evaluate(() => window.scrollY > 400)) await page.keyboard.press("PageUp");
    await expect(dock).not.toHaveClass(/mobile-page-dock--hidden/);
  });

  for (const width of [360, 390, 412, 768, 1440]) {
    test(`responsive regression at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1024 });
      for (const route of routes) {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), route.path).toBe(false);
        expect(await page.locator("main img").evaluateAll((images: HTMLImageElement[]) => images.filter((image) => image.complete && image.naturalWidth === 0).length), route.path).toBe(0);
      }
    });
  }
});
