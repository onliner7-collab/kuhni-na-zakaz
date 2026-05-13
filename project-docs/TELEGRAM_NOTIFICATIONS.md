# Telegram-уведомления и webhook — настройка

Инструкция для разработчика и админа: как поднять интеграцию с Telegram-ботом
(уведомления о заявках + входящие сообщения через webhook).

> Документ описывает только настройку. Сам код живёт в:
>
> - `artifacts/kuhni-na-zakaz/lib/telegram.ts` — отправка сообщений и уведомлений по заявкам.
> - `artifacts/kuhni-na-zakaz/app/kapi/telegram/webhook/route.ts` — входящий webhook.
> - `artifacts/kuhni-na-zakaz/app/admin/notifications/` — админ-UI получателей и журнала.

В примерах ниже **никогда** не вставляйте реальные токены и секреты — это просто
шаблоны. Реальные значения должны лежать только в `.env` на сервере / в секретах
CI и **никогда** в репозитории.

---

## 1. Переменные окружения

Минимальный набор для работы Telegram-интеграции:

| Переменная | Где используется | Обязательная |
|---|---|---|
| `DATABASE_URL` | Prisma — получатели, журнал, входящие сообщения. | Да |
| `TELEGRAM_BOT_TOKEN` | Fallback-токен бота, если он не сохранён в админке. | Опционально (см. §2) |
| `TELEGRAM_WEBHOOK_SECRET` | Секрет, которым подписаны входящие апдейты от Telegram. | Да в проде |

> Переменная `TELEGRAM_CHAT_IDS` **больше не используется** (удалена на этапе 9,
> 2026-05-13). Получатели уведомлений управляются исключительно через
> `/admin/notifications`. Если в `.env` на сервере осталась старая запись —
> её можно удалить, никакого эффекта на код она больше не оказывает.

Шаблон лежит в `artifacts/kuhni-na-zakaz/.env.example`. Скопируйте его в `.env`
и заполните локальные значения:

```bash
cp artifacts/kuhni-na-zakaz/.env.example artifacts/kuhni-na-zakaz/.env
```

Важно про `TELEGRAM_WEBHOOK_SECRET`:

- Если переменная **пустая**, проверка секрета в `/kapi/telegram/webhook`
  **отключена** — это допустимо только для локальной разработки.
- В проде переменная **должна быть заполнена**. Значение — случайная строка
  (например, `openssl rand -hex 32`).
- Допустимы только символы `A-Z`, `a-z`, `0-9`, `_`, `-` (требование Telegram
  Bot API для `secret_token`).

---

## 2. Приоритет токена бота

`lib/telegram.ts` и `app/kapi/telegram/webhook/route.ts` берут токен в таком
порядке:

1. **`process.env.TELEGRAM_BOT_TOKEN`** — если задан и не пустой, используется
   он. Это удобно для CI и серверного окружения, где токен лежит в секретах.
2. **`SiteSettings.telegramBotToken`** — если env пустой, читается значение,
   сохранённое в админке (`/admin/notifications`, секция «Токен бота»).

Если оба значения пустые — отправка молча пропускается и в лог пишется
предупреждение `[TELEGRAM] Bot token is not configured`. Заявка всё равно
сохраняется в БД и `POST /kapi/leads` отвечает `{ ok: true }`.

Чтобы быстро переключить токен на новый, можно либо изменить env и
перезапустить процесс, либо вписать новый токен прямо в админке — рестарт не
нужен.

---

## 3. Как установить webhook

После того как `.env` заполнен и сервер развёрнут на публичном HTTPS-домене,
надо один раз зарегистрировать webhook в Telegram.

**Рекомендованный вариант** — секрет передаётся в заголовке
`X-Telegram-Bot-Api-Secret-Token` через параметр `secret_token`:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<DOMAIN>/kapi/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
```

**Альтернативный вариант** — секрет в query-параметре `?secret=` (поддерживается
нашим роутом для curl-проверок и резервного сценария):

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<DOMAIN>/kapi/telegram/webhook?secret=<TELEGRAM_WEBHOOK_SECRET>
```

> Внимание: если открыть такую ссылку «как есть» в браузере, Telegram посчитает
> второй `?` разделителем своих собственных параметров, и в итоге наш роут
> получит запрос **без** `?secret=`. Поэтому при ручном вызове значение `url=`
> нужно URL-encode'ить — либо просто использовать curl, который сделает это
> сам:
>
> ```bash
> curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
>   --data-urlencode "url=https://${DOMAIN}/kapi/telegram/webhook?secret=${TELEGRAM_WEBHOOK_SECRET}"
> ```

Замените плейсхолдеры:

- `<TELEGRAM_BOT_TOKEN>` — токен из `@BotFather` (не коммитить).
- `<DOMAIN>` — публичный домен сайта, например `kuhni.minsk.by`.
- `<TELEGRAM_WEBHOOK_SECRET>` — то же значение, что в `.env`.

Удобно вызывать через curl:

```bash
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  --data-urlencode "url=https://${DOMAIN}/kapi/telegram/webhook" \
  --data-urlencode "secret_token=${TELEGRAM_WEBHOOK_SECRET}"
```

Telegram ответит `{"ok":true,"result":true,"description":"Webhook was set"}`.

Проверка текущего состояния:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

В ответе `url` должен совпадать с `https://<DOMAIN>/kapi/telegram/webhook`,
`pending_update_count` — небольшим (быстро рассасывается),
`last_error_message` — пустым.

> Предпочитайте `secret_token` (заголовок). Тогда секрет не уходит в URL и не
> попадает в логи прокси/CDN. Query-параметр `?secret=` оставлен для удобства
> локальных проверок и резервного сценария.

---

## 4. Как удалить webhook

Если нужно временно отключить интеграцию, перенести бота на другой домен или
отдать его другому боту — вызовите `deleteWebhook`:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/deleteWebhook
```

То же самое через curl:

```bash
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook"
```

После этого Telegram перестанет слать апдейты на наш `/kapi/telegram/webhook`.
Отправка уведомлений по заявкам **продолжит работать** — она не зависит от
webhook, это отдельный поток (наш сервер → Telegram, а не наоборот).

---

## 5. Как проверить, что всё работает

Это быстрый smoke-чеклист после `setWebhook`:

1. **Добавить активного получателя.**
   Зайти в `/admin/notifications` → «Получатели» → ввести `Telegram Chat ID` и
   нажать «Сохранить». Получатель должен быть отмечен как активный.
   - Свой `chatId` можно узнать, написав сначала боту любое сообщение, а потом
     открыв `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates` —
     там будет `message.chat.id`.
2. **Открыть бота в Telegram** (по имени, выданному `@BotFather`).
3. **Нажать `/start`** — это обязательный шаг, см. §6.
4. **Написать любое тестовое сообщение** боту, например «test».
5. **Проверить, что активные получатели его получили.** Все, у кого
   `TelegramRecipient.active = true`, должны увидеть форвард сообщения от бота.
6. **Проверить журнал отправок.** Открыть `/admin/notifications/logs` — должны
   появиться записи со статусом `sent` (или `failed` с понятной ошибкой) и
   ссылкой на получателя.
7. **Проверить уведомления о заявке.** Отправить тестовую заявку с сайта (любая
   форма). В Telegram должно прийти сообщение «Новая заявка #N …»,
   в `/admin/notifications/logs` — соответствующая запись с `leadId`.

Если что-то не пришло:

- `getWebhookInfo` — смотреть `last_error_message`.
- Серверные логи — ищем `[TELEGRAM]` и `[TELEGRAM WEBHOOK]`.
- `/admin/notifications/logs` — поле `errorMessage` у неуспешной отправки.

---

## 6. Важное ограничение Telegram API

**Бот не может первым написать пользователю.** Это ограничение самого Telegram,
а не нашей реализации.

Из этого следует:

- Чтобы пользователь (менеджер, директор, и т.п.) **получал** уведомления о
  заявках или форварды из webhook, он сначала **сам** должен:
  - открыть бота по ссылке,
  - нажать `/start` (или просто написать боту любое сообщение).
- До этого шага Telegram будет отвечать `403 Forbidden: bot can't initiate
  conversation with a user` — в нашем журнале это превратится в `failed` с
  понятным текстом ошибки.
- Если пользователь нажмёт «Заблокировать бота», бот тоже перестанет ему
  доставлять сообщения. В журнале появится `bot was blocked by the user`.

Поэтому в чеклисте онбординга нового получателя обязательный пункт — «открыть
бота и нажать Start». Без него никакая правка `chatId` в админке не поможет.

---

## 7. Безопасность

- **Никогда** не коммитьте реальные значения `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_WEBHOOK_SECRET`, `DATABASE_URL`. В репозитории должны лежать только
  шаблоны (`.env.example`) с пустыми значениями.
- Если токен/секрет утёк — сразу:
  1. в `@BotFather` командой `/revoke` инвалидировать токен и сгенерировать новый;
  2. сгенерировать новый `TELEGRAM_WEBHOOK_SECRET`;
  3. обновить `.env` на сервере, перезапустить процесс;
  4. ещё раз вызвать `setWebhook` с новыми значениями.
- Webhook-роут отвечает `200 OK` даже на «неинтересные» апдейты — это нужно,
  чтобы Telegram не зацикливался на ретраях. Поэтому отсутствие реакции в чате
  ещё не значит, что webhook не работает: смотрите журнал и серверные логи.

---

## 8. Известное ограничение хостинга (Timeweb VPS, 2026-05-13)

На текущем VPS `5.42.108.140` (Timeweb) **точечно заблокированы исходящие
соединения на ряд IP-адресов Telegram**. Это сетевое ограничение со стороны
провайдера/upstream'а, **не наша конфигурация**.

### Симптомы

- В UI `/admin/notifications` кнопка «Отправить тест» всегда возвращает toast
  «Не удалось отправить сообщение. Проверьте, что пользователь уже запускал
  бота, Chat ID указан верно и бот не заблокирован.» — это общая защитная
  формулировка из `formatTelegramError`, когда fetch к Telegram упал по
  таймауту/connect-error и нет конкретного API-ответа.
- В журнале сервиса (`journalctl -u kuhni-na-zakaz`) появляются строки
  `[TELEGRAM] sendMessage failed` и/или `fetch failed (ETIMEDOUT)`.
- `getWebhookInfo`, `setWebhook`, `sendMessage` через `curl` с сервера —
  висят по таймауту (`curl: (28) Connection timed out after 10s`).
- При этом общий интернет с сервера работает (`curl https://www.google.com`
  отвечает мгновенно).

### Доказательства (snapshot 2026-05-13)

```text
curl https://1.1.1.1/         → 200 (0.07s)
curl https://www.google.com/  → 200 (0.14s)
curl https://api.telegram.org → TIMEOUT 10s

Telegram IPs (TCP/443):
  149.154.166.110  → TIMEOUT     (это IP, который отдаёт DNS первым)
  91.108.4.5       → TIMEOUT
  91.108.56.135    → TIMEOUT
  149.154.167.220  → OPEN        (один из DC всё-таки пропускается)
```

Через рабочий IP `149.154.167.220`:

```bash
curl --resolve api.telegram.org:443:149.154.167.220 \
  "https://api.telegram.org/bot<TOKEN>/getMe"
# → {"ok":true,"result":{"id":...,"is_bot":true,"username":"kuhniminsk_bot"}}
```

То есть Telegram-боту/токену/получателям проблем нет — проблема
исключительно в сетевом egress'е с этого хоста.

### Что делать

**Правильный путь (выбран):** запросить у Timeweb разблокировку исходящих
соединений на api.telegram.org. Текст тикета: см. `.tmp/timeweb-ticket-telegram-egress.md`.

Подсети Telegram, которые нужны для API:

- `149.154.160.0/20` — основные DC api.telegram.org.
- `91.108.4.0/22`, `91.108.8.0/22`, `91.108.16.0/22`, `91.108.56.0/22` —
  дополнительные подсети медиа/CDN.

**Быстрый workaround** (если ждать провайдера долго): добавить строку

```text
149.154.167.220 api.telegram.org
```

в `/etc/hosts` на сервере и перезапустить `kuhni-na-zakaz`. Это пинит DNS
на один рабочий IP. Минус — если Telegram уведёт API с этого IP, отправка
снова сломается; обратимо удалением строки.

**Архитектурный путь** (на будущее): поднять HTTPS-прокси на стороннем VPS
с открытым egress и направить наш Telegram-клиент через него — через ENV
`TELEGRAM_API_BASE=https://relay.example.com` + правка `lib/telegram.ts`.

### Что НЕ работает до фикса egress

- Все Telegram-уведомления о новых заявках (`sendLeadNotifications`) —
  падают по таймауту. Заявка в БД сохраняется, но в Telegram ничего не
  приходит.
- Регистрация webhook (`setWebhook`) — не пройдёт, потому что наш сервер
  не может достучаться до `api.telegram.org`.
- Входящие сообщения через webhook — формально могут приходить
  (Telegram → наш сервер, обратное направление, провайдер их не режет),
  но форвард активным получателям опять же требует egress и тоже упадёт.

После того как Timeweb разблокирует egress — никаких дополнительных
правок в коде не требуется, всё заработает само.

---

## См. также

- `artifacts/kuhni-na-zakaz/.env.example` — актуальный список env.
- `artifacts/kuhni-na-zakaz/TELEGRAM_AUDIT.md` — аудит и план интеграции.
- `project-docs/HANDOFF.md` — общий статус по этапам.
