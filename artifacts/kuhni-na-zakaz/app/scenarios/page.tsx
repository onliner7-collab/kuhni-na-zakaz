import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Как выбрать кухню под ваши задачи",
  description:
    "Подберите кухню под вашу ситуацию: семья с детьми, маленькая площадь, кухня-гостиная, любите готовить, нужна экономия или максимум хранения. Советы и решения.",
  alternates: { canonical: "/scenarios" },
};

async function getScenarios() {
  try {
    return await prisma.scenarioPage.findMany({
      where: { published: true, slug: publicSlugWhere() },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { slug: true, icon: true, badge: true, title: true, intro: true },
    });
  } catch {
    return [];
  }
}

export default async function ScenariosPage() {
  const scenarios = (await getScenarios()).filter((item) => isPublicContentSlug(item.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Сценарии выбора кухни на заказ",
    itemListElement: scenarios.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `https://kuhni.minsk.by/scenarios/${s.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-14 bg-gradient-to-br from-primary/5 via-violet-50 to-blue-50">
        <div className="container-site">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Как выбрать кухню</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">
              Как выбрать кухню
              <br />{" "}
              <span className="text-primary">именно для вас?</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Не все кухни одинаковые, и не все покупатели хотят одного и того же.
              Выберите свой сценарий, и мы покажем решения, которые подходят именно вам.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-site">
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((s) => (
                <Link
                  key={s.slug}
                  href={`/scenarios/${s.slug}`}
                  className="group relative flex flex-col p-7 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 bg-white transition-all hover:-translate-y-1"
                >
                  {s.badge && (
                    <span className="absolute top-4 right-4 text-xs bg-primary text-white px-2.5 py-1 rounded-full font-semibold">
                      {s.badge}
                    </span>
                  )}
                  <span className="text-5xl mb-4">{s.icon}</span>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {s.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.intro}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm text-primary font-semibold">
                    Смотреть решения
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-foreground">Сценарии пока не опубликованы</p>
              <p className="mt-2 text-sm text-muted-foreground">
                После импорта v1 карточки на этой странице начнут отображаться напрямую из хранилища.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary/5 to-violet-50">
        <div className="container-site max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Не нашли свой сценарий?</h2>
          <p className="text-muted-foreground mb-6">
            Расскажите нам о своей ситуации — подберём решение на консультации без давления.
          </p>
          <Link
            href="/contacts#form"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
          >
            Получить консультацию
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
