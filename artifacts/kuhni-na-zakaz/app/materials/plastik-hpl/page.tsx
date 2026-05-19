import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  Utensils,
} from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";

const pageTitle = "Кухни с пластиковыми фасадами HPL";
const pageDescription =
  "Кухни с пластиковыми фасадами HPL на заказ: что такое HPL, где уместен пластик, плюсы и ограничения, сравнение с МДФ и ЛДСП, примеры и расчет.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/materials/plastik-hpl" },
  robots: { index: true, follow: true },
};

const useCases = [
  {
    icon: Utensils,
    title: "Активная кухня",
    text: "Хороший вариант для семей, где фасады часто открывают, протирают и используют каждый день.",
  },
  {
    icon: Layers,
    title: "Гладкие фасады",
    text: "HPL обычно выбирают для ровных современных фасадов без сложной фрезеровки и рамочного декора.",
  },
  {
    icon: Palette,
    title: "Практичный дизайн",
    text: "Пластик помогает совместить спокойный внешний вид, выбор декоров и понятный уход.",
  },
];

const strengths = [
  "Практичная поверхность для ежедневного использования кухни.",
  "Устойчивость к бытовой нагрузке зависит от выбранного пластика, основы и качества сборки.",
  "Большой выбор декоров: матовые, древесные, каменные и однотонные варианты.",
  "Фасады легко вписать в современные прямые, угловые кухни и кухни до потолка.",
];

const limits = [
  "Итоговые свойства зависят от производителя HPL, основы фасада и обработки кромки.",
  "Торцы, стыки и зоны возле воды требуют аккуратного проектирования и монтажа.",
  "Для сложной фрезеровки и классических фасадов чаще рассматривают МДФ с другим покрытием.",
  "Точную цену нельзя подтвердить без размеров, декора, кромки, фурнитуры и комплектации.",
];

const comparisonRows = [
  {
    material: "Пластик HPL",
    role: "Гладкие практичные фасады для современной кухни и активного ежедневного использования.",
    note: "Смотрите производителя материала, основу, кромку и качество обработки торцов.",
  },
  {
    material: "МДФ",
    role: "Фасады с пленкой, эмалью, пластиком, фрезеровкой и более гибкой формой.",
    note: "Подходит, когда важны цвет, фрезеровка или более декоративный внешний вид.",
  },
  {
    material: "ЛДСП",
    role: "Корпуса, полки, простые фасады и бюджетные решения.",
    note: "Помогает удержать смету, но требует внимания к кромке, стыкам и влажным зонам.",
  },
];

const designOptions = [
  {
    title: "Матовые",
    text: "Спокойные фасады без лишнего блеска. Хорошо смотрятся в современных и минималистичных кухнях.",
  },
  {
    title: "Древесные",
    text: "Декоры под дерево добавляют тепла и подходят для сочетаний с белыми, серыми и графитовыми модулями.",
  },
  {
    title: "Камень",
    text: "Фактуры под камень используют как акцент или для более выразительной кухни с ровными фасадами.",
  },
  {
    title: "Однотонные",
    text: "Универсальный вариант для прямых и угловых кухонь, где важны чистые линии и простой уход.",
  },
];

const galleryImages = [
  {
    src: "/uploads/seo-showcase/kuhnya-plastik-hpl-1.webp",
    alt: "Кухня на заказ с пластиковыми фасадами HPL в современном стиле",
    title: "Пластиковые фасады HPL",
  },
  {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Современная кухня без ручек с гладкими практичными фасадами",
    title: "Гладкие фасады",
  },
  {
    src: "/images/blog/fasady-mdf-plastik-emal-shpon.webp",
    alt: "Образцы фасадов МДФ, пластика HPL, эмали и шпона для сравнения покрытий",
    title: "Сравнение покрытий",
  },
];

const faqItems = [
  {
    question: "Что такое HPL фасады для кухни?",
    answer:
      "HPL - это декоративный пластик высокого давления, который используют как внешнее покрытие фасада. Практичность готовой детали зависит не только от пластика, но и от основы, клея, кромки и обработки торцов.",
  },
  {
    question: "Пластиковые фасады HPL подходят для активной кухни?",
    answer:
      "Да, их часто выбирают для ежедневного использования, когда важны простой уход и устойчивость к бытовой нагрузке. При этом важно уточнять производителя материала и качество изготовления фасада.",
  },
  {
    question: "Что лучше: HPL, МДФ или ЛДСП?",
    answer:
      "Лучший вариант зависит от задачи. HPL уместен для практичных гладких фасадов, МДФ дает больше вариантов формы и фрезеровки, а ЛДСП часто используют для корпусов и бюджетных решений.",
  },
  {
    question: "Какие декоры бывают у пластиковых фасадов?",
    answer:
      "Чаще выбирают матовые однотонные, древесные, каменные и нейтральные декоры. Финальный вид лучше оценивать по образцам при дневном и искусственном свете.",
  },
  {
    question: "Боятся ли пластиковые фасады влаги?",
    answer:
      "Сама поверхность практична в уходе, но торцы, стыки и основа требуют защиты. В зоне мойки и посудомоечной машины особенно важны кромка, монтаж и аккуратная эксплуатация.",
  },
  {
    question: "Можно ли заранее узнать точную цену кухни с HPL?",
    answer:
      "Без размеров и комплектации можно назвать только ориентир. Точную стоимость подтверждают после выбора декора, основы, кромки, фурнитуры, столешницы и согласования проекта.",
  },
];

const internalLinks = [
  { href: "/materials", label: "Все материалы" },
  { href: "/materials/mdf-fasady", label: "МДФ фасады" },
  { href: "/materials/ldsp", label: "ЛДСП" },
  { href: "/prices", label: "Цены на кухни" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
];

export default function PlastikHplPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Материалы", path: "/materials" },
    { name: "Пластик HPL", path: "/materials/plastik-hpl" },
  ]);
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageTitle,
    description: pageDescription,
    url: siteUrl("/materials/plastik-hpl"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    serviceType: "Кухни на заказ с пластиковыми фасадами HPL",
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
            <span className="text-foreground">Пластик HPL</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Практичные фасады</p>
              <h1 className="mb-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Кухни с пластиковыми фасадами HPL
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Пластиковые фасады HPL выбирают для современных кухонь, где важны практичность, ровная геометрия
                и простой уход. Мы помогаем сравнить HPL с МДФ и ЛДСП, подобрать декор и заранее обсудить кромку,
                основу и зоны повышенной нагрузки.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#calculation"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Получить расчет <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/design-proekt-kuhni"
                  className="inline-flex min-h-11 items-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Посмотреть 3D-проект
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-sm">
              <Image
                src="/uploads/seo-showcase/kuhnya-plastik-hpl-1.webp"
                alt="Кухня с пластиковыми фасадами HPL на заказ в современном интерьере"
                width={1280}
                height={720}
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 520px"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </section>

          <MaterialDetailGallery slug="plastik-hpl" title="пластик HPL для кухни" />

          <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold">Что такое HPL и пластиковые фасады</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                В кухнях HPL используют как декоративное покрытие фасада. Готовый фасад состоит из основы,
                пластикового слоя и обработанных торцов, поэтому оценивать нужно не только красивый декор,
                но и производителя материала, толщину, кромку, стыки и качество изготовления.
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
                <h2 className="font-serif text-2xl font-bold">Плюсы HPL</h2>
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
            <h2 className="font-serif text-3xl font-bold">Сравнение с МДФ и ЛДСП</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Материал</th>
                    <th className="p-4 font-semibold">Где уместен</th>
                    <th className="p-4 font-semibold">На что обратить внимание</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.material} className="border-t border-border">
                      <th scope="row" className="p-4 font-semibold text-foreground">{row.material}</th>
                      <td className="p-4 text-muted-foreground">{row.role}</td>
                      <td className="p-4 text-muted-foreground">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <SwatchBook className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-3xl font-bold">Варианты дизайна</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {designOptions.map((item) => (
                <article key={item.title} className="card-base p-6">
                  <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Примеры и визуальные ориентиры</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  Эти изображения помогают выбрать направление: гладкие современные фасады, матовые поверхности
                  и образцы покрытий. Финальный результат зависит от проекта, выбранного HPL, основы и кромки.
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
              <h2 className="text-center font-serif text-3xl font-bold">Расчет кухни с фасадами HPL</h2>
              <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
                Оставьте заявку: уточним размеры, планировку, декор пластика, основу, кромку и подготовим расчет
                без лишних обещаний по точной цене.
              </p>
              <div className="mt-8">
                <ContactForm source="materials/plastik-hpl" sourceType="materials" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
