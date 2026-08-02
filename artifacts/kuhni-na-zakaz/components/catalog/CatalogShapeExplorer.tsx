"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "@/components/navigation/Link";
import { useExploreContext } from "@/components/exploration";

export type CatalogShapeOption = {
  id: string;
  label: string;
  question: string;
  result: string;
  limitation: string;
  href: string;
  image: string;
  alt: string;
};

export function CatalogShapeExplorer({ options }: { options: CatalogShapeOption[] }) {
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { updateContext } = useExploreContext();
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  if (!selected) return null;

  function choose(option: CatalogShapeOption, focus = false) {
    setSelectedId(option.id);
    updateContext(
      { layout: option.label, sourceRoute: "/catalog" },
      `catalog-shape:${option.id}`,
    );
    if (focus) buttonRefs.current[options.indexOf(option)]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % options.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + options.length) % options.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    choose(options[nextIndex], true);
  }

  return (
    <section aria-labelledby="catalog-shape-title" className="mb-12 overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-950 text-white shadow-sm">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-5 sm:p-7 lg:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-300">Первый вопрос</p>
          <h2 id="catalog-shape-title" className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            Какая форма решает задачу помещения?
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-stone-300">
            Выберите ближайшую ситуацию. Изображение и ограничение изменятся сразу, а размеры всё равно нужно подтвердить на замере.
          </p>

          <div role="tablist" aria-label="Формы и задачи кухни" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {options.map((option, index) => {
              const active = option.id === selected.id;
              return (
                <button
                  key={option.id}
                  ref={(node) => { buttonRefs.current[index] = node; }}
                  type="button"
                  role="tab"
                  id={`catalog-shape-tab-${option.id}`}
                  aria-selected={active}
                  aria-controls="catalog-shape-result"
                  tabIndex={active ? 0 : -1}
                  onClick={() => choose(option)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${active ? "border-amber-300 bg-amber-300 text-stone-950" : "border-stone-600 bg-stone-900 text-white hover:border-stone-300"}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="catalog-shape-result"
          role="tabpanel"
          aria-labelledby={`catalog-shape-tab-${selected.id}`}
          className="grid min-h-[30rem] grid-rows-[minmax(16rem,1fr)_auto] bg-white text-stone-950 sm:min-h-[34rem]"
        >
          <div className="relative min-h-64 overflow-hidden bg-stone-200">
            <Image
              key={selected.image}
              src={selected.image}
              alt={selected.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-sm">
              Концепция, созданная нейросетью
            </span>
          </div>
          <div aria-live="polite" className="p-5 sm:p-6">
            <p className="text-sm font-bold text-amber-800">{selected.question}</p>
            <p className="mt-2 text-lg font-bold">{selected.result}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600"><strong>Проверить:</strong> {selected.limitation}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={selected.href} className="inline-flex min-h-12 items-center rounded-full bg-stone-950 px-5 py-3 font-bold text-white">
                Проверить выбранную форму
              </Link>
              <Link href="/design-proekt-kuhni" className="inline-flex min-h-12 items-center rounded-full border border-stone-300 px-5 py-3 font-bold">
                Передать выбор в проект
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
