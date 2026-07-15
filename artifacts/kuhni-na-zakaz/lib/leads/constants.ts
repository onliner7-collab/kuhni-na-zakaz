export const LEAD_STATUSES = [
  "new",
  "in_progress",
  "waiting_for_client",
  "measurement_scheduled",
  "calculation_prepared",
  "completed",
  "closed",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  waiting_for_client: "Ожидаем клиента",
  measurement_scheduled: "Замер назначен",
  calculation_prepared: "Расчёт подготовлен",
  completed: "Завершена",
  closed: "Закрыта",
  spam: "Спам",
};

export const ACTIVE_LEAD_STATUSES: LeadStatus[] = [
  "new",
  "in_progress",
  "waiting_for_client",
  "measurement_scheduled",
  "calculation_prepared",
];

export const LEAD_SOURCE_TYPES = [
  "telegram_bot",
  "website_form",
  "kitchen_card",
  "kitchen_gallery",
  "contact_banner",
  "price_calculator",
  "callback_form",
] as const;

export type LeadSourceType = (typeof LEAD_SOURCE_TYPES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSourceType, string> = {
  telegram_bot: "Telegram-бот",
  website_form: "Форма сайта",
  kitchen_card: "Карточка кухни",
  kitchen_gallery: "Изображение кухни",
  contact_banner: "Баннер связи",
  price_calculator: "Калькулятор стоимости",
  callback_form: "Обратный звонок",
};

export const PREFERRED_CONTACTS = ["phone", "telegram", "email"] as const;
export type PreferredContact = (typeof PREFERRED_CONTACTS)[number];

export const TELEGRAM_LINK_TTL_MS = 24 * 60 * 60 * 1000;
export const TELEGRAM_SESSION_TTL_MS = 15 * 60 * 1000;
export const DIRECT_MANAGER_TELEGRAM_URL = "https://t.me/D110482";
