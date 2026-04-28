import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";

export const metadata: Metadata = {
  title: "Каталог кухонь на заказ",
  description: "Каталог кухонь на заказ: угловые, прямые, П-образные, с островом, маленькие. Цены от 900 BYN. Доставка и монтаж по всей Беларуси.",
  alternates: { canonical: "/catalog" },
};

const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  "kuhni-bez-ruchek": {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Кухня без ручек на заказ в Минске",
  },
  "kuhnya-bez-ruchek-minsk": {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Кухня без ручек на заказ в Минске",
  },
  "kuhni-do-potolka": {
    src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
    alt: "Кухня до потолка с дополнительным хранением",
  },
  "kuhnya-do-potolka-minsk": {
    src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
    alt: "Кухня до потолка с дополнительным хранением",
  },
  "malenkie-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
    alt: "Маленькая кухня на заказ для небольшой квартиры",
  },
  "malenkaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
    alt: "Маленькая кухня на заказ для небольшой квартиры",
  },
  "kuhni-s-ostrovom": {
    src: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
    alt: "Кухня с островом для просторной кухни-гостиной",
  },
  "kuhnya-s-ostrovom-minsk": {
    src: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
    alt: "Кухня с островом для просторной кухни-гостиной",
  },
  "p-obraznye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.webp",
    alt: "П-образная кухня на заказ с большой рабочей зоной",
  },
  "p-obraznaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.webp",
    alt: "П-образная кухня на заказ с большой рабочей зоной",
  },
  "pryamye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая кухня на заказ для небольшой квартиры",
  },
  "pryamaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая кухня на заказ для небольшой квартиры",
  },
  "uglovye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
    alt: "Угловая кухня на заказ в Минске",
  },
  "uglovaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
    alt: "Угловая кухня на заказ в Минске",
  },
};

const CATEGORY_IMAGE_KEYWORDS = [
  { test: /без ручек/i, key: "kuhni-bez-ruchek" },
  { test: /до потолка/i, key: "kuhni-do-potolka" },
  { test: /маленьк|небольш/i, key: "malenkie-kuhni" },
  { test: /остров/i, key: "kuhni-s-ostrovom" },
  { test: /п-образ/i, key: "p-obraznye-kuhni" },
  { test: /прям/i, key: "pryamye-kuhni" },
  { test: /углов/i, key: "uglovye-kuhni" },
];

const DEFAULT_CATEGORIES = [
  { slug: "kuhni-bez-ruchek", title: "Кухни без ручек", description: "Лаконичный современный дизайн. Нажимные механизмы или J-профиль.", priceFrom: 2000, features: ["Чистый дизайн", "Удобный уход", "Современность"] },
  { slug: "kuhni-do-potolka", title: "Кухни до потолка", description: "С фасадами до самого потолка — максимум хранения и строгий вид.", priceFrom: 2200, features: ["Максимум высоты", "Нет пыли", "Монолитный вид"] },
  { slug: "malenkie-kuhni", title: "Маленькие кухни", description: "Кухни до 2 п.м. Оптимальные решения для квартир-студий.", priceFrom: 900, features: ["Компактность", "Встроенная техника", "Вертикальное хранение"] },
  { slug: "kuhni-s-ostrovom", title: "Кухни с островом", description: "Для открытых пространств. Остров совмещает рабочую зону и общение.", priceFrom: 4500, features: ["Барная стойка", "Доп. рабочие поверхности", "Хранение"] },
  { slug: "p-obraznye-kuhni", title: "П-образные кухни", description: "Максимум рабочего пространства. Идеальны для кухонь от 4 п.м.", priceFrom: 3500, features: ["Максимум хранения", "Большая рабочая зона", "Разделение зон"] },
  { slug: "pryamye-kuhni", title: "Прямые кухни", description: "Классика кухонного дизайна. Подходят для узких помещений и студий.", priceFrom: 1200, features: ["Простой монтаж", "Лаконичность", "Узкие кухни"] },
  { slug: "uglovye-kuhni", title: "Угловые кухни", description: "Оптимальное использование угловых зон. Подходят для кухонь от 2 п.м.", priceFrom: 1800, features: ["Эффективный угол", "Вместительность", "Зонирование"] },
];

function resolveCategoryImage({
  slug,
  title,
  category,
  mainImage,
  images,
}: {
  slug: string;
  title: string;
  category?: string | null;
  mainImage?: string | null;
  images?: string[] | null;
}) {
  const databaseImage = mainImage || images?.[0] || "";
  const fallbackKey =
    CATEGORY_IMAGES[slug] ? slug : CATEGORY_IMAGE_KEYWORDS.find(({ test }) => test.test(`${title} ${category ?? ""}`))?.key;
  const fallback = fallbackKey ? CATEGORY_IMAGES[fallbackKey] : undefined;
  const rawSrc = databaseImage || fallback?.src || "";

  return {
    src: optimizedImageSrc(rawSrc) || rawSrc,
    alt: databaseImage ? `${title} на заказ в Минске` : fallback?.alt || `${title} на заказ`,
  };
}

async function getKitchens() {
  try {
    return await prisma.kitchen.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function CatalogPage() {
  const kitchens = await getKitchens();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "/" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "/catalog" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Каталог</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-4">Каталог кухонь на заказ</h1>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Изготавливаем кухни по индивидуальным размерам. Каждый проект — отдельный дизайн и расчёт.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchens.length > 0
              ? kitchens.map((k, index) => {
                  const image = resolveCategoryImage(k);

                  return (
                  <Link key={k.id} href={`/catalog/${k.slug}`} className="card-base hover:shadow-md transition-shadow group">
                    <CatalogCategoryImage src={image.src} alt={image.alt} priority={index < 3} />
                    <div className="p-5">
                      <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{k.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{k.description}</p>
                      <p className="text-primary font-semibold mt-2">от {k.priceFrom.toLocaleString("ru")} BYN</p>
                    </div>
                  </Link>
                  );
                })
              : DEFAULT_CATEGORIES.map((cat, index) => {
                  const image = resolveCategoryImage(cat);

                  return (
                  <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="card-base hover:shadow-md transition-shadow group">
                    <CatalogCategoryImage src={image.src} alt={image.alt} priority={index < 3} />
                    <div className="p-5">
                      <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{cat.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                      <p className="text-primary font-semibold mt-2">от {cat.priceFrom.toLocaleString("ru")} BYN</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cat.features.map((f) => <span key={f} className="text-xs bg-muted px-2 py-0.5 rounded-full">{f}</span>)}
                      </div>
                    </div>
                  </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
}
