import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const routes = [
  { path: "/scenarios/dlya-studii", slug: "dlya-studii", series: "SCENARIO-STUDIO-2026-07-24" },
  { path: "/scenarios/dlya-malenkoy-kuhni", slug: "dlya-malenkoy-kuhni", series: "SCENARIO-SMALL-KITCHEN-2026-07-24" },
  { path: "/scenarios/byudzhetnaya-kuhnya", slug: "byudzhetnaya-kuhnya", series: "SCENARIO-BUDGET-2026-07-24" },
] as const;

const protectedRoutes = [
  "/",
  "/design-proekt-kuhni",
  "/locations/minskaya-oblast",
  "/locations/minsk",
  "/materials/furnitura",
] as const;

const screenshotRoot = path.resolve(process.cwd(), "..", "..", "artifacts", "visual-rescue", "stages-22-24", "screenshots");

function visiblePixels(box: { y: number; height: number } | null, viewportHeight: number) {
  if (!box) return 0;
  return Math.max(0, Math.min(viewportHeight, box.y + box.height) - Math.max(0, box.y));
}

test.beforeAll(() => {
  fs.mkdirSync(screenshotRoot, { recursive: true });
});

test.describe("visual rescue stages 22–24", () => {
  for (const route of routes) {
    test(`${route.path}: every choice changes a visible stable visual`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => {
        const state = window as typeof window & { __scenarioCls?: number };
        state.__scenarioCls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
            if (!entry.hadRecentInput) state.__scenarioCls = (state.__scenarioCls ?? 0) + (entry.value ?? 0);
          }
        }).observe({ type: "layout-shift", buffered: true });
      });

      const initialVisualRequests = new Set<string>();
      let hasInteracted = false;
      page.on("response", (response) => {
        if (!hasInteracted && response.request().resourceType() === "image" && response.url().includes("/media/visual-rescue/")) {
          initialVisualRequests.add(response.url());
        }
      });

      const response = await page.goto(route.path, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${route.path}$`));

      const explorer = page.locator(`[data-series-id="${route.series}"]`);
      const image = explorer.locator("img");
      const tabs = explorer.getByRole("tab");
      const panel = explorer.getByRole("tabpanel");
      await expect(explorer).toBeVisible();
      await expect(tabs).toHaveCount(5);
      await expect(panel).toHaveCount(1);
      expect(initialVisualRequests.size).toBe(1);
      expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(1200);

      await explorer.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(screenshotRoot, `${route.slug}-00-before.png`) });
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        (window as typeof window & { __scenarioCls?: number }).__scenarioCls = 0;
      });
      const initialHeight = await image.evaluate((node) => node.getBoundingClientRect().height);
      const sources = new Set<string>();
      let stableScrollY: number | null = null;
      hasInteracted = true;

      for (let index = 0; index < 5; index += 1) {
        const tab = tabs.nth(index);
        await tab.click();
        await image.evaluate((node: HTMLImageElement) => node.decode());
        await expect(tab).toHaveAttribute("aria-selected", "true");
        await expect(tab).toHaveAttribute("aria-pressed", "true");
        await expect(tab.locator("svg")).toHaveCount(1);
        await expect(panel).toBeVisible();
        expect((await tab.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

        const box = await image.boundingBox();
        expect(box?.height).toBe(initialHeight);
        expect(visiblePixels(box, 844), `visual left viewport after state ${index}`).toBeGreaterThanOrEqual(200);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
        sources.add(await image.getAttribute("src") ?? "");

        const currentScrollY = await page.evaluate(() => window.scrollY);
        if (stableScrollY === null) stableScrollY = currentScrollY;
        else expect(Math.abs(currentScrollY - stableScrollY)).toBeLessThanOrEqual(1);
        await page.screenshot({ path: path.join(screenshotRoot, `${route.slug}-${String(index + 1).padStart(2, "0")}.png`) });
      }

      expect(sources.size).toBe(5);
      expect(await image.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
      expect(await page.evaluate(() => (window as typeof window & { __scenarioCls?: number }).__scenarioCls ?? 0)).toBeLessThan(0.01);
    });
  }

  test("keyboard arrows change selection and preserve visible focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/scenarios/dlya-studii", { waitUntil: "networkidle" });
    const tabs = page.locator('[data-series-id="SCENARIO-STUDIO-2026-07-24"]').getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toBeFocused();
    expect(await tabs.nth(1).evaluate((node) => {
      const style = getComputedStyle(node);
      return style.outlineStyle !== "none" || style.boxShadow !== "none";
    })).toBe(true);
  });

  test("Dock hides down, stays hidden during selector use, and returns up", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/scenarios/dlya-malenkoy-kuhni", { waitUntil: "networkidle" });
    const dock = page.getByTestId("mobile-bottom-nav");
    await expect(dock).not.toHaveClass(/mobile-page-dock--hidden/);
    await page.mouse.wheel(0, 700);
    if (await page.evaluate(() => window.scrollY < 100)) await page.keyboard.press("PageDown");
    await expect(dock).toHaveClass(/mobile-page-dock--hidden/);
    await page.getByRole("tab", { name: /Хранение/ }).click();
    await expect(dock).toHaveClass(/mobile-page-dock--hidden/);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(20, 200);
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await page.mouse.wheel(0, -300);
      if (!(await dock.getAttribute("class"))?.includes("mobile-page-dock--hidden")) break;
    }
    await expect(dock).not.toHaveClass(/mobile-page-dock--hidden/);
  });

  for (const width of [360, 390, 412, 768, 1440]) {
    test(`responsive regression at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width <= 412 ? 844 : 1024 });
      for (const route of routes) {
        const response = await page.goto(route.path, { waitUntil: "networkidle" });
        expect(response?.status(), route.path).toBe(200);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), route.path).toBe(false);
        expect(await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
          images.filter((image) => image.complete && image.naturalWidth === 0).length
        ), route.path).toBe(0);
        const explorer = page.locator(`[data-series-id="${route.series}"]`);
        await explorer.getByRole("tab").last().click();
        expect((await explorer.locator("img").boundingBox())?.height ?? 0, route.path).toBeGreaterThan(0);
      }
    });
  }

  test("protected routes keep their server-rendered baseline", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of protectedRoutes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1"), route).toHaveCount(1);
      expect(await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
        images.filter((image) => image.complete && image.naturalWidth === 0).length
      ), route).toBe(0);
    }
  });
});
