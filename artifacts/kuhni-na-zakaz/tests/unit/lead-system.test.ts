import assert from "node:assert/strict";
import test from "node:test";
import { normalizePhone, normalizeSourceType } from "../../lib/leads/validation";
import { formatLeadCard, formatTelegramContact } from "../../lib/leads/telegram-cards";

test("normalizes Belarus and international phone numbers", () => {
  assert.equal(normalizePhone("+375 (29) 123-45-67"), "+375291234567");
  assert.equal(normalizePhone("80 29 123-45-67"), "+375291234567");
  assert.equal(normalizePhone("+49 151 23456789"), "+4915123456789");
  assert.equal(normalizePhone("0000000"), null);
  assert.equal(normalizePhone("1111111"), null);
  assert.equal(normalizePhone("123"), null);
});
test("maps legacy source labels to the allowed source taxonomy", () => {
  assert.equal(normalizeSourceType("catalog-angular-interactive"), "kitchen_card");
  assert.equal(normalizeSourceType("portfolio-project"), "kitchen_gallery");
  assert.equal(normalizeSourceType("prices"), "price_calculator");
  assert.equal(normalizeSourceType("location-region"), "website_form");
});

test("formats a Russian Telegram lead card without exposing Telegram ID", () => {
  const card = formatLeadCard({
    id: 1,
    publicNumber: 1001,
    name: "Иван",
    phone: "+375291234567",
    email: "",
    preferredContact: "telegram",
    city: "Минск",
    kitchenType: "Угловая кухня",
    dimensions: "3 × 2 м",
    comment: "Светлые фасады",
    source: "website",
    formType: "catalog",
    sourceType: "kitchen_gallery",
    sourcePage: "https://kuhni.minsk.by/catalog/uglovye-kuhni",
    sourceBlock: "Изображение кухни",
    kitchenId: "uglovye-kuhni",
    imageId: "rakurs-2.webp",
    imageUrl: "/image.webp",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    referrer: "",
    answers: {},
    configSessionId: null,
    scenarioSlug: "",
    styleSlug: "",
    materialSlug: "",
    budgetLevel: "",
    status: "new",
    managerNote: "",
    assignedTo: "",
    assignedManagerId: null,
    assignedManager: null,
    assignedAt: null,
    telegramUserId: "123456789",
    telegramChatId: "123456789",
    telegramUsername: "client",
    telegramConnected: true,
    telegramConnectedAt: new Date(),
    closedAt: null,
    createdAt: new Date("2026-07-15T10:00:00Z"),
    updatedAt: new Date("2026-07-15T10:00:00Z"),
  });

  assert.match(card, /ЗАЯВКА №1001/);
  assert.match(card, /Изображение кухни/);
  assert.match(card, /https:\/\/t\.me\/client/);
  assert.match(card, /@client — написать в ЛС/);
  assert.match(card, /tel:\+375291234567/);
  assert.match(card, /https:\/\/kuhni\.minsk\.by\/image\.webp/);
  assert.doesNotMatch(card, /Статус:/);
  assert.doesNotMatch(card, /Менеджер:/);
  assert.doesNotMatch(card, /Ответ через бота/);
  assert.doesNotMatch(card, /ID кухни:/);
  assert.doesNotMatch(card, /Ракурс:/);
  assert.doesNotMatch(card, /123456789/);
});

test("creates a direct Telegram link without displaying the numeric user ID", () => {
  const contact = formatTelegramContact({
    telegramConnected: true,
    telegramUsername: "",
    telegramUserId: "123456789",
  });

  assert.match(contact, /tg:\/\/user\?id=123456789/);
  assert.match(contact, />написать клиенту в ЛС<\/a>/);
});

test("does not create Telegram links from unsafe contact values", () => {
  const contact = formatTelegramContact({
    telegramConnected: true,
    telegramUsername: "bad\" onclick=\"alert(1)",
    telegramUserId: "javascript:alert(1)",
  });

  assert.equal(contact, "подключён, но прямая ссылка недоступна");
});

test("does not expose an external page as a lead source link", () => {
  const card = formatLeadCard({
    id: 2,
    publicNumber: 1002,
    name: "Клиент",
    phone: "+375291234567",
    email: "",
    preferredContact: "phone",
    city: "Минск",
    kitchenType: "Прямая кухня",
    dimensions: "",
    comment: "",
    source: "website",
    formType: "catalog",
    sourceType: "kitchen_card",
    sourcePage: "https://example.com/phishing",
    sourceBlock: "",
    kitchenId: "",
    imageId: "",
    imageUrl: "javascript:alert(1)",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    referrer: "",
    answers: {},
    configSessionId: null,
    scenarioSlug: "",
    styleSlug: "",
    materialSlug: "",
    budgetLevel: "",
    status: "new",
    managerNote: "",
    assignedTo: "",
    assignedManagerId: null,
    assignedManager: null,
    assignedAt: null,
    telegramUserId: "",
    telegramChatId: "",
    telegramUsername: "",
    telegramConnected: false,
    telegramConnectedAt: null,
    closedAt: null,
    createdAt: new Date("2026-07-15T10:00:00Z"),
    updatedAt: new Date("2026-07-15T10:00:00Z"),
  });

  assert.doesNotMatch(card, /example\.com/);
  assert.doesNotMatch(card, /javascript:/);
});
