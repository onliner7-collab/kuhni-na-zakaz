"use client";

import { useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { LabeledOption } from "./types";

interface MechanismComparisonProps { title: string; options: LabeledOption[]; onChange?: (id: string) => void; }

export function MechanismComparison({ title, options, onChange }: MechanismComparisonProps) {
  const [activeId, setActiveId] = useState(options[0]?.id || "");
  const active = options.find((option) => option.id === activeId) || options[0];
  return (
    <section data-component="MechanismComparison" className="rounded-3xl border p-4 sm:p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={title}>{options.map((option) => <button key={option.id} type="button" aria-pressed={option.id === active?.id} onClick={() => { setActiveId(option.id); onChange?.(option.id); }} className="min-h-11 rounded-xl border px-4 py-2 font-bold aria-pressed:bg-stone-900 aria-pressed:text-white">{option.label}</button>)}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-stone-100 p-4"><h3 className="font-black">{active?.label}</h3><p className="mt-2 text-stone-700">{active?.description}</p></div>{active?.media ? <figure><div className="aspect-[3/2] overflow-hidden rounded-2xl"><MediaPicture media={active.media} /></div><figcaption className="mt-2 text-sm text-stone-600">{active.media.caption}</figcaption></figure> : <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed p-4 text-center text-stone-500">Сравнение работает с текстом; зарегистрированное медиа пока отсутствует.</div>}</div>
    </section>
  );
}
