"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import {
  MATERIAL_CRITERIA,
  MATERIAL_PRICE_SCENARIOS,
  MATERIAL_SOLUTIONS,
  materialById,
} from "@/data/material-solutions";
import { MATERIAL_PHOTOS } from "@/data/material-hub-gallery";
import { comparisonHref } from "@/lib/material-selection";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import {
  MaterialDetailsLink,
  SelectionButtons,
  materialButton,
  useMaterials,
} from "./MaterialsSelection";

export function MaterialsSolutionCards() {
  return (
    <section id="solutions" className="scroll-mt-24">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-800">
          Шесть законченных решений
        </p>
        <h2 className="mt-2 text-3xl font-bold">Какую кухню хотите купить?</h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Начните с внешнего вида. Добавьте 2–3 варианта, чтобы сравнить
          покрытия, уход и комплектацию.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MATERIAL_SOLUTIONS.map((m) => (
          <article
            key={m.id}
            data-material-id={m.id}
            className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
          >
            <Image
              src={m.image}
              alt={`Визуальный пример кухни: ${m.title.toLowerCase()}`}
              width={1200}
              height={800}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-5">
              <p className="text-xs text-stone-500">
                Визуальный пример · исполнение по образцу
              </p>
              <h3 className="mt-2 text-2xl font-bold">{m.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {m.description}
              </p>
              <p className="mt-3 text-sm leading-6">{m.question}</p>
              <div className="mt-4">
                <SelectionButtons id={m.id} />
              </div>
              <MaterialDetailsLink id={m.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MaterialsComparison() {
  const { state, updateView, removeFromCompare } = useMaterials();
  const [copy, setCopy] = useState("");
  const [link, setLink] = useState("");
  const selected = state.comparisonIds.map((id) => materialById(id)!);
  async function copyLink() {
    const value = new URL(comparisonHref(state), location.origin).href;
    setLink(value);
    try {
      await navigator.clipboard.writeText(value);
      setCopy("Ссылка скопирована");
    } catch {
      setCopy("Выделите и скопируйте ссылку ниже");
    }
  }
  return (
    <section
      id="compare"
      className="mt-14 scroll-mt-24 rounded-3xl bg-stone-100 p-4 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-violet-800">
        Ваш выбор сохраняется на 30 дней
      </p>
      <h2 className="mt-2 text-3xl font-bold">Сравните материалы фасадов</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Основа, покрытие и кромка работают вместе. Характеристики проверяют для
        конкретного исполнения; просмотр фотографий не меняет ваш выбор.
      </p>
      {!selected.length ? (
        <div className="mt-5 rounded-2xl bg-white p-5">
          <p>Добавьте варианты, чтобы сравнить.</p>
          <Link className={`${materialButton} mt-4`} href="#solutions">
            Выбрать материалы
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {selected.map((m) => (
              <div key={m.id} className="rounded-2xl bg-white p-4">
                <h3 className="font-bold">{m.title}</h3>
                <p className="my-2 text-sm text-violet-800">
                  {state.preferredId === m.id
                    ? "Предпочтительный вариант"
                    : "Добавлен к сравнению"}
                </p>
                <MaterialDetailsLink id={m.id} fromComparison />
                <SelectionButtons id={m.id} />
                <button
                  className={`${materialButton} mt-2`}
                  onClick={() => removeFromCompare(m.id)}
                  aria-label={`Убрать из сравнения ${m.title}`}
                >
                  Убрать
                </button>
              </div>
            ))}
          </div>
          {selected.length === 1 && (
            <Link className={`${materialButton} mt-4`} href="#solutions">
              Добавить второй вариант
            </Link>
          )}
          <label className="my-5 flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={state.onlyDifferences}
              onChange={(e) =>
                updateView({ onlyDifferences: e.target.checked })
              }
              className="h-5 w-5 accent-violet-800"
            />
            Только отличия
          </label>
          <dl className="grid gap-3">
            {MATERIAL_CRITERIA.filter(
              ([key]) =>
                !state.onlyDifferences ||
                selected.length === 1 ||
                new Set(selected.map((m) => m.values[key])).size > 1,
            ).map(([key, label]) => (
              <div key={key} className="rounded-2xl bg-white p-4">
                <dt className="border-b border-stone-200 pb-3 text-base font-bold">
                  {label}
                </dt>
                <dd
                  className={`mt-3 grid gap-4 ${selected.length === 3 ? "grid-cols-3" : selected.length === 2 ? "grid-cols-2" : ""}`}
                >
                  {selected.map((m) => (
                    <div key={m.id} className="min-w-0">
                      <p className="mb-2 break-words text-xs font-bold text-violet-800">
                        {m.title}
                      </p>
                      <p className="break-words text-sm leading-6">
                        {m.values[key]}
                      </p>
                      {key === "price" && <a href="#market-prices" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-violet-800 underline">Источники и состав</a>}
                    </div>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className={materialButton} onClick={copyLink}>
              Скопировать ссылку на сравнение
            </button>
            <Link className={materialButton} href="#materials-form">
              Рассчитать выбранные варианты
            </Link>
          </div>
          <p role="status" className="mt-2 text-sm">
            {copy}
          </p>
          {link && (
            <label className="mt-2 block text-sm">
              Ссылка на ваше сравнение
              <input
                readOnly
                value={link}
                onFocus={(e) => e.target.select()}
                className="mt-2 min-h-11 w-full rounded-xl border p-3"
              />
            </label>
          )}
        </>
      )}
    </section>
  );
}

const filterLabels: Record<string, string> = {
  material: "Материал",
  color: "Цвет",
  finish: "Поверхность",
  texture: "Фактура",
  milling: "Форма фасада",
  layout: "Планировка",
};
export function MaterialsPhotoGallery() {
  const { state, updateView, ready } = useMaterials();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (ready && !open && state.activePhoto && location.hash === "#gallery")
      document
        .getElementById(state.activePhoto)
        ?.scrollIntoView({ block: "center" });
  }, [ready, open, state.activePhoto]);
  const filters = state.galleryFilters;
  const filtered = useMemo(
    () =>
      MATERIAL_PHOTOS.filter((p) =>
        Object.entries(filters).every(
          ([key, value]) => !value || p[key as keyof typeof p] === value,
        ),
      ),
    [filters],
  );
  const index = Math.max(
    0,
    filtered.findIndex((p) => p.id === state.activePhoto),
  );
  const active = filtered[index];
  function photo(i: number) {
    const p = filtered[i];
    if (!p) return;
    updateView({
      activePhoto: p.id,
      recentViews: [p.id, ...state.recentViews.filter((x) => x !== p.id)].slice(
        0,
        10,
      ),
    });
  }
  return (
    <section id="gallery" className="mt-14 scroll-mt-24">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-800">
        Рассмотрите каждую деталь
      </p>
      <h2 className="mt-2 text-3xl font-bold">
        Фото кухонь и фасадов крупным планом
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-stone-600">
        {MATERIAL_PHOTOS.length} визуальных примера: кухни целиком, другой
        ракурс, фактура и торцы. Это иллюстрации для выбора дизайна; состав и
        доступность покрытия подтвердим по образцу.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(filterLabels).map(([key, label]) => (
          <label key={key} className="min-w-0 text-sm font-semibold">
            {label}
            <select
              aria-label={`Фильтр: ${label.toLowerCase()}`}
              value={filters[key] || ""}
              onChange={(e) =>
                updateView({
                  galleryFilters: { ...filters, [key]: e.target.value },
                  galleryLimit: 12,
                  activePhoto: null,
                })
              }
              className="mt-2 min-h-11 w-full min-w-0 rounded-xl border border-stone-300 bg-white px-2 text-sm"
            >
              <option value="">Все</option>
              {(key === "material"
                ? MATERIAL_SOLUTIONS.map((m) => ({
                    value: m.id,
                    label: m.title,
                  }))
                : [
                    ...new Set(
                      MATERIAL_PHOTOS.map((p) =>
                        String(p[key as keyof typeof p]),
                      ),
                    ),
                  ].map((v) => ({ value: v, label: v }))
              ).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-stone-600">
          Найдено: {filtered.length} · показано{" "}
          {Math.min(state.galleryLimit, filtered.length)}
        </p>
        <button
          className={materialButton}
          onClick={() =>
            updateView({
              galleryFilters: {},
              galleryLimit: 12,
              activePhoto: null,
            })
          }
        >
          Сбросить фильтры
        </button>
      </div>
      {!filtered.length && (
        <p className="rounded-2xl bg-stone-100 p-6">
          Такого сочетания в галерее пока нет. Снимите один фильтр или сбросьте
          фильтры.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, state.galleryLimit).map((p, i) => (
          <figure
            key={p.id}
            id={p.id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <button
              aria-label={`Увеличить фото: ${p.alt}`}
              onClick={() => {
                photo(i);
                setOpen(true);
              }}
              className="block w-full text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-violet-700"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={1200}
                height={800}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="aspect-[3/2] w-full object-cover"
              />
            </button>
            <figcaption className="p-4">
              <p className="text-xs font-semibold text-stone-500">
                Визуальный пример · {p.layout}
              </p>
              <p className="mt-2 text-sm leading-6">{p.caption}</p>
              <MaterialDetailsLink id={p.material} />
              <button
                className={`${materialButton} mt-2 w-full`}
                onClick={() => {
                  updateView({
                    galleryFilters: { ...filters, material: p.material },
                  });
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ block: "start" });
                }}
              >
                Ещё примеры этого решения
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
      {filtered.length > state.galleryLimit && (
        <button
          className={`${materialButton} mt-6 w-full`}
          onClick={() => updateView({ galleryLimit: state.galleryLimit + 12 })}
        >
          Показать ещё {Math.min(12, filtered.length - state.galleryLimit)} фото
        </button>
      )}
      {open && active && (
        <div className="my-4 rounded-2xl bg-violet-50 p-4">
          <p className="font-bold">{materialById(active.material)?.title}</p>
          <SelectionButtons id={active.material} />
          <MaterialDetailsLink id={active.material} />
        </div>
      )}
      <ImageLightbox
        images={filtered.map((p) => ({
          src: p.src,
          alt: p.alt,
          caption: `${p.caption} · Визуальный пример; точное исполнение по образцу.`,
        }))}
        open={open}
        currentIndex={index}
        onOpenChange={setOpen}
        onIndexChange={photo}
        label="Фотогалерея материалов кухни"
        footer={
          active && (
            <div className="mt-3 rounded-xl bg-white p-3 text-stone-900">
              <p className="mb-2 font-bold">
                Направление подбора: {materialById(active.material)?.title}
              </p>
              <SelectionButtons id={active.material} />
              <span onClick={() => setOpen(false)}>
                <MaterialDetailsLink id={active.material} />
              </span>
            </div>
          )
        }
      />
    </section>
  );
}

export function MaterialsPriceScenarios() {
  const { state, updateView } = useMaterials();
  const scenario =
    MATERIAL_PRICE_SCENARIOS.find((x) => x.id === state.scenarioId) ||
    MATERIAL_PRICE_SCENARIOS[0];
  return (
    <section
      id="prices"
      className="mt-14 scroll-mt-24 rounded-3xl border border-stone-200 bg-white p-5 sm:p-8"
    >
      <h2 className="text-3xl font-bold">
        Цена кухни: сравнивайте одинаковую комплектацию
      </h2>
      <p className="mt-3 leading-7 text-stone-600">
        Цена фасада за м², цена за погонный метр и стоимость кухни с установкой
        — разные показатели. Чтобы купить кухню по своим размерам, сравните один
        проект с разными покрытиями.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {MATERIAL_PRICE_SCENARIOS.map((s) => (
          <button
            className={materialButton}
            key={s.id}
            aria-pressed={s.id === scenario.id}
            onClick={() => updateView({ scenarioId: s.id })}
          >
            {s.title}
          </button>
        ))}
      </div>
      <h3 className="mt-5 text-xl font-bold">{scenario.title}</h3>
      <p className="mt-3 text-sm leading-7">{scenario.equipment}</p>
      <p className="mt-3 text-sm leading-7">{scenario.services}</p>
      <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6">
        Это пример состава для сравнения, а не готовая смета. Проверенной
        рыночной вилки для одинаковых комплектаций пока нет. Расчёт нашей кухни
        — в BYN по вашим размерам; материал корпуса, количество ящиков и состав
        услуг укажем отдельно.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className={materialButton} href="#materials-form">
          Рассчитать мою комплектацию
        </Link>
        <Link className={materialButton} href="/prices">
          Что входит в стоимость кухни
        </Link>
        <Link className={materialButton} href="/calculator">
          Калькулятор по размерам
        </Link>
      </div>
    </section>
  );
}

export function MaterialsChoiceHelper() {
  const [want, setWant] = useState("");
  const options = [
    [
      "budget",
      "Сдержать бюджет",
      ["ldsp", "mdf-film"],
      "Начните с ЛДСП и плёнки: сравните одинаковые размеры, число ящиков и класс механизмов.",
    ],
    [
      "milling",
      "Рамка и фрезеровка",
      ["mdf-film", "mdf-enamel"],
      "Посмотрите исполнения на МДФ. Рисунок профиля и покрытие согласуйте по образцу.",
    ],
    [
      "wood",
      "Рисунок дерева",
      ["ldsp", "veneer"],
      "Сопоставьте древесный декор и натуральный шпон: внешний вид, отделка и раскладка отличаются.",
    ],
    [
      "flat",
      "Гладкие современные фасады",
      ["hpl", "acrylic", "mdf-enamel"],
      "Сравните отражения, торец и следы на образцах. По фотографии нельзя определить стойкость покрытия.",
    ],
  ] as const;
  const active = options.find((o) => o[0] === want);
  return (
    <section className="mt-14">
      <h2 className="text-3xl font-bold">Что для вас важнее при выборе?</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {options.map((o) => (
          <button
            key={o[0]}
            aria-pressed={want === o[0]}
            className={materialButton}
            onClick={() => setWant(o[0])}
          >
            {o[1]}
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 rounded-2xl bg-violet-50 p-5">
          <p className="leading-7">{active[3]}</p>
          <p className="mt-2 text-sm">
            Рекомендация не добавляет варианты автоматически.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {active[2].map((id) => (
              <MaterialDetailsLink key={id} id={id}>
                {materialById(id)!.title} →
              </MaterialDetailsLink>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function MaterialsLeadSummary() {
  const { state, removeFromCompare } = useMaterials();
  return (
    <div className="mb-5 rounded-2xl bg-violet-50 p-5">
      <h3 className="font-bold">Что передадим на расчёт</h3>
      {state.comparisonIds.length ? (
        <>
          <ul className="mt-3 grid gap-2">
            {state.comparisonIds.map((id) => (
              <li
                key={id}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <MaterialDetailsLink id={id}>
                  {materialById(id)!.title}
                  {state.preferredId === id ? " · Предпочитаю" : ""}
                </MaterialDetailsLink>
                <button
                  className={materialButton}
                  onClick={() => removeFromCompare(id)}
                >
                  Убрать {materialById(id)!.title}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Пример:{" "}
            {
              MATERIAL_PRICE_SCENARIOS.find((s) => s.id === state.scenarioId)
                ?.title
            }
            . Свои размеры укажите в форме.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm">
          Материалы пока не выбраны. Можно отправить заявку «Помогите выбрать».
        </p>
      )}
    </div>
  );
}
