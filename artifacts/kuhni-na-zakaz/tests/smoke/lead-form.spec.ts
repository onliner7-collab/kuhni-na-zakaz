import { expect, test } from "@playwright/test";

test.describe("lead collection forms", () => {
  test("homepage lead form submits valid data with tracking fields", async ({ page }) => {
    let requestBody: unknown = null;

    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 101 }) });
    });

    await page.goto("/?utm_source=playwright&utm_medium=test&utm_campaign=lead-form#form");
    await page.locator("#form").scrollIntoViewIfNeeded();
    const form = page.getByTestId("contact-form").last();

    await form.getByTestId("form-name").fill("Тестовый клиент");
    await form.getByTestId("form-phone").fill("+375291112233");
    await form.getByTestId("form-city").fill("Минск");
    await form.getByTestId("form-kitchen-type").selectOption("Угловая");
    await form.getByTestId("form-comment").fill("Размер 3,2 м, нужна техника и замер.");
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
    const submitted = requestBody as Record<string, unknown>;
    expect(submitted).toMatchObject({
      name: "Тестовый клиент",
      phone: "+375291112233",
      city: "Минск",
      kitchenType: "Угловая",
      source: "home",
      formType: "contact",
      sourceType: "home",
      utmSource: "playwright",
      utmMedium: "test",
      utmCampaign: "lead-form",
    });
    expect(String(submitted.sourcePage)).toContain("utm_source=playwright");
  });

  test("lead form shows client-side validation errors", async ({ page }) => {
    await page.goto("/contacts#form");
    const form = page.getByTestId("contact-form").first();

    await form.getByTestId("form-name").fill("A");
    await form.getByTestId("form-phone").fill("12");
    await form.getByTestId("form-agreement").uncheck();
    await form.getByTestId("form-submit").click();

    await expect(form.getByText("Введите имя")).toBeVisible();
    await expect(form.getByText("Введите корректный номер")).toBeVisible();
    await expect(form.getByText("Подтвердите согласие на обработку данных")).toBeVisible();
  });

  test("location page passes city slug and source page", async ({ page }) => {
    let requestBody: unknown = null;

    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 102 }) });
    });

    await page.goto("/locations/brest?utm_source=city-test#form");
    await page.locator("#form").scrollIntoViewIfNeeded();
    const form = page.getByTestId("contact-form").last();

    await form.getByTestId("form-name").fill("Городской тест");
    await form.getByTestId("form-phone").fill("+375291234567");
    await form.getByTestId("form-comment").fill("Нужен расчет кухни в Бресте.");
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
    const submitted = requestBody as Record<string, unknown>;
    expect(submitted).toMatchObject({
      source: "location-brest",
      sourceType: "location-region",
      cityKey: "brest",
      formType: "contact",
      utmSource: "city-test",
    });
    expect(String(submitted.sourcePage)).toContain("/locations/brest");
    expect(String(submitted.city)).toBeTruthy();
  });

  test("calculator result form submits on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.route("**/kapi/calculator", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          priceFrom: 3200,
          priceTo: 4800,
          priceCenter: 4000,
          area: 3,
          factors: [{ label: "Тестовый расчет", impact: "neutral" }],
        }),
      });
    });

    await page.route("**/kapi/leads", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 103 }) });
    });

    await page.goto("/calculator");
    for (let i = 0; i < 7; i += 1) {
      await page.getByTestId("calculator-next").click();
    }
    await page.getByTestId("calculator-submit").click();
    await page.getByTestId("calculator-show-form").click();

    const form = page.getByTestId("contact-form").first();
    await form.getByTestId("form-name").fill("Мобильный тест");
    await form.getByTestId("form-phone").fill("+375291112244");
    await form.getByTestId("form-city").fill("Минск");
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
  });
});
