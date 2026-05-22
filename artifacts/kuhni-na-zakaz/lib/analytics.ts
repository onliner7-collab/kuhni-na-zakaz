"use client";

export const ANALYTICS_EVENTS = {
  FORM_SUBMIT: "form_submit",
  LEAD_FORM_SUBMIT: "lead_form_submit",
  PORTFOLIO_PROJECT_OPEN: "portfolio_project_open",
  PORTFOLIO_FILTER_CHANGE: "portfolio_filter_change",
  LIGHTBOX_OPEN: "lightbox_open",
  PHONE_CLICK: "phone_click",
  MESSENGER_CLICK: "messenger_click",
  EMAIL_CLICK: "email_click",
  MEASURE_REQUEST: "measure_request",
  COST_CALCULATION: "price_calc_click",
  CALCULATOR_START: "calculator_start",
  CALCULATOR_SUBMIT: "calculator_submit",
  CALCULATOR_OPEN: "calculator_start",
  LEAD_SUCCESS: "lead_success",
  LEAD_SUBMIT: "lead_submit",
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

export const YANDEX_METRIKA_ID =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "109329747";

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

  const counterId = Number(YANDEX_METRIKA_ID);
  if (window.ym && Number.isFinite(counterId)) {
    window.ym(counterId, "reachGoal", event, payload);
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  const counterId = Number(YANDEX_METRIKA_ID);
  if (window.ym && Number.isFinite(counterId)) {
    window.ym(counterId, "hit", path);
  }

  window.gtag?.("event", "page_view", {
    page_path: path,
  });
}

function pruneEmptyParams(params: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}
