"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { VENEER_PHOTOS } from "@/data/veneer-content";
import { MATERIAL_PRICE_SCENARIOS, materialById } from "@/data/material-solutions";
import type { MaterialState } from "@/lib/material-selection";
import { MaterialDetailsLink, SelectionButtons, materialButton, useMaterials } from "./MaterialsSelection";

const section = "mt-10 scroll-mt-24";
const note = "text-sm leading-6 text-stone-600";
const button = `${materialButton} aria-pressed:border-violet-800 aria-pressed:bg-violet-50`;
function useView() {
  const { state, updateView } = useMaterials();
  return { view: state.veneerView, update: (patch: Partial<MaterialState["veneerView"]>) => updateView({ veneerView: { ...state.veneerView, ...patch } }) };
}
function Photo({ src, alt }: { src: string; alt: string }) {
  return <Image key={src} src={src} alt={alt} width={1200} height={800} unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="aspect-[3/2] w-full object-cover" />;
}
export function VeneerActions() {
  const { openComparison } = useMaterials();
  return <div className="mt-5 space-y-3"><SelectionButtons id="veneer" /><div className="flex flex-wrap gap-2"><a href="#materials-form" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-800 bg-violet-800 px-4 py-2 text-sm font-semibold text-white transition hover:border-violet-900 hover:bg-violet-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">Рассчитать кухню</a><button type="button" onClick={openComparison} className={materialButton}>Моё сравнение</button></div></div>;
}
const surfaces = [
  { title: "Рисунок и торец", photo: 1, text: "Посмотрите на волокна, переход между дверцами и торец. Вертикальное направление подчёркивает высоту, горизонтальное — длину ряда. Согласуйте направление и схему раскроя до изготовления. Конструкцию торца и обратную сторону проверяют по образцу." },
  { title: "Отделка и оттенок", photo: 4, text: "Светлая, тонированная и более тёмная древесина по-разному воспринимается рядом со столешницей. Лак, масло, матовый или сатиновый блеск выбирают из подтверждённых исполнений. Проверьте образец днём и при будущей подсветке; экран не передаёт точный оттенок и тактильность." },
  { title: "Рисунок на всей кухне", photo: 2, text: "На общем виде оцените, сколько дерева нужно интерьеру. Последовательная и зеркальная раскладка листов создают разный рисунок. Естественная неоднородность не исчезает после тонировки; подбор через ящики, дверцы и колонны требует отдельного согласования." },
];
const combinations = [
  { title: "Шпон и белый", photo: 2, text: "Белый верх оставляет древесину главным акцентом нижнего ряда. Сравните белый образец с оттенком дерева и фартука: холодный и тёплый белый дают разное впечатление." },
  { title: "Шпон и графит", photo: 3, text: "Графит подчёркивает светлый рисунок, но требует достаточного света. Дерево можно перенести на колонны или остров. Проверьте проходы и открывание дверок, если планируете остров." },
  { title: "Шпон и бежевый", photo: 5, text: "Бежевые плоскости и древесный верх создают спокойное сочетание для кухни-гостиной или дома. Подбирайте оттенки одновременно с полом и столешницей, чтобы они не спорили друг с другом." },
];
export function VeneerVisualSelector({ kind }: { kind: "surface" | "combination" }) {
  const { view, update } = useView();
  const options = kind === "surface" ? surfaces : combinations;
  const active = options[view[kind]];
  const p = VENEER_PHOTOS[active.photo];
  return <section id={`veneer-${kind}`} className={section} aria-labelledby={`veneer-${kind}-title`}>
    <h2 id={`veneer-${kind}-title`} className="text-2xl font-bold md:text-3xl">{kind === "surface" ? "Натуральный рисунок, отделка и торец — рассмотрите вблизи" : "С чем сочетать шпон: три направления"}</h2>
    <div className="my-4 flex flex-wrap gap-2" aria-label={kind === "surface" ? "Что рассмотреть на фасаде" : "Сочетание фасадов"}>{options.map((o, i) => <button key={o.title} type="button" className={button} aria-pressed={view[kind] === i} onClick={() => update({ [kind]: i })}>{o.title}</button>)}</div>
    <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.3fr_1fr]"><Photo src={p.src} alt={p.alt} /><div className="p-5 md:p-7" aria-live="polite"><h3 className="text-xl font-bold">{active.title}</h3><p className={`${note} mt-3`}>{active.text}</p><p className="mt-4 text-xs text-stone-500">Визуальная идея, созданная с помощью ИИ. Породу, конструкцию и отделку согласуем по реальному образцу.</p></div></div>
  </section>;
}
export function VeneerGallery() {
  const { view, update } = useView();
  const { state, updateView } = useMaterials();
  const [open, setOpen] = useState(false);
  const photos = VENEER_PHOTOS.filter(p => !view.layout || p.layout === view.layout);
  const index = Math.max(0, photos.findIndex(p => p.id === view.photo));
  function change(i: number) {
    const p = photos[i]; if (!p) return;
    updateView({ veneerView: { ...view, photo: p.id }, recentViews: [p.id, ...state.recentViews.filter(id => id !== p.id)].slice(0, 10) });
  }
  return <section id="veneer-gallery" className={section} aria-labelledby="veneer-gallery-title">
    <h2 id="veneer-gallery-title" className="text-2xl font-bold md:text-3xl">Фотоидеи кухонь со шпоном и деталей фасада</h2>
    <p className={`${note} mt-3`}>Шесть ИИ-иллюстраций помогают выбрать направление. Это примеры дизайна; наличие пород и отделок проверяем отдельно.</p>
    <label className="my-4 block max-w-sm text-sm font-semibold">Планировка примера<select className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3" value={view.layout} onChange={e => update({ layout: e.target.value, photo: null })}><option value="">Все варианты</option>{["Прямая", "Угловая", "С островом", "Деталь"].map(o => <option key={o}>{o}</option>)}</select></label>
    <p role="status" className="mb-3 text-sm text-stone-600">Найдено примеров: {photos.length}</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((p, i) => <figure key={p.id} className="overflow-hidden rounded-2xl bg-white"><button type="button" aria-label={`Увеличить: ${p.alt}`} className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700" onClick={() => { change(i); setOpen(true); }}><Image src={p.src} alt={p.alt} width={1200} height={800} unoptimized loading="lazy" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="aspect-[3/2] w-full object-cover" /></button><figcaption className="p-4 text-sm leading-6">{p.caption} <span className="text-xs text-stone-500">Создано с помощью ИИ.</span></figcaption></figure>)}</div>
    {view.layout && <button type="button" className={`${materialButton} mt-4`} onClick={() => update({ layout: "", photo: null })}>Сбросить фильтры</button>}
    <ImageLightbox images={photos.map(p => ({ ...p, caption: `${p.caption} Создано с помощью ИИ.` }))} open={open} currentIndex={index} onOpenChange={setOpen} onIndexChange={change} label="Примеры кухонь со шпоном" footer={<SelectionButtons id="veneer" />} />
  </section>;
}
const alternatives = [
  { id: "ldsp", label: "С ЛДСП под дерево", text: "Древесный декор ЛДСП позволяет подбирать внешний вид из коллекции. Натуральный шпон отличается происхождением рисунка и отделкой. Сравните образцы, кромки, повторяемость декора и сметы одинакового состава." },
  { id: "mdf-film", label: "С плёнкой", text: "Плёночный декор имитирует дерево, а шпон является древесной облицовкой. Рельеф, форма дверцы, торцы и уход зависят от исполнения. Не переносите свойства одной серии на все покрытия." },
  { id: "mdf-enamel", label: "С эмалью", text: "Эмаль выбирают ради цвета и согласованного финиша, шпон — ради древесного рисунка. Их можно сочетать. Фрезеровку, ручки, возможность ремонта и стоимость проверяют для конкретной конструкции." },
];
export function VeneerComparison() {
  const { view, update } = useView();
  const a = alternatives.find(x => x.id === view.alternative) || alternatives[0];
  const alt = materialById(a.id)!;
  return <section id="veneer-alternatives" className={section} aria-labelledby="veneer-alternatives-title"><h2 id="veneer-alternatives-title" className="text-2xl font-bold md:text-3xl">Шпон и другие решения: что сравнить по образцам</h2>
    <div className="my-4 flex flex-wrap gap-2">{alternatives.map(x => <button type="button" key={x.id} className={button} aria-pressed={a.id === x.id} onClick={() => update({ alternative: x.id })}>{x.label}</button>)}</div>
    <p className={`${note} mb-3`}>Визуальное сравнение: композиции различаются; по иллюстрациям нельзя оценить стойкость или точную стоимость.</p><p role="status" className="mb-3 text-sm font-semibold">Сравниваем: шпон и {alt.title.toLowerCase()}</p>
    <div className="grid gap-4 md:grid-cols-2">{[{ id: alt.id, title: alt.title, image: alt.image, text: a.text }, { id: "veneer", title: "Шпонированные фасады", image: VENEER_PHOTOS[0].src, text: "Натуральный рисунок, согласованная раскладка и защитная отделка. Основание, торцы, обратную сторону и ограничения фиксируем в спецификации." }].map(m => <article key={m.id} data-comparison-material={m.id} className="overflow-hidden rounded-3xl bg-white"><Photo src={m.image} alt={`Визуальный пример для сравнения: ${m.title}`} /><div className="p-5"><h3 className="text-xl font-bold">{m.title}</h3><p className={`${note} my-3`}>{m.text}</p><SelectionButtons id={m.id} />{m.id !== "veneer" && <MaterialDetailsLink id={m.id}>Фото и подробности →</MaterialDetailsLink>}</div></article>)}</div>
    <div className="mt-4 flex flex-wrap gap-4"><MaterialDetailsLink id="hpl">Облицовка HPL →</MaterialDetailsLink><MaterialDetailsLink id="acrylic">Акриловые фасады →</MaterialDetailsLink></div>
  </section>;
}
export function VeneerPrice() {
  const { state, updateView } = useMaterials();
  const s = MATERIAL_PRICE_SCENARIOS.find(x => x.id === state.scenarioId) || MATERIAL_PRICE_SCENARIOS[0];
  const p = VENEER_PHOTOS[s.id === "straight-3m" ? 2 : 0];
  return <section id="veneer-price" className={section} aria-labelledby="veneer-price-title"><h2 id="veneer-price-title" className="text-2xl font-bold md:text-3xl">Цена кухни со шпоном: размеры, раскладка и комплектация</h2><p className={`${note} mt-3`}>Расчёт в BYN по вашим размерам. Доля шпона, подбор рисунка, порода и отделка влияют на смету наряду со шкафами, механизмами и столешницей.</p><div className="my-4 flex flex-wrap gap-2">{MATERIAL_PRICE_SCENARIOS.map(x => <button type="button" key={x.id} className={button} aria-pressed={x.id === s.id} onClick={() => updateView({ scenarioId: x.id })}>{x.title}</button>)}</div>
    <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-2"><figure><Photo src={p.src} alt={p.alt} /><figcaption className="p-4 text-xs text-stone-500">ИИ-иллюстрация направления. Размеры и состав задаются описанием, а затем замером.</figcaption></figure><div className="p-5"><h3 className="text-xl font-bold">{s.title}</h3><p className={`${note} mt-3`}>{s.dimensions}. {s.equipment}</p><p className={`${note} mt-3`}>{s.services}</p><p className={`${note} mt-3`}>Диапазон проверяем по составу, а не только по длине. Актуальные примеры, дата проверки и ограничения приведены ниже.</p><a href="#materials-form" className={`${materialButton} mt-4`}>Получить расчёт комплектации</a></div></div>
  </section>;
}
