import type { Metadata } from "next";
import Link from "next/link";
import { resolveCatalogCategoryImage } from "@/lib/catalog-category-images";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/schema-org";
import { regionalLocations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Купить кухню в Минске: каталог кухонь на заказ",
  description: "Каталог кухонь на заказ в Минске: угловые, прямые, маленькие, до потолка и с островом. Расчет под размеры, доставка и монтаж.",
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

const BUYING_GUIDE_ROWS = [
  { type: "Угловая кухня", fit: "типовая квартира, кухня 6-12 м², нужна рабочая зона в углу", href: "/catalog/uglovye-kuhni" },
  { type: "Прямая кухня", fit: "узкое помещение, студия, ограниченный бюджет или одна свободная стена", href: "/catalog/pryamye-kuhni" },
  { type: "П-образная кухня", fit: "просторная кухня или дом, где нужно много столешницы и хранения", href: "/catalog/p-obraznye-kuhni" },
  { type: "Маленькая кухня", fit: "хрущевка, гостинка, студия или помещение со сложными нишами", href: "/catalog/malenkie-kuhni" },
  { type: "Кухня до потолка", fit: "нужно больше хранения и аккуратный встроенный вид без зазора сверху", href: "/catalog/kuhni-do-potolka" },
  { type: "Кухня с островом", fit: "кухня-гостиная, частный дом или большая новостройка с проходами от 100 см", href: "/catalog/kuhni-s-ostrovom" },
];

const COMMERCIAL_PROOF_ITEMS = [
  {
    title: "Смета до запуска",
    text: "До производства фиксируем планировку, материалы, фурнитуру, доставку и монтаж. Так проще сравнить варианты и не потерять важные позиции.",
  },
  {
    title: "Проект под технику",
    text: "Проверяем мойку, плиту, холодильник, посудомоечную машину, вытяжку и розетки до утверждения модулей.",
  },
  {
    title: "Договор и гарантия",
    text: "Условия работ, сроки, комплектация и гарантийные обязательства прописываются письменно.",
  },
];

const CATALOG_FAQ = [
  {
    question: "Можно ли купить кухню в Минске с установкой?",
    answer: "Да. После замера и согласования проекта рассчитываем изготовление, доставку по Минску и монтаж. Установка входит в смету отдельной строкой, чтобы было понятно, за что вы платите.",
  },
  {
    question: "Можно ли купить кухню недорого, но под размер?",
    answer: "Можно, если выбрать простую планировку, практичные фасады и фурнитуру без дорогих механизмов. Даже бюджетную кухню лучше считать по реальным размерам, а не подгонять готовые модули на месте.",
  },
  {
    question: "Какая кухня дешевле: прямая или угловая?",
    answer: "Обычно прямая дешевле: в ней нет углового узла, проще столешница и монтаж. Угловая дороже, но часто дает больше хранения и рабочей поверхности в типовой квартире.",
  },
];

const PRIORITY_CITY_SLUGS = [
  "borisov",
  "zhodino",
  "molodechno",
  "soligorsk",
  "slutsk",
  "fanipol",
  "smolevichi",
  "dzerzhinsk",
  "zaslavl",
  "logoisk",
  "vileyka",
  "nesvizh",
];

export default async function CatalogPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
  ]);
  const faqJsonLdData = faqJsonLd(CATALOG_FAQ);
  const priorityCities = PRIORITY_CITY_SLUGS
    .map((slug) => regionalLocations.find((location) => location.slug === slug))
    .filter((location): location is (typeof regionalLocations)[number] => Boolean(location));

  return (
    <>
      <JsonLd data={faqJsonLdData ? [jsonLd, faqJsonLdData] : jsonLd} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Каталог</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-4">Купить кухню в Минске: каталог кухонь на заказ</h1>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Изготавливаем кухни по индивидуальным размерам. Каждый проект — отдельный дизайн и расчёт.
          </p>
          <section className="mb-12 border-y border-border py-8">
            <div className="max-w-4xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h2 className="font-serif text-2xl font-bold text-foreground">Купить кухню в Минске под размер квартиры или дома</h2>
              <p>
                В каталоге удобно выбрать тип будущей кухни до расчета: угловую, прямую, П-образную, маленькую,
                до потолка или с островом. Готовый гарнитур со склада быстрее купить, но он редко точно попадает
                в размеры ниши, вентиляционный короб, технику и привычки семьи. Кухня на заказ проектируется под
                помещение: замеряем стены, проверяем коммуникации, расставляем мойку, плиту, холодильник и хранение,
                а затем подбираем фасады, столешницу и фурнитуру под бюджет.
              </p>
              <p>
                Если нужно купить кухню в Минске с доставкой и установкой, сначала выбираем планировку и комплектацию,
                после этого фиксируем смету. Цена зависит не только от длины гарнитура: важны материал фасадов,
                количество ящиков, подъемники, угловые механизмы, высота шкафов, столешница и сложность монтажа.
                Поэтому каталог помогает сузить выбор, а точный расчет делаем после размеров и состава проекта.
              </p>
            </div>
          </section>
          <section className="mb-12 rounded-xl border bg-muted/20 p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Готовый гарнитур, модульная кухня или кухня на заказ</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Готовый гарнитур",
                  text: "Подходит, если размеры стандартные и нужно быстро закрыть базовую задачу. Минус — зазоры, компромиссы по технике и слабая привязка к коммуникациям.",
                },
                {
                  title: "Модульная кухня",
                  text: "Можно собрать из типовых секций и удержать бюджет, но шаг модулей редко совпадает с нишами, коробами, подоконником и встроенной техникой.",
                },
                {
                  title: "Кухня на заказ",
                  text: "Проектируется под реальные размеры, хранение, технику и стиль. Это дольше готового варианта, зато меньше подгонки и понятнее итоговая эргономика.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border bg-white p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-12 rounded-xl border bg-white p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Что проверяем перед заказом кухни</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Каталог помогает выбрать формат, но финальная кухня собирается по размерам конкретного помещения.
              Перед запуском проекта важно увидеть не только красивое фото, но и понятную комплектацию, смету и следующий шаг заявки.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {COMMERCIAL_PROOF_ITEMS.map((item) => (
                <div key={item.title} className="rounded-lg border bg-muted/20 p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/prices" className="rounded-lg border px-4 py-2 text-sm font-semibold text-primary hover:bg-muted">
                Сравнить цены
              </Link>
              <Link href="/contacts#form" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                Отправить размеры
              </Link>
            </div>
          </section>
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
            <h2 className="font-serif text-2xl font-bold text-foreground">Какой тип кухни выбрать</h2>
            <div className="mt-5 overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted/70 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Тип кухни</th>
                    <th className="px-4 py-3 font-semibold">Кому подходит</th>
                    <th className="px-4 py-3 font-semibold">Посадочная</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {BUYING_GUIDE_ROWS.map((row) => (
                    <tr key={row.href}>
                      <td className="px-4 py-3 font-medium text-foreground">{row.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.fit}</td>
                      <td className="px-4 py-3">
                        <Link href={row.href} className="font-medium text-primary hover:underline">
                          Смотреть раздел
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="mt-12 rounded-xl border bg-muted/20 p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Каталог для Минска и городов Минской области
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Тип кухни выбирают одинаково: по размерам, технике, хранению и бюджету.
              А вот замер, доставка, занос и монтаж зависят от адреса, поэтому для
              городов сделаны отдельные страницы с условиями работы.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {priorityCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/locations/${city.slug}`}
                  className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <h3 className="font-semibold text-foreground">{city.cityName}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Расчет, замер, доставка и монтаж в {city.cityPrepositional}.
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/locations"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Все города и регионы <span aria-hidden="true">→</span>
            </Link>
          </section>
          <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Частые вопросы о покупке кухни</h2>
              <div className="mt-4 divide-y rounded-xl border">
                {CATALOG_FAQ.map((item) => (
                  <div key={item.question} className="p-5">
                    <h3 className="font-semibold">{item.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Полезные разделы</h2>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {[
                  { href: "/prices", label: "Цены и что влияет на смету" },
                  { href: "/locations/minsk", label: "Кухни на заказ в Минске" },
                  { href: "/locations/minskaya-oblast", label: "Доставка и монтаж по Минской области" },
                  { href: "/portfolio", label: "Портфолио готовых решений" },
                  { href: "/blog/kakuyu-planirovku-kuhni-vybrat", label: "Как выбрать планировку кухни" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg border px-4 py-3 font-medium text-primary hover:bg-muted">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
