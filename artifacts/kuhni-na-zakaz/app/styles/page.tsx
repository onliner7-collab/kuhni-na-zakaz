import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Стили кухонь на заказ",
  description: "Кухни на заказ в разных стилях по всей Беларуси: современный, классический, скандинавский, минимализм, лофт. Фото, цены, советы по выбору.",
  alternates: { canonical: "/styles" },
};

export const revalidate = 3600;

const budgetColor: Record<string, string> = {
  Экономный: "bg-green-100 text-green-700 border-green-200",
  Средний: "bg-blue-100 text-blue-700 border-blue-200",
  "Выше среднего": "bg-orange-100 text-orange-700 border-orange-200",
  Премиум: "bg-purple-100 text-purple-700 border-purple-200",
};

async function getStyles() {
  try {
    return await prisma.stylePage.findMany({
      where: { published: true, slug: publicSlugWhere() },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  } catch {
    return [];
  }
}

export default async function StylesPage() {
  const styles = (await getStyles()).filter((item) => isPublicContentSlug(item.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Стили кухонь на заказ",
    itemListElement: styles.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `https://kuhni.minsk.by/styles/${s.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Стили кухонь</span>
          </nav>

          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-4xl font-bold mb-4">Стили кухонь на заказ</h1>
            <p className="text-muted-foreground text-lg">
              Выберите стиль, который вам близок — мы воплотим его в жизнь. Производим кухни по всей Беларуси с выездом замерщика на дом.
            </p>
          </div>

          {styles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {styles.map((s, index) => (
                <Link key={s.slug} href={`/styles/${s.slug}`}
                  className="card-base hover:shadow-lg transition-all duration-200 group overflow-hidden">
                  <div className="h-52 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center relative overflow-hidden">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain object-center"
                      />
                    ) : (
                      <span className="text-stone-400 text-sm">Фото стиля</span>
                    )}
                    {s.budgetLevel && (
                      <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border ${budgetColor[s.budgetLevel] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {s.budgetLevel}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors mb-1">{s.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm">от {s.priceFrom.toLocaleString("ru")} BYN</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Подробнее →</span>
                    </div>
                    {s.pros.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-muted-foreground line-clamp-1">✓ {s.pros[0]}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-16 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-foreground">Стили пока не опубликованы</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Эта зона больше не подменяется статическим списком и ожидает данные из БД.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-2xl font-bold mb-3">Не можете определиться со стилем?</h2>
              <p className="text-muted-foreground mb-6">
                Наш дизайнер поможет подобрать стиль под ваш интерьер и бюджет. Условия консультации уточняются при заявке.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-left">
                {[
                  { step: "01", title: "Оставьте заявку", desc: "Укажите примерный бюджет и площадь кухни" },
                  { step: "02", title: "Консультация", desc: "Дизайнер позвонит в удобное время и задаст вопросы" },
                  { step: "03", title: "3D-проект", desc: "Получите проект кухни с визуализацией после согласования условий" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-3xl font-bold text-primary/30 leading-none">{item.step}</span>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">Получить консультацию</h2>
            <p className="text-center text-muted-foreground mb-6">Расскажите о вашей кухне — ответим в течение часа</p>
            <div className="card-base p-6">
              <ContactForm source="styles-index" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
