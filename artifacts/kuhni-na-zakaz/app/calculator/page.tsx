import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, CheckCircle } from "lucide-react";
import { CalculatorWizard } from "@/components/calculator/CalculatorWizard";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Калькулятор стоимости кухни",
  description: "Рассчитайте ориентировочную стоимость кухни на заказ в Беларуси. Выберите форму, материал, стиль и получите диапазон цены за 2 минуты. Бесплатно.",
  alternates: { canonical: "/calculator" },
};

const INCLUDED = [
  "Условия выезда замерщика уточняются при заявке",
  "3D-проект готовим после замера по условиям заказа",
  "Доставка по Минску — от 2 000 BYN",
  "Сборка — включена в стоимость",
  "Гарантия — 5 лет",
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
            Сколько стоит кухня на заказ?
          </h1>
          <p className="text-muted-foreground text-lg">
            Ответьте на 8 вопросов и получите ориентировочный диапазон стоимости.
            Без звонков и переговоров — сразу цифры.
          </p>
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
        </div>
      </div>
    </>
  );
}
