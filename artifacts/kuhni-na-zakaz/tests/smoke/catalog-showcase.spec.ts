import { test, expect } from "@playwright/test";
import { catalogModels } from "../../data/catalog-showcase";

for (const width of [320, 390, 768, 1440]) {
  test(`catalog layout and SEO at ${width}`, async ({ page, request }, testInfo) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 960 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/catalog", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("Каталог кухонь на заказ");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kuhni.minsk.by/catalog");
    await expect(page.locator(".catalog-card")).toHaveCount(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const hero = page.locator(".catalog-hero img");
    await expect(hero).toHaveAttribute("src", "/images/catalog-showcase/country-blue.webp");
    expect(await hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    expect((await hero.boundingBox())!.y).toBeLessThan(500);
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.flatMap((node) => { const value = JSON.parse(node.textContent!); return Array.isArray(value) ? value : [value]; }));
    const collection = schemas.find((schema) => schema["@type"] === "CollectionPage");
    expect(collection.mainEntity.numberOfItems).toBe(24);
    expect(schemas.filter((schema) => schema["@type"] === "FAQPage")).toHaveLength(1);
    expect(collection.mainEntity.itemListElement.every((item: { item: { url: string } }) => item.item.url.includes("#model-"))).toBeTruthy();
    for (const image of await page.locator(".catalog-card img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.getByTestId("floating-social-buttons")).toHaveAttribute("data-position", "floating");
    await expect.poll(() => page.getByTestId("floating-social-buttons").locator(":scope > div").evaluateAll((nodes) => nodes.length > 0 && nodes.every((node) => getComputedStyle(node).getPropertyValue("--floating-contact-flight-rotate").trim() === "0deg"))).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`catalog-${width}.png`) });
    expect(errors).toEqual([]);
    if (width === 390) {
      for (const src of [...new Set(catalogModels.flatMap((model) => model.images))]) expect((await request.get(src)).status(), src).toBe(200);
    }
  });
}

test("filters, favourite persistence, compare, gallery and lead payload", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catalog", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Для деревянного дома", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(3);
  const first = page.getByTestId("catalog-model-wood-green");
  await first.getByRole("button", { name: /^Сохранить:/ }).click();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".catalog-card")).toHaveCount(3);
  await expect(first.getByRole("button", { name: /^Убрать из избранного:/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Сбросить", exact: true }).click();
  await page.getByRole("button", { name: /^Фильтры/ }).click();
  await page.getByRole("dialog").getByLabel("Планировка", { exact: true }).selectOption("straight");
  await page.getByRole("dialog").getByRole("button", { name: /^Показать \d+ моделей/ }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(catalogModels.filter((model) => model.layout === "straight").length);
  await page.getByRole("button", { name: "Сбросить", exact: true }).click();
  for (const model of catalogModels.slice(0, 4)) await page.getByTestId(`catalog-model-${model.id}`).getByRole("button", { name: /^Сравнить:/ }).click();
  await expect(page.locator(".catalog-notice")).toContainText("уже три");
  await page.getByRole("button", { name: "Сравнить · 3", exact: true }).click();
  await expect(page.locator(".catalog-comparison > div")).toHaveCount(3);
  await page.keyboard.press("Escape");
  const model = page.getByTestId("catalog-model-scandi-straight-3m");
  await model.getByRole("button", { name: /^Открыть модель:/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Следующий ракурс", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Ракурс 2:/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Рассчитать похожую кухню", exact: true }).click();
  const form = page.locator("#catalog-request form");
  await expect(form.getByTestId("form-kitchen-type")).toHaveValue("Прямая");
  await expect(form.getByTestId("form-dimensions")).toHaveValue(/3/);
  await form.getByTestId("form-submit").click();
  await expect(form.getByTestId("form-name")).toHaveAttribute("aria-invalid", "true");
  await form.getByTestId("form-name").fill("Проверка каталога");
  await form.getByTestId("form-phone").fill("+375291234567");
  await form.getByTestId("form-city").fill("Минск");
  await form.getByTestId("form-agreement").check();
  await form.getByTestId("form-dimensions").fill("3,1 м, высота 2,7 м");
  await page.getByTestId("catalog-model-wood-green").getByRole("button", { name: "Рассчитать похожую", exact: true }).click();
  await expect(form.getByTestId("form-dimensions")).toHaveValue("3,1 м, высота 2,7 м");
  let payload: Record<string, any> | null = null;
  await page.route("**/kapi/leads", async (route) => {
    const body = route.request().postData()!;
    payload = route.request().headers()["content-type"].includes("application/json") ? JSON.parse(body) : JSON.parse(new URLSearchParams(body).get("payload")!);
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
  });
  await form.getByTestId("form-submit").click();
  await expect.poll(() => payload).not.toBeNull();
  expect(payload!.source).toBe("catalog");
  expect(payload!.sourcePage).toContain("/catalog");
  expect(payload!.answers.model).toBe("wood-green");
  expect(payload!.dimensions).toBe("3,1 м, высота 2,7 м");
});

test("all model galleries load every view on mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/catalog", { waitUntil: "networkidle" });
  for (const model of catalogModels) {
    expect(model.images.length, model.id).toBeGreaterThanOrEqual(4);
    const opener = page.getByTestId(`catalog-model-${model.id}`).getByRole("button", { name: /^Открыть модель:/ });
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let view = 0; view < model.images.length; view++) {
      if (model.images.length > 1) await dialog.getByRole("button", { name: new RegExp(`^Ракурс ${view + 1}:`) }).click();
      await expect(dialog.locator(".catalog-detail-image img")).toHaveAttribute("src", model.images[view]);
      await expect.poll(() => dialog.locator(".catalog-detail-image img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      await expect(dialog.locator(".catalog-gallery-caption")).toContainText(`${view + 1} / ${model.images.length}`);
      await expect(dialog.locator(".catalog-muted")).toContainText(
        model.visualization || model.imageVisualizations?.[view]
          ? "не фотография выполненного заказа" : "Фотография кухни");
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    if (["wood-green", "country-blue", "studio-green", "corner-green"].includes(model.id))
      await page.screenshot({ path: testInfo.outputPath(`${model.id}-interior-mobile.png`) });
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
  }
});

test("protected pages retain canonical and one H1", async ({ page }) => {
  for (const path of ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura", "/locations/borisov", "/prices"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://kuhni.minsk.by${path === "/" ? "" : path}`);
  }
});
