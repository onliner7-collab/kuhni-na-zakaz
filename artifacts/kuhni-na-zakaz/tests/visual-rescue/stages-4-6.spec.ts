import { expect, test } from "@playwright/test";

const evidenceRoot = "../../artifacts/visual-rescue/stages-4-6";
const widths = [390, 360, 412, 768, 1440];

const targets = [
  {
    route: "/materials/mdf-fasady",
    slug: "mdf-fasady",
    role: "material-surface-compare",
    firstAction: "Дневной свет",
    resultAction: "Тёплый свет",
  },
  {
    route: "/catalog/pryamye-kuhni",
    slug: "pryamye-kuhni",
    role: "line-layout-check",
    firstAction: "Компактная",
    resultAction: "Сравнить с угловой",
  },
  {
    route: "/catalog/p-obraznye-kuhni",
    slug: "p-obraznye-kuhni",
    role: "clearance-comparison",
    firstAction: "Открыта техника",
    resultAction: "Готовят вдвоём",
  },
];

for (const target of targets) {
  test(`${target.route}: visual journey and responsive matrix`, async ({ page }) => {
    const imageResponses: string[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "image") imageResponses.push(response.url());
    });

    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 412 ? 844 : width === 768 ? 1024 : 1000 });
      await page.goto(target.route, { waitUntil: "networkidle" });

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${target.route.replaceAll("/", "\\/")}$`));

      const explorer = page.locator(`[data-interaction-role="${target.role}"]`);
      await expect(explorer).toBeVisible();
      const activeImage = explorer.locator("img");
      await expect(activeImage).toBeVisible();
      expect(await activeImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      const shortControls = await explorer.locator("button").evaluateAll((buttons) => buttons.filter((button) => button.getBoundingClientRect().height < 44).map((button) => button.textContent?.trim()));
      expect(shortControls).toEqual([]);

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
        await expect(activeImage).toHaveJSProperty("complete", true);
        await page.screenshot({ path: `${evidenceRoot}/${target.slug}-390-visual-result.png`, fullPage: false });
      }
    }

    expect(new Set(imageResponses.filter((url) => /visual-rescue|mdf-surface/.test(url))).size).toBeGreaterThanOrEqual(3);
  });
}

test("protected production baseline routes keep core shell", async ({ page }) => {
  for (const route of ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const brokenImages = await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).length);
    expect(brokenImages).toBe(0);
  }
});
