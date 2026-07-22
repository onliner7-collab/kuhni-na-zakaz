import { expect, test } from "@playwright/test";

const evidenceRoot = "../../artifacts/visual-rescue/stages-7-9";
const widths = [390, 360, 412, 768, 1440];

const targets = [
  {
    route: "/catalog/kuhni-s-ostrovom",
    slug: "kuhni-s-ostrovom",
    role: "island-clearance-planner",
    firstAction: "Подготовка",
    resultAction: "Посадка",
  },
  {
    route: "/catalog/malenkie-kuhni",
    slug: "malenkie-kuhni",
    role: "small-space-trade-off-explorer",
    firstAction: "Столешница",
    resultAction: "Компромисс",
  },
  {
    route: "/catalog/kuhni-do-potolka",
    slug: "kuhni-do-potolka",
    role: "vertical-storage-explorer",
    firstAction: "Ежедневная зона",
    resultAction: "Технический зазор",
  },
];

for (const target of targets) {
  test(`${target.route}: visual journey and responsive matrix`, async ({ page }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 412 ? 844 : width === 768 ? 1024 : 1000 });
      await page.goto(target.route, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${target.route.replaceAll("/", "\\/")}$`));

      const explorer = page.locator(`[data-interaction-role="${target.role}"]`);
      await expect(explorer).toBeVisible();
      const activeImage = explorer.locator("img");
      await expect(activeImage).toBeVisible();
      expect(await activeImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      expect(await explorer.locator("button").count()).toBe(6);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      expect(await explorer.locator("button").evaluateAll((buttons) => buttons.filter((button) => button.getBoundingClientRect().height < 44).length)).toBe(0);

      if (width === 390) {
        await page.screenshot({ path: `${evidenceRoot}/${target.slug}-390-initial.png`, fullPage: false });
        const initialSrc = await activeImage.evaluate((image: HTMLImageElement) => image.currentSrc);
        await explorer.getByRole("button", { name: target.firstAction, exact: true }).click();
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
