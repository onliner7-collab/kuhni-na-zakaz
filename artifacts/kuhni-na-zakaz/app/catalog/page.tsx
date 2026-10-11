import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration";
import { VisualCatalog } from "@/components/catalog/VisualCatalog";
import { catalogFaq, catalogModels, catalogStyles } from "@/data/catalog-showcase";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, type JsonLdObject } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata, canonicalSiteUrl } from "@/lib/seo";
import "./catalog.css";

const title = "Каталог кухонь на заказ — фото, модели и планировки";
const description = "Сравните модели кухонь по фото, планировке, размерам и стилю. Подберите вариант для квартиры или дома и отправьте выбранную комплектацию на расчёт.";
const hero = "/images/catalog-showcase/country-blue.webp";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/catalog" },
  openGraph: buildOpenGraph("/catalog", title, description, { images: [{ url: hero, width: 1200, height: 800, alt: "Кухня с островом для загородного дома, концепция дизайна" }] }),
  twitter: buildTwitterMetadata(title, description, hero),
};
export const revalidate = 3600;

const categories = [
  ["uglovye-kuhni", "Угловые кухни"], ["pryamye-kuhni", "Прямые кухни"],
  ["p-obraznye-kuhni", "П-образные кухни"], ["kuhni-s-ostrovom", "Кухни с островом"],
  ["malenkie-kuhni", "Маленькие кухни"], ["kuhni-do-potolka", "Кухни до потолка"],
  ["kuhni-bez-ruchek", "Кухни без ручек"],
];

export default function CatalogPage() {
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": canonicalSiteUrl("/catalog#collection"),
    url: canonicalSiteUrl("/catalog"), name: title, description, inLanguage: "ru-BY",
    mainEntity: { "@type": "ItemList", numberOfItems: catalogModels.length,
      itemListElement: catalogModels.map((model, index) => ({ "@type": "ListItem", position: index + 1,
        item: { "@type": "CreativeWork", name: model.name, description: model.description, image: canonicalSiteUrl(model.images[0]), url: canonicalSiteUrl(`/catalog#model-${model.id}`) },
      })),
    },
  };
  return <>
    <JsonLd data={[breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Каталог кухонь", path: "/catalog" }]), collection, faqJsonLd(catalogFaq)].filter((item): item is JsonLdObject => item !== null)} />
    <ExploreContextProvider sourceRoute="/catalog">
      <main className="catalog-page"><div className="catalog-inner">
        <nav className="catalog-breadcrumb" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Каталог</span></nav>
        <header className="catalog-intro"><h1>Каталог кухонь на заказ</h1><p>24 модели для квартиры и дома: прямые, угловые, П-образные и с островом.</p>
          <div className="catalog-hero"><Image src={hero} alt="Синяя кухня с островом в загородном доме, пример дизайна" fill priority sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1247px) calc(100vw - 48px), 1200px" /><span className="catalog-hero-label">Для загородного дома · концепция</span></div>
        </header>
        <VisualCatalog />
        <section className="catalog-links" aria-labelledby="catalog-types-title"><h2 id="catalog-types-title">Типы кухонь и планировки</h2><div className="catalog-links-list">{categories.map(([slug, label]) => <Link key={slug} href={`/catalog/${slug}`}>{label}</Link>)}</div></section>
        <section className="catalog-links" aria-labelledby="catalog-styles-title"><h2 id="catalog-styles-title">Стили кухонь</h2><div className="catalog-links-list">{catalogStyles.map((style) => <Link href={style.href} key={style.id}>{style.label}</Link>)}</div></section>
        <section className="catalog-faq" aria-labelledby="catalog-faq-title"><h2 id="catalog-faq-title">Вопросы о моделях и размерах</h2>{catalogFaq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
        <section className="catalog-links" aria-labelledby="catalog-next-title"><h2 id="catalog-next-title">Материалы, проекты и расчёт</h2><div className="catalog-links-list">{[
          ["/materials", "Материалы фасадов"], ["/materials/furnitura", "Фурнитура и хранение"],
          ["/prices", "Цены и комплектации"], ["/calculator", "Калькулятор кухни"],
          ["/portfolio", "Реализованные проекты"], ["/design-proekt-kuhni", "Дизайн-проект кухни"],
          ["/locations/minsk", "Замер и монтаж в Минске"], ["/locations/minskaya-oblast", "Работа по Минской области"],
        ].map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</div></section>
      </div></main>
    </ExploreContextProvider>
  </>;
}
