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
  const deliveryFaq = [
    { question: "Входит ли подъем кухни в стоимость?", answer: "Зависит от адреса, этажа, лифта и габаритов деталей. Условия подъема и заноса согласуем до доставки и фиксируем в смете." },
    { question: "Подключаете ли технику, воду и газ?", answer: "Состав работ уточняется заранее. Электрические, сантехнические и газовые подключения выполняются только если они прямо согласованы; газовые работы требуют профильного специалиста." },
    { question: "Когда можно пользоваться кухней после монтажа?", answer: "После приемки и проверки открывания фасадов и ящиков. Для герметиков, клеевых соединений и подключенной техники мастер может дать отдельные рекомендации по времени ожидания." },
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

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="font-serif text-3xl font-bold">География и сроки</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Работаем в Минске, Минской области и согласовываем заказы по Беларуси. Дату доставки и монтажный день подтверждаем после готовности комплекта и проверки адреса, подъезда, лифта и условий заноса.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/locations/minsk" className="min-h-11 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary">Минск</Link>
              <Link href="/locations/minskaya-oblast" className="min-h-11 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary">Минская область</Link>
              <Link href="/locations" className="min-h-11 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary">Все регионы</Link>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="font-serif text-3xl font-bold">Подключения и дополнительные работы</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Демонтаж, сложный подъем, вырезы, подключение техники и сантехники нельзя считать включенными автоматически. До договора уточняем состав работ, ограничения объекта и ответственного специалиста, чтобы на монтаже не возникли неожиданные доплаты.
            </p>
            <Link href="/contacts#form" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">Уточнить состав работ</Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="delivery-faq-heading">
          <h2 id="delivery-faq-heading" className="font-serif text-3xl font-bold">Вопросы о доставке и монтаже</h2>
          <div className="mt-5 grid gap-3">
            {deliveryFaq.map((item) => (
              <details key={item.question} className="group rounded-lg border border-border bg-white p-5">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
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
