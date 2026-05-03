"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Package, Palette, Ruler } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio-projects";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

interface FilterOption {
  label: string;
  value: string;
}

interface PortfolioFiltersProps {
  projects: PortfolioProject[];
}

const cityOptions: FilterOption[] = [
  { label: "Все", value: "all" },
  { label: "Минск", value: "minsk" },
  { label: "Минская область", value: "minskaya-oblast" },
  { label: "Гомель", value: "gomel" },
  { label: "Могилёв", value: "mogilev" },
  { label: "Витебск", value: "vitebsk" },
];

const kitchenTypeOptions: FilterOption[] = [
  { label: "Все", value: "all" },
  { label: "Угловые", value: "uglovye" },
  { label: "Прямые", value: "pryamye" },
  { label: "П-образные", value: "p-obraznye" },
  { label: "С островом", value: "s-ostrovom" },
  { label: "До потолка", value: "do-potolka" },
  { label: "Маленькие", value: "malenkie" },
];

const styleOptions: FilterOption[] = [
  { label: "Все", value: "all" },
  { label: "Современные", value: "sovremennye" },
  { label: "Минимализм", value: "minimalizm" },
  { label: "Неоклассика", value: "neoklassika" },
  { label: "Классические", value: "klassicheskie" },
  { label: "Лофт", value: "loft" },
  { label: "Скандинавский", value: "skandinavskie" },
];

const colorOptions: FilterOption[] = [
  { label: "Все", value: "all" },
  { label: "Светлые", value: "svetlye" },
  { label: "Тёмные", value: "temnye" },
  { label: "Под дерево", value: "pod-derevo" },
  { label: "Комбинированные", value: "kombinirovannye" },
];

function getKitchenTypeValue(project: PortfolioProject) {
  const type = project.kitchenType.toLowerCase();

  if (type.includes("п-образ")) return "p-obraznye";
  if (type.includes("остров")) return "s-ostrovom";
  if (type.includes("углов")) return "uglovye";
  if (type.includes("прям")) return "pryamye";
  if (type.includes("потол")) return "do-potolka";
  if (type.includes("малень")) return "malenkie";

  return "";
}

function getStyleValue(project: PortfolioProject) {
  const slug = (project.styleSlug || "").trim();
  if (
    slug === "sovremennye" ||
    slug === "minimalizm" ||
    slug === "klassicheskie" ||
    slug === "neoklassika" ||
    slug === "loft" ||
    slug === "skandinavskie"
  ) {
    return slug;
  }

  const style = project.style.toLowerCase();

  if (style.includes("неокласс")) return "neoklassika";
  if (style.includes("лофт")) return "loft";
  if (style.includes("скандинав")) return "skandinavskie";
  if (style.includes("современ")) return "sovremennye";
  if (style.includes("классич") && !style.includes("неокласс")) return "klassicheskie";
  if (style.includes("минимал")) return "minimalizm";

  return "";
}

function getColorValue(project: PortfolioProject) {
  const color = project.color.toLowerCase();

  if (color.includes("свет")) return "svetlye";
  if (color.includes("тём") || color.includes("тем")) return "temnye";
  if (color.includes("дерев")) return "pod-derevo";
  if (color.includes("комб")) return "kombinirovannye";

  return "";
}

function doesMatchCity(project: PortfolioProject, value: string) {
  if (value === "all") return true;
  if (value === "minskaya-oblast") {
    return project.region === "Минская область" || project.relatedLocationSlugs.includes(value);
  }

  return project.cityKey === value || project.relatedLocationSlugs.includes(value);
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`min-h-10 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function PortfolioFilters({ projects }: PortfolioFiltersProps) {
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  const hasFilters =
    cityFilter !== "all" ||
    typeFilter !== "all" ||
    styleFilter !== "all" ||
    colorFilter !== "all";

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (!doesMatchCity(project, cityFilter)) return false;
        if (typeFilter !== "all" && getKitchenTypeValue(project) !== typeFilter) return false;
        if (styleFilter !== "all" && getStyleValue(project) !== styleFilter) return false;
        if (colorFilter !== "all" && getColorValue(project) !== colorFilter) return false;

        return true;
      }),
    [cityFilter, colorFilter, projects, styleFilter, typeFilter],
  );

  function handleFilterChange(filterName: "city" | "type" | "style" | "color", value: string) {
    const nextFilters = {
      city: cityFilter,
      type: typeFilter,
      style: styleFilter,
      color: colorFilter,
      [filterName]: value,
    };

    trackAnalyticsEvent(ANALYTICS_EVENTS.PORTFOLIO_FILTER_CHANGE, {
      filter_name: filterName,
      filter_value: value,
      city_filter: nextFilters.city,
      type_filter: nextFilters.type,
      style_filter: nextFilters.style,
      color_filter: nextFilters.color,
    });

    if (filterName === "city") setCityFilter(value);
    if (filterName === "type") setTypeFilter(value);
    if (filterName === "style") setStyleFilter(value);
    if (filterName === "color") setColorFilter(value);
  }

  function resetFilters() {
    trackAnalyticsEvent(ANALYTICS_EVENTS.PORTFOLIO_FILTER_CHANGE, {
      filter_name: "reset",
      filter_value: "all",
    });
    setCityFilter("all");
    setTypeFilter("all");
    setStyleFilter("all");
    setColorFilter("all");
  }

  return (
    <section aria-labelledby="portfolio-catalog-heading" className="space-y-8">
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="portfolio-catalog-heading" className="font-serif text-2xl font-bold">
              Каталог проектов
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Найдено проектов: {filteredProjects.length}
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-10 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <FilterGroup label="Город" options={cityOptions} value={cityFilter} onChange={(value) => handleFilterChange("city", value)} />
          <FilterGroup label="Тип кухни" options={kitchenTypeOptions} value={typeFilter} onChange={(value) => handleFilterChange("type", value)} />
          <FilterGroup label="Стиль" options={styleOptions} value={styleFilter} onChange={(value) => handleFilterChange("style", value)} />
          <FilterGroup label="Цвет" options={colorOptions} value={colorFilter} onChange={(value) => handleFilterChange("color", value)} />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-gray-50 px-4 py-12 text-center">
          <h3 className="font-serif text-2xl font-bold">Проекты не найдены</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            По выбранным параметрам пока нет опубликованных работ. Попробуйте изменить город, тип кухни, стиль или цвет.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 min-h-10 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Показать все проекты
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.slug}
              className="card-base flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg"
            >
              <Link
                href={`/portfolio/${project.slug}`}
                aria-label={`Смотреть проект: ${project.title}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-gray-100"
              >
                <Image
                  src={optimizedImageSrc(project.mainImage) || project.mainImage}
                  alt={project.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
                  className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {project.kitchenType}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {project.color}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold leading-snug">
                  <Link href={`/portfolio/${project.slug}`} className="transition-colors hover:text-primary">
                    {project.shortTitle || project.title}
                  </Link>
                </h3>

                <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <dt className="sr-only">Город</dt>
                    <dd>{project.city}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 shrink-0 text-primary" />
                    <dt className="sr-only">Тип кухни</dt>
                    <dd>{project.kitchenType}</dd>
                  </div>
                  {project.materials.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <dt className="sr-only">Материалы</dt>
                      <dd>{project.materials.join(", ")}</dd>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Palette className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <dt className="sr-only">Стоимость</dt>
                    <dd>{project.price || project.priceNote}</dd>
                  </div>
                </dl>

                <Link
                  href={`/portfolio/${project.slug}`}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Смотреть проект
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
