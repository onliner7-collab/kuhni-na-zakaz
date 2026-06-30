"use client";

export const ANALYTICS_EVENTS = {
  FORM_SUBMIT: "form_submit",
  LEAD_FORM_SUBMIT: "lead_form_submit",
  PORTFOLIO_PROJECT_OPEN: "portfolio_project_open",
  PORTFOLIO_FILTER_CHANGE: "portfolio_filter_change",
  LIGHTBOX_OPEN: "lightbox_open",
  PHONE_REVEAL: "phone_reveal",
  PHONE_CLICK: "phone_click",
  MESSENGER_CLICK: "messenger_click",
  CONTACT_CHOOSER_OPEN: "contact_chooser_open",
  CONTACT_CHOOSER_CLOSE: "contact_chooser_close",
  CONTACT_CHOOSER_SELECT: "contact_chooser_select",
  CTA_CLICK: "cta_click",
  DESIGN_HERO_VIEW: "design_project_hero_view",
  DESIGN_CONFIG_CHOICE: "design_project_config_choice",
  DESIGN_CONFIG_COMPLETE: "design_project_config_complete",
  DESIGN_LAYER_OPEN: "design_project_layer_open",
  DESIGN_CASE_VIEW: "design_project_case_view",
  DESIGN_GALLERY_NAVIGATE: "design_project_gallery_navigate",
  DESIGN_PROJECT_PART_OPEN: "design_project_part_open",
  DESIGN_MATERIAL_OPEN: "design_project_material_open",
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
interface TrackAnalyticsOptions {
  gtagCallback?: () => void;
  eventTimeoutMs?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, target: string, params?: AnalyticsParams) => void;
  }
}

export const YANDEX_METRIKA_ID =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "109329747";

export function trackAnalyticsEvent(
  event: AnalyticsEvent,
  params: AnalyticsParams = {},
  options: TrackAnalyticsOptions = {},
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

  const gtagPayload: Record<string, unknown> = {
    transport_type: "beacon",
    ...payload,
  };
  if (options.gtagCallback) {
    gtagPayload.event_callback = options.gtagCallback;
    gtagPayload.event_timeout = options.eventTimeoutMs ?? 1000;
  }

  if (window.gtag) {
    window.gtag("event", event, gtagPayload);
  } else {
    window.dataLayer.push(["event", event, gtagPayload]);
  }

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
