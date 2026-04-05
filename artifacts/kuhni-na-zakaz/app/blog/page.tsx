import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Блог — советы по выбору кухни",
  description: "Советы по выбору кухни, материалов и стилей. Полезные статьи для тех, кто планирует кухню на заказ.",
  alternates: { canonical: "/blog" },
};

const STATIC_POSTS = [
  { slug: "kak-vybrat-kuhnyu", title: "Как выбрать кухню на заказ: 7 вопросов перед заказом", excerpt: "Рассказываем о ключевых вещах, которые нужно продумать до встречи с дизайнером.", category: "Советы", readTime: 6, publishedAt: new Date("2025-12-10") },
  { slug: "skolko-stoit-kuhnya-na-zakaz", title: "Сколько стоит кухня на заказ в Минске: честные цифры", excerpt: "Разбираем из чего складывается цена: материалы, фурнитура, монтаж, доставка.", category: "Цены", readTime: 8, publishedAt: new Date("2025-12-01") },
  { slug: "kuhnya-dlya-malenkoy-kvartiry", title: "Кухня для маленькой квартиры: 10 приёмов дизайнеров", excerpt: "Как сделать кухню функциональной и красивой, если площадь всего 6–9 м².", category: "Дизайн", readTime: 7, publishedAt: new Date("2025-11-20") },
  { slug: "kakie-fasady-luchshe", title: "Какие фасады лучше: МДФ, пластик, эмаль или шпон", excerpt: "Сравниваем популярные материалы для кухонных фасадов по цене, прочности и внешнему виду.", category: "Материалы", readTime: 9, publishedAt: new Date("2025-11-10") },
];

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const display = posts.length > 0 ? posts : STATIC_POSTS;

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Блог</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-4">Блог</h1>
        <p className="text-muted-foreground mb-10">Советы по выбору кухни, материалов и дизайна</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {display.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card-base hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gradient-to-br from-stone-200 to-amber-50 flex items-center justify-center">
                <span className="text-stone-400 text-sm">Иллюстрация статьи</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>{p.category}</Badge>
                  <span className="text-xs text-muted-foreground">{p.readTime} мин</span>
                </div>
                <h2 className="font-serif font-semibold text-xl group-hover:text-primary transition-colors leading-tight mb-2">{p.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                {p.publishedAt && (
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(p.publishedAt).toLocaleDateString("ru-BY", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
