import { expect, test } from "@playwright/test";

test.describe("materials gallery", () => {
  test("shows tabbed material close-up gallery with accessible images and links", async ({ page }) => {
    const response = await page.goto("/materials", { waitUntil: "load" });
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");

    const section = page.getByRole("heading", { name: "Посмотрите материалы крупным планом" }).locator("..").locator("..");
    await expect(page.getByRole("heading", { name: "Посмотрите материалы крупным планом" })).toBeVisible();

    await expect(section.getByRole("tab")).toHaveCount(5);
    await expect(section.getByRole("tab", { name: "МДФ эмаль" })).toHaveAttribute("aria-selected", "true");

    const firstActiveImage = section.getByRole("button", { name: /Открыть изображение материала МДФ эмаль/ }).locator("img");
    await expect(firstActiveImage).toHaveAttribute("alt", /МДФ эмаль/);

    await section.getByRole("tab", { name: "Акрил" }).click();
    await expect(section.getByRole("tab", { name: "Акрил" })).toHaveAttribute("aria-selected", "true");
    await expect(section.getByRole("heading", { name: "Акрил" })).toBeVisible();

    const activeAcrylicImage = section.getByRole("button", { name: /Открыть изображение материала Акрил/ }).locator("img");
    await expect(activeAcrylicImage).toHaveAttribute("alt", /акрил/i);

    await expect(section.locator("img[alt]").filter({ hasText: "" })).toHaveCount(5);
    await expect(section.getByRole("link", { name: /Читать гид/ })).toHaveAttribute("href", "/materials/akril");
    await expect(section.getByRole("link", { name: /Получить консультацию/ })).toHaveAttribute("href", "#form");

    await section.getByRole("button", { name: /Открыть изображение материала Акрил/ }).click();
    await expect(page.getByRole("dialog", { name: /Увеличенный просмотр материала Акрил/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /Увеличенный просмотр материала Акрил/ })).toBeHidden();
  });
});
