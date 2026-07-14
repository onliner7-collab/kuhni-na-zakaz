"use client";

import { useEffect, useMemo, useState } from "react";

interface KitchenLayoutSelection {
  wallOneLength: number;
  wallTwoLength: number;
  windowPosition: string;
  doorPosition: string;
  communicationsPosition: string;
}

export function KitchenLayoutCheck({ onChange }: { onChange?: (selection: KitchenLayoutSelection) => void }) {
  const [firstWall, setFirstWall] = useState(240);
  const [secondWall, setSecondWall] = useState(180);
  const [windowPosition, setWindowPosition] = useState("нет рядом");
  const [doorPosition, setDoorPosition] = useState("нет рядом");
  const [communicationsPosition, setCommunicationsPosition] = useState("уточнить на замере");
  const result = useMemo(() => {
    if (firstWall < 120 || secondWall < 120) return "Одна из стен короткая: сначала стоит проверить альтернативную планировку.";
    if (windowPosition !== "нет рядом" || doorPosition !== "нет рядом") return "Г-образная схема возможна как направление, но окно или дверь нужно нанести на замере.";
    return "Две стены позволяют обсуждать Г-образную схему на замере.";
  }, [doorPosition, firstWall, secondWall, windowPosition]);
  useEffect(() => onChange?.({ wallOneLength: firstWall, wallTwoLength: secondWall, windowPosition, doorPosition, communicationsPosition }), [communicationsPosition, doorPosition, firstWall, onChange, secondWall, windowPosition]);
  return (
    <section data-component="KitchenLayoutCheck" className="rounded-3xl border p-4 sm:p-6">
      <h2 className="text-2xl font-black">Предварительно проверить две стены</h2>
      <p className="mt-2 text-stone-600">Это ориентир для разговора, а не технический расчёт кухни.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="font-bold">Первая стена, см<input className="mt-2 min-h-11 w-full rounded-xl border px-3" type="number" min="60" max="1000" value={firstWall} onChange={(event) => setFirstWall(Number(event.target.value))} /></label>
        <label className="font-bold">Вторая стена, см<input className="mt-2 min-h-11 w-full rounded-xl border px-3" type="number" min="60" max="1000" value={secondWall} onChange={(event) => setSecondWall(Number(event.target.value))} /></label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="font-bold">Окно<select className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3" value={windowPosition} onChange={(event) => setWindowPosition(event.target.value)}><option>нет рядом</option><option>на первой стене</option><option>на второй стене</option></select></label>
        <label className="font-bold">Дверь<select className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3" value={doorPosition} onChange={(event) => setDoorPosition(event.target.value)}><option>нет рядом</option><option>на первой стене</option><option>на второй стене</option></select></label>
        <label className="font-bold">Коммуникации<select className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3" value={communicationsPosition} onChange={(event) => setCommunicationsPosition(event.target.value)}><option>уточнить на замере</option><option>на первой стене</option><option>на второй стене</option><option>в углу</option></select></label>
      </div>
      <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 font-semibold">{result}</p>
    </section>
  );
}
