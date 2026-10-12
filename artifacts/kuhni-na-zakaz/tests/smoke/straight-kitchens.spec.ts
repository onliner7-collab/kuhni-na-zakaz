import { test, expect } from "@playwright/test";
const path = "/catalog/pryamye-kuhni";
for (const width of [320, 390, 768, 1440]) {
  test(`straight kitchen visuals, SEO and layout at ${width}`, async ({ page, request }, info) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 960 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#form").getByTestId("form-dimensions")).toHaveValue("Линия 3 м");
    const root = page.getByTestId("straight-kitchen-page");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Прямые кухни на заказ");
    await expect(page).toHaveTitle("Прямые кухни на заказ — по вашим размерам | КухниBY");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://kuhni.minsk.by${path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
    await expect.poll(() => root.locator("img").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    expect((await root.locator("img").first().boundingBox())!.y).toBeLessThan(520);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const planner = page.getByTestId("straight-planner");
    for (const length of ["2", "2,5", "3", "4"]) {
      await planner.getByRole("button", { name: `${length} м`, exact: true }).click();
      await expect(planner.getByRole("img")).toHaveAccessibleName(`Схема прямой кухни длиной ${length} метра`);
      const lengths = await planner.locator("ol li").allTextContents();
      expect(lengths.reduce((sum, text) => sum + Number(text.match(/(\d+) см/)![1]), 0)).toBe(parseFloat(length.replace(",", ".")) * 100);
    }
    const explorer = root.locator('[data-interaction-role="line-layout-check"]');
    for (const button of await explorer.locator("button[data-frame-id]").all()) {
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect.poll(() => explorer.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      const fit = await explorer.locator("img").evaluate((img: HTMLImageElement) => ({ fit: getComputedStyle(img).objectFit, height: img.getBoundingClientRect().height, viewport: window.innerHeight }));
      expect(fit.fit).toBe("contain");
      expect(fit.height).toBeLessThanOrEqual(fit.viewport * 0.6 + 1);
      await expect.poll(() => explorer.locator("img").evaluate(img => { const r = img.getBoundingClientRect(); return r.top >= (window.innerWidth >= 768 ? 160 : 70) && r.bottom <= window.innerHeight; })).toBeTruthy();
      if (width === 390) {
        await page.screenshot({ path: info.outputPath(`fit-${await button.getAttribute("data-frame-id")}-390.png`) });
      }
    }
    const storage = root.locator('[data-interaction-role="straight-storage-choice"]');
    await expect(storage.locator("button[data-frame-id]")).toHaveCount(4);
    for (const button of await storage.locator("button[data-frame-id]").all()) {
      const id = await button.getAttribute("data-frame-id");
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(storage.locator("img")).toHaveAttribute("src", `/images/straight-kitchens/generated/storage-${id}.webp`);
      await expect.poll(() => storage.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      expect(await storage.locator("img").evaluate(img => getComputedStyle(img).objectFit)).toBe("contain");
      await expect.poll(() => storage.locator("img").evaluate(img => { const r = img.getBoundingClientRect(); return r.top >= (window.innerWidth >= 768 ? 160 : 70) && r.bottom <= window.innerHeight; })).toBeTruthy();
      if (width === 390) {
        await page.screenshot({ path: info.outputPath(`storage-${id}-390.png`) });
      }
    }
    for (const img of await root.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      expect(await img.getAttribute("alt")).toMatch(/[А-Яа-я]/);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => { const value = JSON.parse(node.textContent!); return Array.isArray(value) ? value : [value]; }));
    const faq = schemas.find(schema => schema["@type"] === "FAQPage");
    expect(faq.mainEntity).toHaveLength(6);
    expect(schemas.some(schema => schema["@type"] === "CollectionPage" && schema.url.endsWith(path))).toBeTruthy();
    for (const item of faq.mainEntity) {
      await expect(root.getByText(item.name, { exact: true })).toBeVisible();
      expect(await root.textContent()).toContain(item.acceptedAnswer.text);
    }
    await planner.getByRole("button", { name: "3 м", exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`straight-${width}.png`) });
    expect(errors).toEqual([]);
    if (width === 390) {
      const links = [...new Set(await root.locator('a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!)))];
      for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
      for (const src of ["/images/straight-kitchens/generated/straight-hero.webp", "/images/straight-kitchens/generated/straight-storage.webp"]) {
        expect((await request.get(src)).status()).toBe(200);
        expect((await request.get(`/kapi/watermarked-image?src=${encodeURIComponent(src)}`)).status()).toBe(200);
      }
    }
  });
}
test("length and visual choice reach lead; edited dimensions stay; submission intercepted", async ({ page }) => {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#form").getByTestId("form-dimensions")).toHaveValue("Линия 3 м");
  const planner = page.getByTestId("straight-planner");
  await planner.getByRole("button", { name: "4 м", exact: true }).click();
  const form = page.locator("#form form");
  await expect(form.getByTestId("form-dimensions")).toHaveValue("Линия 4 м");
  await form.getByTestId("form-dimensions").fill("Стена 3,8 м, высота 2,6 м");
  await planner.getByRole("button", { name: "2,5 м", exact: true }).click();
  await expect(form.getByTestId("form-dimensions")).toHaveValue("Стена 3,8 м, высота 2,6 м");
  await page.getByRole("button", { name: "Рабочая зона", exact: true }).click();
  await form.getByTestId("form-submit").click();
  await expect(form.getByTestId("form-name")).toHaveAttribute("aria-invalid", "true");
  await form.getByTestId("form-name").fill("Проверка прямой кухни");
  await form.getByTestId("form-phone").fill("+375291234567");
  await form.getByTestId("form-city").fill("Жодино");
  await form.getByTestId("form-agreement").check();
  let payload: any;
  await page.route("**/kapi/leads", async route => { const request = route.request(); const body = request.postData()!; payload = request.headers()["content-type"].includes("application/json") ? JSON.parse(body) : JSON.parse(new URLSearchParams(body).get("payload")!); await route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }); });
  await form.getByTestId("form-submit").click();
  await expect.poll(() => payload).toBeTruthy();
  expect(payload.sourcePage).toBe(path);
  expect(payload.sourceType).toBe("catalog-straight");
  expect(payload.kitchenType).toBe("Прямая");
  expect(payload.dimensions).toBe("Стена 3,8 м, высота 2,6 м");
  expect(payload.answers.selectedLength).toBe("2,5");
  expect(payload.answers.selectedOption).toBe("Рабочая зона");
});
