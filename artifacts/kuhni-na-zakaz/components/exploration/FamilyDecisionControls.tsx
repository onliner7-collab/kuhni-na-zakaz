"use client";

import { useState } from "react";
import type { ScenarioFamilyConfig, StyleFamilyConfig } from "@/data/exploration-families";
import { useExploreContext } from "./ExploreContext";

export function StyleVariantControls({ config }: { config: StyleFamilyConfig }) {
  const [selected, setSelected] = useState(0);
  const { updateContext } = useExploreContext();
  return <div className="rounded-3xl border border-stone-200 bg-white p-5">
    <h2 className="text-2xl font-black">Какое настроение ближе?</h2>
    <p className="mt-2 text-sm text-stone-600">Выбор сохраняется как контекст, но не создаёт новый индексируемый URL.</p>
    <div role="group" aria-label="Варианты визуального направления" className="mt-4 grid gap-3 sm:grid-cols-3">
      {config.variants.map((label, index) => <button key={label} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); updateContext({ style: `${config.title}: ${label}` }, "style_variant_selected"); }} className="min-h-12 rounded-2xl border px-4 py-3 text-left font-bold outline-none transition hover:border-stone-950 focus-visible:ring-2 focus-visible:ring-stone-950 aria-pressed:border-stone-950 aria-pressed:bg-stone-950 aria-pressed:text-white motion-reduce:transition-none">{label}</button>)}
    </div>
    <p role="status" aria-live="polite" className="mt-4 rounded-2xl bg-stone-100 p-4 text-sm"><strong>Выбрано:</strong> {config.variants[selected]}. Проверьте этот вариант на физических образцах при дневном и вечернем свете.</p>
  </div>;
}

export function ScenarioDecisionControls({ config }: { config: ScenarioFamilyConfig }) {
  const [selected, setSelected] = useState(0);
  const { updateContext } = useExploreContext();
  const active = config.priorities[selected];
  return <div className="rounded-3xl border border-stone-200 bg-white p-5">
    <h2 className="text-2xl font-black">Что нельзя потерять?</h2>
    <p className="mt-2 text-sm text-stone-600">Выберите один главный приоритет. Это подсказка для следующей проверки, а не обещание результата.</p>
    <div role="group" aria-label="Приоритет сценария" className="mt-4 grid gap-3 sm:grid-cols-3">
      {config.priorities.map((item,index)=><button key={item.label} type="button" aria-pressed={selected===index} onClick={()=>{setSelected(index);updateContext({scenario:config.h1},`scenario_priority:${item.label}`)}} className="min-h-12 rounded-2xl border px-4 py-3 text-left font-bold outline-none hover:border-stone-950 focus-visible:ring-2 focus-visible:ring-stone-950 aria-pressed:border-stone-950 aria-pressed:bg-stone-950 aria-pressed:text-white">{item.label}</button>)}
    </div>
    <div role="status" aria-live="polite" className="mt-4 rounded-2xl bg-amber-50 p-4"><p className="font-bold">Результат выбора</p><p className="mt-1 text-sm text-stone-700">{active.result}</p><div className="mt-3 flex flex-wrap gap-2">{[...active.layouts,...active.materials].map(link=><a key={link.href} href={link.href} className="min-h-11 rounded-full border border-amber-900/20 bg-white px-4 py-3 text-sm font-bold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">{link.label}</a>)}</div></div>
  </div>;
}
