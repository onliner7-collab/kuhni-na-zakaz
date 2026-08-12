"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, CircleAlert } from "lucide-react";

import Link from "@/components/navigation/Link";
import { useExploreContext } from "@/components/exploration";
import { trackExplorationEvent } from "@/lib/analytics";
import type { LocationVisualSeries, LocationVisualState } from "@/types/location-visual";

import { LocationVisualStage } from "./LocationVisualStage";

const routeLabels: Record<string, string> = {
  "/catalog/malenkie-kuhni": "Посмотреть маленькие кухни",
  "/catalog/uglovye-kuhni": "Сравнить угловые кухни",
  "/catalog/pryamye-kuhni": "Сравнить прямые кухни",
  "/catalog/kuhni-do-potolka": "Посмотреть кухни до потолка",
  "/scenarios/dlya-semi": "Открыть решения для семьи",
  "/scenarios": "Сравнить сценарии кухни",
  "/styles/sovremennye": "Сравнить современные кухни",
  "/catalog/kuhni-s-ostrovom": "Посмотреть кухни с островом",
  "/materials/mdf-fasady": "Сравнить фасады МДФ",
  "/design-proekt-kuhni": "Подготовить дизайн-проект",
  "/materials/furnitura": "Выбрать механизмы и ящики",
  "/delivery-installation": "Узнать о доставке и монтаже",
  "/calculator": "Рассчитать ориентир",
};

export function LocationVisualExplorer({
  config,
  initialStage,
}: {
  config: LocationVisualSeries;
  initialStage: ReactNode;
}) {
  const initial = config.states.find((state) => state.id === config.initialStateId) ?? config.states[0];
  const [activeId, setActiveId] = useState(initial.id);
  const [imageError, setImageError] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { updateContext } = useExploreContext();
  const active = config.states.find((state) => state.id === activeId) ?? initial;

  useEffect(() => setIsHydrated(true), []);

  function choose(state: LocationVisualState) {
    setActiveId(state.id);
    setImageError(false);
    updateContext(
      { location: `${config.city}: ${state.controlLabelRu}` },
      `location_visual:${config.route}:${state.id}`,
    );
    trackExplorationEvent("exploration_select", {
      source_route: config.route,
      selected_dimension: "location",
      from_state: state.id,
    });
  }

  function moveSelection(index: number) {
    const normalized = (index + config.states.length) % config.states.length;
    const next = config.states[normalized];
    if (!next) return;
    choose(next);
    tabRefs.current[normalized]?.focus();
  }

  return (
    <section
      aria-labelledby={`${config.seriesId}-title`}
      data-location-visual-explorer
      data-series-id={config.seriesId}
      data-dock-suppress
      className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white text-stone-950 shadow-2xl shadow-black/15"
    >
      {active.id === config.initialStateId ? (
        initialStage
      ) : (
        <LocationVisualStage
          state={active}
          eager={false}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      )}

      <div className="p-4 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-800">Выберите сценарий</p>
        <h2 id={`${config.seriesId}-title`} className="mt-2 text-xl font-black md:text-2xl">
          {config.userQuestion}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Состояния кухни">
          {config.states.map((state, index) => {
            const selected = state.id === active.id;
            return (
              <button
                key={state.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                type="button"
                disabled={!isHydrated}
                role="tab"
                id={`${config.seriesId}-tab-${state.id}`}
                aria-controls={`${config.seriesId}-panel`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-visual-state={state.id}
                onClick={() => choose(state)}
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
                    moveSelection(config.states.length - 1);
                  }
                }}
                className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 ${
                  selected
                    ? "border-stone-950 bg-stone-950 text-white"
                    : "border-stone-300 bg-stone-50 text-stone-950 hover:border-stone-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
                  {state.controlLabelRu}
                  {selected ? <span className="sr-only">, выбрано</span> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${config.seriesId}-panel`}
          role="tabpanel"
          aria-labelledby={`${config.seriesId}-tab-${active.id}`}
          aria-live="polite"
          className="mt-4 min-h-36 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-stone-800"
        >
          {imageError ? (
            <p className="flex gap-2 font-bold text-red-800" role="alert">
              <CircleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden />
              Изображение не загрузилось. Выбор и следующие шаги остаются доступными.
            </p>
          ) : null}
          <h3 className="font-black text-stone-950">{active.titleRu}</h3>
          <p className="mt-1">{active.consequenceRu}</p>
          <p className="mt-2 text-xs text-stone-600">{active.disclosureRu}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.nextRoutes.map((route) => (
              <Link
                key={route}
                href={route}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 font-bold text-violet-900 hover:border-violet-500"
              >
                {routeLabels[route] ?? "Открыть следующий шаг"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
