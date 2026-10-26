"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import {
  MaterialDetailsLink,
  SelectionButtons,
  materialButton,
  useMaterials,
} from "./MaterialsSelection";
import { HPL_PHOTOS } from "@/data/hpl-content";
import {
  MATERIAL_PRICE_SCENARIOS,
  materialById,
} from "@/data/material-solutions";
import { MATERIAL_PHOTOS } from "@/data/material-hub-gallery";
import type { MaterialState } from "@/lib/material-selection";

const section = "mt-10 scroll-mt-24";
const note = "text-sm leading-6 text-stone-600";
const button = `${materialButton} aria-pressed:border-violet-800 aria-pressed:bg-violet-50 aria-pressed:text-violet-950`;
type HplView = MaterialState["hplView"];
function useHplView() {
  const { state, updateView } = useMaterials();
  return {
    view: state.hplView,
    update: (patch: Partial<HplView>) =>
      updateView({ hplView: { ...state.hplView, ...patch } }),
  };
}

function SwitchPhoto({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
      <Image
        key={src}
        src={src}
        alt={alt}
        width={1200}
        height={800}
        unoptimized
        loading="eager"
        onLoad={() => setLoaded(src)}
        onError={() => setFailed(src)}
        className="h-full w-full object-cover"
      />
      {loaded !== src && (
        <p
          role="status"
          className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 px-3 py-2 text-sm text-stone-800"
        >
          {failed === src ? (
            <>
              Не удалось загрузить фото.{" "}
              <a
                className="underline"
                href={src}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть изображение
              </a>
            </>
          ) : (
            "Загружаем фото…"
          )}
        </p>
      )}
    </div>
  );
}

export function HplActions() {
  const { openComparison } = useMaterials();
  return (
    <div className="mt-5 space-y-3">
      <SelectionButtons id="hpl" />
      <div className="flex flex-wrap gap-2">
        <a
          href="#materials-form"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          Рассчитать по своим размерам
        </a>
        <button
          type="button"
          className={materialButton}
          onClick={openComparison}
        >
          Моё сравнение
        </button>
      </div>
    </div>
  );
}

export function HplConstruction() {
  const { view, update } = useHplView();
  const bases = [
    {
      title: "Основание МДФ",
      text: "Мелкая однородная структура древесных волокон. Плиту, толщину, размеры и крепления согласуем под фасад. Само название МДФ не гарантирует влагостойкость готовой дверцы.",
    },
    {
      title: "Основание ДСП",
      text: "Древесно-стружечная основа с видимыми частицами на срезе. Конкретную плиту подбираем по конструкции и размерам деталей; торцы и обратную сторону фиксируем отдельно.",
    },
  ];
  return (
    <section
      id="hpl-construction"
      className={section}
      aria-labelledby="hpl-construction-title"
    >
      <h2
        id="hpl-construction-title"
        className="text-2xl font-bold md:text-3xl"
      >
        Что внутри фасада: МДФ или ДСП + HPL + кромка
      </h2>
      <p className={`${note} mt-3 max-w-3xl`}>
        Основные основания, с которыми мы работаем, — МДФ и ДСП. Мы сами
        приклеиваем HPL к основе и выполняем кромление. Корпус кухни и
        столешница — отдельные детали заказа.
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-3xl bg-white">
          <Image
            src={HPL_PHOTOS[5].src}
            alt={HPL_PHOTOS[5].alt}
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[3/2] w-full object-contain"
          />
          <figcaption className="p-4 text-xs leading-5 text-stone-600">
            {HPL_PHOTOS[5].caption} Создано с помощью ИИ.
          </figcaption>
        </figure>
        <div className="rounded-3xl border border-stone-200 bg-white p-5 md:p-7">
          <div className="flex flex-wrap gap-2" aria-label="Основание фасада">
            {bases.map((base, i) => (
              <button
                key={base.title}
                type="button"
                className={button}
                aria-pressed={view.base === i}
                onClick={() => update({ base: i })}
              >
                {base.title}
              </button>
            ))}
          </div>
          <div className="mt-5" aria-live="polite">
            <h3 className="text-xl font-bold">{bases[view.base].title}</h3>
            <p className={`${note} mt-2`}>{bases[view.base].text}</p>
          </div>
          <ol className="mt-5 space-y-3 text-sm leading-6">
            {[
              "Облицовка HPL — внешний декоративный слой выбранной серии.",
              "Основание — МДФ или ДСП согласованной толщины.",
              "Торец — отдельно приклеенная кромка, её материал и вид стыка согласуем.",
              "Обратная сторона — покрытие по спецификации, не обязательно как лицевая.",
            ].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="font-bold text-violet-800">0{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3">
            <MaterialDetailsLink id="mdf-film">
              МДФ и его покрытия →
            </MaterialDetailsLink>
            <MaterialDetailsLink id="ldsp">
              Фасады и корпуса ЛДСП →
            </MaterialDetailsLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HplFinishes() {
  const { view, update } = useHplView();
  const p = HPL_PHOTOS[view.finish === 0 ? 1 : 4];
  return (
    <section
      id="hpl-finish"
      className={section}
      aria-labelledby="hpl-finish-title"
    >
      <h2 id="hpl-finish-title" className="text-2xl font-bold md:text-3xl">
        Матовая или глянцевая: посмотрите на свет
      </h2>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Финиш для просмотра"
      >
        {["Матовая поверхность", "Глянцевая поверхность"].map((label, i) => (
          <button
            type="button"
            key={label}
            className={button}
            aria-pressed={view.finish === i}
            onClick={() => update({ finish: i })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.3fr_1fr]">
        <SwitchPhoto src={p.src} alt={p.alt} />
        <div className="p-5 md:p-7" aria-live="polite">
          <h3 className="text-xl font-bold">
            {view.finish === 0 ? "Мягкое отражение" : "Выраженные отражения"}
          </h3>
          <p className={`${note} mt-3`}>
            {view.finish === 0
              ? "Матовая поверхность рассеивает свет. На тёмном и суперматовом образце проверьте следы от пальцев: слово «матовый» не означает, что их не будет."
              : "Глянец отражает окно и подсветку. Сравните блики, заметность разводов и правила очистки на образце нужной серии."}
          </p>
          <p className={`${note} mt-3`}>
            Цвет и степень блеска выбираем из доступных коллекций. Фото
            показывает идею; окончательный выбор — по образцу при вашем
            освещении.
          </p>
          <p className="mt-4 text-xs text-stone-500">
            ИИ-иллюстрация, не подтверждение наличия декора.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HplGallery() {
  const { state, updateView } = useMaterials();
  const { view, update } = useHplView();
  const [open, setOpen] = useState(false);
  const photos = HPL_PHOTOS.filter(
    (p) =>
      (!view.color || p.color === view.color) &&
      (!view.layout || p.layout === view.layout) &&
      (!view.texture || p.texture === view.texture),
  );
  const active = Math.max(
    0,
    photos.findIndex((p) => p.id === view.photo),
  );
  const change = (index: number) => {
    const p = photos[index];
    if (!p) return;
    const id = MATERIAL_PHOTOS.find((item) => item.src === p.src)?.id || p.id;
    updateView({
      hplView: { ...view, photo: p.id },
      recentViews: [id, ...state.recentViews.filter((x) => x !== id)].slice(
        0,
        10,
      ),
    });
  };
  return (
    <section
      id="hpl-gallery"
      className={section}
      aria-labelledby="hpl-gallery-title"
    >
      <h2 id="hpl-gallery-title" className="text-2xl font-bold md:text-3xl">
        Кухня целиком и детали, которые хочется рассмотреть
      </h2>
      <p className={`${note} mt-3`}>
        Цвет, рисунок и планировка помогают выбрать направление. Просмотр
        фотографии сохраняется отдельно от материалов для расчёта.
      </p>
      <div className="my-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            key: "color",
            label: "Цвет",
            options: ["Светлые", "Тёмные", "Древесные", "Цветные"],
          },
          {
            key: "texture",
            label: "Фактура",
            options: ["Однотонная", "Под дерево", "Комбинированная"],
          },
          {
            key: "layout",
            label: "Планировка",
            options: ["Прямая", "Угловая", "С островом", "Деталь"],
          },
        ].map((f) => (
          <label key={f.key} className="text-sm font-semibold">
            {f.label}
            <select
              className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 focus-visible:outline-violet-700"
              value={view[f.key as "color" | "texture" | "layout"]}
              onChange={(e) =>
                update({ [f.key]: e.target.value, limit: 6, photo: null })
              }
            >
              <option value="">Все варианты</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p role="status" className="mb-3 text-sm text-stone-600">
        Найдено примеров: {photos.length}
      </p>
      {photos.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.slice(0, view.limit).map((p) => (
            <figure key={p.id} className="overflow-hidden rounded-2xl bg-white">
              <button
                type="button"
                className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-700"
                aria-label={`Увеличить: ${p.alt}`}
                onClick={() => {
                  change(photos.indexOf(p));
                  setOpen(true);
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              </button>
              <figcaption className="p-4 text-sm leading-6">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p>
            Такого сочетания в галерее пока нет. Сбросьте фильтры или обсудите
            нужное исполнение при расчёте.
          </p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {photos.length > view.limit && (
          <button
            type="button"
            className={materialButton}
            onClick={() => update({ limit: view.limit + 6 })}
          >
            Показать ещё примеры
          </button>
        )}
        <button
          type="button"
          className={materialButton}
          onClick={() =>
            update({
              color: "",
              texture: "",
              layout: "",
              limit: 6,
              photo: null,
            })
          }
        >
          Сбросить фильтры
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500">
        Изображения — визуальные идеи, созданные с помощью ИИ, а не фотографии
        выполненных заказов. Иллюстрации не устанавливают материал, точный
        оттенок или качество партии.
      </p>
      <ImageLightbox
        images={photos}
        open={open}
        currentIndex={active}
        onOpenChange={setOpen}
        onIndexChange={change}
        label="Примеры кухонь с HPL и деталей фасада"
        footer={<SelectionButtons id="hpl" />}
      />
    </section>
  );
}

export function HplRooms() {
  const { view, update } = useHplView();
  const rooms = [
    {
      title: "Квартира и новостройка",
      photo: 1,
      text: "Для студии и небольшой квартиры проверим рабочую поверхность, хранение и открывание техники. В новостройке перед установкой согласуем готовность стен, пола и влажность после отделки.",
    },
    {
      title: "Дом и кухня-гостиная",
      photo: 3,
      text: "В частном или загородном доме свяжем цвет фасадов с жилой зоной. Для острова, семьи с детьми и ежедневной готовки важны проходы, удобные ручки и доступ к часто используемым ящикам.",
    },
    {
      title: "Дача и деревенский дом",
      photo: 2,
      text: "Уточним отопление зимой, вентиляцию и перепады влажности. Для сезонной или неотапливаемой дачи пригодность согласуем по документам материалов; HPL сам по себе не делает всю кухню водостойкой.",
    },
  ];
  const room = rooms[view.room];
  return (
    <section
      id="hpl-rooms"
      className={section}
      aria-labelledby="hpl-rooms-title"
    >
      <h2 id="hpl-rooms-title" className="text-2xl font-bold md:text-3xl">
        Для какого помещения выбираете кухню?
      </h2>
      <div className="my-4 flex flex-wrap gap-2" aria-label="Помещение">
        {rooms.map((r, i) => (
          <button
            type="button"
            key={r.title}
            className={button}
            aria-pressed={view.room === i}
            onClick={() => update({ room: i })}
          >
            {r.title}
          </button>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.3fr_1fr]">
        <SwitchPhoto
          src={HPL_PHOTOS[room.photo].src}
          alt={HPL_PHOTOS[room.photo].alt}
        />
        <div className="p-5 md:p-7" aria-live="polite">
          <h3 className="text-xl font-bold">{room.title}</h3>
          <p className={`${note} mt-3`}>{room.text}</p>
          <p className={`${note} mt-3`}>
            Для съёмной квартиры согласуйте бюджет и условия монтажа с
            собственником. Выезд, доставку и установку в деревне, посёлке или
            агрогородке уточним по адресу.
          </p>
          <p className="mt-4 text-xs text-stone-500">
            Иллюстрация создана с помощью ИИ.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HplComparison() {
  const { view, update } = useHplView();
  const { openComparison } = useMaterials();
  const alt = materialById(view.alternative)!;
  const text: Record<string, string> = {
    acrylic:
      "Сравните конкретные поверхности: глубину отражения, следы, торец и правила ухода. Акриловые панели бывают разными — вывод по одному образцу не переносим на все серии.",
    "mdf-enamel":
      "Эмаль — окрашенная поверхность, HPL — приклеенная облицовка. Для фрезерованного рисунка посмотрите эмаль, для гладкого готового декора — конкретную серию HPL. Подробный разбор находится на странице эмали.",
    ldsp: "У ЛДСП декоративное покрытие уже связано с плитой, у нашего HPL-фасада облицовку приклеиваем к выбранной основе. Сопоставляйте торец, образец поверхности и одну комплектацию.",
  };
  return (
    <section
      id="hpl-alternatives"
      className={section}
      aria-labelledby="hpl-alternatives-title"
    >
      <h2
        id="hpl-alternatives-title"
        className="text-2xl font-bold md:text-3xl"
      >
        HPL, акрил, эмаль или ЛДСП: сравните конкретные решения
      </h2>
      <div className="my-4 flex flex-wrap gap-2" aria-label="Альтернатива HPL">
        {[
          ["acrylic", "С акрилом"],
          ["mdf-enamel", "С эмалью"],
          ["ldsp", "С ЛДСП"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={button}
            aria-pressed={view.alternative === id}
            onClick={() => update({ alternative: id })}
          >
            {label}
          </button>
        ))}
      </div>
      <p role="status" className="mb-3 text-sm font-semibold text-violet-900">
        Сравниваем HPL и {alt.title.toLowerCase()}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            id: "hpl",
            title: "Фасады с HPL",
            image: HPL_PHOTOS[0].src,
            text: "Мы приклеиваем HPL к МДФ или ДСП и сами кромим фасады. Для заказа согласуем основание, декор, обратную сторону и торец.",
          },
          {
            id: alt.id,
            title: alt.title,
            image: alt.image,
            text: text[alt.id],
          },
        ].map((m) => (
          <article
            key={m.id}
            data-comparison-material={m.id}
            className={`overflow-hidden rounded-3xl bg-white ${m.id === "hpl" ? "order-2 md:order-1" : "order-1 md:order-2"}`}
          >
            <SwitchPhoto
              src={m.image}
              alt={`Визуальная идея для сравнения: ${m.title}`}
            />
            <div className="p-5">
              <h3 className="text-xl font-bold">{m.title}</h3>
              <p className={`${note} my-3`}>{m.text}</p>
              <SelectionButtons id={m.id} />
              {m.id !== "hpl" && (
                <MaterialDetailsLink id={m.id}>
                  Фото, свойства и подробности →
                </MaterialDetailsLink>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className={`${note} mt-3`}>
        У каждого решения есть преимущества и ограничения. Сравниваем одинаковые
        размеры, корпус, столешницу, ящики и услуги. Условных оценок «прочность
        9 из 10» и обещания отсутствия царапин здесь нет.
      </p>
      <button
        type="button"
        className={`${materialButton} mt-3`}
        onClick={openComparison}
      >
        Открыть моё сравнение
      </button>
      <div className="mt-3 flex flex-wrap gap-x-5">
        <MaterialDetailsLink id="mdf-film">МДФ в плёнке →</MaterialDetailsLink>
        <MaterialDetailsLink id="veneer">
          Натуральный шпон →
        </MaterialDetailsLink>
      </div>
    </section>
  );
}

export function HplPriceScenarios() {
  const { state, updateView } = useMaterials();
  const scenario =
    MATERIAL_PRICE_SCENARIOS.find((s) => s.id === state.scenarioId) ||
    MATERIAL_PRICE_SCENARIOS[0];
  const p = HPL_PHOTOS[scenario.id === "straight-3m" ? 1 : 0];
  return (
    <section
      id="hpl-price"
      className={section}
      aria-labelledby="hpl-price-title"
    >
      <h2 id="hpl-price-title" className="text-2xl font-bold md:text-3xl">
        Сколько стоит кухня с HPL: сначала состав, затем смета
      </h2>
      <p className={`${note} mt-3`}>
        Для сравнения материалов используем два общих состава. Расчёт нашей
        кухни — в BYN по вашим размерам, выбранным фасадам и комплектации.
      </p>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Комплектация для сравнения"
      >
        {MATERIAL_PRICE_SCENARIOS.map((s) => (
          <button
            type="button"
            key={s.id}
            className={button}
            aria-pressed={scenario.id === s.id}
            onClick={() => updateView({ scenarioId: s.id })}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.2fr_1fr]">
        <figure>
          <SwitchPhoto src={p.src} alt={p.alt} />
          <figcaption className="p-4 text-xs leading-5 text-stone-600">
            ИИ-иллюстрация планировки. Фото не задаёт точные размеры и состав
            сметы.
          </figcaption>
        </figure>
        <div className="p-5 md:p-7" aria-live="polite">
          <h3 className="text-xl font-bold">{scenario.title}</h3>
          <p className="mt-2 font-semibold">{scenario.dimensions}</p>
          <p className={`${note} mt-3`}>{scenario.equipment}</p>
          <p className={`${note} mt-3`}>{scenario.services}</p>
          <p className="mt-4 rounded-xl bg-violet-50 p-4 text-sm leading-6">
            Размеры, фурнитуру и состав кухни фиксируем перед расчётом.
            Стоимость нашей кухни подтвердим отдельной сметой.
          </p>
          <a href="#materials-form" className={`${materialButton} mt-4`}>
            Получить расчёт в BYN
          </a>
        </div>
      </div>
    </section>
  );
}
