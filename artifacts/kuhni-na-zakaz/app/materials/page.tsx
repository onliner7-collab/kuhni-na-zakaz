import type { Metadata } from "next";
import { MaterialMarketEvidence } from "@/components/materials/MaterialMarketEvidence";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import {
  MaterialsChoiceHelper,
  MaterialsComparison,
  MaterialsLeadSummary,
  MaterialsPhotoGallery,
  MaterialsPriceScenarios,
  MaterialsSolutionCards,
} from "@/components/materials/MaterialsHub";
import { MATERIAL_SOLUTIONS } from "@/data/material-solutions";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema-org";

const title = "Материалы фасадов кухни — фото, сравнение и выбор";
const description =
  "Выберите материалы кухни на заказ в Беларуси: ЛДСП, МДФ в плёнке, эмаль, HPL, акрил и шпон. Фото, сравнение 2–3 вариантов и расчёт по вашим размерам.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/materials" },
  openGraph: buildOpenGraph("/materials", title, description),
  twitter: buildTwitterMetadata(title, description),
};
const faq = [
  [
    "Из какого материала лучше заказать кухню?",
    "Сначала определите условия помещения, внешний вид и бюджет. Затем сравните конкретные исполнения: основу, покрытие и торец. Универсального победителя без размеров, образцов и требований к эксплуатации нет.",
  ],
  [
    "Чем отличаются корпус, основа и покрытие фасада?",
    "Корпус — стенки шкафов и полки. Фасад — дверцы и лицевые панели ящиков. МДФ и древесно-стружечная плита могут быть основой; эмаль, плёнка, HPL, акрил или шпон определяют отделку конкретной конструкции. Столешница и фурнитура выбираются отдельно.",
  ],
  [
    "МДФ или эмаль: что выбрать?",
    "Это разные уровни конструкции. Эмаль может быть покрытием МДФ. Сравнивайте МДФ в плёнке с МДФ с эмалью, а не основу с её отделкой. В обзоре МДФ собраны покрытия и отдельный раздел плёнки.",
  ],
  [
    "Матовые или глянцевые фасады практичнее?",
    "Степень блеска влияет на отражения, но сама по себе не определяет стойкость. Посмотрите образец при дневном и боковом свете, проверьте заметность отпечатков и разводов, уточните способ очистки выбранной серии.",
  ],
  [
    "Как купить недорогую кухню и сравнить материалы без переплаты?",
    "Попросите рассчитать одну планировку с несколькими фасадами. Сохраните размеры, корпус, количество ящиков, класс механизмов, столешницу и услуги. ЛДСП и плёнку можно включить в такое сравнение, но экономию подтверждает смета.",
  ],
  [
    "Что выбрать: плёнку, эмаль или пластик HPL?",
    "Плёнка и эмаль — варианты отделки, которые нужно сопоставлять на конкретных фасадах. Для HPL уточняют основу, облицовку и кромку. В сравнении рядом видны различия конструкции, фрезеровки, ухода и неизвестные параметры.",
  ],
  [
    "Акрил или эмаль: как сравнивать?",
    "Посмотрите финиш, свет, торцы, ограничения ухода и возможные повреждения по документам конкретной серии. Не все акриловые и окрашенные фасады имеют одинаковые свойства. Глянцевый визуальный пример не подтверждает наличие матовой серии.",
  ],
  [
    "Шпон и фасады под дерево — одно и то же?",
    "Натуральный шпон — древесная облицовка с индивидуальным рисунком. Декор под дерево воспроизводит внешний вид древесины другим способом. Согласуйте направление рисунка, стыки и отделку на образце.",
  ],
  [
    "Какие фасады выбрать для дачи, которая зимой не отапливается?",
    "До заказа сообщите о сезонном проживании, влажности и отоплении. Допустимые условия зависят от основы, покрытия, кромки и инструкции поставщика. Ни ЛДСП, ни МДФ сами по себе не дают гарантии пригодности для неотапливаемой дачи.",
  ],
  [
    "Как выбрать фасады рядом с мойкой, духовкой и посудомоечной машиной?",
    "Уточните защиту стыков, требования к вентиляции, расстояниям и пару. Не оставляйте воду на открытых торцах. Режим очистки, нагрева и возможное восстановление согласуйте для выбранного исполнения.",
  ],
  [
    "Можно ли купить кухню с комбинированными фасадами?",
    "В проекте можно рассмотреть разные отделки верхних и нижних шкафов, однотонные и древесные поверхности. Сочетаемость, доступность декоров и стоимость подтверждаются при согласовании заказа.",
  ],
  [
    "Почему цена за погонный метр не равна стоимости кухни?",
    "В такую цену могут входить разные шкафы, механизмы и услуги. Размеры фасадов, антресоли, ящики, ручки, столешница и техника меняют смету. Для сравнения используйте одинаковый состав и отдельные строки доставки, подъёма и монтажа.",
  ],
  [
    "Можно ли купить отдельно фасады или заказать их замену?",
    "Этот раздел посвящён выбору кухни на заказ. Продажу отдельного комплекта фасадов, ремонт или замену на существующем гарнитуре нужно уточнить до заявки; эти услуги не включаются автоматически.",
  ],
];
const rooms = [
  {
    title: "Для квартиры и новостройки",
    text: "Сравните гладкие, рамочные, матовые и глянцевые фасады при свете вашего помещения. Для студии и кухни-гостиной важны отражения и сочетание со стенами; для первой кухни — полный состав заказа.",
    href: "/catalog/malenkie-kuhni",
    anchor: "Посмотреть компактные кухни",
  },
  {
    title: "Для частного дома и коттеджа",
    text: "Кухня с островом, большая угловая или прямая — материал выбирают вместе с планировкой. Для дома в деревне заранее уточните адрес, подъезд, размеры проёмов и условия монтажа. Выезд и доставку согласуем по адресу.",
    href: "/delivery-installation",
    anchor: "Доставка и установка",
  },
  {
    title: "Для дачи и сезонного проживания",
    text: "Перед покупкой кухни для дачи уточните температуру и влажность зимой. Для деревянного дома дополнительно проверяют крепления и состояние стен. Внешний вид под дерево не означает пригодность материала для неотапливаемого помещения.",
    href: "/materials/ldsp",
    anchor: "ЛДСП: фасады, корпуса и кромки",
  },
  {
    title: "Для семьи и активной готовки",
    text: "Смотрите не только на цену и цвет: как очищается поверхность, заметны ли следы, как защищены торцы и что делать при повреждении. Класс фурнитуры и количество выдвижных ящиков сравнивайте отдельно от фасадов.",
    href: "/materials/furnitura",
    anchor: "Фурнитура и хранение",
  },
];
export default function MaterialsPage() {
  return (
    <main className="bg-[#faf9f6] pb-12 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbJsonLd([
                { name: "Главная", path: "/" },
                { name: "Материалы", path: "/materials" },
              ]),
              {
                "@type": "ItemList",
                name: "Материалы кухонных фасадов",
                itemListElement: MATERIAL_SOLUTIONS.map((m, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: m.title,
                  url: `https://kuhni.minsk.by${m.href}`,
                })),
              },
            ],
          }),
        }}
      />
      <div className="container-site pt-5">
        <nav
          aria-label="Хлебные крошки"
          className="mb-5 text-sm text-stone-600"
        >
          <Link href="/" className="underline">
            Главная
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Материалы</span>
        </nav>
        <section className="flex flex-col overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid lg:grid-cols-2">
          <div className="p-6 sm:p-9 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">
              Кухни на заказ · Беларусь
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Фасады для кухни — сравните материалы и покрытия
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-stone-200">
              Рассмотрите кухни целиком и детали вблизи. Выберите 2–3 решения,
              сохраните предпочтение и передайте варианты на расчёт по вашим
              размерам.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#gallery"
                className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-semibold text-stone-900"
              >
                Смотреть фото кухонь
              </Link>
              <Link
                href="#solutions"
                className="inline-flex min-h-12 items-center rounded-xl border border-white/50 px-5 font-semibold"
              >
                Выбрать материалы
              </Link>
            </div>
            <p className="mt-5 text-xs leading-5 text-stone-300">
              Фото — визуальные концепции. Цвет и состав фасада подтвердим по
              образцу.
            </p>
          </div>
          <Image
            src="/images/materials-hub-20261014/hero-ivory.webp"
            alt="Визуальный пример светлой прямой кухни с однотонными верхними фасадами и древесным декором нижних шкафов"
            width={1200}
            height={800}
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="order-first aspect-[3/2] h-full w-full object-cover lg:order-none"
          />
        </section>
        <section className="my-10">
          <h2 className="text-2xl font-bold">
            Сначала разберёмся, из чего состоит кухня
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [
                "Корпус",
                "Стенки шкафов и полки. Материал корпуса не обязан совпадать с фасадом.",
              ],
              [
                "Основа фасада",
                "Плита, из которой сделаны дверцы и лицевые панели ящиков.",
              ],
              [
                "Покрытие и торец",
                "Внешняя отделка и обработка краёв. Именно исполнение сравнивают по образцу.",
              ],
              [
                "Столешница и фурнитура",
                "Рабочая поверхность, петли, направляющие и ручки — отдельные части комплектации.",
              ],
            ].map(([h, p]) => (
              <div key={h} className="rounded-2xl bg-white p-4">
                <h3 className="font-bold">{h}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{p}</p>
              </div>
            ))}
          </div>
          <Link
            href="/materials/mdf-fasady"
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-violet-800 underline"
          >
            МДФ как основа: какие бывают покрытия →
          </Link>
        </section>
        <MaterialsSolutionCards />
        <MaterialsComparison />
        <MaterialsPhotoGallery />
        <MaterialsPriceScenarios />
        <MaterialsChoiceHelper />
        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            Материал под ваши условия жизни
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rooms.map((r) => (
              <article key={r.title} className="rounded-2xl bg-white p-5">
                <h3 className="text-xl font-bold">{r.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {r.text}
                </p>
                <Link
                  className="mt-3 inline-flex min-h-11 items-center font-semibold text-violet-800 underline"
                  href={r.href}
                >
                  {r.anchor} →
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-14 rounded-3xl bg-stone-100 p-5 sm:p-8">
          <h2 className="text-3xl font-bold">
            Размер, цвет и планировка — вместе с материалом
          </h2>
          <p className="mt-4 leading-7 text-stone-600">
            Для кухни 2 или 3 метра, угловой 2,4 × 1,8 м, гарнитура до потолка и
            кухни без ручек важны размеры каждой детали. Сравните светлые,
            бежевые, серые, графитовые и зелёные варианты, древесный рисунок и
            сочетания со столешницей под камень. Кашемир на разных покрытиях
            может выглядеть по-разному: окончательный оттенок выбирают по
            образцу при вашем освещении.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              ["/catalog/pryamye-kuhni", "Прямые кухни"],
              ["/catalog/uglovye-kuhni", "Угловые кухни"],
              ["/catalog/kuhni-do-potolka", "Кухни до потолка"],
              ["/catalog/kuhni-bez-ruchek", "Кухни без ручек"],
              ["/design-proekt-kuhni", "Сочетания в дизайн-проекте"],
            ].map(([href, label]) => (
              <Link
                href={href}
                key={href}
                className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-14">
          <h2 className="text-3xl font-bold">Вопросы перед покупкой кухни</h2>
          <div className="mt-5 divide-y divide-stone-200">
            {faq.map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer py-3 text-lg font-semibold">
                  {q}
                </summary>
                <p className="max-w-3xl pb-4 leading-7 text-stone-600">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Продолжите разбор в статьях{" "}
            <Link href="/blog/kakie-fasady-luchshe" className="underline">
              о выборе фасадов
            </Link>{" "}
            и{" "}
            <Link
              href="/blog/kak-vybrat-materialy-dlya-kuhni"
              className="underline"
            >
              о материалах кухни
            </Link>
            . Условия заказа в столице — на странице{" "}
            <Link href="/locations/minsk" className="underline">
              кухни на заказ в Минске
            </Link>
            .
          </p>
        </section>
        <MaterialMarketEvidence />
        <section
          id="materials-form"
          className="mx-auto mt-14 max-w-2xl scroll-mt-24"
        >
          <h2 className="text-3xl font-bold">Рассчитать выбранные варианты</h2>
          <p className="my-4 leading-7 text-stone-600">
            Хотите купить кухню по индивидуальным размерам? Укажите планировку,
            размеры и населённый пункт. Сравним материалы на одном проекте;
            столешница, фурнитура и услуги включены в согласованный расчёт.
          </p>
          <MaterialsLeadSummary />
          <div className="rounded-3xl bg-white p-5 sm:p-7">
            <ContactForm
              source="materials-index"
              sourcePage="/materials"
              sourceType="material-comparison"
              showDimensions
              showComment
              showKitchenType
              submitLabel="Получить расчёт выбранных вариантов"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
