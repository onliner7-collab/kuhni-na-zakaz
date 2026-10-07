"use client";

import { useState } from "react";

const steps = [
  { label: "Заявка и замер", title: "Начинаем с вашего помещения", text: "Обсудим фото, размеры и бюджет. Возможность и формат замера согласуем по адресу.", image: "measure", alt: "Инструменты для замера помещения кухни" },
  { label: "Проект и цена", title: "Согласуем вашу кухню", text: "Выберем планировку, фасады, технику и механизмы. Зафиксируем комплектацию и цену.", image: "project", alt: "Чертежи кухни и образцы фасадов" },
  { label: "Изготовление", title: "Передаём проект в производство", text: "Изготавливаем детали по согласованному проекту. Срок закрепляется в договоре.", image: "production", alt: "Детали кухонных шкафов на производстве" },
  { label: "Доставка и монтаж", title: "Устанавливаем и проверяем", text: "Согласуем доставку и готовность помещения. Соберём шкафы и проверим работу механизмов.", image: "installation", alt: "Регулировка петли кухонного фасада при монтаже" },
] as const;

export function BorisovJourney() {
  const [active, setActive] = useState(0);
  const current = steps[active];
  return <section id="process" className="scroll-mt-24" aria-labelledby="borisov-process-title">
    <h2 id="borisov-process-title" className="text-3xl font-bold tracking-tight md:text-4xl">От идеи до кухни в Борисове</h2>
    <ol className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Этапы заказа кухни">{steps.map((step, index) => <li key={step.label}><button type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-14 w-full rounded-xl border p-3 text-left text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 ${active === index ? "border-emerald-950 bg-emerald-950 text-white" : "border-stone-300 bg-white"}`}><span className="mr-2 opacity-70">0{index + 1}</span>{step.label}</button></li>)}</ol>
    <article className="mt-4 grid overflow-hidden rounded-2xl bg-white md:grid-cols-2"><img src={`/media/pilots/borisov/webp/borisov-process-${current.image}.webp`} alt={current.alt} width={1200} height={800} loading="lazy" decoding="async" className="h-36 w-full object-cover md:h-auto md:aspect-[3/2]" /><div className="p-5 md:p-7" aria-live="polite"><h3 className="text-xl font-bold">{current.title}</h3><p className="mt-3 text-sm leading-6 text-stone-600">{current.text}</p><details className="mt-3"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold text-emerald-900">Все этапы заказа</summary><ol className="mt-2 space-y-2 text-sm leading-6 text-stone-600"><li>1. Заявка и обсуждение пожеланий.</li><li>2. Предварительный расчёт по фото и размерам.</li><li>3. Замер и проверка коммуникаций.</li><li>4. Согласование проекта и комплектации.</li><li>5. Изготовление по договору.</li><li>6. Доставка с учётом адреса и подъёма.</li><li>7. Монтаж и проверка механизмов.</li></ol></details></div></article>
  </section>;
}
