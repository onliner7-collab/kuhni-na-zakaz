import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, offerJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("delivery-installation");
  const title = cleanSeoTitle(null, "Доставка и монтаж кухни в Минске");
  const description = trimMetaDescription(
    page?.seoDescription,
    "Доставка и монтаж кухни под ключ по Беларуси: привозим гарнитур, собираем, устанавливаем столешницу, регулируем фурнитуру и убираем упаковку.",
  );
  return {
    title,
    description,
    alternates: { canonical: "/delivery-installation" },
    openGraph: buildOpenGraph("/delivery-installation", title, description),
    twitter: buildTwitterMetadata(title, description),
  };
}

export default async function DeliveryPage() {
  const page = await getStaticPage("delivery-installation");
  const title = page?.title || "Доставка и монтаж";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/delivery-installation" },
  ]);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: page?.seoDescription,
    url: siteUrl("/delivery-installation"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    offers: offerJsonLd(200, "/delivery-installation"),
  });

  const logistics = [
    { title: "До доставки", text: "Согласуем дату, адрес, подъезд, лифт, место разгрузки и готовность помещения. Если нужен демонтаж старой кухни, обсуждаем его заранее." },
    { title: "На монтаже", text: "Собираем корпуса, навешиваем шкафы, ставим столешницу, регулируем фасады, проверяем открывание ящиков и доводчиков." },
    { title: "После установки", text: "Показываем, как пользоваться механизмами, что важно для ухода за фасадами и куда обращаться по гарантийному вопросу." },
  ];

  const prepChecklist = [
    "освободить проходы, место разгрузки и саму кухонную зону",
    "проверить доступ к розеткам, воде, канализации и вентиляции",
    "завершить мокрые работы, плитку и основные пыльные этапы ремонта",
    "предупредить о сложном подъеме, узких дверях или ограничениях по времени",
  ];

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
        <div className="space-y-4">
          {renderContent(content)}
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {logistics.map((item) => (
            <article key={item.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-lg bg-primary/5 p-6">
          <h2 className="font-serif text-3xl font-bold">Как подготовить помещение</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {prepChecklist.map((item) => (
              <li key={item} className="rounded-md bg-white p-4 text-sm leading-6 text-muted-foreground">{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Для Минска и Минской области заранее считаем логистику, чтобы доставка, занос и монтаж не сдвинули срок передачи кухни.
          </p>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { href: "/calculator", title: "Рассчитать кухню", text: "Оцените бюджет с учетом формы, материалов и комплектации." },
            { href: "/prices", title: "Цены", text: "Посмотрите, из чего складывается стоимость кухни на заказ." },
            { href: "/warranty", title: "Гарантия", text: "Условия сервиса после установки кухни." },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-border p-5 transition-shadow hover:shadow-md">
              <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Link>
          ))}
        </section>
        </div>
      </div>
    </>
  );
}
