import { expect, test } from "@playwright/test";

const routes = [
  "/styles/neoklassika", "/styles/hay-tek", "/styles/provans", "/styles/loft",
  "/styles/sovremennye", "/styles/skandinavskie", "/styles/klassicheskie", "/styles/minimalizm",
  "/scenarios/s-ostrovom", "/scenarios/do-potolka", "/scenarios/dlya-semi",
  "/scenarios/dlya-studii", "/scenarios/dlya-malenkoy-kuhni", "/scenarios/byudzhetnaya-kuhnya",
];

test.describe("style and scenario families", () => {
  for (const path of routes) test(`${path} has SEO, media, fallbacks and transitions`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.getByText("Если интерактив недоступен", { exact: true })).toBeVisible();
    await expect(page.locator("[data-transition]")).toHaveCount(4);
    await expect(page.locator('[data-transition="PROOF"]')).toHaveAttribute("href", "/portfolio");
    await expect(page.locator("main img").first()).toHaveAttribute("alt", /[А-Яа-яЁё]/);
    expect(await page.locator("main img").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  });

  test("decision controls are keyboard reachable and persist ExploreContext", async ({ page }) => {
    await page.goto("/scenarios/dlya-malenkoy-kuhni");
    const button = page.getByRole("button", { name: "Хранение", exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    const stored = await page.evaluate(() => sessionStorage.getItem("kuhni-explore-context"));
    expect(stored).toContain("scenario_priority:Хранение");
  });

  for (const width of [360, 390, 412, 768]) test(`representative pages fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1024 });
    for (const path of ["/styles/minimalizm", "/scenarios/dlya-malenkoy-kuhni"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), path).toBe(false);
      const targets = await page.locator("main button, main a").evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).length);
      expect(targets, `${path}: touch targets`).toBe(0);
    }
  });
});

test("protected baseline stays reachable with one H1 and no broken content images", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), path).toBe(false);
    const broken = await page.locator("main img").evaluateAll((images: HTMLImageElement[]) => images.filter((image) => image.complete && image.naturalWidth === 0).length);
    expect(broken, path).toBe(0);
  }
});
