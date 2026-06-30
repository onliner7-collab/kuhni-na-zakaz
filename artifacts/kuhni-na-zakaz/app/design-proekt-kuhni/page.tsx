import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { DesignProjectInteractive } from "@/components/design-project/DesignProjectInteractive";
import { ContactForm } from "@/components/sections/ContactForm";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { buildTelegramHref } from "@/lib/social-links";
import { buildOpenGraph, buildTwitterMetadata, SITE_NAME } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl, type JsonLdObject } from "@/lib/schema-org";

const pagePath = "/design-proekt-kuhni";
const imageBase = "/images/design-proekt-kuhni";
const title = "3D-проект кухни на заказ в Минске — дизайн, планировка и визуализация";
const description =
  "Разработаем 3D-проект кухни по вашим размерам: планировка, материалы, техника, системы хранения и предварительный расчёт стоимости. Работаем в Минске и по Беларуси.";
const heroImage = `${imageBase}/3d-proekt-kuhni-hero.webp`;
const emptyRoomImage = `${imageBase}/3d-proekt-kuhni-empty-room-20260629.webp`;

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
        alt: "Финальная современная кухня после 3D-проектирования",
      },
    ],
  }),
  twitter: buildTwitterMetadata(title, description, heroImage),
};

const faqItems = [
  {
    question: "Как создаётся 3D-проект кухни?",
    answer:
      "Мы собираем вводные по помещению, проверяем размеры и ограничения, предлагаем планировку, подбираем материалы, технику и показываем будущую кухню в визуализации.",
  },
  {
    question: "Можно ли заказать проект кухни без замера?",
    answer:
      "Предварительный проект кухни можно обсудить по вашим размерам, фото или плану. Для точного расчёта, производства и монтажа нужен корректный замер помещения.",
  },
  {
    question: "Какие размеры нужны для предварительной планировки?",
    answer:
      "Нужны длины стен, высота помещения, размеры окна и дверей, расположение воды, канализации, вентиляции, розеток, радиатора и крупной техники.",
  },
  {
    question: "Можно ли изменить материалы после визуализации?",
    answer:
      "Да. До согласования проекта можно заменить фасады, столешницу, ручки, фурнитуру, фартук, цветовую палитру и часть техники.",
  },
  {
    question: "Сколько вариантов кухни можно рассмотреть?",
    answer:
      "Обычно обсуждаем несколько рабочих вариантов планировки или материалов, чтобы сравнить удобство, внешний вид и влияние решений на стоимость кухни.",
  },
  {
    question: "Входит ли в проект подбор техники?",
    answer:
      "Да, техника учитывается в планировке: холодильник, духовка, варочная поверхность, вытяжка, посудомоечная машина и микроволновая печь.",
  },
  {
    question: "Можно ли сделать проект маленькой кухни?",
    answer:
      "Да. Для маленькой кухни 6-8 м2 проект особенно важен: он помогает проверить хранение, проходы, открывание фасадов и место под технику.",
  },
  {
    question: "Можно ли разработать проект кухни-гостиной?",
    answer:
      "Да. В проекте кухни-гостиной отдельно смотрим вид со стороны гостиной, остров или полуостров, проходы, свет и встроенную технику.",
  },
  {
    question: "Что влияет на стоимость будущей кухни?",
    answer:
      "На стоимость влияют размеры, форма кухни, фасады, столешница, фурнитура, встроенная техника, подсветка, сложность монтажа и дополнительные системы хранения.",
  },
  {
    question: "Можно ли заказать кухню после создания проекта?",
    answer:
      "Да. После согласования 3D-проекта можно перейти к точному расчёту, договору, производству, доставке и монтажу кухни.",
  },
];

const internalLinks = [
  { label: "Угловые кухни", href: "/catalog/uglovye-kuhni" },
  { label: "Прямые кухни", href: "/catalog/pryamye-kuhni" },
  { label: "Маленькие кухни", href: "/catalog/malenkie-kuhni" },
  { label: "П-образные кухни", href: "/catalog/p-obraznye-kuhni" },
  { label: "Кухни с островом", href: "/catalog/kuhni-s-ostrovom" },
  { label: "Кухни до потолка", href: "/catalog/kuhni-do-potolka" },
  { label: "Кухни без ручек", href: "/catalog/kuhni-bez-ruchek" },
  { label: "Неоклассические кухни", href: "/portfolio?style=neoklassika" },
  { label: "Каталог кухонь", href: "/catalog" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Материалы", href: "/materials" },
  { label: "Фурнитура", href: "/materials/furnitura" },
  { label: "Цены", href: "/prices" },
  { label: "Замер кухни", href: "/contacts" },
];

const seoSections = [
  {
    title: "Что такое 3D-проект кухни",
    text:
      "3D-проект кухни на заказ — это визуальная модель будущей кухни по размерам помещения. В проекте видно планировку кухни, высоту шкафов, расположение техники, рабочую зону, материалы, подсветку и общий вид интерьера до начала производства.",
  },
  {
    title: "Зачем нужна визуализация кухни",
    text:
      "Визуализация кухни помогает заранее заметить ошибки: неудобное открывание фасадов, маленькую столешницу, конфликт техники с проходами, нехватку хранения или спорное сочетание материалов. Проект кухни по размерам снижает риск переделок и делает расчет понятнее.",
  },
  {
    title: "Можно ли сделать проект по вашим размерам",
    text:
      "Да, предварительный дизайн-проект кухни Минск можно начать по размерам клиента, фото помещения или плану. Для точного запуска кухни в производство нужен замер: на месте проверяются стены, углы, вентиляция, трубы, подоконник, высота и электрика.",
  },
  {
    title: "Какие кухни можно спроектировать",
    text:
      "Мы готовим проект маленькой кухни, проект угловой кухни, прямой кухни, П-образной кухни, кухни-гостиной, кухни с островом, кухни до потолка и кухни без ручек. В проект можно включить встроенную технику, подсветку, хранение, пеналы и нестандартные модули.",
  },
  {
    title: "Как заказать проект кухни",
    text:
      "Чтобы заказать проект кухни, отправьте размеры, фото помещения или план. Мы уточним задачу, предложим следующий шаг, подготовим планировку кухни, покажем 3D-визуализацию кухни и после правок сможем перейти к предварительному расчету стоимости.",
  },
];

export default function DesignProektKuhniPage() {
  const telegramHref = buildTelegramHref(CONTACT_DEFAULTS.telegram);
  const localBusinessId = `${siteUrl("/")}#organization`;
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "3D-проект кухни", path: pagePath },
  ]);
  const jsonLdWebPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: siteUrl(pagePath),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: siteUrl(heroImage),
      width: 1600,
      height: 900,
      caption: "Финальная современная кухня после 3D-проектирования",
    },
  });
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "3D-проект кухни на заказ",
    description,
    url: siteUrl(pagePath),
    provider: {
      "@id": localBusinessId,
    },
    areaServed: [
      { "@type": "City", name: "Минск" },
      { "@type": "Country", name: "Беларусь" },
    ],
    serviceType: "Дизайн-проект и 3D-визуализация кухни",
  });
  const jsonLdOrganization = compactJsonLd({
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
  const jsonLdImages = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: "Финальная 3D-визуализация кухни",
    url: siteUrl(heroImage),
    contentUrl: siteUrl(heroImage),
    width: 1600,
    height: 900,
    caption: "Финальная современная кухня после 3D-проектирования",
  });
  const jsonLdEmptyRoomImage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: "Пустое помещение перед проектированием кухни",
    url: siteUrl(emptyRoomImage),
    contentUrl: siteUrl(emptyRoomImage),
    width: 1600,
    height: 914,
    caption: "Пустое помещение кухни с окном и коммуникациями перед созданием 3D-проекта",
  });
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdItems: JsonLdObject[] = jsonLdFaq
    ? [jsonLdBreadcrumb, jsonLdWebPage, jsonLdService, jsonLdOrganization, jsonLdImages, jsonLdEmptyRoomImage, jsonLdFaq]
    : [jsonLdBreadcrumb, jsonLdWebPage, jsonLdService, jsonLdOrganization, jsonLdImages, jsonLdEmptyRoomImage];

  return (
    <>
      <JsonLd data={jsonLdItems} />
      <main className="bg-background">
        <DesignProjectInteractive />

        <section className="section-padding bg-white" id="seo-content">
          <div className="container-site">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
              <Link href="/" className="transition-colors hover:text-primary">
                Главная
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">3D-проект кухни</span>
            </nav>
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">SEO-раздел</p>
                <h2 className="text-3xl font-extrabold sm:text-4xl">3D-проект кухни на заказ: планировка, материалы и расчет</h2>
                <p className="mt-4 text-muted-foreground">
                  Этот раздел оставлен в читаемом HTML: поисковым системам и пользователям доступны основные ответы о проектировании кухни, 3D-визуализации, замере, материалах, технике и стоимости.
                </p>
                <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
                  <Image
                    src={`${imageBase}/3d-proekt-kuhnya-do-potolka.webp`}
                    alt="3D-визуализация кухни до потолка с материалами и встроенной техникой"
                    width={1200}
                    height={900}
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-5">
                {seoSections.map((section) => (
                  <article key={section.title} className="rounded-lg border border-border bg-muted/20 p-5">
                    <h3 className="text-xl font-extrabold">{section.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-extrabold">Внутренние ссылки по теме проекта кухни</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {internalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted/30" id="errors">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Ошибки, которые предотвращает проект</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Проект показывает проблемы до производства</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Холодильник открывается не полностью", "Проверяем сторону открывания, соседние фасады и проход."],
                ["Посудомойка перекрывает проход", "Смотрим открывание дверцы на плане и в 3D-сцене."],
                ["Розетки оказываются за техникой", "Согласуем электрику до производства и монтажа."],
                ["Не хватает мест хранения", "Добавляем пеналы, антресоли, органайзеры и выдвижные системы."],
                ["Вытяжка конфликтует с вентиляцией", "Проверяем трассу, высоту и расположение шкафа."],
                ["Столешница слишком маленькая", "Считаем рабочие зоны между мойкой, плитой и холодильником."],
                ["Нельзя открыть ящики", "Проверяем ручки, стены, углы и соседнюю технику."],
                ["Рабочая зона неудобная", "Собираем кухню вокруг привычек семьи и маршрутов готовки."],
                ["Неверная высота кухни", "Учитываем рост, цоколь, столешницу и верхние модули."],
                ["Материалы выглядят иначе", "Сравниваем визуализацию и реальные образцы перед запуском."],
              ].map(([error, solution]) => (
                <article key={error} className="rounded-lg border border-border bg-white p-5">
                  <div className="mb-4 inline-flex rounded-full bg-destructive/10 p-2 text-destructive">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-extrabold">{error}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{solution}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white" id="faq">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Частые вопросы о 3D-проекте кухни</h2>
            </div>
            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              {faqItems.map((item) => (
                <details key={item.question} className="group rounded-lg border border-border bg-white p-5 open:bg-muted/20">
                  <summary className="cursor-pointer list-none text-lg font-extrabold outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {item.question}
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="request" className="relative overflow-hidden bg-stone-950 py-14 text-white lg:py-20">
          <Image
            src={heroImage}
            alt="Премиальная кухня с вечерней подсветкой для финального 3D-проекта"
            width={1600}
            height={900}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/55" />
          <div className="container-site relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1fr)] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">Заявка на проект</p>
              <h2 className="text-3xl font-extrabold sm:text-5xl">Увидьте свою кухню до того, как она появится дома</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                Отправьте размеры, фото помещения или план. Мы предложим следующий шаг для вашего проекта.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "планировка по размерам",
                  "подбор фасадов и столешницы",
                  "встроенная техника и хранение",
                  "предварительный расчет стоимости",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-3 text-sm font-semibold">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-200" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
              {telegramHref && (
                <Link
                  href={telegramHref}
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Отправить размеры в Telegram
                </Link>
              )}
            </div>
            <div className="rounded-lg bg-white p-5 text-foreground shadow-2xl shadow-black/20">
              <ContactForm
                source="design-proekt-kuhni"
                sourceType="design-project"
                formLocation="design-project-final-cta"
                sourcePage={pagePath}
                submitLabel="Получить проект кухни"
                successMessage="Спасибо, заявка отправлена. Мы свяжемся с вами для уточнения размеров, фото помещения и пожеланий."
                errorMessage="Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram."
                showCity={false}
                showMessenger
                showHasMeasurements
                showRoomFile
                defaultComment="Интересует 3D-проект кухни на заказ."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
