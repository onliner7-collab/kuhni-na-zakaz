"use client";

import { useId, useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { LabeledOption, PilotMedia } from "./types";

interface HardwareCabinetExplorerProps { poster: PilotMedia; zones: LabeledOption[]; }

export function HardwareCabinetExplorer({ poster, zones }: HardwareCabinetExplorerProps) {
  const [activeId, setActiveId] = useState(zones[0]?.id || "");
  const [hasIntent, setHasIntent] = useState(false);
  const descriptionId = useId();
  const active = zones.find((zone) => zone.id === activeId) || zones[0];
  const media = hasIntent && active?.media ? active.media : poster;
  return (
    <section data-component="HardwareCabinetExplorer" className="grid gap-5 rounded-3xl bg-[#e8edf2] p-4 sm:p-6 lg:grid-cols-2">
      <figure><div className="aspect-[3/4] max-h-[38rem] overflow-hidden rounded-2xl bg-slate-200"><MediaPicture media={media} eager={!hasIntent} /></div><figcaption className="mt-2 text-sm text-slate-600">{media.caption}</figcaption></figure>
      <div><h2 className="text-2xl font-black text-[#172635]">Выберите зону шкафа</h2><div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-describedby={descriptionId}>{zones.map((zone) => <button key={zone.id} type="button" aria-pressed={zone.id === active?.id} onClick={() => { setActiveId(zone.id); setHasIntent(true); }} className="min-h-11 rounded-xl border bg-white p-3 font-bold aria-pressed:border-slate-900 aria-pressed:ring-2">{zone.label}</button>)}</div><div id={descriptionId} className="mt-4 rounded-2xl bg-white p-4"><h3 className="font-black">{active?.label}</h3><p className="mt-1 text-slate-700">{active?.description}</p>{!active?.media ? <p className="mt-2 text-sm text-slate-500">Пока доступно текстовое объяснение; изображение зоны не загружается.</p> : null}</div></div>
    </section>
  );
}
