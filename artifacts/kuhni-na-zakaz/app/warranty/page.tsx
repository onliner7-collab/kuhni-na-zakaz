import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { Shield } from "lucide-react";
import { renderContent } from "@/lib/render-content";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

const WARRANTY_CARDS = [
  { years: "5 лет", label: "на фурнитуру Blum" },
  { years: "2 года", label: "на корпус и фасады" },
  { years: "1 год", label: "на монтажные работы" },
];

const WARRANTY_DETAILS = [
  {
    title: "Что фиксируем в документах",
    items: [
      "состав кухни, материалы, фурнитуру и выбранную столешницу",
      "условия доставки, монтажа и передачи готовой кухни",
      "сроки гарантии по корпусу, фасадам, фурнитуре и монтажным работам",
    ],
  },
  {
    title: "Что проверяем при обращении",
    items: [
      "фото или видео проблемы, чтобы понять узел и подготовить мастера",
      "дату монтажа и номер заказа, если он есть в документах",
      "условия эксплуатации: вода, нагрузка, вмешательство в конструкцию, уход",
    ],
  },
];

const WARRANTY_EXCLUSIONS = [
  "повреждения после самостоятельной переделки, переноса или разборки кухни",
  "следы удара, абразивной чистки, длительного контакта с водой или перегрева",
  "неисправности техники, сантехники и коммуникаций, которые не входят в изготовленный гарнитур",
  "естественный износ и регулировка после нарушения правил эксплуатации",
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("warranty");
  const title = cleanSeoTitle(null, "Гарантия на кухни: условия и сервис");
  const description = trimMetaDescription(
    page?.seoDescription,
    "Гарантия на кухни на заказ: 5 лет на фурнитуру Blum, 2 года на корпус и фасады, 1 год на монтажные работы.",
  );
  return {
    title,
    description,
    alternates: { canonical: "/warranty" },
    openGraph: buildOpenGraph("/warranty", title, description),
    twitter: buildTwitterMetadata(title, description),
  };
}

export default async function WarrantyPage() {
  const page = await getStaticPage("warranty");
  const title = page?.title || "Гарантия";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/warranty" },
  ]);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: page?.seoDescription,
    url: siteUrl("/warranty"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    serviceType: "Warranty",
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <div className="section-padding">
        <div className="container-site max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {WARRANTY_CARDS.map((g) => (
            <div key={g.label} className="card-base p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-serif text-3xl font-bold text-primary">{g.years}</div>
              <div className="text-sm text-muted-foreground mt-1">{g.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {renderContent(content)}
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {WARRANTY_DETAILS.map((block) => (
            <article key={block.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <h2 className="font-serif text-2xl font-bold">{block.title}</h2>
              <ul className="mt-4 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                    <Shield className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-lg border border-amber-200 bg-amber-50/60 p-6">
          <h2 className="font-serif text-3xl font-bold">На что гарантия не распространяется</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Окончательные условия определяются договором и причиной дефекта. Ниже — типовые ситуации, которые требуют отдельной оценки.
          </p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {WARRANTY_EXCLUSIONS.map((item) => (
              <li key={item} className="rounded-md bg-white p-4 text-sm leading-6">{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-lg bg-primary/5 p-6">
          <h2 className="font-serif text-3xl font-bold">Как проходит гарантийное обращение</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {["Получаем описание", "Проверяем документы", "Назначаем мастера", "Закрываем вопрос"].map((step, index) => (
              <div key={step} className="rounded-md bg-white p-4">
                <p className="text-sm font-bold text-primary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Если вопрос связан с регулировкой петель, доводчиков или ящиков, часто достаточно сервисного выезда. Если подтверждается заводской дефект, подбираем замену и согласуем срок работ.
          </p>
        </section>
        </div>
      </div>
    </>
  );
}
