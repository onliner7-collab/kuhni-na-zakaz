import type { Metadata } from "next";
import { ServiceExplorationRail } from "@/components/exploration";
import Link from "@/components/navigation/Link";
import { Calculator, CheckCircle } from "lucide-react";
import { CalculatorWizard } from "@/components/calculator/CalculatorWizard";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Калькулятор кухни онлайн: расчет стоимости";
const description =
  "Онлайн-калькулятор кухни: рассчитайте ориентировочную стоимость по форме, материалам, фурнитуре и монтажу, затем отправьте заявку на точную смету.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator" },
  openGraph: buildOpenGraph("/calculator", title, description),
  twitter: buildTwitterMetadata(title, description),
};

const INCLUDED = [
  "Условия выезда замерщика уточняются при заявке",
  "3D-проект готовим после замера по условиям заказа",
  "Доставка по Минску — от 2 000 BYN",
  "Сборка — включена в стоимость",
  "Гарантия — 5 лет",
];

const PRICE_FACTORS = [
  { title: "Размер и форма", text: "Прямая кухня обычно дешевле угловой, П-образной или кухни с островом, потому что меньше сложных модулей и стыков." },
  { title: "Фасады и столешница", text: "ЛДСП помогает удержать бюджет, МДФ, пластик, HPL и эмаль дают другой вид, ресурс и требования к уходу." },
  { title: "Фурнитура и хранение", text: "Полное выдвижение, доводчики, подъемники, карго и скрытые системы заметно влияют на итоговую смету." },
  { title: "Монтаж и подготовка", text: "Ниши, техника, трубы, неровные стены, подсветка и сложная столешница могут менять срок и стоимость работ." },
];

const ESTIMATE_STEPS = [
  "калькулятор показывает предварительный диапазон, а не финальную договорную цену",
  "после заявки уточняем размеры, технику, материалы, фурнитуру и условия монтажа",
  "после замера готовим смету, где видно, что входит в стоимость и где можно сэкономить",
];

export default function CalculatorPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Калькулятор", path: "/calculator" },
  ]);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Расчет стоимости кухни",
    url: siteUrl("/calculator"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    serviceType: "Kitchen price estimate",
    offers: { "@type": "Offer", price: 0, priceCurrency: "BYN", url: siteUrl("/calculator") },
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Калькулятор</span>
        </nav>

        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" /> Калькулятор
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">
            Рассчитать кухню онлайн
          </h1>
          <p className="text-muted-foreground text-lg">
            Ответьте на 8 вопросов и получите предварительный диапазон стоимости.
            За подробными бюджетными диапазонами перейдите на страницу цен, а точную смету подготовим после размеров и комплектации.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/prices" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-muted">
              Смотреть цены на кухни
            </Link>
            <Link href="/contacts#form" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
              Отправить заявку
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main wizard */}
          <div className="lg:col-span-2">
            <div className="card-base p-6 lg:p-8">
              <CalculatorWizard />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card-base p-5">
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Что входит в цену</h3>
              <ul className="space-y-2">
                {INCLUDED.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-base p-5 bg-primary/5 border-primary/20">
              <p className="text-sm font-semibold text-primary mb-2">Нужна точная цена?</p>
              <p className="text-xs text-muted-foreground mb-4">
                Условия замера уточняются при заявке. Точная смета зависит от размеров, материалов и комплектации.
              </p>
              <Link href="/contacts#form"
                className="block text-center py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                Согласовать замер
              </Link>
            </div>

            <div className="card-base p-5">
              <h3 className="font-semibold text-sm mb-3">Реализованные проекты</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Посмотрите реальные кейсы с указанием стоимости и сроков.
              </p>
              <Link href="/portfolio" className="text-sm text-primary hover:underline">
                Перейти в портфолио →
              </Link>
            </div>

            <div className="card-base p-4 border-amber-200 bg-amber-50/50">
              <p className="text-xs text-amber-700">
                <strong>Обратите внимание:</strong> расчёт является ориентировочным. Итоговая стоимость зависит от точных размеров, конфигурации мест под технику, сложности монтажа и других индивидуальных факторов.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PRICE_FACTORS.map((item) => (
            <article key={item.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-lg bg-primary/5 p-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-serif text-3xl font-bold">Как читать результат расчета</h2>
              <p className="mt-3 text-muted-foreground">
                Цена кухни на заказ зависит не только от метров. Важны материалы, техника, фурнитура, высота шкафов, доставка, монтаж и состояние помещения.
              </p>
            </div>
            <ol className="grid gap-3">
              {ESTIMATE_STEPS.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-md bg-white p-4 text-sm leading-6">
                  <span className="font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { href: "/prices", title: "Цены на кухни", text: "Разберите, что входит в смету и почему похожие кухни стоят по-разному." },
            { href: "/catalog", title: "Типы кухонь", text: "Сравните прямые, угловые, П-образные кухни, остров и решения до потолка." },
            { href: "/materials/furnitura", title: "Фурнитура", text: "Петли, направляющие и механизмы, которые сильнее всего влияют на удобство." },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-border p-5 transition-shadow hover:shadow-md">
              <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Link>
          ))}
        </section>
        <ServiceExplorationRail route="/calculator" />
        </div>
      </div>
    </>
  );
}
