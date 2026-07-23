import { expect, test } from "@playwright/test";

for (const width of [390, 412]) {
  test(`угловая карточка не перекрывает текст при ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/catalog/uglovye-kuhni", { waitUntil: "networkidle" });

    const panel = page.locator("#angular-quick-choice-panel");
    const image = panel.locator("img");
    const caption = panel.locator("figcaption");
    const heading = panel.locator("h3");

    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    await expect(caption).toHaveText("Сгенерированная визуализация — не фотография готовой кухни.");
    await expect(heading).toBeVisible();

    const captionBox = await caption.boundingBox();
    const headingBox = await heading.boundingBox();
    expect(captionBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect((captionBox?.y ?? 0) + (captionBox?.height ?? 0)).toBeLessThanOrEqual(headingBox?.y ?? 0);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}

test("главная показывает пользовательское название перехода", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const selector = page.locator("#selector");
  await expect(selector.getByRole("link", { name: "Посмотреть такие кухни" })).toHaveAttribute("href", "/catalog/uglovye-kuhni");
  await expect(page.getByText("SEO-страница категории", { exact: true })).toHaveCount(0);
});
