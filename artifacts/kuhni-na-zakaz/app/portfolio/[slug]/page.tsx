import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Lightbulb, MapPin, Palette, Ruler, Square, Star, Wrench } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { PortfolioProjectHeroImage } from "@/components/portfolio/PortfolioProjectHeroImage";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { PortfolioProjectOpenTracker } from "@/components/analytics/PortfolioProjectOpenTracker";
import {
  GENERATED_MINSK_PORTFOLIO_CASES,
  toPortfolioProject,
  type EditablePortfolioCase,
  type PortfolioProject,
} from "@/data/portfolio-projects";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { getImageDisclosure } from "@/lib/image-disclosure";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata, trimMetaDescription } from "@/lib/seo";
import { ReviewStatus } from "@prisma/client";
import { regionalLocations } from "@/data/locations";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import type { PortfolioCase } from "@prisma/client";
import { ExploreContextProvider } from "@/components/exploration";
import { RelatedExplorationRail } from "@/components/exploration/RelatedExplorationRail";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

function createConceptPortfolioCase(
  slug: string,
  title: string,
  mainImage: string,
  kitchenType: string,
  style: string,
): PortfolioCase {
  const now = new Date(0);

  return {
    id: 0,
    externalId: `concept-${slug}`,
    title,
    shortTitle: title,
    slug,
    city: "",
    cityKey: "",
    region: "",
    district: "",
    kitchenType,
    area: 0,
    layout: kitchenType,
    style,
    styleSlug: "",
    color: "",
    material: "",
    materials: [],
    materialSlugs: [],
    scenarioSlugs: [],
    priceFrom: 0,
    priceTo: 0,
    priceNote: "Стоимость зависит от размеров, материалов и комплектации после замера.",
    size: "",
    facades: "",
    countertop: "",
    fittings: "",
    workDuration: "",
    days: 0,
    completedAt: "",
    description:
      "3D-визуализация кухни на заказ: пример планировки, материалов и общего настроения для похожего проекта без привязки к выполненной работе.",
    task: "Показать направление дизайна, которое можно адаптировать под размеры помещения и бюджет.",
    constraints: "",
    solution: "После заявки планировку, материалы и комплектацию нужно пересчитать по точным размерам.",
    result: "",
    features: ["3D-визуализация", "пример дизайна", "без привязки к выполненной работе"],
    relatedLocationSlugs: [],
    mainImage,
    images: [mainImage],
    imageAlts: [`3D-визуализация: ${title}`],
    imageCaptions: ["3D-визуализация, пример дизайна"],
    alt: `3D-визуализация: ${title}`,
    photosBefore: [],
    photosAfter: [],
    reviewIds: [],
    featured: false,
    order: 0,
    seoTitle: `${title}: 3D-визуализация кухни на заказ`,
    seoDescription:
      "3D-визуализация кухни на заказ без привязки к выполненной работе. Пример дизайна для расчёта похожего проекта.",
    seoKeywords: "",
    published: true,
    createdAt: now,
    updatedAt: now,
  };
}

const conceptPortfolioCases: Record<string, PortfolioCase> = {
  "kuhnya-s-ostrovom-minimalizm-005": createConceptPortfolioCase(
    "kuhnya-s-ostrovom-minimalizm-005",
    "Кухня с островом в стиле минимализм",
    "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
    "Кухня с островом",
    "Минимализм",
  ),
  "uglovaya-kuhnya-sovremennaya-001": createConceptPortfolioCase(
    "uglovaya-kuhnya-sovremennaya-001",
    "Угловая кухня в современном стиле",
    "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
    "Угловая кухня",
    "Современный",
  ),
};
const generatedMinskPortfolioCases = Object.fromEntries(
  GENERATED_MINSK_PORTFOLIO_CASES.map((item) => [item.slug, item]),
) as Record<string, PortfolioCase>;

async function getPortfolioCase(slug: string) {
  if (!isPublicContentSlug(slug)) return null;

  return prisma.portfolioCase
    .findFirst({
      where: {
        slug,
        published: true,
      },
    })
    .then((portfolioCase) => portfolioCase ?? conceptPortfolioCases[slug] ?? null)
    .then((portfolioCase) => portfolioCase ?? generatedMinskPortfolioCases[slug] ?? null)
    .catch(() => generatedMinskPortfolioCases[slug] ?? conceptPortfolioCases[slug] ?? null);
}

async function getPortfolioProjects() {
  const cases = await prisma.portfolioCase
    .findMany({
      where: {
        published: true,
        slug: publicSlugWhere(),
        title: { not: "" },
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return [
    ...GENERATED_MINSK_PORTFOLIO_CASES,
    ...cases.filter((portfolioCase) => isPublicContentSlug(portfolioCase.slug)),
  ].map((portfolioCase) => ({
    source: portfolioCase,
    project: toPortfolioProject(portfolioCase as EditablePortfolioCase),
  }));
}

async function getAuxiliaryProjectData(portfolioCase: NonNullable<Awaited<ReturnType<typeof getPortfolioCase>>>) {
  const [style, materials, scenarios, reviews, locationPage] = await Promise.all([
    portfolioCase.styleSlug
      ? prisma.stylePage.findUnique({ where: { slug: portfolioCase.styleSlug, published: true } }).catch(() => null)
      : Promise.resolve(null),
    portfolioCase.materialSlugs.length > 0
      ? prisma.materialPage.findMany({ where: { slug: { in: portfolioCase.materialSlugs }, published: true } }).catch(() => [])
      : Promise.resolve([]),
    portfolioCase.scenarioSlugs.length > 0
      ? prisma.scenarioPage.findMany({ where: { slug: { in: portfolioCase.scenarioSlugs }, published: true } }).catch(() => [])
      : Promise.resolve([]),
    portfolioCase.reviewIds.length > 0
      ? prisma.review.findMany({ where: { id: { in: portfolioCase.reviewIds }, status: ReviewStatus.PUBLISHED } }).catch(() => [])
      : Promise.resolve([]),
    portfolioCase.city
      ? prisma.locationPage
          .findFirst({ where: { city: portfolioCase.city, published: true }, select: { slug: true, city: true, h1: true } })
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  return { style, materials, scenarios, reviews, locationPage };
}

function formatProjectPrice(project: PortfolioProject) {
  return project.price || project.priceNote;
}

function projectNumberFromSlug(slug: string) {
  const match = slug.match(/-(\d{2,})$/);
  return match?.[1] ? `проект №${match[1]}` : "";
}

function portfolioBaseTitle(project: PortfolioProject) {
  return (project.shortTitle || project.title)
    .replace(/,\s*проект №\d{2,}\s*$/i, "")
    .replace(/\s+проект №\d{2,}\s*$/i, "")
    .trim();
}

function normalizePortfolioMetaValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const colorLabels: Record<string, string> = {
    belaya: "белые фасады",
    bezhevaya: "бежевые фасады",
    derevo: "фасады под дерево",
    kombinacii: "комбинированные фасады",
    seraya: "серые фасады",
    zelenaya: "зеленые фасады",
  };
  const lower = trimmed.toLowerCase();

  return colorLabels[lower] ?? trimmed;
}

function isGenericPortfolioPhrase(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() || "";

  return (
    !normalized ||
    normalized.startsWith("краткое описание проекта") ||
    normalized.includes("получился аккуратный визуальный пример кухни") ||
    normalized.includes("можно использовать как ориентир для будущего проекта") ||
    normalized.startsWith("визуальный пример кухни по индивидуальным размерам")
  );
}

function buildMetaDescription(project: PortfolioProject) {
  const projectMarker = projectNumberFromSlug(project.slug);
  const baseTitle = portfolioBaseTitle(project);
  const style = normalizePortfolioMetaValue(project.style);
  const color = normalizePortfolioMetaValue(project.color);
  const size = normalizePortfolioMetaValue(project.size);
  const material = normalizePortfolioMetaValue(
    project.materials.length > 0 ? project.materials[0] : project.facades,
  );
  const location = [normalizePortfolioMetaValue(project.city), normalizePortfolioMetaValue(project.district)]
    .filter(Boolean)
    .join(", ");
  const details = [
    location,
    style ? `стиль ${style}` : "",
    color,
    size,
    material,
  ].filter((item) => item && !isGenericPortfolioPhrase(item));
  const prefix = [baseTitle, projectMarker].filter(Boolean).join(", ");
  const description = `${prefix}: ${details.join(", ")}. Рассчитаем похожую кухню под ваш размер.`;

  return trimMetaDescription(description, description);
}

function buildPortfolioMetaTitle(project: PortfolioProject) {
  const baseTitle = portfolioBaseTitle(project);
  const baseTitleLower = baseTitle.toLowerCase();
  const city = project.city && !baseTitleLower.includes(project.city.toLowerCase()) ? project.city : "";
  const kitchenType = project.kitchenType && !baseTitleLower.includes(project.kitchenType.toLowerCase()) ? project.kitchenType : "";
  const parts = [
    baseTitle,
    city,
    kitchenType,
  ].filter((item) => item && !isGenericPortfolioPhrase(item));
  const title = parts.join(" — ");

  if (title.length < 25 && project.city) return `${baseTitle} в ${project.city} — проект`;
  if (title.length <= 55) return title;

  const compactTitle = [baseTitle, city].filter(Boolean).join(" — ");
  if (compactTitle.length <= 55) return compactTitle;

  return baseTitle.length <= 55 ? baseTitle : `${project.kitchenType || "Кухня на заказ"} — ${project.city || "портфолио"}`;
}

function isGenericPortfolioDescription(description: string | null | undefined) {
  const value = description?.trim().toLowerCase() || "";

  return (
    isGenericPortfolioPhrase(description) ||
    value ===
      "визуальный пример кухни по индивидуальным размерам. точные размеры, материалы, комплектация и бюджет уточняются после замера и согласования проекта."
  );
}

function getRelatedProjects(currentProject: PortfolioProject, projects: PortfolioProject[]) {
  return projects
    .filter((project) => project.slug !== currentProject.slug)
    .map((project) => {
      let score = 0;
      if (project.city === currentProject.city) score += 4;
      if (project.region && project.region === currentProject.region) score += 2;
      if (project.kitchenType && project.kitchenType === currentProject.kitchenType) score += 3;
      if (project.style && project.style === currentProject.style) score += 2;
      if (project.color && project.color === currentProject.color) score += 1;
      if (project.materials.some((material) => currentProject.materials.includes(material))) score += 1;

      return { project, score };
    })
    .sort((left, right) => right.score - left.score || left.project.title.localeCompare(right.project.title, "ru"))
    .slice(0, 6)
    .map(({ project }) => project);
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-b-0">
      <dt className="min-w-28 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function getProjectProofItems(project: PortfolioProject, isConceptProject: boolean) {
  const imageStatus = isConceptProject
    ? "Изображение подписано как 3D-визуализация, без привязки к выполненной работе."
    : "Город, фото и характеристики берутся из данных опубликованного кейса.";

  return [
    {
      title: "Что было важно",
      text: project.task || "Перед расчетом уточняем размеры, технику, хранение и ограничения помещения.",
    },
    {
      title: "Как решали",
      text: project.solution || "Планировку, материалы и комплектацию пересчитываем после точного замера.",
    },
    {
      title: "Материалы и фурнитура",
      text: [
        project.facades && `фасады: ${project.facades}`,
        project.countertop && `столешница: ${project.countertop}`,
        project.fittings && `фурнитура: ${project.fittings}`,
      ].filter(Boolean).join("; ") || "Материалы и фурнитура фиксируются в смете перед запуском.",
    },
    {
      title: "Срок и бюджет",
      text: [
        project.workDuration && `срок: ${project.workDuration}`,
        formatProjectPrice(project) && `ориентир: ${formatProjectPrice(project)}`,
      ].filter(Boolean).join("; ") || "Срок и бюджет зависят от размеров, материалов, доставки и монтажа.",
    },
    {
      title: "Статус изображения",
      text: imageStatus,
    },
  ];
}

export async function generateStaticParams() {
  const projects = await getPortfolioProjects();

  return projects.map(({ project }) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolioCase = await getPortfolioCase(slug);

  if (!portfolioCase) {
    return {
      title: "Проект не найден",
    };
  }

  const project = toPortfolioProject(portfolioCase as EditablePortfolioCase);
  const isConceptProject = getImageDisclosure(project.mainImage).kind === "generated";
  const customDescription = portfolioCase.seoDescription
    && !isGenericPortfolioDescription(portfolioCase.seoDescription)
    ? trimMetaDescription(portfolioCase.seoDescription, portfolioCase.seoDescription)
    : "";
  const conceptDescription = trimMetaDescription(
    "3D-визуализация кухни на заказ: планировка, материалы и идеи для похожего проекта без привязки к выполненной работе.",
    project.description,
  );
  const metaDescription = customDescription || (isConceptProject ? conceptDescription : buildMetaDescription(project));
  const metaTitle = buildPortfolioMetaTitle(project);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: buildOpenGraph(`/portfolio/${project.slug}`, metaTitle, metaDescription, {
      type: "article",
      images: project.mainImage ? [{ url: project.mainImage, alt: project.alt || project.title }] : undefined,
    }),
    twitter: buildTwitterMetadata(metaTitle, metaDescription, project.mainImage || undefined),
  };
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  const [portfolioCase, portfolioEntries] = await Promise.all([getPortfolioCase(slug), getPortfolioProjects()]);

  if (!portfolioCase) notFound();

  const project = toPortfolioProject(portfolioCase as EditablePortfolioCase);
  const { style, materials, scenarios, reviews, locationPage } = await getAuxiliaryProjectData(portfolioCase);
  const relatedProjects = getRelatedProjects(
    project,
    portfolioEntries.map((entry) => entry.project),
  );
  const regionalLocationByCity = regionalLocations.find((location) => location.cityName === project.city) ?? null;
  const regionalLink = locationPage?.slug ? `/locations/${locationPage.slug}` : regionalLocationByCity ? `/locations/${regionalLocationByCity.slug}` : null;
  const regionalTitle = locationPage?.h1 || (project.city ? `Кухни в ${project.city}` : null);
  const cityKey = locationPage?.slug || regionalLocationByCity?.slug || "";
  const mainImageDisclosure = getImageDisclosure(project.mainImage);
  const isConceptProject = mainImageDisclosure.kind === "generated";
  const projectProofItems = getProjectProofItems(project, isConceptProject);
  const projectNextLinks = [
    { href: "/prices", label: "Цены и смета" },
    { href: "/calculator", label: "Калькулятор кухни" },
    { href: "/materials", label: "Материалы" },
    regionalLink ? { href: regionalLink, label: regionalTitle || `Кухни в ${project.city}` } : null,
    { href: "/warranty", label: "Гарантия" },
    { href: "/reviews", label: "Отзывы" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Портфолио", path: "/portfolio" },
      { name: project.title, path: `/portfolio/${project.slug}` },
    ]),
    compactJsonLd({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": siteUrl(`/portfolio/${project.slug}`),
      name: project.title,
      description: project.description,
      url: siteUrl(`/portfolio/${project.slug}`),
      inLanguage: "ru-BY",
      creator: {
        "@type": "Organization",
        name: "КухниBY",
      },
      contentLocation: project.city && !isConceptProject
        ? compactJsonLd({
            "@type": "Place",
            name: project.city,
            address: compactJsonLd({
              "@type": "PostalAddress",
              addressLocality: project.city,
              addressRegion: project.region,
              addressCountry: "BY",
            }),
          })
        : undefined,
      image: project.images.map((image) =>
        compactJsonLd({
          "@type": "ImageObject",
          contentUrl: siteUrl(image.src),
          caption: image.alt || project.title,
        }),
      ),
      primaryImageOfPage: project.mainImage
        ? compactJsonLd({
            "@type": "ImageObject",
            contentUrl: siteUrl(project.mainImage),
            caption: project.alt || project.title,
          })
        : undefined,
    }),
  ];

  return (
    <ExploreContextProvider sourceRoute={`/portfolio/${project.slug}`}>
      <PortfolioProjectOpenTracker projectSlug={project.slug} cityKey={cityKey || undefined} />
      <JsonLd data={jsonLd} />
      <main className="section-padding">
        <div className="container-site">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
            <Link href="/" className="transition-colors hover:text-primary">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/portfolio" className="transition-colors hover:text-primary">
              Портфолио
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.city && !isConceptProject && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    <MapPin className="h-4 w-4" />
                    {project.city}
                  </span>
                )}
                {isConceptProject && (
                  <span className="inline-flex items-center rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                    3D-визуализация, не реальный кейс
                  </span>
                )}
                {project.kitchenType && (
                  <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                    {project.kitchenType}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {project.title}
              </h1>
              <div className="mt-4">
                <FavoriteButton caseSlug={project.slug} />
              </div>

              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {project.description || (isConceptProject
                  ? "Пример дизайна кухни на заказ с продуманной планировкой, материалами и хранением."
                  : "Проект кухни на заказ с продуманной планировкой, материалами и хранением под задачи клиента.")}
              </p>
              {isConceptProject && (
                <p className="mt-3 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                  Это иллюстративная 3D-визуализация. Не используем ее как подтверждение выполненной работы в конкретном городе.
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/calculator?project=${project.slug}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Рассчитать похожую кухню
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#project-request"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary px-8 py-3 text-base font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Оставить заявку
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              {project.mainImage ? (
                <PortfolioProjectHeroImage
                  title={project.title}
                  mainImage={project.mainImage}
                  alt={project.alt || project.title}
                  images={project.images}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Фото проекта скоро появится
                </div>
              )}
            </div>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-12">
              <section aria-labelledby="project-specs-heading" className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 id="project-specs-heading" className="font-serif text-3xl font-bold">
                  Характеристики
                </h2>
                <dl className="mt-4">
                  {!isConceptProject && <DetailRow label="Город" value={project.city} />}
                  <DetailRow label="Район" value={project.district} />
                  <DetailRow label="Тип кухни" value={project.kitchenType} />
                  <DetailRow label="Стиль" value={project.style} />
                  <DetailRow label="Цвет" value={project.color} />
                  <DetailRow label="Размер" value={project.size} />
                  <DetailRow label="Фасады" value={project.facades} />
                  <DetailRow label="Столешница" value={project.countertop} />
                  <DetailRow label="Фурнитура" value={project.fittings} />
                  <DetailRow label="Срок" value={project.workDuration} />
                  <DetailRow label="Цена" value={formatProjectPrice(project)} />
                </dl>
              </section>

              <ProjectGallery title={project.title} images={project.images} />

              <section aria-labelledby="project-description-heading" className="space-y-6">
                <div>
                  <h2 id="project-description-heading" className="font-serif text-3xl font-bold">
                    Описание проекта
                  </h2>
                  {project.description && (
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {project.task && (
                    <article className="rounded-lg border border-border bg-white p-5">
                      <h3 className="font-serif text-2xl font-bold">Задача</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.task}</p>
                    </article>
                  )}
                  {project.solution && (
                    <article className="rounded-lg border border-border bg-white p-5">
                      <h3 className="font-serif text-2xl font-bold">Решение</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
                    </article>
                  )}
                </div>

                {portfolioCase.constraints && (
                  <article className="rounded-lg border border-orange-200 bg-orange-50/60 p-5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="font-serif text-2xl font-bold">Ограничения</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{portfolioCase.constraints}</p>
                  </article>
                )}

                {project.features.length > 0 && (
                  <div className="rounded-lg bg-gray-50 p-5 sm:p-6">
                    <h3 className="font-serif text-2xl font-bold">Особенности</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm leading-relaxed text-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {portfolioCase.result && (
                  <article className="rounded-lg border border-green-200 bg-green-50/60 p-5">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-700" />
                      <h3 className="font-serif text-2xl font-bold">Результат</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">{portfolioCase.result}</p>
                  </article>
                )}

                <section aria-labelledby="project-proof-heading" className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-6">
                  <div className="max-w-2xl">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                      Доказательства
                    </p>
                    <h2 id="project-proof-heading" className="font-serif text-3xl font-bold">
                      Что проверить в похожем проекте
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Этот блок помогает сравнить кейс с будущей сметой: город, материалы, срок, статус изображения и следующий шаг к расчету.
                    </p>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {projectProofItems.map((item) => (
                      <article key={item.title} className="rounded-md border border-border bg-muted/30 p-4">
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {projectNextLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              </section>

              {(portfolioCase.photosBefore.length > 0 || portfolioCase.photosAfter.length > 0) && (
                <section aria-labelledby="before-after-heading">
                  <h2 id="before-after-heading" className="font-serif text-3xl font-bold">
                    До и после
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {portfolioCase.photosBefore[0] && (
                      <div>
                        <p className="mb-2 text-center text-sm font-semibold uppercase text-muted-foreground">До</p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={optimizedImageSrc(portfolioCase.photosBefore[0]) || portfolioCase.photosBefore[0]}
                            alt={`${project.title}: изображение до`}
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 420px"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                    {portfolioCase.photosAfter[0] && (
                      <div>
                        <p className="mb-2 text-center text-sm font-semibold uppercase text-primary">После</p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={optimizedImageSrc(portfolioCase.photosAfter[0]) || portfolioCase.photosAfter[0]}
                            alt={`${project.title}: изображение после`}
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 420px"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {reviews.length > 0 && (
                <section aria-labelledby="project-reviews-heading">
                  <h2 id="project-reviews-heading" className="font-serif text-3xl font-bold">
                    Отзыв клиента
                  </h2>
                  <div className="mt-5 space-y-4">
                    {reviews.map((review) => (
                      <article key={review.id} className="rounded-lg border border-border bg-white p-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                            {review.name[0]}
                          </div>
                          <div>
                            <h3 className="font-semibold">{review.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {[review.city, review.date].filter(Boolean).join(", ")}
                            </p>
                          </div>
                          <div className="ml-auto flex gap-0.5" aria-label={`Оценка ${review.rating} из 5`}>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {(style || materials.length > 0 || scenarios.length > 0) && (
                <section aria-labelledby="project-used-heading">
                  <h2 id="project-used-heading" className="font-serif text-3xl font-bold">
                    Использованные стиль и материалы
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {style && (
                      <Link href={`/styles/${style.slug}`} className="rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-md">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Стиль</p>
                        <h3 className="mt-1 font-serif text-xl font-bold">{style.title}</h3>
                        <p className="mt-2 text-sm font-semibold text-primary">от {style.priceFrom.toLocaleString("ru")} BYN</p>
                      </Link>
                    )}
                    {materials.map((material) => (
                      <Link key={material.slug} href={`/materials/${material.slug}`} className="rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-md">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Материал</p>
                        <h3 className="mt-1 font-serif text-xl font-bold">{material.title}</h3>
                        <p className="mt-2 text-sm font-semibold text-primary">от {material.priceFrom.toLocaleString("ru")} BYN</p>
                      </Link>
                    ))}
                    {scenarios.map((scenario) => (
                      <Link key={scenario.slug} href={`/scenarios/${scenario.slug}`} className="rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-md">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Сценарий</p>
                        <h3 className="mt-1 font-serif text-xl font-bold">{scenario.title}</h3>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section id="project-request" className="grid gap-6 rounded-lg bg-primary/5 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,1fr)]">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                    Заявка по проекту
                  </p>
                  <h2 className="font-serif text-3xl font-bold">Хотите похожую кухню?</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Расскажите, какой проект вам ближе по стилю, размеру и материалам. Подготовим расчет похожей кухни под ваше помещение.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-white p-5">
                  <ContactForm
                    source={`portfolio/${project.slug}`}
                    sourceType="portfolio-project"
                    city={project.city}
                    projectSlug={project.slug}
                    cityKey={cityKey}
                  />
                </div>
              </section>

              {relatedProjects.length > 0 && (
                <section aria-labelledby="related-projects-heading">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <h2 id="related-projects-heading" className="font-serif text-3xl font-bold">
                      Связанные проекты
                    </h2>
                    <Link href="/portfolio" className="text-sm font-semibold text-primary hover:underline">
                      Все проекты
                    </Link>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedProjects.map((relatedProject) => (
                      <Link
                        key={relatedProject.slug}
                        href={`/portfolio/${relatedProject.slug}`}
                        className="card-base group overflow-hidden transition-shadow hover:shadow-lg"
                      >
                        <div className="relative aspect-[4/3] bg-gray-100">
                          {relatedProject.mainImage && (
                            <>
                              <Image
                                src={optimizedImageSrc(relatedProject.mainImage) || relatedProject.mainImage}
                                alt={relatedProject.alt || relatedProject.title}
                                width={720}
                                height={540}
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 360px"
                                quality={75}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <BrandedImageWatermark show={getImageDisclosure(relatedProject.mainImage).kind === "generated"} compact />
                            </>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                            {relatedProject.shortTitle || relatedProject.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {getImageDisclosure(relatedProject.mainImage).kind === "generated" ? "Пример без привязки к городу" : relatedProject.city} · {relatedProject.kitchenType}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <h2 className="font-serif text-2xl font-bold">Кратко о проекте</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {project.city && !isConceptProject && (
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {project.city}
                    </li>
                  )}
                  {project.kitchenType && (
                    <li className="flex items-center gap-2">
                      <Square className="h-4 w-4 text-primary" />
                      {project.kitchenType}
                    </li>
                  )}
                  {project.style && (
                    <li className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      {project.style}
                    </li>
                  )}
                  {project.size && (
                    <li className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      {project.size}
                    </li>
                  )}
                  {project.workDuration && (
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {project.workDuration}
                    </li>
                  )}
                  {project.fittings && (
                    <li className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      {project.fittings}
                    </li>
                  )}
                </ul>
                <Link
                  href={`/calculator?project=${project.slug}`}
                  className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Рассчитать похожую кухню
                </Link>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm font-semibold text-foreground">Цена проекта</p>
                <p className="mt-2 text-2xl font-bold text-primary">{formatProjectPrice(project)}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Точная стоимость зависит от размеров, материалов, фурнитуры и комплектации после замера.
                </p>
              </div>

              {regionalLink && !isConceptProject && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
                  <h2 className="flex items-center gap-2 font-serif text-2xl font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    Кухни в {project.city}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Смотрите другие проекты, цены на доставку и замер в вашем городе.
                  </p>
                  <Link
                    href={regionalLink}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {regionalTitle}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </aside>
          </section>
          <RelatedExplorationRail route={`/portfolio/${project.slug}`} state="RESULT" />
        </div>
      </main>
    </ExploreContextProvider>
  );
}
