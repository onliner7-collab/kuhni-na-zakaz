import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { ArrowRight, MapPin } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { regionalLocations } from "@/data/locations";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import { LocationHubExplorer } from "@/components/locations/LocationHubExplorer";

const title = "Купить кухню по городам Беларуси | Кухни на заказ";
const description =
  "Купить кухню под размер в Минске, Борисове, Жодино, Молодечно, Солигорске, Слуцке и других городах: расчет, замер, доставка и монтаж.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/locations" },
  openGraph: buildOpenGraph("/locations", title, description),
  twitter: buildTwitterMetadata(title, description),
};

export const revalidate = 3600;

export default function LocationsPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Города", path: "/locations" },
  ]);
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Купить кухню по городам Беларуси",
    url: siteUrl("/locations"),
  };

  const cityCardText = (location: (typeof regionalLocations)[number]) =>
    location.slug === "minskaya-oblast"
      ? "Хаб по городам области: направления, условия выезда, доставка, монтаж и переходы на отдельные городские страницы."
      : `Условия расчета, замера, доставки и монтажа для ${location.cityGenitive}. Перед сметой уточняем размеры, технику, адрес и готовность помещения.`;

  return (
    <ExploreContextProvider sourceRoute="/locations">
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

          <div className="mb-6 max-w-3xl">
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground">
              Купить кухню по городам Беларуси
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Сначала выберите тип помещения и посмотрите, как меняются кухня, хранение и подготовка к монтажу.
            </p>
          </div>

          <div className="mb-10 max-w-5xl">
            <LocationHubExplorer />
          </div>

          <details className="mb-10 rounded-2xl border border-border bg-muted/20 p-4 md:p-6">
            <summary className="min-h-11 cursor-pointer text-lg font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Все города и регионы
            </summary>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Список остаётся доступным поисковым системам и открывается по вашему запросу, не создавая длинную стену карточек в первом экране.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  {cityCardText(location)}
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
          </details>

          <div className="mb-12">
            <RelatedExplorationRail route="/locations" state="RESULT" />
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
    </ExploreContextProvider>
  );
}
