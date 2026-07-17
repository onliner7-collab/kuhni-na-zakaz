import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  ACTIVE_LEAD_STATUSES,
  DIRECT_MANAGER_TELEGRAM_URL,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  TELEGRAM_SESSION_TTL_MS,
  type LeadStatus,
} from "@/lib/leads/constants";
import { hashTelegramLinkToken } from "@/lib/leads/telegram-link";
import {
  enqueueLeadCardSync,
  enqueueTelegramText,
  formatPhoneContact,
  formatTelegramContact,
} from "@/lib/leads/telegram-cards";
import {
  answerTelegramCallback,
  escapeTelegramHtml,
  sendTelegramText,
  type TelegramInlineKeyboard,
} from "@/lib/telegram-api";

interface TelegramUser {
  id?: number;
  username?: string;
  first_name?: string;
}

interface TelegramMessage {
  message_id?: number;
  chat?: { id?: number; type?: string };
  from?: TelegramUser;
  text?: string;
  photo?: unknown;
  document?: unknown;
  voice?: unknown;
  audio?: unknown;
  video?: unknown;
}

interface TelegramCallbackQuery {
  id?: string;
  from?: TelegramUser;
  data?: string;
  message?: TelegramMessage;
}

export interface TelegramUpdate {
  update_id?: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

const RESPONSE_TEMPLATES: Record<string, string> = {
  received: "Спасибо! Заявка получена. Мы изучим информацию и напишем вам о следующем шаге.",
  time: "Подскажите, пожалуйста, в какое время вам будет удобно принять звонок?",
  dimensions: "Уточните, пожалуйста, ваш город и примерные размеры кухни.",
  next: "Заявка в работе. Следующим сообщением мы уточним детали и согласуем дальнейший шаг.",
  dmitry: `Если нужно отправить фотографию или документ, напишите Дмитрию напрямую: ${DIRECT_MANAGER_TELEGRAM_URL}`,
};

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  let claimedUpdateId: number | null = null;
  if (typeof update.update_id === "number") {
    const isNew = await claimUpdate(update.update_id);
    if (!isNew) return;
    claimedUpdateId = update.update_id;
  }

  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return;
    }
    if (update.message) await handleMessage(update.message);
  } catch (error) {
    if (claimedUpdateId !== null) {
      await prisma.telegramProcessedUpdate.deleteMany({ where: { updateId: BigInt(claimedUpdateId) } });
    }
    throw error;
  }
}

async function claimUpdate(updateId: number): Promise<boolean> {
  try {
    await prisma.telegramProcessedUpdate.create({ data: { updateId: BigInt(updateId) } });
    return true;
  } catch (error) {
    if (isUniqueConstraintError(error)) return false;
    throw error;
  }
}

async function handleMessage(message: TelegramMessage) {
  const telegramUserId = stringifyId(message.from?.id || message.chat?.id);
  const chatId = stringifyId(message.chat?.id);
  if (!telegramUserId || !chatId) return;

  const admin = await findAdmin(telegramUserId, chatId);
  const text = typeof message.text === "string" ? message.text.trim() : "";
  if (!text) {
    await safeSend(chatId, unsupportedFileText());
    return;
  }

  if (/^\/cancel(?:@\w+)?$/i.test(text)) {
    await prisma.telegramSession.deleteMany({ where: { telegramUserId } });
    await safeSend(chatId, "Действие отменено.");
    return;
  }

  const startMatch = text.match(/^\/start(?:@\w+)?(?:\s+([A-Za-z0-9_-]{1,64}))?$/i);
  if (startMatch) {
    if (admin) {
      await safeSend(chatId, adminWelcome(admin.label));
      return;
    }
    await handleClientStart({
      telegramUserId,
      chatId,
      username: message.from?.username || "",
      firstName: message.from?.first_name || "",
      token: startMatch[1] || "",
    });
    return;
  }

  if (admin) {
    await handleAdminText(admin, text, message.message_id);
    return;
  }

  await handleClientText({
    telegramUserId,
    chatId,
    username: message.from?.username || "",
    text,
    telegramMessageId: message.message_id,
  });
}

async function handleClientStart(input: {
  telegramUserId: string;
  chatId: string;
  username: string;
  firstName: string;
  token: string;
}) {
  if (!input.token) {
    await safeSend(input.chatId, clientWelcome());
    return;
  }

  const tokenHash = hashTelegramLinkToken(input.token);
  const link = await prisma.leadTelegramLinkToken.findUnique({
    where: { tokenHash },
    include: { lead: true },
  });
  if (!link || link.usedAt || link.expiresAt <= new Date()) {
    await safeSend(input.chatId, "Ссылка недействительна или уже использована. Вернитесь на сайт и создайте новую заявку.");
    return;
  }

  const connected = await prisma.$transaction(async (tx) => {
    const claimed = await tx.leadTelegramLinkToken.updateMany({
      where: { id: link.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (claimed.count !== 1) return false;

    await tx.lead.update({
        where: { id: link.leadId },
        data: {
          telegramUserId: input.telegramUserId,
          telegramChatId: input.chatId,
          telegramUsername: input.username,
          telegramConnected: true,
          telegramConnectedAt: new Date(),
          auditLogs: {
            create: {
              actorType: "client",
              actorId: input.telegramUserId,
              action: "telegram_connected",
            },
          },
        },
      });
    return true;
  });
  if (!connected) {
    await safeSend(input.chatId, "Ссылка недействительна или уже использована. Вернитесь на сайт и создайте новую заявку.");
    return;
  }

  await enqueueLeadCardSync(link.leadId);
  await safeSend(
    input.chatId,
    [
      `Telegram подключён к заявке №${link.lead.publicNumber}.`,
      "",
      "Теперь вы можете отправлять боту текст и ссылки по этой заявке.",
      "Фотографии и документы отправляйте Дмитрию напрямую: @D110482",
    ].join("\n"),
    { inline_keyboard: [[{ text: "👤 Написать Дмитрию", url: DIRECT_MANAGER_TELEGRAM_URL }]] },
  );
}

async function handleClientText(input: {
  telegramUserId: string;
  chatId: string;
  username: string;
  text: string;
  telegramMessageId?: number;
}) {
  const activeLeads = await prisma.lead.findMany({
    where: {
      telegramUserId: input.telegramUserId,
      telegramConnected: true,
      status: { in: ACTIVE_LEAD_STATUSES },
    },
    orderBy: { createdAt: "desc" },
  });
  if (activeLeads.length === 0) {
    await safeSend(input.chatId, clientWelcome());
    return;
  }

  const session = await prisma.telegramSession.findUnique({ where: { telegramUserId: input.telegramUserId } });
  const sessionLead =
    session?.mode === "client_selected" && session.expiresAt > new Date()
      ? activeLeads.find((lead) => lead.id === session.leadId)
      : null;

  if (!sessionLead && activeLeads.length > 1) {
    await prisma.telegramSession.upsert({
      where: { telegramUserId: input.telegramUserId },
      create: {
        telegramUserId: input.telegramUserId,
        mode: "client_choose",
        draftText: input.text,
        expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS),
      },
      update: {
        mode: "client_choose",
        leadId: null,
        draftText: input.text,
        expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS),
      },
    });
    await safeSend(input.chatId, "К какой заявке относится сообщение?", {
      inline_keyboard: activeLeads.map((lead) => [{
        text: `№${lead.publicNumber} — ${lead.kitchenType || "заявка"}`.slice(0, 60),
        callback_data: `c:${lead.id}:select`,
      }]),
    });
    return;
  }

  await saveClientMessage(sessionLead || activeLeads[0], input);
}

async function saveClientMessage(
  lead: { id: number; publicNumber: number; name: string; phone: string },
  input: { telegramUserId: string; chatId: string; username: string; text: string; telegramMessageId?: number },
) {
  await prisma.leadMessage.create({
    data: {
      leadId: lead.id,
      senderType: "client",
      senderTelegramId: input.telegramUserId,
      text: input.text,
      telegramMessageId: input.telegramMessageId ? String(input.telegramMessageId) : "",
    },
  });
  await prisma.leadAuditLog.create({
    data: { leadId: lead.id, actorType: "client", actorId: input.telegramUserId, action: "message_received" },
  });

  const recipients = await prisma.telegramRecipient.findMany({ where: { active: true } });
  const text = [
    "<b>💬 НОВОЕ СООБЩЕНИЕ</b>",
    "",
    `<b>Заявка №${lead.publicNumber}</b>`,
    `<b>Клиент:</b> ${escapeTelegramHtml(lead.name)}`,
    `<b>Телефон:</b> ${formatPhoneContact(lead.phone)}`,
    `<b>Telegram:</b> ${formatTelegramContact({
      telegramConnected: true,
      telegramUsername: input.username,
      telegramUserId: input.telegramUserId,
    })}`,
    "",
    escapeTelegramHtml(input.text),
  ].join("\n");
  await Promise.all(recipients.map((recipient) => enqueueTelegramText({
    chatId: recipient.chatId,
    recipientId: recipient.id,
    leadId: lead.id,
    text,
    kind: "client_message",
  })));
  await safeSend(input.chatId, `Сообщение добавлено к заявке №${lead.publicNumber}.`);
}

async function handleAdminText(
  admin: { id: number; telegramUserId: string | null; chatId: string; label: string; role: string },
  text: string,
  telegramMessageId?: number,
) {
  const telegramUserId = admin.telegramUserId || admin.chatId;
  await prisma.telegramSession.deleteMany({ where: { telegramUserId } });
  await safeSend(admin.chatId, adminWelcome(admin.label));
}

async function handleCallback(callback: TelegramCallbackQuery) {
  const callbackId = callback.id || "";
  const telegramUserId = stringifyId(callback.from?.id);
  const chatId = stringifyId(callback.message?.chat?.id);
  const data = callback.data || "";
  if (!telegramUserId || !chatId || !data) return;

  try {
    if (data.startsWith("c:")) {
      await handleClientCallback({ telegramUserId, chatId, data });
      await safeAnswerCallback(callbackId);
      return;
    }

    const admin = await findAdmin(telegramUserId, chatId);
    if (!admin) {
      await safeAnswerCallback(callbackId, "Нет доступа");
      return;
    }
    if (data.startsWith("l:")) {
      await safeAnswerCallback(callbackId, "Управление заявками отключено");
      return;
    }
    await handleAdminCallback(admin, data);
    await safeAnswerCallback(callbackId);
  } catch (error) {
    console.error("[TELEGRAM CALLBACK]", error);
    await safeAnswerCallback(callbackId, "Не удалось выполнить действие");
  }
}

async function handleClientCallback(input: { telegramUserId: string; chatId: string; data: string }) {
  const match = input.data.match(/^c:(\d+):select$/);
  if (!match) return;
  const leadId = Number(match[1]);
  const [lead, session] = await Promise.all([
    prisma.lead.findFirst({ where: { id: leadId, telegramUserId: input.telegramUserId, telegramConnected: true } }),
    prisma.telegramSession.findUnique({ where: { telegramUserId: input.telegramUserId } }),
  ]);
  if (!lead || session?.mode !== "client_choose" || session.expiresAt <= new Date()) {
    await safeSend(input.chatId, "Выбор устарел. Отправьте сообщение ещё раз.");
    return;
  }
  const draftText = session.draftText;
  await prisma.telegramSession.upsert({
    where: { telegramUserId: input.telegramUserId },
    create: {
      telegramUserId: input.telegramUserId,
      mode: "client_selected",
      leadId,
      expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS),
    },
    update: {
      mode: "client_selected",
      leadId,
      draftText: "",
      expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS),
    },
  });
  if (draftText) {
    await saveClientMessage(lead, {
      telegramUserId: input.telegramUserId,
      chatId: input.chatId,
      username: "",
      text: draftText,
    });
  }
}

async function handleAdminCallback(
  admin: { id: number; telegramUserId: string | null; chatId: string; label: string; role: string },
  data: string,
) {
  const parts = data.split(":");
  if (parts[0] !== "l" || !/^\d+$/.test(parts[1] || "")) return;
  const leadId = Number(parts[1]);
  const action = parts[2] || "";
  const value = parts.slice(3).join(":");
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");
  const actorId = admin.telegramUserId || admin.chatId;

  if (action === "take") {
    const claimed = await prisma.lead.updateMany({
      where: { id: leadId, assignedManagerId: null },
      data: {
        assignedManagerId: admin.id,
        assignedAt: new Date(),
        assignedTo: admin.label,
        status: lead.status === "new" ? "in_progress" : lead.status,
      },
    });
    if (claimed.count !== 1) {
      await safeSend(admin.chatId, "Заявку уже взял другой менеджер.");
      return;
    }
    await prisma.leadAuditLog.create({
      data: { leadId, actorType: "manager", actorId, action: "lead_taken" },
    });
    await enqueueLeadCardSync(leadId);
    return;
  }
  if (action === "statuses") {
    await safeSend(admin.chatId, `Выберите статус заявки №${lead.publicNumber}:`, {
      inline_keyboard: LEAD_STATUSES.map((status) => [{
        text: LEAD_STATUS_LABELS[status],
        callback_data: `l:${leadId}:status:${status}`,
      }]),
    });
    return;
  }
  if (action === "contacts") {
    await safeSend(
      admin.chatId,
      `<b>Контакты по заявке №${lead.publicNumber}</b>\n\nТелефон: ${escapeTelegramHtml(lead.phone || "не указан")}\nEmail: ${escapeTelegramHtml(lead.email || "не указан")}`,
    );
    return;
  }
  if (action === "status" && LEAD_STATUSES.includes(value as LeadStatus)) {
    const isClosed = value === "closed" || value === "completed" || value === "spam";
    await updateLeadWorkflow(leadId, actorId, {
      status: value,
      closedAt: isClosed ? new Date() : null,
    }, "status_changed", { status: value });
    return;
  }
  if (action === "reply") {
    if (!lead.telegramConnected || !lead.telegramChatId) {
      await safeSend(admin.chatId, "К этой заявке Telegram клиента не подключён.");
      return;
    }
    await setSession(actorId, "reply", leadId);
    await safeSend(admin.chatId, `Вы отвечаете клиенту по заявке №${lead.publicNumber}.\n\nОтправьте одно текстовое сообщение или выберите шаблон.`, {
      inline_keyboard: [
        [{ text: "✅ Подтвердить получение", callback_data: `l:${leadId}:template:received` }],
        [{ text: "🕒 Уточнить удобное время", callback_data: `l:${leadId}:template:time` }],
        [{ text: "📐 Уточнить размеры и город", callback_data: `l:${leadId}:template:dimensions` }],
        [{ text: "➡️ Сообщить следующий шаг", callback_data: `l:${leadId}:template:next` }],
        [{ text: "👤 Дать контакт Дмитрия", callback_data: `l:${leadId}:template:dmitry` }],
      ],
    });
    return;
  }
  if (action === "template" && RESPONSE_TEMPLATES[value]) {
    await sendManagerReply({ lead, admin, text: RESPONSE_TEMPLATES[value] });
    await prisma.telegramSession.deleteMany({ where: { telegramUserId: actorId } });
    return;
  }
  if (action === "note") {
    await setSession(actorId, "note", leadId);
    await safeSend(admin.chatId, `Добавьте внутреннюю заметку к заявке №${lead.publicNumber}. Она не будет отправлена клиенту.`);
    return;
  }
  if (action === "assign") {
    if (admin.role !== "owner") throw new Error("Owner role required");
    const managers = await prisma.telegramRecipient.findMany({ where: { active: true }, orderBy: { id: "asc" } });
    await safeSend(admin.chatId, `Назначить менеджера для заявки №${lead.publicNumber}:`, {
      inline_keyboard: managers.map((manager) => [{
        text: manager.label || manager.username || manager.chatId,
        callback_data: `l:${leadId}:manager:${manager.id}`,
      }]),
    });
    return;
  }
  if (action === "manager") {
    if (admin.role !== "owner") throw new Error("Owner role required");
    const managerId = Number(value);
    const manager = await prisma.telegramRecipient.findFirst({ where: { id: managerId, active: true } });
    if (!manager) throw new Error("Manager not found");
    await updateLeadWorkflow(leadId, actorId, {
      assignedManagerId: manager.id,
      assignedAt: new Date(),
      assignedTo: manager.label,
      status: lead.status === "new" ? "in_progress" : lead.status,
    }, "manager_assigned", { managerId: manager.id });
    return;
  }
  if (action === "history") await sendHistory(admin.chatId, leadId, lead.publicNumber);
}

async function sendManagerReply(input: {
  lead: { id: number; publicNumber: number; telegramConnected: boolean; telegramChatId: string };
  admin: { id: number; telegramUserId: string | null; chatId: string; label: string };
  text: string;
  telegramMessageId?: number;
}) {
  if (!input.lead.telegramConnected || !input.lead.telegramChatId) throw new Error("Telegram is not connected");
  const actorId = input.admin.telegramUserId || input.admin.chatId;
  await prisma.leadMessage.create({
    data: {
      leadId: input.lead.id,
      senderType: "manager",
      senderTelegramId: actorId,
      text: input.text,
      telegramMessageId: input.telegramMessageId ? String(input.telegramMessageId) : "",
    },
  });
  await enqueueTelegramText({
    chatId: input.lead.telegramChatId,
    leadId: input.lead.id,
    kind: "manager_reply",
    text: `<b>Ответ по заявке №${input.lead.publicNumber}</b>\n\n${escapeTelegramHtml(input.text)}`,
  });
  await prisma.leadAuditLog.create({
    data: { leadId: input.lead.id, actorType: "manager", actorId, action: "reply_queued" },
  });
  await safeSend(input.admin.chatId, `Ответ по заявке №${input.lead.publicNumber} поставлен в очередь отправки.`);
}

async function updateLeadWorkflow(
  leadId: number,
  actorId: string,
  data: Prisma.LeadUncheckedUpdateInput,
  action: string,
  payload: Prisma.InputJsonValue = {},
) {
  await prisma.$transaction([
    prisma.lead.update({ where: { id: leadId }, data }),
    prisma.leadAuditLog.create({
      data: { leadId, actorType: "manager", actorId, action, payload },
    }),
  ]);
  await enqueueLeadCardSync(leadId);
}

async function sendHistory(chatId: string, leadId: number, publicNumber: number) {
  const [messages, notes, audits] = await Promise.all([
    prisma.leadMessage.findMany({ where: { leadId }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.leadNote.findMany({ where: { leadId }, include: { manager: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.leadAuditLog.findMany({ where: { leadId }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const lines = [`<b>История заявки №${publicNumber}</b>`];
  for (const message of messages.reverse()) {
    lines.push(`\n${message.senderType === "client" ? "Клиент" : "Менеджер"}: ${escapeTelegramHtml(message.text)}`);
  }
  for (const note of notes.reverse()) lines.push(`\nЗаметка ${escapeTelegramHtml(note.manager.label)}: ${escapeTelegramHtml(note.text)}`);
  if (messages.length === 0 && notes.length === 0) {
    for (const audit of audits.reverse()) {
      const payload = audit.payload && typeof audit.payload === "object" && !Array.isArray(audit.payload)
        ? audit.payload as Record<string, unknown>
        : {};
      const legacyText = typeof payload.text === "string" ? `: ${escapeTelegramHtml(payload.text)}` : "";
      lines.push(`\n${escapeTelegramHtml(audit.action)}${legacyText}`);
    }
  }
  await safeSend(chatId, lines.join("\n").slice(0, 3900));
}

async function setSession(telegramUserId: string, mode: string, leadId: number) {
  await prisma.telegramSession.upsert({
    where: { telegramUserId },
    create: { telegramUserId, mode, leadId, expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS) },
    update: { mode, leadId, draftText: "", expiresAt: new Date(Date.now() + TELEGRAM_SESSION_TTL_MS) },
  });
}

async function findAdmin(telegramUserId: string, chatId: string) {
  return prisma.telegramRecipient.findFirst({
    where: {
      active: true,
      OR: [{ telegramUserId }, { chatId }],
    },
  });
}

async function safeSend(chatId: string, text: string, replyMarkup?: TelegramInlineKeyboard) {
  try {
    await sendTelegramText({ chatId, text, replyMarkup });
  } catch (error) {
    console.error("[TELEGRAM SEND]", error);
  }
}

async function safeAnswerCallback(callbackId: string, text = "") {
  if (!callbackId) return;
  try {
    await answerTelegramCallback(callbackId, text);
  } catch (error) {
    console.error("[TELEGRAM CALLBACK ANSWER]", error);
  }
}

function stringifyId(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value.trim();
  return "";
}

function unsupportedFileText() {
  return [
    "Бот принимает только текст и ссылки.",
    "",
    "Если нужно отправить фотографию или документ, напишите Дмитрию напрямую:",
    DIRECT_MANAGER_TELEGRAM_URL,
  ].join("\n");
}

function clientWelcome() {
  return [
    "Здравствуйте! Это бот КухниBY.",
    "",
    "Чтобы подключить Telegram к заявке, начните расчёт на сайте и выберите «Продолжить в Telegram».",
    "Фотографии и документы можно отправить Дмитрию напрямую: @D110482",
  ].join("\n");
}

function adminWelcome(name: string) {
  return [
    `Здравствуйте, ${escapeTelegramHtml(name || "менеджер")}.`,
    "",
    "Новые заявки приходят готовыми сообщениями с телефоном, ссылкой на выбранную кухню и прямым контактом клиента в Telegram.",
  ].join("\n");
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}
