import { expect, test } from "@playwright/test";
import { regionalLocations } from "../../data/locations";
import { STYLE_FAMILY, SCENARIO_FAMILY } from "../../data/exploration-families";

const routes = [...new Set([
  "/", "/catalog", "/prices", "/locations/minsk",
  "/catalog/uglovye-kuhni", "/catalog/pryamye-kuhni", "/catalog/p-obraznye-kuhni",
  "/catalog/kuhni-s-ostrovom", "/catalog/malenkie-kuhni", "/catalog/kuhni-do-potolka",
  "/catalog/kuhni-bez-ruchek", "/materials/shpon",
  "/design-proekt-kuhni", "/locations/minskaya-oblast", "/materials/furnitura",
  "/styles/neoklassika", "/scenarios/dlya-semi", "/locations/borisov",
  "/about", "/materials/ldsp", "/materials/mdf-fasady", "/materials/plastik-hpl",
  "/materials/akril", "/materials/mdf-emal",
  ...regionalLocations.map(city => `/locations/${city.slug}`),
  ...Object.keys(STYLE_FAMILY).map(slug => `/styles/${slug}`),
  ...Object.keys(SCENARIO_FAMILY).map(slug => `/scenarios/${slug}`),
])];

for (const route of routes) {
  test(`${route}: метаданные, заголовок и мобильная вёрстка`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: "load" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).href).toBe(new URL(route, "https://kuhni.minsk.by").href);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(title.length).toBeGreaterThan(10);
    expect(description?.length).toBeGreaterThan(40);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).not.toMatch(/noindex/i);
    if (route === "/" || route === "/prices" || route.startsWith("/catalog/")) {
      expect(title).not.toMatch(/Минск/i);
      expect(description).not.toMatch(/Минск/i);
      expect(await page.locator("h1").innerText()).not.toMatch(/Минск/i);
    }
    if (route === "/") {
      expect(await page.locator("h1").innerText()).toContain("Купить кухню на заказ");
      expect(title.match(/КухниBY/g)?.length).toBe(1);
    }
    if (route === "/locations/minsk") {
      expect(title).toMatch(/Купить кухню.*Минске/);
      expect(await page.locator("h1").innerText()).toContain("Минске");
    }
    expect(await page.locator("body").innerText()).not.toMatch(/Действуй как эксперт|Для запроса «|AI-запросы/);
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    const broken = await page.locator("img").evaluateAll(images => (images as HTMLImageElement[]).filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > 0 && image.complete && image.naturalWidth === 0;
    }).map(image => image.getAttribute("src")));
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
    if (route === "/" || route === "/locations/minsk") {
      await test.info().attach("Первый экран", { body: await page.screenshot(), contentType: "image/png" });
    }
  });
}

test("Мобильная заявка открывается и закрывается без отправки", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "Мобильный интерфейс");
  await page.goto("/", { waitUntil: "load" });
  const trigger = page.getByTestId("dock-lead");
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
