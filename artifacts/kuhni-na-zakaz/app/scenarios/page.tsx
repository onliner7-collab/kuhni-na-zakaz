import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { STATIC_SCENARIO_FALLBACKS } from "@/data/scenario-fallbacks";
import { ContextSummary, ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import { FamilyHubExplorer } from "@/components/exploration/FamilyHubExplorer";
import { SCENARIO_FAMILY } from "@/data/exploration-families";

export const metadata: Metadata = {
  title: "Сценарии кухни: семья, студия, бюджет",
  description:
    "Подберите кухню под вашу ситуацию: семья с детьми, маленькая площадь, кухня-гостиная, любите готовить, нужна экономия или максимум хранения. Советы и решения.",
  alternates: { canonical: "/scenarios" },
};

const SCENARIO_CANONICAL_PATHS: Record<string, string> = {
  "kuhnya-dlya-studii": "/scenarios/dlya-studii",
};

async function getScenarios() {
  try {
    const scenarios = await prisma.scenarioPage.findMany({
      where: { published: true, slug: publicSlugWhere() },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { slug: true, icon: true, badge: true, title: true, intro: true },
    });
    const seen = new Set(scenarios.map((item) => item.slug));
    return [
      ...scenarios,
      ...STATIC_SCENARIO_FALLBACKS.filter((item) => !seen.has(item.slug)).map((item) => ({
        slug: item.slug,
        icon: item.icon,
        badge: item.badge,
        title: item.title,
        intro: item.intro,
      })),
    ].sort((a, b) => {
      const aOrder = STATIC_SCENARIO_FALLBACKS.find((item) => item.slug === a.slug)?.order ?? 999;
      const bOrder = STATIC_SCENARIO_FALLBACKS.find((item) => item.slug === b.slug)?.order ?? 999;
      return aOrder - bOrder;
    });
  } catch {
    return STATIC_SCENARIO_FALLBACKS.map((item) => ({
      slug: item.slug,
      icon: item.icon,
      badge: item.badge,
      title: item.title,
      intro: item.intro,
    }));
  }
}

export default async function ScenariosPage() {
  const scenarios = (await getScenarios()).filter((item) => isPublicContentSlug(item.slug));
  const explorerOptions = scenarios.flatMap((scenario) => {
    const config = SCENARIO_FAMILY[scenario.slug];
    const visual = config?.visualFrames?.[0] ?? config?.visual;
    return config && visual ? [{ slug: scenario.slug, label: scenario.title, href: `/scenarios/${scenario.slug}`, image: visual.webp, alt: visual.alt, result: config.promise, caution: `${config.constraints[0]} Концепция помогает задать вопросы, но не подтверждает размеры и комплектацию.` }] : [];
  });

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
    <ExploreContextProvider sourceRoute="/scenarios">
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

      {explorerOptions.length ? (
        <section className="bg-background pb-4">
          <div className="container-site space-y-4">
            <FamilyHubExplorer family="scenario" title="Какая жизненная задача для вас главная?" intro="Выберите приоритет: изображение и вывод меняются сразу, а подробная страница помогает проверить ограничения." options={explorerOptions} />
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <ContextSummary />
              <RelatedExplorationRail route="/scenarios" state="RESULT" />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding bg-background">
        <div className="container-site">
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((s) => (
                <Link
                  key={s.slug}
                  href={SCENARIO_CANONICAL_PATHS[s.slug] ?? `/scenarios/${s.slug}`}
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
    </ExploreContextProvider>
  );
}
