import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { regionalLocations } from "@/data/locations";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Кухни на заказ по городам Беларуси",
  description:
    "Региональные страницы кухонь на заказ по Беларуси: Минск, Минская область, Борисов, Жодино, Молодечно, Солигорск, Слуцк, Фаниполь, Смолевичи, Гомель, Гродно, Брест, Витебск, Могилёв.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Города", path: "/locations" },
  ]);
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Кухни на заказ по городам Беларуси",
    url: siteUrl("/locations"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: regionalLocations.map((location, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: location.h1,
        url: siteUrl(`/locations/${location.slug}`),
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdCollection]} />

      <main className="section-padding">
        <div className="container-site">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Главная
            </Link>
            <span>/</span>
            <span className="text-foreground">Города</span>
          </nav>

          <div className="mb-10 max-w-3xl">
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground">
              Кухни на заказ по городам Беларуси
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Выберите город или регион. Для Минской области сделан отдельный хаб, а для крупных
              городов и основных направлений подготовлены самостоятельные страницы без дублей и
              неподтвержденных обещаний.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {regionalLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {location.regionName}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">
                      {location.cityName}
                    </h2>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <p className="mb-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {location.intro}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    от {location.priceFrom.toLocaleString("ru")} BYN
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                    {location.isMajorCity ? "крупный город" : location.isMinskRegionCity ? "Минская область" : "регион"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-center font-serif text-2xl font-bold text-foreground">
              Не нашли свой город?
            </h2>
            <p className="mb-6 text-center text-muted-foreground">
              Оставьте заявку, уточним адрес и подскажем ближайшее время замера.
            </p>
            <div className="card-base p-6">
              <ContactForm source="locations-index" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
