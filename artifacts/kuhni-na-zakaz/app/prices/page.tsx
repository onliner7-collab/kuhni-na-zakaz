import type { Metadata } from "next";
import "./prices.css";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { InteractivePricesCatalog } from "@/components/prices/InteractivePricesCatalog";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { optimizedImageSrc } from "@/lib/image-optimization";
import {
  PRICE_RESEARCH_DATE,
  priceExamples,
  priceStyles,
  priceLayouts,
  priceFaq,
  marketSources,
  exampleImage,
  marketRange,
} from "@/data/prices-showcase";

const title = "Цены на кухни на заказ — стоимость и состав сметы";
const description =
  "Сколько стоит кухня на заказ: фото вариантов, размеры, комплектации и рыночные ориентиры цен. Сравните фасады и фурнитуру, отправьте размеры для расчёта сметы.";
const hero = exampleImage(priceExamples[0]);
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/prices" },
  openGraph: buildOpenGraph("/prices", title, description, {
    images: [
      {
        url: siteUrl(optimizedImageSrc(hero)!),
        width: 762,
        height: 506,
        alt: "Прямая кухня 3 метра — пример дизайна",
      },
    ],
  }),
  twitter: buildTwitterMetadata(
    title,
    description,
    siteUrl(optimizedImageSrc(hero)!),
  ),
};
const action =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";
const heading = "text-2xl font-black leading-tight md:text-3xl";
const photos = [
  {
    title: "Корпус и фасады",
    text: "Материал, покрытие, толщина и обработка кромки. ЛДСП, МДФ в плёнке, эмаль и пластик сравнивайте на одинаковой планировке.",
    model: priceExamples[0],
    view: 2,
    href: "/materials/mdf-fasady",
    link: "Материалы фасадов",
  },
  {
    title: "Столешница и рабочая зона",
    text: "Материал, длина, стыки, вырезы под мойку и варочную панель. Стеновая панель и подсветка — отдельные строки.",
    model: priceExamples[2],
    view: 2,
    href: "/materials",
    link: "Материалы рабочей зоны",
  },
  {
    title: "Ящики и фурнитура",
    text: "Количество ящиков, модели петель, направляющих и подъёмников. Угловые механизмы проверяйте отдельно.",
    model: priceExamples[1],
    view: 3,
    href: "/materials/furnitura",
    link: "Как выбрать фурнитуру",
  },
];
export default function PricesPage() {
  const schema = [
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Цены", path: "/prices" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Расчёт стоимости кухни на заказ",
      url: siteUrl("/prices"),
      description,
      provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
      areaServed: { "@type": "Country", name: "Беларусь" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: priceFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
  return (
    <>
      <JsonLd data={schema} />
      <main className="prices-page bg-white text-stone-900">
        <header className="container-site py-5 md:py-9">
          <nav
            aria-label="Хлебные крошки"
            className="mb-4 flex gap-2 text-sm text-stone-500"
          >
            <Link href="/" className="underline">
              Главная
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page">Цены</span>
          </nav>
          <div className="grid gap-5 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                Цены на кухни на заказ
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
                Посмотрите варианты с разных ракурсов. Выберите форму и бюджет,
                сравните комплектации и узнайте стоимость своей кухни.
              </p>
              <div className="mt-4 hidden flex-wrap gap-3 lg:flex">
                <a href="#catalog" className={action}>
                  Выбрать кухню по фото
                </a>
                <a
                  href="#calculate"
                  className={`${action} !bg-stone-900 text-white`}
                >
                  Получить расчёт
                </a>
              </div>
            </div>
            <figure className="overflow-hidden rounded-2xl border">
              <div className="relative aspect-[3/2]">
                <Image
                  priority
                  src={optimizedImageSrc(hero)!}
                  alt="Прямая скандинавская кухня 3 метра: белые верхние шкафы и фасады под дуб, пример дизайна"
                  fill
                  sizes="(max-width: 1023px) 94vw, 580px"
                  className="object-cover"
                />
              </div>
              <figcaption className="bg-stone-50 px-4 py-2 text-xs leading-5">
                Пример дизайна, созданный с помощью ИИ · прямая кухня 3 м
              </figcaption>
            </figure>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 lg:hidden">
            <a href="#catalog" className={action}>
              Фото и цены
            </a>
            <a
              href="#calculate"
              className={`${action} !bg-stone-900 text-white`}
            >
              Рассчитать мою кухню
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Цифры в примерах — ориентиры по рынку, а не прайс КухниBY. Техника,
            доставка и монтаж отдельно.{" "}
            <a className="font-semibold underline" href="#price-method">
              Как проверены цены
            </a>
          </p>
        </header>
        <InteractivePricesCatalog>
          <div className="container-site space-y-12 pb-12">
            <section id="estimate" className="scroll-mt-24">
              <h2 className={heading}>Что входит в стоимость кухни</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                Проверяемая комплектация — это список материалов, модулей и
                работ. Фото помогает выбрать внешний вид, а смета показывает, за
                что вы платите.
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {photos.map((item) => (
                  <article
                    key={item.title}
                    className="overflow-hidden rounded-xl border"
                  >
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={
                          optimizedImageSrc(
                            exampleImage(item.model, item.view),
                          )!
                        }
                        alt={`${item.title.toLowerCase()}: ${item.model.name}, пример дизайна`}
                        fill
                        sizes="(max-width: 767px) 94vw, 31vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="my-3 text-sm leading-6 text-stone-600">
                        {item.text}
                      </p>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-11 items-center text-sm font-semibold underline"
                      >
                        {item.link}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-xl border bg-stone-50 p-5">
                <h3 className="text-lg font-bold">
                  Кухня под ключ: проверьте дополнительные расходы
                </h3>
                <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm leading-6 sm:grid-cols-2">
                  <li>Техника, мойка и смеситель: модели и подключение.</li>
                  <li>Доставка, подъём и занос: адрес, этаж и лифт.</li>
                  <li>Монтаж: стыки, вырезы, крепление и подгонка.</li>
                  <li>Замер, проект и демонтаж: условия и стоимость.</li>
                </ul>
                <Link
                  href="/delivery-installation"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline"
                >
                  Условия доставки и монтажа
                </Link>
              </div>
            </section>
            <section>
              <h2 className={heading}>
                Одна кухня 3 метра — три варианта комплектации
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                Сначала зафиксируйте одинаковую планировку. Затем попросите три
                сметы с отдельной стоимостью изменений. Эти варианты — задание
                для расчёта; подтверждённая цена появится после согласования
                материалов и модулей.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Базовая",
                    points: [
                      "Прямая линия 3 м, стандартная высота",
                      "Фасады ЛДСП, ламинированная столешница",
                      "2 ящика, остальные секции распашные",
                    ],
                  },
                  {
                    name: "Больше хранения",
                    points: [
                      "Та же линия 3 м и те же фасады",
                      "4 ящика вместо 2",
                      "Отдельная строка за направляющие и новые модули",
                    ],
                  },
                  {
                    name: "Другое покрытие",
                    points: [
                      "Та же линия 3 м и 2 ящика",
                      "МДФ в эмали вместо ЛДСП",
                      "Отдельная строка за фасады; столешницу пока не меняем",
                    ],
                  },
                ].map((item) => (
                  <article key={item.name} className="rounded-xl border p-5">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <a href="#calculate" className={`${action} mt-4`}>
                      Запросить сравнительную смету
                    </a>
                  </article>
                ))}
              </div>
            </section>
            <section
              id="price-method"
              className="scroll-mt-24 rounded-2xl border bg-amber-50/60 p-5 md:p-7"
            >
              <h2 className={heading}>
                Сколько стоит кухня: источники и расчёт ориентира
              </h2>
              <p className="mt-3 text-sm leading-7">
                Проверка публичных цен: {PRICE_RESEARCH_DATE}. Примеры
                конкурентов относятся к разным комплектациям; это материал для
                сравнения, а не подтверждение цены кухни на изображении.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {marketSources.map((source) => (
                  <div
                    key={source.name}
                    className="rounded-xl border bg-white p-4"
                  >
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-bold underline"
                    >
                      {source.name} ↗
                    </a>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {source.note}
                    </p>
                  </div>
                ))}
              </div>
              <details className="mt-5 rounded-xl border bg-white p-4">
                <summary className="min-h-11 cursor-pointer py-2 font-bold">
                  Цена кухни за погонный метр: как получены диапазоны
                </summary>
                <div className="mt-3 space-y-3 text-sm leading-7 text-stone-600">
                  <p>
                    Формула карточек: условная длина мебели × выбранный диапазон
                    ставки, округление до 100 BYN. Для более простых вариантов
                    использован диапазон 980–1430 BYN/м; для эмали, пластика HPL
                    и островных примеров — 1430–2350 BYN/м. Это редакционное
                    распределение уровней по публичным примерам SanMari, а не
                    тариф на конкретный материал. В каталоге источника есть и
                    более высокие цены.
                  </p>
                  <p>
                    Прямая кухня 3 м: 3 × 980–1430 = примерно 2900–4300 BYN.
                    Угловая 3 × 2 м: (3 + 2 − 0,6) × 980–1430 = примерно
                    4300–6300 BYN. В П-образных примерах вычтено 1,2 м на два
                    общих угла. Для острова добавлена его длина, для полуострова
                    применена одна угловая поправка.
                  </p>
                  <p>
                    Поправка на угол — условное допущение, не правило всех
                    производителей. Пеналы, шкафы до потолка, кварц, ящики и
                    сложные механизмы могут вывести реальную смету за этот
                    диапазон. Нельзя получить точную цену только умножением
                    метров.
                  </p>
                </div>
              </details>
              <details className="mt-3 rounded-xl border bg-white p-4">
                <summary className="min-h-11 cursor-pointer py-2 font-bold">
                  Размеры, материалы и ориентиры всех 18 примеров
                </summary>
                <ul className="mt-3 divide-y">
                  {priceExamples.map((model) => (
                    <li key={model.id} className="py-3">
                      <a
                        href={`/prices?model=${model.id}#catalog`}
                        className="inline-flex min-h-11 items-center font-semibold underline"
                      >
                        {model.name}
                      </a>
                      <p className="text-sm leading-6">
                        {model.dimensions} · {model.facadeMaterial} ·{" "}
                        {model.height} · {model.countertop} · {model.drawers}{" "}
                        ящика в расчётном варианте.
                      </p>
                      <p className="text-sm leading-6">
                        Рыночный ориентир: {marketRange(model)} за мебель;
                        техника, доставка и монтаж отдельно. Не предложение
                        КухниBY.
                      </p>
                    </li>
                  ))}
                </ul>
              </details>
            </section>
            <section id="styles" className="scroll-mt-24">
              <h2 className={heading}>Стоимость кухонь разных форм и стилей</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                Маленькая кухня 2–2,4 м, прямая 3 м, угловая 3 × 2 м, П-образная
                или с островом требуют разного количества мебели. Стиль задаёт
                внешний вид, а стоимость определяют материалы, размеры и
                механизмы.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {priceLayouts.map((item) => (
                  <Link key={item.id} href={item.href} className={action}>
                    {item.label} кухня
                  </Link>
                ))}
                <Link className={action} href="/catalog/malenkie-kuhni">
                  Маленькие кухни
                </Link>
                <Link className={action} href="/catalog/kuhni-do-potolka">
                  Кухни до потолка
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {priceStyles.map((style) => {
                  const model = priceExamples.find(
                    (item) => item.style === style.id,
                  )!;
                  return (
                    <a
                      href={`/prices?style=${style.id}#catalog`}
                      key={style.id}
                      className="overflow-hidden rounded-xl border focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"
                    >
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={optimizedImageSrc(exampleImage(model, 1))!}
                          alt={`Кухня: ${style.label.toLowerCase()}, пример дизайна`}
                          fill
                          sizes="(max-width: 767px) 46vw, 23vw"
                          className="object-cover"
                        />
                      </div>
                      <span className="block min-h-11 p-3 text-sm font-bold">
                        {style.label} →
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
            <section>
              <h2 className={heading}>
                Как сравнить сметы и уложиться в бюджет
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                Попросите указать одинаковое число модулей, ящиков и моделей
                механизмов. Сначала меняйте один параметр — фасады, высоту или
                хранение. Так видно, сколько стоит каждое решение, и легче
                выбрать недорогую комплектацию без лишних расходов.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  {
                    href: "/scenarios/byudzhetnaya-kuhnya",
                    label: "Варианты для ограниченного бюджета",
                  },
                  { href: "/materials/ldsp", label: "Фасады ЛДСП" },
                  {
                    href: "/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz",
                    label: "Что проверить в смете",
                  },
                  {
                    href: "/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh",
                    label: "Как распределить бюджет",
                  },
                  {
                    href: "/locations/minsk",
                    label: "Условия заказа в Минске",
                  },
                  {
                    href: "/locations/minskaya-oblast",
                    label: "Условия в Минской области",
                  },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className={action}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <h2 className={heading}>Вопросы о цене кухни</h2>
              <div className="mt-4 divide-y">
                {priceFaq.map((item) => (
                  <details key={item.question} className="py-3">
                    <summary className="min-h-11 cursor-pointer py-2 font-bold">
                      {item.question}
                    </summary>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </InteractivePricesCatalog>
      </main>
    </>
  );
}
