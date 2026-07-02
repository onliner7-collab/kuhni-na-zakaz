"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Calculator, Check, ChevronLeft, ChevronRight, Maximize2, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import {
  budgetFilterOptions,
  facadeFilterOptions,
  formatByn,
  kitchenStyles,
  layoutFilterOptions,
  priceKitchenModels,
  roomFilterOptions,
  type KitchenBudgetId,
  type KitchenLayoutId,
  type KitchenStyleId,
  type PriceKitchenModel,
} from "@/data/price-catalog";
import { optimizedImageSrc } from "@/lib/image-optimization";

type FilterState = {
  style: KitchenStyleId | "all";
  layout: KitchenLayoutId | "all";
  budget: KitchenBudgetId | "all";
  facade: (typeof facadeFilterOptions)[number]["id"];
  room: (typeof roomFilterOptions)[number]["id"];
  model: string | null;
};

const defaultFilters: FilterState = {
  style: "minimalism",
  layout: "all",
  budget: "all",
  facade: "all",
  room: "all",
  model: null,
};

function getInitialFilters(searchParams: URLSearchParams): FilterState {
  const style = searchParams.get("style") as FilterState["style"] | null;
  const layout = searchParams.get("layout") as FilterState["layout"] | null;
  const budget = searchParams.get("budget") as FilterState["budget"] | null;
  const facade = searchParams.get("facade") as FilterState["facade"] | null;
  const room = searchParams.get("room") as FilterState["room"] | null;
  const model = searchParams.get("model");

  return {
    style: style && (style === "all" || kitchenStyles.some((item) => item.id === style)) ? style : defaultFilters.style,
    layout: layout && layoutFilterOptions.some((item) => item.id === layout) ? layout : defaultFilters.layout,
    budget: budget && budgetFilterOptions.some((item) => item.id === budget) ? budget : defaultFilters.budget,
    facade: facade && facadeFilterOptions.some((item) => item.id === facade) ? facade : defaultFilters.facade,
    room: room && roomFilterOptions.some((item) => item.id === room) ? room : defaultFilters.room,
    model: model || null,
  };
}

function updateUrl(filters: FilterState) {
  const params = new URLSearchParams();
  if (filters.style !== "all") params.set("style", filters.style);
  if (filters.layout !== "all") params.set("layout", filters.layout);
  if (filters.budget !== "all") params.set("budget", filters.budget);
  if (filters.facade !== "all") params.set("facade", filters.facade);
  if (filters.room !== "all") params.set("room", filters.room);
  if (filters.model) params.set("model", filters.model);
  window.history.pushState(null, "", params.size ? `/prices?${params.toString()}` : "/prices");
}

function matchesFacade(model: PriceKitchenModel, facade: FilterState["facade"]) {
  if (facade === "all") return true;
  const text = model.facadeMaterial.toLowerCase();
  if (facade === "mdf") return text.includes("мдф");
  if (facade === "ldsp") return text.includes("лдсп");
  if (facade === "emal") return text.includes("эмал");
  if (facade === "wood") return text.includes("древ") || text.includes("шпон");
  return true;
}

function matchesRoom(model: PriceKitchenModel, room: FilterState["room"]) {
  if (room === "all") return true;
  const text = `${model.roomType} ${model.layoutLabel}`.toLowerCase();
  if (room === "flat") return text.includes("квартир");
  if (room === "studio") return text.includes("студи");
  if (room === "living") return text.includes("гости");
  if (room === "small") return text.includes("малень");
  return true;
}

function KitchenCard({ model, onOpen, eager }: { model: PriceKitchenModel; onOpen: () => void; eager?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-lg">
      <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Посмотреть кухню ${model.name}`}>
        <span className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={optimizedImageSrc(model.coverImage) || model.coverImage}
            alt={model.coverAlt}
            fill
            priority={eager}
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 31vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {model.is3dVisualization && (
            <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
              3D-визуализация
            </span>
          )}
        </span>
        <span className="block p-4">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">{model.styleLabel}</span>
          <h3 className="mt-1 text-xl font-black leading-tight text-stone-950">{model.name}</h3>
          <span className="mt-3 grid gap-2 text-sm leading-5 text-stone-600">
            <span>Планировка: {model.layoutLabel}</span>
            <span>Размер: {model.sizeRange}</span>
            <span>Фасады: {model.facadeMaterial}</span>
          </span>
          <span className="mt-4 flex items-center justify-between gap-3">
            <span className="text-lg font-black text-[#8a5a2f]">от {formatByn(model.priceFrom)} BYN</span>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-stone-950 px-3 py-2 text-sm font-bold text-white">
              Посмотреть
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

function ModelDialog({
  model,
  relatedModels,
  onClose,
  onOpenModel,
}: {
  model: PriceKitchenModel;
  relatedModels: PriceKitchenModel[];
  onClose: () => void;
  onOpenModel: (model: PriceKitchenModel) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const currentImage = model.gallery[activeImage];

  useEffect(() => {
    setActiveImage(0);
    setIsFullscreenOpen(false);
  }, [model.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFullscreenOpen) {
          setIsFullscreenOpen(false);
          return;
        }
        onClose();
      }
      if (event.key === "ArrowLeft") setActiveImage((value) => (value === 0 ? model.gallery.length - 1 : value - 1));
      if (event.key === "ArrowRight") setActiveImage((value) => (value + 1) % model.gallery.length);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreenOpen, model.gallery.length, onClose]);

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/68 px-3 py-4 backdrop-blur-sm md:px-6" role="dialog" aria-modal="true" aria-labelledby="price-model-title">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-white/95 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Пример дизайна для расчёта</p>
            <h2 id="price-model-title" className="text-lg font-black leading-tight text-stone-950 md:text-2xl">{model.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-stone-200 text-stone-700" aria-label="Закрыть карточку кухни">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="bg-stone-950 p-3 md:p-5">
            <div className="relative mx-auto aspect-[4/3] max-h-[72svh] overflow-hidden rounded-lg bg-stone-900">
              <Image
                src={optimizedImageSrc(currentImage.src) || currentImage.src}
                alt={currentImage.alt}
                fill
                sizes="(max-width: 1024px) 94vw, 55vw"
                className="object-cover"
                priority
              />
              <span className="absolute left-3 top-3 rounded-md bg-black/72 px-2.5 py-1 text-xs font-bold text-white">
                {activeImage + 1} / {model.gallery.length}
              </span>
              <span className="absolute bottom-3 left-3 right-3 rounded-md bg-black/62 px-3 py-2 text-sm font-bold text-white">
                {currentImage.caption}
              </span>
              <button
                type="button"
                onClick={() => setActiveImage((value) => (value === 0 ? model.gallery.length - 1 : value - 1))}
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-stone-950"
                aria-label="Предыдущий ракурс"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setActiveImage((value) => (value + 1) % model.gallery.length)}
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-stone-950"
                aria-label="Следующий ракурс"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
                className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/88 text-stone-950"
                aria-label="Открыть изображение на весь экран"
              >
                <Maximize2 className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
              {model.gallery.map((image, index) => (
                <button
                  key={`${image.src}-${image.caption}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-md border-2 ${
                    activeImage === index ? "border-[#d5b078]" : "border-white/20"
                  }`}
                  aria-label={`Показать ракурс: ${image.caption}`}
                >
                  <Image src={optimizedImageSrc(image.src) || image.src} alt="" fill sizes="6rem" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="rounded-lg border border-[#eadccb] bg-[#fff8ef] p-4">
              <p className="text-sm font-bold text-stone-600">Ориентир стоимости</p>
              <p className="mt-1 text-3xl font-black text-[#8a5a2f]">от {formatByn(model.priceFrom)} BYN</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Точная стоимость зависит от размеров помещения, выбранной фурнитуры, столешницы и состава модулей.
              </p>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-stone-700">
              <p><strong>Стиль:</strong> {model.styleLabel}</p>
              <p><strong>Планировка:</strong> {model.layoutLabel}</p>
              <p><strong>Размер:</strong> {model.sizeRange}</p>
              <p><strong>Фасады:</strong> {model.facadeMaterial}</p>
              <p><strong>Столешница:</strong> {model.countertopMaterial}</p>
              <p><strong>Фурнитура:</strong> {model.fittingsLevel}</p>
              <p><strong>Помещение:</strong> {model.roomType}</p>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black text-stone-950">В комплектации</h3>
              <ul className="mt-3 grid gap-2 text-sm text-stone-700">
                {model.equipment.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8a5a2f]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-black text-stone-950">Что влияет на итоговую цену</h3>
              <ul className="mt-3 grid gap-2 text-sm text-stone-700">
                {model.priceFactors.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a5a2f]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {relatedModels.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-black text-stone-950">Похожие кухни</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {relatedModels.map((related) => (
                    <button
                      key={related.id}
                      type="button"
                      onClick={() => onOpenModel(related)}
                      className="overflow-hidden rounded-lg border border-stone-200 bg-white text-left transition hover:border-[#d5b078]"
                    >
                      <span className="relative block aspect-[4/3] bg-stone-100">
                        <Image
                          src={optimizedImageSrc(related.coverImage) || related.coverImage}
                          alt={related.coverAlt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 42vw, 13rem"
                          className="object-cover"
                        />
                      </span>
                      <span className="block p-3">
                        <span className="line-clamp-2 text-sm font-black text-stone-950">{related.name}</span>
                        <span className="mt-1 block text-xs text-stone-600">{related.layoutLabel} · от {formatByn(related.priceFrom)} BYN</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4">
              <h3 className="text-lg font-black text-stone-950">Короткая форма заявки</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Отправьте контакты — рассчитаем похожую кухню по вашим размерам и материалам.
              </p>
              <div className="mt-4">
                <ContactForm
                  source="prices"
                  sourceType="prices"
                  formType="prices-model-modal"
                  formLocation={`prices-model-${model.id}`}
                  submitLabel="Рассчитать похожую кухню"
                  showCity
                  showKitchenType
                  showMessenger
                  defaultKitchenType={model.layoutLabel}
                  defaultComment={`Интересует похожая кухня: ${model.name}. Стиль: ${model.styleLabel}. Планировка: ${model.layoutLabel}. Ориентир: от ${formatByn(model.priceFrom)} BYN.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 p-3 md:p-6" role="dialog" aria-modal="true" aria-label={`Полноэкранный ракурс: ${currentImage.caption}`}>
          <div className="relative h-full w-full">
            <Image
              src={optimizedImageSrc(currentImage.src) || currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <div className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-2 text-sm font-black text-stone-950">
              {activeImage + 1} / {model.gallery.length} · {currentImage.caption}
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute right-3 top-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-950"
              aria-label="Закрыть полноэкранный просмотр"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((value) => (value === 0 ? model.gallery.length - 1 : value - 1))}
              className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-950"
              aria-label="Предыдущий ракурс в полноэкранном просмотре"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((value) => (value + 1) % model.gallery.length)}
              className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-950"
              aria-label="Следующий ракурс в полноэкранном просмотре"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function InteractivePricesCatalog() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => getInitialFilters(new URLSearchParams(searchParams.toString())));
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setFilters(getInitialFilters(new URLSearchParams(searchParams.toString())));
  }, [searchParams]);

  const filteredModels = useMemo(() => {
    return priceKitchenModels.filter((model) => {
      if (filters.style !== "all" && model.style !== filters.style) return false;
      if (filters.layout !== "all" && model.layout !== filters.layout) return false;
      if (filters.budget !== "all" && model.budget !== filters.budget) return false;
      if (!matchesFacade(model, filters.facade)) return false;
      if (!matchesRoom(model, filters.room)) return false;
      return true;
    });
  }, [filters]);

  const selectedModel = useMemo(
    () => priceKitchenModels.find((model) => model.id === filters.model) || null,
    [filters.model],
  );
  const relatedModels = useMemo(() => {
    if (!selectedModel) return [];

    const ranked = priceKitchenModels
      .filter((model) => model.id !== selectedModel.id)
      .map((model) => ({
        model,
        score:
          (model.style === selectedModel.style ? 4 : 0) +
          (model.layout === selectedModel.layout ? 3 : 0) +
          (model.budget === selectedModel.budget ? 2 : 0) +
          (model.roomType === selectedModel.roomType ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score || a.model.priceFrom - b.model.priceFrom);

    return ranked.slice(0, 2).map((item) => item.model);
  }, [selectedModel]);

  function patchFilters(next: Partial<FilterState>) {
    const nextFilters = { ...filters, ...next };
    setFilters(nextFilters);
    setVisibleCount(6);
    updateUrl(nextFilters);
  }

  function openModel(model: PriceKitchenModel) {
    patchFilters({ model: model.id });
  }

  function closeModel() {
    patchFilters({ model: null });
  }

  const visibleModels = filteredModels.slice(0, visibleCount);

  return (
    <section id="styles" className="bg-[#fff8ef] text-stone-950" aria-labelledby="prices-catalog-title">
      <div className="container-site py-10 md:py-14">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8a5a2f]">Визуальный каталог</p>
          <h2 id="prices-catalog-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
            Выберите стиль кухни и посмотрите ориентир по цене
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Карточки ниже — 3D-визуализации для расчёта. Они не выдаются за реальные выполненные проекты:
            точную смету считаем после замера, материалов и комплектации.
          </p>
        </div>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0" aria-label="Выбор стиля кухни">
          {kitchenStyles.map((style) => {
            const active = filters.style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => patchFilters({ style: style.id, model: null })}
                className={`w-[84vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-lg border bg-white text-left transition md:w-[19rem] ${
                  active ? "border-[#8a5a2f] ring-2 ring-[#d5b078]/40" : "border-stone-200 hover:border-[#d5b078]"
                }`}
                aria-pressed={active}
              >
                <span className="relative block aspect-[4/3]">
                  <Image
                    src={optimizedImageSrc(style.image) || style.image}
                    alt={style.alt}
                    fill
                    sizes="(max-width: 640px) 84vw, 19rem"
                    className="object-cover"
                    priority={style.id === defaultFilters.style}
                  />
                </span>
                <span className="block p-4">
                  <span className="text-lg font-black leading-tight">{style.title}</span>
                  <span className="mt-2 line-clamp-2 block min-h-10 text-sm leading-5 text-stone-600">{style.description}</span>
                  <span className="mt-3 flex items-center justify-between gap-2 text-sm">
                    <strong className="text-[#8a5a2f]">от {formatByn(style.priceFrom)} BYN</strong>
                    <span>{style.variantsCount} вариантов</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="catalog" className="mt-7 scroll-mt-24">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-700">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Быстрые фильтры
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="grid gap-1 text-sm font-bold text-stone-700">
              Планировка
              <select value={filters.layout} onChange={(event) => patchFilters({ layout: event.target.value as FilterState["layout"], model: null })} className="min-h-12 rounded-lg border border-stone-250 bg-white px-3 text-sm font-semibold text-stone-900">
                {layoutFilterOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-stone-700">
              Бюджет
              <select value={filters.budget} onChange={(event) => patchFilters({ budget: event.target.value as FilterState["budget"], model: null })} className="min-h-12 rounded-lg border border-stone-250 bg-white px-3 text-sm font-semibold text-stone-900">
                {budgetFilterOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-stone-700">
              Материал фасадов
              <select value={filters.facade} onChange={(event) => patchFilters({ facade: event.target.value as FilterState["facade"], model: null })} className="min-h-12 rounded-lg border border-stone-250 bg-white px-3 text-sm font-semibold text-stone-900">
                {facadeFilterOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-stone-700">
              Для какого помещения
              <select value={filters.room} onChange={(event) => patchFilters({ room: event.target.value as FilterState["room"], model: null })} className="min-h-12 rounded-lg border border-stone-250 bg-white px-3 text-sm font-semibold text-stone-900">
                {roomFilterOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <div className="grid content-end">
              <a href="#calculate" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 py-3 text-sm font-black text-white">
                Рассчитать кухню
                <Calculator className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <p className="mt-4 rounded-lg border border-[#eadccb] bg-white px-4 py-3 text-sm font-semibold text-stone-700">
            Выберите стиль → откройте кухню → посмотрите комплектацию и ракурсы → оставьте заявку на расчёт.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleModels.map((model, index) => (
              <KitchenCard key={model.id} model={model} eager={index < 2} onOpen={() => openModel(model)} />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="mt-7 rounded-lg border border-stone-200 bg-white p-6 text-center">
              <h3 className="text-xl font-black">Под этот набор фильтров пока нет карточек</h3>
              <p className="mt-2 text-sm text-stone-600">Сбросьте часть фильтров или оставьте заявку, и мы подберём похожий вариант вручную.</p>
              <button type="button" onClick={() => patchFilters({ ...defaultFilters, model: null })} className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-black">
                Сбросить фильтры
              </button>
            </div>
          )}

          {visibleCount < filteredModels.length && (
            <div className="mt-7 text-center">
              <button type="button" onClick={() => setVisibleCount((value) => value + 6)} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-black text-stone-950">
                Показать ещё кухни
              </button>
            </div>
          )}
        </div>

        <div id="calculate" className="mx-auto mt-12 max-w-2xl scroll-mt-24 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-2xl font-black text-center">Получить точный расчёт кухни</h2>
          <p className="mt-2 text-center text-sm leading-6 text-stone-600">
            Оставьте заявку — рассчитаем похожую кухню по вашим размерам, материалам и адресу монтажа.
          </p>
          <div className="mt-5">
            <ContactForm source="prices" sourceType="prices" formType="prices-visual-catalog" formLocation="prices-visual-catalog" />
          </div>
        </div>
      </div>

      {selectedModel && (
        <ModelDialog
          model={selectedModel}
          relatedModels={relatedModels}
          onClose={closeModel}
          onOpenModel={openModel}
        />
      )}
    </section>
  );
}
