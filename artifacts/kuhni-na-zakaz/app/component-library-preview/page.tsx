import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BottomSheet,
  ContextDock,
  CornerStorageExplorer,
  DeferredMediaViewer,
  HardwareCabinetExplorer,
  HardwarePicker,
  KitchenLayoutCheck,
  MechanismComparison,
  MobileHero,
  ProductionJourney,
  SwipeGallery,
  type LabeledOption,
  type PilotMedia,
} from "@/components/pilots/library";

export const metadata: Metadata = { title: "Изолированная библиотека компонентов", robots: { index: false, follow: false } };

const angularHero: PilotMedia = { id: "PILOT-AK-01-002", avif: "/media/pilots/angular-kitchens/hero/angular-hero-mobile-two-walls-front-02-v1.avif", webp: "/media/pilots/angular-kitchens/hero/angular-hero-mobile-two-walls-front-02-v1.webp", alt: "Светлая угловая кухня, вид на две стены", caption: "AI-концепт: угловая кухня с закрытыми фасадами.", width: 900, height: 1200 };
const borisovHero: PilotMedia = { id: "PILOT-BR-01-001", avif: "/media/pilots/borisov/avif/borisov-hero-idea-to-kitchen-portrait.avif", webp: "/media/pilots/borisov/webp/borisov-hero-idea-to-kitchen-portrait.webp", alt: "Путь от эскиза до готовой современной кухни", caption: "AI-концепт: от идеи до готовой кухни.", width: 900, height: 1200 };
const hardwareHero: PilotMedia = { id: "PILOT-HW-01-001", avif: "/media/pilots/hardware/avif/hardware-hero-open-cabinet-portrait.avif", webp: "/media/pilots/hardware/webp/hardware-hero-open-cabinet-portrait.webp", alt: "Открытый кухонный шкаф с видимыми механизмами", caption: "Техническая AI-иллюстрация кухонного шкафа.", width: 900, height: 1200 };
const angularAngles: PilotMedia[] = [
  { id: "PILOT-AK-02-002", avif: "/media/pilots/angular-kitchens/avif/angular-kitchens-angles-long-side-landscape.avif", webp: "/media/pilots/angular-kitchens/webp/angular-kitchens-angles-long-side-landscape.webp", alt: "Длинное плечо угловой кухни с рабочей зоной", caption: "AI-концепт: длинное плечо и рабочая поверхность.", width: 1200, height: 800 },
  { id: "PILOT-AK-02-005", avif: "/media/pilots/angular-kitchens/avif/angular-kitchens-angles-corner-worktop-landscape.avif", webp: "/media/pilots/angular-kitchens/webp/angular-kitchens-angles-corner-worktop-landscape.webp", alt: "Свободная столешница в углу кухни", caption: "AI-концепт: угол как рабочая поверхность.", width: 1200, height: 800 },
];
const cornerFrames: PilotMedia[] = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return { id: `PILOT-AK-04-${String(index + 1).padStart(3, "0")}`, avif: `/media/pilots/angular-kitchens/avif/angular-kitchens-corner-mechanism-open-frame-${number}-landscape.avif`, webp: `/media/pilots/angular-kitchens/webp/angular-kitchens-corner-mechanism-open-frame-${number}-landscape.webp`, alt: `Положение углового механизма, кадр ${index + 1}`, caption: `AI-концепт движения механизма, кадр ${index + 1}.`, width: 1200, height: 900 };
});
const mechanisms: LabeledOption[] = [
  { id: "shelf", label: "Полка", description: "Простой доступ спереди, глубину угла важно обсудить на проекте." },
  { id: "carousel", label: "Карусель", description: "Поворотный принцип помогает подвести содержимое к проёму." },
  { id: "pullout", label: "Выдвижная система", description: "Корзины последовательно выходят из корпуса." },
];
const journeyMedia: Record<string, PilotMedia> = {
  measure: { id: "PILOT-BR-02-003", avif: "/media/pilots/borisov/avif/borisov-process-measure-landscape.avif", webp: "/media/pilots/borisov/webp/borisov-process-measure-landscape.webp", alt: "Замер помещения перед проектированием кухни", caption: "Иллюстрация процесса: замер помещения.", width: 1200, height: 800 },
  design: { id: "PILOT-BR-02-004", avif: "/media/pilots/borisov/avif/borisov-process-design-landscape.avif", webp: "/media/pilots/borisov/webp/borisov-process-design-landscape.webp", alt: "Проектирование кухни по размерам помещения", caption: "Иллюстрация процесса: проектирование.", width: 1200, height: 800 },
  production: { id: "PILOT-BR-02-005", avif: "/media/pilots/borisov/avif/borisov-process-assembly-landscape.avif", webp: "/media/pilots/borisov/webp/borisov-process-assembly-landscape.webp", alt: "Сборка корпуса кухонного шкафа", caption: "Иллюстрация процесса, не фотография реального цеха.", width: 1200, height: 800 },
  installation: { id: "PILOT-BR-02-007", avif: "/media/pilots/borisov/avif/borisov-process-installation-landscape.avif", webp: "/media/pilots/borisov/webp/borisov-process-installation-landscape.webp", alt: "Монтаж кухонных шкафов в помещении", caption: "Иллюстрация процесса: монтаж кухни.", width: 1200, height: 800 },
};
const steps = [
  ["request", "Заявка", "Фиксируем задачу и удобный способ связи."], ["estimate", "Предварительный расчёт", "Обсуждаем размеры, материалы и состав кухни без обещания точной цены."], ["measure", "Замер", "Уточняем помещение и ограничения."], ["design", "Проект", "Согласуем планировку и внешний вид."], ["production", "Производство", "Изготавливаем согласованные элементы; иллюстрация не доказывает реальный цех."], ["delivery", "Доставка", "Условия зависят от адреса и готовности помещения."], ["installation", "Монтаж", "Собираем кухню по согласованному проекту."],
].map(([id, label, description]) => ({ id, label, description, media: journeyMedia[id] })) as [LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption, LabeledOption];
const zones: LabeledOption[] = ["Петля", "Ящик", "Верхний фасад", "Узкий модуль", "Угол"].map((label, index) => ({ id: `zone-${index + 1}`, label, description: `Что уточнить для зоны «${label.toLowerCase()}» при проектировании кухни.` }));

export default function ComponentLibraryPage() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_COMPONENT_LIBRARY_PREVIEW !== "1") notFound();
  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6" data-testid="component-library">
      <header><p className="font-black uppercase tracking-widest text-stone-500">Этап 4</p><h1 className="text-4xl font-black">Изолированная библиотека компонентов</h1><p className="mt-2">Тестовый стенд не подключён к трём production-страницам и закрыт в production.</p></header>
      <MobileHero headingLevel={2} eyebrow="Планировка" title="Угол без потерянного пространства" description="Проверьте две стены и принцип доступа к хранению." media={angularHero} disclosure="AI-концепт, не выполненный проект." variant="spatial" actions={<a href="#corner" className="min-h-11 rounded-xl bg-stone-900 px-5 py-3 font-bold text-white">Проверить планировку</a>} />
      <MobileHero headingLevel={2} eyebrow="Борисов" title="От заявки до монтажа" description="Семь этапов заказа с честными текстовыми fallback." media={borisovHero} disclosure="Иллюстрация процесса." variant="journey" actions={<a href="#journey" className="min-h-11 rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white">Посмотреть путь</a>} />
      <MobileHero headingLevel={2} eyebrow="Фурнитура" title="Механизмы внутри шкафа" description="Выберите зону и получите вопросы для проектировщика." media={hardwareHero} disclosure="Техническая AI-иллюстрация без заявленных характеристик." variant="technical" actions={<a href="#hardware" className="min-h-11 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Выбрать механизм</a>} />
      <ContextDock label="Разделы тестового стенда" items={[{ href: "#corner", label: "Угол" }, { href: "#journey", label: "Процесс" }, { href: "#hardware", label: "Механизмы" }, { href: "#picker", label: "Подобрать" }]} />
      <SwipeGallery items={angularAngles} label="Ракурсы угловой кухни" />
      <DeferredMediaViewer items={angularAngles} label="Отложенная галерея" triggerLabel="Показать ракурсы по запросу" />
      <div id="corner"><CornerStorageExplorer frames={cornerFrames} mechanisms={mechanisms} /></div>
      <KitchenLayoutCheck />
      <MechanismComparison title="Сравнение способов доступа" options={mechanisms} />
      <div id="journey"><ProductionJourney steps={steps} /></div>
      <div id="hardware"><HardwareCabinetExplorer poster={hardwareHero} zones={zones} /></div>
      <div id="picker"><HardwarePicker /></div>
      <BottomSheet triggerLabel="Открыть тестовую панель" title="Параметры для обсуждения"><p>Панель проверяет фокус, Escape, возврат фокуса и safe-area.</p><button type="button" className="mt-4 min-h-11 rounded-xl border px-4">Дополнительное действие</button></BottomSheet>
    </main>
  );
}
