"use client";

import React, { type ReactNode } from "react";
import { trackExplorationEvent } from "@/lib/analytics";
import type { TransitionEntryV2 } from "@/lib/exploration-types";
import { useOptionalExploreContext } from "./ExploreContext";

interface ExplorationTransitionLinkProps {
  transition: TransitionEntryV2;
  children: ReactNode;
  className?: string;
}

export function ExplorationTransitionLink({
  transition,
  children,
  className,
}: ExplorationTransitionLinkProps) {
  const exploreContext = useOptionalExploreContext();

  function handleClick() {
    if (transition.contextPatch) {
      exploreContext?.updateContext(
        transition.contextPatch,
        transition.contextPatch.lastMeaningfulAction || transition.anchorRu,
      );
    }
    trackExplorationEvent(transition.analyticsEvent, {
      source_route: transition.fromRoute,
      from_state: transition.fromState,
      action_type: transition.actionType,
      target_route: transition.toRoute,
      selected_dimension: Object.keys(transition.contextPatch || {})
        .filter((key) => !["sourceRoute", "lastMeaningfulAction"].includes(key))
        .join(",") || undefined,
      evidence_preference: transition.contextPatch?.evidencePreference,
    });
  }

  return (
    <a
      href={transition.toRoute}
      data-transition={transition.actionType}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
