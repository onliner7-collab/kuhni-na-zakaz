import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Layers,
  Palette,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";

const pageTitle = "МДФ фасады для кухни на заказ";
const pageDescription =
  "Кухни с фасадами МДФ на заказ: варианты покрытий, плюсы и ограничения, сравнение с ЛДСП и пластиком, примеры и заявка на расчет.";

export const metadata: Metadata = {
  title: "Кухни с фасадами МДФ на заказ",
  description: pageDescription,
  alternates: { canonical: "/materials/mdf-fasady" },
  robots: { index: true, follow: true },
};

const coatingOptions = [
  {
    title: "Пленка",
    text: "Практичный вариант для спокойных фасадов и умеренного бюджета. Важны качество покрытия, аккуратная кромка и защита зон рядом с мойкой и плитой.",
  },
  {
    title: "Эмаль",
    text: "Подходит, когда нужен ровный цвет, матовая или полуматовая поверхность и более выразительный внешний вид. Требует бережного ухода без абразивов.",
  },
  {
    title: "Пластик",
    text: "Используется для гладких современных фасадов, когда важны устойчивость к ежедневной нагрузке и простой уход. Итог зависит от основы, кромки и выбранного декора.",
  },
];

const strengths = [
  "Подходит для гладких и фрезерованных фасадов.",
  "Можно подобрать покрытие под современный, классический или неоклассический интерьер.",
  "Хорошо работает в проектах до потолка, угловых и прямых кухнях.",
  "Позволяет гибко выбирать цвет, фактуру и уровень бюджета.",
];

const limits = [
  "Открытые торцы и зоны возле воды требуют аккуратной обработки.",
  "Стойкость зависит не только от МДФ, но и от покрытия, кромки и монтажа.",
  "Для активной кухни важно заранее обсудить уход и сценарии нагрузки.",
];

const kitchenTypes = [
  {
    title: "Угловые кухни",
    href: "/catalog/uglovye-kuhni",
    text: "МДФ удобно использовать для видимых фасадов, пеналов и верхних шкафов до потолка.",
  },
  {
    title: "Прямые кухни",
    href: "/catalog/pryamye-kuhni",
    text: "Простая геометрия помогает показать ровность фасадов и удержать аккуратный бюджет.",
  },
  {
    title: "Кухни с 3D-проектом",
    href: "/design-proekt-kuhni",
    text: "Перед производством можно оценить цвет фасадов, столешницу и сочетание материалов.",
  },
];

const comparisonRows = [
  {
    material: "МДФ",
    role: "Фасады с разными покрытиями, фрезеровкой и точным подбором цвета.",
    note: "Хороший универсальный вариант, если важны внешний вид и гибкость дизайна.",
  },
  {
    material: "ЛДСП",
    role: "Корпуса, простые гладкие фасады, открытые полки и бюджетные решения.",
    note: "Часто помогает снизить смету, но требует внимания к кромке и стыкам.",
  },
  {
    material: "Пластик HPL",
    role: "Гладкие современные фасады для активной ежедневной эксплуатации.",
    note: "Практичен в уходе, но визуальный результат зависит от декора и обработки торцов.",
  },
];

const galleryImages = [
  {
    src: "/uploads/seo-showcase/kuhnya-mdf-emal-1.webp",
    alt: "Кухня на заказ с гладкими фасадами МДФ в светлом современном стиле",
    title: "Светлые фасады МДФ",
  },
  {
    src: "/images/blog/fasady-mdf-plastik-emal-shpon.webp",
    alt: "Образцы кухонных фасадов МДФ, пластика, эмали и шпона для сравнения материалов",
    title: "Сравнение покрытий",
  },
  {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая светлая кухня на заказ с аккуратными фасадами и встроенной техникой",
    title: "Прямая кухня",
  },
];

const faqItems = [
  {
    question: "Что такое фасады МДФ для кухни?",
    answer:
      "Это фасады на основе древесноволокнистой плиты средней плотности. Внешний вид и практичность зависят от покрытия: пленки, эмали, пластика или другого выбранного решения.",
  },
  {
    question: "МДФ лучше ЛДСП?",
    answer:
      "Для фасадов МДФ чаще дает больше возможностей: фрезеровка, разные покрытия и более гибкий дизайн. ЛДСП при этом остается уместным для корпусов, простых фасадов и бюджетных решений.",
  },
  {
    question: "Фасады МДФ подходят для кухни до потолка?",
    answer:
      "Да, МДФ можно использовать для высоких шкафов и пеналов. На проектировании важно учитывать вес фасадов, фурнитуру, открывание и удобство доступа к верхним секциям.",
  },
  {
    question: "Что выбрать: пленку, эмаль или пластик?",
    answer:
      "Пленка обычно подходит для спокойного бюджета, эмаль - для точного цвета и более выразительного вида, пластик - для практичных гладких фасадов. Окончательный выбор лучше делать по образцам и сценарию эксплуатации.",
  },
  {
    question: "Боятся ли фасады МДФ влаги?",
    answer:
      "Открытая основа чувствительна к влаге, поэтому важны покрытие, кромка, монтаж и уход. В зоне мойки и посудомоечной машины эти детали нужно обсуждать особенно внимательно.",
  },
  {
    question: "Можно ли заранее увидеть кухню с выбранными фасадами?",
    answer:
      "Да, для этого подходит 3D-проект: он помогает оценить цвет фасадов, столешницу, фартук и пропорции кухни до запуска в производство.",
  },
];

const internalLinks = [
  { href: "/materials", label: "Все материалы" },
  { href: "/materials/ldsp", label: "ЛДСП" },
  { href: "/materials/plastik-hpl", label: "Пластик HPL" },
  { href: "/prices", label: "Цены на кухни" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
];

export default function MdfFacadesPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Материалы", path: "/materials" },
    { name: "МДФ фасады", path: "/materials/mdf-fasady" },
  ]);
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageTitle,
    description: pageDescription,
    url: siteUrl("/materials/mdf-fasady"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    serviceType: "Кухни на заказ с фасадами МДФ",
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
            <span className="text-foreground">МДФ фасады</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Материалы фасадов</p>
              <h1 className="mb-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Кухни с фасадами МДФ на заказ
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                МДФ выбирают для кухонь, где важны аккуратные фасады, широкий выбор покрытий и возможность
                адаптировать внешний вид под интерьер. Мы помогаем сравнить варианты и подобрать решение под
                планировку, нагрузку и желаемый визуальный результат.
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
                src="/uploads/seo-showcase/kuhnya-mdf-emal-1.webp"
                alt="Кухня на заказ с фасадами МДФ в современном светлом интерьере"
                width={1280}
                height={720}
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold">Что такое фасады МДФ</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                МДФ - это плотная основа для кухонных фасадов. Сам по себе материал не определяет весь срок
                службы кухни: важны покрытие, обработка торцов, фурнитура, монтаж и то, как кухня используется
                каждый день. Поэтому фасады МДФ лучше выбирать не по одному образцу, а вместе со столешницей,
                фартуком и общей планировкой.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Layers, title: "Основа", text: "Подходит для ровных и фрезерованных фасадов." },
                { icon: Palette, title: "Покрытие", text: "Пленка, эмаль или пластик меняют вид и уход." },
                { icon: Ruler, title: "Проект", text: "Размеры и фурнитура влияют на удобство." },
              ].map((item) => (
                <div key={item.title} className="card-base p-5">
                  <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="mb-6 max-w-2xl">
              <h2 className="font-serif text-3xl font-bold">Варианты покрытия</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                В текущем ассортименте страницы материалов уже используются решения на базе МДФ, эмали и пластика.
                На консультации стоит смотреть образцы при дневном и искусственном свете.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {coatingOptions.map((item) => (
                <article key={item.title} className="card-base p-6">
                  <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-2">
            <div className="card-base p-6">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold">Плюсы МДФ</h2>
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
            <h2 className="font-serif text-3xl font-bold">Для каких кухонь подходит</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {kitchenTypes.map((item) => (
                <Link key={item.href} href={item.href} className="card-base group p-6 transition-shadow hover:shadow-md">
                  <h3 className="flex items-center justify-between gap-3 font-serif text-xl font-semibold group-hover:text-primary">
                    {item.title}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-3xl font-bold">Сравнение с ЛДСП и пластиком</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Примеры и визуальные ориентиры</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  Эти изображения помогают обсудить направление: светлые гладкие фасады, варианты покрытий и
                  простую геометрию кухни. Финальный вид зависит от проекта и выбранных материалов.
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
              <h2 className="text-center font-serif text-3xl font-bold">Расчет кухни с фасадами МДФ</h2>
              <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
                Оставьте заявку: уточним размеры, планировку, покрытие фасадов и подготовим следующий шаг без
                неподтвержденных обещаний по цене или срокам.
              </p>
              <div className="mt-8">
                <ContactForm source="materials/mdf-fasady" sourceType="materials" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
