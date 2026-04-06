import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, Phone, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/db";
import { ConfigResultActions } from "@/components/sections/ConfigResultActions";

export const metadata: Metadata = {
  title: "Ваша кухня — персональные рекомендации | КухниBY",
  description: "Персональный подбор стиля, материалов и проектов по результатам вашего конфигуратора.",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

// Extract first matching tag value
function tagVal(tags: string[], prefix: string): string | undefined {
  return tags.find(t => t.startsWith(prefix + ":"))?.split(":")[1];
}

// Map config tag values → DB slugs/values
const STYLE_SLUG: Record<string, string> = {
  modern: "sovremennye", scandinavian: "skandinavskie", minimalist: "minimalizm",
  loft: "loft", classic: "klassicheskie", provence: "provansskie",
};
const MATERIAL_SLUG: Record<string, string> = {
  mdf_film: "mdf", plastic_acrylic: "plastik", enamel_matte: "emal",
  veneer: "shpon", solid_wood: "massiv",
};
const BUDGET_LEVEL: Record<string, string> = {
  economy: "Экономный", standard: "Средний", comfort: "Выше среднего", premium: "Премиум",
};

// Build calculator URL from answers
function calcUrl(params: Record<string, string>): string {
  const map: Record<string, string> = {
    layout: params.layout === "island" ? "with_island" :
            params.layout === "u_shape" ? "u_shape" :
            params.layout === "corner" ? "corner" : "straight",
    style: params.style ?? "modern",
    material: tagVal((params.tags ?? "").split(","), "material") ?? "mdf_film",
    area: params.area === "small" ? "8" : params.area === "large" ? "18" : params.area === "xlarge" ? "24" : "12",
  };
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(map)) q.set(k, v);
  return "/calculator?" + q.toString();
}

export default async function ConfigureResultPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tagsRaw = sp.tags ?? "";
  const tags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : [];

  // Extract signals
  const styleKey = tagVal(tags, "style");       // e.g. "scandinavian"
  const budgetKey = tagVal(tags, "budget");     // e.g. "standard"
  const materialKey = tagVal(tags, "material"); // e.g. "veneer"
  const layoutKey = tagVal(tags, "layout");

  // Map to DB values
  const styleSlug = styleKey ? (STYLE_SLUG[styleKey] ?? styleKey) : undefined;
  const materialSlug = materialKey ? (MATERIAL_SLUG[materialKey] ?? materialKey) : undefined;
  const budgetDbLabel = budgetKey ? (BUDGET_LEVEL[budgetKey] ?? undefined) : undefined;

  // Fetch matching styles (by DB slug, fall back to top 2)
  const styleMatches = await prisma.stylePage.findMany({
    where: { published: true, ...(styleSlug ? { slug: styleSlug } : {}) },
    orderBy: { order: "asc" },
    take: styleSlug ? 2 : 2,
  });

  // Fetch matching materials (exact slug first, then by budget level)
  let materialMatches = materialSlug
    ? await prisma.materialPage.findMany({ where: { published: true, slug: materialSlug }, take: 1 })
    : [];
  if (materialMatches.length < 3) {
    const extra = await prisma.materialPage.findMany({
      where: {
        published: true,
        id: { notIn: materialMatches.map(m => m.id) },
        ...(budgetDbLabel ? { budgetLevel: budgetDbLabel } : {}),
      },
      orderBy: { order: "asc" },
      take: 3 - materialMatches.length,
    });
    materialMatches = [...materialMatches, ...extra];
  }

  // Portfolio cases: match by styleSlug (DB slug)
  const casesWhere = styleSlug
    ? { published: true, OR: [{ styleSlug }, { featured: true }] }
    : { published: true, featured: true };
  const cases = await prisma.portfolioCase.findMany({
    where: casesWhere,
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    take: 3,
  });

  // Human-readable summary
  const summaryParts: string[] = [];
  if (layoutKey) summaryParts.push({ straight: "прямая", corner: "угловая", u_shape: "П-образная", island: "с островом" }[layoutKey] ?? layoutKey);
  if (styleKey) summaryParts.push({ modern: "современный стиль", scandinavian: "скандинавский стиль", minimalist: "минимализм", loft: "лофт", classic: "классика", provence: "прованс" }[styleKey] ?? styleKey);
  if (budgetKey) summaryParts.push({ economy: "эконом-уровень", standard: "стандарт", comfort: "комфорт-класс", premium: "премиум" }[budgetKey] ?? budgetKey);

  const hasTags = tags.length > 0;

  // Build label for saved config
  const labelParts: string[] = [];
  if (layoutKey) labelParts.push({ straight: "Прямая", corner: "Угловая", u_shape: "П-образная", island: "С островом" }[layoutKey] ?? layoutKey);
  if (styleKey) labelParts.push({ modern: "Современная", scandinavian: "Скандинавская", minimalist: "Минималистичная", loft: "Лофт", classic: "Классика", provence: "Прованс" }[styleKey] ?? styleKey);
  if (budgetKey) labelParts.push({ economy: "Эконом", standard: "Стандарт", comfort: "Комфорт", premium: "Премиум" }[budgetKey] ?? budgetKey);
  const configLabel = labelParts.join(" · ");

  const configData = {
    answers: Object.fromEntries(Object.entries(sp).filter(([k]) => k !== "tags")) as Record<string, string>,
    tags,
    styleSlug: styleSlug ?? "",
    materialSlug: materialSlug ?? "",
    scenarioSlug: "",
    budgetLevel: budgetKey ?? "",
    label: configLabel || "Мой вариант кухни",
  };

  return (
    <div className="section-padding">
      <div className="container-site max-w-4xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <Link href="/configure" className="hover:text-primary">Подбор кухни</Link>
          <span>/</span>
          <span className="text-foreground">Ваши рекомендации</span>
        </nav>

        {/* Hero result */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Подбор готов
          </div>
          <h1 className="font-serif text-4xl font-bold mb-3">Ваши рекомендации</h1>
          {hasTags && summaryParts.length > 0 && (
            <p className="text-muted-foreground text-lg">
              Исходя из ваших ответов: <strong className="text-foreground">{summaryParts.join(", ")}</strong>
            </p>
          )}
          {!hasTags && (
            <p className="text-muted-foreground">Общие рекомендации — пройдите конфигуратор для персональных результатов</p>
          )}
        </div>

        {/* Personalization panel: save / send */}
        {hasTags && (
          <div className="max-w-xl mx-auto mb-10">
            <ConfigResultActions configData={configData} />
          </div>
        )}

        <div className="space-y-12">
          {/* Стили */}
          {styleMatches.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-bold">
                  {styleKey ? "Рекомендуемый стиль" : "Популярные стили"}
                </h2>
                <Link href="/styles" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Все стили <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {styleMatches.map(style => (
                  <Link key={style.id} href={`/styles/${style.slug}`}
                    className="card-base p-5 hover:border-primary/30 hover:shadow-md transition-all group">
                    {style.image && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-gray-100">
                        <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{style.title}</h3>
                        {style.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{style.description}</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {style.budgetLevel && (
                      <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {style.budgetLevel}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Материалы */}
          {materialMatches.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-bold">
                  {budgetDbLabel ? `Материалы — ${budgetDbLabel}` : "Рекомендуемые материалы"}
                </h2>
                <Link href="/materials" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Все материалы <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {materialMatches.map(mat => (
                  <Link key={mat.id} href={`/materials/${mat.slug}`}
                    className="card-base p-4 hover:border-primary/30 hover:shadow-md transition-all group">
                    {mat.image && (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img src={mat.image} alt={mat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-foreground">{mat.title}</h3>
                    {mat.budgetLevel && (
                      <span className="inline-block mt-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {mat.budgetLevel}
                      </span>
                    )}
                    {mat.description && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{mat.description}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Похожие кейсы */}
          {cases.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-bold">Похожие реализованные проекты</h2>
                <Link href="/portfolio" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Всё портфолио <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {cases.map(c => (
                  <Link key={c.id} href={`/portfolio/${c.slug}`}
                    className="card-base overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
                    {c.mainImage && (
                      <div className="w-full h-40 bg-gray-100 overflow-hidden">
                        <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{c.city} · {c.area} м²</p>
                      {c.priceFrom > 0 && (
                        <p className="text-xs text-primary font-semibold mt-1">
                          от {c.priceFrom.toLocaleString("ru")} BYN
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA block */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="card-base p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">Хотите точную стоимость?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Перейдите в калькулятор — мы уже предзаполнили его вашими ответами.
              </p>
              <Link href={calcUrl(sp)}
                className="flex items-center gap-2 justify-center py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                Открыть калькулятор <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="card-base p-6">
              <h3 className="font-semibold text-foreground mb-2">Заказать бесплатный замер</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Замерщик приедет, оценит объём работ и даст точную смету.
              </p>
              <Link href="/contacts#form"
                className="flex items-center gap-2 justify-center py-2.5 px-4 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors">
                <Phone className="w-4 h-4" /> Связаться с нами
              </Link>
            </div>
          </section>

          {/* Redo */}
          <div className="text-center pt-2">
            <Link href="/configure"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Пройти заново
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
