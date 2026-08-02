import { expect, test } from "@playwright/test";

const routes = ["/styles", "/scenarios", "/styles/neoklassika", "/styles/hay-tek", "/styles/provans", "/styles/loft", "/styles/sovremennye", "/styles/skandinavskie", "/styles/klassicheskie", "/styles/minimalizm", "/scenarios/s-ostrovom", "/scenarios/do-potolka", "/scenarios/dlya-semi", "/scenarios/dlya-studii", "/scenarios/dlya-malenkoy-kuhni", "/scenarios/byudzhetnaya-kuhnya"] as const;

test("production: 16 маршрутов 7C доступны и целостны", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45_000 });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
    expect(await page.locator("img:not([alt])").count()).toBe(0);
  }
});

for (const hub of ["styles", "scenarios"] as const) {
  test(`production: ${hub} hub переключает выбор`, async ({ page }) => {
    await page.goto(`/${hub}`, { waitUntil: "networkidle", timeout: 45_000 });
    const explorer = page.locator(`[data-interaction-role="${hub === "styles" ? "style" : "scenario"}-hub-explorer"]`);
    const option = explorer.locator("button").nth(2);
    await option.click();
    await expect(option).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-component="RelatedExplorationRail"] a[href]')).toHaveCount(3);
  });
}

test("production: style и scenario details сохраняют explorers", async ({ page }) => {
  for (const route of ["/styles/minimalizm", "/scenarios/dlya-semi"]) {
    await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle");
    const tabs = page.getByRole("tab");
    expect(await tabs.count()).toBeGreaterThanOrEqual(5);
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  }
});
