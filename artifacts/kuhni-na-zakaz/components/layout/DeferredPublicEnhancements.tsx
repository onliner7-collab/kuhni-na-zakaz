"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AnalyticsProvider = dynamic(
  () =>
    import("@/components/analytics/AnalyticsProvider").then(
      (module) => module.AnalyticsProvider,
    ),
  { ssr: false },
);

const MobileBottomNav = dynamic(
  () =>
    import("@/components/layout/MobileBottomNav").then(
      (module) => module.MobileBottomNav,
    ),
  { ssr: false },
);

const FloatingSocialButtons = dynamic(
  () =>
    import("@/components/layout/FloatingSocialButtons").then(
      (module) => module.FloatingSocialButtons,
    ),
  { ssr: false },
);

export function DeferredPublicEnhancements({
  instagram,
  telegram,
  phone,
  phoneHref,
}: {
  instagram?: string;
  telegram?: string;
  phone: string;
  phoneHref: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activate = () => setReady(true);
    const activationEvents = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const timer = window.setTimeout(activate, 3500);

    for (const eventName of activationEvents) {
      window.addEventListener(eventName, activate, { once: true, passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const eventName of activationEvents) {
        window.removeEventListener(eventName, activate);
      }
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <AnalyticsProvider />
      <MobileBottomNav />
      <FloatingSocialButtons
        instagram={instagram}
        telegram={telegram}
        phone={phone}
        phoneHref={phoneHref}
      />
    </>
  );
}
