"use client";

import { useExploreContext } from "./ExploreContext";

const labels: Record<string, string> = { layout: "Планировка", style: "Стиль", scenario: "Сценарий", location: "Локация", budgetIntent: "Цель по бюджету", evidencePreference: "Предпочтение" };
export function ContextSummary() {
  const { context, clearContext } = useExploreContext();
  const entries = Object.entries(context).filter(([key, value]) => !["sourceRoute", "lastMeaningfulAction", "materials", "hardware"].includes(key) && value);
  const materials = [...(context.materials || []), ...(context.hardware || [])];
  if (!entries.length && !materials.length) return <p className="text-sm text-stone-600">Выбор пока не сохранён — начните с планировки и уточните параметры по ходу.</p>;
  return <div data-component="ContextSummary" className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black">Ваш текущий выбор</h3><button type="button" onClick={() => clearContext()} className="min-h-11 rounded-full border px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">Очистить</button></div><dl className="mt-3 grid gap-2 text-sm">{entries.map(([key, value]) => <div key={key} className="flex justify-between gap-4"><dt className="text-stone-600">{labels[key] || key}</dt><dd className="text-right font-bold">{key === "evidencePreference" ? (value === "real" ? "реальные работы" : "идеи") : String(value)}</dd></div>)}{materials.length ? <div className="flex justify-between gap-4"><dt className="text-stone-600">Материалы и механизмы</dt><dd className="text-right font-bold">{materials.join(", ")}</dd></div> : null}</dl></div>;
}
