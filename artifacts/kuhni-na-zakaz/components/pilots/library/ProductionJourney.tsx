"use client";

import { useId, useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { LabeledOption } from "./types";

interface ProductionJourneyProps { steps: [LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption]; }

export function ProductionJourney({ steps }: ProductionJourneyProps) {
  const [activeId, setActiveId] = useState(steps[0].id);
  const baseId = useId();
  return (
    <section data-component="ProductionJourney" className="relative rounded-3xl bg-[#e8f1ed] p-4 sm:p-6">
      <h2 className="text-2xl font-black text-[#17382c]">Путь заказа: семь понятных этапов</h2>
      <ol className="mt-5 grid gap-3 lg:grid-cols-7">
        {steps.map((step, index) => {
          const isActive = activeId === step.id;
          return <li key={step.id} className="min-w-0"><button type="button" aria-expanded={isActive} aria-controls={`${baseId}-${step.id}`} onClick={() => setActiveId(step.id)} className="min-h-11 w-full rounded-xl border bg-white p-3 text-left"><span className="text-xs font-black text-emerald-800">{index + 1}</span><span className="ml-2 font-bold">{step.label}</span></button>{isActive ? <div id={`${baseId}-${step.id}`} className="mt-2 rounded-2xl bg-white p-4 lg:absolute lg:left-0 lg:right-0"><p>{step.description}</p>{step.media ? <figure className="mt-3 max-w-xl"><div className="aspect-[3/2] overflow-hidden rounded-xl"><MediaPicture media={step.media} /></div><figcaption className="mt-2 text-sm text-stone-600">{step.media.caption}</figcaption></figure> : <p className="mt-2 text-sm text-stone-600">Для этого этапа используется текстовый fallback: готовое медиа ещё не зарегистрировано.</p>}</div> : null}</li>;
        })}
      </ol>
      <div className="h-0 lg:h-72" aria-hidden="true" />
    </section>
  );
}
