import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  Hammer,
  MapPin,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import type { RegionalLocationData } from "@/data/locations";
import { regionalLocations } from "@/data/locations";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";

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

const kitchenTypes = [
  "Угловые",
  "Прямые",
  "П-образные",
  "Маленькие",
  "До потолка",
  "С барной стойкой",
  "Со встроенной техникой",
];

const priceFactors = [
  "размер и форма гарнитура",
  "материал фасадов и столешницы",
  "фурнитура, механизмы и подсветка",
  "встроенная техника и сложность монтажа",
];

const includedItems = [
  "Консультация по планировке, материалам и бюджету",
  "Выезд на замер и проверка коммуникаций",
  "3D-проект и предварительная смета",
  "Изготовление кухни по индивидуальным размерам",
  "Доставка, сборка, регулировка фасадов и гарантия",
];

const fallbackCases: PortfolioCasePreview[] = [
  {
    id: "general-minsk",
    title: "Угловая кухня в стиле минимализм",
    slug: "uglovaya-kuhnya-minsk-kirova",
    mainImage: "/images/hero.webp",
    style: "Минимализм",
    priceFrom: 2800,
    area: 3,
    days: 21,
    city: "Минск",
  },
  {
    id: "general-borisov",
    title: "Прямая кухня в скандинавском стиле",
    slug: "pryamaya-kuhnya-borisov",
    mainImage: "/images/hero.webp",
    style: "Скандинавский",
    priceFrom: 1800,
    area: 2,
    days: 18,
    city: "Борисов",
  },
  {
    id: "general-modern",
    title: "Кухня до потолка с продуманным хранением",
    slug: "kuhnya-do-potolka-minsk-vostok",
    mainImage: "/images/hero.webp",
    style: "Современный",
    priceFrom: 3100,
    area: 3,
    days: 24,
    city: "Минск",
  },
];

function cityGenitive(cityName: string) {
  if (cityName === "Минск") return "Минске";
  if (cityName === "Минская область") return "Минской области";
  if (cityName === "Гомель") return "Гомеле";
  if (cityName === "Могилёв") return "Могилёве";
  if (cityName === "Витебск") return "Витебске";
  return cityName;
}

function LeadText({ children }: { children: ReactNode }) {
  return <p className="text-base leading-7 text-muted-foreground md:text-lg">{children}</p>;
}

export function RegionalLocationPage({
  location,
  cases,
  hasLocalCases,
}: RegionalLocationPageProps) {
  const displayCases = cases.length > 0 ? cases : fallbackCases;
  const cityGen = cityGenitive(location.cityName);
  const portfolioTitle = hasLocalCases ? `Примеры работ в ${cityGen}` : "Примеры наших работ";
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
      <JsonLd data={[jsonLdBreadcrumb, jsonLdFaq].filter(Boolean)} />

      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative container-site py-10 md:py-16 lg:py-20">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/70">
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
            <p className="mb-8 max-w-2xl text-lg leading-8 text-white/80">
              {location.introText}
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-white/90"
              >
                <Calculator className="h-4 w-4" />
                Рассчитать стоимость
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Посмотреть портфолио
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="inline-flex items-end gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <span className="text-sm text-white/65">Расчет кухни</span>
              <span className="text-3xl font-bold">от {location.priceFrom.toLocaleString("ru")} BYN</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
              Кухня под ваш ремонт, бюджет и технику
            </h2>
            <LeadText>{location.seoText}</LeadText>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Быстрый старт
            </p>
            <p className="mb-5 text-lg font-semibold text-foreground">
              Оставьте заявку, и мы подскажем порядок замера, примерный бюджет и ближайшие сроки.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacts" className="text-sm font-semibold text-primary hover:underline">
                Контакты
              </Link>
              <Link href="/calculator" className="text-sm font-semibold text-primary hover:underline">
                Калькулятор
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-3 font-serif text-2xl font-bold md:text-3xl">Стоимость кухни</h2>
            <LeadText>
              Предварительный расчет начинается от {location.priceFrom.toLocaleString("ru")} BYN.
              Итоговая смета зависит от размеров, материалов и комплектации.
            </LeadText>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {priceFactors.map((factor) => (
              <div key={factor} className="rounded-2xl border border-border bg-white p-5">
                <CheckCircle className="mb-4 h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">{factor}</p>
              </div>
            ))}
          </div>
          <Link
            href="/prices"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Смотреть цены и примеры расчетов
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <h2 className="mb-8 font-serif text-2xl font-bold md:text-3xl">Что входит в заказ</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {includedItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <h2 className="mb-8 font-serif text-2xl font-bold md:text-3xl">
            Замер, доставка и монтаж
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Замер", text: location.measurementText, icon: Ruler },
              { title: "Доставка", text: location.deliveryText, icon: Truck },
              { title: "Монтаж", text: location.installationText, icon: Hammer },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-white p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-white p-6">
            <div className="mb-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Гарантия</h3>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{location.warrantyText}</p>
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 font-serif text-2xl font-bold md:text-3xl">
                Какие кухни делаем
              </h2>
              <p className="text-muted-foreground">
                Подбираем формат под площадь, сценарии готовки, хранение и технику.
              </p>
            </div>
            <Link href="/calculator" className="text-sm font-semibold text-primary hover:underline">
              Подобрать формат
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kitchenTypes.map((type) => (
              <div key={type} className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium">
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 font-serif text-2xl font-bold md:text-3xl">
                {portfolioTitle}
              </h2>
              <p className="text-muted-foreground">
                {hasLocalCases
                  ? "Показываем проекты, связанные с этим городом или регионом."
                  : "По этому региону пока нет отдельной подборки, поэтому показываем общие проекты без привязки к городу."}
              </p>
            </div>
            <Link href="/portfolio" className="text-sm font-semibold text-primary hover:underline">
              Все портфолио
            </Link>
          </div>
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

      <section className="bg-white section-padding">
        <div className="container-site">
          <h2 className="mb-6 font-serif text-2xl font-bold md:text-3xl">Работаем по регионам</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {regionalLocations.map((region) => (
              <Link
                key={region.slug}
                href={`/locations/${region.slug}`}
                className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {region.cityName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <h2 className="mb-8 font-serif text-2xl font-bold md:text-3xl">
            Частые вопросы
          </h2>
          <div className="max-w-3xl space-y-4">
            {location.faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold">
                  {item.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="form" className="bg-stone-950 text-white section-padding">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
              Рассчитать кухню в {cityGen}
            </h2>
            <p className="mb-6 leading-7 text-white/70">
              Напишите город, примерные размеры и пожелания по материалам. Менеджер свяжется с вами,
              уточнит детали и подскажет следующий шаг.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/prices" className="text-white/85 hover:text-white">
                Цены
              </Link>
              <Link href="/calculator" className="text-white/85 hover:text-white">
                Калькулятор
              </Link>
              <Link href="/portfolio" className="text-white/85 hover:text-white">
                Портфолио
              </Link>
              <Link href="/contacts" className="text-white/85 hover:text-white">
                Контакты
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <ContactForm source={`location-${location.slug}`} city={location.cityName} />
          </div>
        </div>
      </section>
    </>
  );
}
