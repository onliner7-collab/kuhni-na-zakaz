"use client";

import { useState } from "react";
import Link from "@/components/navigation/Link";
import { MDF_PHOTOS } from "@/data/mdf-gallery";
import { MATERIAL_PRICE_SCENARIOS } from "@/data/material-solutions";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { materialButton, useMaterials } from "./MaterialsSelection";

const photo = (file: string) => MDF_PHOTOS.find(p => p.id === `mdf-20261015-${file}`)!;
const kitchens = [
  { id: "smooth", title: "Гладкие фасады", frames: ["film-apartment", "film-apartment-angle", "film-apartment-edge"] },
  { id: "profile", title: "С фрезеровкой", frames: ["film-country", "film-country-angle", "film-country-profile"] },
] as const;
const frameLabels = ["Кухня целиком", "Другой ракурс", "Фасад вблизи"];

export function MdfSolutionActions({ id }: { id: string }) {
  const { ready, state, addToCompare, setPreferred } = useMaterials();
  const selected = state.comparisonIds.includes(id);
  const preferred = state.preferredId === id;
  return <div className="flex flex-wrap gap-2">
    <button disabled={!ready} className={materialButton} aria-pressed={selected} onClick={() => addToCompare(id)}>{selected ? "В сравнении" : "В сравнение"}</button>
    <button disabled={!ready} className={materialButton} aria-pressed={preferred} onClick={() => setPreferred(id)}>{preferred ? "Предпочитаю ✓" : "Предпочитаю"}</button>
  </div>;
}

export function MdfVisualJourney() {
  const { state, ready, updateView, openComparison } = useMaterials();
  const [zoom, setZoom] = useState(false);
  const kitchen = kitchens.find(k => k.frames.some(f => photo(f).id === state.mdfGallery.activePhoto)) || kitchens[0];
  const frameIndex = Math.max(0, kitchen.frames.findIndex(f => photo(f).id === state.mdfGallery.activePhoto));
  const current = photo(kitchen.frames[frameIndex]);
  function show(file: string) {
    const p = photo(file);
    updateView({ mdfGallery: { ...state.mdfGallery, activePhoto: p.id }, recentViews: [p.id, ...state.recentViews.filter(id => id !== p.id)].slice(0, 10) });
  }
  return <section data-testid="mdf-visual-journey" aria-label="Выбор кухни и ракурса" className="overflow-hidden rounded-3xl bg-white">
    <div className="p-4 pb-3 md:p-7"><h1 className="max-w-3xl text-[26px] font-extrabold leading-[1.12] tracking-tight md:text-5xl">Кухни с фасадами МДФ — покрытия и комплектация</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Выберите вид фасада. Рассмотрите кухню целиком, профиль и торец.</p></div>
    <div className="grid lg:grid-cols-[1.6fr_1fr]">
      <figure className="min-w-0"><button disabled={!ready} aria-label="Увеличить выбранную кухню" onClick={() => setZoom(true)} className="relative block w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-violet-700"><img src={current.src} alt={current.alt} width={1200} height={800} fetchPriority={current.id === "mdf-20261015-film-apartment" ? "high" : "auto"} className="aspect-[4/3] w-full object-cover sm:aspect-[3/2]"/><span className="absolute bottom-3 right-3 rounded-full bg-white px-4 py-3 text-xs font-bold text-stone-950">Увеличить ↗</span></button><figcaption className="px-4 py-2 text-xs text-stone-500">Визуальный пример, созданный ИИ · покрытие по образцу</figcaption></figure>
      <div className="p-4 pt-2 lg:p-7">
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Примеры кухонь">{kitchens.map(k => <button disabled={!ready} key={k.id} aria-pressed={k.id === kitchen.id} onClick={() => show(k.frames[0])} className={`${materialButton} ${k.id === kitchen.id ? "border-violet-800 bg-violet-50" : ""}`}>{k.title}</button>)}</div>
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Ракурсы выбранной кухни">{kitchen.frames.map((f, i) => <button disabled={!ready} key={f} aria-pressed={i === frameIndex} onClick={() => show(f)} className={`overflow-hidden rounded-xl border text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700 ${i === frameIndex ? "border-violet-800 ring-1 ring-violet-800" : "border-stone-200"}`}><img src={photo(f).src} alt="" width={180} height={120} loading="lazy" className="aspect-[3/2] w-full object-cover"/><span className="block min-h-11 px-2 py-2 text-xs font-semibold">{frameLabels[i]}</span></button>)}</div>
        <p role="status" className="my-4 text-sm leading-6">{frameIndex === 2 ? "Рассмотрите профиль, зазор и обработку края." : kitchen.id === "profile" ? "Фрезеровка задаёт рельеф фасада." : "Гладкая поверхность без фрезеровки."}</p>
        <MdfSolutionActions id="mdf-film"/>
        <div className="mt-3 flex flex-wrap gap-x-5"><button disabled={!ready} onClick={openComparison} className="min-h-11 text-sm font-semibold text-violet-800 underline">Моё сравнение</button><Link href="#materials-form" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-800 underline">Рассчитать эту кухню →</Link></div>
      </div>
    </div>
    <ImageLightbox images={kitchen.frames.map(photo)} open={zoom} currentIndex={frameIndex} onOpenChange={setZoom} onIndexChange={i => show(kitchen.frames[i])} label="Ракурсы кухни МДФ"/>
  </section>;
}

export function MdfVisualComparison() {
  const [detail, setDetail] = useState(false);
  const { ready, openComparison } = useMaterials();
  const entries = [
    { id: "mdf-film", name: "МДФ в плёнке", src: photo(detail ? "film-country-profile" : "film-country").src, alt: detail ? "Фрезерованный зелёный фасад МДФ вблизи" : "Кухня с зелёными фрезерованными фасадами МДФ", note: "Основа МДФ + плёнка" },
    { id: "ldsp", name: "ЛДСП", src: `/images/materials-gallery-v2/ldsp/ldsp-${detail ? "c-macro" : "d-kitchen"}.webp`, alt: detail ? "Декор и кромка ЛДСП крупным планом" : "Пример кухни с древесным декором ЛДСП", note: "Ламинированная плита + кромка" },
  ];
  return <section id="alternatives" className="mt-10 scroll-mt-24" aria-labelledby="mdf-alternatives-title"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="mdf-alternatives-title" className="text-2xl font-bold md:text-3xl">МДФ и ЛДСП: посмотрите разницу</h2><div className="flex gap-2" role="group" aria-label="Вид сравнения">{[false, true].map(v => <button key={String(v)} className={materialButton} aria-pressed={v === detail} onClick={() => setDetail(v)}>{v ? "Вблизи" : "В кухне"}</button>)}</div></div><div className="mt-4 grid grid-cols-2 gap-3">{entries.map(e => <article key={e.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><img src={e.src} alt={e.alt} width={1200} height={800} loading="lazy" className="aspect-[4/3] w-full object-cover"/><div className="p-3 md:p-5"><h3 className="text-lg font-bold">{e.name}</h3><p className="my-2 text-xs leading-5 text-stone-600">{e.note}</p><MdfSolutionActions id={e.id}/></div></article>)}</div><p className="mt-3 text-xs leading-5 text-stone-500">Разные визуальные примеры. Цвет, конструкцию и свойства сравнивайте по образцам.</p><button disabled={!ready} className={`${materialButton} mt-3`} onClick={openComparison}>Открыть моё сравнение →</button></section>;
}

export function MdfVisualEquipment() {
  const { state, ready, updateView } = useMaterials();
  const selected = MATERIAL_PRICE_SCENARIOS.find(s => s.id === state.scenarioId) || MATERIAL_PRICE_SCENARIOS[0];
  return <section id="prices" className="mt-10 scroll-mt-24" aria-labelledby="mdf-prices-title"><h2 id="mdf-prices-title" className="text-2xl font-bold md:text-3xl">Выберите основу для расчёта</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{MATERIAL_PRICE_SCENARIOS.map((s, i) => <button key={s.id} disabled={!ready} aria-pressed={s.id === selected.id} onClick={() => updateView({ scenarioId: s.id })} className={`overflow-hidden rounded-2xl border bg-white text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700 ${s.id === selected.id ? "border-violet-800 ring-1 ring-violet-800" : "border-stone-200"}`}><img src={photo(i === 0 ? "film-apartment" : "film-country").src} alt={i === 0 ? "Пример прямой кухни для обсуждения комплектации" : "Пример угловой рабочей зоны для обсуждения комплектации"} width={1200} height={800} loading="lazy" className="aspect-[16/9] w-full object-cover"/><span className="block p-4 text-lg font-bold">{s.title}{s.id === selected.id ? " ✓" : ""}</span></button>)}</div><p className="mt-3 text-sm text-stone-600">3 ящика · доводчики · столешница 38 мм</p><details className="mt-3 rounded-xl border border-stone-200 bg-white p-4"><summary className="min-h-11 cursor-pointer content-center font-semibold">Что входит в комплектацию</summary><p className="mt-3 text-sm leading-6">{selected.equipment}</p><p className="mt-3 text-sm leading-6">{selected.services}</p></details><p className="mt-3 text-sm leading-6 text-stone-600">На фото — идея кухни. Стоимость в BYN рассчитаем по вашим размерам и составу.</p><Link href="#materials-form" className={`${materialButton} mt-3`}>Получить расчёт →</Link></section>;
}

const constructionPairs = [
  { id: "base", label: "МДФ и ЛДСП", left: { name: "МДФ под покрытием", src: photo("film-country-profile").src, alt: "Неглубокая фрезеровка фасада МДФ под зелёным покрытием", note: "Профиль вырезают в основе фасада." }, right: { name: "ЛДСП и кромка", src: "/images/materials-gallery-v2/ldsp/ldsp-c-macro.webp", alt: "Образец ЛДСП: декоративная поверхность и кромка крупным планом", note: "Рассмотрите декоративный слой и отдельную кромку." } },
  { id: "finish", label: "Плёнка и эмаль", left: { name: "МДФ в плёнке", src: photo("film-country-profile").src, alt: "Зелёный фасад с плёночным покрытием и фрезеровкой — визуальный пример", note: "Декор и профиль выбирают по коллекции плёнки." }, right: { name: "МДФ с эмалью", src: photo("finish-combination").src, alt: "Серый гладкий окрашенный фасад возле древесной столешницы — визуальный пример", note: "Оттенок и финиш проверяют по выкрасу." } },
  { id: "parts", label: "Фасад и корпус", left: { name: "Фасад — дверца", src: photo("film-apartment-edge").src, alt: "Приоткрытая дверца кухни: лицевая поверхность и торец фасада", note: "Видимая дверца: основа, покрытие и обработка торца." }, right: { name: "ЛДСП для корпуса", src: "/images/materials-gallery-v2/ldsp/ldsp-b-angle.webp", alt: "Образец плиты ЛДСП под углом: материал для стенок и полок корпуса", note: "Плиту для стенок и полок выбирают отдельно от дверцы." } },
];

export function MdfConstructionCompare() {
  const [active, setActive] = useState("base");
  const pair = constructionPairs.find(p => p.id === active)!;
  return <div data-testid="mdf-construction-compare" className="mb-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
    <div className="grid grid-cols-3 gap-2 p-3" role="group" aria-label="Что сравнить перед заказом">{constructionPairs.map(p => <button key={p.id} aria-pressed={p.id === active} onClick={() => setActive(p.id)} className={`min-h-12 rounded-xl border p-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700 ${p.id === active ? "border-violet-800 bg-violet-50" : "border-stone-200"}`}>{p.label}</button>)}</div>
    <div className="grid grid-cols-2 gap-px bg-stone-200">{[pair.left, pair.right].map(p => <figure key={p.name} className="min-w-0 bg-white"><img src={p.src} alt={p.alt} width={1200} height={800} loading="lazy" className="aspect-[4/3] w-full object-cover"/><figcaption className="p-3 md:p-5"><h3 className="text-base font-bold md:text-xl">{p.name}</h3><p className="mt-2 text-xs leading-5 text-stone-600 md:text-sm">{p.note}</p></figcaption></figure>)}</div>
    <p className="p-3 text-xs leading-5 text-stone-500">Визуальные примеры разных исполнений. Фотография показывает внешний вид; состав и свойства подтверждают по образцу и спецификации.</p>
  </div>;
}
