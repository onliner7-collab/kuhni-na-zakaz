"use client";

import { useState } from "react";
import { Check, ArrowLeftRight, Eye, EyeOff } from "lucide-react";
import { useExploreContext } from "@/components/exploration";
import { smallKitchenPriorities, smallPriorityImage, type SmallKitchenPriority } from "@/data/small-kitchens";

function PriorityImage({ item, marked, priority = false }: { item: SmallKitchenPriority; marked: boolean; priority?: boolean }) {
  return (
    <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
      <picture>
        <source srcSet={smallPriorityImage(item.id, "avif")} type="image/avif" />
        <img src={smallPriorityImage(item.id)} alt={item.visible} width={1200} height={800}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-contain" />
      </picture>
      {marked && item.zones.length > 0 ? (
        <svg aria-hidden="true" viewBox="0 0 1200 800" className="pointer-events-none absolute inset-0 h-full w-full" data-zone-overlay={item.id}>
          {item.zones.map(zone => <g key={zone.number}>
            <polygon points={zone.points} fill="rgba(251,191,36,.22)" stroke="#fbbf24" strokeWidth="5" strokeLinejoin="round" />
            <circle cx={zone.x} cy={zone.y} r="25" fill="#1c1917" stroke="#fff" strokeWidth="3" />
            <text x={zone.x} y={zone.y + 8} textAnchor="middle" fill="white" fontSize="25" fontWeight="800">{zone.number}</text>
          </g>)}
        </svg>
      ) : null}
    </div>
  );
}

export function SmallKitchenExplorer() {
  const [activeId, setActiveId] = useState("overview");
  const [compare, setCompare] = useState(false);
  const [marked, setMarked] = useState(true);
  const { updateContext } = useExploreContext();
  const active = smallKitchenPriorities.find(item => item.id === activeId)!;

  function choose(item: SmallKitchenPriority) {
    setActiveId(item.id);
    updateContext({ scenario: `Маленькая кухня: ${item.label}` }, `small-kitchen-priority:${item.id}`);
  }

  return (
    <section aria-labelledby="small-priority-heading" data-testid="small-priority-explorer" className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 md:px-6">
        <h2 id="small-priority-heading" className="text-lg font-black md:text-xl">Что важно в вашей маленькой кухне?</h2>
        <span className="text-xs text-stone-500">Выберите зону — посмотрите, что меняется</span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 pb-4 sm:grid-cols-6 md:px-6" aria-label="Приоритет маленькой кухни">
        {smallKitchenPriorities.map(item => (
          <button type="button" key={item.id} aria-pressed={active.id === item.id} aria-controls="small-priority-result"
            onClick={() => choose(item)} data-priority={item.id}
            className={`min-h-14 min-w-0 rounded-xl border p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 ${active.id === item.id ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-500"}`}>
            <span className="flex items-center gap-1 text-xs font-bold sm:text-sm">{active.id === item.id ? <Check size={14} aria-hidden className="hidden shrink-0 sm:block" /> : null}{item.label}</span>
            <span className={`mt-1 hidden text-[11px] leading-4 sm:block ${active.id === item.id ? "text-stone-300" : "text-stone-500"}`}>{item.short}</span>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          {compare && active.id !== "overview" ? (
            <div className="grid gap-2 p-3 sm:grid-cols-2" data-testid="small-priority-comparison">
              <figure><PriorityImage item={smallKitchenPriorities[0]} marked={false} /><figcaption className="p-2 text-sm font-bold">Исходный вид: всё закрыто</figcaption></figure>
              <figure><PriorityImage item={active} marked={marked} /><figcaption className="p-2 text-sm font-bold">Ваш выбор: {active.label.toLowerCase()}</figcaption></figure>
            </div>
          ) : <PriorityImage item={active} marked={marked} priority={active.id === "overview"} />}
          <div className="flex flex-wrap gap-2 p-3">
            <button type="button" onClick={() => setCompare(!compare)} aria-pressed={compare} disabled={active.id === "overview"}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:ring-amber-600 disabled:opacity-40">
              <ArrowLeftRight size={16} aria-hidden />{compare ? "Один крупный вид" : "Сравнить с общим видом"}
            </button>
            <button type="button" onClick={() => setMarked(!marked)} aria-pressed={marked} disabled={!active.zones.length}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:ring-amber-600 disabled:opacity-40">
              {marked ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}{marked ? "Убрать подсветку" : "Подсветить зоны"}
            </button>
          </div>
          <p className="px-4 pb-4 text-xs leading-5 text-stone-500">Пример дизайна. Подсветка помогает увидеть выбранную зону; она не показывает точные размеры.</p>
        </div>
        <div id="small-priority-result" className="border-t border-stone-200 p-4 lg:border-l lg:border-t-0 md:p-6">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{active.label}</p>
            <h3 className="mt-2 text-xl font-black leading-snug md:text-2xl">{active.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-700">{active.visible}</p>
            {active.zones.length ? <ul className="mt-3 flex flex-wrap gap-2 text-xs font-bold">{active.zones.map(zone => <li key={zone.number} className="rounded-full bg-amber-100 px-3 py-2">{zone.number}. {zone.label}</li>)}</ul> : null}
          </div>
          <div className="mt-4 rounded-2xl bg-stone-50 p-4"><p className="text-xs font-black text-stone-900">Что получаем</p><p className="mt-1 text-sm leading-6 text-stone-700">{active.benefit}</p></div>
          <details key={active.id} className="mt-3 rounded-2xl border border-stone-200 p-4">
            <summary className="min-h-11 cursor-pointer content-center text-sm font-bold">Ограничения и что проверить по замеру</summary>
            <p className="mt-3 text-sm leading-6 text-stone-700">{active.tradeoff}</p>
            <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Перед заказом:</strong> {active.check}</p>
          </details>
          <a href="#small-kitchen-ideas" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-stone-950 px-4 py-3 text-sm font-bold text-white focus-visible:ring-2 focus-visible:ring-amber-600">Выбрать маленькую кухню ↓</a>
        </div>
      </div>
    </section>
  );
}
