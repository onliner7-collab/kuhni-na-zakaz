import { expect, test } from "@playwright/test";

const requiredPriceHeadings = [
  "Что входит в стоимость кухни",
  "Стоимость кухонь разных форм и стилей",
  "Сравните комплектации кухни",
  "Сколько стоит кухня: источники и расчёт ориентира",
  "Узнайте стоимость своей кухни",
] as const;

test.describe("prices visual catalog and mobile navigation", () => {
  test("prices page keeps SEO content, filters and model dialog usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/prices", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Цены на кухни на заказ" })).toBeVisible();

    for (const heading of requiredPriceHeadings) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Угловая кухня", exact: true })).toHaveAttribute("href", "/catalog/uglovye-kuhni");
    await expect(main.getByRole("link", { name: "Материалы рабочей зоны" })).toHaveAttribute("href", "/materials");

    await page.getByRole("combobox", { name: "Бюджет за мебель", exact: true }).selectOption("4000-7000");
    await expect(page).toHaveURL(/budget=4000-7000/);

    await page.locator("article button").first().click();
    await expect(page.getByRole("dialog", { name: /кухн/i }).first()).toBeVisible();
    await expect(page.getByText("1 / 4 · Общий вид")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Рассчитать этот вариант", exact: true })).toBeVisible();

    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() => {
          const dialog = document.querySelector<HTMLElement>("dialog");
          return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
        }),
      )
      .toBe(true);

    await page.getByRole("button", { name: "Закрыть пример" }).click();
    await expect(page.locator("dialog")).toHaveCount(0);
  });

  test("mobile bottom navigation anchors work without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bottomNav = page.getByTestId("mobile-bottom-nav");
    await expect(bottomNav).toBeVisible();

    await expect(bottomNav.getByRole("link")).toHaveCount(3);
    await expect(bottomNav.getByRole("link").allTextContents()).resolves.toEqual([
      "Выбрать",
      "Цены",
      "Наши работы",
    ]);
    await expect(bottomNav.getByRole("button", { name: "Оставить заявку" })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);

    await page.goto("/prices#calculate", { waitUntil: "domcontentloaded" });
    await expect(bottomNav).toBeVisible();
    await page.locator("#calculate").getByLabel("Имя *").focus();
    await expect(bottomNav).toHaveClass(/mobile-page-dock--hidden/);
  });
});
