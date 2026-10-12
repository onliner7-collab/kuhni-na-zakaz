"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { SMOLEVICHI_PATH, smolevichiHeroImages, smolevichiLayouts } from "@/data/smolevichi-page";
import { exampleImage, startingPrice, priceExamples, priceViews, type PriceExample } from "@/data/prices-showcase";

const button = "min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const budgets = [
  { label: "Сохранить бюджет", text: "Сравним простую планировку и практичные фасады. Дополнительные механизмы выбираем там, где они нужны каждый день." },
  { label: "Баланс цены и удобства", text: "Добавим ящики в рабочей зоне и хранение под вашу технику. Сравним комплектации при одинаковом составе работ." },
  { label: "Больше оснащения", text: "Обсудим высокие секции, подсветку и механизмы. Каждую опцию выделим в комплектации, чтобы было понятно её влияние на смету." },
];
const featured = ["modern-small-2m", "scandi-straight-3m", "modern-corner-3x2"].map(id => priceExamples.find(model => model.id === id)!).filter(Boolean);

function PriceGallery({ model, onChoose }: { model: PriceExample; onChoose: (model: PriceExample) => void }) {
  const [view, setView] = useState(0);
  return <article data-smolevichi-price-card className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
    <figure><img src={exampleImage(model, view)} alt={`${model.name}: ${priceViews[view].toLocaleLowerCase("ru")}, пример дизайна`} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /><figcaption className="px-4 pt-3 text-xs text-stone-600" aria-live="polite">{priceViews[view]} · {view + 1} из 4</figcaption></figure>
    <div className="px-4 pt-3"><div className="grid grid-cols-2 gap-2" role="group" aria-label={`Ракурсы: ${model.name}`}>{priceViews.map((label, index) => <button type="button" key={label} aria-pressed={view === index} onClick={() => setView(index)} className={`${button} ${view === index ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 text-stone-800"}`}>{label}</button>)}</div></div>
    <div className="p-5"><h3 className="text-xl font-bold">{model.name}</h3><p className="mt-2 text-sm text-stone-700">Размеры: {model.dimensions}</p><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-600">Стартовая цена базовой кухни</p><p className="mt-1 text-2xl font-bold">{startingPrice(model)}</p><p className="mt-2 text-sm leading-6 text-stone-700">Для базовой кухни этого размера. Фасады и оснащение на изображении могут увеличить стоимость.</p>
      <details className="mt-3 rounded-xl border border-stone-300 p-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Комплектация и что оплачивается отдельно</summary><p className="mt-2 text-sm leading-6">На изображении: {model.facadeMaterial.toLocaleLowerCase("ru")}, {model.countertop.toLocaleLowerCase("ru")}. Состав выбранного варианта согласуется в смете.</p><p className="mt-3 text-sm font-semibold">Базовый состав</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6">{model.equipment.map(text => <li key={text}>{text}</li>)}</ul><p className="mt-3 text-sm font-semibold">Не включено</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-6">{model.exclude.map(text => <li key={text}>{text}</li>)}</ul></details>
      <a href="#form" onClick={() => onChoose(model)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Рассчитать похожую кухню</a><Link href={`/prices?model=${model.id}`} className="mt-1 inline-flex min-h-11 items-center text-sm text-primary underline">Подробнее о цене и комплектации →</Link>
    </div>
  </article>;
}

export function SmolevichiShowroom({ children, afterBudget }: { children: ReactNode; afterBudget: ReactNode }) {
  const [layoutIndex, setLayoutIndex] = useState<number | null>(null);
  const [budgetIndex, setBudgetIndex] = useState<number | null>(null);
  const [object, setObject] = useState("Квартира");
  const [district, setDistrict] = useState("");
  const [priceModel, setPriceModel] = useState<PriceExample | null>(null);
  const selected = layoutIndex === null ? null : smolevichiLayouts[layoutIndex];
  const answers = useMemo(() => ({ smolevichiKitchenSelection: { layout: priceModel ? priceModel.layout === "corner" ? "Угловая" : "Прямая" : selected?.label || "", budget: budgetIndex === null ? "" : budgets[budgetIndex].label, objectType: object, settlement: district.trim(), modelId: priceModel?.id || "", modelName: priceModel?.name || "", dimensions: priceModel?.dimensions || "", startingPrice: priceModel ? startingPrice(priceModel) : "" } }), [selected, budgetIndex, object, district, priceModel]);
  const kitchenType = priceModel ? priceModel.layout === "corner" ? "Угловая" : "Прямая" : selected?.id === "small" ? "" : selected?.id === "house" ? "" : selected?.label || "";
  const hero = smolevichiHeroImages[selected?.id || "corner"];
  const image = hero.src;
  const mobile = image.replace(".webp", "-mobile.webp");

  return <>
    <section className="bg-stone-50 pb-10 md:pb-14" aria-label="Выбор кухни для Смолевичей">
      <div className="container-site grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-200">
            <picture><source media="(max-width: 767px)" srcSet={mobile} /><img data-smolevichi-hero src={image} alt={hero.alt} width={1200} height={800} fetchPriority={selected ? "auto" : "high"} loading="eager" decoding="async" className="aspect-[3/2] w-full object-cover" /></picture>
          </figure>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Выберите планировку кухни">{smolevichiLayouts.map((item, index) => <button type="button" key={item.id} aria-pressed={layoutIndex === index} onClick={() => { setLayoutIndex(index); setPriceModel(null); }} className={`${button} ${layoutIndex === index ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-800"}`}>{item.label}</button>)}</div>
          <p className="mt-2 text-xs leading-5 text-stone-600">Идеи дизайна, не фото выполненных заказов. Планировку адаптируем под ваше помещение.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 md:p-7">
          <p className="text-sm font-semibold text-primary">От идеи к вашей кухне</p>
          <h2 className="mt-2 font-serif text-2xl font-bold">{selected?.title || "Квартира в городе или дом рядом со Смолевичами?"}</h2>
          <p className="mt-3 leading-7 text-stone-700" aria-live="polite">{selected?.text || "Начните с планировки, размеров и техники. Условия замера, доставки и установки согласуем по вашему адресу."}</p>
          <a href="#form" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Рассчитать по моим размерам</a>
          <a href="#smolevichi-district" className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">Уточнить выезд в район →</a>
        </div>
      </div>
    </section>
    {children}
    <section id="smolevichi-prices" className="section-padding bg-stone-50" aria-labelledby="smolevichi-prices-title"><div className="container-site"><p className="text-sm font-semibold text-primary">Фото идей и стартовые цены</p><h2 id="smolevichi-prices-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Посмотрите кухни с разных сторон</h2><p className="mt-3 max-w-3xl leading-7 text-stone-700">Три примера для выбора кухни в Смолевичах. Изображения показывают дизайн, а цена относится к базовой кухне указанного размера. Это не фото выполненных местных работ.</p><p className="mt-2 text-sm text-stone-600">Начальные цены утверждены 11 октября 2026. Техника, доставка, подъём и монтаж не включены.</p><div className="mt-6 grid gap-6 lg:grid-cols-3">{featured.map(model => <PriceGallery key={model.id} model={model} onChoose={setPriceModel} />)}</div></div></section>
    <section id="smolevichi-budget" className="section-padding bg-stone-950 text-white" aria-labelledby="smolevichi-budget-title"><div className="container-site grid gap-7 lg:grid-cols-2 lg:items-start">
      <div><p className="text-sm font-semibold text-violet-200">Стоимость и комплектация</p><h2 id="smolevichi-budget-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Кухни в Смолевичах: цена под ваши размеры</h2><p className="mt-3 leading-7 text-stone-300">Недорогая кухня начинается с понятного состава заказа. Длина, фасады, столешница и механизмы влияют на смету; доставку и монтаж уточняем отдельно.</p><div className="mt-3 flex flex-wrap gap-x-5"><Link href="/prices" className="inline-flex min-h-11 items-center text-white underline">Цены и состав комплектаций</Link><Link href="/scenarios/byudzhetnaya-kuhnya" className="inline-flex min-h-11 items-center text-white underline">Как выбрать бюджетную кухню</Link><Link href="/calculator" className="inline-flex min-h-11 items-center text-white underline">Калькулятор кухни</Link></div></div>
      <div className="rounded-2xl border border-white/20 bg-white/5 p-5"><h3 className="text-lg font-bold">Что важнее для вашего бюджета?</h3><div className="mt-4 grid gap-2" role="group" aria-label="Приоритет комплектации">{budgets.map((item, index) => <button type="button" key={item.label} aria-pressed={budgetIndex === index} onClick={() => setBudgetIndex(index)} className={`${button} text-left ${budgetIndex === index ? "border-white bg-white text-stone-950" : "border-white/40 text-white"}`}>{item.label}</button>)}</div><p className="mt-4 min-h-20 text-sm leading-6 text-stone-300" aria-live="polite">{budgetIndex === null ? "Выберите приоритет — учтём его при расчёте. Это пожелание к комплектации, а не фиксированная цена." : budgets[budgetIndex].text}</p></div>
    </div></section>
    {afterBudget}
    <section id="form" className="section-padding scroll-mt-24 bg-stone-50" aria-labelledby="smolevichi-form-title"><div className="container-site grid gap-6 lg:grid-cols-2">
      <div><p className="text-sm font-semibold text-primary">Смолевичи и район</p><h2 id="smolevichi-form-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Получить расчёт кухни и уточнить выезд</h2><p className="mt-3 leading-7 text-stone-700">Напишите размеры или приложите их в комментарии. Для заказа кухни в Смолевичском районе укажите населённый пункт; возможность замера и условия логистики подтвердим по адресу.</p>
        <fieldset className="mt-5"><legend className="mb-2 font-semibold">Куда нужна кухня?</legend><div className="flex flex-wrap gap-2">{["Квартира", "Частный дом", "Новостройка"].map(item => <button type="button" key={item} aria-pressed={object === item} onClick={() => setObject(item)} className={`${button} ${object === item ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white"}`}>{item}</button>)}</div></fieldset>
        <label htmlFor="smolevichi-settlement" className="mt-5 block text-sm font-semibold">Населённый пункт района, если кухня за городом</label><input id="smolevichi-settlement" value={district} onChange={event => setDistrict(event.target.value)} maxLength={100} autoComplete="address-level2" placeholder="Название деревни или агрогородка" className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
        <p data-smolevichi-selection className="mt-4 rounded-xl border border-stone-300 bg-white p-4 text-sm leading-6" aria-live="polite">{[priceModel && `Пример: ${priceModel.name}, ${startingPrice(priceModel)} за базовую кухню`, !priceModel && selected && `Планировка: ${selected.label}`, budgetIndex !== null && `Приоритет: ${budgets[budgetIndex].label}`, `Объект: ${object}`, district.trim() && `Населённый пункт: ${district.trim()}`].filter(Boolean).join(" · ")}</p>
        <div className="mt-2 flex flex-wrap gap-x-5"><Link href="/contacts" className="inline-flex min-h-11 items-center text-primary underline">Контакты компании</Link><Link href="/warranty" className="inline-flex min-h-11 items-center text-primary underline">Гарантийные условия</Link></div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-5 md:p-7"><ContactForm source="location-smolevichi" sourcePage={SMOLEVICHI_PATH} sourceType="location-region" city="Смолевичи" cityKey="smolevichi" cityLabel="Город или населённый пункт" formType="smolevichi-calculation" formLocation="smolevichi-final-form" defaultKitchenType={kitchenType} defaultDimensions={priceModel?.dimensions || ""} defaultComment={priceModel ? `Интересует ${priceModel.name}. Стартовая цена базовой кухни ${startingPrice(priceModel)}; прошу расчёт выбранной комплектации по моим размерам.` : ""} defaultAnswers={answers} showDimensions showComment showMessenger={false} compact submitLabel="Получить расчёт" /></div>
    </div></section>
  </>;
}
