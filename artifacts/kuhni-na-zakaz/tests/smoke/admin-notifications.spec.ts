import { expect, test, type Page } from "@playwright/test";

// Сценарии Telegram-админки на /admin/notifications.
//
// Стратегия:
// - Логинимся как SUPER_ADMIN реальным запросом к /kapi/auth/login (нужно,
//   потому что middleware валидирует JWT-cookie). Если в БД нет seed-аккаунта,
//   тесты, требующие авторизации, скипаются с понятным сообщением.
// - Все остальные API получателей и тестовая отправка мокаются через
//   page.route, чтобы НИ ОДНО реальное сообщение в Telegram не уходило и
//   тесты были детерминированными.
// - Один негативный сценарий «доступа нет» проверяет, что без сессии
//   middleware редиректит на /admin/login.

// Дефолтные креды совпадают с тем, что сейчас в локальной БД проекта
// (см. prisma/seed.ts; e-mail исторически обновлялся). Их можно переопределить
// через переменные окружения TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD, если в БД
// другой SUPER_ADMIN. Если логин не получится — beforeEach пропустит тесты.
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@kuhniminsk.by";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "Admin123!";

interface MockRecipient {
  id: number;
  label: string;
  chatId: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface MockState {
  recipients: MockRecipient[];
  botToken: string;
  testResponse: () => { ok: boolean; error?: string };
}

function createState(initial?: Partial<MockState>): MockState {
  return {
    recipients: initial?.recipients ?? [],
    botToken: initial?.botToken ?? "",
    testResponse: initial?.testResponse ?? (() => ({ ok: true })),
  };
}

async function installNotificationsMocks(page: Page, state: MockState) {
  await page.route("**/kapi/admin/notifications/telegram", async (route) => {
    const req = route.request();

    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          recipients: state.recipients,
          botToken: state.botToken,
        }),
      });
      return;
    }

    if (req.method() === "POST") {
      const body = (req.postDataJSON() ?? {}) as Record<string, unknown>;

      if (body._action === "saveBotToken") {
        state.botToken =
          typeof body.botToken === "string" ? body.botToken.trim() : "";
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
        return;
      }

      if (body._action === "test") {
        const result = state.testResponse();
        await route.fulfill({
          status: result.ok ? 200 : 400,
          contentType: "application/json",
          body: JSON.stringify(result),
        });
        return;
      }

      const chatId = String(body.chatId ?? "").trim();
      if (state.recipients.some((r) => r.chatId === chatId)) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "Этот Chat ID уже добавлен" }),
        });
        return;
      }
      const created: MockRecipient = {
        id: 100 + state.recipients.length + 1,
        label: typeof body.label === "string" ? body.label : "",
        chatId,
        role:
          typeof body.role === "string" && body.role
            ? body.role
            : "moderator",
        active: true,
        createdAt: new Date().toISOString(),
      };
      state.recipients.push(created);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
      return;
    }

    await route.fallback();
  });

  await page.route(
    /\/kapi\/admin\/notifications\/telegram\/\d+(?:\?.*)?$/,
    async (route) => {
      const req = route.request();
      const match = req.url().match(/\/telegram\/(\d+)/);
      const id = match ? Number(match[1]) : NaN;
      const idx = state.recipients.findIndex((r) => r.id === id);

      if (req.method() === "PATCH") {
        if (idx === -1) {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: "not found" }),
          });
          return;
        }
        const body = (req.postDataJSON() ?? {}) as Record<string, unknown>;
        const updated: MockRecipient = {
          ...state.recipients[idx],
          ...("label" in body ? { label: String(body.label ?? "") } : {}),
          ...("chatId" in body ? { chatId: String(body.chatId ?? "") } : {}),
          ...("role" in body ? { role: String(body.role ?? "") } : {}),
          ...("active" in body ? { active: Boolean(body.active) } : {}),
          updatedAt: new Date().toISOString(),
        };
        state.recipients[idx] = updated;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(updated),
        });
        return;
      }

      if (req.method() === "DELETE") {
        if (idx === -1) {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: "not found" }),
          });
          return;
        }
        state.recipients.splice(idx, 1);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
        return;
      }

      await route.fallback();
    },
  );
}

async function tryLoginAsSuperAdmin(page: Page): Promise<boolean> {
  const res = await page.request.post("/kapi/auth/login", {
    data: { login: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    headers: { "Content-Type": "application/json" },
    failOnStatusCode: false,
  });
  return res.ok();
}

function toast(page: Page, text: string | RegExp) {
  return page.locator("[data-sonner-toast]").filter({ hasText: text });
}

test.describe("admin notifications: access control", () => {
  test("unauthenticated visit redirects to /admin/login", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    await page.goto("/admin/notifications", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/admin\/login(\?|$)/);
    await expect(page.getByTestId("login-form")).toBeVisible();
  });
});

test.describe("admin notifications: UI flows", () => {
  test.beforeEach(async ({ page }) => {
    const ok = await tryLoginAsSuperAdmin(page);
    test.skip(
      !ok,
      "SUPER_ADMIN not seeded in DB; set TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD or run `pnpm db:seed`.",
    );
  });

  test("add recipient: validates empty and non-numeric chatId", async ({
    page,
  }) => {
    const state = createState({ botToken: "fake-bot-token" });
    await installNotificationsMocks(page, state);

    await page.goto("/admin/notifications");
    await expect(
      page.getByRole("heading", { name: "Telegram-уведомления" }),
    ).toBeVisible();

    const addBtn = page.getByRole("button", {
      name: "Добавить получателя уведомлений",
    });
    const chatIdInput = page.locator("#new-chat-id");

    await addBtn.click();
    await expect(toast(page, "Введите Chat ID")).toBeVisible();

    await chatIdInput.fill("abc123");
    await expect(chatIdInput).toHaveAttribute("aria-invalid", "true");
    await addBtn.click();
    await expect(toast(page, "Некорректный Chat ID")).toBeVisible();

    expect(state.recipients).toHaveLength(0);
  });

  test("add recipient: valid chatId is added to the list", async ({ page }) => {
    const state = createState({ botToken: "fake-bot-token" });
    await installNotificationsMocks(page, state);

    await page.goto("/admin/notifications");
    await page.locator("#new-label").fill("Менеджер тест");
    await page.locator("#new-role").fill("manager");
    await page.locator("#new-chat-id").fill("123456789");
    await page
      .getByRole("button", { name: "Добавить получателя уведомлений" })
      .click();

    await expect(toast(page, "Получатель добавлен")).toBeVisible();
    await expect(page.getByText("Менеджер тест")).toBeVisible();
    await expect(page.getByText("Chat ID: 123456789")).toBeVisible();

    expect(state.recipients).toHaveLength(1);
    expect(state.recipients[0]).toMatchObject({
      chatId: "123456789",
      label: "Менеджер тест",
      role: "manager",
    });
  });

  test("edit recipient: open edit mode, change label, role and active flag", async ({
    page,
  }) => {
    const state = createState({
      botToken: "fake-bot-token",
      recipients: [
        {
          id: 5,
          label: "Стар Имя",
          chatId: "987654321",
          role: "owner",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    await installNotificationsMocks(page, state);

    await page.goto("/admin/notifications");

    await page
      .getByRole("button", { name: "Редактировать получателя Стар Имя" })
      .click();

    const labelInput = page.locator("#edit-label-5");
    const roleInput = page.locator("#edit-role-5");
    const chatIdInput = page.locator("#edit-chatid-5");

    await expect(labelInput).toBeVisible();
    await expect(chatIdInput).toHaveValue("987654321");

    await labelInput.fill("Новое имя");
    await roleInput.fill("manager");
    await page.getByLabel(/Активен.*уведомления/).uncheck();
    await page
      .getByRole("button", { name: "Сохранить изменения получателя" })
      .click();

    await expect(toast(page, "Получатель обновлён")).toBeVisible();
    await expect(page.getByText("Новое имя")).toBeVisible();
    await expect(page.getByText("отключён")).toBeVisible();

    expect(state.recipients[0]).toMatchObject({
      id: 5,
      label: "Новое имя",
      role: "manager",
      active: false,
    });
  });

  test("delete recipient: confirm dialog is shown and entry disappears", async ({
    page,
  }) => {
    const state = createState({
      botToken: "fake-bot-token",
      recipients: [
        {
          id: 7,
          label: "Удаляемый",
          chatId: "-100123",
          role: "moderator",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    await installNotificationsMocks(page, state);

    await page.goto("/admin/notifications");
    await expect(page.getByText("Chat ID: -100123")).toBeVisible();

    let dialogMessage: string | null = null;
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await page
      .getByRole("button", { name: "Удалить получателя Удаляемый" })
      .click();

    await expect(toast(page, "Получатель удалён")).toBeVisible();
    expect(dialogMessage).toContain("Удалить получателя");
    await expect(page.getByText("Chat ID: -100123")).toHaveCount(0);
    expect(state.recipients).toHaveLength(0);
  });

  test("test send: button exists and API failure surfaces in a toast", async ({
    page,
  }) => {
    const state = createState({ botToken: "fake-bot-token" });
    state.testResponse = () => ({ ok: false, error: "chat not found" });
    await installNotificationsMocks(page, state);

    await page.goto("/admin/notifications");

    const testBtn = page.getByRole("button", {
      name: "Отправить тестовое сообщение на указанный Chat ID",
    });
    await expect(testBtn).toBeVisible();
    await expect(testBtn).toBeEnabled();

    await page.locator("#test-chat-id").fill("123456789");
    await testBtn.click();

    await expect(toast(page, /Не удалось отправить сообщение/)).toBeVisible();
  });
});
