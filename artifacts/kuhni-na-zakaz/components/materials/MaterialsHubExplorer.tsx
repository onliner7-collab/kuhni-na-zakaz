"use client";

import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { useState } from "react";
import { useExploreContext } from "@/components/exploration";
import { MATERIAL_HUB_OPTIONS } from "@/data/material-exploration";

export function MaterialsHubExplorer() {
  const [activeSlug, setActiveSlug] = useState(MATERIAL_HUB_OPTIONS[0].slug);
  const { updateContext } = useExploreContext();
  const active = MATERIAL_HUB_OPTIONS.find((item) => item.slug === activeSlug) ?? MATERIAL_HUB_OPTIONS[0];

  function select(item: (typeof MATERIAL_HUB_OPTIONS)[number]) {
    setActiveSlug(item.slug);
    updateContext({ materials: [item.material], sourceRoute: "/materials" }, `material_hub:${item.slug}`);
  }

  return (
    <section data-interaction-role="materials-hub-explorer" className="mb-12 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm" aria-labelledby="materials-hub-title">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <figure className="relative bg-stone-100">
          <Image key={active.slug} src={active.image} alt={active.alt} width={1200} height={800} priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 60vw" className="aspect-[3/2] h-full w-full object-cover motion-safe:animate-[fade-in_.22s_ease-out]" />
          <span className="absolute left-3 top-3 rounded-full bg-violet-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">AI-визуализация</span>
        </figure>
        <div className="p-5 md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Начните с внешнего вида</p>
          <h2 id="materials-hub-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Какой характер фасада вам ближе?</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Выберите материал, чтобы увидеть визуальный ориентир и перейти к подробной проверке.</p>
          <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Материалы кухонных фасадов">
            {MATERIAL_HUB_OPTIONS.map((item) => {
              const selected = item.slug === active.slug;
              return <button key={item.slug} type="button" aria-pressed={selected} onClick={() => select(item)} className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 ${selected ? "border-violet-900 bg-violet-900 text-white" : "border-stone-300 bg-stone-50 text-stone-950 hover:border-violet-700"}`}>{selected ? <Check className="mr-2 inline h-4 w-4" aria-hidden /> : null}{item.material}</button>;
            })}
          </div>
          <div role="status" aria-live="polite" className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-stone-700">
            <p className="font-bold text-stone-950">{active.result}</p>
            <p className="mt-2 flex gap-2"><CircleAlert className="mt-1 h-4 w-4 shrink-0 text-violet-800" aria-hidden /><span>Изображение — визуальная концепция. Цвет, фактуру и характеристики подтверждают по образцу и спецификации.</span></p>
            <Link href={active.href} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-violet-900 hover:underline">Проверить {active.material} подробнее <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
