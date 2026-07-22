"use client";

import { useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import { useExploreContext } from "@/components/exploration/ExploreContext";

const frames = [
  {
    id: "closeup",
    label: "Крупный план",
    webp: "/media/pilots/mdf-fasady/webp/mdf-surface-closeup.webp",
    avif: "/media/pilots/mdf-fasady/avif/mdf-surface-closeup.avif",
    alt: "Крупный план матовой поверхности рамочного фасада МДФ",
    note: "Начните с профиля и того, как поверхность выглядит вблизи.",
  },
  {
    id: "finish",
    label: "Матовая / глянцевая",
    webp: "/media/pilots/mdf-fasady/webp/mdf-surface-compare.webp",
    avif: "/media/pilots/mdf-fasady/avif/mdf-surface-compare.avif",
    alt: "Матовая и глянцевая поверхности фасадов МДФ рядом",
    note: "Экран показывает характер отражения, но не подтверждает точную степень блеска.",
  },
  {
    id: "daylight",
    label: "Дневной свет",
    webp: "/media/visual-rescue/mdf-fasady/webp/mdf-surface-daylight.webp",
    avif: "/media/visual-rescue/mdf-fasady/avif/mdf-surface-daylight.avif",
    alt: "Поверхность фасада МДФ при боковом дневном свете",
    note: "Холодный боковой свет подчёркивает микрофактуру и меняет восприятие оттенка.",
  },
  {
    id: "warm-light",
    label: "Тёплый свет",
    webp: "/media/visual-rescue/mdf-fasady/webp/mdf-surface-warm-light.webp",
    avif: "/media/visual-rescue/mdf-fasady/avif/mdf-surface-warm-light.avif",
    alt: "Та же поверхность фасада МДФ при тёплом искусственном свете",
    note: "Тёплое освещение визуально меняет один и тот же нейтральный фасад.",
  },
  {
    id: "combination",
    label: "В сочетании",
    webp: "/media/pilots/mdf-fasady/webp/mdf-surface-combination.webp",
    avif: "/media/pilots/mdf-fasady/avif/mdf-surface-combination.avif",
    alt: "Фасад МДФ рядом с образцами светлого камня и натурального дерева",
    note: "Сопоставляйте образец со столешницей и окружением проекта.",
  },
  {
    id: "cutaway",
    label: "Торец и разрез",
    webp: "/media/pilots/mdf-fasady/webp/mdf-surface-cutaway.webp",
    avif: "/media/pilots/mdf-fasady/avif/mdf-surface-cutaway.avif",
    alt: "Условная схема основы, покрытия и торца фасада МДФ",
    note: "Это условная иллюстрация: состав выбранного фасада подтверждается документацией.",
  },
] as const;

export function MaterialSurfaceComparator() {
  const [activeId, setActiveId] = useState<(typeof frames)[number]["id"]>("closeup");
  const { updateContext } = useExploreContext();
  const active = frames.find((frame) => frame.id === activeId) ?? frames[0];

  function select(frame: (typeof frames)[number]) {
    setActiveId(frame.id);
    updateContext({ materials: ["МДФ", frame.label] }, `surface_visual:${frame.id}`);
    window.dispatchEvent(new CustomEvent("mdf-surface-answers", {
      detail: {
        material: "МДФ",
        selectedSurfaces: [frame.label],
        evidenceStatus: "requires-sample-confirmation",
      },
    }));
  }

  return (
    <section id="surface" data-interaction-role="material-surface-compare" className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm" aria-labelledby="surface-title">
      <figure className="relative bg-stone-200">
        <picture key={active.id}>
          <source srcSet={active.avif} type="image/avif" />
          <img src={active.webp} alt={active.alt} width="1200" height="800" fetchPriority="high" className="aspect-[4/5] h-auto w-full object-cover motion-safe:animate-[fade-in_.22s_ease-out] sm:aspect-[3/2]" />
        </picture>
        <span className="absolute left-3 top-3 rounded-full bg-violet-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">AI-визуализация</span>
      </figure>

      <div className="p-4 md:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Визуальное сравнение</p>
        <h2 id="surface-title" className="mt-2 text-2xl font-bold md:text-4xl">Посмотрите на один фасад по-разному</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Состояния поверхности фасада МДФ">
          {frames.map((frame) => {
            const selected = frame.id === active.id;
            return (
              <button key={frame.id} type="button" data-frame-id={frame.id} aria-pressed={selected} onClick={() => select(frame)} className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 ${selected ? "border-violet-900 bg-violet-900 text-white" : "border-stone-300 bg-stone-50 text-stone-950 hover:border-violet-700"}`}>
                <span className="flex items-center gap-2">{selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}{frame.label}</span>
              </button>
            );
          })}
        </div>
        <div role="status" aria-live="polite" className="mt-4 flex gap-3 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-stone-700">
          <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-violet-800" aria-hidden />
          <p><strong>{active.label}.</strong> {active.note} Точный цвет и поверхность проверяются по физическому образцу.</p>
        </div>
      </div>
    </section>
  );
}
