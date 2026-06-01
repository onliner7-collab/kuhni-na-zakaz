import type { Metadata } from "next";
import Link from "next/link";
import { resolveCatalogCategoryImage } from "@/lib/catalog-category-images";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Купить кухни в Минске: модульные, Стиль Хаус",
  description: "Каталог кухонь на заказ: угловые, прямые, П-образные, с островом, маленькие. Цены от 900 BYN. Доставка и монтаж по всей Беларуси.",
  alternates: { canonical: "/catalog" },
};

export const revalidate = 3600;

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
          <section className="mt-12 border-t border-border pt-8">
            <div className="max-w-4xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h2 className="font-serif text-2xl font-bold text-foreground">Как выбрать кухню по каталогу</h2>
              <p>
                В каталоге можно купить кухню под размеры квартиры или дома: прямую, угловую, до потолка,
                с островом или компактную для студии. Минск остается основным направлением, но работаем и по
                регионам: доставка по Беларуси согласуется заранее, а цена зависит от материалов, фурнитуры,
                столешницы и монтажа.
              </p>
              <p>
                Если вы ищете кухни модульные купить Минск, важно понимать разницу: модульный формат удобен
                для быстрой комплектации, но модульный набор не всегда закрывает нестандартные размеры. Мы
                можем рассчитать модульный вариант, показать фото похожих решений и предложить индивидуальный
                проект, где стиль, хранение и цена согласованы до запуска.
              </p>
              <p>
                Для запросов вроде стиль хаус кухни официальный сайт, официальный сайт кухонь Стиль Хаус или
                официальный сайт производителя мы не выдаем себя за другой бренд. Этот сайт КухниBY помогает
                сравнить стиль, фото, цену и комплектацию, а также купить кухню в рассрочку с доставкой по
                Беларуси, если рассрочка подходит под условия заказа и сравнение со Стиль Хаус нужно только
                как ориентир по формату.
              </p>
              <p>
                Можно купить кухню в рассрочку с доставкой по Беларуси для Минска и других городов: Минск,
                Борисов, Гомель и ближайшие районы обсуждаются по адресу. Рассрочка рассчитывается после
                комплектации, доставка зависит от маршрута, а цена фиксируется в смете после замера.
                Рассрочка возможна только после согласования состава заказа.
              </p>
              <p>
                Если нужен запрос купить кухню в Борисове фото и цены, смотрите карточки каталога и городскую
                страницу Борисов: там проще сопоставить фото, цена по категории и условия выезда. Для Гомель
                также можно рассчитать проект удаленно: Гомель, Гомельская область и направление на Гомель
                обсуждаем по составу кухни и срокам доставки.
              </p>
              <p>
                Запрос купить кухню Мила в Гомеле часто связан с поиском готовых решений. Мы не являемся
                брендом Мила, но можем сравнить стиль Мила, формат Мила и ожидания по цене с индивидуальной
                кухней на заказ: покажем фото, предложим материалы и объясним, где выгоднее купить готовый
                вариант, а где лучше заказывать проект под помещение.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
