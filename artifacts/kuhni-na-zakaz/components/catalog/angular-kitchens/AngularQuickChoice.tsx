"use client";

import { useRef, useState } from "react";

type Choice = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const choices: Choice[] = [
  {
    id: "overview",
    label: "Две стены",
    title: "Сначала посмотрим на всю планировку",
    description: "Общий вид помогает оценить связь длинного и короткого плеча до выбора механизма.",
    image: "/media/pilots/angular-kitchens/gallery/angular-kitchens-angles-full-room-front-landscape-v1.webp",
    alt: "Общий вид светлой угловой кухни с двумя рабочими стенами",
  },
  {
    id: "work-zone",
    label: "Рабочая зона",
    title: "Выделим место для подготовки",
    description: "Рабочая поверхность остаётся на прямом участке, а угол не мешает основному маршруту.",
    image: "/media/pilots/angular-kitchens/webp/angular-kitchens-angles-long-side-landscape.webp",
    alt: "Длинное плечо угловой кухни с рабочей поверхностью",
  },
  {
    id: "corner",
    label: "Угол",
    title: "Проверим, что происходит в углу",
    description: "В углу можно оставить рабочую поверхность, разместить мойку или организовать хранение.",
    image: "/media/pilots/angular-kitchens/gallery/angular-corner-types-straight-corner-front-01-v1.webp",
    alt: "Угловой модуль кухни с рабочей поверхностью",
  },
];

export function AngularQuickChoice() {
  const [activeId, setActiveId] = useState(choices[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = choices.find((choice) => choice.id === activeId) ?? choices[0];

  function moveSelection(index: number) {
    const nextIndex = (index + choices.length) % choices.length;
    setActiveId(choices[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="angular-quick-choice-title">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">Первый выбор</p>
      <h2 id="angular-quick-choice-title" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Что нужно увидеть в угловой кухне?</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Нажмите один вариант — изображение покажет соответствующую зону. Остальные параметры пока не меняются.</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Первый визуальный выбор">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`angular-quick-choice-tab-${choice.id}`}
            aria-selected={activeId === choice.id}
            aria-controls="angular-quick-choice-panel"
            tabIndex={activeId === choice.id ? 0 : -1}
            onClick={() => setActiveId(choice.id)}
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
                moveSelection(choices.length - 1);
              }
            }}
            className="min-h-12 rounded-xl border border-stone-300 px-4 py-3 text-left text-sm font-black transition aria-selected:border-stone-950 aria-selected:bg-stone-950 aria-selected:text-white motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div id="angular-quick-choice-panel" role="tabpanel" aria-labelledby={`angular-quick-choice-tab-${active.id}`} aria-live="polite" className="mt-5 grid overflow-hidden rounded-2xl bg-stone-100 md:grid-cols-[1.1fr_.9fr] md:items-center">
        <figure className="min-w-0">
          <img src={active.image} alt={active.alt} width="1200" height="800" loading="lazy" decoding="async" className="block aspect-[3/2] h-auto w-full object-cover" />
          <figcaption className="border-t border-stone-200 px-4 py-3 text-xs leading-5 text-stone-600">Сгенерированная визуализация — не фотография готовой кухни.</figcaption>
        </figure>
        <div className="min-w-0 border-t border-stone-200 p-5 sm:p-6 md:border-l md:border-t-0">
          <h3 className="text-xl font-black">{active.title}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-700">{active.description}</p>
          <a href="#planning" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-black focus-visible:outline focus-visible:ring-2 focus-visible:ring-stone-950">Продолжить выбор</a>
        </div>
      </div>
    </section>
  );
}
