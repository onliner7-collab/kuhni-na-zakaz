import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { SITE_NAME } from "@/lib/seo";

const LEGACY_PHONE_DISPLAY_VALUES = new Set([
  "+375 (29) 626-15-47",
  "+375 29 626 15 47",
  "+375 (29) 123-45-67",
]);
const LEGACY_SECONDARY_PHONE_VALUES = new Set(["+375296261547", "375296261547", "+375291234567", "375291234567"]);
const LEGACY_SECONDARY_PHONE_DISPLAY_VALUES = new Set([
  "+375 (29) 626-15-47",
  "+375 29 626 15 47",
  "+375 (29) 123-45-67",
]);
const LEGACY_SITE_NAME = ["Кухни", "Minsk"].join("");
const LEGACY_EMAIL = ["info@kuhni", "minsk.by"].join("");
const PLACEHOLDER_SITE_NAMES = new Set([LEGACY_SITE_NAME]);
const PLACEHOLDER_EMAILS = new Set([LEGACY_EMAIL]);
const PLACEHOLDER_ADDRESSES = new Set(["г. Минск, ул. Притыцкого, 100"]);

export interface ContactSettingsInput {
  siteName?: string | null;
  phone?: string | null;
  phoneDisplay?: string | null;
  phone2?: string | null;
  phoneDisplay2?: string | null;
  email?: string | null;
  address?: string | null;
  addressMap?: string | null;
  workingHours?: string | null;
  telegram?: string | null;
  viber?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  vk?: string | null;
  facebook?: string | null;
}

export interface ContactInfo {
  siteName: string;
  phone: string;
  phoneDisplay: string;
  phone2: string;
  phoneDisplay2: string;
  email: string;
  address: string;
  addressMap: string;
  workingHours: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  instagram: string;
  vk: string;
  facebook: string;
}

function normalizePrimaryPhone(_phone?: string | null) {
  return CONTACT_DEFAULTS.phone;
}

function normalizePrimaryPhoneDisplay(phoneDisplay?: string | null) {
  const value = (phoneDisplay || "").trim();
  if (!value || LEGACY_PHONE_DISPLAY_VALUES.has(value)) return CONTACT_DEFAULTS.phoneDisplay;

  return value;
}

function normalizeSiteName(siteName?: string | null) {
  const value = (siteName || "").trim();
  if (!value || PLACEHOLDER_SITE_NAMES.has(value)) return SITE_NAME;

  return value;
}

function normalizeEmail(email?: string | null) {
  const value = (email || "").trim();
  if (!value || PLACEHOLDER_EMAILS.has(value)) return CONTACT_DEFAULTS.email;

  return value;
}

function normalizeAddress(address?: string | null) {
  const value = (address || "").trim();
  if (!value || PLACEHOLDER_ADDRESSES.has(value)) return CONTACT_DEFAULTS.address;

  return value;
}

function normalizeSecondaryPhone(phone?: string | null) {
  const value = (phone || "").trim();
  if (!value || LEGACY_SECONDARY_PHONE_VALUES.has(value)) return CONTACT_DEFAULTS.phone2;

  return value;
}

function normalizeSecondaryPhoneDisplay(phoneDisplay?: string | null) {
  const value = (phoneDisplay || "").trim();
  if (!value || LEGACY_SECONDARY_PHONE_DISPLAY_VALUES.has(value)) return CONTACT_DEFAULTS.phoneDisplay2;

  return value;
}

export function resolveContactInfo(settings?: ContactSettingsInput | null): ContactInfo {
  return {
    siteName: normalizeSiteName(settings?.siteName),
    phone: normalizePrimaryPhone(settings?.phone),
    phoneDisplay: normalizePrimaryPhoneDisplay(settings?.phoneDisplay),
    phone2: normalizeSecondaryPhone(settings?.phone2),
    phoneDisplay2: normalizeSecondaryPhoneDisplay(settings?.phoneDisplay2),
    email: normalizeEmail(settings?.email),
    address: normalizeAddress(settings?.address),
    addressMap: settings?.addressMap?.trim() || "",
    workingHours: settings?.workingHours?.trim() || CONTACT_DEFAULTS.workingHours,
    telegram: settings?.telegram?.trim() || CONTACT_DEFAULTS.telegram,
    viber: settings?.viber?.trim() || "",
    whatsapp: settings?.whatsapp?.trim() || "",
    instagram: settings?.instagram?.trim() || CONTACT_DEFAULTS.instagram,
    vk: settings?.vk?.trim() || "",
    facebook: settings?.facebook?.trim() || "",
  };
}

export function getSameAsLinks(contact: ContactInfo) {
  return [contact.instagram, contact.vk, contact.facebook].filter((url) =>
    /^https?:\/\//i.test(url),
  );
}
