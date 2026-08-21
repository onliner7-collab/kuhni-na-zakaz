import { expect, test, type Page } from "@playwright/test";

const l3aRoutes = ["/locations/berezino", "/locations/stolbtsy", "/locations/uzda"] as const;
const protectedRoutes = ["/", "/design-proekt-kuhni", "/locations/minsk", "/locations/minskaya-oblast", "/locations/borisov", "/materials/furnitura"] as const;

async function currentSource(page: Page) {
  return page.locator("[data-location-visual-stage] img").evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
}

async function assertSeoAndLayout(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  expect(await page.locator("img:not([alt])").count()).toBe(0);
}

test.describe("location visual corrective L3A", () => {
  for (const route of l3aRoutes) {
    test(`${route}: three actions change loaded visuals and save safe context`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as typeof window & { __locationCls?: number }).__locationCls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
            if (!entry.hadRecentInput) (window as typeof window & { __locationCls?: number }).__locationCls! += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await assertSeoAndLayout(page, route);
      const explorer = page.locator("[data-location-visual-explorer]");
      await expect(explorer).toBeVisible();
      const image = explorer.locator("img");
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);
      const tabs = explorer.getByRole("tab");
      await expect(tabs).toHaveCount(4);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => { (window as typeof window & { __locationCls?: number }).__locationCls = 0; });
      let previous = await currentSource(page);

      for (let index = 1; index < 4; index += 1) {
        const tab = tabs.nth(index);
        await tab.scrollIntoViewIfNeeded();
        const before = await page.evaluate(() => window.scrollY);
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        await expect.poll(() => currentSource(page)).not.toBe(previous);
        previous = await currentSource(page);
        await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);
        expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(2);
      }

      const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
      expect(stored).toContain("location");
      expect(stored).not.toMatch(/phone|address|email/i);
      expect(await page.evaluate(() => (window as typeof window & { __locationCls?: number }).__locationCls ?? 0)).toBeLessThanOrEqual(0.02);
    });

    test(`${route}: mobile visual-first layout at 390px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await assertSeoAndLayout(page, route);
      const explorer = page.locator("[data-location-visual-explorer]");
      const box = await explorer.getByRole("tab").first().boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      await expect.poll(() => currentSource(page)).toContain("-mobile.webp");
      const broken = await page.locator("img").evaluateAll((images) =>
        (images as HTMLImageElement[]).filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      );
      expect(broken).toEqual([]);
    });
  }

  for (const width of [360, 412, 768, 1440]) {
    test(`route-planning representative remains responsive at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 768 ? 960 : width === 412 ? 915 : 800 });
      await assertSeoAndLayout(page, "/locations/berezino");
      await expect(page.locator("[data-location-visual-explorer]")).toBeVisible();
    });
  }

  test("keyboard and reduced motion keep the four states usable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/locations/uzda", { waitUntil: "networkidle" });
    const tabs = page.locator("[data-location-visual-explorer]").getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
  });

  for (const route of protectedRoutes) {
    test(`protected ${route}: no generic explorer regression`, async ({ page }) => {
      await assertSeoAndLayout(page, route);
      await expect(page.locator("[data-location-visual-explorer]")).toHaveCount(0);
    });
  }
});
