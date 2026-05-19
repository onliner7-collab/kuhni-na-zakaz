import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaterialsGallerySection } from "@/components/sections/MaterialsGallerySection";
import { MaterialsCardsGrid } from "@/components/sections/MaterialsCardsGrid";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Материалы для кухонных фасадов",
  description: "Материалы для кухонных фасадов по всей Беларуси: МДФ плёнка, пластик HPL, эмаль матовая, шпон, ЛДСП EGGER. Цены, плюсы и минусы каждого.",
  alternates: { canonical: "/materials" },
};

const budgetColor: Record<string, string> = {
  "Экономный": "bg-green-100 text-green-700 border-green-200",
  "Средний": "bg-blue-100 text-blue-700 border-blue-200",
  "Выше среднего": "bg-orange-100 text-orange-700 border-orange-200",
  "Премиум": "bg-purple-100 text-purple-700 border-purple-200",
};

const featuredMaterialPages = [
  {
    href: "/materials/mdf-fasady",
    title: "МДФ фасады",
    description: "Фасады с пленкой, эмалью, пластиком и вариантами фрезеровки для разных стилей кухни.",
    image: "/uploads/seo-showcase/kuhnya-mdf-emal-1.webp",
    alt: "Кухня на заказ с фасадами МДФ в светлом современном интерьере",
  },
  {
    href: "/materials/ldsp",
    title: "ЛДСП",
    description: "Корпуса, простые фасады и бюджетные кухни с честным разбором плюсов и ограничений.",
    image: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Светлая прямая кухня на заказ с простыми гладкими фасадами",
  },
  {
    href: "/materials/plastik-hpl",
    title: "Пластик HPL",
    description: "Практичные гладкие фасады для ежедневного использования, матовых и декоративных решений.",
    image: "/uploads/seo-showcase/kuhnya-plastik-hpl-1.webp",
    alt: "Кухня с пластиковыми фасадами HPL в современном стиле",
  },
];

async function getMaterials() {
  try {
    return await prisma.materialPage.findMany({ where: { published: true, slug: publicSlugWhere() }, orderBy: [{ order: "asc" }, { id: "asc" }] });
  } catch { return []; }
}

export default async function MaterialsPage() {
  const materials = (await getMaterials()).filter((item) => isPublicContentSlug(item.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Материалы для кухонных фасадов",
    itemListElement: materials.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.title,
      url: `https://kuhni.minsk.by/materials/${m.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">Материалы</span>
          </nav>

          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-4xl font-bold mb-4">Материалы для кухонных фасадов</h1>
            <p className="text-muted-foreground text-lg">
              Сравните материалы по цене, прочности и уходу. Поможем выбрать оптимальный вариант под ваш бюджет и образ жизни.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              <Link href="/design-proekt-kuhni" className="font-semibold text-primary hover:underline">
                Посмотрите, как выбранные фасады и столешница будут выглядеть в 3D-проекте
              </Link>
              : так проще оценить сочетание цвета, фактуры и планировки до запуска кухни в производство.
            </p>
          </div>

          <section className="mb-12" aria-labelledby="featured-material-pages-heading">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="featured-material-pages-heading" className="font-serif text-2xl font-bold">Подробные гиды по материалам</h2>
                <p className="mt-1 text-sm text-muted-foreground">Отдельные страницы для сравнения фасадов, корпусов, бюджета и ухода.</p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredMaterialPages.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={720}
                    height={480}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-[3/2] h-auto w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Читать гид <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <MaterialsGallerySection />

          {/* Quick comparison table */}
          {materials.length > 0 && (
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-4 font-semibold text-gray-600 min-w-[160px]">Материал</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Бюджет</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Цена от</th>
                    <th className="text-left p-4 font-semibold text-gray-600 min-w-[180px]">Главный плюс</th>
                    <th className="text-left p-4 font-semibold text-gray-600 min-w-[160px]">Главный минус</th>
                    <th className="text-right p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, i) => (
                    <tr key={m.slug} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="p-4 font-semibold text-gray-900">{m.title.split(" ").slice(0, 2).join(" ")}</td>
                      <td className="p-4">
                        {m.budgetLevel && (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${budgetColor[m.budgetLevel] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {m.budgetLevel}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-700 font-medium">{m.priceFrom > 0 ? `${m.priceFrom.toLocaleString("ru")} BYN` : "—"}</td>
                      <td className="p-4 text-gray-600 text-xs">{m.pros[0] || "—"}</td>
                      <td className="p-4 text-gray-600 text-xs">{m.cons[0] || "—"}</td>
                      <td className="p-4 text-right">
                        <Link href={`/materials/${m.slug}`} className="text-primary text-xs font-medium hover:underline">Подробнее</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cards grid */}
          <MaterialsCardsGrid materials={materials} budgetColor={budgetColor} />

          {/* CTA */}
          <div id="form" className="max-w-xl mx-auto scroll-mt-24">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">Не знаете какой материал выбрать?</h2>
            <p className="text-center text-muted-foreground mb-6">Расскажите о вашей кухне — порекомендуем оптимальный вариант</p>
            <div className="card-base p-6">
              <ContactForm source="materials-index" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
