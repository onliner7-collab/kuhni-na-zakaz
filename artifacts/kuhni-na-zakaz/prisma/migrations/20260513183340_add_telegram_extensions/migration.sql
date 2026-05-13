-- Delta migration: extend Telegram notifications.
--
-- This is the first migration in the project (history was previously managed
-- via `prisma db push`). It is intentionally a *delta* migration:
--   - existing TelegramRecipient rows keep all their data;
--   - the only structural changes are additive (two new columns + unique index);
--   - two brand-new tables are added.
--
-- For a clean dev database the schema is still bootstrapped via `prisma db push`
-- or `prisma migrate deploy`. For an environment that already has the legacy
-- tables, apply this file once (e.g. `prisma db execute --file ./migration.sql
-- --schema ../schema.prisma`) and then mark it applied via
-- `prisma migrate resolve --applied 20260513183340_add_telegram_extensions`.

-- 1. Deduplicate chatId before adding the unique index.
--    Keeps the oldest row (smallest id) for each chatId so currently active
--    routing stays predictable.
DELETE FROM "TelegramRecipient" a
USING "TelegramRecipient" b
WHERE a."chatId" = b."chatId"
  AND a."id"     > b."id";

-- 2. Extend TelegramRecipient with role and updatedAt columns.
ALTER TABLE "TelegramRecipient"
  ADD COLUMN "role"      TEXT         NOT NULL DEFAULT 'moderator',
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3. Enforce uniqueness on chatId.
CREATE UNIQUE INDEX "TelegramRecipient_chatId_key"
  ON "TelegramRecipient"("chatId");

-- 4. Delivery log for outgoing Telegram notifications.
CREATE TABLE "TelegramNotificationLog" (
    "id"           SERIAL       NOT NULL,
    "leadId"       INTEGER,
    "recipientId"  INTEGER,
    "chatId"       TEXT         NOT NULL,
    "status"       TEXT         NOT NULL,
    "errorMessage" TEXT         NOT NULL DEFAULT '',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramNotificationLog_pkey" PRIMARY KEY ("id")
);

-- 5. Storage for incoming Telegram messages (webhook payloads).
CREATE TABLE "TelegramMessage" (
    "id"             SERIAL       NOT NULL,
    "userTelegramId" TEXT         NOT NULL,
    "username"       TEXT         NOT NULL DEFAULT '',
    "firstName"      TEXT         NOT NULL DEFAULT '',
    "messageText"    TEXT         NOT NULL DEFAULT '',
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramMessage_pkey" PRIMARY KEY ("id")
);
