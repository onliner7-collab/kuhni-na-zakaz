import { expect, test } from "@playwright/test";

const pilots = [
  {
    path: "/catalog/uglovye-kuhni",
    h1: "Угловые кухни на заказ",
    dock: ["Планировка", "Внутри", "Цена", "Рассчитать"],
  },
  {
    path: "/locations/borisov",
    h1: "Кухни на заказ в Борисове: от идеи до монтажа",
    dock: ["Виды", "Процесс", "Стоимость", "Замер"],
  },
  {
    path: "/materials/furnitura",
    h1: "Фурнитура для кухни на заказ",
    dock: ["Механизмы", "Сравнить", "Комплектация", "Подобрать"],
  },
] as const;

test.describe("этап 6 — три пилота", () => {
  for (const pilot of pilots) {
    test(`${pilot.path}: HTML, SEO, изображения и responsive`, async ({ page }) => {
      const response = await page.goto(pilot.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByRole("heading", { level: 1, name: pilot.h1 })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${pilot.path}$`));

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      const brokenImages = await page.locator("main img:visible").evaluateAll((images) =>
        images.filter((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth === 0).length,
      );
      expect(brokenImages).toBe(0);
    });

    test(`${pilot.path}: мобильный Dock уникален и содержит четыре действия`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "Проверка относится к мобильной навигации");
      await page.goto(pilot.path, { waitUntil: "domcontentloaded" });
      const items = page.locator(".mobile-page-dock").locator("a, button");
      await expect(items).toHaveCount(4);
      await expect(items).toHaveText([...pilot.dock]);
    });
  }

  for (const width of [360, 390, 412, 768]) {
    test(`все пилоты без горизонтального переполнения при ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const pilot of pilots) {
        await page.goto(pilot.path, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, pilot.path).toBeLessThanOrEqual(1);
      }
    });
  }

  test("Борисов: процесс и выбор работают, фиктивный шоурум не заявлен", async ({ page }) => {
    await page.goto("/locations/borisov", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: /Производство/ }).click();
    await expect(page.getByText("Готовим детали и собираем корпуса")).toBeVisible();
    await page.getByRole("button", { name: "Угловая", exact: true }).click();
    await expect(page.getByText(/Угловая · Современный/)).toBeVisible();
    await expect(page.getByText(/нет подтверждённых проектов|Только с подтверждённым городом/).first()).toBeVisible();
    await expect(page.getByText(/шоурум/i)).toHaveCount(1);
  });

  test("Фурнитура: hotspots, сравнение и мини-подбор работают", async ({ page }) => {
    await page.goto("/materials/furnitura", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Направляющая/ }).first().click();
    await expect(page.getByText("Направляющая определяет доступ к ящику")).toBeVisible();
    await page.getByRole("button", { name: /Распашные верхние фасады мешают/ }).click();
    await expect(page.getByText(/подъёмники для верхних шкафов/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Частичное или полное выдвижение" })).toBeVisible();
  });
});
