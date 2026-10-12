"use client";

import { useEffect, useState } from "react";

const sections = [
  ["budget-parts", "Состав экономкласса"],
  ["budget-savings", "8 способов экономии"],
  ["budget-comparison", "Комплектации"],
  ["budget-country", "Деревня и дача"],
  ["budget-keep", "Что сохранить"],
  ["budget-faq", "Вопросы"],
] as const;

export function BudgetSectionNavigation() {
  const [headerHeight, setHeaderHeight] = useState(72);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    const header = document.querySelector("header");
    const main = document.getElementById("budget-page");
    const measure = () => {
      const height = header?.getBoundingClientRect().height ?? 72;
      setHeaderHeight(height);
      main?.style.setProperty("--budget-scroll-offset", `${height + 88}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    const sync = () => setSelected(sections.some(([id]) => "#" + id === window.location.hash) ? window.location.hash.slice(1) : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", sync); };
  }, []);
  return (
    <nav aria-label="Быстрый переход по разделам" className="sticky z-40 mt-5 flex items-center gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-sm" style={{ top: headerHeight }}>
      <a href="#budget-topics" className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-stone-100 px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700">↑ К выбору</a>
      <label htmlFor="budget-section-select" className="sr-only">Выбрать другой раздел</label>
      <select id="budget-section-select" value={selected} onChange={event => { setSelected(event.target.value); if (event.target.value) window.location.hash = event.target.value; }} className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700">
        <option value="">Выбрать раздел</option>
        {sections.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </nav>
  );
}
