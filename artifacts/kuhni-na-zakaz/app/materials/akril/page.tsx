import type { Metadata } from "next";
import { MaterialMarketEvidence } from "@/components/materials/MaterialMarketEvidence";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { MaterialDecisionExplorer } from "@/components/materials/MaterialDecisionExplorer";
import { MaterialsLeadSummary } from "@/components/materials/MaterialsHub";
import {
  AcrylicActions,
  AcrylicSurface,
  AcrylicGallery,
  AcrylicRooms,
  AcrylicComparison,
  AcrylicPrice,
} from "@/components/materials/AcrylicVisualJourney";
import {
  ACRYLIC_PHOTOS,
  ACRYLIC_FAQ,
  ACRYLIC_SOURCE,
} from "@/data/acrylic-content";
import { MATERIAL_EXPLORATION } from "@/data/material-exploration";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Акриловые кухни на заказ — фото, фасады, уход и расчёт";
const description =
  "Кухни с акриловыми фасадами на заказ: примеры интерьеров, поверхность и кромка, уход и сравнение с HPL и эмалью. Расчёт в BYN по вашим размерам и комплектации.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/materials/akril" },
  robots: { index: true, follow: true },
  openGraph: buildOpenGraph("/materials/akril", title, description, {
    images: [
      {
        url: ACRYLIC_PHOTOS[0].src,
        width: 1200,
        height: 800,
        alt: ACRYLIC_PHOTOS[0].alt,
      },
    ],
  }),
  twitter: buildTwitterMetadata(title, description, ACRYLIC_PHOTOS[0].src),
};
const section = "mt-10 scroll-mt-24";
const panel = "rounded-2xl border border-stone-200 bg-white p-5";
const note = "text-sm leading-6 text-stone-600";
const link =
  "inline-flex min-h-11 items-center font-semibold text-violet-800 underline underline-offset-4";
const summary =
  "min-h-11 cursor-pointer content-center font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700";
function Figure({ index }: { index: number }) {
  const p = ACRYLIC_PHOTOS[index];
  return (
    <figure className="overflow-hidden rounded-3xl bg-white">
      <Image
        src={p.src}
        alt={p.alt}
        width={1200}
        height={800}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="aspect-[3/2] w-full object-cover"
      />
      <figcaption className="p-4 text-sm leading-6 text-stone-600">
        {p.caption} <span className="text-xs">Создано с помощью ИИ.</span>
      </figcaption>
    </figure>
  );
}
export default function AcrylicPage() {
  return (
    <ExploreContextProvider sourceRoute="/materials/akril">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Материалы", path: "/materials" },
          { name: "Акриловые фасады", path: "/materials/akril" },
        ])}
      />
      <div
        id="acrylic-visual-page"
        className="bg-[#f7f5f2] pb-16 text-stone-950"
      >
        <div className="container-site py-3 md:py-6">
          <nav
            aria-label="Хлебные крошки"
            className="mb-3 flex flex-wrap items-center gap-2 text-xs text-stone-600"
          >
            <Link href="/" className="inline-flex min-h-11 items-center">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/materials"
              className="inline-flex min-h-11 items-center"
            >
              Материалы
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Акриловые фасады</span>
          </nav>
          <section
            aria-labelledby="acrylic-title"
            className="overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid lg:grid-cols-[1fr_1.35fr]"
          >
            <div className="p-4 md:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-800">
                Рассмотрите поверхность · сравните решения
              </p>
              <h1
                id="acrylic-title"
                className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl"
              >
                Кухни с акриловыми фасадами на заказ
              </h1>
              <p className={`${note} mt-4`}>
                Гладкая поверхность, отражения и сочетания для кухни по вашим
                размерам. Покажем визуальные идеи, объясним уход и поможем
                сравнить акрил с другими покрытиями. Серию, основу, финиш и
                наличие согласуем по образцу.
              </p>
              <div className="hidden lg:block">
                <AcrylicActions />
              </div>
            </div>
            <figure className="relative">
              <Image
                src={ACRYLIC_PHOTOS[0].src}
                alt={ACRYLIC_PHOTOS[0].alt}
                width={1200}
                height={800}
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[3/2] h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 right-3 w-fit rounded-full bg-stone-950/85 px-3 py-2 text-xs font-medium text-white">
                Визуальная идея · создано с помощью ИИ
              </figcaption>
            </figure>
            <div className="px-4 pb-4 lg:hidden">
              <AcrylicActions />
            </div>
          </section>
          <nav
            aria-label="Разделы страницы акрила"
            className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
          >
            {[
              ["#acrylic-construction", "Состав фасада"],
              ["#acrylic-surface", "Поверхность и торец"],
              ["#acrylic-gallery", "Примеры кухонь"],
              ["#acrylic-care", "Уход"],
              ["#acrylic-alternatives", "Сравнение"],
              ["#acrylic-price", "Цена и состав"],
            ].map(([href, label]) => (
              <a key={href} href={href} className={link}>
                {label}
              </a>
            ))}
          </nav>
          <section
            id="acrylic-construction"
            className={section}
            aria-labelledby="acrylic-construction-title"
          >
            <h2
              id="acrylic-construction-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Акрил — поверхность фасада, а не материал всей кухни
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Figure index={7} />
              <div className={panel}>
                <p className={note}>
                  Фасад оценивают целиком. На рынке встречаются панели на МДФ,
                  но основание конкретного заказа, толщину, отделку обратной
                  стороны и торец нужно подтвердить. Корпус, столешница и
                  механизмы выбираются отдельно.
                </p>
                <ol className="mt-5 space-y-4">
                  {[
                    [
                      "Лицевая облицовка",
                      "Название серии, цвет, глянец или мат, наличие защитного слоя и инструкция ухода.",
                    ],
                    [
                      "Основа",
                      "Конкретная плита и толщина детали, размеры дверок и крепления по спецификации.",
                    ],
                    [
                      "Торец и обратная сторона",
                      "Материал кромки, линия соединения, углы и отделка сзади по реальному образцу.",
                    ],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-3">
                      <span className="font-bold text-violet-800">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="font-bold">{t}</h3>
                        <p className={`${note} mt-1`}>{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={`${note} mt-4`}>
                  Образец на иллюстрации условный и не подтверждает устройство
                  предлагаемой серии. Точную конструкцию фиксируем до
                  изготовления.
                </p>
              </div>
            </div>
          </section>
          <AcrylicSurface />
          <details className={`${panel} mt-3`}>
            <summary className={summary}>
              Какие акриловые исполнения доступны?
            </summary>
            <p className={`${note} mt-3`}>
              Актуальную коллекцию и наличие проверим при подборе. Матовые и
              глянцевые исполнения существуют у производителей, но не все серии
              доступны для любого заказа. На странице нет обещания любого цвета,
              anti-fingerprint, конкретной толщины или бренда. Названия REHAU и
              Senosan в исследовании не означают, что именно эти материалы
              используются в заказе.
            </p>
          </details>
          <AcrylicGallery />
          <details className={`${panel} mt-5`}>
            <summary className={summary}>
              Ещё ракурсы: фасад спереди, под углом и в интерьере
            </summary>
            <MaterialDecisionExplorer config={MATERIAL_EXPLORATION.akril} />
          </details>
          <details className={`${panel} mt-3`}>
            <summary className={summary}>
              Прежняя подборка кухонь и крупных планов
            </summary>
            <MaterialDetailGallery slug="akril" title="Акриловые фасады" />
          </details>
          <section
            id="acrylic-combinations"
            className={section}
            aria-labelledby="acrylic-combinations-title"
          >
            <h2
              id="acrylic-combinations-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Цвет фасада, столешница и свет — выбирайте вместе
            </h2>
            <p className={`${note} mt-3`}>
              Белый, бежевый, серый, графитовый или цветной фасад воспринимается
              по-разному рядом с деревом и каменным рисунком. Проверьте образцы
              днём и с будущей подсветкой. Древесный акцент на фото не означает
              акрил под дерево, а рисунок камня не определяет материал
              столешницы.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Figure index={4} />
              <Figure index={9} />
            </div>
            <details className={`${panel} mt-3`}>
              <summary className={summary}>
                Тёмный глянец, белый цвет и фасады без ручек
              </summary>
              <p className={`${note} mt-3`}>
                На чёрном или графитовом образце посмотрите следы от касания под
                углом. Для белого декора уточните условия эксплуатации и данные
                о стабильности цвета: отсутствие пожелтения для любого акрила не
                гарантируем. Профиль, накладные ручки и push-to-open влияют на
                то, как часто касаются плоскости. Интегрированная ручка, радиусы
                и фрезеровка требуют подтверждения технологии.
              </p>
            </details>
          </section>
          <AcrylicRooms />
          <section
            id="acrylic-layouts"
            className={section}
            aria-labelledby="acrylic-layouts-title"
          >
            <h2
              id="acrylic-layouts-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Планировка и размеры: от компактной кухни до острова
            </h2>
            <p className={`${note} mt-3`}>
              Прямая кухня около 2 или 3 метров и угловая около 2,4 × 1,8 м —
              примеры для обсуждения, а не готовые комплекты с фиксированной
              ценой. Для маленькой кухни важны рабочая зона и хранение, для
              шкафов до потолка — высота и открывание антресолей. П-образную
              кухню, остров и барную стойку проектируем с проверкой проходов.
              Модели встроенной техники согласуют до деталировки.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5">
              {[
                ["/catalog/pryamye-kuhni", "Прямые кухни"],
                ["/catalog/uglovye-kuhni", "Угловые кухни"],
                ["/catalog/malenkie-kuhni", "Маленькие кухни"],
                ["/catalog/kuhni-do-potolka", "Кухни до потолка"],
                ["/catalog/kuhni-s-ostrovom", "Кухни с островом"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className={link}>
                  {label}
                </Link>
              ))}
            </div>
          </section>
          <section
            id="acrylic-care"
            className={section}
            aria-labelledby="acrylic-care-title"
          >
            <h2
              id="acrylic-care-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Уход за акриловыми фасадами без экспериментов
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Figure index={8} />
              <div className={panel}>
                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-stone-600">
                  <li>
                    Пользуйтесь чистой мягкой салфеткой и средством, разрешённым
                    для конкретной серии.
                  </li>
                  <li>
                    Не растирайте пыль всухую. Удаляйте остатки средства, воду у
                    торцов и конденсат.
                  </li>
                  <li>
                    Не применяйте абразивы, жёсткие губки, растворители, меламин
                    и пар без разрешения инструкции.
                  </li>
                  <li>
                    Не направляйте пар чайника на шкафы; защиту и зазоры у
                    техники согласуйте в проекте.
                  </li>
                  <li>
                    Царапины, сколы и отслоения сначала покажите специалисту.
                    Полировка разрешена не для всех покрытий.
                  </li>
                </ul>
                <p className={`${note} mt-4`}>
                  Различия серий сверены с{" "}
                  <a
                    href={ACRYLIC_SOURCE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-violet-800 underline"
                  >
                    технической документацией REHAU RAUVISIO brilliant
                  </a>
                  . Это справочный пример производителя, не подтверждение
                  поставщика. Для заказа нужна инструкция выбранной серии.
                </p>
              </div>
            </div>
          </section>
          <AcrylicComparison />
          <AcrylicPrice />
          <MaterialMarketEvidence materialId="acrylic" />
          <section
            id="acrylic-faq"
            className={section}
            aria-labelledby="acrylic-faq-title"
          >
            <h2
              id="acrylic-faq-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Вопросы перед заказом акриловой кухни
            </h2>
            <div className="mt-5 space-y-3">
              {ACRYLIC_FAQ.map(([q, a]) => (
                <details key={q} className={panel}>
                  <summary className={summary}>{q}</summary>
                  <p className={`${note} mt-3`}>{a}</p>
                </details>
              ))}
            </div>
          </section>
          <section
            id="acrylic-order"
            className={section}
            aria-labelledby="acrylic-order-title"
          >
            <h2
              id="acrylic-order-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Как заказать кухню и согласовать фасады
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Помещение",
                  "Пришлите размеры стен, высоту, фотографии, коммуникации и список техники.",
                ],
                [
                  "Образец",
                  "Согласуем серию акрила, основу, финиш, кромку и обратную сторону.",
                ],
                [
                  "Проект и смета",
                  "Укажем комплектацию, стоимость в BYN, сроки, доставку и монтаж по адресу.",
                ],
                [
                  "Приёмка",
                  "Сопоставьте фасад с образцом, осмотрите торцы и проверьте работу дверок и ящиков.",
                ],
              ].map(([t, d], i) => (
                <li key={t} className={panel}>
                  <span className="text-3xl font-bold text-violet-800">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-bold">{t}</h3>
                  <p className={`${note} mt-2`}>{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link href="/locations/minsk" className={link}>
                Заказ в Минске
              </Link>
              <Link href="/locations/minskaya-oblast" className={link}>
                Условия в Минской области
              </Link>
              <Link href="/calculator" className={link}>
                Предварительный расчёт
              </Link>
            </div>
          </section>
          <section
            id="materials-form"
            className={`${section} grid gap-5 lg:grid-cols-2`}
            aria-labelledby="acrylic-form-title"
          >
            <div>
              <h2 id="acrylic-form-title" className="text-2xl font-bold">
                Рассчитаем кухню по вашим размерам
              </h2>
              <p className={`${note} my-3`}>
                Можно выбрать акрил, добавить альтернативы или оставить заявку
                «Помогите выбрать». Просмотр фотографии не означает выбор
                материала.
              </p>
              <MaterialsLeadSummary />
            </div>
            <div id="form" className={panel}>
              <ContactForm
                source="material-acrylic"
                sourcePage="/materials/akril"
                sourceType="material"
                submitLabel="Рассчитать кухню"
                answersEventName="acrylic-answers"
              />
            </div>
          </section>
        </div>
      </div>
    </ExploreContextProvider>
  );
}
