BEGIN;

CREATE SEQUENCE IF NOT EXISTS "Lead_publicNumber_seq" START WITH 1001;

ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "publicNumber" INTEGER,
  ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "preferredContact" TEXT NOT NULL DEFAULT 'phone',
  ADD COLUMN IF NOT EXISTS "kitchenType" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "dimensions" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sourceType" TEXT NOT NULL DEFAULT 'website_form',
  ADD COLUMN IF NOT EXISTS "sourcePage" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sourceBlock" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "kitchenId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "imageId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "utmSource" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "utmMedium" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "referrer" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "assignedManagerId" INTEGER,
  ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "telegramUserId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "telegramChatId" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "telegramUsername" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "telegramConnected" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "telegramConnectedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "closedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

WITH base AS (
  SELECT COALESCE(MAX("publicNumber"), 1000) AS max_number FROM "Lead"
), numbered AS (
  SELECT id, base.max_number + ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) AS number
  FROM "Lead" CROSS JOIN base
  WHERE "publicNumber" IS NULL
)
UPDATE "Lead" AS lead
SET "publicNumber" = numbered.number
FROM numbered
WHERE lead.id = numbered.id;

SELECT setval(
  '"Lead_publicNumber_seq"',
  COALESCE((SELECT MAX("publicNumber") FROM "Lead"), 1000),
  true
);

ALTER TABLE "Lead"
  ALTER COLUMN "publicNumber" SET NOT NULL,
  ALTER COLUMN "publicNumber" SET DEFAULT nextval('"Lead_publicNumber_seq"'::regclass);

ALTER SEQUENCE "Lead_publicNumber_seq" OWNED BY "Lead"."publicNumber";
DROP SEQUENCE IF EXISTS lead_public_number_seq;

UPDATE "Lead"
SET status = CASE status
  WHEN 'contacted' THEN 'waiting_for_client'
  WHEN 'working' THEN 'in_progress'
  WHEN 'done' THEN 'completed'
  WHEN 'lost' THEN 'closed'
  ELSE status
END;

ALTER TABLE "TelegramRecipient"
  ADD COLUMN IF NOT EXISTS "telegramUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "username" TEXT NOT NULL DEFAULT '';

UPDATE "TelegramRecipient"
SET "telegramUserId" = "chatId"
WHERE "chatId" ~ '^[0-9]+$';

UPDATE "TelegramRecipient"
SET role = CASE WHEN role = 'owner' THEN 'owner' ELSE 'manager' END;

CREATE TABLE IF NOT EXISTS "LeadMessage" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  "senderType" TEXT NOT NULL,
  "senderTelegramId" TEXT NOT NULL DEFAULT '',
  "messageType" TEXT NOT NULL DEFAULT 'text',
  text TEXT NOT NULL,
  "telegramMessageId" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LeadNote" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  "managerId" INTEGER NOT NULL REFERENCES "TelegramRecipient"(id) ON DELETE RESTRICT,
  text TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LeadTelegramLinkToken" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LeadTelegramCard" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  "recipientId" INTEGER NOT NULL REFERENCES "TelegramRecipient"(id) ON DELETE CASCADE,
  "chatId" TEXT NOT NULL,
  "telegramMessageId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "TelegramOutbox" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER REFERENCES "Lead"(id) ON DELETE CASCADE,
  "recipientId" INTEGER REFERENCES "TelegramRecipient"(id) ON DELETE SET NULL,
  "chatId" TEXT NOT NULL,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastError" TEXT NOT NULL DEFAULT '',
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "TelegramSession" (
  id SERIAL PRIMARY KEY,
  "telegramUserId" TEXT NOT NULL,
  mode TEXT NOT NULL,
  "leadId" INTEGER,
  "draftText" TEXT NOT NULL DEFAULT '',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "TelegramProcessedUpdate" (
  id SERIAL PRIMARY KEY,
  "updateId" BIGINT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "LeadAuditLog" (
  id SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  "actorType" TEXT NOT NULL,
  "actorId" TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "LeadAuditLog" ("leadId", "actorType", "actorId", action, payload, "createdAt")
SELECT lead.id, 'legacy', '', 'legacy_note', jsonb_build_object('text', lead."managerNote"), lead."createdAt"
FROM "Lead" AS lead
WHERE BTRIM(lead."managerNote") <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM "LeadAuditLog" AS audit
    WHERE audit."leadId" = lead.id AND audit.action = 'legacy_note'
  );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lead_assignedManagerId_fkey') THEN
    ALTER TABLE "Lead"
      ADD CONSTRAINT "Lead_assignedManagerId_fkey"
      FOREIGN KEY ("assignedManagerId") REFERENCES "TelegramRecipient"(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "Lead_publicNumber_key" ON "Lead"("publicNumber");
CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx" ON "Lead"(status, "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_telegramUserId_status_idx" ON "Lead"("telegramUserId", status);
CREATE INDEX IF NOT EXISTS "Lead_assignedManagerId_status_idx" ON "Lead"("assignedManagerId", status);
CREATE INDEX IF NOT EXISTS "Lead_sourceType_createdAt_idx" ON "Lead"("sourceType", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramRecipient_telegramUserId_key" ON "TelegramRecipient"("telegramUserId");
CREATE INDEX IF NOT EXISTS "LeadMessage_leadId_createdAt_idx" ON "LeadMessage"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadNote_leadId_createdAt_idx" ON "LeadNote"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadNote_managerId_createdAt_idx" ON "LeadNote"("managerId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "LeadTelegramLinkToken_tokenHash_key" ON "LeadTelegramLinkToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "LeadTelegramLinkToken_leadId_expiresAt_idx" ON "LeadTelegramLinkToken"("leadId", "expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "LeadTelegramCard_leadId_recipientId_key" ON "LeadTelegramCard"("leadId", "recipientId");
CREATE INDEX IF NOT EXISTS "LeadTelegramCard_chatId_telegramMessageId_idx" ON "LeadTelegramCard"("chatId", "telegramMessageId");
CREATE INDEX IF NOT EXISTS "TelegramOutbox_status_nextAttemptAt_idx" ON "TelegramOutbox"(status, "nextAttemptAt");
CREATE INDEX IF NOT EXISTS "TelegramOutbox_leadId_createdAt_idx" ON "TelegramOutbox"("leadId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramSession_telegramUserId_key" ON "TelegramSession"("telegramUserId");
CREATE INDEX IF NOT EXISTS "TelegramSession_expiresAt_idx" ON "TelegramSession"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramProcessedUpdate_updateId_key" ON "TelegramProcessedUpdate"("updateId");
CREATE INDEX IF NOT EXISTS "TelegramProcessedUpdate_createdAt_idx" ON "TelegramProcessedUpdate"("createdAt");
CREATE INDEX IF NOT EXISTS "LeadAuditLog_leadId_createdAt_idx" ON "LeadAuditLog"("leadId", "createdAt");
CREATE INDEX IF NOT EXISTS "LeadAuditLog_actorId_createdAt_idx" ON "LeadAuditLog"("actorId", "createdAt");

COMMIT;
