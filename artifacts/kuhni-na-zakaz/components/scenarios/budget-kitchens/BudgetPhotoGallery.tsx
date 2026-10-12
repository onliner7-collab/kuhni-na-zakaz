"use client";

import { useId, useState } from "react";
import { budgetImage } from "@/data/budget-kitchens";

export type BudgetAngle = { image: string; label: string; alt: string; caption: string };

export function BudgetPhotoGallery({ title, angles }: { title: string; angles: BudgetAngle[] }) {
  const [selected, setSelected] = useState(0);
  const imageId = useId();
  const active = angles[selected];
  return <figure data-budget-gallery className="min-w-0 bg-stone-100 text-stone-950">
    <img id={imageId} src={budgetImage(active.image)} alt={active.alt} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
    <div role="group" aria-label={`Ракурсы: ${title}`} className="grid grid-cols-2 gap-2 p-3">{angles.map((angle, index) => <button key={angle.image} type="button" aria-pressed={selected === index} aria-controls={imageId} onClick={() => setSelected(index)} className={`flex min-h-14 min-w-0 items-center gap-2 rounded-xl border-2 p-2 text-left text-xs font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${selected === index ? "border-amber-700 bg-white" : "border-transparent bg-white/70 hover:border-stone-400"}`}><img src={budgetImage(angle.image).replace(".webp", "-thumb.webp")} alt="" width={80} height={53} loading="lazy" className="hidden aspect-[3/2] w-16 shrink-0 rounded-lg object-cover sm:block" /><span>{angle.label}</span></button>)}</div>
    <figcaption aria-live="polite" className="px-4 pb-4 text-sm leading-6 text-stone-600">{active.caption}</figcaption>
  </figure>;
}
