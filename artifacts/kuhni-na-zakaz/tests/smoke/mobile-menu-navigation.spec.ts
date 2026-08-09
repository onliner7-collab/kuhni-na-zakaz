import { expect, test } from "@playwright/test";

test("мобильное меню закрывается после выбора страницы", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const menuButton = page.getByTestId("mobile-menu-btn");
  const menuPanel = page.getByTestId("mobile-card-nav-panel");
  await menuButton.click();
  await expect(menuPanel).toBeVisible();

  await menuPanel.getByRole("link", { name: "Стили", exact: true }).click();

  await expect(page).toHaveURL(/\/styles$/);
  await expect(menuPanel).toBeHidden();
  expect(await menuButton.evaluate((element) => element.closest("details")?.hasAttribute("open"))).toBe(false);
});
