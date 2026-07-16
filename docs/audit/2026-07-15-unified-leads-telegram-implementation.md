# Единая система заявок сайта и Telegram — отчёт реализации

Дата: 2026-07-15
Статус: production rollout и live QA завершены 2026-07-16. По прямому решению владельца временно используется прежний токен; его последующая ротация остаётся обязательной рекомендацией.

## Что реализовано

- Все формы сайта создают одну запись `Lead`; Telegram-сбой не отменяет сохранённую заявку.
- Публичная нумерация существующих и новых заявок начинается с 1001 и сохраняет хронологию.
- Для продолжения в Telegram создаётся одноразовый SHA-256 токен сроком 24 часа; персональные данные в URL не передаются.
- Владелец Дмитрий и менеджер Александр получают синхронизируемые карточки в личных чатах.
- Реализованы: взять в работу, сменить менеджера владельцем, статусы, внутренние заметки, история, текстовый ответ, шаблоны и выбор заявки при нескольких активных заявках клиента.
- Файлы в формах и боте отключены. Клиенту предлагается отправлять их Дмитрию напрямую вне бота.
- На видимых изображениях кухонь доступны «Рассчитать эту кухню» и «Поделиться»; системный Web Share имеет fallback Telegram + копирование ссылки.
- `/admin/leads` оставлен read-only резервным просмотром.
- Политики обработки данных дополнены описанием Telegram ID, сообщений, ограниченного deep link и хранения.

## Надёжность и безопасность

- Уведомления идут через DB outbox с атомарным claim, повторными попытками и журналом ошибок.
- Webhook проверяет `X-Telegram-Bot-Api-Secret-Token` в production и дедуплицирует `update_id`.
- Административные callback-команды разрешены только активным `TelegramRecipient`.
- Токен бота читается только из server environment; API и админка не возвращают и не сохраняют его.
- Формы имеют honeypot, ограничение частоты, серверную валидацию, нормализацию телефона и same-origin нормализацию URL.
- Согласие на обработку данных обязательно и изначально не отмечено.

## Миграция

SQL: `artifacts/kuhni-na-zakaz/prisma/migrations/20260715170000_unified_leads_telegram/migration.sql`.

Миграция аддитивная и повторяемая: создаёт Prisma-совместимую sequence `Lead_publicNumber_seq`, поля/таблицы/индексы, нумерует только строки без `publicNumber`, переводит legacy-статусы и переносит старые `managerNote` в audit history. Скрипт синхронизации получателей связывает старое `assignedTo` с новой FK по имени.

Локальная БД из `.env` на `127.0.0.1:5434` недоступна, поэтому SQL не применялся локально. На production перед миграцией создан и проверен backup `/var/backups/kuhni-na-zakaz/pre-unified-leads-20260716-040212.dump`, SHA-256 `7989747fa7b934cbf219bd2647041cf2c885ba4c2e54a0147fd81278f4431334`.

## Переменные окружения

```text
TELEGRAM_BOT_TOKEN=<новый токен после ротации>
TELEGRAM_WEBHOOK_SECRET=<случайный секрет>
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=kuhniminsk_bot
TELEGRAM_OWNER_ID=344649719
TELEGRAM_OWNER_NAME=Дмитрий
TELEGRAM_MANAGER_ID=1349736681
TELEGRAM_MANAGER_NAME=Александр
NEXT_PUBLIC_SITE_URL=https://kuhni.minsk.by
```

## Проверки

- `pnpm.cmd run typecheck` — pass.
- `pnpm.cmd run test:leads` — 3/3 pass.
- Lead forms desktop/mobile — 22/22 подтверждены; image/share сценарии входят в этот набор.
- Kitchen image coverage — desktop 7/7, mobile 7/7.
- `pnpm.cmd run build` — pass, 124 pages; локальная DB недоступна, использованы штатные static fallbacks.
- `pnpm.cmd exec prisma validate` — pass.
- `git diff --check` — pass.
- Secret scan — опубликованный в чате токен в проекте не найден.
- `pnpm audit --prod` не дал результата: npm registry 15 июля 2026 вернул `410` для audit endpoints; dependency audit остаётся внешним gate, ручной security review выполнен.

## Rollout и rollback

Production rollout выполнен: backup → migration → Prisma sync → recipient sync → build → service restart → webhook → live leads → outbox/timer QA. Rollback кода выполняется отдельным `git revert` и повторным deploy. Миграция аддитивная; удалять новые поля/таблицы автоматически нельзя, а восстановление данных выполняется только из pre-deploy backup отдельным согласованным действием.

## Осознанные ограничения

- Загрузка файлов отсутствует по решению владельца.
- WhatsApp и Viber не показываются до появления реальных каналов.
- Юридический текст использует бренд «КухниBY» и не является внешним юридическим заключением.
- Временное использование старого токена подтверждено владельцем. Токен перенесён из legacy DB-настройки в `/etc/kuhni-na-zakaz.env` без вывода значения; права env исправлены с `777` на `640 root:kuhni`.

## Production evidence 2026-07-16

- Application deploy: `082b211`; systemd outbox fix: `1376c91`; production build — 173 pages.
- Server HEAD после runtime fix: `1376c9149a8e12b45710495accd8ca62930f2d02`; приложение active.
- Мигрированы 4 legacy Lead: публичные номера 1001–1004, дублей нет, `done` → `completed`.
- Webhook: `https://kuhni.minsk.by/kapi/telegram/webhook`, pending `0`; без secret `403`, с secret `200`. `getWebhookInfo` сохраняет исторический timeout времени restart, но последующие реальные admin callbacks обработаны: `lead_taken` и три `manager_assigned`, что подтверждает восстановленную доставку.
- Live smoke leads: №1005 обычная и №1006 с deep link; 4/4 карточки доставлены Дмитрию и Александру, после QA обе помечены `spam`, deep link аннулирован, ещё 4/4 обновления карточек доставлены.
- Outbox timer active/enabled; worker после исправления Corepack cache завершается `success`, pending/failed `0`; количество notification logs соответствует outbox items, повторной обработки одной записи нет.
- HTTP `200`: `/`, `/portfolio`, `/privacy-policy`, `/personal-data`, `/robots.txt`, `/sitemap.xml`.
- Production Playwright: page coverage 14/14 с отдельным повтором двух маршрутов после замены `networkidle` на `domcontentloaded`; form/share 4/4.
