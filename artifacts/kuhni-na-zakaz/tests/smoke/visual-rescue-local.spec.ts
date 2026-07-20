import { expect, test } from "@playwright/test";

test.describe("visual rescue stages 2–3", () => {
  test("угловая кухня: выбор tab меняет кадр", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/catalog/uglovye-kuhni", { waitUntil: "networkidle" });
    const tab = page.getByRole("tab", { name: "Угол", exact: true });
    await expect(tab).toHaveCount(1);
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#angular-quick-choice-panel img")).toHaveAttribute("src", /angular-corner-types-straight-corner-front/);
  });

  test("Борисов: выбор этапа меняет process frame", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/locations/borisov", { waitUntil: "networkidle" });
    const button = page.locator("#process button").filter({ hasText: "Предварительный расчёт" });
    await expect(button).toHaveCount(1);
    await button.click();
    await expect(page.locator("#process article img")).toHaveAttribute("src", /borisov-process-estimate/);
  });
});
