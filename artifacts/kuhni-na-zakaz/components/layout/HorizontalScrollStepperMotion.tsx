"use client";

import { useEffect } from "react";

const SCROLLER_SELECTOR = ".overflow-x-auto, .overflow-x-scroll";

function isHorizontalScroller(element: HTMLElement) {
  if (element.dataset.stepperScroll === "false") {
    return false;
  }

  const style = window.getComputedStyle(element);
  const canScroll = style.overflowX === "auto" || style.overflowX === "scroll";

  return canScroll && element.scrollWidth > element.clientWidth + 4;
}

function ensureIndicator(element: HTMLElement) {
  let indicator = element.querySelector<HTMLElement>(":scope > .stepper-scroll-motion");

  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "stepper-scroll-motion";
    indicator.setAttribute("aria-hidden", "true");

    const progress = document.createElement("span");
    progress.className = "stepper-scroll-motion__progress";
    indicator.appendChild(progress);

    const dot = document.createElement("span");
    dot.className = "stepper-scroll-motion__dot";
    indicator.appendChild(dot);

    element.appendChild(indicator);
  }

  return indicator;
}

export function HorizontalScrollStepperMotion() {
  useEffect(() => {
    const cleanups = new Map<HTMLElement, () => void>();
    let syncFrame = 0;

    const setupScroller = (element: HTMLElement) => {
      if (cleanups.has(element)) {
        return;
      }

      ensureIndicator(element);

      let updateFrame = 0;
      const update = () => {
        updateFrame = 0;

        const active = isHorizontalScroller(element);
        const maxScroll = Math.max(1, element.scrollWidth - element.clientWidth);
        const progress = active ? Math.min(1, Math.max(0, element.scrollLeft / maxScroll)) : 0;

        element.dataset.stepperScrollMotion = active ? "active" : "idle";
        element.style.setProperty("--stepper-scroll-progress", progress.toFixed(4));
      };

      const requestUpdate = () => {
        if (!updateFrame) {
          updateFrame = window.requestAnimationFrame(update);
        }
      };

      const resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(element);

      element.addEventListener("scroll", requestUpdate, { passive: true });
      requestUpdate();

      cleanups.set(element, () => {
        element.removeEventListener("scroll", requestUpdate);
        resizeObserver.disconnect();
        if (updateFrame) {
          window.cancelAnimationFrame(updateFrame);
        }
        element.removeAttribute("data-stepper-scroll-motion");
        element.style.removeProperty("--stepper-scroll-progress");
        element.querySelector(":scope > .stepper-scroll-motion")?.remove();
      });
    };

    const sync = () => {
      syncFrame = 0;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(SCROLLER_SELECTOR));

      for (const element of elements) {
        setupScroller(element);
      }

      for (const [element, cleanup] of cleanups) {
        if (!document.body.contains(element)) {
          cleanup();
          cleanups.delete(element);
        }
      }
    };

    const requestSync = () => {
      if (!syncFrame) {
        syncFrame = window.requestAnimationFrame(sync);
      }
    };

    const mutationObserver = new MutationObserver(requestSync);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    requestSync();

    return () => {
      mutationObserver.disconnect();
      if (syncFrame) {
        window.cancelAnimationFrame(syncFrame);
      }
      for (const cleanup of cleanups.values()) {
        cleanup();
      }
      cleanups.clear();
    };
  }, []);

  return null;
}
