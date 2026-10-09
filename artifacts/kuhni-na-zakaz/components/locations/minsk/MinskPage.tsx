import Link from "@/components/navigation/Link";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";
import {
  MINSK_PATH,
  MINSK_TITLE,
  MINSK_HERO,
  minskFaq,
} from "@/data/minsk-page";
import { MinskSelection } from "./MinskSelection";

export function MinskPage() {
  const faq = faqJsonLd(minskFaq);
  return (
    <main id="minsk-page">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Города", path: "/locations" },
            { name: "Минск", path: MINSK_PATH },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${siteUrl(MINSK_PATH)}#webpage`,
            url: siteUrl(MINSK_PATH),
            name: MINSK_TITLE,
            inLanguage: "ru-BY",
            dateModified: "2026-10-09",
          },
          ...(faq ? [faq] : []),
        ]}
      />
      <section className="bg-stone-50 pb-8 pt-5 md:py-10">
        <div className="container-site">
          <nav
            aria-label="Хлебные крошки"
            className="mb-4 flex flex-wrap gap-2 text-sm text-stone-600"
          >
            <Link href="/" className="underline">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/locations" className="underline">
              Города
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Минск</span>
          </nav>
          <div className="grid gap-5 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold leading-tight md:text-5xl">
                Купить кухню в Минске на заказ
              </h1>
              <p className="mt-3 max-w-xl leading-7 text-stone-700">
                Кухонный гарнитур по индивидуальным размерам квартиры или дома.
                Выберите форму, стиль и материалы — обсудим проект, стоимость,
                замер и монтаж.
              </p>
              <a
                href="#minsk-form"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Получить расчёт кухни
              </a>
            </div>
            <figure>
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="/uploads/locations/minsk-3d/minsk-hero-light-20260619-mobile-480.webp"
                />
                <img
                  src={MINSK_HERO}
                  alt="Идея светлой кухни на заказ в Минске с древесными акцентами"
                  width={1200}
                  height={675}
                  fetchPriority="high"
                  loading="eager"
                  className="aspect-[16/9] w-full rounded-2xl bg-stone-200 object-cover"
                />
              </picture>
              <figcaption className="mt-2 text-xs text-stone-600">
                Иллюстрации дизайна, не фотографии выполненных заказов.
              </figcaption>
            </figure>
          </div>
          <nav
            aria-label="Выбор кухни в Минске"
            className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6"
          >
            {[
              ["layout", "Планировка"],
              ["style", "Стиль"],
              ["length", "Длина"],
              ["area", "Площадь"],
              ["room", "Помещение"],
              ["material", "Материалы"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#minsk-${id}`}
                className="flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-2 py-2 text-center text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>
      <MinskSelection>
        <section id="minsk-order" className="bg-white py-8 md:py-12">
          <div className="container-site">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Замер, доставка и монтаж по Минску
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-center">
              <img
                src="/uploads/locations/minsk-stage56/minsk-measurement-02-lazernaya-ruletka-mobile.webp"
                alt="Иллюстрация замера стен перед изготовлением кухни по размерам"
                width={720}
                height={480}
                loading="lazy"
                className="aspect-[3/2] w-full rounded-2xl object-cover"
              />
              <ol className="space-y-4">
                {[
                  [
                    "Размеры и техника",
                    "Пришлите план или фото, длины стен и модели приборов.",
                  ],
                  [
                    "Замер по адресу",
                    "Проверим стены, высоту, воду, вентиляцию и розетки.",
                  ],
                  [
                    "Проект и смета",
                    "Согласуем фасады, столешницу, фурнитуру и состав работ.",
                  ],
                  [
                    "Изготовление и установка",
                    "Уточним готовность ремонта, доставку, этаж и занос; проверим шкафы и механизмы.",
                  ],
                ].map(([title, text], i) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-700">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-700">
              Выезд по районам Минска согласуем по точному адресу. Для
              пригорода, частного дома и сложного заноса заранее уточним маршрут
              и условия.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-5">
              {[
                ["/delivery-installation", "Доставка и монтаж"],
                [
                  "/blog/kak-podgotovitsya-k-zameru-kuhni",
                  "Подготовиться к замеру",
                ],
                ["/locations/minskaya-oblast", "Минская область"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline"
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section id="minsk-faq" className="bg-stone-50 py-8 md:py-12">
          <div className="container-site">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Перед покупкой кухни в Минске
            </h2>
            <div className="mt-5 max-w-3xl space-y-3">
              {minskFaq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-stone-300 bg-white p-4"
                >
                  <summary className="min-h-11 cursor-pointer py-2 font-semibold">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link
                href="/reviews"
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Отзывы клиентов
              </Link>
              <Link
                href="/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom"
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Что проверить до договора
              </Link>
            </div>
          </div>
        </section>
      </MinskSelection>
    </main>
  );
}
