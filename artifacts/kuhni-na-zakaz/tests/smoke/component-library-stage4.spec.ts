import { expect, test } from "@playwright/test";

const widths = [360, 390, 412, 768, 1440];

test.describe("Этап 4 — изолированная библиотека компонентов", () => {
  test("компоненты не переполняют viewport и сохраняют touch targets", async ({ page }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 960 });
      await page.goto("/component-library-preview");
      await expect(page.getByTestId("component-library")).toBeVisible();
      const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(dimensions.scroll).toBe(dimensions.client);

      const undersized = await page.locator("main button, main a").evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).map((element) => element.textContent?.trim() || element.getAttribute("aria-label")));
      expect(undersized).toEqual([]);
    }
  });

  test("обязательные компоненты присутствуют и тяжёлые media монтируются по intent", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/component-library-preview");
    for (const name of ["MobileHero", "ContextDock", "SwipeGallery", "BottomSheet", "DeferredMediaViewer", "CornerStorageExplorer", "ProductionJourney", "HardwareCabinetExplorer", "KitchenLayoutCheck", "MechanismComparison", "HardwarePicker"]) {
      await expect(page.locator(`[data-component="${name}"]`).first()).toBeVisible();
    }
    await expect(page.locator('[data-component="ContextDock"] a')).toHaveCount(4);
    await expect(page.locator('[data-component="DeferredMediaViewer"]')).toHaveAttribute("data-mounted", "false");
    await expect(page.locator('[data-component="DeferredMediaViewer"] img')).toHaveCount(1);
    await page.getByRole("button", { name: "Показать ракурсы по запросу" }).click();
    await expect(page.locator('[data-component="DeferredMediaViewer"]')).toHaveAttribute("data-mounted", "true");
    await expect(page.locator('[data-component="CornerStorageExplorer"] img')).toHaveCount(1);
    await expect(page.locator('[data-component="HardwareCabinetExplorer"] img')).toHaveCount(1);
    expect(await page.locator('[data-component="HardwareCabinetExplorer"] img').count()).toBeLessThan(203);
  });

  test("BottomSheet удерживает и возвращает фокус, закрывается по Escape", async ({ page }) => {
    await page.goto("/component-library-preview");
    const trigger = page.getByRole("button", { name: "Открыть тестовую панель" });
    await trigger.focus();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Параметры для обсуждения" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Закрыть панель" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("reduced motion сохраняет управление", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/component-library-preview");
    const next = page.getByRole("button", { name: "Следующий ракурс" }).first();
    await next.click();
    await expect(page.locator('[data-component="SwipeGallery"]').first().getByText("2 / 2")).toBeVisible();
  });
});
