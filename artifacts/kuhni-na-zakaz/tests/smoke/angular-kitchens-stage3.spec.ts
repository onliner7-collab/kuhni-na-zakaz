import { expect, test } from "@playwright/test";

const PATH = "/catalog/uglovye-kuhni";

test.describe("этап 3 — угловые кухни", () => {
  test("страница, SEO и интерактивные блоки работают", async ({ page }) => {
    const response = await page.goto(PATH, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);

    await expect(page.getByRole("heading", { level: 1, name: "Угловая кухня на заказ под ваши размеры" })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/catalog\/uglovye-kuhni$/);
    await expect(page.getByText("Цифровой шоурум")).toBeVisible();

    const visibleImages = page.locator("main img:visible");
    await expect(visibleImages.first()).toBeVisible();
    const brokenImages = await visibleImages.evaluateAll((images) =>
      images.filter((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth === 0).length,
    );
    expect(brokenImages).toBe(0);

    const angleImage = page.locator("#planning figure img").first();
    const initialAngle = await angleImage.getAttribute("src");
    await page.getByRole("button", { name: "Следующий ракурс" }).click();
    await expect(angleImage).not.toHaveAttribute("src", initialAngle ?? "");

    await page.getByRole("button", { name: /Выдвижная система/ }).click();
    await expect(page.locator("#inside figure img")).toHaveAttribute("src", /inside-pullout/);

    const mechanismImage = page.locator("#mechanism figure img");
    await page.locator("#mechanism-frame").fill("11");
    await expect(mechanismImage).toHaveAttribute("src", /frame-12-landscape\.webp$/);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("мобильный Dock содержит ровно четыре действия по ТЗ", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Проверка относится к мобильной навигации");
    await page.goto(PATH, { waitUntil: "domcontentloaded" });

    const dock = page.locator(".mobile-page-dock");
    await expect(dock).toBeVisible();
    const items = dock.locator("a, button");
    await expect(items).toHaveCount(4);
    await expect(items).toHaveText(["Планировка", "Внутри", "Цена", "Рассчитать"]);
  });

  for (const width of [360, 390, 412, 768]) {
    test(`нет горизонтального переполнения при ширине ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PATH, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
