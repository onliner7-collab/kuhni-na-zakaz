# Telegram integration — audit report

Ветка: `work`. Дата: 2026-05-13. Код **не менялся**, это только аналитика и план.

## 1. Карта существующих файлов

| Слой | Путь | Что делает |
|---|---|---|
| Prisma model | `prisma/schema.prisma` (модель `TelegramRecipient`, строки ~373–379; плюс `SiteSettings.telegramBotToken/telegramChatId` ~367–368) | Хранилище получателей и токена бота. |
| Lib | `lib/telegram.ts` | `sendLeadNotifications(lead)`, `testTelegramMessage(token, chatId)`, билд HTML-сообщения, обработка ошибок Telegram API. |
| API (список + add + test + saveToken) | `app/kapi/admin/notifications/telegram/route.ts` | `GET` — список получателей и токен; `POST` — три ветки по `_action` + добавление. |
| API (toggle + delete) | `app/kapi/admin/notifications/telegram/[id]/route.ts` | `PATCH { active }` и `DELETE`. |
| Админ-UI | `app/admin/notifications/page.tsx` | Токен бота, список, добавить/удалить/toggle, тестовая отправка. |
| Триггер отправки | `app/kapi/leads/route.ts` (строка 112) | После `prisma.lead.create` вызывает `sendLeadNotifications(lead)` в `.catch` (не блокирует ответ). |
| Меню админки | `components/admin/AdminSidebar.tsx` (строка 46) | Пункт «Уведомления Telegram» → `/admin/notifications`. |
| Дубль настроек (наследие) | `components/admin/SettingsForm.tsx` + `app/kapi/admin/settings/route.ts` | Поля `telegramBotToken/telegramChatId` ещё есть в общей форме настроек, но `GET /kapi/admin/settings` маскирует их пустыми строками. |
| ENV | `.env.example` | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_IDS` (через запятую) — используются как fallback в `lib/telegram.ts`. |

> Каталог `prisma/migrations/` **отсутствует** — схема разворачивается через `prisma db push`. Это влияет на план миграций (см. раздел 6).

## 2. Текущая логика (как работает сейчас)

1. Менеджер заходит в `/admin/notifications` (`SUPER_ADMIN`-only).
2. Сохраняет токен → `POST { _action: "saveBotToken" }` → пишется в `SiteSettings.telegramBotToken`.
3. Добавляет получателя (`label`, `chatId`) → `POST` без `_action` → запись в `TelegramRecipient` (уникальность `chatId` проверяется **на уровне приложения**, не в БД).
4. Toggle / удалить → `PATCH/DELETE /telegram/[id]`.
5. Тест → `POST { _action: "test", botToken, chatId }` → `testTelegramMessage` шлёт HTML-сообщение, не пишет в БД.
6. Любая заявка через `POST /kapi/leads`:
   - создаёт `Lead`,
   - вызывает `sendLeadNotifications(lead)`:
     - читает `SiteSettings` и активных `TelegramRecipient`,
     - **мёржит** их с `process.env.TELEGRAM_CHAT_IDS`,
     - токен берёт из `process.env.TELEGRAM_BOT_TOKEN` **или** из `SiteSettings.telegramBotToken`,
     - шлёт всем через `Promise.allSettled` (отвал одного получателя не валит остальных),
   - ошибки логируются в `console.error`, ответ клиенту всегда `{ ok: true, id }`.

## 3. Что уже реализовано

| Функция | Статус | Где |
|---|---|---|
| Добавление получателя | OK | `POST /telegram` |
| Удаление | OK | `DELETE /telegram/[id]` |
| Вкл./выкл. (`active`) | OK | `PATCH /telegram/[id]` |
| Тестовая отправка | OK | `POST /telegram { _action: "test" }` |
| Отправка по заявкам | OK | `lib/telegram.ts → sendLeadNotifications` |
| Хранение токена бота | OK | `SiteSettings.telegramBotToken` + env fallback |

## 4. Пробелы относительно ТЗ

| Пробел | Где сейчас не покрыт | Что нужно добавить |
|---|---|---|
| Нет редактирования получателя | `PATCH /telegram/[id]` принимает только `{ active }` | Расширить до `{ label?, chatId?, role?, active? }`, все поля опциональные. |
| Нет поля `role` | `TelegramRecipient` в `schema.prisma` | Добавить `role String @default("")` (мягко, не enum — иначе блокирует существующие записи). |
| Нет `updatedAt` | `TelegramRecipient` | Добавить `updatedAt DateTime @updatedAt`. |
| Нет `@unique chatId` | `chatId String` без ограничения | Добавить `@unique`. Перед этим — снять дубликаты. |
| Нет журнала отправок | Только `console.error` | Новая модель `TelegramMessageLog` + запись из `sendLeadNotifications`/`sendMessage`. |
| Нет входящего webhook | `app/kapi/telegram/webhook/route.ts` отсутствует | Создать `POST` с проверкой `X-Telegram-Bot-Api-Secret-Token`. |
| Нет сохранения входящих | — | Новая модель `TelegramIncomingMessage` + запись из webhook. |

## 5. Список файлов на изменение (план без кода)

### 5.1. Схема и БД
- `prisma/schema.prisma`
  - `TelegramRecipient`: + `role String @default("")`, + `updatedAt DateTime @updatedAt`, + `@unique` на `chatId`.
  - Новая модель `TelegramMessageLog` (поля-ориентир: `id`, `recipientId?`, `chatId`, `leadId?`, `kind` `"lead" | "test" | "broadcast"`, `status` `"ok" | "error"`, `error?`, `payload Json`, `createdAt`).
  - Новая модель `TelegramIncomingMessage` (поля-ориентир: `id`, `updateId Int @unique`, `chatId`, `fromUsername?`, `fromName?`, `text?`, `raw Json`, `createdAt`).

### 5.2. Lib
- `lib/telegram.ts`
  - Вынести низкоуровневый `sendMessage` так, чтобы он умел писать в `TelegramMessageLog` (через `.catch` — лог не должен валить отправку).
  - `sendLeadNotifications`: дополнительно прокидывать `leadId` в лог.
  - `testTelegramMessage`: тоже пишет в лог (kind = `"test"`).
  - **Не менять** контракт функций (сигнатуры и поведение для существующих вызовов) — иначе сломается `app/kapi/leads/route.ts`.

### 5.3. API админки
- `app/kapi/admin/notifications/telegram/route.ts`
  - `addSchema`: + `role: z.string().max(50).optional().default("")`.
  - При проверке дубликата `chatId` — оставить app-level проверку **и** ловить ошибку `P2002` (уникальный индекс БД).
- `app/kapi/admin/notifications/telegram/[id]/route.ts`
  - Расширить `PATCH`: принимать любую комбинацию `{ label?, chatId?, role?, active? }`, валидировать zod, обрабатывать `P2002`.

### 5.4. Новые роуты
- `app/kapi/telegram/webhook/route.ts` — `POST`:
  - Валидация заголовка `X-Telegram-Bot-Api-Secret-Token` (значение из `process.env.TELEGRAM_WEBHOOK_SECRET`).
  - Идемпотентность по `update_id` (уникальный индекс).
  - Запись в `TelegramIncomingMessage`.
  - На «неизвестные» апдейты — `200 OK`, чтобы Telegram не зацикливался.
- `app/kapi/admin/notifications/telegram/logs/route.ts` — `GET` (read-only, `SUPER_ADMIN`), пагинация.
- `app/kapi/admin/notifications/telegram/incoming/route.ts` — `GET` (read-only, `SUPER_ADMIN`), пагинация.

### 5.5. Админ-UI
- `app/admin/notifications/page.tsx`
  - Добавить «карандаш» / inline-форму редактирования: `label`, `chatId`, `role`.
  - Поле «Роль» в форме добавления (рядом с label).
  - (Опционально, шаг 7) — вкладки «Журнал отправок» и «Входящие сообщения».

### 5.6. Конфиги
- `.env.example` — + `TELEGRAM_WEBHOOK_SECRET=`.
- `project-docs/HANDOFF.md` — короткая заметка про webhook (URL + секрет).

## 6. Риски (что может сломать существующую отправку)

1. **Нет каталога `prisma/migrations/`.** Схема катится через `db push`. Любое поле без default или жёсткий `@unique` на «грязной» таблице — упадёт. **Митигация:**
   - перед добавлением `@unique chatId` — `SELECT "chatId", count(*) FROM "TelegramRecipient" GROUP BY 1 HAVING count(*) > 1;` и чистка;
   - `role` — только `String @default("")`, без enum;
   - `updatedAt` — с дефолтом `@updatedAt` (Prisma проставит, но на больших таблицах PG может потребоваться `BACKFILL` отдельным шагом).

2. **`PATCH /telegram/[id]` сейчас принимает только `{ active }`.** Если ввести строгий zod без `optional`, фронтовский toggle сломается. **Митигация:** все новые поля — `.optional()`, поведение по `{ active }` оставить идентичным.

3. **Запись в `TelegramMessageLog` внутри `sendLeadNotifications`.** Любая ошибка БД при логировании не должна валить отправку и тем более не должна валить `POST /kapi/leads`. **Митигация:** все вызовы лога — через `.catch(() => {})`, лог пишется **после** попытки отправки.

4. **Открытый webhook.** Без проверки `X-Telegram-Bot-Api-Secret-Token` злоумышленник сможет лить мусор в `TelegramIncomingMessage`. **Митигация:** обязательный секрет + rate-limit (можно переиспользовать паттерн из `app/kapi/leads/route.ts`).

5. **Дубль настроек в `SettingsForm.tsx`.** Поля `telegramBotToken/telegramChatId` ещё есть в общей форме настроек. Если этой формой `POST`-ом отправить пустые значения — затрётся токен, и заявки перестанут уходить. **Митигация:** на этом этапе **не трогать** форму, только зафиксировать как известный долг. Чистка — отдельной задачей после деплоя нового UI.

6. **Fallback `process.env.TELEGRAM_CHAT_IDS`.** `lib/telegram.ts` мёржит env-получателей с БД. Их нет в админке и в журнале по `recipientId` они не приклеятся. **Митигация:** в логе хранить `chatId` обязательно, `recipientId` — `null` для env-получателей. Сам fallback пока сохраняем.

7. **Введение `role` как enum в Prisma.** На существующих строках падает `db push`. **Митигация:** ввести `role` как `String` (значения, например, `"director" | "manager" | "support" | ""`), валидировать на уровне zod в API, без миграции enum.

8. **Уникальный индекс `chatId` и текущая `findFirst`-проверка.** После добавления `@unique` повторное добавление будет валиться с `P2002` — это надо корректно ловить в `POST`/`PATCH` и возвращать 400 «уже добавлен», иначе фронт получит 500.

## 7. Безопасный порядок внедрения

Каждый шаг — обратно совместимый, проверяется отдельно, не ломает `POST /kapi/leads`.

1. **Шаг 1. Подготовка БД.** SQL-проверка дублей `chatId`, чистка вручную.
2. **Шаг 2. Расширение схемы (только аддитивно):** `role`, `updatedAt`, `@unique chatId`, новые модели `TelegramMessageLog`, `TelegramIncomingMessage`. `db push`. Дымовой тест: создать заявку → лид падает, уведомление уходит.
3. **Шаг 3. Бэкенд-расширения без UI:**
   - `addSchema` + `role`;
   - `PATCH` поддерживает все поля (опционально);
   - `sendMessage`/`sendLeadNotifications` пишут в `TelegramMessageLog` через `try/catch`.
   - Регрессионный тест: создать лид → есть запись в `TelegramMessageLog`, есть сообщение в Telegram.
4. **Шаг 4. UI редактирования.** На странице админки добавить inline-edit и поле `role`. UI продолжает посылать `PATCH { active }` для тоггла — это работает как раньше.
5. **Шаг 5. Webhook.**
   - Создать `app/kapi/telegram/webhook/route.ts` с секретом.
   - Зарегистрировать webhook в Telegram (`setWebhook`) — это **разовая операция вручную**, в коде её делать не нужно.
   - Регрессионный тест: написать боту → запись в `TelegramIncomingMessage`, заявки продолжают уходить.
6. **Шаг 6. Read-only страницы журнала и входящих.** Только GET-эндпоинты + страницы в админке. Отправка не затрагивается.
7. **Шаг 7 (по желанию, отдельной задачей).** Почистить дубль `telegramBotToken/telegramChatId` из `SettingsForm.tsx` / `app/kapi/admin/settings/route.ts`. Делать только когда новый UI обкатан в проде.

## 8. Краткий чеклист «не сломать заявки»

- [ ] Перед `db push` снять дубли `chatId`.
- [ ] `role` — `String @default("")`, без enum.
- [ ] Все новые поля в zod — `.optional()`.
- [ ] Запись в `TelegramMessageLog` — всегда в `try/catch`/`.catch(() => {})`.
- [ ] В `POST/PATCH` ловить `P2002` и возвращать 400, а не 500.
- [ ] Webhook — обязательная проверка `X-Telegram-Bot-Api-Secret-Token`.
- [ ] `SettingsForm.tsx` — не трогать на этом этапе.
- [ ] Fallback `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_IDS` сохраняем.
- [ ] Smoke-тест после каждого шага: `POST /kapi/leads` с тестовыми данными → сообщение приходит в Telegram, в БД есть `Lead` и (после шага 3) запись в `TelegramMessageLog`.
