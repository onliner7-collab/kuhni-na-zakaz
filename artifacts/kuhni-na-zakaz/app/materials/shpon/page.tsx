import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { MaterialDecisionExplorer } from "@/components/materials/MaterialDecisionExplorer";
import { MaterialsLeadSummary } from "@/components/materials/MaterialsHub";
import { VeneerActions, VeneerVisualSelector, VeneerGallery, VeneerComparison, VeneerPrice } from "@/components/materials/VeneerVisualJourney";
import { VENEER_PHOTOS, VENEER_FAQ, VENEER_TECHNICAL_SOURCE } from "@/data/veneer-content";
import { MATERIAL_EXPLORATION } from "@/data/material-exploration";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Кухни со шпоном на заказ — фото, рисунок и отделка фасадов";
const description = "Кухни с фасадами из натурального шпона: рисунок дерева, отделка и сочетания с белым, бежевым и графитом. Сравнение материалов и расчёт в BYN по вашим размерам.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/materials/shpon" }, robots: { index: true, follow: true },
  openGraph: buildOpenGraph("/materials/shpon", title, description, { images: [{ url: VENEER_PHOTOS[0].src, width: 1200, height: 800, alt: VENEER_PHOTOS[0].alt }] }),
  twitter: buildTwitterMetadata(title, description, VENEER_PHOTOS[0].src),
};
const section = "mt-10 scroll-mt-24";
const panel = "rounded-2xl border border-stone-200 bg-white p-5";
const note = "text-sm leading-6 text-stone-600";
const link = "inline-flex min-h-11 items-center font-semibold text-violet-800 underline underline-offset-4";
const summary = "min-h-11 cursor-pointer content-center font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700";

export default function VeneerPage() {
  const hero = VENEER_PHOTOS[0];
  return <ExploreContextProvider sourceRoute="/materials/shpon">
    <JsonLd data={breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Материалы", path: "/materials" }, { name: "Шпонированные фасады", path: "/materials/shpon" }])} />
    <div id="veneer-visual-page" className="bg-[#f7f5f2] pb-16 text-stone-950"><div className="container-site py-3 md:py-6">
      <nav aria-label="Хлебные крошки" className="mb-3 flex flex-wrap items-center gap-2 text-xs text-stone-600"><Link href="/" className="inline-flex min-h-11 items-center">Главная</Link><span aria-hidden="true">/</span><Link href="/materials" className="inline-flex min-h-11 items-center">Материалы</Link><span aria-hidden="true">/</span><span aria-current="page">Шпонированные фасады</span></nav>
      <section aria-labelledby="veneer-title" className="overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid lg:grid-cols-[1fr_1.35fr]">
        <div className="p-4 md:p-7"><p className="text-xs font-bold uppercase tracking-widest text-violet-800">Живой рисунок дерева · выбор по образцу</p><h1 id="veneer-title" className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl">Кухни с фасадами из натурального шпона на заказ</h1><p className={`${note} mt-4`}>Показываем натуральный рисунок, отделку и сочетания. Рассмотрите фасады вблизи, сравните решения и обсудите кухню по своим размерам. Породу, основу и защитное покрытие согласуем по образцу.</p><div className="hidden lg:block"><VeneerActions /></div></div>
        <figure className="relative"><Image src={hero.src} alt={hero.alt} width={1200} height={800} unoptimized priority fetchPriority="high" sizes="(max-width:1024px) 100vw, 58vw" className="aspect-[3/2] h-full w-full object-cover" /><figcaption className="absolute bottom-3 left-3 right-3 w-fit rounded-full bg-stone-950/85 px-3 py-2 text-xs font-medium text-white">Визуальная идея · создано с помощью ИИ</figcaption></figure>
        <div className="px-4 pb-4 lg:hidden"><VeneerActions /></div>
      </section>
      <nav aria-label="Разделы страницы шпона" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">{[["construction", "Состав фасада"], ["surface", "Рисунок и отделка"], ["combination", "Сочетания"], ["gallery", "Фотоидеи"], ["care", "Уход"], ["alternatives", "Сравнение"], ["price", "Цена и состав"]].map(([id, label]) => <a key={id} href={`#veneer-${id}`} className={link}>{label}</a>)}</nav>
      <section id="veneer-construction" className={section} aria-labelledby="veneer-construction-title"><h2 id="veneer-construction-title" className="text-2xl font-bold md:text-3xl">Шпон — натуральная облицовка фасада</h2>
        <div className="mt-5 grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.3fr_1fr]">
          <figure>
            <Image src={VENEER_PHOTOS[1].src} alt="Крупный план шпонированных фасадов: древесные волокна на лицевой поверхности и торец приоткрытой дверцы" width={1200} height={800} unoptimized loading="lazy" sizes="(max-width:1024px) 100vw, 58vw" className="aspect-[3/2] w-full object-cover" />
            <figcaption className="px-5 py-4 text-sm leading-6 text-stone-600">Так может выглядеть фасад со шпоном: рисунок дерева виден на плоскости, а у открытой дверцы можно рассмотреть торец. ИИ-иллюстрация.</figcaption>
          </figure>
          <div className="p-5 md:p-7">
            <h3 className="text-xl font-bold">Древесный слой снаружи, основа внутри</h3>
            <p className={`${note} mt-3`}>Шпон — тонкий срез натуральной древесины, которым облицовывают основу фасада. Снаружи вы видите волокна и рисунок дерева. Сверху наносят согласованную защитную отделку.</p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-stone-600">
              <li>На лицевой поверхности рассмотрите направление и переходы рисунка между дверцами.</li>
              <li>У торца проверьте, как оформлены край, угол и обратная сторона фасада.</li>
              <li>Основу, толщину шпона и покрытие уточняют по образцу и спецификации — по фото их определить нельзя.</li>
            </ul>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">{[
        ["Натуральный шпон", "Тонкий древесный слой на основе с защитной отделкой. Рисунок связан с древесиной, её срезом и подбором листов. Основание и обратную сторону указывают отдельно."],
        ["Массив", "Другая конструкция: детали из древесины, нередко в сочетании с филёнкой. Шпонированная дверца не становится массивом из-за натурального рисунка."],
        ["Декор под дерево", "Рисунок на ЛДСП или плёнке воспроизводится декоративным покрытием. Название цвета «дуб» или «орех» не подтверждает натуральный шпон."],
      ].map(([t, d]) => <article key={t} className={panel}><h3 className="text-lg font-bold">{t}</h3><p className={`${note} mt-3`}>{d}</p></article>)}</div><p className={`${note} mt-3`}>Корпус, столешница, петли и направляющие — отдельные части кухни. До заказа согласуют плиту и толщину фасада, вид шпона, торцы, обратную сторону и допустимые размеры. Наличие МДФ, фанеры или другой основы нельзя установить по фотографии.</p></section>
      <VeneerVisualSelector kind="surface" />
      <details className={`${panel} mt-3`}><summary className={summary}>Дуб, орех, ясень: какие исполнения доступны?</summary><p className={`${note} mt-3`}>На иллюстрациях показаны светлое и тёмное древесные направления. Это не перечень складских позиций. Уточним актуальные породы, строганый или реконструированный шпон, сорт, браширование, тонировку и систему отделки. Рельеф, радиусы, фрезеровка и встроенная ручка требуют подтверждения технологии.</p></details>
      <VeneerVisualSelector kind="combination" />
      <VeneerGallery />
      <details className={`${panel} mt-5`}><summary className={summary}>Ещё ракурсы: фасад спереди, под углом и в интерьере</summary><MaterialDecisionExplorer config={MATERIAL_EXPLORATION.shpon} /></details>
      <details className={`${panel} mt-3`}><summary className={summary}>Прежняя подборка кухонь и крупных планов</summary><MaterialDetailGallery slug="shpon" title="Шпонированные фасады" /></details>
      <section id="veneer-rooms" className={section} aria-labelledby="veneer-rooms-title"><h2 id="veneer-rooms-title" className="text-2xl font-bold md:text-3xl">Квартира, дом или дача: что учесть в проекте</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{[
        ["Квартира и новостройка", "Сверьте план с фактическими размерами после отделки. Для кухни-гостиной согласуйте дерево с мебелью жилой зоны. Модели техники и коммуникации определяют до деталировки."],
        ["Частный дом", "Для острова и высоких колонн проверьте проходы, открывание и высоту помещения. Солнечное окно влияет на восприятие оттенка; сравните образцы на месте."],
        ["Деревня и сезонная дача", "Расскажите об отоплении зимой, влажности и вентиляции. Пригодность конструкции для неотапливаемого помещения проверяют по инструкции изготовителя. Подъезд, доставку и монтаж согласуют по адресу."],
      ].map(([t, d]) => <article key={t} className={panel}><h3 className="font-bold">{t}</h3><p className={`${note} mt-3`}>{d}</p></article>)}</div></section>
      <section id="veneer-layouts" className={section} aria-labelledby="veneer-layouts-title"><h2 id="veneer-layouts-title" className="text-2xl font-bold md:text-3xl">Размеры и планировка кухни со шпоном</h2><p className={`${note} mt-3`}>Прямая кухня 2 или 3 метра, угловая, П-образная, до потолка или с островом — варианты для проектирования по помещению. В маленькой кухне сначала разместите мойку, плиту и рабочую зону. Для антресолей проверьте доступ и открывание. На длинном ряду заранее согласуйте подбор рисунка; размер помещения не равен длине гарнитура.</p><div className="mt-3 flex flex-wrap gap-x-5">{[["pryamye-kuhni", "Прямые кухни"], ["uglovye-kuhni", "Угловые кухни"], ["malenkie-kuhni", "Маленькие кухни"], ["kuhni-do-potolka", "Кухни до потолка"], ["kuhni-s-ostrovom", "Кухни с островом"]].map(([slug, label]) => <Link key={slug} href={`/catalog/${slug}`} className={link}>{label}</Link>)}</div></section>
      <section id="veneer-care" className={section} aria-labelledby="veneer-care-title"><h2 id="veneer-care-title" className="text-2xl font-bold md:text-3xl">Уход и особенности выбора шпонированных фасадов</h2><div className="mt-5 grid gap-4 lg:grid-cols-2"><figure className="overflow-hidden rounded-3xl bg-white"><Image src={VENEER_PHOTOS[4].src} alt={VENEER_PHOTOS[4].alt} width={1200} height={800} unoptimized loading="lazy" className="aspect-[3/2] w-full object-cover" /><figcaption className="p-4 text-sm text-stone-600">Отделку и уход выбирают вместе. Создано с помощью ИИ.</figcaption></figure><div className={panel}><ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-stone-600"><li>Убирайте капли у мойки и стыков, конденсат и жир мягкой чистой салфеткой по инструкции покрытия.</li><li>Не направляйте пар чайника на дверцы; защиту у духовки и посудомоечной машины согласуйте по инструкциям техники и фасадов.</li><li>Не применяйте абразивы, растворители и пароочиститель без разрешения изготовителя. Не наносите масло на лакированный фасад автоматически.</li><li>Природные различия и изменение восприятия при свете учитывайте при выборе. Позднее добавленная дверца может отличаться от прежних.</li><li>Не шлифуйте царапину самостоятельно. Покажите повреждение специалисту: незаметный ремонт и восстановление разбухшей основы не гарантируются.</li></ul><p className={`${note} mt-4`}>Пример документации производителя — <a href={VENEER_TECHNICAL_SOURCE} className="underline" target="_blank" rel="noopener noreferrer">панели Decospan Shinnoki</a>. Это справочный источник, а не подтверждение поставщика нашего заказа. Правила конкретной отделки передаём после её согласования.</p></div></div></section>
      <VeneerComparison /><VeneerPrice />
      <section id="veneer-faq" className={section} aria-labelledby="veneer-faq-title"><h2 id="veneer-faq-title" className="text-2xl font-bold md:text-3xl">Вопросы перед заказом кухни со шпоном</h2><div className="mt-5 space-y-3">{VENEER_FAQ.map(([q, a]) => <details key={q} className={panel}><summary className={summary}>{q}</summary><p className={`${note} mt-3`}>{a}</p></details>)}</div></section>
      <section id="veneer-order" className={section} aria-labelledby="veneer-order-title"><h2 id="veneer-order-title" className="text-2xl font-bold md:text-3xl">Как согласовать кухню и сохранить выбранные решения</h2><ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Размеры", "Пришлите план стен, высоту, коммуникации, фотографии помещения и список техники."], ["Образец и раскладка", "Согласуем вид шпона, основу, оттенок, рисунок, отделку и торцы."], ["Проект и смета", "Зафиксируем комплектацию с доводчиками, ящиками и столешницей, технику и услуги отдельными строками, стоимость в BYN и сроки."], ["Приёмка", "Сверьте фасады с согласованным образцом и раскладкой; проверьте торцы, открывание и работу механизмов."]].map(([t, d], i) => <li key={t} className={panel}><span className="text-3xl font-bold text-violet-800">0{i + 1}</span><h3 className="mt-3 font-bold">{t}</h3><p className={`${note} mt-2`}>{d}</p></li>)}</ol><div className="mt-3 flex flex-wrap gap-x-5"><Link href="/locations/minsk" className={link}>Заказ в Минске</Link><Link href="/locations/minskaya-oblast" className={link}>Условия в Минской области</Link><Link href="/prices" className={link}>Что входит в стоимость</Link><Link href="/calculator" className={link}>Предварительный расчёт</Link></div></section>
      <section id="materials-form" className={`${section} grid gap-5 lg:grid-cols-2`} aria-labelledby="veneer-form-title"><div><h2 id="veneer-form-title" className="text-2xl font-bold">Рассчитаем кухню по вашим размерам</h2><p className={`${note} my-3`}>Добавьте шпон и альтернативы к сравнению, отметьте предпочтение или оставьте заявку «Помогите выбрать». В расчёт передадим явно выбранные решения.</p><MaterialsLeadSummary /></div><div id="form" className={panel}><ContactForm source="material-veneer" sourcePage="/materials/shpon" sourceType="material" submitLabel="Рассчитать кухню" answersEventName="veneer-answers" /></div></section>
    </div></div>
  </ExploreContextProvider>;
}
