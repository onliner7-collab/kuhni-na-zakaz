import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Lightbulb, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";

type Props = { params: Promise<{ slug: string }> };

async function getScenario(slug: string) {
  try {
    return await prisma.scenarioPage.findUnique({ where: { slug, published: true } });
  } catch { return null; }
}

async function getRelatedData(scenario: {
  relatedCaseSlugs: string[];
  relatedStyles: string[];
  relatedMaterials: string[];
}) {
  try {
    const [cases, styles, materials] = await Promise.all([
      scenario.relatedCaseSlugs.length > 0
        ? prisma.portfolioCase.findMany({
            where: { slug: { in: scenario.relatedCaseSlugs }, published: true },
            select: { id: true, slug: true, title: true, city: true, area: true, priceFrom: true, priceTo: true, mainImage: true, style: true },
          })
        : [],
      scenario.relatedStyles.length > 0
        ? prisma.stylePage.findMany({
            where: { slug: { in: scenario.relatedStyles }, published: true },
            select: { id: true, slug: true, title: true, description: true, image: true, priceFrom: true },
          })
        : [],
      scenario.relatedMaterials.length > 0
        ? prisma.materialPage.findMany({
            where: { slug: { in: scenario.relatedMaterials }, published: true },
            select: { id: true, slug: true, title: true, description: true, image: true, priceFrom: true },
          })
        : [],
    ]);
    return { cases, styles, materials };
  } catch { return { cases: [], styles: [], materials: [] }; }
}

export async function generateStaticParams() {
  try {
    const scenarios = await prisma.scenarioPage.findMany({ where: { published: true }, select: { slug: true } });
    return scenarios.map((s) => ({ slug: s.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getScenario(slug);
  if (!s) return { title: "Сценарий не найден" };
  return {
    title: s.seoTitle || `${s.title} — кухня на заказ | КухниBY`,
    description: s.seoDescription || s.intro.slice(0, 155),
    keywords: s.seoKeywords || undefined,
    alternates: { canonical: `/scenarios/${s.slug}` },
  };
}

export default async function ScenarioDetailPage({ params }: Props) {
  const { slug } = await params;
  const scenario = await getScenario(slug);
  if (!scenario) notFound();

  const { cases, styles, materials } = await getRelatedData(scenario);

  const features = Array.isArray(scenario.features)
    ? (scenario.features as { icon: string; title: string; description: string }[])
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: scenario.headline || scenario.title,
    description: scenario.seoDescription || scenario.intro,
    url: `https://kuhniby.by/scenarios/${scenario.slug}`,
    publisher: { "@type": "Organization", name: "КухниBY" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://kuhniby.by" },
        { "@type": "ListItem", position: 2, name: "Как выбрать кухню", item: "https://kuhniby.by/scenarios" },
        { "@type": "ListItem", position: 3, name: scenario.title, item: `https://kuhniby.by/scenarios/${scenario.slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section
        className="py-16 lg:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1060 50%, #0f1a3d 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 50%, #7C3AED, transparent)" }} />
        <div className="container-site relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
            <Link href="/" className="hover:text-white/80 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/scenarios" className="hover:text-white/80 transition-colors">Как выбрать кухню</Link>
            <span>/</span>
            <span className="text-white/70">{scenario.title}</span>
          </nav>
          <div className="max-w-3xl">
            {scenario.badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-violet-200 border border-violet-500/30 mb-4">
                {scenario.badge}
              </span>
            )}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-6xl">{scenario.icon}</span>
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                {scenario.headline || scenario.title}
              </h1>
            </div>
            {scenario.intro && (
              <p className="text-white/65 text-lg leading-relaxed max-w-2xl">{scenario.intro}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={scenario.ctaHref || "/contacts#form"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                {scenario.ctaText || "Заказать бесплатный замер"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                Смотреть работы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEEDS */}
      {scenario.needs.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-6">
                  Что важно для вас?
                </h2>
                <div className="space-y-3">
                  {scenario.needs.map((need, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground text-base">{need}</p>
                    </div>
                  ))}
                </div>
              </div>
              {scenario.solutions.length > 0 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-6">
                    Как мы решаем это
                  </h2>
                  <div className="space-y-3">
                    {scenario.solutions.map((sol, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <span className="text-primary font-black text-sm w-6 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                        <p className="text-foreground text-sm leading-relaxed">{sol}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl lg:text-3xl font-black text-foreground text-center mb-10">
              Ключевые особенности этой кухни
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED CASES */}
      {cases.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">Примеры таких кухонь</h2>
              <Link href="/portfolio" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Все работы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cases.map((c) => (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all bg-white">
                  <div className="h-52 overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                    {c.mainImage
                      ? <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">{scenario.icon}</div>
                    }
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} п.м</p>
                    {c.priceFrom > 0 && (
                      <p className="text-primary font-bold text-sm mt-1">
                        от {c.priceFrom.toLocaleString("ru")} BYN
                        {c.priceTo > 0 && ` — ${c.priceTo.toLocaleString("ru")} BYN`}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED STYLES */}
      {styles.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl font-black text-foreground mb-8">Подходящие стили</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {styles.map((s) => (
                <Link key={s.id} href={`/styles/${s.slug}`} className="group flex gap-4 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg bg-white transition-all">
                  {s.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                    {s.priceFrom > 0 && <p className="text-primary text-sm font-semibold mt-1">от {s.priceFrom.toLocaleString("ru")} BYN</p>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED MATERIALS */}
      {materials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <h2 className="text-2xl font-black text-foreground mb-8">Рекомендуемые материалы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {materials.map((m) => (
                <Link key={m.id} href={`/materials/${m.slug}`} className="group flex gap-4 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg bg-white transition-all">
                  {m.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                    {m.priceFrom > 0 && <p className="text-primary text-sm font-semibold mt-1">от {m.priceFrom.toLocaleString("ru")} BYN</p>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIPS */}
      {scenario.tips.length > 0 && (
        <section
          className="section-padding"
          style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 60%, #0c1a30 100%)" }}
        >
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-black text-white text-center mb-8">
              Советы и лайфхаки
            </h2>
            <div className="space-y-4">
              {scenario.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OTHER SCENARIOS */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground">Другие сценарии</h2>
            <Link href="/scenarios" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Все сценарии <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <OtherScenariosSection currentSlug={slug} />
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section-padding bg-muted/30">
        <div className="container-site max-w-2xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-2">Обсудить вашу кухню</h2>
          <p className="text-center text-muted-foreground mb-8">
            Расскажите о своей ситуации — подберём решение и назначим замер. Бесплатно.
          </p>
          <ContactForm source={`scenario-${slug}`} />
        </div>
      </section>
    </>
  );
}

async function OtherScenariosSection({ currentSlug }: { currentSlug: string }) {
  let others: { slug: string; icon: string; title: string }[] = [];
  try {
    others = await prisma.scenarioPage.findMany({
      where: { published: true, slug: { not: currentSlug } },
      orderBy: [{ order: "asc" }],
      take: 3,
      select: { slug: true, icon: true, title: true },
    });
  } catch {}

  if (others.length === 0) {
    others = [
      { slug: "semya-s-detmi", icon: "👨‍👩‍👧‍👦", title: "Кухня для семьи с детьми" },
      { slug: "malenkaya-kukhnya", icon: "📐", title: "Маленькая кухня" },
      { slug: "lyublyu-gotovit", icon: "👨‍🍳", title: "Кухня для тех, кто любит готовить" },
    ].filter((s) => s.slug !== currentSlug);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {others.map((s) => (
        <Link
          key={s.slug}
          href={`/scenarios/${s.slug}`}
          className="group flex items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:bg-primary/5 transition-all"
        >
          <span className="text-3xl">{s.icon}</span>
          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex-1">{s.title}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}
