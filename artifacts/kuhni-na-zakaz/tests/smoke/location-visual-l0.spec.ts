import { expect, test, type Page } from "@playwright/test";

const pilotRoutes = ["/locations/soligorsk", "/locations/fanipol", "/locations/gomel"] as const;
const protectedRoutes = ["/", "/design-proekt-kuhni", "/locations/minsk", "/locations/minskaya-oblast", "/locations/borisov", "/materials/furnitura"] as const;

async function currentSource(page: Page, selector: string) {
  return page.locator(selector).evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
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

test.describe("location visual corrective L0", () => {
  for (const route of pilotRoutes) {
    test(`${route}: three actions change a loaded visual and preserve scroll`, async ({ page }) => {
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
      const image = "[data-location-visual-stage] img";
      await expect(page.locator(image)).toBeVisible();
      expect(await page.locator(image).evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
      let previous = await currentSource(page, image);
      const tabs = explorer.getByRole("tab");
      await expect(tabs).toHaveCount(4);

      for (let index = 1; index < 4; index += 1) {
        const tab = tabs.nth(index);
        await tab.scrollIntoViewIfNeeded();
        const scrollBefore = await page.evaluate(() => window.scrollY);
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        await expect.poll(() => currentSource(page, image)).not.toBe(previous);
        previous = await currentSource(page, image);
        expect(await page.locator(image).evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
        expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore)).toBeLessThanOrEqual(2);
      }

      const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context-v2"));
      expect(stored).toContain("location");
      expect(await page.evaluate(() => (window as typeof window & { __locationCls?: number }).__locationCls ?? 0)).toBeLessThanOrEqual(0.02);
    });
  }

  for (const route of pilotRoutes) {
    for (const width of [360, 390, 412, 768, 1440]) {
      test(`${route}: responsive visual-first contract at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width >= 768 ? 960 : width === 412 ? 915 : 844 });
        await assertSeoAndLayout(page, route);
        await expect(page.locator("[data-location-visual-explorer]")).toBeVisible();
        const firstControl = page.locator("[data-location-visual-explorer]").getByRole("tab").first();
        const box = await firstControl.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
        const broken = await page.locator("img").evaluateAll((images) =>
          (images as HTMLImageElement[]).filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
        );
        expect(broken).toEqual([]);
      });
    }
  }

  test("keyboard and reduced motion keep all states usable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/locations/soligorsk", { waitUntil: "domcontentloaded" });
    const tabs = page.locator("[data-location-visual-explorer]").getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
  });

  test("/locations hub changes image and keeps city directory crawlable", async ({ page }) => {
    await assertSeoAndLayout(page, "/locations");
    const hub = page.locator("[data-location-hub-explorer]");
    const image = hub.locator("img");
    const first = await currentSource(page, "[data-location-hub-explorer] img");
    await hub.getByRole("button", { name: "Новостройка" }).click();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.currentSrc)).not.toBe(first);
    expect(await page.locator("details a[href^='/locations/']").count()).toBeGreaterThanOrEqual(31);
  });

  for (const route of protectedRoutes) {
    test(`protected ${route}: regression`, async ({ page }) => {
      await assertSeoAndLayout(page, route);
      await expect(page.locator("[data-location-visual-explorer]")).toHaveCount(0);
    });
  }
});
