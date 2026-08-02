import { expect, test } from "@playwright/test";

import { furnituraGalleryRegistry } from "@/lib/furnitura-gallery-registry";

const rawActions = [
  "PARENT",
  "DEEPEN",
  "COMPARE",
  "PROOF",
  "CROSS_FAMILY",
  "CONVERT",
  "SUPPORT",
];

const galleryItems = furnituraGalleryRegistry.filter((item) => item.type !== "hero");
const galleryHeadings = new Set(
  galleryItems.flatMap((item) => [item.stage ?? "Базовая фурнитура", item.title]),
);

test.describe("корректирующая приёмка этапа 4", () => {
  for (const route of [
    "/styles/minimalizm",
    "/scenarios/dlya-malenkoy-kuhni",
  ]) {
    test(`${route}: только русские пользовательские метки`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      const visibleText = await page.locator("main").last().innerText();
      for (const action of rawActions) {
        expect(visibleText).not.toMatch(new RegExp(`\\b${action}\\b`));
      }
      expect(visibleText).not.toMatch(/\bAI\b|fallback|style_variants/i);
      await expect(page.locator("[data-transition]")).toHaveCount(4);
      await expect(page.getByText("Изучить подробнее", { exact: true })).toBeVisible();
      await expect(page.getByText("Перейти к расчёту", { exact: true }).first()).toBeVisible();
    });
  }

  test("галерея фурнитуры раскрывается порциями и сохраняет общий порядок", async ({ page }) => {
    test.setTimeout(120_000);
    const response = await page.goto("/materials/furnitura", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");

    const gallery = page.locator("[data-furnitura-gallery]");
    const images = gallery.locator("[data-furnitura-image-index]");
    await expect(images).toHaveCount(15);
    expect(await page.locator("img").count()).toBeLessThanOrEqual(25);
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await expect(gallery.locator("h3, h4")).toHaveCount(galleryHeadings.size);

    while (await page.getByRole("button", { name: /^Показать ещё/ }).count()) {
      const before = await images.count();
      await page
        .getByRole("button", { name: /^Показать ещё/ })
        .evaluate((button: HTMLButtonElement) => button.click());
      await expect.poll(() => images.count()).toBeGreaterThan(before);
    }

    await expect(images).toHaveCount(galleryItems.length);
    await expect(page.getByText(`Показаны все ${galleryItems.length} изображений`)).toBeVisible();

    await images.last().evaluate((button: HTMLButtonElement) => button.click());
    const dialog = page.getByRole("dialog", { name: "Галерея фурнитуры для кухни на заказ" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`${galleryItems.length} / ${galleryItems.length}`, { exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Следующее фото" }).click();
    await expect(dialog.getByText(`1 / ${galleryItems.length}`, { exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Закрыть галерею" }).click();
    await expect(dialog).toHaveCount(0);
  });

  for (const width of [360, 390, 412]) {
    test(`галерея фурнитуры помещается в ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/materials/furnitura", { waitUntil: "domcontentloaded" });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
      ).toBe(false);
      await expect(page.locator("[data-furnitura-image-index]")).toHaveCount(15);
      const showMore = page.getByRole("button", { name: /^Показать ещё/ });
      const box = await showMore.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    });
  }
});
