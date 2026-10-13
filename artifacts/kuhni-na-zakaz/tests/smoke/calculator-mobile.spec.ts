import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
const evidence = process.env.CALC_EVIDENCE_DIR || "test-results/calculator";
async function mockEstimate(page: Page) {
  await page.route("**/kapi/calculator/estimate", route => route.fulfill({ json: { status: "unpriced", length: 4.2 } }));
}
async function chooseCorner(page: Page) {
  await page.goto("/calculator");
  await page.getByRole("radio", { name: /Угловая/ }).check();
  await page.getByLabel("Сторона А", { exact: true }).fill("2,4");
  await page.getByLabel("Сторона Б", { exact: true }).fill("1.8");
  await expect(page.getByText("Общая длина:")).toContainText("4,2 м");
  await page.getByTestId("calculator-next").click();
  await expect(page.getByRole("heading", { name: "Что вам подходит?" })).toBeVisible();
}
for (const width of [360, 390, 412, 1440]) test(`calculator layout and complete email flow at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await mockEstimate(page);
  let submitted: Record<string, any> | undefined;
  await page.route("**/kapi/leads", async route => { submitted = route.request().postDataJSON(); await route.fulfill({ json: { ok: true, id: 1, publicNumber: 1 } }); });
  await page.goto("/calculator");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kuhni.minsk.by/calculator");
  await expect(page.getByText(/автоматические цены пока не опубликованы/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: path.join(evidence, `initial-${width}.png`), fullPage: true });
  await page.getByTestId("calculator-next").click();
  await expect(page.locator("#calc-error")).toContainText("Укажите сторону А");
  await chooseCorner(page);
  await page.getByRole("radio", { name: /Больше хранения/ }).check();
  await page.getByTestId("calculator-submit").click();
  await expect(page.getByRole("heading", { name: "Параметры кухни готовы" })).toBeVisible();
  await expect(page.locator(".calc-summary")).toContainText("Шкафы до потолка");
  await expect(page.locator(".calc-unpriced")).not.toContainText("0 BYN");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: path.join(evidence, `result-${width}.png`), fullPage: true });
  const form = page.getByRole("form", { name: "Заявка на расчёт кухни" });
  await form.getByLabel("Ваше имя").fill("Тест калькулятора");
  await form.getByRole("button", { name: "Отправить на расчёт" }).click();
  await expect(form.getByText("Укажите телефон или электронную почту. Можно оба.", { exact: true })).toBeVisible();
  await form.getByLabel("Электронная почта", { exact: true }).fill("test@example.invalid");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Отправить на расчёт" }).click();
  await expect(page.getByRole("heading", { name: "Заявка получена" })).toBeVisible();
  expect(submitted?.phone).toBe(""); expect(submitted?.email).toBe("test@example.invalid");
  expect(submitted?.answers.calculator.selection.layout).toBe("corner");
  expect(submitted?.comment).toContain("Шкафы до потолка");
  expect(submitted?.dimensions).toContain("4,2 м");
  for (const image of await page.locator(".calc-examples img").all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
  const images = await page.locator(".calc-examples img").evaluateAll(elements => elements.map(el => ({ loaded: (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0, alt: el.getAttribute("alt") })));
  expect(images).toHaveLength(3); expect(images.every(img => img.loaded && img.alt?.startsWith("Визуализация"))).toBeTruthy();
});
test("examples prefill sides; edits preserve values; request failure is recoverable", async ({ page }) => {
  let attempts = 0;
  await page.route("**/kapi/calculator/estimate", route => { attempts++; return attempts === 1 ? route.fulfill({ status: 503, json: { error: "Попробуйте ещё раз" } }) : route.fulfill({ json: { status: "unpriced", length: 5 } }); });
  await page.goto("/calculator");
  await page.locator(".calc-examples article").filter({ hasText: "Угловая кухня" }).getByRole("button").click();
  await expect(page.getByLabel("Сторона А", { exact: true })).toHaveValue("3");
  await expect(page.getByLabel("Сторона Б", { exact: true })).toHaveValue("2");
  await page.getByTestId("calculator-next").click();
  await page.getByTestId("calculator-submit").click();
  await expect(page.locator("#calc-error")).toContainText("Попробуйте ещё раз");
  await page.getByTestId("calculator-submit").click();
  await page.getByRole("button", { name: "Изменить размеры" }).click();
  await expect(page.getByLabel("Сторона А", { exact: true })).toHaveValue("3");
});
test("configured prices update with a comparison and retain custom options", async ({ page }) => {
  let count = 0;
  await page.route("**/kapi/calculator/estimate", route => { count++; return route.fulfill({ json: { status: "priced", length: 4.2, price: count === 1 ? 4200 : 4800, rate: 1000, version: "meters-v2" } }); });
  await chooseCorner(page); await page.getByTestId("calculator-submit").click();
  await expect(page.locator(".calc-price strong")).toContainText(/4\s200/);
  await page.getByRole("button", { name: "Изменить комплектацию" }).click();
  await page.getByText("Настроить материалы отдельно", { exact: true }).click();
  await page.locator(".calc-custom select").first().selectOption("enamel");
  await page.getByTestId("calculator-submit").click();
  await expect(page.locator(".calc-price")).toContainText("Дороже предыдущего варианта на 600 BYN");
  await expect(page.locator(".calc-summary")).toContainText("МДФ в эмали");
});
for (const mode of ["phone", "both"]) test(`contact form accepts ${mode} and does not send until valid`, async ({ page }) => {
  await mockEstimate(page); let payload: any;
  await page.route("**/kapi/leads", async route => { payload = route.request().postDataJSON(); await route.fulfill({ json: { ok: true } }); });
  await chooseCorner(page); await page.getByTestId("calculator-submit").click();
  const form = page.getByRole("form", { name: "Заявка на расчёт кухни" });
  await form.getByLabel("Ваше имя").fill("Проверка формы");
  await form.getByLabel("Телефон", { exact: true }).fill("123");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Отправить на расчёт" }).click();
  await expect(form.getByRole("alert")).toContainText("Проверьте номер"); expect(payload).toBeUndefined();
  await form.getByLabel("Телефон", { exact: true }).fill("+375291234567");
  if (mode === "both") await form.getByLabel("Электронная почта", { exact: true }).fill("test@example.invalid");
  await form.getByRole("button", { name: "Отправить на расчёт" }).click();
  await expect(page.getByRole("heading", { name: "Заявка получена" })).toBeVisible();
  expect(payload.phone).toBe("+375291234567"); expect(payload.email).toBe(mode === "both" ? "test@example.invalid" : "");
});
