import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { prisma } from "@/lib/db";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Кухни на заказ по городам Беларуси",
  description:
    "Кухни на заказ в Минске и регионах Беларуси: замер, проектирование, производство, доставка и монтаж. Выберите город и посмотрите условия работы.",
  alternates: { canonical: "/locations" },
};

async function getLocations() {
  return prisma.locationPage
    .findMany({
      where: { published: true },
      orderBy: [{ region: "asc" }, { city: "asc" }],
      select: {
        slug: true,
        city: true,
        region: true,
        h1: true,
        intro: true,
        priceFrom: true,
        deliveryDays: true,
        measureCost: true,
      },
    })
    .catch(() => []);
}

export default async function LocationsPage() {
  const locations = await getLocations();
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
      itemListElement: locations.map((location, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: location.h1 || `Кухни на заказ в ${location.city}`,
        url: siteUrl(`/locations/${location.slug}`),
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdCollection]} />

      <div className="section-padding">
        <div className="container-site">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Главная
            </Link>
            <span>/</span>
            <span className="text-foreground">Города</span>
          </nav>

          <div className="mb-10 max-w-3xl">
            <h1 className="mb-4 font-serif text-4xl font-bold">
              Кухни на заказ по городам Беларуси
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Выберите город или регион, чтобы посмотреть условия замера, доставки,
              монтажа и примеры работ рядом с вами.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {location.region || "Беларусь"}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">
                      {location.city}
                    </h2>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <p className="mb-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {location.intro || location.h1 || `Кухни на заказ в ${location.city}`}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {location.priceFrom > 0 && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                      от {location.priceFrom.toLocaleString("ru")} BYN
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                    замер: {location.measureCost || "бесплатно"}
                  </span>
                  {location.deliveryDays > 0 && (
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      выезд: {location.deliveryDays} дн.
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-center font-serif text-2xl font-bold">
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
      </div>
    </>
  );
}
