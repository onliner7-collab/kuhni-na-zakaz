"use client";
import { useState } from "react";
import { MDF_PHOTOS } from "@/data/mdf-gallery";

const frames = [
  { file: "film-country-profile", label: "Фрезеровка", note: "Профиль вырезают в основе, а покрытие формирует наружную поверхность. Посмотрите на переход от плоскости к углублению." },
  { file: "film-apartment-edge", label: "Торец вблизи", note: "На приоткрытой дверце видны край и зазор. Толщину, обратную сторону и технологию торца нужно сверить с физическим образцом." },
  { file: "film-profile", label: "Профиль и ручка", note: "Оцените масштаб фрезеровки рядом с ручкой. Рисунок, глубину и совместимость с выбранной плёнкой согласует изготовитель." },
  { file: "profile-daylight", label: "Дневной свет", note: "Нейтральный свет помогает рассмотреть оттенок и рельеф. Изображение служит визуальным ориентиром." },
  { file: "profile-warm", label: "Тёплый свет", note: "При тёплом свете тот же нейтральный фасад выглядит теплее. Это иллюстрация изменения восприятия, а не измерение цвета." },
  { file: "finish-combination", label: "Со столешницей", note: "Фасад, столешницу и фартук проверяют вместе. Один и тот же оттенок по-разному воспринимается рядом с деревом и светлой керамикой." },
].map(f=>({...f,photo:MDF_PHOTOS.find(p=>p.id===`mdf-20261015-${f.file}`)!}));
export function MaterialSurfaceComparator() {
  const [activeId,setActiveId]=useState(frames[0].file);
  const active=frames.find(f=>f.file===activeId)||frames[0];
  return <section id="surface" data-interaction-role="material-surface-compare" className="scroll-mt-24 overflow-hidden rounded-3xl border border-stone-200 bg-white" aria-labelledby="surface-title">
    <div className="p-5 md:p-7"><p className="text-sm font-bold text-violet-800">Рассмотрите детали</p><h2 id="surface-title" className="mt-2 text-3xl font-bold">Профиль, торец и поверхность вблизи</h2><p className="mt-3 text-sm leading-6 text-stone-600">Все изображения — визуальные примеры, созданные ИИ. Они помогают сформулировать вопросы к образцу, но не подтверждают конструкцию заказа.</p></div>
    <figure><img key={active.file} src={active.photo.src} alt={active.photo.alt} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] h-auto w-full object-cover"/><figcaption className="px-5 py-3 text-sm text-stone-600">{active.photo.caption}</figcaption></figure>
    <div className="p-5 md:p-7"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Ракурсы фасада МДФ">{frames.map(f=><button type="button" key={f.file} data-frame-id={f.file} aria-pressed={f.file===active.file} onClick={()=>setActiveId(f.file)} className={`min-h-12 rounded-xl border px-3 py-3 text-left text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 ${f.file===active.file?"border-violet-900 bg-violet-900 text-white":"border-stone-300 bg-white text-stone-950"}`}>{f.label}</button>)}</div><p role="status" className="mt-4 rounded-xl bg-violet-50 p-4 text-sm leading-6"><strong>{active.label}.</strong> {active.note}</p></div>
  </section>;
}
