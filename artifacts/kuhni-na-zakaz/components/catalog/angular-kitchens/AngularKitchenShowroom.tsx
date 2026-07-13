"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PackageOpen, Ruler } from "lucide-react";

const MEDIA_BASE = "/media/pilots/angular-kitchens";

type MediaItem = {
  stem: string;
  alt: string;
  caption: string;
};

const angles: MediaItem[] = [
  {
    stem: "angular-kitchens-angles-long-side-landscape",
    alt: "Длинное плечо угловой кухни с рабочей зоной",
    caption: "Длинное плечо: мойка, подготовка и варочная зона остаются в одной линии.",
  },
  {
    stem: "angular-kitchens-angles-corner-worktop-landscape",
    alt: "Свободная рабочая поверхность в углу кухни",
    caption: "Свободный угол удобно оставить для подготовки продуктов и небольших приборов.",
  },
  {
    stem: "angular-kitchens-inside-bottle-pullout-landscape",
    alt: "Узкая бутылочница рядом с угловым шкафом",
    caption: "Узкий модуль рядом с углом использует пространство под масла, специи и бутылки.",
  },
];

const storageOptions: Array<MediaItem & { id: string; title: string; note: string }> = [
  {
    id: "shelf",
    title: "Глубокая полка",
    stem: "angular-kitchens-inside-basic-shelf-landscape",
    alt: "Обычная глубокая полка в угловом кухонном шкафу",
    caption: "AI-концепт: простая глубокая полка.",
    note: "Подходит для крупной посуды, которой пользуются не каждый день. Решение проще, но дальняя зона доступна хуже.",
  },
  {
    id: "carousel",
    title: "Карусель",
    stem: "angular-kitchens-inside-carousel-landscape",
    alt: "Поворотная карусель с кастрюлями в угловом шкафу",
    caption: "AI-концепт: двухуровневая карусель.",
    note: "Полки поворачиваются к проёму. Доступ понятнее, но внутренний объём используется не полностью.",
  },
  {
    id: "pullout",
    title: "Выдвижная система",
    stem: "angular-kitchens-inside-pullout-landscape",
    alt: "Полностью открытый выдвижной механизм углового шкафа",
    caption: "AI-концепт: связанная выдвижная система.",
    note: "Корзины выходят к пользователю по очереди. Удобно для часто используемых кастрюль и бытовых запасов.",
  },
];

const angleTypes = [
  { id: "worktop", label: "Рабочий угол", title: "Больше непрерывной столешницы", text: "Мойка и варочная поверхность остаются на прямых участках, а угол работает как зона подготовки." },
  { id: "sink", label: "Мойка в углу", title: "Коммуникации собираются в одной зоне", text: "Подходит не каждому помещению: на замере нужно проверить трубы, открывание фасадов и доступ к сифону." },
  { id: "storage", label: "Угол для хранения", title: "Механизм выбирают по частоте использования", text: "Глубокая полка, карусель или выдвижная система решают разные задачи и по-разному влияют на смету." },
];

function PilotPicture({ item, eager = false, className = "" }: { item: MediaItem; eager?: boolean; className?: string }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${MEDIA_BASE}/avif/${item.stem}.avif`} />
      <img
        src={`${MEDIA_BASE}/webp/${item.stem}.webp`}
        alt={item.alt}
        width={1200}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}

export function AngularKitchenShowroom() {
  const [angleIndex, setAngleIndex] = useState(0);
  const [angleType, setAngleType] = useState(angleTypes[0].id);
  const [storageId, setStorageId] = useState(storageOptions[0].id);
  const [frame, setFrame] = useState(0);
  const [longWall, setLongWall] = useState(320);
  const [shortWall, setShortWall] = useState(220);

  const activeStorage = storageOptions.find((item) => item.id === storageId) ?? storageOptions[0];
  const activeAngleType = angleTypes.find((item) => item.id === angleType) ?? angleTypes[0];
  const frameNumber = String(frame + 1).padStart(2, "0");
  const frameItem = useMemo<MediaItem>(
    () => ({
      stem: `angular-kitchens-corner-mechanism-open-frame-${frameNumber}-landscape`,
      alt: `Открытие углового механизма, кадр ${frame + 1} из 12`,
      caption: `AI-концепт: положение механизма ${frame + 1} из 12.`,
    }),
    [frame, frameNumber],
  );

  return (
    <div className="space-y-16 md:space-y-24">
      <section id="planning" className="scroll-mt-24" aria-labelledby="angles-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Планировка</p>
            <h2 id="angles-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Посмотрите на угол с разных сторон</h2>
          </div>
          <span className="shrink-0 text-sm font-semibold text-stone-600" aria-live="polite">{angleIndex + 1} / {angles.length}</span>
        </div>

        <figure className="overflow-hidden rounded-[1.75rem] bg-stone-900 shadow-xl">
          <PilotPicture item={angles[angleIndex]} className="aspect-[3/2] w-full object-cover" />
          <figcaption className="flex min-h-20 items-center justify-between gap-4 bg-stone-950 px-4 py-3 text-sm text-stone-100 md:px-6">
            <span>{angles[angleIndex].caption}</span>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => setAngleIndex((angleIndex - 1 + angles.length) % angles.length)} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300" aria-label="Предыдущий ракурс">
                <ChevronLeft aria-hidden className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => setAngleIndex((angleIndex + 1) % angles.length)} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-amber-300 text-stone-950 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Следующий ракурс">
                <ChevronRight aria-hidden className="h-5 w-5" />
              </button>
            </div>
          </figcaption>
        </figure>

        <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white p-5 md:p-7">
          <h3 className="text-xl font-bold">Как использовать сам угол</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Варианты использования угла">
            {angleTypes.map((item) => (
              <button key={item.id} type="button" role="tab" aria-selected={item.id === angleType} onClick={() => setAngleType(item.id)} className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${item.id === angleType ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
            <div className="relative mx-auto aspect-square w-40 rounded-2xl bg-stone-100 p-5" aria-hidden>
              <div className="absolute bottom-5 left-5 h-[72%] w-8 rounded bg-amber-200" />
              <div className="absolute bottom-5 left-5 h-8 w-[72%] rounded bg-stone-700" />
              <div className="absolute bottom-5 left-5 h-10 w-10 rounded-br-xl border-b-4 border-l-4 border-white" />
            </div>
            <div>
              <p className="text-lg font-bold">{activeAngleType.title}</p>
              <p className="mt-2 leading-7 text-stone-600">{activeAngleType.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="inside" className="scroll-mt-24" aria-labelledby="inside-title">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Внутри</p>
        <h2 id="inside-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Выберите, что будет храниться в углу</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <figure className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
            <PilotPicture item={activeStorage} className="aspect-[3/2] w-full object-cover" />
            <figcaption className="px-5 py-3 text-sm text-stone-500">{activeStorage.caption}</figcaption>
          </figure>
          <div className="space-y-3">
            {storageOptions.map((item) => (
              <button key={item.id} type="button" onClick={() => setStorageId(item.id)} className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${item.id === storageId ? "border-amber-400 bg-amber-50" : "border-stone-200 bg-white hover:border-stone-400"}`} aria-pressed={item.id === storageId}>
                <span className="flex items-center gap-3 font-bold"><PackageOpen className="h-5 w-5 text-amber-700" aria-hidden />{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-stone-600">{item.note}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="mechanism" className="scroll-mt-24 rounded-[2rem] bg-stone-950 px-4 py-8 text-white md:px-8 md:py-12" aria-labelledby="mechanism-title">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">12 кадров, без тяжёлого 3D</p>
        <h2 id="mechanism-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Проведите — и загляните в дальнюю часть шкафа</h2>
        <p className="mt-3 max-w-3xl leading-7 text-stone-300">На первом открытии загружается только текущий кадр. Передвигайте ползунок вручную; при reduced motion автоматического движения нет.</p>
        <figure className="mt-7 overflow-hidden rounded-2xl bg-stone-800">
          <PilotPicture item={frameItem} className="aspect-[3/2] w-full object-cover" />
          <figcaption className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-stone-300">
            <span>{frameItem.caption}</span><strong className="text-white">{frame + 1} / 12</strong>
          </figcaption>
        </figure>
        <label className="mt-6 block font-semibold" htmlFor="mechanism-frame">Положение механизма</label>
        <input id="mechanism-frame" type="range" min="0" max="11" value={frame} onChange={(event) => setFrame(Number(event.target.value))} className="mt-3 h-11 w-full cursor-pointer accent-amber-300" aria-valuetext={`Кадр ${frame + 1} из 12`} />
      </section>

      <section id="dimensions" className="scroll-mt-24" aria-labelledby="dimensions-title">
        <div className="grid gap-8 rounded-[2rem] border border-stone-200 bg-white p-5 md:grid-cols-2 md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Примерьте планировку</p>
            <h2 id="dimensions-title" className="mt-2 text-3xl font-bold tracking-tight">Набросок двух стен</h2>
            <p className="mt-3 leading-7 text-stone-600">Это не технический проект и не расчёт модулей. Схема помогает сравнить пропорции до профессионального замера.</p>
            <label className="mt-6 block font-semibold" htmlFor="long-wall">Длинная стена: {longWall} см</label>
            <input id="long-wall" type="range" min="180" max="500" step="10" value={longWall} onChange={(event) => setLongWall(Number(event.target.value))} className="h-11 w-full accent-stone-900" />
            <label className="mt-3 block font-semibold" htmlFor="short-wall">Короткая стена: {shortWall} см</label>
            <input id="short-wall" type="range" min="140" max="400" step="10" value={shortWall} onChange={(event) => setShortWall(Number(event.target.value))} className="h-11 w-full accent-amber-600" />
          </div>
          <div className="grid min-h-72 place-items-center rounded-2xl bg-stone-100 p-6" aria-label={`Схема угловой кухни: длинная стена ${longWall} сантиметров, короткая стена ${shortWall} сантиметров`}>
            <div className="relative h-52 w-full max-w-sm">
              <div className="absolute bottom-0 left-0 h-9 rounded-lg bg-stone-800 transition-[width]" style={{ width: `${Math.max(48, (longWall / 500) * 100)}%` }} />
              <div className="absolute bottom-0 left-0 w-9 rounded-lg bg-amber-300 transition-[height]" style={{ height: `${Math.max(42, (shortWall / 400) * 100)}%` }} />
              <div className="absolute bottom-12 left-12 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold shadow"><Ruler className="h-4 w-4" aria-hidden />эскиз</div>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="scroll-mt-24" aria-labelledby="compare-title">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Сравнение</p>
        <h2 id="compare-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Дешевле — не всегда удобнее. Дороже — не всегда нужно</h2>
        <figure className="mt-6 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white">
          <PilotPicture item={{ stem: "angular-kitchens-compare-shelf-pullout-landscape", alt: "Сравнение глубокой полки и выдвижного углового механизма", caption: "AI-концепт: одинаковый угол с полкой и выдвижным механизмом." }} className="aspect-[16/9] w-full object-cover" />
          <figcaption className="px-5 py-3 text-sm text-stone-500">AI-концепт: слева простая полка, справа система с доступом к содержимому.</figcaption>
        </figure>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[{title:"Полка",text:"Для крупной и редко используемой посуды. Минимум механизмов, но нужно тянуться в глубину."},{title:"Карусель",text:"Понятное вращение и быстрый обзор. Часть объёма корпуса остаётся за пределами круглых полок."},{title:"Выдвижная система",text:"Содержимое выходит к пользователю. Удобство выше, а влияние на смету нужно считать по выбранной комплектации."}].map((item) => (
            <article key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p></article>
          ))}
        </div>
      </section>
    </div>
  );
}
