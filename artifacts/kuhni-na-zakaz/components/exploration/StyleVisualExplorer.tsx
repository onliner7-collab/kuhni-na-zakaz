"use client";

import { useRef, useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import type { StyleFamilyConfig, StyleVisualFrame } from "@/data/exploration-families";
import { useExploreContext } from "./ExploreContext";

export function StyleVisualExplorer({ config }: { config: StyleFamilyConfig }) {
  const frames = config.visualFrames ?? [];
  const [activeId, setActiveId] = useState(frames[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { updateContext } = useExploreContext();
  const active = frames.find((frame) => frame.id === activeId) ?? frames[0];

  function choose(frame: StyleVisualFrame) {
    setActiveId(frame.id);
    updateContext({ style: `${config.h1}: ${frame.label}` }, `style_visual:${frame.id}`);
  }

  function moveSelection(index: number) {
    const next = frames[(index + frames.length) % frames.length];
    if (!next) return;
    choose(next);
    tabRefs.current[(index + frames.length) % frames.length]?.focus();
  }

  if (!active) return null;

  return (
    <section
      aria-labelledby={`${config.slug}-visual-title`}
      data-series-id={config.seriesId}
      data-dock-suppress
      className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm"
    >
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
            className="aspect-[2/3] h-auto w-full object-cover motion-safe:animate-[fade-in_.22s_ease-out] sm:aspect-[3/2]"
          />
        </picture>
        <span className="absolute left-3 top-3 rounded-full bg-stone-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          AI-визуализация
        </span>
      </div>

      <div className="p-4 md:p-6">
        <h2 id={`${config.slug}-visual-title`} className="text-xl font-black text-stone-950 md:text-2xl">
          {config.question}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" role="tablist" aria-label="Состояния визуальной серии">
          {frames.map((frame, index) => {
            const selected = frame.id === active.id;
            return (
              <button
                key={frame.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`${config.slug}-tab-${frame.id}`}
                aria-controls={`${config.slug}-panel`}
                aria-selected={selected}
                data-frame-id={frame.id}
                aria-pressed={selected}
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
                className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 ${
                  selected
                    ? "border-stone-950 bg-stone-950 text-white"
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

        <div
          id={`${config.slug}-panel`}
          role="tabpanel"
          aria-labelledby={`${config.slug}-tab-${active.id}`}
          aria-live="polite"
          className="mt-4 min-h-40 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-stone-800"
        >
          <p className="font-bold">{active.result}</p>
          <p className="mt-1 flex gap-2">
            <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-violet-800" aria-hidden />
            <span><strong>Проверить:</strong> {active.caution}</span>
          </p>
          <p className="mt-2 text-xs text-stone-600">{active.caption}</p>
        </div>
      </div>
    </section>
  );
}
