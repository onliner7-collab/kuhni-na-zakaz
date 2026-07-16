import { expect, test } from "@playwright/test";

const ROUTES = [
  "/catalog/uglovye-kuhni",
  "/portfolio",
  "/portfolio/kuhnya-japandi-zelenye-fasady-minsk",
  "/prices",
  "/design-proekt-kuhni",
  "/locations/minsk",
] as const;

test.describe("расчёт по изображениям кухонь", () => {
  for (const route of ROUTES) {
    test(`${route} показывает действие на видимых изображениях кухонь`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByTestId("kitchen-image-lead-layer")).toBeAttached();

      let matchedImages = 0;
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const viewportHeight = page.viewportSize()?.height || 800;
      const firstKitchenImageTop = await page.evaluate(() => {
        const image = Array.from(document.querySelectorAll<HTMLImageElement>("main img")).find((candidate) => {
          const rect = candidate.getBoundingClientRect();
          const contentSection = candidate.closest("section, article");
          const source = (candidate.currentSrc || candidate.src).toLowerCase();
          const documentTop = rect.top + window.scrollY;
          if (contentSection?.querySelector("h1") || (source.includes("hero") && documentTop < Math.max(1200, window.innerHeight * 1.5))) return false;
          const alt = candidate.alt.trim().toLowerCase();
          const sourceWords = (candidate.currentSrc || candidate.src).toLowerCase();
          const details = ["материал", "фурнитур", "механизм", "петл", "направляющ", "ящик", "ручк", "образец", "текстур", "кромк", "профиль", "макро", "крупным планом", "фасад", "столешниц", "фартук", "хранен", "техник", "подсвет", "рабочая зон", "рабочая поверх", "мойк", "шкаф", "полк", "внутри", "компоновк", "детал"];
          const detailSources = ["/materials", "furnitur", "fasady-krupno", "facade-detail", "stolesh", "countertop", "yashch", "drawer", "tehnik", "podsvet", "lighting", "hranenie", "mechan", "hardware", "detail", "macro"];
          return rect.width >= 220 && rect.height >= 150 && ["кухн", "гарнитур"].some((word) => alt.includes(word)) && !details.some((word) => alt.includes(word)) && !detailSources.some((word) => sourceWords.includes(word));
        });
        return image ? Math.max(0, Math.round(image.getBoundingClientRect().top + window.scrollY - 100)) : 0;
      });
      const checkpoints = Array.from(new Set([
        ...[0, 0.25, 0.5, 0.75, 1].map((part) => Math.round((pageHeight - viewportHeight) * part)),
        firstKitchenImageTop,
      ]));

      for (const top of checkpoints) {
        await page.evaluate(async (scrollTop) => {
          window.scrollTo({ top: scrollTop, behavior: "instant" });
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        }, top);
        const actions = page.getByRole("button", { name: /Рассчитать эту кухню:/ });
        const actionCount = await actions.count();
        const actionNames = await actions.evaluateAll((items) => items.map((item) => item.getAttribute("aria-label") || ""));
        expect(actionNames.join(" ").toLowerCase()).not.toMatch(/материал|фурнитур|механизм|ящик|фасад|столешниц|хранен|техник|подсвет|рабочая зон|мойк|шкаф|полк|компоновк|детал/);
        const hasOverlap = await page.getByTestId("kitchen-image-action-group").evaluateAll((groups) => {
          const boxes = groups.map((group) => group.getBoundingClientRect());
          return boxes.some((box, index) => boxes.slice(index + 1).some((other) => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top));
        });
        expect(hasOverlap).toBe(false);
        matchedImages += actionCount;
      }

      expect(matchedImages).toBeGreaterThan(0);
    });
  }

  test("не показывает действие на главном hero-изображении", async ({ page }) => {
    const response = await page.goto("/catalog/uglovye-kuhni", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByTestId("kitchen-image-lead-layer")).toBeAttached();

    await expect(page.getByRole("button", { name: /Рассчитать эту кухню: Светлая угловая кухня с серо-бежевыми фасадами/ })).toHaveCount(0);
  });

  test("не показывает действия на материалах и фурнитуре главной страницы", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await page.getByRole("heading", { name: "Посмотрите материалы вблизи" }).scrollIntoViewIfNeeded();

    await expect(page.getByRole("button", { name: /Рассчитать эту кухню:/ })).toHaveCount(0);
  });

  test("показывает компактное действие на реальной кухне главной страницы", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await page.getByTestId("home-portfolio-photo-loop").scrollIntoViewIfNeeded();

    const action = page.getByRole("button", { name: /Рассчитать эту кухню:/ }).first();
    await expect(action).toBeVisible();
    await expect(action).toContainText("Хочу такую");
    const box = await action.boundingBox();
    expect(box?.height).toBeLessThanOrEqual(40);
  });

  for (const route of ["/materials", "/materials/mdf-fasady", "/materials/furnitura"]) {
    test(`${route} не показывает действия расчёта`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByTestId("kitchen-image-lead-layer")).toBeAttached();
      await expect(page.getByRole("button", { name: /Рассчитать эту кухню:/ })).toHaveCount(0);
    });
  }
});
