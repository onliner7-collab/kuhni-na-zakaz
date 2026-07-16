import { expect, test } from "@playwright/test";

async function gotoClientReady(page: import("@playwright/test").Page, url: string) {
  const response = await page.goto(url, { waitUntil: "networkidle" });
  expect(response?.ok()).toBeTruthy();
}

function collectBrowserProblems(page: import("@playwright/test").Page) {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    problems.push(`pageerror: ${error.message}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("/kapi/leads")) {
      problems.push(`network: ${response.status()} ${response.url()}`);
    }
  });

  return problems;
}

test.describe("lead collection forms", () => {
  test("homepage lead form submits valid data with tracking fields", async ({ page }) => {
    let requestBody: unknown = null;

    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 101, publicNumber: 1101 }) });
    });

    await gotoClientReady(page, "/?utm_source=playwright&utm_medium=test&utm_campaign=lead-form#form");
    const form = page.getByTestId("contact-form").last();
    await expect(form).toBeVisible();

    await form.getByTestId("form-name").fill("Тестовый клиент");
    await form.getByTestId("form-phone").fill("+375291112233");
    await form.getByTestId("form-city").fill("Минск");
    await form.getByTestId("form-kitchen-type").selectOption("Угловая");
    await form.getByTestId("form-email").fill("client@example.com");
    await form.getByTestId("form-preferred-contact").selectOption("email");
    await form.getByTestId("form-dimensions").fill("3,2 × 2,4 м");
    await form.getByTestId("form-comment").fill("Размер 3,2 м, нужна техника и замер.");
    await form.getByTestId("form-agreement").check();
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
    const submitted = requestBody as Record<string, unknown>;
    expect(submitted).toMatchObject({
      name: "Тестовый клиент",
      phone: "+375 (29) 111-22-33",
      email: "client@example.com",
      preferredContact: "email",
      dimensions: "3,2 × 2,4 м",
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
    await expect(form.locator('input[type="file"]')).toHaveCount(0);
    await expect(form.getByTestId("form-preferred-contact").locator("option")).toHaveText([
      "Позвонить",
      "Telegram",
      "Email",
    ]);
  });

  test("lead form shows client-side validation errors", async ({ page }) => {
    await gotoClientReady(page, "/contacts#form");
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

    await gotoClientReady(page, "/locations/brest?utm_source=city-test#form");
    const form = page.getByTestId("contact-form").last();
    await form.scrollIntoViewIfNeeded();

    await form.getByTestId("form-name").fill("Городской тест");
    await form.getByTestId("form-phone").fill("+375291234567");
    await form.getByTestId("form-comment").fill("Нужен расчет кухни в Бресте.");
    await form.getByTestId("form-agreement").check();
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

  for (const city of ["minsk", "borisov", "gomel"] as const) {
    test(`location form sends tracking fields for ${city}`, async ({ page }) => {
      const problems = collectBrowserProblems(page);
      let requestBody: unknown = null;

      await page.route("**/kapi/leads", async (route) => {
        requestBody = route.request().postDataJSON();
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 120 }) });
      });

      await gotoClientReady(page, `/locations/${city}?utm_source=city-smoke#form`);
      const form = page.getByTestId("contact-form").last();
      await form.scrollIntoViewIfNeeded();

      await form.getByTestId("form-name").fill("Городской smoke");
      await form.getByTestId("form-phone").fill("+375291230000");
      await form.getByTestId("form-comment").fill(`Проверка формы для ${city}.`);
      await form.getByTestId("form-agreement").check();
      await form.getByTestId("form-submit").click();

      await expect(page.getByTestId("form-success")).toBeVisible();
      const submitted = requestBody as Record<string, unknown>;
      expect(submitted).toMatchObject({
        cityKey: city,
        formType: "contact",
        sourceType: "location-region",
        utmSource: "city-smoke",
      });
      expect(String(submitted.sourcePage)).toContain(`/locations/${city}`);
      expect(problems).toEqual([]);
    });
  }

  test("contacts form sends source page without browser errors", async ({ page }) => {
    const problems = collectBrowserProblems(page);
    let requestBody: unknown = null;

    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 121 }) });
    });

    await gotoClientReady(page, "/contacts?utm_source=contacts-smoke#form");
    const form = page.getByTestId("contact-form").first();

    await form.getByTestId("form-name").fill("Контактный smoke");
    await form.getByTestId("form-phone").fill("+375291230001");
    await form.getByTestId("form-city").fill("Минск");
    await form.getByTestId("form-comment").fill("Проверка формы контактов.");
    await form.getByTestId("form-agreement").check();
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
    const submitted = requestBody as Record<string, unknown>;
    expect(submitted).toMatchObject({
      source: "contacts",
      sourceType: "contacts",
      formType: "contact",
      utmSource: "contacts-smoke",
    });
    expect(String(submitted.sourcePage)).toContain("/contacts");
    expect(problems).toEqual([]);
  });

  test("design project CTA submits through lead flow with source and measurements", async ({ page }) => {
    const problems = collectBrowserProblems(page);
    let requestBody: unknown = null;

    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 122 }) });
    });

    await gotoClientReady(page, "/design-proekt-kuhni?utm_source=design-smoke#request");
    await page.locator("#request").scrollIntoViewIfNeeded();
    const form = page.getByTestId("contact-form").last();

    await form.getByTestId("form-name").fill("Тест дизайн-проекта");
    await form.getByTestId("form-phone").fill("+375291230002");
    await form.getByTestId("form-kitchen-type").selectOption("Угловая");
    await form.getByTestId("form-has-measurements").check();
    await form.getByTestId("form-comment").fill("Нужен 3D-проект кухни, размеры помещения уже есть.");
    await form.getByTestId("form-agreement").check();
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toContainText(
      "Спасибо, заявка отправлена. Мы свяжемся с вами для уточнения размеров и пожеланий.",
    );
    const submitted = requestBody as Record<string, unknown>;
    expect(submitted).toMatchObject({
      source: "design-proekt-kuhni",
      sourceType: "design-project",
      sourcePage: "/design-proekt-kuhni",
      kitchenType: "Угловая",
      hasMeasurements: true,
      utmSource: "design-smoke",
    });
    expect(problems).toEqual([]);
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

    await gotoClientReady(page, "/calculator");
    for (let i = 0; i < 7; i += 1) {
      await page.getByTestId("calculator-next").click();
    }
    await page.getByTestId("calculator-submit").click();
    await page.getByTestId("calculator-show-form").click();

    const form = page.getByTestId("contact-form").first();
    await form.getByTestId("form-name").fill("Мобильный тест");
    await form.getByTestId("form-phone").fill("+375291112244");
    await form.getByTestId("form-city").fill("Минск");
    await form.getByTestId("form-agreement").check();
    await form.getByTestId("form-submit").click();

    await expect(page.getByTestId("form-success")).toBeVisible();
  });

  test("kitchen image action opens a short form and sends image context", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    let requestBody: Record<string, unknown> | null = null;
    await page.route("**/kapi/leads", async (route) => {
      requestBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: 130, publicNumber: 1130 }),
      });
    });

    await gotoClientReady(page, "/");
    await page.getByTestId("home-portfolio-photo-loop").getByRole("link").first().scrollIntoViewIfNeeded();
    const action = page.getByRole("button", { name: /Рассчитать эту кухню:/ }).first();
    await expect(action).toBeVisible();
    await action.click();

    const dialog = page.getByRole("dialog", { name: "Рассчитать выбранную кухню" });
    await expect(dialog).toContainText("Именно эта кухня будет прикреплена к заявке");
    await expect(dialog.locator("figure img")).toBeVisible();
    await expect(dialog.locator("figure img")).toHaveAttribute("alt", /кухн/i);
    await expect(dialog.getByRole("checkbox")).not.toBeChecked();
    await dialog.getByLabel("Имя *").fill("Клиент изображения");
    await dialog.getByLabel("Телефон").fill("+375291112255");
    await dialog.getByLabel("Город").fill("Минск");
    await dialog.getByLabel("Примерные размеры").fill("3 × 2 м");
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Отправить без Telegram" }).click();

    await expect(dialog).toContainText("Заявка №1130 сохранена");
    expect(requestBody).toMatchObject({
      name: "Клиент изображения",
      sourceType: "kitchen_gallery",
      continueInTelegram: false,
      preferredContact: "phone",
      city: "Минск",
      dimensions: "3 × 2 м",
    });
    const submittedImageLead = requestBody as Record<string, unknown> | null;
    expect(String(submittedImageLead?.imageUrl)).toBeTruthy();
    expect(String(submittedImageLead?.imageId)).toBeTruthy();
  });

  test("kitchen image can be shared through Telegram fallback", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    });
    await gotoClientReady(page, "/");
    await page.getByTestId("home-portfolio-photo-loop").getByRole("link").first().scrollIntoViewIfNeeded();

    const shareAction = page.getByRole("button", { name: /Поделиться:/ }).first();
    await expect(shareAction).toBeVisible();
    await shareAction.click();

    const dialog = page.getByRole("dialog", { name: "Поделиться кухней" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Отправить в Telegram" })).toHaveAttribute("href", /https:\/\/t\.me\/share\/url/);
    await expect(dialog.getByRole("button", { name: "Скопировать ссылку" })).toBeVisible();
  });
});
