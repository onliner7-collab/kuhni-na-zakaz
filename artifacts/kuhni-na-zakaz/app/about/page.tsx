import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { ContactForm } from "@/components/sections/ContactForm";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

const FACTS = [
  { n: "BY", t: "частные заказы", d: "Работаем с клиентами по Беларуси" },
  { n: "1:1", t: "индивидуальные размеры", d: "Проектируем под конкретное помещение" },
  { n: "5 лет", t: "гарантия", d: "На фурнитуру Blum" },
  { n: "14 дней", t: "минимальный срок", d: "Для стандартных моделей" },
];

const TRUST_BLOCKS = [
  {
    title: "Производство и контроль",
    text: "Кухню проектируем под реальные размеры помещения, проверяем узлы до запуска в работу и согласуем комплектацию до договора. Это снижает риск доплат на монтаже и помогает заранее учесть технику, трубы, вентиляцию и неровные стены.",
  },
  {
    title: "Договор, смета и сроки",
    text: "В смете фиксируем материалы, фурнитуру, столешницу, доставку и монтаж. После замера клиент видит, что входит в цену, какие позиции можно упростить и где экономия повредит удобству кухни.",
  },
  {
    title: "Минск и область",
    text: "Работаем с заказами в Минске, Минской области и других городах Беларуси. Для квартиры, новостройки или частного дома заранее обсуждаем логистику, занос, дату монтажа и гарантийное обслуживание.",
  },
];

const PROCESS_STEPS = [
  "принимаем заявку и уточняем задачу: размер, стиль, бюджет, город и желаемые сроки",
  "делаем замер, проверяем стены, выводы воды, электрику, вентиляцию и место под технику",
  "собираем проект и смету с понятными материалами, фурнитурой и условиями монтажа",
  "изготавливаем кухню, доставляем комплект, собираем на объекте и передаём рекомендации по уходу",
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("about");
  const title = cleanSeoTitle(null, "О компании: производство кухонь в Минске");
  const description = trimMetaDescription(
    page?.seoDescription,
    "Производитель кухонь на заказ по Беларуси: индивидуальные размеры, договор, гарантийные условия и замер по заявке.",
  );
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: buildOpenGraph("/about", title, description),
    twitter: buildTwitterMetadata(title, description),
  };
}

export default async function AboutPage() {
  const page = await getStaticPage("about");
  const title = page?.title || "О компании";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/about" },
  ]);
  const jsonLdPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    url: siteUrl("/about"),
    description: page?.seoDescription,
    mainEntity: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdPage]} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-10">{title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {FACTS.map((f) => (
              <div key={f.t} className="card-base p-5 text-center">
                <div className="font-serif text-3xl font-bold text-primary">{f.n}</div>
                <div className="font-medium text-sm mt-1">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>

          {content && (
            <div className="max-w-3xl space-y-4 mb-16">
              {renderContent(content)}
            </div>
          )}

          <section className="mb-16 grid gap-5 md:grid-cols-3">
            {TRUST_BLOCKS.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </section>

          <section className="mb-16 rounded-lg bg-primary/5 p-6">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="font-serif text-3xl font-bold">Как строится работа</h2>
                <p className="mt-3 text-muted-foreground">
                  Главная цель — не просто привезти гарнитур, а сделать кухню, которая встанет в помещение без сюрпризов и будет удобна каждый день.
                </p>
              </div>
              <ol className="grid gap-3">
                {PROCESS_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-md bg-white p-4 text-sm leading-6">
                    <span className="font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mb-16 grid gap-4 md:grid-cols-3">
            {[
              { href: "/portfolio", title: "Портфолио", text: "Посмотрите проекты с фото, городами, материалами и параметрами кухни." },
              { href: "/warranty", title: "Гарантия", text: "Сроки гарантии, что входит в обслуживание и как обратиться после монтажа." },
              { href: "/reviews", title: "Отзывы", text: "Отзывы клиентов и связанные проекты, если они указаны в карточках." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-border p-5 transition-shadow hover:shadow-md">
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </Link>
            ))}
          </section>

          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8">Свяжитесь с нами</h2>
            <ContactForm source="about" />
          </div>
        </div>
      </div>
    </>
  );
}
