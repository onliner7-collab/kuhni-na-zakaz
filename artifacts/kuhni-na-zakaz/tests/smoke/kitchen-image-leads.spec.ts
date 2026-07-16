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

test.describe("расчёт по изображениям кухонь", () => {
  for (const route of ROUTES) {
    test(`${route} показывает действие на видимых изображениях кухонь`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByTestId("kitchen-image-lead-layer")).toBeAttached();

      let matchedImages = 0;
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const viewportHeight = page.viewportSize()?.height || 800;
      const firstKitchenImageTop = await page.evaluate(() => {
        const image = Array.from(document.querySelectorAll<HTMLImageElement>("main img")).find((candidate) => {
          const rect = candidate.getBoundingClientRect();
          const text = `${candidate.alt} ${candidate.currentSrc || candidate.src}`.toLowerCase();
          return rect.width >= 220 && rect.height >= 150 && ["кухн", "kitchen", "kuhn", "portfolio", "портфолио", "interior", "интерьер", "3d"].some((word) => text.includes(word));
        });
        return image ? Math.max(0, Math.round(image.getBoundingClientRect().top + window.scrollY - 100)) : 0;
      });
      const checkpoints = Array.from(new Set([
        ...[0, 0.25, 0.5, 0.75, 1].map((part) => Math.round((pageHeight - viewportHeight) * part)),
        firstKitchenImageTop,
      ]));

      for (const top of checkpoints) {
        await page.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }), top);
        const eligibleCount = await page.evaluate(() => {
          const excludes = ["logo", "логотип", "avatar", "аватар", "map", "карта", "icon", "икон", "review", "отзыв", "person", "человек"];
          const kitchenWords = ["кухн", "kitchen", "kuhn", "portfolio", "портфолио", "interior", "интерьер", "3d"];
          return Array.from(document.querySelectorAll<HTMLImageElement>("main img")).filter((image) => {
            if (image.closest("[data-no-kitchen-lead], header, footer, [role='dialog']")) return false;
            const rect = image.getBoundingClientRect();
            if (rect.width < 220 || rect.height < 150 || rect.bottom < 0 || rect.top > window.innerHeight) return false;
            const text = `${image.alt} ${image.currentSrc || image.src}`.toLowerCase();
            if (excludes.some((word) => text.includes(word))) return false;
            return kitchenWords.some((word) => text.includes(word));
          }).length;
        });
        await expect.poll(
          () => page.getByRole("button", { name: /Рассчитать эту кухню:/ }).count(),
          { message: `Для ${eligibleCount} видимых изображений должны быть действия расчёта` },
        ).toBeGreaterThanOrEqual(eligibleCount);
        matchedImages += eligibleCount;
      }

      expect(matchedImages).toBeGreaterThan(0);
    });
  }
});
