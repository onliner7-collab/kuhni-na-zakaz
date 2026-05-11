import type { Metadata } from "next";
import Link from "next/link";
import { resolveCatalogCategoryImage } from "@/lib/catalog-category-images";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Каталог кухонь на заказ",
  description: "Каталог кухонь на заказ: угловые, прямые, П-образные, с островом, маленькие. Цены от 900 BYN. Доставка и монтаж по всей Беларуси.",
  alternates: { canonical: "/catalog" },
};

const DEFAULT_CATEGORIES = [
  { slug: "kuhni-bez-ruchek", title: "Кухни без ручек", description: "Лаконичный современный дизайн. Нажимные механизмы или J-профиль.", priceFrom: 2000, features: ["Чистый дизайн", "Удобный уход", "Современность"] },
  { slug: "kuhni-do-potolka", title: "Кухни до потолка", description: "С фасадами до самого потолка — максимум хранения и строгий вид.", priceFrom: 2200, features: ["Максимум высоты", "Нет пыли", "Монолитный вид"] },
  { slug: "malenkie-kuhni", title: "Маленькие кухни", description: "Кухни до 2 п.м. Оптимальные решения для квартир-студий.", priceFrom: 900, features: ["Компактность", "Встроенная техника", "Вертикальное хранение"] },
  { slug: "kuhni-s-ostrovom", title: "Кухни с островом", description: "Для открытых пространств. Остров совмещает рабочую зону и общение.", priceFrom: 4500, features: ["Барная стойка", "Доп. рабочие поверхности", "Хранение"] },
  { slug: "p-obraznye-kuhni", title: "П-образные кухни", description: "Максимум рабочего пространства. Идеальны для кухонь от 4 п.м.", priceFrom: 3500, features: ["Максимум хранения", "Большая рабочая зона", "Разделение зон"] },
  { slug: "pryamye-kuhni", title: "Прямые кухни", description: "Классика кухонного дизайна. Подходят для узких помещений и студий.", priceFrom: 1200, features: ["Простой монтаж", "Лаконичность", "Узкие кухни"] },
  { slug: "uglovye-kuhni", title: "Угловые кухни", description: "Оптимальное использование угловых зон. Подходят для кухонь от 2 п.м.", priceFrom: 1800, features: ["Эффективный угол", "Вместительность", "Зонирование"] },
];

export default async function CatalogPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
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
            {DEFAULT_CATEGORIES.map((cat, index) => {
              const image = resolveCatalogCategoryImage(cat);

              return (
                <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="card-base hover:shadow-md transition-shadow group">
                  <CatalogCategoryImage src={image.src} alt={image.alt} priority={index === 0} />
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
