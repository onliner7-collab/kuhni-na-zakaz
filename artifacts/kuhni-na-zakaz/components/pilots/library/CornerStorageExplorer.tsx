"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { LabeledOption, PilotMedia } from "./types";

interface CornerStorageExplorerProps { frames: PilotMedia[]; mechanisms: LabeledOption[]; }

export function CornerStorageExplorer({ frames, mechanisms }: CornerStorageExplorerProps) {
  const [hasIntent, setHasIntent] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [mechanismId, setMechanismId] = useState(mechanisms[0]?.id || "");
  const activeMechanism = mechanisms.find((item) => item.id === mechanismId) || mechanisms[0];
  const activeFrame = frames[Math.min(frameIndex, frames.length - 1)];

  return (
    <section data-component="CornerStorageExplorer" className="grid gap-5 rounded-3xl bg-[#f3eee7] p-4 sm:p-6 lg:grid-cols-2">
      <div>
        {activeFrame ? <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-stone-200"><MediaPicture media={activeFrame} eager={frameIndex === 0} /></div> : <div className="grid aspect-[3/2] place-items-center rounded-2xl bg-stone-200 p-6 text-center">Последовательность пока недоступна.</div>}
        <div className="mt-3 flex items-center justify-between">
          <p aria-live="polite" className="text-sm font-bold">Кадр {frameIndex + 1} из {frames.length}</p>
          <div className="flex gap-2">
            <button type="button" aria-label="Предыдущее положение механизма" disabled={!hasIntent || frameIndex === 0} onClick={() => setFrameIndex((value) => Math.max(0, value - 1))} className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"><ChevronLeft /></button>
            <button type="button" aria-label="Следующее положение механизма" onClick={() => { setHasIntent(true); setFrameIndex((value) => Math.min(frames.length - 1, value + 1)); }} disabled={!frames.length || frameIndex === frames.length - 1} className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"><ChevronRight /></button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black">Доступ к угловому хранению</h2>
        <p className="mt-2 text-stone-700">Сравните принцип доступа. Иллюстрация не заменяет технический проект.</p>
        <div className="mt-4 grid gap-2" role="group" aria-label="Варианты углового хранения">
          {mechanisms.map((item) => <button key={item.id} type="button" aria-pressed={item.id === activeMechanism?.id} onClick={() => setMechanismId(item.id)} className="min-h-11 rounded-xl border bg-white p-3 text-left aria-pressed:border-stone-900 aria-pressed:ring-2"><span className="block font-bold">{item.label}</span><span className="text-sm text-stone-600">{item.description}</span></button>)}
        </div>
      </div>
    </section>
  );
}
