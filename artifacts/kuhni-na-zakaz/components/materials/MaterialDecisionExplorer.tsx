"use client";

import Image from "next/image";
import { Check, CircleAlert } from "lucide-react";
import { useState } from "react";
import { useExploreContext } from "@/components/exploration";
import type { MaterialExplorationConfig, MaterialExplorationFrame } from "@/data/material-exploration";

export function MaterialDecisionExplorer({ config }: { config: MaterialExplorationConfig }) {
  const [activeId, setActiveId] = useState(config.frames[0].id);
  const { updateContext } = useExploreContext();
  const active = config.frames.find((frame) => frame.id === activeId) ?? config.frames[0];

  function select(frame: MaterialExplorationFrame) {
    setActiveId(frame.id);
    updateContext({ materials: [config.material, frame.label], sourceRoute: `/materials/${config.slug}` }, `material_visual:${config.slug}:${frame.id}`);
    window.dispatchEvent(new CustomEvent("material-exploration-answers", { detail: { material: config.material, selectedView: frame.label, evidenceStatus: "requires-sample-confirmation" } }));
  }

  return (
    <section id="material-explorer" data-interaction-role="material-decision-explorer" className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm" aria-labelledby="material-explorer-title">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <figure className="relative bg-stone-100">
          <Image key={active.id} src={active.image} alt={active.alt} width={1200} height={800} loading="lazy" sizes="(max-width: 1024px) 100vw, 60vw" className="aspect-[3/2] h-full w-full object-cover motion-safe:animate-[fade-in_.22s_ease-out]" />
          <span className="absolute left-3 top-3 rounded-full bg-violet-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">AI-визуализация</span>
        </figure>
        <div className="p-5 md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Визуальная проверка</p>
          <h2 id="material-explorer-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">{config.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{config.question}</p>
          <div className="mt-5 grid grid-cols-2 gap-2" aria-label={`Ракурсы материала ${config.material}`}>
            {config.frames.map((frame) => {
              const selected = frame.id === active.id;
              return <button key={frame.id} type="button" data-frame-id={frame.id} aria-pressed={selected} onClick={() => select(frame)} className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 ${selected ? "border-violet-900 bg-violet-900 text-white" : "border-stone-300 bg-stone-50 text-stone-950 hover:border-violet-700"}`}><span className="flex items-center gap-2">{selected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}{frame.label}</span></button>;
            })}
          </div>
          <div role="status" aria-live="polite" className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-stone-700">
            <p className="font-bold text-stone-950">{active.result}</p>
            <p className="mt-2 flex gap-2"><CircleAlert className="mt-1 h-4 w-4 shrink-0 text-violet-800" aria-hidden /><span>{active.caution} Точный цвет, фактуру и покрытие подтверждают по физическому образцу.</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
