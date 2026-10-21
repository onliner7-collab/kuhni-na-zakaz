"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { ACRYLIC_PHOTOS } from "@/data/acrylic-content";
import { MATERIAL_PHOTOS } from "@/data/material-hub-gallery";
import {
  MATERIAL_PRICE_SCENARIOS,
  materialById,
} from "@/data/material-solutions";
import type { MaterialState } from "@/lib/material-selection";
import {
  MaterialDetailsLink,
  SelectionButtons,
  materialButton,
  useMaterials,
} from "./MaterialsSelection";

const section = "mt-10 scroll-mt-24";
const note = "text-sm leading-6 text-stone-600";
const button = `${materialButton} aria-pressed:border-violet-800 aria-pressed:bg-violet-50`;
function useView() {
  const { state, updateView } = useMaterials();
  return {
    view: state.acrylicView,
    update: (patch: Partial<MaterialState["acrylicView"]>) =>
      updateView({ acrylicView: { ...state.acrylicView, ...patch } }),
  };
}
function Photo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <div className="relative aspect-[3/2] bg-stone-100">
      <Image
        key={src}
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-full w-full object-cover"
        onError={() => setFailed(src)}
      />
      {failed === src && (
        <p
          role="status"
          className="absolute inset-x-3 bottom-3 rounded-lg bg-white p-3 text-sm"
        >
          Не удалось загрузить изображение.{" "}
          <a href={src} className="underline">
            Открыть файл
          </a>
        </p>
      )}
    </div>
  );
}
export function AcrylicActions() {
  const { openComparison } = useMaterials();
  return (
    <div className="mt-5 space-y-3">
      <SelectionButtons id="acrylic" />
      <div className="flex flex-wrap gap-2">
        <a
          href="#materials-form"
          className="inline-flex min-h-11 items-center rounded-xl bg-violet-800 px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
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
export function AcrylicSurface() {
  const { view, update } = useView();
  const options = [
    {
      title: "Глянец под углом",
      photo: 5,
      text: "Посмотрите на отражение окна, ровность блика и линию между дверцами. Оттенок и заметность следов оценивайте при дневном и искусственном свете на образце выбранной серии.",
    },
    {
      title: "Мат и глянец",
      photo: 6,
      text: "Матовый образец рассеивает свет, глянцевый отражает окружение. Это визуальная идея: доступность матового акрила и защитного слоя уточняем отдельно. Слово «матовый» не означает отсутствие отпечатков.",
    },
    {
      title: "Торец крупным планом",
      photo: 7,
      text: "Уточните материал кромки, цвет, толщину и вид стыка. Проверьте углы и обратную сторону физического образца. Иллюстрация не подтверждает бесшовное соединение, лазерную технологию или влагостойкость дверцы.",
    },
  ];
  const selected = options[view.surface];
  return (
    <section
      id="acrylic-surface"
      className={section}
      aria-labelledby="acrylic-surface-title"
    >
      <h2 id="acrylic-surface-title" className="text-2xl font-bold md:text-3xl">
        Поверхность, отражения и торец — рассмотрите вблизи
      </h2>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Ракурс акрилового фасада"
      >
        {options.map((o, i) => (
          <button
            type="button"
            key={o.title}
            className={button}
            aria-pressed={view.surface === i}
            onClick={() => update({ surface: i })}
          >
            {o.title}
          </button>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[1.3fr_1fr]">
        <Photo
          src={ACRYLIC_PHOTOS[selected.photo].src}
          alt={ACRYLIC_PHOTOS[selected.photo].alt}
        />
        <div className="p-5 md:p-7" aria-live="polite">
          <h3 className="text-xl font-bold">{selected.title}</h3>
          <p className={`${note} mt-3`}>{selected.text}</p>
          <p className="mt-4 text-xs text-stone-500">
            Условный пример, созданный с помощью ИИ. Решение принимают по
            реальному образцу.
          </p>
        </div>
      </div>
    </section>
  );
}
export function AcrylicGallery() {
  const { view, update } = useView();
  const { state, updateView } = useMaterials();
  const [open, setOpen] = useState(false);
  const photos = ACRYLIC_PHOTOS.filter(
    (p) =>
      (!view.color || p.color === view.color) &&
      (!view.layout || p.layout === view.layout),
  );
  const index = Math.max(
    0,
    photos.findIndex((p) => p.id === view.photo),
  );
  const change = (i: number) => {
    const p = photos[i];
    if (!p) return;
    const id = MATERIAL_PHOTOS.find((x) => x.src === p.src)?.id || p.id;
    updateView({
      acrylicView: { ...view, photo: p.id },
      recentViews: [id, ...state.recentViews.filter((x) => x !== id)].slice(
        0,
        10,
      ),
    });
  };
  return (
    <section
      id="acrylic-gallery"
      className={section}
      aria-labelledby="acrylic-gallery-title"
    >
      <h2 id="acrylic-gallery-title" className="text-2xl font-bold md:text-3xl">
        Примеры акриловых кухонь и деталей фасада
      </h2>
      <p className={`${note} mt-3`}>
        Выберите внешний вид и планировку. Все новые изображения —
        ИИ-иллюстрации для подбора направления; наличие декоров и конструкцию
        согласуем отдельно.
      </p>
      <div className="my-4 grid gap-3 sm:grid-cols-2">
        {[
          {
            key: "color" as const,
            label: "Цвет примера",
            options: ["Светлые", "Тёмные", "Цветные"],
          },
          {
            key: "layout" as const,
            label: "Планировка примера",
            options: ["Прямая", "Угловая", "С островом", "Деталь"],
          },
        ].map((f) => (
          <label key={f.key} className="text-sm font-semibold">
            {f.label}
            <select
              className="mt-2 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 focus-visible:outline-violet-700"
              value={view[f.key]}
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
        <p className="rounded-2xl bg-white p-5">
          Такого сочетания пока нет. Сбросьте фильтры или обсудите нужный
          вариант при расчёте.
        </p>
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
            update({ color: "", layout: "", limit: 6, photo: null })
          }
        >
          Сбросить фильтры
        </button>
      </div>
      <ImageLightbox
        images={photos}
        open={open}
        currentIndex={index}
        onOpenChange={setOpen}
        onIndexChange={change}
        label="Примеры акриловых кухонь"
        footer={<SelectionButtons id="acrylic" />}
      />
    </section>
  );
}
export function AcrylicRooms() {
  const { view, update } = useView();
  const rooms = [
    {
      title: "Квартира и новостройка",
      photo: 1,
      text: "Для маленькой кухни и студии сначала распределим хранение, мойку и рабочую поверхность. В новостройке важны готовые размеры, коммуникации и просохшая отделка. Глянец отражает комнату, поэтому оцените и то, что окажется напротив фасадов.",
    },
    {
      title: "Дом и кухня-гостиная",
      photo: 2,
      text: "В частном доме свяжем оттенки кухни и жилой зоны. Остров, высокие шкафы и встроенная техника требуют проверки проходов. Для семьи с детьми посмотрите следы после прикосновения и удобство ручек на настоящем образце.",
    },
    {
      title: "Дача и деревенский дом",
      photo: 3,
      text: "Для дачи уточните отопление зимой, вентиляцию и перепады влажности. Пригодность для неотапливаемого дома согласуется по документам конструкции. Доставку, выезд на замер и установку в деревне или посёлке обсуждаем по адресу.",
    },
  ];
  const selected = rooms[view.room];
  return (
    <section
      id="acrylic-rooms"
      className={section}
      aria-labelledby="acrylic-rooms-title"
    >
      <h2 id="acrylic-rooms-title" className="text-2xl font-bold md:text-3xl">
        Акриловая кухня для вашего помещения
      </h2>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Помещение для кухни"
      >
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
        <Photo
          src={ACRYLIC_PHOTOS[selected.photo].src}
          alt={ACRYLIC_PHOTOS[selected.photo].alt}
        />
        <div className="p-5 md:p-7" aria-live="polite">
          <h3 className="text-xl font-bold">{selected.title}</h3>
          <p className={`${note} mt-3`}>{selected.text}</p>
          <p className="mt-4 text-xs text-stone-500">
            Визуальная идея, созданная с помощью ИИ.
          </p>
        </div>
      </div>
    </section>
  );
}
export function AcrylicComparison() {
  const { view, update } = useView();
  const alt = materialById(view.alternative)!;
  const texts: Record<string, string> = {
    hpl: "Сравните конкретный HPL и акрил по блику, торцу, следам и инструкции ухода. Слово «пластик» шире HPL. Устойчивость одного образца нельзя переносить на все серии.",
    "mdf-enamel":
      "Эмаль — окрашенная поверхность, акрил — облицовка выбранной конструкции. Если нужна фрезеровка или определённый выкрас, обсудите эмаль; цвет, ремонт и финиш проверяйте по технологии.",
    "mdf-film":
      "МДФ в плёнке — отдельное законченное исполнение. Сопоставьте внешний вид, рисунок, кромки и одну комплектацию. Сравнение «акрил или МДФ» требует уточнить покрытие МДФ.",
  };
  return (
    <section
      id="acrylic-alternatives"
      className={section}
      aria-labelledby="acrylic-alternatives-title"
    >
      <h2
        id="acrylic-alternatives-title"
        className="text-2xl font-bold md:text-3xl"
      >
        Акрил, HPL или эмаль: сравните образцы и состав кухни
      </h2>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Альтернатива акрилу"
      >
        {[
          ["hpl", "С HPL"],
          ["mdf-enamel", "С эмалью"],
          ["mdf-film", "С плёнкой"],
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
      <p className={`${note} mb-3`}>
        Визуальное сравнение: иллюстрации показывают направление дизайна, а не
        результат испытания покрытий.
      </p>
      <p role="status" className="mb-3 text-sm font-semibold text-violet-900">
        Сравниваем: акрил и {alt.title.toLowerCase()}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            id: "acrylic",
            title: "Акриловые фасады",
            image: ACRYLIC_PHOTOS[0].src,
            text: "Ровная поверхность и отражения — повод рассмотреть акриловый образец. Согласуем серию, основу, финиш, торец и правила ухода.",
          },
          { ...alt, text: texts[alt.id] },
        ].map((m) => (
          <article
            key={m.id}
            data-comparison-material={m.id}
            className={`overflow-hidden rounded-3xl bg-white ${m.id === "acrylic" ? "order-2 md:order-1" : "order-1 md:order-2"}`}
          >
            <Photo
              key={m.image}
              src={m.image}
              alt={`Визуальная идея для сравнения: ${m.title}`}
            />
            <div className="p-5">
              <h3 className="text-xl font-bold">{m.title}</h3>
              <p className={`${note} my-3`}>{m.text}</p>
              <SelectionButtons id={m.id} />
              {m.id !== "acrylic" && (
                <MaterialDetailsLink id={m.id}>
                  Фото и подробности →
                </MaterialDetailsLink>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <MaterialDetailsLink id="ldsp">
          Фасады и корпуса ЛДСП →
        </MaterialDetailsLink>
        <MaterialDetailsLink id="veneer">
          Натуральный шпон →
        </MaterialDetailsLink>
      </div>
    </section>
  );
}
export function AcrylicPrice() {
  const { state, updateView } = useMaterials();
  const source =
    MATERIAL_PRICE_SCENARIOS.find((s) => s.id === state.scenarioId) ||
    MATERIAL_PRICE_SCENARIOS[0];
  const scenario = {
    ...source,
    included: [source.dimensions, source.equipment],
    excluded: [source.services],
    assumptions: "Точный состав и размеры фиксируются в смете.",
  };
  const p = ACRYLIC_PHOTOS[scenario.id === "straight-3m" ? 1 : 0];
  return (
    <section
      id="acrylic-price"
      className={section}
      aria-labelledby="acrylic-price-title"
    >
      <h2 id="acrylic-price-title" className="text-2xl font-bold md:text-3xl">
        Цена акриловой кухни: сравниваем одинаковые комплектации
      </h2>
      <p className={`${note} mt-3`}>
        Расчёт в BYN по вашим размерам. Для сравнения покрытий используем общие
        составы кухни: смена примера не выбирает материал автоматически.
      </p>
      <div
        className="my-4 flex flex-wrap gap-2"
        aria-label="Состав кухни для расчёта"
      >
        {MATERIAL_PRICE_SCENARIOS.map((s) => (
          <button
            type="button"
            key={s.id}
            className={button}
            aria-pressed={s.id === scenario.id}
            onClick={() => updateView({ scenarioId: s.id })}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-2">
        <figure>
          <Photo src={p.src} alt={p.alt} />
          <figcaption className="p-4 text-xs text-stone-500">
            ИИ-иллюстрация планировки. Размеры и состав определяются описанием и
            замером.
          </figcaption>
        </figure>
        <div className="p-5">
          <h3 className="text-xl font-bold">{scenario.title}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-600">
            {scenario.included.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className={`${note} mt-3`}>
            Отдельно: {scenario.excluded.join(", ")}. Условия:{" "}
            {scenario.assumptions}
          </p>
          <p className={`${note} mt-3`}>
            Сопоставимая рыночная вилка пока не подтверждена. Рекламная цена за
            погонный метр или за м² фасада не заменяет смету готовой кухни.
          </p>
          <a href="#materials-form" className={`${materialButton} mt-4`}>
            Получить расчёт комплектации
          </a>
        </div>
      </div>
    </section>
  );
}
