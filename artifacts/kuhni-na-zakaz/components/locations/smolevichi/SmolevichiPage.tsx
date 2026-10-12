import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration/ExploreContext";
import { LocationVisualExplorer } from "@/components/locations/LocationVisualExplorer";
import { getLocationVisualSeries } from "@/data/location-visual-series";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";
import { SMOLEVICHI_PATH, SMOLEVICHI_TITLE, SMOLEVICHI_DESCRIPTION, smolevichiFaq } from "@/data/smolevichi-page";
import { smolevichiPlanningCards } from "@/data/smolevichi-planning";
import { SmolevichiPlanningDetails } from "./SmolevichiPlanningDetails";
import { SmolevichiShowroom } from "./SmolevichiShowroom";

function Planning() {
  return <section id="smolevichi-layouts" className="section-padding bg-white" aria-labelledby="smolevichi-layouts-title"><div className="container-site">
    <p className="text-sm font-semibold text-primary">Планировка по размерам</p><h2 id="smolevichi-layouts-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Какая кухня подойдёт вашему помещению?</h2>
    <p className="mt-3 max-w-3xl leading-7 text-stone-700">Начните с формы комнаты: сколько стен можно использовать, где находятся окна и коммуникации, какой проход нужно сохранить. Сравните четыре идеи кухни на заказ в Смолевичах — окончательную планировку проверим по вашим размерам.</p>
    <div className="mt-7 grid gap-6 md:grid-cols-2">{smolevichiPlanningCards.map(item => <article key={item.id} data-planning-card={item.id} className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <figure className="relative"><img src={item.image} srcSet={`${item.image.replace(".webp", "-mobile.webp")} 720w, ${item.image} 1200w`} alt={item.alt} width={1200} height={800} loading="lazy" decoding="async" sizes="(max-width: 767px) 100vw, 50vw" className="aspect-[3/2] w-full object-cover" /><figcaption className="absolute bottom-3 left-3 rounded-full bg-stone-950/90 px-3 py-1.5 text-xs font-semibold text-white">Идея дизайна</figcaption></figure>
      <div className="flex flex-1 flex-col p-5 md:p-6"><p className="text-sm font-semibold text-primary">{item.fit}</p><h3 className="mt-2 font-serif text-2xl font-bold">{item.title}</h3><p className="mt-3 leading-7 text-stone-700">{item.text}</p><div className="mt-4 rounded-xl bg-stone-50 p-4"><p className="text-sm font-semibold">Проверьте перед выбором</p><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">{item.checks.map(check => <li key={check}>{check}</li>)}</ul></div><Link href={item.href} className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{item.link} →</Link></div>
    </article>)}</div>
    <SmolevichiPlanningDetails />
  </div></section>;
}

function District() {
  return <section id="smolevichi-district" className="section-padding scroll-mt-24 bg-stone-100" aria-labelledby="smolevichi-district-title"><div className="container-site">
    <p className="text-sm font-semibold text-primary">Город, район и окрестности</p><h2 id="smolevichi-district-title" className="mt-2 max-w-3xl font-serif text-2xl font-bold md:text-3xl">Заказ кухни в Смолевичском районе</h2><p className="mt-3 max-w-3xl leading-7 text-stone-700">Нужна кухня для частного дома под Смолевичами или загородного объекта? Начать обсуждение можно по плану и фото. Населённый пункт и адрес нужны, чтобы подтвердить возможность выезда на замер, доставку и монтаж.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">{[
      ["Квартира в Смолевичах", "Укажите этаж, лифт и путь от разгрузки до кухни. Проверяем, как занести шкафы и столешницу."],
      ["Дом рядом с городом", "Уточните подъезд, вход и доступ в помещение. В проекте учитываем трубы, котёл и вентиляцию."],
      ["Деревня или агрогородок района", "Напишите название населённого пункта. Возможность обслуживания, маршрут и расходы согласуем отдельно по адресу."],
    ].map(([title, text]) => <article key={title} className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{text}</p></article>)}</div>
    <details className="mt-5 rounded-xl border border-stone-300 bg-white p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">От чего зависит доставка кухни за Смолевичи?</summary><p className="mt-3 leading-7 text-stone-700">Учитываем маршрут, объём деталей, условия разгрузки и заноса. Стоимость доставки, подъёма и установки кухни в Смолевичском районе уточняется в смете. Возможность выезда в пригород Смолевичей и сроки подтверждаем до заказа.</p></details>
    <div className="mt-3 flex flex-wrap gap-x-5"><a href="#form" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Уточнить условия по моему адресу →</a><Link href="/delivery-installation" className="inline-flex min-h-11 items-center text-primary underline">Доставка и монтаж</Link><Link href="/locations/minskaya-oblast" className="inline-flex min-h-11 items-center text-primary underline">Кухни в Минской области</Link></div>
  </div></section>;
}

function Preparation() {
  const series = getLocationVisualSeries(SMOLEVICHI_PATH);
  return <section id="smolevichi-preparation" className="section-padding bg-white" aria-labelledby="smolevichi-preparation-title"><div className="container-site grid gap-6 lg:grid-cols-2 lg:items-start">
    <div><p className="text-sm font-semibold text-primary">Замер и дизайн-проект</p><h2 id="smolevichi-preparation-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Сначала проверяем помещение, затем изготавливаем кухню</h2><ol className="mt-5 grid gap-4">{[
      ["Передайте исходные данные", "План или размеры стен, фото и модели техники — основа для предварительного расчёта кухни."],
      ["Согласуйте замер по адресу", "Проверяем стены, углы, потолок и коммуникации. В новостройке учитываем будущую отделку."],
      ["Утвердите проект и комплектацию", "Фиксируем фасады, столешницу, механизмы, стоимость и состав работ до производства."],
      ["Подготовьте объект к установке", "Согласуем готовность ремонта, доставку, занос и монтажный день по условиям заказа."],
    ].map(([title, text], index) => <li key={title} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white" aria-hidden="true">{index + 1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-700">{text}</p></div></li>)}</ol><div className="mt-4 flex flex-wrap gap-x-5"><Link href="/design-proekt-kuhni" className="inline-flex min-h-11 items-center text-primary underline">Дизайн-проект кухни</Link><Link href="/blog/kak-podgotovitsya-k-zameru-kuhni" className="inline-flex min-h-11 items-center text-primary underline">Подготовка к замеру</Link></div></div>
    {series ? <LocationVisualExplorer config={series} initialStage={<div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200" data-location-visual-stage><picture><source media="(max-width: 767px)" srcSet={series.states[0].image.replace(".webp", "-mobile.webp")} /><img src={series.states[0].image} alt={series.states[0].altRu} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /></picture><span className="absolute left-3 top-3 rounded-full bg-stone-950/90 px-3 py-1.5 text-xs font-bold text-white">Идея дизайна</span></div>} /> : null}
  </div></section>;
}

function Faq() {
  return <section id="smolevichi-faq" className="section-padding bg-stone-50" aria-labelledby="smolevichi-faq-title"><div className="container-site max-w-4xl"><h2 id="smolevichi-faq-title" className="font-serif text-2xl font-bold md:text-3xl">Перед заказом кухни в Смолевичах и районе</h2><div className="mt-6 space-y-3">{smolevichiFaq.map(item => <details key={item.question} className="rounded-xl border border-stone-300 bg-white p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">{item.question}</summary><p className="mt-3 leading-7 text-stone-700">{item.answer}</p></details>)}</div><div className="mt-3 flex flex-wrap gap-x-5"><Link href="/locations" className="inline-flex min-h-11 items-center text-primary underline">Выбрать другой город</Link><Link href="/portfolio" className="inline-flex min-h-11 items-center text-primary underline">Наши работы</Link></div></div></section>;
}

export function SmolevichiPage() {
  const faq = faqJsonLd(smolevichiFaq);
  return <main id="smolevichi-page"><ExploreContextProvider sourceRoute={SMOLEVICHI_PATH}>
    <JsonLd data={[
      breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Города", path: "/locations" }, { name: "Смолевичи", path: SMOLEVICHI_PATH }]),
      { "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteUrl(SMOLEVICHI_PATH)}#webpage`, url: siteUrl(SMOLEVICHI_PATH), name: SMOLEVICHI_TITLE, description: SMOLEVICHI_DESCRIPTION, inLanguage: "ru-BY", dateModified: "2026-10-12" },
      ...(faq ? [faq] : []),
    ]} />
    <section className="bg-stone-50 pb-5 pt-5 md:pb-7 md:pt-8"><div className="container-site">
      <nav aria-label="Хлебные крошки" className="mb-4 flex flex-wrap items-center gap-x-2 text-sm text-stone-600"><Link href="/" className="underline">Главная</Link><span aria-hidden="true">/</span><Link href="/locations" className="underline">Города</Link><span aria-hidden="true">/</span><span aria-current="page">Смолевичи</span></nav>
      <h1 className="max-w-4xl font-serif text-[1.9rem] font-bold leading-tight md:text-5xl">Кухни на заказ в Смолевичах</h1><p className="mt-3 max-w-2xl text-base leading-7 text-stone-700">По размерам квартиры или дома. Выберите кухню, передайте размеры и обсудите комплектацию. Для Смолевичского района условия выезда уточним по адресу.</p>
      <a href="#form" className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:hidden">Получить расчёт кухни</a>
    </div></section>
    <SmolevichiShowroom afterBudget={<><Preparation /><Faq /></>}><Planning /><District /></SmolevichiShowroom>
  </ExploreContextProvider></main>;
}
