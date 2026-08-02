"use client";

import { useRef, useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import type { ScenarioFamilyConfig, ScenarioVisualFrame } from "@/data/exploration-families";
import { useExploreContext } from "./ExploreContext";

export function ScenarioVisualExplorer({ config }: { config: ScenarioFamilyConfig }) {
  const frames = config.visualFrames ?? [];
  const [activeId, setActiveId] = useState(frames[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { updateContext } = useExploreContext();
  const active = frames.find((frame) => frame.id === activeId) ?? frames[0];

  function choose(frame: ScenarioVisualFrame) {
    setActiveId(frame.id);
    updateContext({ scenario: `${config.h1}: ${frame.label}` }, `scenario_visual:${frame.id}`);
  }

  function moveSelection(index: number) {
    const nextIndex = (index + frames.length) % frames.length;
    const next = frames[nextIndex];
    if (!next) return;
    choose(next);
    tabRefs.current[nextIndex]?.focus();
  }

  if (!active || !config.seriesId) return null;

  return (
    <section
      aria-labelledby={`${config.slug}-visual-title`}
      data-series-id={config.seriesId}
      data-dock-suppress
      className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm md:grid md:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.65fr)] md:grid-rows-[auto_1fr]"
    >
      <div className="min-w-0 p-4 md:col-start-2 md:row-start-1 md:p-6 md:pb-3">
        <h2 id={`${config.slug}-visual-title`} className="text-xl font-black text-stone-950 md:text-2xl">
          {config.question}
        </h2>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible"
          role="tablist"
          aria-label="Состояния визуального сценария"
        >
          {frames.map((frame, index) => {
            const selected = frame.id === active.id;
            return (
              <button
                key={frame.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${config.slug}-tab-${frame.id}`}
                aria-controls={`${config.slug}-panel`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-frame-id={frame.id}
                onClick={() => choose(frame)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    moveSelection(index + 1);
                  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    moveSelection(index - 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    moveSelection(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    moveSelection(frames.length - 1);
                  }
                }}
                className={`min-h-12 min-w-[6.75rem] rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 md:min-w-0 ${
                  selected
                    ? "border-emerald-900 bg-emerald-950 text-white"
                    : "border-stone-300 bg-stone-50 text-stone-950 hover:border-stone-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
                  {frame.label}
                  {selected ? <span className="sr-only">, выбрано</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-[clamp(21rem,52vh,28rem)] bg-stone-200 md:col-start-1 md:row-span-2 md:row-start-1 md:aspect-[3/2] md:h-auto">
        <picture key={active.id} className="block h-full w-full">
          <source srcSet={active.avif} type="image/avif" />
          <img
            src={active.webp}
            alt={active.alt}
            width="1200"
            height="800"
            sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1200px) 62vw, 820px"
            loading={active.id === frames[0]?.id ? "eager" : "lazy"}
            fetchPriority={active.id === frames[0]?.id ? "high" : "auto"}
            decoding={active.id === frames[0]?.id ? undefined : "async"}
            style={{ objectPosition: active.objectPosition }}
            className={`block h-full w-full object-cover ${
              active.id === frames[0]?.id
                ? ""
                : "motion-safe:animate-[fade-in_.2s_ease-out]"
            }`}
          />
        </picture>
        <span className="absolute left-3 top-3 rounded-full bg-stone-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          Визуализация, созданная нейросетью
        </span>
      </div>

      <div
        id={`${config.slug}-panel`}
        role="tabpanel"
        aria-labelledby={`${config.slug}-tab-${active.id}`}
        aria-live="polite"
        className="m-4 min-h-[13.75rem] rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-stone-800 md:col-start-2 md:row-start-2 md:mt-0 md:min-h-36 md:self-start"
      >
        <p className="font-bold">{active.result}</p>
        <p className="mt-1 flex gap-2">
          <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-emerald-800" aria-hidden />
          <span>
            <strong>Проверить:</strong> {active.caution}
          </span>
        </p>
        <p className="mt-2 text-xs text-stone-600">{active.caption}</p>
      </div>
    </section>
  );
}
