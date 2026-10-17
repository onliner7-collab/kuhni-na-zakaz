"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { ENAMEL_IMAGE_ROOT, ENAMEL_PHOTOS, ENAMEL_ROOMS } from "@/data/enamel-content";
import { MATERIAL_PRICE_SCENARIOS, materialById } from "@/data/material-solutions";
import { MATERIAL_PHOTOS } from "@/data/material-hub-gallery";
import { MaterialDetailsLink, SelectionButtons, materialButton, useMaterials } from "./MaterialsSelection";

const note = "text-sm leading-6 text-stone-600";
const selected = "border-violet-900 bg-violet-900 text-white";
const idle = "border-stone-300 bg-white text-stone-950";
const control = "min-h-11 rounded-xl border px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700";
const panel = "mt-10 scroll-mt-24";
function useEnamelView() {
  const { state, updateView } = useMaterials();
  return { view: state.enamelView, update: (patch: Partial<typeof state.enamelView>) => updateView({ enamelView: { ...state.enamelView, ...patch } }) };
}

export function EnamelActions() {
  return <div className="mt-4 space-y-3"><SelectionButtons id="mdf-enamel"/><a href="#materials-form" className={`${materialButton} bg-violet-50`}>Рассчитать по моим размерам →</a></div>;
}

export function EnamelFinishes() {
  const { view, update } = useEnamelView();
  const active = view.finish;
  const photo = ENAMEL_PHOTOS[active];
  return <section id="enamel-finishes" className={panel} aria-labelledby="enamel-finishes-title">
    <h2 id="enamel-finishes-title" className="text-2xl font-bold md:text-3xl">Матовая или глянцевая: посмотрите на свет</h2>
    <div className="my-4 flex flex-wrap gap-2" aria-label="Финиш эмалевых фасадов">{["Матовая эмаль", "Глянцевая эмаль"].map((label,i)=><button key={label} type="button" aria-pressed={active===i} onClick={()=>update({finish:i})} className={`${control} ${active===i?selected:idle}`}>{label}</button>)}</div>
    <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.4fr_1fr]">
      <Image src={photo.src} alt={photo.alt} width={1200} height={800} sizes="(max-width: 1024px) 100vw, 60vw" className="aspect-[3/2] h-full w-full object-cover"/>
      <div className="p-5 md:p-7" aria-live="polite"><p className="text-xs font-bold uppercase tracking-widest text-violet-800">{active===0?"Мягкое отражение":"Выраженный блик"}</p><h3 className="mt-2 text-xl font-bold">{active===0?"Матовая поверхность":"Глянцевая поверхность"}</h3><p className={`${note} mt-3`}>{active===0?"Спокойное рассеивание света подчёркивает цвет и рельеф рамки. На тёмном оттенке следы могут быть заметнее — проверяйте образец.":"Отражает окно и подсветку. Оцените блик с места, где будете сидеть, а отпечатки и правила очистки — на выбранном покрытии."}</p><p className="mt-4 rounded-xl bg-stone-100 p-3 text-sm leading-6">Это разные визуальные примеры, а не точная смена финиша одной кухни. Степень блеска и оттенок согласуем по выкрасу.</p></div>
    </div>
    <details className="mt-3 rounded-2xl border border-stone-200 bg-white p-4"><summary className="min-h-11 cursor-pointer content-center font-bold">Один цвет в двух финишах — образцы рядом</summary><Image src={`${ENAMEL_IMAGE_ROOT}/finish-samples.webp`} alt={ENAMEL_PHOTOS[3].alt} width={1200} height={800} loading="lazy" sizes="(max-width: 768px) 100vw, 900px" className="mt-3 aspect-[3/2] w-full rounded-xl object-cover"/><p className={`${note} mt-3`}>Матовый образец слева, глянцевый справа. Это иллюстрация отражений, а не измерение цвета. Белый, бежевый, серый, графит, зелёный или синий оттенок выбирают по физическому выкрасу; чёрный и двухцветные сочетания стоит проверить при дневном и вечернем свете.</p></details>
  </section>;
}

const profiles = [
  { image:"profile-smooth", title:"Гладкий фасад", text:"Ровная плоскость для современной кухни. Обратите внимание на торец, блик и геометрию зазоров." },
  { image:"profile-thin-frame", title:"Тонкая рамка", text:"Неглубокий рисунок для сдержанной неоклассики. Ширину рамки сопоставляют с размером дверцы и ящика." },
  { image:"profile-deep-frame", title:"Выраженная рамка", text:"Более заметный рельеф для классической композиции. Проверяйте углы, углубления и удобство очистки." },
];
export function EnamelProfiles() {
  const { view, update } = useEnamelView();
  const active = view.profile;
  return <section id="enamel-profiles" className={panel} aria-labelledby="enamel-profiles-title"><h2 id="enamel-profiles-title" className="text-2xl font-bold md:text-3xl">Фрезеровка: от плоскости к рамке</h2><div className="my-4 flex flex-wrap gap-2" aria-label="Рисунок фрезеровки">{profiles.map((p,i)=><button type="button" key={p.title} aria-pressed={active===i} onClick={()=>update({profile:i})} className={`${control} ${active===i?selected:idle}`}>{p.title}</button>)}</div>
    <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden bg-stone-100"><Image key={profiles[active].image} src={`${ENAMEL_IMAGE_ROOT}/${profiles[active].image}.webp`} alt={`Образец крашеного фасада МДФ: ${profiles[active].title.toLowerCase()}`} width={1200} height={800} loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="h-full w-full object-contain"/></div><div className="p-5 md:p-7" aria-live="polite"><p className="text-xs font-bold text-violet-800">Образец {active+1} из 3</p><h3 className="mt-2 text-xl font-bold">{profiles[active].title}</h3><p className={`${note} mt-3`}>{profiles[active].text}</p><p className="mt-4 rounded-xl bg-violet-50 p-3 text-sm leading-6">Рисунок вырезают в основе МДФ до окрашивания. Доступные профили, толщину и минимальные размеры подтверждает изготовитель.</p></div></div>
    <details className="mt-3 rounded-2xl border border-stone-200 bg-white p-4"><summary className="min-h-11 cursor-pointer content-center font-bold">Рифление, радиусы и кухня без ручек: что уточнить?</summary><p className={`${note} mt-3`}>Вертикальные канавки, рифлёные и радиусные фасады, патина и специальные эффекты — только после подтверждения технологии и доступности. Интегрированная фрезерованная ручка и отдельный профиль Gola устроены по-разному. Для высоких шкафов, узких дверец и широких ящиков согласуют толщину, ограничения размеров и раскладку рисунка.</p></details>
  </section>;
}

export function EnamelRooms() {
  const { view, update } = useEnamelView(); const room=ENAMEL_ROOMS[view.room];
  return <section id="enamel-rooms" className={panel} aria-labelledby="enamel-rooms-title"><h2 id="enamel-rooms-title" className="text-2xl font-bold md:text-3xl">Для какого помещения выбираете кухню?</h2><div className="my-4 flex flex-wrap gap-2" aria-label="Помещение для кухни в эмали">{ENAMEL_ROOMS.map((r,i)=><button key={r.title} type="button" aria-pressed={view.room===i} onClick={()=>update({room:i})} className={`${control} ${view.room===i?selected:idle}`}>{r.title}</button>)}</div><div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.4fr_1fr]"><Image src={room.image.src} alt={room.image.alt} width={1200} height={800} loading="lazy" sizes="(max-width: 1024px) 100vw, 60vw" className="aspect-[3/2] h-full w-full object-cover"/><div className="p-5 md:p-7" aria-live="polite"><h3 className="text-xl font-bold">{room.title}</h3><p className={`${note} mt-3`}>{room.text}</p><p className="mt-4 rounded-xl bg-stone-100 p-3 text-sm leading-6">{room.check}</p><Link href={room.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-violet-800 underline">{room.link} →</Link></div></div><p className="mt-2 text-xs text-stone-500">Визуальные идеи, созданные с помощью ИИ. Условия эксплуатации и состав — по вашему заказу.</p></section>;
}

export function EnamelComparison() {
  const { view, update } = useEnamelView(); const { openComparison } = useMaterials();
  const alternative=materialById(view.alternative)!;
  const why: Record<string,string> = {
    "mdf-film":"Плёнка — готовое декоративное покрытие, профиль и декор выбирают из коллекции. Сравните доступный рисунок, торец и одинаковую комплектацию.",
    hpl:"HPL — облицовка на согласованной основе с отдельной обработкой торца. Сравните кромку, поверхность и ограничения конкретной серии.",
    acrylic:"Акрил — поверхность конкретной серии на выбранной основе. Для глянцевой кухни сравните отражения, торец, очистку и возможность восстановления.",
  };
  return <section id="enamel-alternatives" className={panel} aria-labelledby="enamel-alternatives-title"><h2 id="enamel-alternatives-title" className="text-2xl font-bold md:text-3xl">Эмаль и другие покрытия: сравните рядом</h2><div className="my-4 flex flex-wrap gap-2" aria-label="Альтернатива эмали">{[["mdf-film","С плёнкой"],["hpl","С HPL"],["acrylic","С акрилом"]].map(([id,label])=><button key={id} type="button" aria-pressed={view.alternative===id} onClick={()=>update({alternative:id})} className={`${control} ${view.alternative===id?selected:idle}`}>{label}</button>)}</div><div className="grid gap-3 md:grid-cols-2">{[{id:"mdf-enamel",title:"МДФ с эмалью",image:ENAMEL_PHOTOS[0].src,text:"Окрашенная основа МДФ. Цвет и степень блеска — по выкрасу, профиль — по образцу. Возможность ремонта требует осмотра."},{id:alternative.id,title:alternative.title,image:alternative.image,text:why[alternative.id]}].map(m=><article key={m.id} className="overflow-hidden rounded-2xl bg-white"><Image src={m.image} alt={`Визуальная идея для сравнения: ${m.title}`} width={1200} height={800} loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" className="aspect-[3/2] w-full object-cover"/><div className="p-4 md:p-5"><h3 className="text-xl font-bold">{m.title}</h3><p className={`${note} my-3`}>{m.text}</p><SelectionButtons id={m.id}/>{m.id!=="mdf-enamel"&&<MaterialDetailsLink id={m.id}>Фото, уход и подробности →</MaterialDetailsLink>}</div></article>)}</div><p className={`${note} mt-3`}>Фотографии показывают направление дизайна. Для сравнения стоимости берём одинаковые размеры, корпус, столешницу и механизмы; стойкость проверяем по документам серии.</p><button type="button" onClick={openComparison} className={`${materialButton} mt-3`}>Открыть моё сравнение</button><details className="mt-3 rounded-2xl border border-stone-200 bg-white p-4"><summary className="min-h-11 cursor-pointer content-center font-bold">Когда сравнить с ЛДСП или шпоном?</summary><p className="mt-3 text-sm leading-6 text-stone-600">Для гладких фасадов с готовым декором рассмотрите ЛДСП; для натурального рисунка древесины — шпон. Эмаль выбирают, когда важны окрашенная поверхность и согласованный профиль. Разницу в цене определяет одинаковый состав кухни.</p><div className="mt-2 flex flex-wrap gap-x-5"><MaterialDetailsLink id="ldsp">Фасады и корпуса ЛДСП →</MaterialDetailsLink><MaterialDetailsLink id="veneer">Натуральный шпон →</MaterialDetailsLink></div></details></section>;
}

export function EnamelGallery() {
  const { state, updateView } = useMaterials(); const { view, update }=useEnamelView();
  const [open,setOpen]=useState(false);
  const photos=ENAMEL_PHOTOS.filter(p=>(!view.galleryFinish||p.finish===view.galleryFinish)&&(!view.galleryMilling||p.milling===view.galleryMilling)&&(!view.galleryLayout||p.layout===view.galleryLayout));
  const active=Math.max(0,photos.findIndex(p=>p.id===view.photo));
  const change=(index:number)=>{const p=photos[index];if(!p)return;const id=MATERIAL_PHOTOS.find(item=>item.src===p.src)?.id||p.id;updateView({enamelView:{...view,photo:p.id},recentViews:[id,...state.recentViews.filter(item=>item!==id)].slice(0,10)});};
  const reset=()=>update({galleryFinish:"",galleryMilling:"",galleryLayout:"",limit:6,photo:null});
  return <section id="enamel-gallery" className={panel} aria-labelledby="enamel-gallery-title"><h2 id="enamel-gallery-title" className="text-2xl font-bold md:text-3xl">Подберите внешний вид по фотографиям</h2><p className={`${note} mt-2`}>Фильтры помогают найти пример. Просмотр фотографии не добавляет материал в заявку.</p><div className="my-4 grid gap-3 sm:grid-cols-3">{[{key:"galleryFinish",label:"Финиш",options:["Матовая","Глянцевая"]},{key:"galleryMilling",label:"Фрезеровка",options:["Гладкая","Рамочная"]},{key:"galleryLayout",label:"Планировка",options:["Прямая","Угловая","Деталь"]}].map(f=><label key={f.key} className="text-sm font-semibold">{f.label}<select aria-label={f.label} className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 focus-visible:outline-violet-700" value={view[f.key as "galleryFinish"|"galleryMilling"|"galleryLayout"]} onChange={e=>update({[f.key]:e.target.value,limit:6,photo:null})}><option value="">Все варианты</option>{f.options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div><div role="status" className="mb-3 text-sm text-stone-600">Найдено примеров: {photos.length}</div>{photos.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.slice(0,view.limit).map(p=><figure key={p.id} className="overflow-hidden rounded-2xl bg-white"><button type="button" aria-label={`Увеличить: ${p.alt}`} className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700" onClick={()=>{change(photos.indexOf(p));setOpen(true);}}><Image src={p.src} alt={p.alt} width={1200} height={800} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="aspect-[3/2] w-full object-cover"/></button><figcaption className="p-4 text-sm leading-6">{p.caption}</figcaption></figure>)}</div>:<div className="rounded-2xl bg-white p-5"><p>Такого сочетания в галерее пока нет. Сбросьте фильтры или обсудите исполнение при расчёте.</p></div>}<div className="mt-4 flex flex-wrap gap-3">{photos.length>view.limit&&<button type="button" className={materialButton} onClick={()=>update({limit:view.limit+6})}>Показать ещё примеры</button>}<button type="button" className={materialButton} onClick={reset}>Сбросить фильтры</button></div><p className="mt-3 text-xs text-stone-500">Все изображения — визуальные идеи, созданные с помощью ИИ, а не фотографии выполненных заказов. Состав и наличие уточняются.</p><ImageLightbox images={photos} open={open} currentIndex={active} onOpenChange={setOpen} onIndexChange={change} label="Примеры кухонь в эмали" footer={<SelectionButtons id="mdf-enamel"/>}/></section>;
}

export function EnamelPriceScenarios() {
  const {state,updateView}=useMaterials();
  const scenario=MATERIAL_PRICE_SCENARIOS.find(s=>s.id===state.scenarioId)||MATERIAL_PRICE_SCENARIOS[0];
  const corner=scenario.id==="corner-24-18";
  return <section id="material-price" className={panel} aria-labelledby="enamel-price-title"><h2 id="enamel-price-title" className="text-2xl font-bold md:text-3xl">Цена начинается с комплектации</h2><p className={`${note} mt-2`}>Два одинаковых состава для сравнения покрытий. Итоговую смету составляем в BYN по вашим размерам.</p><div className="my-4 flex flex-wrap gap-2" aria-label="Сценарий комплектации">{MATERIAL_PRICE_SCENARIOS.map(s=><button key={s.id} type="button" aria-pressed={scenario.id===s.id} className={`${control} ${scenario.id===s.id?selected:idle}`} onClick={()=>updateView({scenarioId:s.id})}>{s.title}</button>)}</div><div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.2fr_1fr]"><div><Image src={ENAMEL_PHOTOS[corner?0:1].src} alt={ENAMEL_PHOTOS[corner?0:1].alt} width={1200} height={800} loading="lazy" sizes="(max-width: 1024px) 100vw, 55vw" className="aspect-[3/2] w-full object-cover"/><div className="m-4 rounded-xl bg-stone-100 p-4" role="img" aria-label={`Условный план без масштаба: ${scenario.dimensions}`}><p className="mb-2 text-sm font-bold">{scenario.dimensions}</p><div className="flex gap-1" aria-hidden="true">{[1,2,3,4,5].map(n=><div key={n} className="h-8 flex-1 rounded border border-[#b6a08a] bg-[#ded3c6]"/>)}</div>{corner&&<div className="ml-auto mt-1 h-12 w-1/5 rounded border border-[#b6a08a] bg-[#ded3c6]" aria-hidden="true"/>}<p className="mt-2 text-xs text-stone-600">Условный план без масштаба. Фото показывает идею, а не точный состав или размер расчёта.</p></div></div><div className="p-5 md:p-7" aria-live="polite"><h3 className="text-xl font-bold">{scenario.title}</h3><p className={`${note} mt-3`}>{scenario.equipment}</p><p className={`${note} mt-3`}>{scenario.services}</p><p className="mt-4 rounded-xl bg-violet-50 p-3 text-sm leading-6">Сопоставимой рыночной вилки для этого состава пока нет. Расчёт нашей кухни — отдельная смета.</p><a href="#materials-form" className={`${materialButton} mt-4`}>Получить расчёт в BYN</a></div></div></section>;
}
