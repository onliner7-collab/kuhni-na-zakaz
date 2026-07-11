import { expect, test } from "@playwright/test";

const representativeRoutes = [
  { path: "/", labels: ["Каталог", "Цены", "Портфолио", "Заявка"] },
  { path: "/catalog", labels: ["Типы", "Цены", "Материалы", "Заявка"] },
  { path: "/catalog/uglovye-kuhni", labels: ["Фото", "Цена", "Материалы", "Заявка"] },
  { path: "/locations", labels: ["Города", "Цены", "Каталог", "Заявка"] },
  { path: "/locations/minsk", labels: ["Замер", "Цены", "Каталог", "Заявка"] },
  { path: "/materials", labels: ["Фактуры", "Цены", "Каталог", "Заявка"] },
  { path: "/materials/akril", labels: ["Фактуры", "Цены", "Каталог", "Заявка"] },
  { path: "/styles", labels: ["Стили", "Материалы", "Цены", "Заявка"] },
  { path: "/styles/minimalizm", labels: ["Примеры", "Цены", "Материалы", "Расчёт"] },
  { path: "/portfolio", labels: ["Фильтр", "Каталог", "Цены", "Заявка"] },
  { path: "/scenarios", labels: ["Сценарии", "Каталог", "Цены", "Заявка"] },
  { path: "/scenarios/s-ostrovom", labels: ["Решение", "Каталог", "Цены", "Заявка"] },
  { path: "/blog", labels: ["Статьи", "Каталог", "Цены", "Заявка"] },
  { path: "/calculator", labels: ["Расчёт", "Цены", "Каталог", "Заявка"] },
  { path: "/about", labels: ["О компании", "Отзывы", "Портфолио", "Заявка"] },
  { path: "/reviews", labels: ["О компании", "Отзывы", "Портфолио", "Заявка"] },
  { path: "/warranty", labels: ["О компании", "Отзывы", "Портфолио", "Заявка"] },
  { path: "/delivery-installation", labels: ["О компании", "Отзывы", "Портфолио", "Заявка"] },
  { path: "/contacts", labels: ["О компании", "Отзывы", "Портфолио", "Заявка"] },
] as const;

test.describe("SEO stages 7-9", () => {
  test("representative page types render four contextual mobile actions without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of representativeRoutes) {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), route.path).toBe(200);

      const dock = page.getByTestId("mobile-bottom-nav");
      await expect(dock, route.path).toBeVisible();
      await expect(dock.getByRole("button"), route.path).toHaveCount(4);
      await expect(dock.getByRole("button").allTextContents(), route.path).resolves.toEqual([...route.labels]);

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(hasOverflow, route.path).toBe(false);
    }
  });

  test("portfolio exposes material and budget filters with touch-sized controls", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/portfolio", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("group", { name: "Материал" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Бюджет" })).toBeVisible();

    const materialButton = page.getByRole("button", { name: "МДФ", exact: true });
    const budgetButton = page.getByRole("button", { name: "4 000–7 000 BYN", exact: true });
    await expect(materialButton).toHaveCSS("min-height", "40px");
    await expect(budgetButton).toHaveCSS("min-height", "40px");
    await materialButton.click();
    await budgetButton.click();
    await expect(materialButton).toHaveAttribute("aria-pressed", "true");
    await expect(budgetButton).toHaveAttribute("aria-pressed", "true");
  });

  test("dock is hidden on desktop and respects reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/materials/akril", { waitUntil: "domcontentloaded" });

    const dock = page.getByTestId("mobile-bottom-nav");
    await expect(dock).toBeVisible();
    const transitionDuration = await dock.locator(".mobile-page-dock__icon").first().evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(["0s", "0.00001s", "1e-05s"]).toContain(transitionDuration);

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(dock).toBeHidden();
  });
});
