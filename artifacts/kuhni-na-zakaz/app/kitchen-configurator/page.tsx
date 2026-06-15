import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Clock3, Ruler } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { PhoneReveal } from "@/components/layout/PhoneReveal";

const title = "Конфигуратор кухни скоро будет доступен";
const description =
  "Визуальный конфигуратор кухни временно обновляется. Оставьте заявку, и мы подготовим расчет кухни по вашим размерам, планировке и материалам.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kitchen-configurator" },
  openGraph: buildOpenGraph("/kitchen-configurator", title, description),
  twitter: buildTwitterMetadata(title, description),
};

const STEPS = [
  "Пришлете размеры помещения или фото",
  "Уточним планировку, материалы и технику",
  "Подготовим ориентир по цене и срокам",
];

const OPTIONS = [
  { icon: Ruler, title: "По вашим размерам", text: "Учтем стены, углы, трубы, окна и место под встроенную технику." },
  { icon: Calculator, title: "Расчет бюджета", text: "Подскажем диапазон стоимости до финального замера и проекта." },
  { icon: Clock3, title: "Без ожидания релиза", text: "Заявку можно оставить уже сейчас, а конфигуратор добавим позже." },
];

export default function KitchenConfiguratorPlaceholderPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Конфигуратор кухни", path: "/kitchen-configurator" },
  ]);
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Предварительный расчет кухни на заказ",
    url: siteUrl("/kitchen-configurator"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    serviceType: "Kitchen design estimate",
    offers: { "@type": "Offer", price: 0, priceCurrency: "BYN", url: siteUrl("/kitchen-configurator") },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <main className="bg-background">
        <section className="section-padding">
          <div className="container-site">
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Главная
              </Link>
              <span>/</span>
              <span className="text-foreground">Конфигуратор кухни</span>
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Clock3 className="h-4 w-4" />
                  Конфигуратор обновляется
                </div>

                <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Онлайн-конфигуратор кухни скоро появится на сайте
                </h1>

                <p className="mb-7 text-lg leading-relaxed text-muted-foreground">
                  Мы временно убрали визуальный конструктор, чтобы спокойно доработать его без ошибок для посетителей.
                  Страница остается полезной: оставьте заявку, и дизайнер подготовит предварительный расчет кухни по
                  вашим размерам, планировке и пожеланиям.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#form"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Получить расчет
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <PhoneReveal
                    phone={CONTACT_DEFAULTS.phoneDisplay}
                    phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
                    source="kitchen-configurator"
                    compact
                    className="justify-center px-5 py-3"
                  />
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {OPTIONS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="rounded-lg border bg-card p-4">
                        <Icon className="mb-3 h-5 w-5 text-primary" />
                        <h2 className="mb-1 text-sm font-semibold text-foreground">{item.title}</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside id="form" className="rounded-lg border bg-card p-5 shadow-sm lg:p-6">
                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Заявка на расчет</p>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">Расскажите о будущей кухне</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Перезвоним, уточним размеры и предложим следующий шаг: консультацию, замер или предварительную
                    комплектацию.
                  </p>
                </div>
                <ContactForm source="kitchen-configurator-placeholder" />
              </aside>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-12">
          <div className="container-site">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Что будет дальше</p>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  Конфигуратор вернем после полноценной доработки
                </h2>
              </div>

              <div className="grid gap-3">
                {STEPS.map((step) => (
                  <div key={step} className="flex items-start gap-3 rounded-lg bg-background p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
