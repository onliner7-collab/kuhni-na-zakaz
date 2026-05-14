import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Портфолио кухонь на заказ — реальные проекты",
  description: "Реализованные проекты кухонь на заказ в Минске и Минской области. Фото, площадь, цена, сроки.",
  alternates: { canonical: "/portfolio" },
};

const STATIC_CASES = [
  { slug: "uglovaya-kuhnya-minsk-kirova", title: "Угловая кухня в стиле минимализм", city: "Минск, ул. Кирова", area: 14, style: "Минимализм", priceFrom: 2800, priceTo: 3200, days: 21 },
  { slug: "pryamaya-kuhnya-borisov", title: "Прямая кухня в скандинавском стиле", city: "Борисов", area: 10, style: "Скандинавский", priceFrom: 1800, priceTo: 2100, days: 18 },
  { slug: "kuhnya-s-ostrovom-minsk-partizansky", title: "Кухня с островом — проект для новостройки", city: "Минск, Партизанский р-н", area: 22, style: "Современный", priceFrom: 5500, priceTo: 6200, days: 30 },
  { slug: "klassicheskaya-kuhnya-molodechno", title: "Классическая кухня в частном доме", city: "Молодечно", area: 18, style: "Классический", priceFrom: 4200, priceTo: 4800, days: 28 },
  { slug: "malenkaya-kuhnya-studiya", title: "Кухня для квартиры-студии, 6 м²", city: "Минск, Сухарево", area: 6, style: "Минимализм", priceFrom: 1200, priceTo: 1500, days: 14 },
  { slug: "kuhnya-do-potolka-minsk-vostok", title: "Кухня до потолка — максимум хранения", city: "Минск, Восток", area: 12, style: "Современный", priceFrom: 3100, priceTo: 3600, days: 24 },
];

async function getCases() {
  try {
    return await prisma.portfolioCase.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const cases = await getCases();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Портфолио</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-4">Наши работы</h1>
        <p className="text-muted-foreground mb-10">Реализованные проекты кухонь в Минске и Минской области</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(cases.length > 0 ? cases : STATIC_CASES).map((c) => (
            <Link key={c.slug} href={`/portfolio/${c.slug}`} className="card-base hover:shadow-md transition-shadow group">
              <div className="h-56 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center overflow-hidden">
                {"mainImage" in c && typeof c.mainImage === "string" && c.mainImage ? (
                  <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-stone-400 text-sm">Фото проекта</span>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-serif font-semibold group-hover:text-primary transition-colors">{c.title}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span>{c.city}</span>
                  <span>{c.area} м²</span>
                  <span>{c.style}</span>
                  <span>{c.days} дн.</span>
                </div>
                <p className="text-primary font-semibold text-sm mt-2">
                  {c.priceFrom.toLocaleString("ru")}–{c.priceTo.toLocaleString("ru")} BYN
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
