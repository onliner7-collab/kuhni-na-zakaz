import { expect, test } from "@playwright/test";

const PATH = "/catalog/uglovye-kuhni";
const widths = [360, 390, 412, 768, 1440];

test.describe("этап 5 — интерактивная страница угловых кухонь", () => {
  test("серверный HTML, SEO и зарегистрированные изображения корректны", async ({ page }) => {
    const response = await page.goto(PATH, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Угловые кухни на заказ" })).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/catalog\/uglovye-kuhni$/);
    await expect(page.getByRole("navigation", { name: "Хлебные крошки" })).toBeVisible();
    const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.map((node) => node.textContent || "").join("\n"));
    expect(jsonLd).toContain("BreadcrumbList");
    expect(jsonLd).not.toContain("FAQPage");
    await expect(page.getByText("AI-концепт для выбора решения", { exact: false })).toBeVisible();

    await page.locator("#materials").scrollIntoViewIfNeeded();
    const images = page.locator("main img");
    const broken = await images.evaluateAll((nodes) => nodes.filter((node) => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth === 0;
    }).map((node) => (node as HTMLImageElement).src));
    expect(broken).toEqual([]);
    const sources = await images.evaluateAll((nodes) => nodes.map((node) => (node as HTMLImageElement).currentSrc || (node as HTMLImageElement).src));
    expect(sources.every((src) => !/\.png(?:\?|$)/.test(src))).toBe(true);
  });

  test("gallery, explorer, comparison, layout and material selection work", async ({ page }) => {
    await page.goto(PATH, { waitUntil: "domcontentloaded" });
    const gallery = page.locator('[data-component="SwipeGallery"]');
    await expect(gallery.getByText("1 / 5")).toBeVisible();
    await gallery.getByRole("button", { name: "Следующий ракурс" }).click();
    await expect(gallery.getByText("2 / 5")).toBeVisible();

    await page.getByRole("tab", { name: "Мойка в углу" }).click();
    await expect(page.locator("#corner-type-panel img")).toHaveAttribute("src", /sink-corner/);
    const explorer = page.locator('[data-component="CornerStorageExplorer"]');
    await explorer.getByRole("button", { name: "Следующее положение механизма" }).click();
    await expect(explorer.getByText("Кадр 2 из 12")).toBeVisible();
    await page.locator('[data-component="MechanismComparison"]').getByRole("button", { name: "Карусель" }).click();
    await expect(page.locator('[data-component="MechanismComparison"] img')).toHaveAttribute("src", /storage-carousel/);
    await page.getByLabel("Первая стена, см").fill("310");
    await page.getByLabel("Вторая стена, см").fill("210");
    await page.getByLabel("Окно").selectOption({ label: "на первой стене" });
    await page.getByRole("button", { name: "Приглушённый зелёный" }).click();
    await expect(page.locator("#materials figure img")).toHaveAttribute("src", /materials-green/);
  });

  test("BottomSheet closes with Escape and restores focus", async ({ page }) => {
    await page.goto(PATH);
    const trigger = page.getByRole("button", { name: "Посмотреть выбранные параметры" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Ваш предварительный выбор" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Закрыть панель" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("structured selection is sent to the existing lead API", async ({ page }) => {
    let requestBody = "";
    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postData() || "";
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    });
    await page.goto(PATH);
    await page.getByRole("tab", { name: "Мойка в углу" }).click();
    await page.locator('[data-component="MechanismComparison"]').getByRole("button", { name: "Карусель" }).click();
    await page.getByRole("button", { name: "Графитовый" }).click();
    await page.getByLabel("Первая стена, см").fill("320");
    await page.locator("#calculate").scrollIntoViewIfNeeded();
    await page.getByLabel("Имя").fill("Тест Этап Пять");
    await page.getByLabel("Телефон").fill("+375291112233");
    await page.getByRole("button", { name: "Рассчитать угловую кухню" }).click();
    await expect(page.getByText("Заявка отправлена", { exact: false })).toBeVisible();
    expect(requestBody).toContain("selectedCornerType");
    expect(requestBody).toContain("sink");
    expect(requestBody).toContain("selectedMechanism");
    expect(requestBody).toContain("carousel");
    expect(requestBody).toContain("selectedMaterial");
    expect(requestBody).toContain("graphite");
    expect(requestBody).toContain("wallOneLength");
  });

  test("mobile Dock has four exact actions", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Проверка относится к мобильной навигации");
    await page.goto(PATH, { waitUntil: "domcontentloaded" });
    const dock = page.locator(".mobile-page-dock");
    await expect(dock).toBeVisible();
    await expect(dock.locator("button")).toHaveCount(4);
    await expect(dock.locator("button")).toHaveText(["Планировка", "Внутри", "Цена", "Рассчитать"]);
  });

  test("responsive matrix has no overflow or undersized page controls", async ({ page }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 960 });
      await page.goto(PATH, { waitUntil: "domcontentloaded" });
      const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(dimensions.scroll).toBe(dimensions.client);
      const undersized = await page.locator("main button, main a").evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).map((element) => element.textContent?.trim() || element.getAttribute("aria-label")));
      expect(undersized).toEqual([]);
    }
  });

  test("reduced motion keeps discrete controls", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PATH);
    const explorer = page.locator('[data-component="CornerStorageExplorer"]');
    await explorer.getByRole("button", { name: "Следующее положение механизма" }).click();
    await expect(explorer.getByText("Кадр 2 из 12")).toBeVisible();
  });
});
