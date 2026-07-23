import { expect, test } from "@playwright/test";

const evidenceRoot = "../../artifacts/visual-rescue/stages-13-15";
const widths = [390, 360, 412, 768, 1440];

const targets = [
  {
    route: "/styles/provans",
    slug: "stage-13",
    explorer: '[data-series-id="STYLE-PROVENCE-2026-07-23"]',
    firstAction: "Витринный акцент",
    resultAction: "Больше открытого",
  },
  {
    route: "/styles/loft",
    slug: "stage-14",
    explorer: '[data-series-id="STYLE-LOFT-2026-07-23"]',
    firstAction: "Металл",
    resultAction: "Светлый вариант",
  },
  {
    route: "/styles/sovremennye",
    slug: "stage-15",
    explorer: '[data-series-id="STYLE-MODERN-2026-07-23"]',
    firstAction: "Главная плоскость",
    resultAction: "Сменить акцент",
  },
];

for (const target of targets) {
  test(`${target.route}: visual journey and responsive matrix`, async ({ page }) => {
    const requestedSeriesImages = new Set<string>();
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.url().includes("/media/visual-rescue/")) {
        requestedSeriesImages.add(response.url());
      }
    });

    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 412 ? 844 : width === 768 ? 1024 : 1000 });
      await page.goto(target.route, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${target.route.replaceAll("/", "\\/")}$`));

      const explorer = page.locator(target.explorer);
      await expect(explorer).toBeVisible();
      const activeImage = explorer.locator("img");
      await expect(activeImage).toBeVisible();
      expect(await activeImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      expect(await explorer.locator("button").count()).toBe(6);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      expect(await explorer.locator("button").evaluateAll((buttons) => buttons.filter((button) => button.getBoundingClientRect().height < 44).length)).toBe(0);

      if (width === 390) {
        const heroHeight = await activeImage.evaluate((element) => element.getBoundingClientRect().height);
        expect(heroHeight / 844).toBeGreaterThanOrEqual(0.55);
        expect(heroHeight / 844).toBeLessThanOrEqual(0.7);

        await page.screenshot({ path: `${evidenceRoot}/${target.slug}-390-initial.png`, fullPage: false });
        const initialSrc = await activeImage.evaluate((image: HTMLImageElement) => image.currentSrc);
        await explorer.getByRole("button", { name: target.firstAction, exact: true }).press("Enter");
        await expect(activeImage).not.toHaveJSProperty("currentSrc", initialSrc);
        await expect(activeImage).toHaveJSProperty("complete", true);
        await page.screenshot({ path: `${evidenceRoot}/${target.slug}-390-after-first-action.png`, fullPage: false });

        const firstSrc = await activeImage.evaluate((image: HTMLImageElement) => image.currentSrc);
        await explorer.getByRole("button", { name: target.resultAction, exact: true }).click();
        await expect(activeImage).not.toHaveJSProperty("currentSrc", firstSrc);
        expect(await activeImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
        await page.screenshot({ path: `${evidenceRoot}/${target.slug}-390-visual-result.png`, fullPage: false });
      }
    }

    expect(requestedSeriesImages.size).toBeGreaterThanOrEqual(3);
  });
}

test("protected production baseline routes keep core shell", async ({ page }) => {
  for (const route of ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(await page.locator("img").evaluateAll((images) => images.filter((image) => {
      const img = image as HTMLImageElement;
      return img.complete && img.naturalWidth === 0;
    }).length)).toBe(0);
  }
});
