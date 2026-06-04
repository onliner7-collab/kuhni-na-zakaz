import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { PortfolioFilters } from "@/components/portfolio/PortfolioFilters";
import { GENERATED_MINSK_PORTFOLIO_CASES, toPortfolioProject } from "@/data/portfolio-projects";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Портфолио кухонь на заказ",
  description:
    "Каталог проектов кухонь на заказ: фото из портфолио, 3D-визуализации, города из данных, типы планировок, материалы и подробные страницы проектов.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const portfolioCases = await prisma.portfolioCase.findMany({
    where: {
      published: true,
      slug: publicSlugWhere(),
      title: { not: "" },
    },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);
  const projects = [
    ...GENERATED_MINSK_PORTFOLIO_CASES,
    ...portfolioCases.filter((item) => isPublicContentSlug(item.slug)),
  ].map(toPortfolioProject);

  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Портфолио", path: "/portfolio" },
  ]);
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Портфолио кухонь на заказ",
    description: metadata.description,
    url: siteUrl("/portfolio"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        image: siteUrl(project.mainImage),
        url: siteUrl(`/portfolio/${project.slug}`),
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdCollection]} />
      <main className="section-padding">
        <div className="container-site">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
            <Link href="/" className="transition-colors hover:text-primary">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Портфолио</span>
          </nav>

          <section className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                Портфолио и примеры
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                Портфолио кухонь на заказ
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Собрали каталог кухонь, чтобы было проще сравнить планировки, фасады,
                материалы и решения для хранения. Если изображение является визуализацией,
                мы подписываем его отдельно; город и характеристики показываем только из данных карточки.
              </p>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
              <h2 className="font-serif text-2xl font-bold">Хотите увидеть похожий проект для своей кухни?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Покажем варианты под ваш размер, бюджет и стиль, а затем подготовим визуализацию кухни с учетом вашей планировки.
              </p>
              <Link
                href="/design-proekt-kuhni"
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Проект кухни по размерам
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <PortfolioFilters projects={projects} />

          <section className="mt-12 rounded-lg border border-border bg-muted/20 p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Кухни по регионам</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Подберите проекты из нужного региона и перейдите на страницу города с условиями
              замера, доставки и монтажа.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { href: "/locations/minsk", label: "Минск" },
                { href: "/locations/minskaya-oblast", label: "Минская область" },
                { href: "/locations/gomel", label: "Гомель" },
                { href: "/locations/mogilev", label: "Могилёв" },
                { href: "/locations/vitebsk", label: "Витебск" },
              ].map((region) => (
                <Link
                  key={region.href}
                  href={region.href}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {region.label}
                </Link>
              ))}
            </div>
          </section>

          <section id="portfolio-request" className="mt-16 grid gap-8 rounded-lg bg-gray-50 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                Бесплатная консультация
              </p>
              <h2 className="font-serif text-3xl font-bold">Хотите кухню как в портфолио?</h2>
              <p className="mt-4 text-muted-foreground">
                Расскажите, какой проект ближе по стилю и планировке. Мы уточним размеры,
                материалы, технику и подготовим расчёт для вашей кухни.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                {["Замер и консультация", "Подбор материалов", "Расчёт стоимости"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/materials/furnitura" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Петли, направляющие и комплектация кухни
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="card-base p-5">
              <ContactForm source="portfolio-index" sourceType="portfolio-index" />
            </div>
          </section>

          <section className="mx-auto mt-16 max-w-4xl text-muted-foreground">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Каталог проектов кухонь для выбора идеи и планировки
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed">
              <p>
                Портфолио помогает заранее понять, какая кухня подойдёт под вашу квартиру или дом:
                угловая, прямая, маленькая, с фасадами до потолка или с комбинированными материалами.
                Каждый проект в каталоге связан с городом, типом кухни, стилем, цветом и набором
                материалов, если эти данные уже заполнены. Поэтому подбор можно начать с практичных
                параметров, а не только с картинки.
              </p>
              <p>
                На подробных страницах проектов можно посмотреть больше информации о задаче,
                решении, особенностях хранения и использованных материалах. Это удобно для сравнения
                вариантов перед замером и помогает быстрее сформулировать пожелания к будущей кухне.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
