import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardList,
  Hammer,
  MapPin,
  Ruler,
  Truck,
} from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import {
  minskRegionLocations,
  regionalLocations,
  type RegionalInternalLink,
  type RegionalLocationData,
} from "@/data/locations";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/schema-org";

export interface PortfolioCasePreview {
  id: number | string;
  title: string;
  slug: string;
  mainImage: string;
  style: string;
  priceFrom: number;
  area: number;
  days: number;
  city: string;
}

interface RegionalLocationPageProps {
  location: RegionalLocationData;
  cases: PortfolioCasePreview[];
  hasLocalCases: boolean;
}

function isJsonLdObject<T>(value: T | null): value is T {
  return value !== null;
}

const serviceItems = [
  "Консультация по планировке, материалам и бюджету",
  "Замер с проверкой стен, коммуникаций и техники",
  "3D-проект и предварительная смета до запуска",
  "Производство кухни по индивидуальным размерам",
  "Доставка, монтаж, регулировка фасадов и гарантия",
];

const orderSteps = [
  "Заявка и короткое обсуждение задачи",
  "Предварительный расчет по размерам и технике",
  "Замер и финальное согласование проекта",
  "Производство, доставка и монтаж кухни",
];

const fallbackCases: PortfolioCasePreview[] = [
  {
    id: "general-corner",
    title: "Угловая кухня в современном стиле",
    slug: "uglovaya-kuhnya-dlya-novostroyki-minsk",
    mainImage: "/images/hero.webp",
    style: "Современный",
    priceFrom: 2800,
    area: 3,
    days: 21,
    city: "Общий пример",
  },
  {
    id: "general-straight",
    title: "Прямая кухня для компактного помещения",
    slug: "pryamaya-kuhnya-dlya-studii-brest",
    mainImage: "/images/hero.webp",
    style: "Минимализм",
    priceFrom: 1800,
    area: 2,
    days: 18,
    city: "Общий пример",
  },
  {
    id: "general-tall",
    title: "Кухня до потолка с продуманным хранением",
    slug: "kuhnya-do-potolka-mogilev",
    mainImage: "/images/hero.webp",
    style: "Современный",
    priceFrom: 3100,
    area: 3,
    days: 24,
    city: "Общий пример",
  },
];

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>}
    </div>
  );
}

function LinkPills({ links }: { links: RegionalInternalLink[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function RegionalLocationPage({
  location,
  cases,
  hasLocalCases,
}: RegionalLocationPageProps) {
  const displayCases = cases.length > 0 ? cases : fallbackCases;
  const isMinskRegionHub = location.slug === "minskaya-oblast";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Города", path: "/locations" },
    { name: location.cityName, path: `/locations/${location.slug}` },
  ]);
  const jsonLdFaq = faqJsonLd(
    location.faq.map((item) => ({ question: item.question, answer: item.answer })),
  );

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdFaq].filter(isJsonLdObject)} />

      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0 opacity-28">
          <Image
            src="/images/hero.webp"
            alt={`Кухня на заказ в ${location.cityPrepositional}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative container-site py-10 md:py-16 lg:py-20">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/72">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span>/</span>
            <Link href="/locations" className="hover:text-white">
              Города
            </Link>
            <span>/</span>
            <span className="text-white">{location.cityName}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/85">
              <MapPin className="h-4 w-4" />
              {location.regionName}
            </div>
            <h1 className="mb-5 font-serif text-3xl font-bold leading-tight md:text-5xl">
              {location.h1}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-8 text-white/82">{location.intro}</p>
            <div className="mb-8 flex flex-wrap gap-3">
              <Link
                href="#form"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-white/90"
              >
                Оставить заявку
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/calculator"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Calculator className="h-4 w-4" />
                Рассчитать стоимость
              </Link>
            </div>
            <div className="inline-flex flex-wrap items-end gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <span className="text-sm text-white/65">Ориентир для расчета</span>
              <span className="text-3xl font-bold">от {location.priceFrom.toLocaleString("ru")} BYN</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow="Региональная страница"
              title={`Как работаем в ${location.cityPrepositional}`}
              text={location.seoText}
            />
            <p className="text-base leading-7 text-muted-foreground">{location.serviceAreaText}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="mb-3 font-serif text-2xl font-bold">Быстрый старт</h2>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              Напишите город, размеры и список техники. Мы подскажем порядок замера, ориентир по бюджету
              и какие данные нужны для точной сметы.
            </p>
            <LinkPills links={location.internalLinks.slice(0, 4)} />
          </div>
        </div>
      </section>

      {isMinskRegionHub && (
        <section className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Хаб области"
              title="Города Минской области"
              text={location.hubText}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {minskRegionLocations.map((city) => (
                <Link
                  key={city.slug}
                  href={`/locations/${city.slug}`}
                  className="group rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <p className="font-serif text-xl font-bold text-foreground">{city.cityName}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{city.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Открыть страницу <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Состав услуги"
            title="Что входит в услугу"
            text="Описываем базовый состав работ без обещаний о неподтвержденных офисах, кейсах или отзывах."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {serviceItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Процесс"
            title="Как проходит заказ"
            text={`Для ${location.cityGenitive} порядок не меняется по смыслу, но логистика замера и доставки согласуется отдельно.`}
          />
          <div className="grid gap-4 md:grid-cols-4">
            {orderSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <ClipboardList className="mb-4 h-5 w-5 text-primary" />
                <p className="mb-2 text-sm font-semibold text-primary">Шаг {index + 1}</p>
                <p className="text-sm leading-6 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Стоимость"
            title="Что влияет на стоимость"
            text={location.priceNote}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Размер и форма", "Фасады и столешница", "Фурнитура и механизмы", "Техника и монтаж"].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-5">
                <CheckCircle className="mb-4 h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <Link
            href="/prices"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Смотреть цены и примеры расчетов <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Логистика"
            title="Замер, доставка и монтаж"
            text="Каждый региональный заказ считаем по фактическому адресу, готовности ремонта и составу кухни."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Замер", text: location.measurementText, icon: Ruler },
              { title: "Доставка", text: location.deliveryText, icon: Truck },
              { title: "Монтаж", text: location.installationText, icon: Hammer },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Решения"
            title={`Популярные решения для ${location.cityGenitive}`}
            text="Это не фиктивные кейсы, а типы кухонь, которые можно рассмотреть для похожих помещений."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {location.popularSolutions.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Портфолио"
            title={hasLocalCases ? `Подтвержденные работы в ${location.cityPrepositional}` : "Примеры работ без привязки к городу"}
            text={
              hasLocalCases
                ? "Показываем проекты, которые связаны с этим городом или регионом в базе сайта."
                : "По этому городу пока нет подтвержденной подборки. Чтобы не вводить посетителя в заблуждение, показываем общие примеры."
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {displayCases.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/portfolio/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={optimizedImageSrc(item.mainImage) || item.mainImage || "/images/hero.webp"}
                    alt={item.title}
                    width={640}
                    height={480}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 font-semibold text-foreground">{item.title}</p>
                  <p className="mb-3 text-sm text-muted-foreground">{item.city}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.area > 0 && <span>{item.area} п.м</span>}
                    {item.priceFrom > 0 && <span>от {item.priceFrom.toLocaleString("ru")} BYN</span>}
                    {item.days > 0 && <span>{item.days} дн.</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle eyebrow="FAQ" title="Частые вопросы" />
          <div className="max-w-3xl space-y-4">
            {location.faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-foreground">
                  {item.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Перелинковка"
            title="Соседние города и полезные разделы"
            text="Внутренние ссылки ведут на соседние направления и основные коммерческие страницы."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Соседние города</h3>
              <LinkPills links={location.nearbyAreas.length > 0 ? location.nearbyAreas : regionalLocations.slice(0, 5).map((item) => ({ href: `/locations/${item.slug}`, label: item.cityName }))} />
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Важные услуги</h3>
              <LinkPills links={location.internalLinks} />
            </div>
          </div>
        </div>
      </section>

      <section id="form" className="bg-stone-950 text-white section-padding">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
              Рассчитать кухню в {location.cityPrepositional}
            </h2>
            <p className="mb-6 leading-7 text-white/72">
              Оставьте заявку: менеджер уточнит размеры, город, технику и подскажет следующий шаг.
              Точные сроки замера и доставки нужно подтверждать по конкретному адресу.
            </p>
            <LinkPills links={location.internalLinks.slice(0, 4)} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <ContactForm
              source={`location-${location.slug}`}
              sourceType="location-region"
              city={location.cityName}
              cityKey={location.slug}
            />
          </div>
        </div>
      </section>
    </>
  );
}
