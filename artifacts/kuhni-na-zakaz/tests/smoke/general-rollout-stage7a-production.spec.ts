import { expect, test } from "@playwright/test";

const scopeRoutes = [
  "/catalog",
  "/catalog/uglovye-kuhni",
  "/catalog/pryamye-kuhni",
  "/catalog/p-obraznye-kuhni",
  "/catalog/kuhni-s-ostrovom",
  "/catalog/malenkie-kuhni",
  "/catalog/kuhni-do-potolka",
  "/catalog/kuhni-bez-ruchek",
] as const;

const protectedRoutes = ["/", "/design-proekt-kuhni", "/locations/minsk", "/locations/minskaya-oblast", "/materials/furnitura"] as const;

async function assertRoute(page: import("@playwright/test").Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60_000 });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical || "", "https://kuhni.minsk.by").pathname).toBe(route);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  expect(await page.locator("img:not([alt])").count()).toBe(0);
  expect(await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && (image as HTMLImageElement).naturalWidth === 0).length)).toBe(0);
}

test.describe("stage 7A production smoke", () => {
  for (const route of scopeRoutes) {
    test(`scope ${route}`, async ({ page }) => assertRoute(page, route));
  }

  for (const route of protectedRoutes) {
    test(`protected ${route}`, async ({ page }) => assertRoute(page, route));
  }

  test("catalog interaction and server links", async ({ page }) => {
    await page.goto("/catalog", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const island = page.getByRole("tab", { name: "Остров", exact: true });
    await island.click();
    await expect(island).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("коммуникаций");
    await expect(page.locator('[data-component="RelatedExplorationRail"] a[href]')).toHaveCount(3);
  });

  for (const route of ["/sitemap.xml", "/robots.txt"] as const) {
    test(`${route} is available`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);
    });
  }
});
