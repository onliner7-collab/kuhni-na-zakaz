"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { optimizedImageSrc } from "@/lib/image-optimization";
import {
  exampleImage,
  marketRange,
  formatByn,
  priceExamples,
  priceStyles,
  priceLayouts,
  priceViews,
  type PriceExample,
} from "@/data/prices-showcase";

const control =
  "min-h-11 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";
const primary =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";
const budgets = [
  { id: "all", label: "Любой бюджет" },
  { id: "under4000", label: "До 4 000 BYN" },
  { id: "4000-7000", label: "4 000–7 000 BYN" },
  { id: "7000-10000", label: "7 000–10 000 BYN" },
  { id: "10000plus", label: "От 10 000 BYN" },
];
const facades = [
  { id: "all", label: "Любые фасады" },
  { id: "ldsp", label: "ЛДСП" },
  { id: "film", label: "МДФ в плёнке" },
  { id: "enamel", label: "МДФ в эмали" },
  { id: "hpl", label: "Пластик HPL" },
];
const sizes = [
  { id: "all", label: "Любая длина основной стены" },
  { id: "compact", label: "До 2,4 м" },
  { id: "medium", label: "Более 2,4 до 3 м" },
  { id: "large", label: "Более 3 м" },
];
const heights = [
  { id: "all", label: "Любая высота" },
  { id: "standard", label: "Стандартная" },
  { id: "ceiling", label: "До потолка" },
];
type Filters = {
  style: string;
  layout: string;
  budget: string;
  facade: string;
  size: string;
  height: string;
};
const initial: Filters = {
  style: "all",
  layout: "all",
  budget: "all",
  facade: "all",
  size: "all",
  height: "all",
};
const options = {
  style: [{ id: "all", label: "Все стили" }, ...priceStyles],
  layout: [{ id: "all", label: "Все формы" }, ...priceLayouts],
  budget: budgets,
  facade: facades,
  size: sizes,
  height: heights,
};
function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const filters = { ...initial };
  const legacy: Record<string, string> = {
    lightmodern: "modern",
    darkmodern: "modern",
    warmwood: "scandi",
    "light-modern": "modern",
    "dark-modern": "modern",
    "warm-wood": "scandi",
    ceiling: "modern",
  };
  for (const key of Object.keys(initial) as (keyof Filters)[]) {
    let value = params.get(key);
    if (key === "style" && value && legacy[value]) value = legacy[value];
    if (options[key].some((option) => option.id === value))
      filters[key] = value!;
  }
  if (params.get("style") === "ceiling" || params.get("layout") === "ceiling") filters.height = "ceiling";
  if (params.get("layout") === "small") filters.size = "compact";
  // Старые ссылки главной ведут к ближайшему обновлённому примеру дизайна.
  const legacyModels: Record<string, string> = {
    "minimal-island-01": "minimal-island",
    "light-straight-01": "modern-ceiling-3m",
    "light-small-01": "modern-small-2m",
    "dark-island-01": "hightech-island",
    "dark-u-01": "modern-u-shape",
    "wood-corner-01": "scandi-corner",
    "wood-ceiling-01": "modern-ceiling-3m",
    "neoclassic-corner-01": "neoclassic-corner",
    "neoclassic-light-01": "neoclassic-u-shape",
    "scandi-straight-01": "scandi-straight-3m",
    "loft-dark-01": "loft-straight-3m",
    "ceiling-modern-01": "modern-ceiling-3m",
  };
  const modelId = params.get("model") ?? "";
  return {
    filters,
    model: priceExamples.find((m) => m.id === (legacyModels[modelId] ?? modelId)) ?? null,
  };
}
function writeUrl(filters: Filters, model: PriceExample | null) {
  const url = new URL(window.location.href);
  for (const key of Object.keys(filters) as (keyof Filters)[]) {
    if (filters[key] === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, filters[key]);
  }
  if (model) url.searchParams.set("model", model.id);
  else url.searchParams.delete("model");
  window.history.pushState(null, "", url.pathname + url.search + url.hash);
}
function kitchenType(model?: PriceExample | null) {
  return model?.layout === "straight"
    ? "Прямая"
    : model?.layout === "u-shaped"
      ? "П-образная"
      : model?.layout === "island"
        ? "С островом"
        : "Угловая";
}
export function SizeDiagram({ model }: { model: PriceExample }) {
  const path =
    model.layout === "straight" || model.layout === "island"
      ? "M40 40 H220"
      : model.layout === "u-shaped"
        ? "M40 110 V40 H220 V110"
        : "M40 110 V40 H220";
  return (
    <figure className="rounded-xl bg-stone-100 p-3">
      <svg
        viewBox="0 0 260 140"
        role="img"
        aria-label={`Условная схема: ${model.dimensions}`}
        className="mx-auto h-32 w-full max-w-xs"
      >
        <path
          d={path}
          stroke="#b08968"
          strokeWidth="22"
          fill="none"
          strokeLinejoin="round"
        />
        {model.layout === "island" && (
          <rect x="90" y="88" width="80" height="28" rx="3" fill="#b08968" />
        )}
        <text x="130" y="19" textAnchor="middle" fontSize="14" fill="#292524">
          {model.layout === "u-shaped" ? model.walls[1] : model.walls[0]} м
        </text>
        {model.walls[1] && (
          <text x="10" y="85" fontSize="12" fill="#292524">
            {model.layout === "u-shaped" ? model.walls[0] : model.walls[1]} м
          </text>
        )}
        {model.walls[2] && (
          <text x="230" y="85" fontSize="12" fill="#292524">
            {model.walls[2]} м
          </text>
        )}
      </svg>
      <figcaption className="text-center text-xs leading-5 text-stone-600">
        {model.dimensions} · условная схема; модули уточняются в проекте
      </figcaption>
    </figure>
  );
}
function Specification({ model }: { model: PriceExample }) {
  return (
    <dl className="divide-y text-sm">
      {[
        ["Размеры", model.dimensions],
        ["Фасады", model.facadeMaterial],
        ["Столешница", model.countertop],
        ["Высота", model.height],
        ["Хранение", `${model.drawers} ящика в расчётном варианте`],
        ["Фурнитура", model.fittings],
      ].map(([label, value]) => (
        <div key={label} className="py-2">
          <dt className="text-stone-500">{label}</dt>
          <dd className="mt-1 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function ModelDialog({
  model,
  onClose,
}: {
  model: PriceExample;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState(0);
  const touch = useRef<number | null>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    const element = dialog.current;
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);
  const next = (step: number) => setView((v) => (v + step + 4) % 4);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="price-model-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-1rem)] max-w-6xl overflow-y-auto rounded-2xl p-0 text-stone-900 shadow-2xl backdrop:bg-black/60"
    >
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b bg-white p-3">
        <h2 id="price-model-title" className="text-base font-bold md:text-xl">
          {model.name}
        </h2>
        <button
          autoFocus
          onClick={onClose}
          className={control}
          aria-label="Закрыть пример"
        >
          ✕
        </button>
      </div>
      <div className="grid gap-6 p-3 md:p-6 lg:grid-cols-2">
        <div>
          <div
            tabIndex={0}
            aria-label="Фотографии кухни: стрелки влево и вправо меняют ракурс"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                next(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                next(1);
              }
            }}
            onTouchStart={(event) => {
              touch.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touch.current !== null) {
                const distance =
                  event.changedTouches[0].clientX - touch.current;
                if (Math.abs(distance) > 45) next(distance < 0 ? 1 : -1);
              }
              touch.current = null;
            }}
            className="relative aspect-[3/2] overflow-hidden rounded-xl bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"
          >
            <Image
              src={optimizedImageSrc(exampleImage(model, view))!}
              alt={`${model.name}: ${priceViews[view].toLowerCase()}, пример дизайна`}
              fill
              sizes="(max-width: 1023px) 94vw, 550px"
              className="object-cover"
            />
            <button
              className={`absolute left-2 top-1/2 -translate-y-1/2 ${control}`}
              onClick={() => next(-1)}
              aria-label="Предыдущий ракурс"
            >
              ‹
            </button>
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${control}`}
              onClick={() => next(1)}
              aria-label="Следующий ракурс"
            >
              ›
            </button>
          </div>
          <p aria-live="polite" className="my-3 text-sm">
            {view + 1} / 4 · {priceViews[view]}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {priceViews.map((label, index) => (
              <button
                key={label}
                aria-label={label}
                aria-pressed={view === index}
                onClick={() => setView(index)}
                className={`relative aspect-[3/2] overflow-hidden rounded-lg border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700 ${view === index ? "border-amber-700" : "border-transparent"}`}
              >
                <Image
                  src={optimizedImageSrc(exampleImage(model, index))!}
                  alt=""
                  fill
                  sizes="130px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <p className="my-4 text-xs leading-5 text-stone-600">
            Изображения созданы с помощью ИИ для выбора дизайна. Это не
            фотографии выполненного заказа. Размеры и комплектация — параметры
            расчётного примера; детали изображения могут отличаться.
          </p>
          <SizeDiagram model={model} />
        </div>
        <div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-stone-600">
              Ориентир по рынку за мебель
            </p>
            <p className="mt-1 text-2xl font-black">{marketRange(model)}</p>
            <p className="mt-2 text-sm leading-6">
              {model.length} м × {formatByn(model.rateFrom)}–
              {formatByn(model.rateTo)} BYN/м, округлено до 100 BYN. Высота,
              механизмы и столешница могут увеличить смету.
            </p>
            <p className="mt-2 text-xs leading-5">
              Не предложение КухниBY. Техника, доставка и монтаж отдельно.
            </p>
            <a
              href="#price-method"
              onClick={onClose}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline"
            >
              Источники и методика расчёта
            </a>
          </div>
          <Specification model={model} />
          <h3 className="mt-4 font-bold">Что предлагается сравнить в смете</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
            {model.equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-4 font-bold">Что не включено в ориентир</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
            {model.exclude.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="my-4 flex flex-wrap gap-3">
            <Link
              className={control}
              href={priceLayouts.find((item) => item.id === model.layout)!.href}
            >
              Другие планировки
            </Link>
            <Link
              className={control}
              href={priceStyles.find((item) => item.id === model.style)!.href}
            >
              Другие кухни в этом стиле
            </Link>
          </div>
          <h3 className="mb-3 text-xl font-bold">Рассчитать этот вариант</h3>
          <ContactForm
            compact
            showDimensions
            showComment
            defaultDimensions={model.dimensions}
            source="prices"
            sourceType="prices"
            formType="prices-model-modal"
            formLocation="prices-model-modal"
            showCity
            showKitchenType
            defaultKitchenType={kitchenType(model)}
            defaultComment={`Интересует ${model.name}. Размеры: ${model.dimensions}. Фасады: ${model.facadeMaterial}. На сайте рыночный ориентир ${marketRange(model)}, прошу собственную смету.`}
            defaultAnswers={{
              exampleId: model.id,
              style: model.style,
              layout: model.layout,
              dimensions: model.dimensions,
              facade: model.facadeMaterial,
              marketBudget: marketRange(model),
            }}
            submitLabel="Получить смету по этому примеру"
          />
        </div>
      </div>
    </dialog>
  );
}
export function InteractivePricesCatalog({
  children,
}: {
  children?: ReactNode;
}) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [visible, setVisible] = useState(6);
  const [selected, setSelected] = useState<PriceExample | null>(null);
  const [compared, setCompared] = useState<string[]>([]);
  const [request, setRequest] = useState<PriceExample | null>(null);
  useEffect(() => {
    const apply = () => {
      const state = readUrl();
      setFilters(state.filters);
      setSelected(state.model);
      setVisible(6);
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);
  const filtered = useMemo(
    () =>
      priceExamples.filter((model) => {
        if (filters.style !== "all" && model.style !== filters.style)
          return false;
        if (filters.layout !== "all" && model.layout !== filters.layout)
          return false;
        if (filters.facade !== "all" && model.facade !== filters.facade)
          return false;
        if (
          filters.height !== "all" &&
          (filters.height === "ceiling") !== (model.height === "До потолка")
        )
          return false;
        const length = model.walls[0];
        if (
          (filters.size === "compact" && length > 2.4) ||
          (filters.size === "medium" && (length <= 2.4 || length > 3)) ||
          (filters.size === "large" && length <= 3)
        )
          return false;
        const range: Record<string, [number, number]> = {
          under4000: [0, 4000],
          "4000-7000": [4000, 7000],
          "7000-10000": [7000, 10000],
          "10000plus": [10000, Infinity],
        };
        const interval = range[filters.budget];
        return (
          !interval ||
          (model.priceFrom < interval[1] && model.priceTo >= interval[0])
        );
      }),
    [filters],
  );
  const active = Object.values(filters).some((value) => value !== "all");
  const change = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    setVisible(6);
    writeUrl(next, selected);
  };
  const reset = () => {
    setFilters(initial);
    setVisible(6);
    writeUrl(initial, null);
    setSelected(null);
  };
  const open = (model: PriceExample) => {
    setSelected(model);
    writeUrl(filters, model);
  };
  const close = () => {
    setSelected(null);
    writeUrl(filters, null);
  };
  const compare = (id: string) =>
    setCompared((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : old.length < 3
          ? [...old, id]
          : old,
    );
  const selectControl = (key: keyof Filters, label: string) => (
    <label key={key} className="grid gap-2 text-sm font-semibold">
      {label}
      <select
        value={filters[key]}
        onChange={(event) => change(key, event.target.value)}
        className={`${control} w-full min-w-0`}
      >
        {options[key].map((item) => (
          <option value={item.id} key={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <>
      <section id="catalog" className="scroll-mt-24 bg-[#f8f5f0] py-8 md:py-12">
        <div className="container-site">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="max-w-2xl text-2xl font-black md:text-3xl">
              Подберите кухню по бюджету и планировке
            </h2>
            <a href="#comparison" className={control}>
              Сравнение: {compared.length} / 3
            </a>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            18 примеров дизайна: прямые, угловые, П-образные, с островом и
            полуостровом. Цены — рыночные ориентиры; смету КухниBY рассчитываем
            по вашим размерам.
          </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
            {selectControl("budget", "Бюджет за мебель")}
            {selectControl("layout", "Форма кухни")}
          </div>
          <details className="mt-3 rounded-xl border bg-white p-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold">
              Стиль, фасады и размеры
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {selectControl("style", "Стиль кухни")}
              {selectControl("facade", "Материал фасадов")}
              {selectControl("size", "Длина основной стены")}
              {selectControl("height", "Высота шкафов")}
            </div>
          </details>
          <div className="my-4 flex flex-wrap items-center justify-between gap-2">
            <p role="status" className="text-sm">
              Найдено примеров: {filtered.length}. Диапазон цены может
              пересекать выбранный бюджет.
            </p>
            {active && (
              <button onClick={reset} className={control}>
                Сбросить фильтры
              </button>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map((model) => (
              <article
                key={model.id}
                data-testid="price-example"
                className="overflow-hidden rounded-2xl border bg-white"
              >
                <button
                  onClick={() => open(model)}
                  className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"
                  aria-label={`Посмотреть кухню: ${model.name}`}
                >
                  <div className="relative aspect-[3/2] bg-stone-100">
                    <Image
                      src={optimizedImageSrc(exampleImage(model))!}
                      alt={`${model.name}, общий вид — пример дизайна`}
                      fill
                      sizes="(max-width: 767px) 94vw, (max-width: 1279px) 46vw, 31vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-stone-500">
                      {
                        priceStyles.find((item) => item.id === model.style)
                          ?.label
                      }{" "}
                      · {model.dimensions}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{model.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {model.facadeMaterial} · {model.height}
                    </p>
                    <p className="mt-4 text-xs text-stone-500">
                      Ориентир по рынку за мебель
                    </p>
                    <p className="text-xl font-black">{marketRange(model)}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Без техники, доставки и монтажа. Не цена КухниBY.
                    </p>
                    <span className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-amber-800">
                      4 ракурса и комплектация →
                    </span>
                  </div>
                </button>
                <div className="border-t p-3">
                  <button
                    onClick={() => compare(model.id)}
                    aria-pressed={compared.includes(model.id)}
                    disabled={
                      !compared.includes(model.id) && compared.length === 3
                    }
                    className={`${control} w-full disabled:opacity-50`}
                  >
                    {compared.includes(model.id)
                      ? "Убрать из сравнения"
                      : "Добавить к сравнению"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-xl border bg-white p-6">
              <p className="font-bold">Такого сочетания пока нет в примерах</p>
              <p className="my-3 text-sm">
                Сбросьте часть фильтров или отправьте размеры для
                индивидуального проекта.
              </p>
              <button onClick={reset} className={control}>
                Показать все примеры
              </button>
              <a href="#calculate" className={`${primary} ml-2 mt-2`}>
                Запросить расчёт
              </a>
            </div>
          )}
          {filtered.length > visible && (
            <button
              onClick={() => setVisible((old) => old + 6)}
              className={`${control} mx-auto mt-6 block w-full sm:w-auto`}
            >
              Показать ещё {Math.min(6, filtered.length - visible)} примеров
            </button>
          )}
          <p className="mt-4 text-xs leading-5 text-stone-600">
            Все изображения созданы с помощью ИИ и показывают варианты дизайна.
            Выполненные заказы смотрите в{" "}
            <Link className="underline" href="/portfolio">
              портфолио
            </Link>
            .
          </p>
        </div>
      </section>
      <section id="comparison" className="container-site scroll-mt-24 py-10">
        <h2 className="text-2xl font-black">Сравните комплектации кухни</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Добавьте до трёх вариантов. Сравнивайте одинаковые размеры, материалы
          и состав работ: одна только итоговая сумма мало что объясняет.
        </p>
        {compared.length === 0 ? (
          <a
            className={`${control} mt-4 inline-flex items-center`}
            href="#catalog"
          >
            Выбрать примеры для сравнения
          </a>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {compared.map((id) => {
              const model = priceExamples.find((item) => item.id === id)!;
              return (
                <article key={id} className="rounded-xl border p-4">
                  <h3 className="font-bold">{model.name}</h3>
                  <p className="my-2 text-lg font-black">
                    {marketRange(model)}
                  </p>
                  <p className="text-xs text-stone-600">
                    Рыночный ориентир за мебель, не предложение КухниBY
                  </p>
                  <Specification model={model} />
                  <p className="my-3 text-sm">
                    Отдельно: {model.exclude.join("; ").toLowerCase()}.
                  </p>
                  <button
                    className={`${primary} w-full`}
                    onClick={() => {
                      setRequest(model);
                      document
                        .getElementById("calculate")
                        ?.scrollIntoView({ behavior: "instant" });
                    }}
                  >
                    Рассчитать этот вариант
                  </button>
                  <button
                    className={`${control} mt-2 w-full`}
                    onClick={() => compare(id)}
                  >
                    Убрать из сравнения
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
      {children}
      <section id="calculate" className="scroll-mt-24 bg-[#f8f5f0] py-10">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              Узнайте стоимость своей кухни
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600">
              Укажите размеры и пожелания. В расчёте отдельно проверим мебель,
              столешницу, фурнитуру, технику, доставку и монтаж. Выбранный
              пример и параметры отправятся вместе с заявкой.
            </p>
            {request && (
              <div className="mt-4 rounded-xl border bg-white p-4">
                <p className="font-bold">{request.name}</p>
                <p className="mt-1 text-sm">
                  {request.dimensions} · {request.facadeMaterial}
                </p>
                <button
                  className={`${control} mt-3`}
                  onClick={() => setRequest(null)}
                >
                  Убрать выбранный пример
                </button>
              </div>
            )}
            <Link
              href="/calculator"
              className={`${control} mt-5 inline-flex items-center`}
            >
              Открыть калькулятор кухни
            </Link>
          </div>
          <ContactForm
            compact
            showDimensions
            showComment
            defaultDimensions={request?.dimensions}
            source="prices"
            sourceType="prices"
            formType="prices-visual-catalog"
            formLocation="prices-visual-catalog"
            showCity
            showKitchenType
            showHasMeasurements
            defaultKitchenType={request ? kitchenType(request) : undefined}
            defaultComment={
              request
                ? `Прошу рассчитать ${request.name}, ${request.dimensions}, ${request.facadeMaterial}.`
                : undefined
            }
            defaultAnswers={{
              exampleId: request?.id ?? null,
              comparedExamples: compared,
              filters,
            }}
            submitLabel="Получить расчёт моей кухни"
          />
        </div>
      </section>
      {selected && (
        <ModelDialog key={selected.id} model={selected} onClose={close} />
      )}
    </>
  );
}
