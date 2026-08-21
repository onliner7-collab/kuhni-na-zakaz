import { expect, test, type Page } from "@playwright/test";

const activeRoutes = [
  "soligorsk", "fanipol", "gomel", "vitebsk", "grodno", "brest", "mogilev", "molodechno",
  "zhodino", "slutsk", "maryina-gorka", "smolevichi", "dzerzhinsk", "zaslavl", "logoisk",
  "vileyka", "nesvizh", "volozhin", "myadel", "berezino", "stolbtsy", "uzda", "cherven",
  "kletsk", "kopyl", "krupki", "lyuban", "starye-dorogi",
].map((city) => `/locations/${city}`);

const protectedRoutes = ["/locations", "/locations/minsk", "/locations/minskaya-oblast", "/locations/borisov"];

async function currentSource(page: Page) {
  return page.locator("[data-location-visual-stage] img").evaluate((image: HTMLImageElement) => image.currentSrc || image.src);
}

async function assertPageContract(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status(), route).toBe(200);
  await expect(page.locator("h1"), route).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname, route).toBe(route);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), route).toBe(false);
  expect(await page.locator("img:not([alt])").count(), route).toBe(0);
}

for (const route of activeRoutes) {
  test(`${route}: final interactive acceptance`, async ({ page }) => {
    await assertPageContract(page, route);
    const explorer = page.locator("[data-location-visual-explorer]");
    await expect(explorer).toBeVisible();
    const image = explorer.locator("img");
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth), { timeout: 20_000 }).toBeGreaterThan(0);
    const tabs = explorer.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    let previous = await currentSource(page);
    for (let index = 1; index < 4; index += 1) {
      await tabs.nth(index).click();
      await expect.poll(() => currentSource(page), { timeout: 20_000 }).not.toBe(previous);
      previous = await currentSource(page);
    }
  });
}

for (const route of protectedRoutes) {
  test(`${route}: final protected acceptance`, async ({ page }) => {
    await assertPageContract(page, route);
    await expect(page.locator("[data-location-visual-explorer]")).toHaveCount(0);
  });
}

