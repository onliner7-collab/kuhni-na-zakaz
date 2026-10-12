"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { useExploreContext } from "@/components/exploration";

type Module = { name: string; width: number; kind: "tall" | "sink" | "dish" | "prep" | "hob" | "store" };
const variants: Record<string, { fridge: string; note: string; modules: Module[] }> = {
  "2": { fridge: "Холодильник отдельно от линии", note: "Компактная линия: мойка, варочная и хранение. Если нужна посудомойка, придётся пересмотреть ширину техники и оставить место для подготовки продуктов.", modules: [{ name: "Мойка", width: 60, kind: "sink" }, { name: "Ящики", width: 40, kind: "prep" }, { name: "Варочная", width: 60, kind: "hob" }, { name: "Шкаф", width: 40, kind: "store" }] },
  "2,5": { fridge: "Холодильник отдельно от линии", note: "В этой схеме есть посудомойка 45 см. Рабочий участок над ящиками остаётся компактным: проверьте место для чайника и другой мелкой техники.", modules: [{ name: "Мойка", width: 60, kind: "sink" }, { name: "Посудомойка", width: 45, kind: "dish" }, { name: "Ящики", width: 45, kind: "prep" }, { name: "Варочная", width: 60, kind: "hob" }, { name: "Шкаф", width: 40, kind: "store" }] },
  "3": { fridge: "Холодильник включён в длину линии", note: "Один из вариантов на 3 метра: холодильник, мойка, посудомойка 45 см и ящики. Духовку можно разместить под варочной, если это допускают выбранные модели техники.", modules: [{ name: "Холодильник", width: 60, kind: "tall" }, { name: "Мойка", width: 60, kind: "sink" }, { name: "Посудомойка", width: 45, kind: "dish" }, { name: "Ящики", width: 75, kind: "prep" }, { name: "Варочная", width: 60, kind: "hob" }] },
  "4": { fridge: "Холодильник и пенал включены в длину линии", note: "Длинная линия добавляет пенал, посудомойку 60 см и широкие ящики. Высокие шкафы собраны с краю, чтобы сохранить непрерывную столешницу.", modules: [{ name: "Холодильник", width: 60, kind: "tall" }, { name: "Пенал", width: 60, kind: "tall" }, { name: "Мойка", width: 60, kind: "sink" }, { name: "Посудомойка", width: 60, kind: "dish" }, { name: "Ящики", width: 100, kind: "prep" }, { name: "Варочная", width: 60, kind: "hob" }] },
};
const Selection = createContext({ length: "3", setLength: (_value: string) => {} });
export function StraightKitchenSelection({ children }: { children: ReactNode }) {
  const [length, setLength] = useState("3");
  return <Selection.Provider value={{ length, setLength }}>{children}</Selection.Provider>;
}

export function StraightKitchenPlanner() {
  const { length, setLength } = useContext(Selection);
  const { updateContext } = useExploreContext();
  const variant = variants[length];
  const total = variant.modules.reduce((sum, item) => sum + item.width, 0);
  let offset = 20;
  return <section id="lengths" className="mt-12 scroll-mt-24" aria-labelledby="straight-length-title" data-testid="straight-planner">
    <h2 id="straight-length-title" className="text-2xl font-black md:text-3xl">Прямая кухня 2, 3 или 4 метра: что поместится</h2>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">Выберите длину и сравните состав линии. Это схемы для обсуждения проекта по вашим размерам.</p>
    <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Длина прямой кухни">{Object.keys(variants).sort((a, b) => parseFloat(a.replace(",", ".")) - parseFloat(b.replace(",", "."))).map(value => <button key={value} type="button" aria-pressed={length === value} onClick={() => { setLength(value); updateContext({ layout: "Прямая", scenario: `Линия ${value} м` }, `straight-length:${value}`); }} className={`min-h-12 min-w-16 rounded-xl border px-5 font-bold focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${length === value ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-white text-stone-950"}`}>{value} м</button>)}</div>
    <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-4 md:p-6">
      <p className="text-sm font-bold">{variant.fridge}</p>
      <svg viewBox="0 0 840 310" role="img" aria-labelledby="straight-scheme-title" aria-describedby="straight-scheme-desc" className="mt-3 h-auto w-full rounded-xl bg-stone-50">
        <title id="straight-scheme-title">{`Схема прямой кухни длиной ${length} метра`}</title><desc id="straight-scheme-desc">{variant.modules.map(item => `${item.name}: ${item.width} см`).join("; ")}. {variant.fridge}.</desc>
        <path d="M20 280H820 M20 270V290 M820 270V290" stroke="#57534e" strokeWidth="2" /><text x="420" y="304" textAnchor="middle" fontSize="17" fill="#292524">Линия модулей: {total} см</text>
        {variant.modules.map((item, index) => { const x = offset; const w = item.width / total * 800; offset += w; const y = item.kind === "tall" ? 20 : 120; return <g key={`${length}-${index}`}>
          <rect x={x + 2} y={y} width={w - 4} height={260 - y} rx="4" fill={item.kind === "prep" ? "#d9e7dc" : item.kind === "tall" ? "#d6cec0" : "#ece7df"} stroke="#78716c" strokeWidth="2" />
          {item.kind !== "tall" && <rect x={x} y="112" width={w} height="10" fill="#a8a29e" />}
          {item.kind === "sink" && <rect x={x + w * .2} y="102" width={w * .6} height="13" rx="5" fill="#57534e" />}
          {item.kind === "hob" && <><rect x={x + w * .15} y="103" width={w * .7} height="10" rx="3" fill="#292524" /><rect x={x + w * .12} y="155" width={w * .76} height="55" rx="4" fill="#44403c" /></>}
          {item.kind === "prep" && <><path d={`M${x + 5} 160H${x + w - 5} M${x + 5} 210H${x + w - 5}`} stroke="#78716c" strokeWidth="2" /><text x={x + w / 2} y="91" textAnchor="middle" fontSize="16" fill="#166534">Подготовка</text></>}
          <text x={x + w / 2} y={item.kind === "tall" ? 115 : 240} textAnchor="middle" fontSize="16" fill="#292524">{item.width} см</text>
        </g>; })}
      </svg>
      <ol className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">{variant.modules.map((item, index) => <li key={index} className="rounded-xl bg-stone-50 p-3"><strong>{index + 1}. {item.name}</strong><span className="mt-1 block text-stone-600">{item.width} см</span></li>)}</ol>
      <p className="mt-4 text-sm leading-6" role="status" aria-live="polite">{variant.note}</p>
      <details className="mt-4 border-t border-stone-200"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold">Что уточняется после замера</summary><p className="pb-3 text-sm leading-6 text-stone-600">Схема условная, без монтажных зазоров и доборов. Размеры модулей пересчитываются по геометрии стены, выводам воды, вентиляции и инструкциям техники. Если холодильник стоит отдельно, его место и открывание двери проверяются дополнительно.</p></details>
    </div>
  </section>;
}

export function StraightKitchenRequest() {
  const { length } = useContext(Selection);
  const { context } = useExploreContext();
  return <section id="form" className="mt-12 scroll-mt-24 overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid lg:grid-cols-2" aria-labelledby="straight-request-title">
    <div className="bg-stone-950 p-6 text-white md:p-8"><p className="text-sm font-bold text-amber-300">Проект по вашим размерам</p><h2 id="straight-request-title" className="mt-3 text-3xl font-black">Рассчитать прямую кухню</h2><p className="mt-4 leading-7 text-stone-300">Укажите город, размеры стены и нужную технику. Обсудим фасады, хранение и состав сметы.</p><p className="mt-5 rounded-xl bg-white/10 p-4 text-sm">Выбранная схема: <strong>{length} м</strong>. {variants[length].fridge}.</p><p className="mt-4 text-sm leading-6 text-stone-300">Доставку, подъём и монтаж уточняем по адресу. Предварительные размеры помогают начать расчёт; перед изготовлением нужен точный замер.</p></div>
    <div className="p-5 md:p-8"><ContactForm source="catalog" sourcePage="/catalog/pryamye-kuhni" sourceType="catalog-straight" formType="straight-kitchen-calculation" formLocation="straight-final" submitLabel="Отправить на расчёт" defaultKitchenType="Прямая" defaultDimensions={`Линия ${length} м`} defaultComment={`Интересует прямая кухня. ${variants[length].fridge}.`} defaultAnswers={{ layout: "Прямая", selectedLength: length, refrigeratorPlacement: variants[length].fridge, selectedOption: context.scenario }} showCity showDimensions showComment showHasMeasurements /></div>
  </section>;
}
