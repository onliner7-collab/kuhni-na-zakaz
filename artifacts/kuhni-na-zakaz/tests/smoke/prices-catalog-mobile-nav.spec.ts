import { expect, test } from "@playwright/test";

const requiredPriceHeadings = [
  "Сколько стоит купить кухню на заказ в Минске",
  "Цена кухни по форме и планировке",
  "От чего зависит стоимость кухни",
  "Кухни по стилю и бюджету",
  "Кухни на заказ с доставкой и монтажом",
  "Как получить точный расчёт кухни",
] as const;

test.describe("prices visual catalog and mobile navigation", () => {
  test("prices page keeps SEO content, filters and model dialog usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/prices", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Цены на кухни на заказ в Минске" })).toBeVisible();

    for (const heading of requiredPriceHeadings) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Угловые кухни" })).toHaveAttribute("href", "/catalog/uglovye-kuhni");
    await expect(main.getByRole("link", { name: "Материалы для кухни" })).toHaveAttribute("href", "/materials");

    await page.getByLabel("Бюджет").selectOption("4000-7000");
    await expect(page).toHaveURL(/budget=4000-7000/);

    await page.locator("article button").first().click();
    await expect(page.getByRole("dialog", { name: /кухн/i }).first()).toBeVisible();
    await expect(page.getByText("Пример дизайна для расчёта")).toBeVisible();
    await expect(page.getByText("1 / 6").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Короткая форма заявки" })).toBeVisible();

    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() => {
          const dialog = document.querySelector<HTMLElement>("[role='dialog']");
          return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
        }),
      )
      .toBe(true);

    await page.getByRole("button", { name: "Закрыть карточку кухни" }).click();
    await expect(page.locator("[role='dialog']")).toHaveCount(0);
  });

  test("mobile bottom navigation anchors work without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bottomNav = page.getByTestId("mobile-bottom-nav");
    await expect(bottomNav).toBeVisible();

    await bottomNav.getByRole("link", { name: /Подобрать/ }).click();
    await expect(page).toHaveURL(/#selector/);
    await expect(page.locator("#selector")).toBeVisible();

    await bottomNav.getByRole("link", { name: /Проекты/ }).click();
    await expect(page).toHaveURL(/#projects/);
    await expect(page.locator("#projects")).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);

    await page.goto("/prices#calculate", { waitUntil: "domcontentloaded" });
    await expect(bottomNav).toBeVisible();
    await page.locator("#calculate").getByLabel("Имя *").focus();
    await expect(bottomNav).toHaveClass(/opacity-0/);
  });
});
