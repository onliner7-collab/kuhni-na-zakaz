"use client";

import { useMemo, useState } from "react";

export function KitchenLayoutCheck() {
  const [firstWall, setFirstWall] = useState(240);
  const [secondWall, setSecondWall] = useState(180);
  const [hasObstacle, setHasObstacle] = useState(false);
  const result = useMemo(() => {
    if (firstWall < 120 || secondWall < 120) return "Одна из стен короткая: сначала стоит проверить альтернативную планировку.";
    if (hasObstacle) return "Г-образная схема возможна как направление, но препятствие нужно нанести на замере.";
    return "Две стены позволяют обсуждать Г-образную схему на замере.";
  }, [firstWall, hasObstacle, secondWall]);
  return (
    <section data-component="KitchenLayoutCheck" className="rounded-3xl border p-4 sm:p-6">
      <h2 className="text-2xl font-black">Предварительно проверить две стены</h2>
      <p className="mt-2 text-stone-600">Это ориентир для разговора, а не технический расчёт кухни.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="font-bold">Первая стена, см<input className="mt-2 min-h-11 w-full rounded-xl border px-3" type="number" min="60" max="1000" value={firstWall} onChange={(event) => setFirstWall(Number(event.target.value))} /></label>
        <label className="font-bold">Вторая стена, см<input className="mt-2 min-h-11 w-full rounded-xl border px-3" type="number" min="60" max="1000" value={secondWall} onChange={(event) => setSecondWall(Number(event.target.value))} /></label>
      </div>
      <label className="mt-4 flex min-h-11 items-center gap-3 rounded-xl bg-stone-100 p-3"><input type="checkbox" checked={hasObstacle} onChange={(event) => setHasObstacle(event.target.checked)} className="h-5 w-5" /><span>Есть окно, дверь или коммуникации рядом с углом</span></label>
      <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 font-semibold">{result}</p>
    </section>
  );
}
