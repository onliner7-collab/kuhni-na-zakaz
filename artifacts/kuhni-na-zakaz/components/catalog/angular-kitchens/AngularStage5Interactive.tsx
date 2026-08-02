"use client";

import Link from "@/components/navigation/Link";
import {
  BottomSheet,
  CornerStorageExplorer,
  KitchenLayoutCheck,
  MechanismComparison,
  type PilotMedia,
} from "@/components/pilots/library";
import { MediaSequence, useExploreContext } from "@/components/exploration";
import { ArrowRight, Check, PackageOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const ANGULAR_ANSWERS_EVENT = "angular-kitchen-answers";
const MEDIA_BASE = "/media/pilots/angular-kitchens";

const gallery: PilotMedia[] = [
  media("angle-front", "gallery/angular-kitchens-angles-full-room-front-landscape-v1", "Общий вид светлой угловой кухни", "Визуальная концепция: общий вид обеих стен угловой кухни."),
  media("angle-long", "webp/angular-kitchens-angles-long-side-landscape", "Длинное плечо угловой кухни", "Визуальная концепция: длинное плечо с рабочей зоной."),
  media("angle-short", "gallery/angular-kitchens-angles-short-side-landscape-v1", "Короткое плечо угловой кухни", "Визуальная концепция: короткое плечо и связь двух стен."),
  media("angle-worktop", "gallery/angular-corner-types-straight-corner-front-01-v1", "Свободная рабочая поверхность в углу кухни", "Визуальная концепция: угол оставлен для подготовки продуктов."),
  media("angle-sink", "gallery/angular-corner-types-sink-corner-front-01-v1", "Мойка в угловой части кухни", "Визуальная концепция: мойка расположена в угловой зоне."),
];

const cornerTypes = [
  { id: "worktop", label: "Рабочий угол", title: "Непрерывная рабочая поверхность", description: "Мойка и варочная остаются на прямых участках, а угол используется для подготовки.", media: gallery[3] },
  { id: "sink", label: "Мойка в углу", title: "Коммуникации в одной зоне", description: "На замере нужно проверить трубы, сифон, соседние фасады и удобство подхода.", media: gallery[4] },
  { id: "storage", label: "Угол для хранения", title: "Доступ зависит от механизма", description: "Полка, карусель и выдвижная система используют глубину шкафа по-разному.", media: media("corner-storage", "details/angular-storage-pullout-landscape-v2", "Выдвижной механизм в угловом шкафу", "Визуальная концепция: полностью открытая выдвижная система.") },
];

const mechanisms = [
  { id: "shelf", label: "Глубокая полка", description: "Для крупной и редко используемой посуды; дальняя зона доступна хуже.", media: media("mechanism-shelf", "details/angular-storage-deep-shelf-landscape-v2", "Глубокие полки с кастрюлями в угловом шкафу", "Визуальная концепция: простые глубокие полки без сложного механизма.") },
  { id: "carousel", label: "Карусель", description: "Полки поворачиваются к проёму; обзор проще, но круг использует не весь объём.", media: media("mechanism-carousel", "details/angular-storage-carousel-landscape-v2", "Поворотная карусель с посудой в угловом шкафу", "Визуальная концепция: двухуровневая поворотная карусель.") },
  { id: "pullout", label: "Выдвижная система", description: "Корзины выходят к пользователю; влияние на смету считают по комплектации.", media: cornerTypes[2].media },
];

const frames: PilotMedia[] = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return media(`corner-frame-${number}`, `webp/angular-kitchens-corner-mechanism-open-frame-${number}-landscape`, `Открытие углового механизма, кадр ${index + 1} из 12`, `Визуальная концепция: положение механизма ${index + 1} из 12.`);
});

const materials = [
  { id: "warm-white", label: "Тёплый белый", href: "/materials/mdf-fasady", description: "Спокойная светлая база; покрытие и кромки подбирают под нагрузку.", media: media("material-white", "details/angular-materials-warm-white-detail-01-v1", "Угловая кухня с фасадами тёплого белого цвета", "Визуальная концепция: тёплый белый и натуральный дуб.") },
  { id: "green", label: "Приглушённый зелёный", href: "/styles/zelenye-kuhni", description: "Цветовой акцент без изменения планировки и механики угла.", media: media("material-green", "details/angular-materials-green-detail-01-v1", "Угловая кухня с приглушёнными зелёными фасадами", "Визуальная концепция: зелёные фасады и натуральный дуб.") },
  { id: "graphite", label: "Графитовый", href: "/styles/temnye-kuhni", description: "Контрастный низ и тёплый дуб; освещение проверяют в реальном помещении.", media: media("material-graphite", "details/angular-materials-graphite-detail-01-v1", "Угловая кухня с графитовыми фасадами", "Визуальная концепция: графитовые фасады и натуральный дуб.") },
];

type LayoutSelection = {
  wallOneLength: number;
  wallTwoLength: number;
  windowPosition: string;
  doorPosition: string;
  communicationsPosition: string;
};

function media(id: string, stem: string, alt: string, caption: string): PilotMedia {
  const base = stem.replace(/^webp\//, "");
  const directory = stem.includes("/") ? stem.slice(0, stem.lastIndexOf("/")) : "webp";
  const name = stem.slice(stem.lastIndexOf("/") + 1);
  const avifDirectory = directory === "webp" ? "avif" : directory;
  return { id, avif: `${MEDIA_BASE}/${avifDirectory}/${name}.avif`, webp: `${MEDIA_BASE}/${directory}/${name}.webp`, alt, caption, width: 1200, height: 800 };
}

export function AngularStage5Interactive() {
  const { updateContext } = useExploreContext();
  const [cornerType, setCornerType] = useState("worktop");
  const [mechanism, setMechanism] = useState("shelf");
  const [material, setMaterial] = useState("warm-white");
  const [layout, setLayout] = useState<LayoutSelection>({ wallOneLength: 240, wallTwoLength: 180, windowPosition: "нет рядом", doorPosition: "нет рядом", communicationsPosition: "уточнить на замере" });
  const activeCorner = cornerTypes.find((item) => item.id === cornerType) || cornerTypes[0];
  const activeMaterial = materials.find((item) => item.id === material) || materials[0];
  const onLayoutChange = useCallback((value: LayoutSelection) => setLayout(value), []);
  const answers = useMemo(() => ({
    sourcePage: "/catalog/uglovye-kuhni",
    kitchenType: "angular",
    selectedCornerType: cornerType,
    selectedMechanism: mechanism,
    selectedMaterial: material,
    wallOneLength: layout.wallOneLength,
    wallTwoLength: layout.wallTwoLength,
    windowPosition: layout.windowPosition,
    doorPosition: layout.doorPosition,
    communicationsPosition: layout.communicationsPosition,
    pageUrl: "/catalog/uglovye-kuhni",
  }), [cornerType, layout, material, mechanism]);

  useEffect(() => {
    updateContext({ layout: cornerType, hardware: [mechanisms.find((item) => item.id === mechanism)?.label || mechanism], materials: [activeMaterial.label], evidencePreference: "ideas" }, "выбор параметров угловой кухни");
    window.dispatchEvent(new CustomEvent(ANGULAR_ANSWERS_EVENT, { detail: answers }));
  }, [activeMaterial.label, answers, cornerType, mechanism, updateContext]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section id="planning" className="scroll-mt-24" aria-labelledby="planning-title">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-800">Планировка</p>
        <h2 id="planning-title" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Посмотрите на угол с разных сторон</h2>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">Листайте ракурсы пальцем или используйте кнопки. Все изображения ниже — визуальные концепции, созданные нейросетью, а не фотографии выполненных проектов.</p>
        <div className="mt-6"><MediaSequence items={gallery} label="Ракурсы угловой кухни" eagerInitial={false} /></div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
          <h3 className="text-2xl font-black">Как использовать сам угол</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Тип угловой планировки">
            {cornerTypes.map((item) => <button key={item.id} id={`corner-tab-${item.id}`} type="button" role="tab" aria-selected={cornerType === item.id} aria-controls="corner-type-panel" onClick={() => setCornerType(item.id)} className="min-h-12 rounded-xl border px-4 py-3 text-left font-bold aria-selected:border-stone-950 aria-selected:bg-stone-950 aria-selected:text-white">{item.label}</button>)}
          </div>
          <div id="corner-type-panel" role="tabpanel" aria-labelledby={`corner-tab-${activeCorner.id}`} className="mt-5 grid gap-5 md:grid-cols-2 md:items-center">
            <figure className="overflow-hidden rounded-2xl bg-stone-100"><img src={activeCorner.media.webp} alt={activeCorner.media.alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] h-full w-full object-cover" /><figcaption className="p-3 text-sm text-stone-600">{activeCorner.media.caption}</figcaption></figure>
            <div><h4 className="text-xl font-black">{activeCorner.title}</h4><p className="mt-2 leading-7 text-stone-600">{activeCorner.description}</p></div>
          </div>
        </div>
      </section>

      <section id="inside" className="scroll-mt-24" aria-labelledby="inside-heading">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-800">Внутри угла</p>
        <h2 id="inside-heading" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Проверьте доступ к глубокой части шкафа</h2>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">Последовательность загружает по одному кадру после действия пользователя. При reduced motion остаются дискретные кнопки без автопрокрутки.</p>
        <div className="mt-6"><CornerStorageExplorer frames={frames} mechanisms={mechanisms} onMechanismChange={setMechanism} /></div>
      </section>

      <section aria-labelledby="use-cases-title">
        <h2 id="use-cases-title" className="text-3xl font-black tracking-tight md:text-4xl">Что удобно хранить в углу</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[{ title: "Крупная посуда", text: "Кастрюли и формы можно хранить на глубокой полке, если они нужны не каждый день." }, { title: "Ежедневные запасы", text: "Карусель помогает быстро увидеть продукты и небольшую посуду." }, { title: "Часто используемое", text: "Выдвижная система выводит корзины к пользователю и уменьшает необходимость тянуться внутрь." }].map((item) => <article key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5"><PackageOpen className="h-6 w-6 text-amber-800" aria-hidden="true" /><h3 className="mt-3 font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p></article>)}
        </div>
      </section>

      <section aria-label="Сравнение механизмов"><MechanismComparison title="Сравните способы доступа" options={mechanisms} onChange={setMechanism} /></section>

      <section aria-label="Предварительная проверка планировки"><KitchenLayoutCheck onChange={onLayoutChange} /></section>

      <section id="materials" className="scroll-mt-24" aria-labelledby="materials-title">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-800">Материалы и цвет</p>
        <h2 id="materials-title" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Сравните визуальное направление</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <figure className="overflow-hidden rounded-3xl border bg-white"><img src={activeMaterial.media.webp} alt={activeMaterial.media.alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /><figcaption className="p-4 text-sm text-stone-600">{activeMaterial.media.caption}</figcaption></figure>
          <div className="space-y-3">{materials.map((item) => <button key={item.id} type="button" aria-pressed={material === item.id} onClick={() => setMaterial(item.id)} className="w-full rounded-2xl border bg-white p-4 text-left aria-pressed:border-stone-950 aria-pressed:ring-2"><span className="flex items-center justify-between gap-3 font-black">{item.label}{material === item.id ? <Check className="h-5 w-5" aria-hidden="true" /> : null}</span><span className="mt-2 block text-sm leading-6 text-stone-600">{item.description}</span></button>)}</div>
        </div>
        <Link href={activeMaterial.href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 px-5 py-3 font-bold">Подробнее о выбранном направлении <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </section>

      <BottomSheet triggerLabel="Посмотреть выбранные параметры" title="Ваш предварительный выбор">
        <dl className="grid gap-3 text-sm"><Summary label="Тип угла" value={activeCorner.label} /><Summary label="Механизм" value={mechanisms.find((item) => item.id === mechanism)?.label || mechanism} /><Summary label="Материал" value={activeMaterial.label} /><Summary label="Две стены" value={`${layout.wallOneLength} × ${layout.wallTwoLength} см`} /><Summary label="Окно" value={layout.windowPosition} /><Summary label="Дверь" value={layout.doorPosition} /></dl>
        <a href="#calculate" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-stone-950 px-5 py-3 font-black text-white">Перейти к расчёту</a>
      </BottomSheet>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 rounded-xl bg-stone-100 p-3"><dt className="font-bold text-stone-600">{label}</dt><dd className="text-right font-black">{value}</dd></div>;
}
