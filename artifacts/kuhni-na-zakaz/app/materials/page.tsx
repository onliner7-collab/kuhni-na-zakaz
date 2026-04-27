import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CheckCircle, XCircle } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";

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

async function getMaterials() {
  try {
    return await prisma.materialPage.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { id: "asc" }] });
  } catch { return []; }
}

export default async function MaterialsPage() {
  const materials = await getMaterials();

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
          </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {materials.map((m) => (
              <Link key={m.slug} href={`/materials/${m.slug}`}
                className="card-base hover:shadow-lg transition-all duration-200 group overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center relative overflow-hidden">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.title}
                      width={720}
                      height={480}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-contain object-center"
                    />
                  ) : (
                    <span className="text-stone-400 text-sm">Образец материала</span>
                  )}
                  {m.budgetLevel && (
                    <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border ${budgetColor[m.budgetLevel] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {m.budgetLevel}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors mb-1">{m.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{m.description}</p>
                  {m.pros.length > 0 && m.cons.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="flex items-start gap-1.5 text-xs text-green-700">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{m.pros[0]}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-red-600">
                        <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{m.cons[0]}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-primary font-semibold text-sm">от {m.priceFrom.toLocaleString("ru")} BYN</span>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Подробнее →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-xl mx-auto">
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
