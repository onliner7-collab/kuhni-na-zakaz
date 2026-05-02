"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

interface PortfolioProjectOpenTrackerProps {
  projectSlug: string;
  cityKey?: string;
}

export function PortfolioProjectOpenTracker({
  projectSlug,
  cityKey,
}: PortfolioProjectOpenTrackerProps) {
  useEffect(() => {
    trackAnalyticsEvent(ANALYTICS_EVENTS.PORTFOLIO_PROJECT_OPEN, {
      source: "portfolio-project-page",
      project_slug: projectSlug,
      city_key: cityKey,
    });
  }, [cityKey, projectSlug]);

  return null;
}
