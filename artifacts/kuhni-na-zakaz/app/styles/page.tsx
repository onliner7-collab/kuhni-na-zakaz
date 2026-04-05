import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Стили кухонь на заказ — современные, классические, скандинавские",
  description: "Кухни на заказ в разных стилях: современный, классический, скандинавский, минимализм, лофт. Фото и цены.",
  alternates: { canonical: "/styles" },
};

const STATIC_STYLES = [
  { slug: "sovremennye", title: "Современные кухни", description: "Чёткие линии, функциональность и минимум декора. Идеально для тех, кто ценит порядок и технологии.", priceFrom: 1800 },
  { slug: "klassicheskie", title: "Классические кухни", description: "Фасады с фрезеровкой, декоративные карнизы, натуральные материалы. Вне времени и моды.", priceFrom: 3500 },
  { slug: "skandinavskie", title: "Скандинавские кухни", description: "Белые фасады, дерево, натуральный текстиль. Светло, уютно и практично.", priceFrom: 2000 },
  { slug: "minimalizm", title: "Кухни в стиле минимализм", description: "Только необходимое, ничего лишнего. Скрытые ручки, встроенная техника, монохром.", priceFrom: 2200 },
  { slug: "loft", title: "Кухни в стиле лофт", description: "Открытый бетон, металл, кирпич. Брутальная эстетика с промышленным характером.", priceFrom: 2500 },
];

async function getStyles() {
  try {
    return await prisma.stylePage.findMany({ where: { published: true }, orderBy: { id: "asc" } });
  } catch {
    return [];
  }
}

export default async function StylesPage() {
  const styles = await getStyles();
  const display = styles.length > 0 ? styles : STATIC_STYLES;

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Стили</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-4">Стили кухонь</h1>
        <p className="text-muted-foreground mb-10">Выберите стиль — мы воплотим его в вашей кухне</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((s) => (
            <Link key={s.slug} href={`/styles/${s.slug}`} className="card-base hover:shadow-md transition-shadow group">
              <div className="h-52 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center">
                <span className="text-stone-400 text-sm">Фото стиля</span>
              </div>
              <div className="p-5">
                <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{s.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                <p className="text-primary font-semibold mt-2 text-sm">от {s.priceFrom.toLocaleString("ru")} BYN</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
