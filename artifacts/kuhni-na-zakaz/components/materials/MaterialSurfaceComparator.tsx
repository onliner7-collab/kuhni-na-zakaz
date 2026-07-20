"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useExploreContext } from "@/components/exploration/ExploreContext";

const surfaces = [
  { id: "matte", label: "Матовая", note: "Смотрите образец при разном освещении и под углом.", image: "mdf-surface-closeup", alt: "Крупный план матовой поверхности фасада МДФ" },
  { id: "semi", label: "Полуматовая", note: "Сравните визуальный отклик рядом с выбранной столешницей.", image: "mdf-surface-combination", alt: "Фасад МДФ рядом с образцами дерева и светлого камня" },
  { id: "gloss", label: "Глянцевая", note: "Проверьте отражение на реальном образце в помещении.", image: "mdf-surface-compare", alt: "Матовая и глянцевая поверхности фасадов МДФ рядом" },
] as const;

export function MaterialSurfaceComparator() {
  const [selected, setSelected] = useState<(typeof surfaces)[number]["id"][]>(["matte", "gloss"]);
  const { updateContext } = useExploreContext();

  function toggle(id: (typeof surfaces)[number]["id"]) {
    setSelected((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2);
      const selectedSurfaces = next.map((item) => surfaces.find((surface) => surface.id === item)?.label || item);
      updateContext({ materials: ["МДФ", ...selectedSurfaces] }, "surface_compare");
      window.dispatchEvent(new CustomEvent("mdf-surface-answers", { detail: { material: "МДФ", selectedSurfaces, evidenceStatus: "requires-sample-confirmation" } }));
      return next;
    });
  }

  return (
    <section id="surface" className="scroll-mt-24" aria-labelledby="surface-title">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Поверхность → крупный план</p>
      <h2 id="surface-title" className="mt-2 text-3xl font-bold md:text-4xl">Сравните внешний вид поверхности</h2>
      <p className="mt-3 max-w-3xl leading-7 text-stone-600">Выберите до двух визуальных направлений. Экранные образцы условны: цвет, блеск и фактура подтверждаются только физическим образцом.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {surfaces.map((surface) => {
          const isSelected = selected.includes(surface.id);
          return <button key={surface.id} type="button" aria-pressed={isSelected} onClick={() => toggle(surface.id)} className={`min-h-44 rounded-2xl border p-4 text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-700 ${isSelected ? "border-violet-800 bg-violet-50" : "border-stone-200 bg-white"}`}>
            <img src={`/media/pilots/mdf-fasady/webp/${surface.image}.webp`} alt={surface.alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] h-auto w-full rounded-xl object-cover" />
            <span className="mt-2 block text-xs text-stone-500">AI-концепт поверхности</span>
            <span className="mt-4 flex items-center gap-2 font-bold">{isSelected && <Check className="h-4 w-4" aria-hidden />}{surface.label}</span>
            <span className="mt-2 block text-sm leading-6 text-stone-600">{surface.note}</span>
          </button>;
        })}
      </div>
      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5" aria-live="polite"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold">В сравнении: {selected.length ? selected.map((id) => surfaces.find((surface) => surface.id === id)?.label).join(" и ") : "ничего не выбрано"}</p><button type="button" onClick={() => { setSelected([]); updateContext({ materials: ["МДФ"] }, "surface_compare_clear"); window.dispatchEvent(new CustomEvent("mdf-surface-answers", { detail: { material: "МДФ", selectedSurfaces: [], evidenceStatus: "requires-sample-confirmation" } })); }} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-700"><RotateCcw className="h-4 w-4" aria-hidden />Очистить</button></div><p className="mt-2 text-sm leading-6 text-stone-600">Сравнение фиксирует только визуальное направление. Оно не подтверждает уход, долговечность, цену или совместимость.</p></div>
    </section>
  );
}
