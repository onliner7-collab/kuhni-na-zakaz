"use client";

import type { ExploreContextState } from "@/lib/exploration-types";
import { useExploreContext } from "./ExploreContext";

type VisibleContextKey = Exclude<keyof ExploreContextState, "sourceRoute" | "lastMeaningfulAction">;

const labels: Record<VisibleContextKey, string> = {
  layout: "Планировка",
  style: "Стиль",
  materials: "Материалы",
  hardware: "Фурнитура",
  scenario: "Сценарий",
  location: "Город",
  budgetIntent: "Бюджетное намерение",
  evidencePreference: "Предпочтение",
};

const visibleKeys = Object.keys(labels) as VisibleContextKey[];

function displayValue(key: VisibleContextKey, value: string | string[]) {
  if (key === "evidencePreference") return value === "real" ? "реальные работы" : "идеи";
  return Array.isArray(value) ? value.join(", ") : value;
}

export function ContextSummary() {
  const { context, clearContext } = useExploreContext();
  const entries = visibleKeys.flatMap((key) => {
    const value = context[key];
    if (!value || (Array.isArray(value) && !value.length)) return [];
    return [{ key, value }];
  });
  if (!entries.length) return <p className="text-sm text-stone-600">Выбор пока не сохранён — начните с планировки и уточните параметры по ходу.</p>;
  return <div data-component="ContextSummary" className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black">Ваш текущий выбор</h3><button type="button" onClick={() => clearContext()} className="min-h-11 rounded-full border px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">Очистить всё</button></div><dl className="mt-3 grid gap-2 text-sm">{entries.map(({ key, value }) => <div key={key} className="flex min-h-11 items-center justify-between gap-4"><dt className="text-stone-600">{labels[key]}</dt><dd className="flex items-center justify-end gap-2 text-right font-bold"><span>{displayValue(key, value)}</span><button type="button" onClick={() => clearContext(key)} aria-label={`Очистить поле «${labels[key]}»`} className="grid size-11 shrink-0 place-items-center rounded-full border border-stone-300 text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">×</button></dd></div>)}</dl></div>;
}
