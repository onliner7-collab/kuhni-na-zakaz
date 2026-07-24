"use client";

import { useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import { useExploreContext } from "@/components/exploration";

export type LayoutVisualFrame = {
  id: string;
  label: string;
  webp: string;
  avif: string;
  alt: string;
  caption: string;
  result: string;
  caution: string;
};

export function LayoutVisualExplorer({
  route,
  layout,
  role,
  legend,
  frames,
}: {
  route: string;
  layout: string;
  role: string;
  legend: string;
  frames: LayoutVisualFrame[];
}) {
  const [activeId, setActiveId] = useState(frames[0]?.id ?? "");
  const { updateContext } = useExploreContext();
  const active = frames.find((frame) => frame.id === activeId) ?? frames[0];

  function choose(frame: LayoutVisualFrame) {
    setActiveId(frame.id);
    updateContext({ layout, scenario: frame.label }, `${role}:${frame.id}`);
    window.dispatchEvent(new CustomEvent("layout-batch-answers", {
      detail: {
        sourceRoute: route,
        interactionRole: role,
        layout,
        selectedOption: frame.label,
        limitation: frame.caution,
      },
    }));
  }

  if (!active) return null;

  return (
    <section data-interaction-role={role} aria-labelledby={`${role}-title`} className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
      <div className="relative bg-stone-200">
        <picture key={active.id}>
          <source srcSet={active.avif} type="image/avif" />
          <img
            src={active.webp}
            alt={active.alt}
            width="1200"
            height="800"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) calc(100vw - 3rem), 1200px"
            loading={active.id === frames[0]?.id ? "eager" : "lazy"}
            fetchPriority={active.id === frames[0]?.id ? "high" : "auto"}
            className={`aspect-[2/3] h-auto w-full object-cover sm:aspect-[3/2] ${
              active.id === frames[0]?.id
                ? ""
                : "motion-safe:animate-[fade-in_.22s_ease-out]"
            }`}
          />
        </picture>
        <span className="absolute left-3 top-3 rounded-full bg-stone-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">AI-визуализация</span>
      </div>

      <div className="p-4 md:p-6">
        <h2 id={`${role}-title`} className="text-xl font-black text-stone-950 md:text-2xl">{legend}</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label={legend}>
          {frames.map((frame) => {
            const selected = frame.id === active.id;
            return (
              <button
                key={frame.id}
                type="button"
                data-frame-id={frame.id}
                aria-pressed={selected}
                onClick={() => choose(frame)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    choose(frame);
                  }
                }}
                className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 ${selected ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-stone-50 text-stone-950 hover:border-stone-600"}`}
              >
                <span className="flex items-center gap-2">{selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}{frame.label}</span>
              </button>
            );
          })}
        </div>

        <div role="status" aria-live="polite" className="mt-4 grid gap-3 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-stone-800 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="font-bold">{active.result}</p>
            <p className="mt-1 flex gap-2"><CircleAlert className="mt-1 h-4 w-4 shrink-0 text-amber-800" aria-hidden /><span><strong>Проверить:</strong> {active.caution}</span></p>
          </div>
          <p className="text-xs text-stone-600 md:max-w-56">{active.caption}</p>
        </div>
      </div>
    </section>
  );
}
