import { z } from "zod";
import { LEAD_SOURCE_TYPES, PREFERRED_CONTACTS, type LeadSourceType } from "@/lib/leads/constants";

const booleanField = z.preprocess((value) => {
  if (value === true || value === "true" || value === "on" || value === "1") return true;
  if (value === false || value === "false" || value === "0" || value === "") return false;
  return value;
}, z.boolean());

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  phone: optionalText(30),
  email: z.string().trim().email("Проверьте email").max(200).or(z.literal("")).optional().default(""),
  preferredContact: z.enum(PREFERRED_CONTACTS).optional().default("phone"),
  city: optionalText(100),
  kitchenType: optionalText(100),
  dimensions: optionalText(200),
  comment: optionalText(2000),
  agreement: booleanField.refine(Boolean, "Нужно согласие на обработку данных"),
  continueInTelegram: booleanField.optional().default(false),
  source: optionalText(100),
  formType: optionalText(50),
  sourceType: optionalText(100),
  sourcePage: optionalText(500),
  sourceBlock: optionalText(150),
  kitchenId: optionalText(150),
  imageId: optionalText(150),
  imageUrl: optionalText(500),
  projectSlug: optionalText(150),
  cityKey: optionalText(100),
  utmSource: optionalText(150),
  utmMedium: optionalText(150),
  utmCampaign: optionalText(150),
  utmTerm: optionalText(150),
  utmContent: optionalText(150),
  referrer: optionalText(500),
  answers: z.record(z.unknown()).optional().default({}),
  configSessionId: z.string().max(100).optional(),
  scenarioSlug: optionalText(100),
  styleSlug: optionalText(100),
  materialSlug: optionalText(100),
  budgetLevel: optionalText(100),
  messenger: optionalText(80),
  hasMeasurements: booleanField.optional().default(false),
  honeypot: z.string().max(0).optional(),
});

export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (/^80\d{9}$/.test(digits)) digits = `375${digits.slice(2)}`;

  if (digits.length < 7 || digits.length > 15) return null;
  if (/^0+$/.test(digits) || /^(\d)\1+$/.test(digits)) return null;

  return `+${digits}`;
}

export function normalizeSourceType(raw: string): LeadSourceType {
  if (LEAD_SOURCE_TYPES.includes(raw as LeadSourceType)) return raw as LeadSourceType;
  if (raw === "prices" || raw === "calculator") return "price_calculator";
  if (raw.includes("portfolio") || raw.includes("gallery")) return "kitchen_gallery";
  if (raw.includes("catalog") || raw.includes("kitchen")) return "kitchen_card";
  if (raw.includes("callback")) return "callback_form";
  if (raw.includes("banner")) return "contact_banner";
  return "website_form";
}

export function normalizeSiteUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kuhni.minsk.by";
  try {
    const base = new URL(siteUrl);
    const url = new URL(value, base);
    if (url.origin !== base.origin) return "";
    return `${url.origin}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "";
  }
}

export function normalizeImageUrl(raw: string): string {
  const normalized = normalizeSiteUrl(raw);
  if (normalized) return normalized;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw.slice(0, 500) : "";
}
