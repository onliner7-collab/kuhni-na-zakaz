import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle, Droplets, ArrowRight, Palette, Users, Wallet } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";

interface Props { params: Promise<{ slug: string }> }

async function getMaterial(slug: string) {
  try {
    return await prisma.materialPage.findUnique({ where: { slug, published: true } });
  } catch { return null; }
}

async function getRelatedData(m: Awaited<ReturnType<typeof getMaterial>>) {
  if (!m) return { styles: [], scenarios: [] };
  try {
    const [styles, scenarios] = await Promise.all([
      m.relatedStyles.length > 0
        ? prisma.stylePage.findMany({ where: { slug: { in: m.relatedStyles }, published: true } })
        : Promise.resolve([]),
      m.relatedScenarioSlugs.length > 0
        ? prisma.scenarioPage.findMany({ where: { slug: { in: m.relatedScenarioSlugs }, published: true } })
        : Promise.resolve([]),
    ]);
    return { styles, scenarios };
  } catch { return { styles: [], scenarios: [] }; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMaterial(slug);
  if (!m) return { title: "Материал для кухни" };
  return {
    title: m.seoTitle || `${m.title} — КухниBY`,
    description: m.seoDescription || m.description,
    keywords: m.seoKeywords || undefined,
    alternates: { canonical: `/materials/${slug}` },
  };
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;
  const m = await getMaterial(slug);
  if (!m) notFound();
  const { styles, scenarios } = await getRelatedData(m);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.headline || m.title,
    description: m.seoDescription || m.description,
    name: m.title,
    url: `https://kuhniby.by/materials/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://kuhniby.by" },
        { "@type": "ListItem", position: 2, name: "Материалы", item: "https://kuhniby.by/materials" },
        { "@type": "ListItem", position: 3, name: m.title, item: `https://kuhniby.by/materials/${slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section-padding">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <Link href="/materials" className="hover:text-primary">Материалы</Link><span>/</span>
            <span className="text-foreground">{m.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Hero */}
              <div>
                {m.budgetLevel && (
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    {m.budgetLevel} сегмент
                  </span>
                )}
                <h1 className="font-serif text-4xl font-bold mb-4 leading-tight">
                  {m.headline || m.title}
                </h1>
                <div className="h-64 bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                  {m.image ? (
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-stone-400">Образец материала</span>
                  )}
                </div>
                {m.intro && (
                  <p className="text-muted-foreground leading-relaxed text-lg">{m.intro}</p>
                )}
                {m.content && !m.intro && (
                  <p className="text-muted-foreground leading-relaxed">{m.content}</p>
                )}
              </div>

              {/* Price block */}
              {m.priceFrom > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary text-lg">
                        {m.pricePer || `от ${m.priceFrom.toLocaleString("ru")} BYN`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Точная цена — после бесплатного замера на дому</p>
                  </div>
                  <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
                    Рассчитать стоимость <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Плюсы и минусы */}
              {(m.pros.length > 0 || m.cons.length > 0) && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Плюсы и минусы</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {m.pros.length > 0 && (
                      <div className="card-base p-5">
                        <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> Преимущества
                        </h3>
                        <ul className="space-y-2.5">
                          {m.pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">{i + 1}</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.cons.length > 0 && (
                      <div className="card-base p-5">
                        <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5" /> Недостатки
                        </h3>
                        <ul className="space-y-2.5">
                          {m.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Кому подходит */}
              {m.suitableFor.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Кому подходит</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {m.suitableFor.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Уход */}
              {m.careGuide.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                      <Droplets className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Уход и эксплуатация</h2>
                  </div>
                  <div className="card-base p-5">
                    <ul className="space-y-3">
                      {m.careGuide.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center shrink-0 font-semibold">{i + 1}</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Рекомендуемые стили */}
              {styles.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Palette className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Подходящие стили</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {styles.map((st) => (
                      <Link key={st.slug} href={`/styles/${st.slug}`}
                        className="card-base p-4 flex gap-4 hover:shadow-md transition-shadow group">
                        <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-amber-100 rounded-lg shrink-0 overflow-hidden">
                          {st.image && <img src={st.image} alt={st.title} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{st.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{st.description}</p>
                          <p className="text-xs text-primary font-medium mt-1">от {st.priceFrom.toLocaleString("ru")} BYN</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Сценарии */}
              {scenarios.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Популярные сценарии использования</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scenarios.map((sc) => (
                      <Link key={sc.slug} href={`/scenarios/${sc.slug}`}
                        className="card-base p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-2">
                          {sc.icon && <span className="text-2xl">{sc.icon}</span>}
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{sc.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{sc.intro || sc.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div className="card-base p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
                  <p className="text-sm text-muted-foreground mb-4">Выезд бесплатно. Работаем по всей Беларуси.</p>
                  <ContactForm source={`materials/${slug}`} />
                </div>

                {/* Quick info */}
                <div className="card-base p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Характеристики</h3>
                  {m.budgetLevel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Сегмент</span>
                      <span className="font-medium">{m.budgetLevel}</span>
                    </div>
                  )}
                  {m.priceFrom > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Цена от</span>
                      <span className="font-medium text-primary">{m.priceFrom.toLocaleString("ru")} BYN</span>
                    </div>
                  )}
                  {styles.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Стили</span>
                      <span className="font-medium">{styles.length} варианта</span>
                    </div>
                  )}
                </div>

                {/* Nav */}
                <div className="card-base p-5">
                  <h3 className="font-semibold text-sm mb-3">Другие материалы</h3>
                  <div className="space-y-1">
                    {[
                      { slug: "mdf", title: "МДФ с плёнкой ПВХ" },
                      { slug: "plastik", title: "Пластик HPL / акрил" },
                      { slug: "emal", title: "Эмаль матовая / глянец" },
                      { slug: "shpon", title: "Натуральный шпон" },
                      { slug: "egger", title: "ЛДСП EGGER" },
                    ].filter(l => l.slug !== slug).map(l => (
                      <Link key={l.slug} href={`/materials/${l.slug}`}
                        className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        {l.title}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
