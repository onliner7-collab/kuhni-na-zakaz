"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { zhodinoViews, zhodinoMaterials, ZHODINO_PATH } from "@/data/zhodino-page";

const choice = "min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const budgets = ["Сохранить бюджет", "Баланс цены и удобства", "Больше оснащения"];

export function ZhodinoShowroom({ planning, logistics, faq }: { planning: ReactNode; logistics: ReactNode; faq: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [viewIndex, setViewIndex] = useState(0);
  const [layout, setLayout] = useState("");
  const [materialIndex, setMaterialIndex] = useState<number | null>(null);
  const [budget, setBudget] = useState("");
  const view = zhodinoViews[viewIndex];
  const material = zhodinoMaterials[materialIndex ?? 0];
  const answers = useMemo(() => ({ zhodinoKitchenSelection: { layout, view: view.label, material: materialIndex === null ? "" : material.label, budget } }), [layout, view.label, materialIndex, material.label, budget]);

  return <>
    <section id="zhodino-choose" className="bg-stone-50 pb-10 md:pb-16" aria-label="Выбор кухни в Жодино">
      <div className="container-site">
        <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <div>
            <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-200">
              <picture>
                <source media="(max-width: 767px)" srcSet={view.mobile} />
                <img data-zhodino-hero src={view.image} alt={view.alt} width={1200} height={800} fetchPriority={viewIndex === 0 ? "high" : "auto"} loading="eager" className="aspect-[3/2] w-full object-cover" />
              </picture>
            </figure>
            <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Посмотреть кухню">
              {zhodinoViews.map((item, index) => <button key={item.id} type="button" disabled={!hydrated} aria-pressed={viewIndex === index} className={`${choice} ${viewIndex === index ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-800"}`} onClick={() => { setViewIndex(index); if (item.layout) setLayout(item.layout); }}>{item.label}</button>)}
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600">Иллюстрации дизайна и монтажа. Не фото выполненных заказов.</p>
          </div>
          <div className="rounded-2xl bg-white p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-600">Выберите основу проекта</p>
            <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">{view.title}</h2>
            <p className="mt-3 leading-7 text-stone-700">{view.text}</p>
            <Link href={view.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{view.link} →</Link>
            <a href="#zhodino-form" className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Рассчитать кухню в Жодино</a>
          </div>
        </div>
      </div>
    </section>

    {planning}

    <section id="zhodino-materials" className="section-padding bg-stone-50" aria-labelledby="zhodino-materials-title">
      <div className="container-site">
        <p className="text-sm font-semibold text-primary">Фасады и стиль</p>
        <h2 id="zhodino-materials-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Какие материалы выбрать для кухни?</h2>
        <p className="mt-3 max-w-2xl leading-7 text-stone-700">Сравните внешний вид, покрытие и уход. Цвет на экране — ориентир; перед заказом выбираем по образцам.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 md:items-center">
          <img src={material.image} alt={material.alt} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full rounded-2xl object-cover" />
          <div>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Материал фасадов">
              {zhodinoMaterials.map((item, index) => <button type="button" key={item.id} disabled={!hydrated} aria-pressed={materialIndex === index} onClick={() => setMaterialIndex(index)} className={`${choice} ${materialIndex === index ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-800"}`}>{item.label}</button>)}
            </div>
            <h3 className="mt-4 text-xl font-bold">{material.label}</h3>
            <p className="mt-2 leading-7 text-stone-700">{material.text}</p>
            <Link href={material.href} className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{material.link} →</Link>
            <p className="mt-3 text-xs text-stone-600">Примеры дизайна, не локальные выполненные работы.</p>
          </div>
        </div>
        <details className="mt-5 rounded-xl border border-stone-300 bg-white p-4">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">Современная кухня, неоклассика или дерево?</summary>
          <p className="mt-3 leading-7 text-stone-700">Современные кухни сочетают гладкие фасады и простые линии. В неоклассике важны фрезеровка и пропорции. Белые и бежевые фасады можно сочетать с древесной фактурой; матовые и глянцевые покрытия сравнивайте при вашем освещении.</p>
          <div className="mt-2 flex flex-wrap gap-x-5"><Link href="/styles/sovremennye" className="inline-flex min-h-11 items-center text-primary underline">Современные кухни</Link><Link href="/styles/neoklassika" className="inline-flex min-h-11 items-center text-primary underline">Неоклассика</Link></div>
        </details>
      </div>
    </section>

    <section id="zhodino-budget" className="section-padding bg-white" aria-labelledby="zhodino-budget-title">
      <div className="container-site">
        <p className="text-sm font-semibold text-primary">Цена под вашу комплектацию</p>
        <h2 id="zhodino-budget-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Купить кухню недорого: что влияет на стоимость</h2>
        <p className="mt-3 max-w-2xl leading-7 text-stone-700">Цена кухни в Жодино складывается из мебели, оснащения и работ по адресу. Для точной сметы нужны размеры и выбранная комплектация.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3" role="group" aria-label="Приоритет бюджета">
          {budgets.map((item, index) => <button key={item} type="button" disabled={!hydrated} aria-pressed={budget === item} onClick={() => setBudget(item)} className={`rounded-2xl border p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${budget === item ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-stone-50 text-stone-900"}`}><span className="text-xs font-semibold">0{index + 1}{budget === item ? " · Выбрано" : ""}</span><span className="mt-2 block text-lg font-bold">{item}</span><span className="mt-2 block text-sm leading-6">{["Простая геометрия, базовые декоры и оснащение там, где оно нужно каждый день.", "Удобные ящики в рабочей зоне, выбранное покрытие фасадов и продуманное хранение.", "Высокие секции, механизмы угла, дополнительные ящики и подсветка по задаче."][index]}</span></button>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Размеры и форма", "Фасады и столешница", "Ящики и механизмы", "Доставка и монтаж"].map((item, index) => <div key={item} className="rounded-xl border border-stone-200 p-4"><span className="text-sm font-semibold text-stone-500">0{index + 1}</span><p className="mt-2 font-semibold">{item}</p></div>)}
        </div>
        <details className="mt-5 rounded-xl border border-stone-300 p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Как сравнить предложения и не потерять нужные работы?</summary><p className="mt-3 leading-7 text-stone-700">Сравнивайте одинаковые размеры, покрытие фасадов, толщину столешницы и модели фурнитуры. Отдельно уточните замер, доставку, занос, сборку, вырезы и подключение техники. Бытовая техника входит в смету только при согласовании. Цена за погонный метр без состава не показывает стоимость вашего заказа.</p></details>
        <div className="mt-3 flex flex-wrap gap-x-5"><Link href="/prices" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Цены и состав расчёта</Link><Link href="/scenarios/byudzhetnaya-kuhnya" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Как спланировать бюджетную кухню</Link><Link href="/calculator" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Калькулятор кухни</Link></div>
      </div>
    </section>

    {logistics}
    {faq}

    <section id="zhodino-form" className="section-padding scroll-mt-24 bg-stone-100" aria-labelledby="zhodino-form-title">
      <div className="container-site grid gap-7 lg:grid-cols-2">
        <div><p className="text-sm font-semibold text-primary">Заявка из Жодино</p><h2 id="zhodino-form-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Получить расчёт кухни по размерам</h2><p className="mt-3 leading-7 text-stone-700">Оставьте телефон. В комментарии можно указать размеры стен, технику, адрес и пожелания. Специалист уточнит задачу и порядок замера.</p><div className="mt-5 rounded-xl border border-stone-300 bg-white p-4"><p className="font-semibold">Ваши пожелания</p><p data-zhodino-selection className="mt-2 text-sm leading-6">{[layout && `Планировка: ${layout}`, materialIndex !== null && `Фасады: ${material.label}`, budget && `Приоритет: ${budget}`].filter(Boolean).join(" · ") || "Выберите планировку, материал или бюджет выше — передадим пожелания вместе с заявкой."}</p></div><div className="mt-3 flex flex-wrap gap-x-5"><Link href="/contacts" className="inline-flex min-h-11 items-center text-primary underline">Контакты</Link><Link href="/warranty" className="inline-flex min-h-11 items-center text-primary underline">Условия гарантии</Link></div></div>
        <div className="rounded-2xl bg-white p-5 md:p-7"><ContactForm source="location-zhodino" sourcePage={ZHODINO_PATH} sourceType="location" city="Жодино" cityKey="zhodino" formType="zhodino-calculation" formLocation="zhodino-final-form" showCity={false} showKitchenType={false} compact submitLabel="Получить расчёт" defaultAnswers={answers} /></div>
      </div>
    </section>
  </>;
}
