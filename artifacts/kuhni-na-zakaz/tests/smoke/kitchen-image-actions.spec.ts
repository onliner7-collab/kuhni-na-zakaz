import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/catalog/uglovye-kuhni",
  "/portfolio",
  "/portfolio/kuhnya-japandi-zelenye-fasady-minsk",
  "/prices",
  "/design-proekt-kuhni",
  "/locations/minsk",
] as const;

test.describe("кнопки на изображениях кухонь", () => {
  for (const route of ROUTES) {
    test(`${route} не показывает кнопки Хочу такую и Поделиться`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();

      await expect(page.getByRole("button", { name: /Рассчитать эту кухню:/ })).toHaveCount(0);
      await expect(page.getByRole("button", { name: /Поделиться:/ })).toHaveCount(0);
    });
  }
});
