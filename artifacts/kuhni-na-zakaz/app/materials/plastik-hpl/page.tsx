import type { Metadata } from "next";
import { MaterialMarketEvidence } from "@/components/materials/MaterialMarketEvidence";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { Droplets, Sparkles, Thermometer, ClipboardCheck } from "lucide-react";
import { ExploreContextProvider } from "@/components/exploration";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { MaterialDecisionExplorer } from "@/components/materials/MaterialDecisionExplorer";
import { MaterialsLeadSummary } from "@/components/materials/MaterialsHub";
import {
  HplActions,
  HplComparison,
  HplConstruction,
  HplFinishes,
  HplGallery,
  HplPriceScenarios,
  HplRooms,
} from "@/components/materials/HplVisualJourney";
import {
  HPL_CARE_SOURCE,
  HPL_PROCESS_SOURCE,
  HPL_FAQ,
  HPL_PHOTOS,
  HPL_SEMANTIC_NOTES,
} from "@/data/hpl-content";
import { MATERIAL_EXPLORATION } from "@/data/material-exploration";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Кухни из пластика HPL на заказ — фото, кромка и расчёт";
const description =
  "Кухни с фасадами HPL на заказ: сами приклеиваем пластик и кромку на МДФ или ДСП. Фото, сравнение с акрилом и эмалью, уход и расчёт в BYN по вашим размерам.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/materials/plastik-hpl" },
  robots: { index: true, follow: true },
  openGraph: buildOpenGraph("/materials/plastik-hpl", title, description, {
    images: [
      {
        url: HPL_PHOTOS[0].src,
        width: 1200,
        height: 800,
        alt: HPL_PHOTOS[0].alt,
      },
    ],
  }),
  twitter: buildTwitterMetadata(title, description, HPL_PHOTOS[0].src),
};
const panel = "rounded-2xl border border-stone-200 bg-white p-4 md:p-5";
const note = "text-sm leading-6 text-stone-600";
const summary =
  "min-h-11 cursor-pointer content-center font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700";
const section = "mt-10 scroll-mt-24";
const link =
  "inline-flex min-h-11 items-center font-semibold text-violet-800 underline underline-offset-4";

export default function HplPage() {
  return (
    <ExploreContextProvider sourceRoute="/materials/plastik-hpl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Материалы", path: "/materials" },
          { name: "Фасады с HPL", path: "/materials/plastik-hpl" },
        ])}
      />
      <div id="hpl-visual-page" className="bg-[#f7f5f2] pb-16 text-stone-950">
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
            <span aria-current="page">Фасады с HPL</span>
          </nav>
          <section
            aria-labelledby="hpl-title"
            className="overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid lg:grid-cols-[1fr_1.35fr]"
          >
            <div className="p-4 md:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-800">
                Сами облицовываем · сами кромим
              </p>
              <h1
                id="hpl-title"
                className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl"
              >
                Кухни с фасадами HPL на заказ
              </h1>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                Пластик HPL на основе МДФ или ДСП. Рассмотрите покрытие, торец и
                готовые сочетания, сравните материалы и получите расчёт по своим
                размерам.
              </p>
              <div className="hidden lg:block">
                <HplActions />
              </div>
            </div>
            <figure className="relative">
              <Image
                src={HPL_PHOTOS[0].src}
                alt={HPL_PHOTOS[0].alt}
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
              <HplActions />
            </div>
          </section>
          <nav
            aria-label="Разделы страницы HPL"
            className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm"
          >
            {[
              ["#hpl-construction", "МДФ и ДСП"],
              ["#hpl-edge", "Кромка"],
              ["#hpl-gallery", "Примеры"],
              ["#material-explorer", "Сравнение ракурсов"],
              ["#material-detail-gallery", "Как выглядит"],
              ["#hpl-alternatives", "Другие покрытия"],
              ["#hpl-price", "Цена и состав"],
            ].map(([href, label]) => (
              <a key={href} href={href} className={link}>
                {label}
              </a>
            ))}
          </nav>

          <HplConstruction />
          <details className={`${panel} mt-3`}>
            <summary className={summary}>Чем HPL отличается от CPL, плёнки и акрила?</summary>
            <p className={`${note} mt-3`}>HPL и CPL обозначают способы изготовления декоративного ламината: HPL получают в циклическом прессе, CPL — в непрерывном процессе. Одного сокращения недостаточно для оценки готового фасада: сопоставляют конкретную серию, основание и торец. Плёнка ПВХ и акрил — другие покрытия; название «пластик» не делает их одним материалом.</p>
            <p className={`${note} mt-3`}>Термины сверены с <a href={HPL_PROCESS_SOURCE} target="_blank" rel="noopener noreferrer" className="font-semibold text-violet-800 underline">объяснением технологии HPL и CPL от EGGER</a>. Марка покрытия вашего заказа указывается отдельно.</p>
          </details>
          <section
            id="hpl-production"
            className={section}
            aria-labelledby="hpl-production-title"
          >
            <h2
              id="hpl-production-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Облицовку и приклеивание кромки выполняем сами
            </h2>
            <div className="mt-5 grid overflow-hidden rounded-3xl bg-white lg:grid-cols-2">
              <figure>
                <Image
                  src={HPL_PHOTOS[7].src}
                  alt={HPL_PHOTOS[7].alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="aspect-[3/2] w-full object-cover"
                />
                <figcaption className="p-4 text-xs leading-5 text-stone-600">
                  ИИ-иллюстрация материалов и подготовки, не фотография нашего
                  цеха. На ней не показана точная производственная технология.
                </figcaption>
              </figure>
              <div className="p-5 md:p-7">
                <p className={note}>
                  Мы работаем с готовым листовым HPL: подбираем основание,
                  приклеиваем облицовку и сами приклеиваем кромку. Сам HPL не
                  производим. Чтобы оценить фасад, важно видеть весь узел, а не
                  только название покрытия.
                </p>
                <ol className="mt-5 space-y-4">
                  {[
                    [
                      "Основа и размеры",
                      "Согласуем МДФ или ДСП, толщину, размеры фасадов и крепления.",
                    ],
                    [
                      "Покрытие и обратная сторона",
                      "Выберем декор и финиш по образцу, отдельно зафиксируем отделку с обратной стороны.",
                    ],
                    [
                      "Торец и спецификация",
                      "Покажем образец кромки, обсудим стык и внесём согласованное исполнение в заказ.",
                    ],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-3">
                      <span className="text-lg font-bold text-violet-800">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="font-bold">{t}</h3>
                        <p className={`${note} mt-1`}>{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section
            id="hpl-edge"
            className={section}
            aria-labelledby="hpl-edge-title"
          >
            <h2 id="hpl-edge-title" className="text-2xl font-bold md:text-3xl">
              Кромка крупным планом: посмотрите на стык и угол
            </h2>
            <div className="mt-5 grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.2fr_1fr]">
              <figure>
                <Image
                  src={HPL_PHOTOS[6].src}
                  alt={HPL_PHOTOS[6].alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="aspect-[3/2] w-full object-contain"
                />
                <figcaption className="p-4 text-xs leading-5 text-stone-600">
                  Условный узел, созданный с помощью ИИ. Точный вид соединения
                  проверяем по физическому образцу.
                </figcaption>
              </figure>
              <div className="p-5 md:p-7">
                <h3 className="text-xl font-bold">
                  Что согласовать до изготовления
                </h3>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-stone-600">
                  <li>
                    Материал и толщину кромки, цвет в тон фасада или контраст.
                  </li>
                  <li>
                    Линию соединения с облицовкой, внешний вид углов и допуски
                    приёмки.
                  </li>
                  <li>Защиту торцов и примыканий около мойки и техники.</li>
                  <li>
                    Клей и технологию соединения для конкретного исполнения.
                  </li>
                </ul>
                <p className={`${note} mt-4`}>
                  Кромление выполняем сами. Это не означает автоматическую
                  бесшовность, лазерную технологию или полную водостойкость.
                </p>
                <details className="mt-4 rounded-xl border border-stone-200 p-4">
                  <summary className={summary}>
                    АБС, ПВХ, PUR, лазерная кромка и постформинг — что это?
                  </summary>
                  <p className={`${note} mt-3`}>
                    АБС и ПВХ — материалы кромки; PUR и EVA обозначают группы
                    клеёв; лазерное соединение — отдельная технология. При
                    постформинге облицовка огибает подготовленный край, а
                    алюминиевый торцевой профиль — другой вариант оформления.
                    Эти решения не взаимозаменяемы. Какие из них подходят вашему
                    фасаду, уточняем перед заказом; список терминов не является
                    перечнем предлагаемых технологий.
                  </p>
                </details>
              </div>
            </div>
          </section>

          <HplFinishes />
          <details className={`${panel} mt-3`}>
            <summary className={summary}>{HPL_SEMANTIC_NOTES[0].title}</summary>
            <p className={`${note} mt-3`}>{HPL_SEMANTIC_NOTES[0].text}</p>
          </details>
          <div className={section}>
            <MaterialDecisionExplorer
              config={MATERIAL_EXPLORATION["plastik-hpl"]}
            />
          </div>
          <MaterialDetailGallery slug="plastik-hpl" title="Пластик HPL" />
          <HplGallery />

          <section
            id="hpl-combinations"
            className={section}
            aria-labelledby="hpl-combinations-title"
          >
            <h2
              id="hpl-combinations-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Под дерево, однотонный или в сочетании со столешницей
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {[
                {
                  p: HPL_PHOTOS[2],
                  t: "Древесный декор + светлый верх",
                  d: "Сопоставьте масштаб и направление рисунка на дверцах и ящиках. Если нужна натуральная древесина, отдельно рассмотрите шпон: рисунок HPL под дуб и натуральный шпон — разные покрытия.",
                },
                {
                  p: HPL_PHOTOS[3],
                  t: "Графит + светлая рабочая поверхность",
                  d: "Сравните образцы фасада, столешницы и фартука рядом. Каменный или бетонный рисунок HPL не определяет материал столешницы; их выбирают отдельно. Подсветка может изменить восприятие оттенка.",
                },
              ].map(({ p, t, d }) => (
                <figure
                  key={t}
                  className="overflow-hidden rounded-3xl bg-white"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <figcaption className="p-5">
                    <h3 className="text-xl font-bold">{t}</h3>
                    <p className={`${note} mt-3`}>{d}</p>
                    <p className="mt-3 text-xs text-stone-500">
                      Визуальная идея, созданная с помощью ИИ.
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <HplRooms />
          <section
            id="hpl-layouts"
            className={section}
            aria-labelledby="hpl-layouts-title"
          >
            <h2
              id="hpl-layouts-title"
              className="text-2xl font-bold md:text-3xl"
            >
              Планировка под ваши размеры
            </h2>
            <p className={`${note} mt-3 max-w-4xl`}>
              {HPL_SEMANTIC_NOTES[1].text}
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
            id="hpl-care"
            className={section}
            aria-labelledby="hpl-care-title"
          >
            <h2 id="hpl-care-title" className="text-2xl font-bold md:text-3xl">
              Уход за HPL: плоскость и торцы требуют внимания
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  Icon: Sparkles,
                  title: "Мягкая очистка",
                  text: "Чистая мягкая салфетка и разрешённое мягкое средство. Для жирных следов — инструкция выбранной поверхности.",
                },
                {
                  Icon: Droplets,
                  title: "Уберите воду",
                  text: "Не оставляйте воду у торцов и стыков. Вытирайте капли и конденсат после использования.",
                },
                {
                  Icon: Thermometer,
                  title: "Защитите от пара",
                  text: "Не направляйте пар чайника на дверцы. Рядом с духовкой и посудомойкой соблюдайте требования монтажа.",
                },
                {
                  Icon: ClipboardCheck,
                  title: "Проверьте образец",
                  text: "Следы, блеск и фактуру оценивайте на реальном декоре. Царапины и повреждения покажите изготовителю.",
                },
              ].map(({ Icon, title, text }) => (
                <article key={title} className={panel}>
                  <Icon
                    aria-hidden="true"
                    className="mb-3 h-8 w-8 text-violet-800"
                  />
                  <h3 className="font-bold">{title}</h3>
                  <p className={`${note} mt-2`}>{text}</p>
                </article>
              ))}
            </div>
            <details className={`${panel} mt-3`}>
              <summary className={summary}>
                Плюсы, ограничения и источник рекомендаций
              </summary>
              <p className={`${note} mt-3`}>
                HPL даёт готовый декоративный слой и позволяет подобрать гладкие
                фасады с разными рисунками. Итоговые свойства зависят от серии,
                основания, приклеивания, обратной стороны и торца. Устойчивость
                к царапинам не означает невозможность повреждения; нельзя
                обещать отсутствие отпечатков или неограниченный срок службы.
              </p>
              <p className={`${note} mt-3`}>
                Общий ориентир по очистке сверили с{" "}
                <a
                  href={HPL_CARE_SOURCE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-violet-800 underline"
                >
                  рекомендациями Arpa для HPL
                </a>{" "}
                20 октября 2026 года: чистая салфетка, вода и мягкое
                неагрессивное средство. Это справочный источник, не
                подтверждение марки покрытия в вашем заказе. Для меламиновой
                губки, пароочистителя, сильных растворителей и полировки сначала
                нужно разрешение изготовителя конкретной серии. Температурные и
                влажностные ограничения определяем по документам исполнения.
              </p>
            </details>
            <details className={`${panel} mt-3`}>
              <summary className={summary}>
                {HPL_SEMANTIC_NOTES[2].title}
              </summary>
              <p className={`${note} mt-3`}>{HPL_SEMANTIC_NOTES[2].text}</p>
            </details>
          </section>

          <HplComparison />
          <HplPriceScenarios />
          <MaterialMarketEvidence materialId="hpl" />
          <details className={`${panel} mt-3`}>
            <summary className={summary}>
              Недорогая кухня и расширенная комплектация: что меняет стоимость?
            </summary>
            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="font-bold">Сначала одинаковый базовый состав</h3>
                <p className={`${note} mt-2`}>
                  Для бюджетного варианта сравниваем одну планировку, основание,
                  количество ящиков, корпус, столешницу, ручки и механизмы
                  одного класса. Цена за погонный метр и стоимость фасада за м²
                  — разные единицы, их нельзя напрямую выдавать за цену
                  гарнитура. Низкую стоимость по одному материалу не
                  гарантируем.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Дополнения отдельными строками</h3>
                <p className={`${note} mt-2`}>
                  Доводчики, дополнительные выдвижные системы, пеналы,
                  антресоли, подсветка, встроенная техника и столешница другого
                  класса меняют смету. Вариант без техники и кухня с техникой
                  несопоставимы без уточнения. Для нашей кухни доставка,
                  подъём, сборка и установка включены в согласованный расчёт;
                  у конкурентов состав услуг проверяем отдельно.
                </p>
              </div>
            </div>
            <p className={`${note} mt-4`}>
              Фотографии и рекламные цены других компаний не заменяют расчёт
              нашей кухни. Сопоставимой подтверждённой рыночной вилки для
              приведённых составов пока нет.
            </p>
            <Link href="/prices" className={`${link} mt-2`}>
              Из чего складывается стоимость кухни →
            </Link>
          </details>

          <section
            id="hpl-faq"
            className={section}
            aria-labelledby="hpl-faq-title"
          >
            <h2 id="hpl-faq-title" className="text-2xl font-bold md:text-3xl">
              Вопросы перед заказом кухни из пластика
            </h2>
            <div className="mt-5 space-y-3">
              {HPL_FAQ.map((f) => (
                <details key={f.question} className={panel}>
                  <summary className={summary}>{f.question}</summary>
                  <p className={`${note} mt-3`}>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section
            id="hpl-order"
            className={section}
            aria-labelledby="hpl-order-title"
          >
            <h2 id="hpl-order-title" className="text-2xl font-bold md:text-3xl">
              От размеров до согласованного фасада
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Расскажите о помещении",
                  "Длины стен, высота, фото, коммуникации, техника и населённый пункт.",
                ],
                [
                  "Выберите образец",
                  "Основание МДФ или ДСП, декор, финиш, обратная сторона и кромка.",
                ],
                [
                  "Согласуйте проект и смету",
                  "Размеры, комплектация, стоимость в BYN, сроки, доставка и установка.",
                ],
                [
                  "Проверьте при приёмке",
                  "Декор и торец по образцу, состояние деталей, зазоры и работа механизмов по договору.",
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
                Условия заказа в Минской области
              </Link>
              <Link href="/calculator" className={link}>
                Предварительный расчёт
              </Link>
            </div>
          </section>
          <section
            id="materials-form"
            className={`${section} grid gap-5 lg:grid-cols-2`}
            aria-labelledby="hpl-form-title"
          >
            <div>
              <h2 id="hpl-form-title" className="text-2xl font-bold">
                Рассчитаем кухню по вашим размерам
              </h2>
              <p className={`${note} my-3`}>
                На расчёт передадим только явно добавленные материалы,
                предпочтение и выбранную общую комплектацию. Просмотренные фото
                и фильтры не считаются заказом.
              </p>
              <MaterialsLeadSummary />
            </div>
            <div id="form" className={panel}>
              <ContactForm
                source="material-hpl"
                sourcePage="/materials/plastik-hpl"
                sourceType="material"
                submitLabel="Рассчитать кухню"
                answersEventName="hpl-answers"
              />
            </div>
          </section>
        </div>
      </div>
    </ExploreContextProvider>
  );
}
