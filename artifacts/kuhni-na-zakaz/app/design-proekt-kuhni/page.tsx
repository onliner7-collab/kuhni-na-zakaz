import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  DraftingCompass,
  Layers3,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { buildOpenGraph, buildTwitterMetadata, SITE_NAME } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl, type JsonLdObject } from "@/lib/schema-org";

const pagePath = "/design-proekt-kuhni";
const imageBase = "/images/design-proekt-kuhni";
const title = "3D-проект кухни на заказ в Минске | Дизайн кухни";
const description =
  "Подготовим 3D-проект кухни по вашим размерам: планировка, материалы, визуализация и предварительный расчёт стоимости.";
const heroImage = `${imageBase}/3d-proekt-kuhni-hero.webp`;

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: pagePath,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: buildOpenGraph(pagePath, title, description, {
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1600,
        height: 900,
        alt: "Современная светлая кухня на заказ с деревом, камнем и встроенной техникой",
      },
    ],
  }),
  twitter: buildTwitterMetadata(title, description, heroImage),
};

const benefits = [
  {
    icon: Ruler,
    title: "Проект по вашим размерам",
    text: "Планировку собираем вокруг помещения, коммуникаций, техники и привычек семьи.",
  },
  {
    icon: Layers3,
    title: "Материалы видны заранее",
    text: "Подбираем фасады, столешницу, фурнитуру и цветовые сочетания до запуска в производство.",
  },
  {
    icon: ClipboardCheck,
    title: "Основа для расчёта",
    text: "После проекта проще оценить бюджет, сравнить решения и убрать лишние расходы.",
  },
  {
    icon: ShieldCheck,
    title: "Меньше ошибок на монтаже",
    text: "Заранее проверяем высоты, проходы, открывание фасадов и место под встроенную технику.",
  },
];

const galleryItems = [
  {
    title: "Угловая кухня",
    src: `${imageBase}/3d-proekt-uglovaya-kuhnya.webp`,
    alt: "Угловая кухня до потолка в светло-серой и древесной гамме",
    caption: "Угловая планировка с продуманным рабочим треугольником.",
    href: "/catalog/uglovye-kuhni",
  },
  {
    title: "Прямая кухня",
    src: `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`,
    alt: "Прямая светлая кухня с встроенной техникой и аккуратной зоной мойки",
    caption: "Линейная кухня для лаконичного и удобного пространства.",
    href: "/catalog/pryamye-kuhni",
  },
  {
    title: "Маленькая кухня",
    src: `${imageBase}/3d-proekt-malenkaya-kuhnya.webp`,
    alt: "Маленькая светлая кухня 6-8 м² с функциональной планировкой",
    caption: "Компактная кухня, где каждый сантиметр работает на удобство.",
    href: "/catalog/malenkie-kuhni",
  },
  {
    title: "П-образная кухня",
    src: `${imageBase}/3d-proekt-p-obraznaya-kuhnya.webp`,
    alt: "П-образная кухня со светлыми фасадами, деревом и большой рабочей зоной",
    caption: "П-образная планировка для максимальной рабочей поверхности.",
    href: "/catalog/p-obraznye-kuhni",
  },
  {
    title: "Кухня с островом",
    src: `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`,
    alt: "Просторная кухня с островом, барной зоной и встроенной техникой",
    caption: "Остров помогает объединить готовку, хранение и общение.",
    href: "/catalog/kuhni-s-ostrovom",
  },
  {
    title: "Кухня до потолка",
    src: `${imageBase}/3d-proekt-kuhnya-do-potolka.webp`,
    alt: "Кухня с фасадами до потолка в спокойной бежево-серой палитре",
    caption: "Фасады до потолка увеличивают хранение и сохраняют чистую геометрию.",
    href: "/catalog/kuhni-do-potolka",
  },
  {
    title: "Кухня без ручек",
    src: `${imageBase}/3d-proekt-kuhnya-bez-ruchek.webp`,
    alt: "Минималистичная кухня без ручек с матовыми фасадами и каменной столешницей",
    caption: "Ровные фасады создают спокойный современный образ.",
    href: "/catalog/kuhni-bez-ruchek",
  },
  {
    title: "Неоклассическая кухня",
    src: `${imageBase}/3d-proekt-neoklassicheskaya-kuhnya.webp`,
    alt: "Светлая неоклассическая кухня с рамочными фасадами и каменной столешницей",
    caption: "Неоклассика с лёгкими деталями и современной встроенной техникой.",
    href: "/styles/neoklassika",
  },
];

const projectIncludes = [
  "Планировка кухни с учётом размеров, окна, дверей, вентиляции и коммуникаций.",
  "Расстановка холодильника, мойки, варочной поверхности, духовки и хранения.",
  "Подбор фасадов, столешницы, фартука, фурнитуры и цветовой палитры.",
  "3D-визуализация, чтобы заранее увидеть пропорции и внешний вид кухни.",
  "Предварительный расчёт стоимости с понятными факторами, которые влияют на бюджет.",
];

const workflow = [
  {
    step: "01",
    title: "Заявка и вводные",
    text: "Вы описываете помещение, желаемый тип кухни, технику и ориентир по бюджету.",
  },
  {
    step: "02",
    title: "Размеры и планировка",
    text: "Уточняем размеры или предлагаем замер, затем собираем рабочую схему.",
  },
  {
    step: "03",
    title: "Материалы и визуализация",
    text: "Подбираем фасады, столешницу, фурнитуру и показываем кухню в 3D.",
  },
  {
    step: "04",
    title: "Расчёт и правки",
    text: "Согласовываем изменения, считаем стоимость и готовим проект к следующему этапу.",
  },
];

const kitchenTypes = [
  { label: "Угловые кухни", href: "/catalog/uglovye-kuhni" },
  { label: "Прямые кухни", href: "/catalog/pryamye-kuhni" },
  { label: "Маленькие кухни", href: "/catalog/malenkie-kuhni" },
  { label: "П-образные кухни", href: "/catalog/p-obraznye-kuhni" },
  { label: "Кухни с островом", href: "/catalog/kuhni-s-ostrovom" },
  { label: "Кухни до потолка", href: "/catalog/kuhni-do-potolka" },
  { label: "Кухни без ручек", href: "/catalog/kuhni-bez-ruchek" },
];

const internalLinks = [
  { label: "Цены на кухни", href: "/prices" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Материалы", href: "/materials" },
  { label: "Фурнитура для кухни", href: "/materials/furnitura" },
  { label: "Каталог кухонь", href: "/catalog" },
];

const faqItems = [
  {
    question: "Как готовится проект кухни?",
    answer:
      "Проект собирается по реальным размерам, коммуникациям, технике и ограничениям помещения.",
  },
  {
    question: "Можно ли подготовить проект без замера?",
    answer:
      "Предварительную планировку можно обсудить по вашим размерам, но для точного расчёта и запуска кухни в работу нужен корректный замер.",
  },
  {
    question: "Что влияет на стоимость кухни после 3D-проекта?",
    answer:
      "На бюджет влияют длина гарнитура, материал фасадов, столешница, фурнитура, встроенная техника, подсветка и сложность монтажа.",
  },
  {
    question: "Можно ли внести правки в визуализацию?",
    answer:
      "Да, правки обсуждаются до согласования проекта: можно поменять цвет, тип фасадов, расположение модулей или материалы.",
  },
  {
    question: "Для каких кухонь подходит 3D-проект?",
    answer:
      "Для прямых, угловых, маленьких, П-образных кухонь, кухонь с островом, фасадами до потолка, без ручек и неоклассических решений.",
  },
];

export default function DesignProektKuhniPage() {
  const localBusinessId = `${siteUrl("/")}#organization`;
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "3D-проект кухни", path: pagePath },
  ]);
  const jsonLdLocalBusiness = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: SITE_NAME,
    url: siteUrl("/"),
    logo: siteUrl("/logo.png"),
    telephone: CONTACT_DEFAULTS.phone,
    email: CONTACT_DEFAULTS.email,
    address: CONTACT_DEFAULTS.address,
    areaServed: {
      "@type": "Country",
      name: "Беларусь",
    },
  });
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "3D-проект кухни на заказ",
    description: metadata.description,
    url: siteUrl(pagePath),
    provider: {
      "@id": localBusinessId,
    },
    areaServed: {
      "@type": "City",
      name: "Минск",
    },
    serviceType: "Дизайн-проект кухни на заказ",
  });
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdItems: JsonLdObject[] = jsonLdFaq
    ? [jsonLdBreadcrumb, jsonLdService, jsonLdLocalBusiness, jsonLdFaq]
    : [jsonLdBreadcrumb, jsonLdService, jsonLdLocalBusiness];

  return (
    <>
      <JsonLd data={jsonLdItems} />
      <div className="bg-background">
        <section className="overflow-hidden border-b border-border bg-muted/30">
          <div className="container-site grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-center lg:py-16">
            <div>
              <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
                <Link href="/" className="transition-colors hover:text-primary">
                  Главная
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground">3D-проект кухни</span>
              </nav>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                Дизайн кухни перед изготовлением
              </p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                3D-проект кухни на заказ
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Подготовим проект кухни по вашим размерам: продумаем планировку, хранение, материалы,
                встроенную технику, визуализацию и предварительный расчёт стоимости.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#request"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Оставить заявку на проект
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Смотреть портфолио
                </Link>
              </div>
              <dl className="mt-8 grid grid-cols-3 gap-3 text-sm">
                {[
                  ["3D", "визуализация"],
                  ["BYN", "расчёт сметы"],
                  ["1:1", "под размеры"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-border bg-white p-3">
                    <dt className="font-bold text-foreground">{value}</dt>
                    <dd className="mt-1 text-muted-foreground">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <Image
                src={`${imageBase}/3d-proekt-kuhni-hero.webp`}
                alt="Современная светлая кухня на заказ с деревом, камнем и встроенной техникой"
                width={1600}
                height={900}
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="aspect-[16/9] w-full rounded-lg object-cover shadow-2xl shadow-black/10"
              />
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Преимущества</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Зачем нужен 3D-проект перед заказом кухни</h2>
              <p className="mt-4 text-muted-foreground">
                Проект помогает увидеть кухню до производства, проверить эргономику и принять решения по материалам без догадок.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-border bg-white p-5">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-14 lg:py-20">
          <div className="container-site">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Галерея 3D-визуализаций</p>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Примеры кухонь, которые можно спроектировать</h2>
              </div>
              <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Перейти в каталог
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-lg border border-border bg-white">
                  <Link href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
                    <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                      Подробнее
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Состав проекта</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Что входит в проект кухни</h2>
              <p className="mt-4 text-muted-foreground">
                Вы описываете пожелания, а мы переводим их в понятную планировку и визуальный проект.
              </p>
            </div>
            <div className="grid gap-3">
              {projectIncludes.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground py-14 text-white lg:py-20">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">Этапы</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Как проходит работа</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item) => (
                <article key={item.step} className="rounded-lg border border-white/15 bg-white/5 p-5">
                  <p className="text-sm font-bold text-primary-foreground/70">{item.step}</p>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-14 lg:py-20">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Типы планировок</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Какие кухни можно спроектировать</h2>
              <p className="mt-4 text-muted-foreground">
                Проектируем кухни для квартир, студий, частных домов и кухонь-гостиных. Ниже — основные направления с рабочими разделами сайта.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kitchenTypes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-14 items-center justify-between gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-site grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Стоимость</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Стоимость 3D-проекта кухни</h2>
              <p className="mt-4 text-muted-foreground">
                Условия подготовки проекта зависят от задачи: нужна ли только предварительная визуализация,
                требуется ли замер, сколько вариантов материалов нужно сравнить и планируется ли дальнейшее изготовление кухни.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {internalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: DraftingCompass, title: "Планировка", text: "Форма кухни, размеры, техника и хранение." },
                { icon: Boxes, title: "Материалы", text: "Фасады, столешница, фурнитура и подсветка." },
                { icon: Clock3, title: "Сроки", text: "Согласование, правки, производство и монтаж." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border border-border bg-white p-5">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-14 lg:py-20">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Частые вопросы</h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-lg border border-border bg-white p-5">
                  <h3 className="text-lg font-bold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="request" className="section-padding">
          <div className="container-site grid gap-8 rounded-lg bg-foreground p-5 text-white sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)] lg:p-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">Финальный CTA</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Закажите 3D-проект вашей кухни</h2>
              <p className="mt-4 max-w-2xl text-white/75">
                Оставьте контакты и коротко опишите задачу. Мы уточним размеры, тип кухни, материалы и подготовим следующий шаг для проекта.
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 text-foreground">
              <ContactForm
                source="design-proekt-kuhni"
                sourceType="design-project"
                formLocation="design-project-final-cta"
                sourcePage={pagePath}
                submitLabel="Отправить заявку на проект"
                successMessage="Спасибо, заявка отправлена. Мы свяжемся с вами для уточнения размеров и пожеланий."
                errorMessage="Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам."
                showCity={false}
                showHasMeasurements
                defaultComment="Интересует 3D-проект кухни на заказ."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
