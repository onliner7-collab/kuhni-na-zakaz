import Link from "@/components/navigation/Link";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";
import { ZHODINO_PATH, ZHODINO_TITLE, zhodinoFaq, zhodinoViews } from "@/data/zhodino-page";
import { ZhodinoShowroom } from "./ZhodinoShowroom";

function Planning() {
  return <section id="zhodino-planning" className="section-padding bg-white" aria-labelledby="zhodino-planning-title"><div className="container-site">
    <p className="text-sm font-semibold text-primary">Планировка под помещение</p>
    <h2 id="zhodino-planning-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Кухни на заказ в Жодино: выберите свою форму</h2>
    <p className="mt-3 max-w-2xl leading-7 text-stone-700">Для квартиры или частного дома начинаем с размеров, проходов и техники. Эти идеи можно адаптировать под ваше помещение.</p>
    <div className="mt-6 grid gap-5 md:grid-cols-3">{zhodinoViews.slice(0, 3).map((view, index) => <article key={view.id} className="overflow-hidden rounded-2xl border border-stone-200">
      <img src={view.image} srcSet={`${view.mobile} 480w, ${view.image} 1200w`} alt={view.alt} width={1200} height={800} loading="lazy" decoding="async" sizes="(max-width: 767px) 100vw, 33vw" className="aspect-[3/2] w-full object-cover" />
      <div className="p-5"><h3 className="text-xl font-bold">{["Угловая кухня", "Прямая кухня", "Маленькая кухня"][index]}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{["Две рабочие стены. Проверьте угол, проход и место для открытия посудомоечной машины.", "Одна линия шкафов. Подходит для вытянутой комнаты или кухни в студии; оставьте место для подготовки продуктов.", "Размеры важнее числа шкафов. Ящики, высокие секции и подходящая техника помогают использовать пространство."][index]}</p><Link href={view.href} className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{view.link} →</Link></div>
    </article>)}</div>
    <details className="mt-5 rounded-xl border border-stone-300 p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Кухня до потолка, с островом или для новостройки</summary><p className="mt-3 leading-7 text-stone-700">Кухня до потолка добавляет верхнее хранение, но требует точного замера высоты и проверки вентиляции. Остров подходит там, где остаются удобные проходы. Для новостройки и частного дома расположение розеток, воды и техники лучше согласовать до чистовой отделки.</p><div className="mt-2 flex flex-wrap gap-x-5"><Link href="/catalog/kuhni-do-potolka" className="inline-flex min-h-11 items-center text-primary underline">Кухни до потолка</Link><Link href="/catalog/kuhni-s-ostrovom" className="inline-flex min-h-11 items-center text-primary underline">Кухни с островом</Link><Link href="/design-proekt-kuhni" className="inline-flex min-h-11 items-center text-primary underline">Подготовить дизайн-проект</Link></div></details>
    <Link href="/catalog" className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline">Смотреть все идеи кухонь →</Link>
  </div></section>;
}

function Logistics() {
  return <section id="zhodino-order" className="section-padding bg-stone-50" aria-labelledby="zhodino-order-title"><div className="container-site">
    <p className="text-sm font-semibold text-primary">От заявки до установки</p><h2 id="zhodino-order-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Замер, доставка и монтаж кухни в Жодино</h2>
    <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-center"><figure><img src={zhodinoViews[3].image} srcSet={`${zhodinoViews[3].mobile} 480w, ${zhodinoViews[3].image} 1200w`} alt={zhodinoViews[3].alt} width={1200} height={800} loading="lazy" decoding="async" sizes="(max-width: 1023px) 100vw, 50vw" className="aspect-[3/2] w-full rounded-2xl object-cover" /><figcaption className="mt-2 text-xs text-stone-600">Иллюстрация этапа монтажа, не фото объекта в Жодино.</figcaption></figure><ol className="grid gap-4">{[
      ["Размеры и пожелания", "Пришлите план или длины стен, фото и модели техники. Начнём с предварительной комплектации."],
      ["Замер по адресу", "Проверим стены, углы, высоту потолка и коммуникации. Дату и условия выезда согласуем заранее."],
      ["Проект и смета", "Фиксируем фасады, столешницу, фурнитуру, размеры, стоимость и состав работ до изготовления."],
      ["Доставка и установка", "Согласуем адрес, этаж, занос и готовность помещения. При монтаже проверяем фасады и механизмы."],
    ].map(([title, text], index) => <li key={title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">{index + 1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-700">{text}</p></div></li>)}</ol></div>
    <details className="mt-5 rounded-xl border border-stone-300 bg-white p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Что уточнить для выезда в Жодино и рядом с городом?</summary><p className="mt-3 leading-7 text-stone-700">Укажите точный адрес, этаж и наличие лифта. Для частного дома уточните подъезд к участку и вход в помещение. Выезд, доставка, занос и монтаж рассчитываются по условиям заказа; фиксированные сроки и бесплатную доставку без согласования не обещаем.</p></details>
    <div className="mt-3 flex flex-wrap gap-x-5"><Link href="/delivery-installation" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Условия доставки и монтажа</Link><Link href="/blog/kak-podgotovitsya-k-zameru-kuhni" className="inline-flex min-h-11 items-center font-semibold text-primary underline">Подготовка к замеру</Link></div>
  </div></section>;
}

function Faq() {
  return <section id="zhodino-faq" className="section-padding bg-white" aria-labelledby="zhodino-faq-title"><div className="container-site max-w-4xl"><h2 id="zhodino-faq-title" className="font-serif text-2xl font-bold md:text-3xl">Перед покупкой кухни: вопросы и ответы</h2><div className="mt-6 space-y-3">{zhodinoFaq.map(item => <details key={item.question} className="rounded-xl border border-stone-300 p-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">{item.question}</summary><p className="mt-3 leading-7 text-stone-700">{item.answer}</p></details>)}</div><Link href="/locations" className="mt-3 inline-flex min-h-11 items-center text-primary underline">Условия заказа в других городах →</Link></div></section>;
}

export function ZhodinoPage() {
  const faq = faqJsonLd(zhodinoFaq);
  return <main id="zhodino-page">
    <JsonLd data={[
      breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Города", path: "/locations" }, { name: "Жодино", path: ZHODINO_PATH }]),
      { "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteUrl(ZHODINO_PATH)}#webpage`, url: siteUrl(ZHODINO_PATH), name: ZHODINO_TITLE, inLanguage: "ru-BY", dateModified: "2026-10-09" },
      ...(faq ? [faq] : []),
    ]} />
    <section className="bg-stone-50 pb-5 pt-5 md:pb-7 md:pt-8"><div className="container-site">
      <nav aria-label="Хлебные крошки" className="mb-4 flex flex-wrap items-center gap-x-2 text-sm text-stone-600"><Link href="/" className="underline">Главная</Link><span aria-hidden="true">/</span><Link href="/locations" className="underline">Города</Link><span aria-hidden="true">/</span><span aria-current="page">Жодино</span></nav>
      <h1 className="max-w-4xl font-serif text-[1.9rem] font-bold leading-tight md:text-5xl">Купить кухню в Жодино на заказ</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700">По размерам вашей квартиры или дома. Выберите планировку и материалы — подготовим расчёт и согласуем замер, доставку и монтаж.</p>
    </div></section>
    <ZhodinoShowroom planning={<Planning />} logistics={<Logistics />} faq={<Faq />} />
  </main>;
}
