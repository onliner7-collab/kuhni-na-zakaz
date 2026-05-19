import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ClipboardCheck,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";

const pageTitle = "Кухни из ЛДСП на заказ";
const pageDescription =
  "Кухни из ЛДСП на заказ: где используется ЛДСП, плюсы и ограничения, сравнение с МДФ, примеры бюджетных решений и заявка на расчет.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/materials/ldsp" },
  robots: { index: true, follow: true },
};

const useCases = [
  {
    icon: Layers,
    title: "Корпуса",
    text: "Самое частое применение ЛДСП: боковины, полки, дно, перегородки и внутренние элементы кухонных модулей.",
  },
  {
    icon: Palette,
    title: "Фасады",
    text: "Подходит для простых гладких фасадов без фрезеровки, когда нужен спокойный дизайн и понятная смета.",
  },
  {
    icon: Wallet,
    title: "Бюджетные решения",
    text: "Помогает удержать стоимость кухни, особенно в прямых, небольших и арендных квартирах.",
  },
];

const strengths = [
  "Доступный материал для корпусов и простых фасадов.",
  "Большой выбор декоров: однотонные, древесные, каменные и нейтральные фактуры.",
  "Понятный уход без сложных средств: достаточно мягкой ткани и бытовых неабразивных составов.",
  "Хорошо подходит для небольших кухонь, прямых гарнитуров и проектов с ограниченным бюджетом.",
];

const limits = [
  "Влагостойкость зависит от качества кромки, обработки торцов, стыков и ежедневной эксплуатации.",
  "ЛДСП не подходит для фрезеровки фасадов так гибко, как МДФ.",
  "В зонах мойки, посудомоечной машины и плиты нужно заранее продумать защиту от влаги и пара.",
  "Точная цена зависит от размеров, фурнитуры, столешницы, кромки, декора и монтажа.",
];

const comparisonRows = [
  {
    parameter: "Основное применение",
    ldsp: "Корпуса, полки, простые гладкие фасады, бюджетные гарнитуры.",
    mdf: "Фасады с пленкой, эмалью, пластиком, фрезеровкой и более гибким дизайном.",
  },
  {
    parameter: "Дизайн",
    ldsp: "Много декоров, но форма фасада обычно остается простой и плоской.",
    mdf: "Больше вариантов формы, покрытия, цвета и декоративной обработки.",
  },
  {
    parameter: "Бюджет",
    ldsp: "Часто помогает снизить смету, особенно в корпусах и простых решениях.",
    mdf: "Обычно дороже для фасадов, но дает больше визуальных возможностей.",
  },
  {
    parameter: "Влага",
    ldsp: "Критичны кромка, стыки, монтаж и аккуратная эксплуатация.",
    mdf: "Тоже требует защиты торцов и правильного покрытия, особенно возле воды.",
  },
];

const chooseLdspItems = [
  "Нужна аккуратная кухня без лишнего декора и с контролем бюджета.",
  "Планируется прямая, небольшая или временная кухня для квартиры под аренду.",
  "Важны нейтральные древесные или однотонные декоры без фрезеровки.",
  "Корпуса нужны практичные, а акцент можно сделать на столешнице, фартуке или ручках.",
];

const galleryImages = [
  {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая светлая кухня на заказ с простыми гладкими фасадами",
    title: "Прямая светлая кухня",
  },
  {
    src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
    alt: "Небольшая функциональная кухня на заказ с компактной планировкой",
    title: "Небольшая кухня",
  },
  {
    src: "/images/blog/fasady-mdf-plastik-emal-shpon.webp",
    alt: "Образцы кухонных фасадов и декоров для сравнения материалов",
    title: "Сравнение декоров",
  },
];

const faqItems = [
  {
    question: "Что такое ЛДСП в кухнях?",
    answer:
      "ЛДСП - это ламинированная древесно-стружечная плита. В кухнях ее часто используют для корпусов, полок, перегородок и простых гладких фасадов.",
  },
  {
    question: "Кухня из ЛДСП подходит для ежедневного использования?",
    answer:
      "Да, если правильно подобраны кромка, фурнитура, столешница и монтаж. Важно не оставлять воду на стыках и внимательно относиться к зонам возле мойки и посудомоечной машины.",
  },
  {
    question: "ЛДСП лучше МДФ?",
    answer:
      "Это разные материалы для разных задач. ЛДСП часто выбирают для корпусов и бюджетных решений, а МДФ чаще используют для фасадов, когда нужны фрезеровка, эмаль, пленка или более сложный внешний вид.",
  },
  {
    question: "Можно ли сделать фасады кухни из ЛДСП?",
    answer:
      "Можно, если нужны ровные гладкие фасады без фрезеровки. Для сложных форм, эмали или классических рамочных фасадов обычно рассматривают МДФ.",
  },
  {
    question: "Боится ли ЛДСП влаги?",
    answer:
      "Открытые торцы и плохо защищенные стыки чувствительны к влаге. Поэтому для кухни важны качественная кромка, аккуратная обработка, правильный монтаж и бережная эксплуатация.",
  },
  {
    question: "Можно заранее назвать точную цену кухни из ЛДСП?",
    answer:
      "Без размеров, планировки и комплектации можно дать только ориентир. Точную стоимость подтверждают после замера, выбора декора, фурнитуры, столешницы и согласования деталей.",
  },
];

const internalLinks = [
  { href: "/materials", label: "Все материалы" },
  { href: "/materials/mdf-fasady", label: "МДФ фасады" },
  { href: "/materials/plastik-hpl", label: "Пластик HPL" },
  { href: "/prices", label: "Цены на кухни" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
];

export default function LdspMaterialsPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Материалы", path: "/materials" },
    { name: "ЛДСП", path: "/materials/ldsp" },
  ]);
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageTitle,
    description: pageDescription,
    url: siteUrl("/materials/ldsp"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    serviceType: "Кухни на заказ из ЛДСП",
  });

  return (
    <>
      <JsonLd data={jsonLdFaq ? [jsonLdBreadcrumb, jsonLdService, jsonLdFaq] : [jsonLdBreadcrumb, jsonLdService]} />
      <div className="section-padding">
        <main className="container-site">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/materials" className="hover:text-primary">Материалы</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">ЛДСП</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Материалы для кухни</p>
              <h1 className="mb-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Кухни из ЛДСП на заказ
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                ЛДСП выбирают, когда нужна аккуратная кухня с понятным бюджетом: чаще всего для корпусов,
                внутренних полок и простых гладких фасадов. Мы честно объясняем, где этот материал уместен,
                а где лучше рассмотреть МДФ или другое решение.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#calculation"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Получить расчет <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/prices"
                  className="inline-flex min-h-11 items-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Посмотреть цены
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-sm">
              <Image
                src="/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp"
                alt="Светлая кухня из ЛДСП на заказ с прямой планировкой и гладкими фасадами"
                width={1280}
                height={720}
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 520px"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </section>

          <MaterialDetailGallery slug="ldsp" title="ЛДСП для кухни" />

          <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold">Что такое ЛДСП в кухнях</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                ЛДСП - это древесно-стружечная плита с ламинированным декоративным покрытием. В кухонной мебели
                материал ценят за доступность и большой выбор декоров, но итоговая надежность зависит не только
                от плиты: важны кромка, обработка торцов, стыки, фурнитура, столешница и монтаж.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {useCases.map((item) => (
                <div key={item.title} className="card-base p-5">
                  <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-2">
            <div className="card-base p-6">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold">Плюсы ЛДСП</h2>
              </div>
              <ul className="space-y-3">
                {strengths.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-base p-6">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-amber-600" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold">Ограничения</h2>
              </div>
              <ul className="space-y-3">
                {limits.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-3xl font-bold">Сравнение ЛДСП и МДФ</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Критерий</th>
                    <th className="p-4 font-semibold">ЛДСП</th>
                    <th className="p-4 font-semibold">МДФ</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.parameter} className="border-t border-border">
                      <th scope="row" className="p-4 font-semibold text-foreground">{row.parameter}</th>
                      <td className="p-4 text-muted-foreground">{row.ldsp}</td>
                      <td className="p-4 text-muted-foreground">{row.mdf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-3xl font-bold">Когда стоит выбрать ЛДСП</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {chooseLdspItems.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Примеры и визуальные ориентиры</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  Эти примеры помогают обсудить формат кухни: простые фасады, компактные планировки и спокойные
                  декоры. Конкретный материал, цвет и кромку лучше подтверждать по образцам.
                </p>
              </div>
              <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Смотреть портфолио <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {galleryImages.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={720}
                    height={480}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-[3/2] h-auto w-full object-cover"
                  />
                  <figcaption className="p-4 text-sm font-medium">{image.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-3xl font-bold">Куда перейти дальше</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {internalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-3xl font-bold">FAQ</h2>
            <div className="mt-6 space-y-3">
              {faqItems.map((item, index) => (
                <details key={item.question} className="group card-base p-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold">
                    <span>{item.question}</span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="calculation" className="mt-16 scroll-mt-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-center font-serif text-3xl font-bold">Расчет кухни из ЛДСП</h2>
              <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
                Оставьте заявку: уточним размеры, планировку, декор, кромку, фурнитуру и подготовим расчет
                без неподтвержденных обещаний по точной цене.
              </p>
              <div className="mt-8">
                <ContactForm source="materials/ldsp" sourceType="materials" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
