"use client";

export const ANALYTICS_EVENTS = {
  FORM_SUBMIT: "form_submit",
  PHONE_CLICK: "phone_click",
  MESSENGER_CLICK: "messenger_click",
  CALCULATOR_OPEN: "calculator_open",
  LEAD_SUCCESS: "lead_success",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, target: string, params?: AnalyticsParams) => void;
  }
}

const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

export function trackAnalyticsEvent(
  event: AnalyticsEvent,
  params: AnalyticsParams = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = pruneEmptyParams(params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
  });

  window.gtag?.("event", event, payload);

  const counterId = yandexMetrikaId ? Number(yandexMetrikaId) : NaN;
  if (window.ym && Number.isFinite(counterId)) {
    window.ym(counterId, "reachGoal", event, payload);
  }
}

function pruneEmptyParams(params: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}
