import { expect, test } from "@playwright/test";

const routes = ["/materials", "/materials/furnitura", "/materials/ldsp", "/materials/mdf-fasady", "/materials/plastik-hpl", "/materials/shpon", "/materials/akril", "/materials/mdf-emal"] as const;

test("production: восемь маршрутов 7B доступны и целостны", async ({ page }) => {
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

test("production: хаб переключает материал", async ({ page }) => {
  await page.goto("/materials", { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForLoadState("networkidle");
  const option = page.getByRole("button", { name: "Шпон", exact: true });
  await option.click();
  await expect(option).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-interaction-role="materials-hub-explorer"]')).toContainText("баланс дерева");
});

test("production: detail меняет ракурс и содержит следующие шаги", async ({ page }) => {
  await page.goto("/materials/plastik-hpl", { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForLoadState("networkidle");
  const explorer = page.locator('[data-interaction-role="material-decision-explorer"]');
  const option = explorer.locator("button").nth(2);
  await option.click();
  await expect(option).toHaveAttribute("aria-pressed", "true");
  const links = page.locator('[data-component="RelatedExplorationRail"] a[href]');
  expect(await links.count()).toBe(3);
});
