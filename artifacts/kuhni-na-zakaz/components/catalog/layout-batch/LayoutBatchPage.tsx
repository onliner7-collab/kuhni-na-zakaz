import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContextSummary, ExploreContextProvider, MediaSequence, RelatedExplorationRail } from "@/components/exploration";
import type { PilotMedia } from "@/components/pilots/library/types";
import { LayoutDecisionModel, type DecisionOption } from "./LayoutDecisionModel";
import { LayoutVisualExplorer, type LayoutVisualFrame } from "./LayoutVisualExplorer";

type Config = {
  title: string;
  question: string;
  answer: string;
  role: string;
  layout: string;
  legend: string;
  limitations: string[];
  options: DecisionOption[];
  media: PilotMedia[];
  visualFrames?: LayoutVisualFrame[];
  links: Array<{ href: string; label: string }>;
};

const configs: Record<string, Config> = {
  "pryamye-kuhni": {
    title: "Прямая кухня: проверьте одну линию до заказа",
    question: "Когда одной линии достаточно и как расставить зоны?",
    answer: "Начните не со стиля, а с последовательности: холодильник, мойка, свободная рабочая поверхность и варочная зона должны поместиться без лишних переходов.",
    role: "line-layout-check", layout: "прямая", legend: "Выберите длину рабочей линии",
    limitations: ["Коммуникации должны совпасть с выбранной последовательностью зон.", "Короткая линия заставляет выбирать между техникой, хранением и столешницей."],
    options: [
      { id: "balanced", label: "Средняя линия", result: "Зоны можно разделить без длинных переходов.", caution: "не разрывает ли пенал рабочую поверхность" },
      { id: "compact", label: "Компактная линия", result: "Сначала закрепите мойку и один свободный участок столешницы.", caution: "габариты холодильника, мойки и варочной до выбора модулей" },
      { id: "long", label: "Длинная линия", result: "Хранения больше, но ежедневный маршрут становится длиннее.", caution: "расстояние между холодильником, мойкой и варочной" },
    ],
    visualFrames: lineFrames(),
    media: media("line", "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp", "Визуализация прямой кухни вдоль одной стены", "/uploads/kitchens/catalog/pryamaya-kuhnya-3d-proekt-rakurs-1-generated-20260517.webp", "Визуализация рабочей зоны прямой кухни"),
    links: [{ href: "/catalog/uglovye-kuhni", label: "Сравнить с угловой кухней" }, { href: "/scenarios/dlya-studii", label: "Проверить сценарий студии" }, { href: "/materials/mdf-fasady", label: "Сравнить МДФ-фасады" }, { href: "/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat", label: "Прочитать сравнение планировок" }],
  },
  "p-obraznye-kuhni": {
    title: "П-образная кухня: сравните проходы и три стороны",
    question: "Хватит ли места для трёх сторон и безопасных проходов?",
    answer: "П-образная форма полезна только тогда, когда техника и фасады открываются одновременно, а внутренний проход не превращается в узкий коридор.",
    role: "clearance-comparison", layout: "П-образная", legend: "Как будет использоваться внутренний проход",
    limitations: ["Два угла требуют отдельного решения хранения.", "Фактический проход проверяется по замеру и габаритам открытой техники."],
    options: [
      { id: "solo", label: "Готовит один", result: "Можно плотнее собрать зоны по трём сторонам.", caution: "открывание посудомойки и духовки напротив друг друга" },
      { id: "pair", label: "Готовят вдвоём", result: "Нужны независимые маршруты к мойке и варочной.", caution: "можно ли разойтись при открытых ящиках" },
      { id: "peninsula", label: "Третья сторона — полуостров", result: "Полуостров отделяет кухню, но меняет вход и посадку.", caution: "проход со стороны комнаты и свес столешницы" },
    ],
    media: media("u", "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp", "Визуализация П-образной кухни с тремя рабочими сторонами", "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya-rakurs-1.webp", "Визуализация прохода П-образной кухни"),
    links: [{ href: "/catalog/uglovye-kuhni", label: "Сравнить с двумя сторонами" }, { href: "/materials/furnitura", label: "Изучить фурнитуру для углов" }, { href: "/blog/p-obraznaya-kuhnya-razmery-prohody-cena", label: "Разобрать размеры и проходы" }, { href: "/calculator", label: "Передать размеры для расчёта" }],
  },
  "kuhni-s-ostrovom": {
    title: "Кухня с островом: сначала выберите его роль",
    question: "Поместится ли остров и какую функцию ему дать?",
    answer: "Остров стоит проектировать от ежедневного действия: хранение, подготовка продуктов или посадка требуют разных проходов и коммуникаций.",
    role: "island-clearance-planner", layout: "с островом", legend: "Для чего нужен остров",
    limitations: ["Остров не должен перекрывать маршрут между кухней и гостиной.", "Вода, варочная и вытяжка требуют отдельной технической проверки."],
    options: [
      { id: "prep", label: "Подготовка", result: "Свободная столешница помогает готовить рядом с основной линией.", caution: "розетки и безопасный проход вокруг открытых ящиков" },
      { id: "storage", label: "Хранение", result: "Широкие ящики разгружают основной гарнитур.", caution: "глубину модулей и доступ с нужной стороны" },
      { id: "seating", label: "Посадка", result: "Остров становится местом общения и сервировки.", caution: "свес столешницы, место для ног и проход за стульями" },
    ],
    media: media("island", "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp", "Визуализация кухни с островом", "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-1.webp", "Визуализация прохода вокруг острова"),
    links: [{ href: "/scenarios/s-ostrovom", label: "Выбрать бытовой сценарий острова" }, { href: "/catalog/p-obraznye-kuhni", label: "Сравнить с полуостровом" }, { href: "/materials/plastik-hpl", label: "Изучить поверхность рабочей зоны" }, { href: "/blog/kuhnya-s-ostrovom", label: "Разобрать остров подробнее" }],
  },
  "malenkie-kuhni": {
    title: "Маленькая кухня: определите главный приоритет",
    question: "Как сохранить рабочую зону и хранение в маленькой кухне?",
    answer: "На ограниченной площади нельзя максимизировать всё сразу. Выберите главную функцию, а остальные проверьте как честные компромиссы.",
    role: "small-space-trade-off-explorer", layout: "маленькая кухня", legend: "Что нельзя потерять",
    limitations: ["Технику выбирают до финальной сетки модулей.", "Открытые дверцы и стулья не должны перекрывать проход."],
    options: [
      { id: "worktop", label: "Столешница", result: "Сохраните один непрерывный участок для подготовки продуктов.", caution: "куда убрать мелкую технику и сушку" },
      { id: "storage", label: "Хранение", result: "Высота и узкие зоны берут на себя запасы и посуду.", caution: "доступ к верхним секциям и ощущение перегруженности" },
      { id: "appliances", label: "Техника", result: "Сначала фиксируются реальные габариты нужной техники.", caution: "какая рабочая поверхность останется после встраивания" },
    ],
    media: media("small", "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp", "Визуализация компактной кухни", "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya-rakurs-1.webp", "Визуализация хранения в маленькой кухне"),
    links: [{ href: "/scenarios/dlya-malenkoy-kuhni", label: "Расставить приоритеты по сценарию" }, { href: "/catalog/pryamye-kuhni", label: "Проверить прямую линию" }, { href: "/materials/mdf-fasady", label: "Сравнить вид фасадов" }, { href: "/blog/kuhnya-6-kv-m-v-hruschevke", label: "Разобрать кухню 6 м²" }],
  },
  "kuhni-do-potolka": {
    title: "Кухня до потолка: распределите доступ по высоте",
    question: "Стоит ли поднимать шкафы до потолка и как ими пользоваться?",
    answer: "Верхний ярус полезен для редких вещей. Ежедневные предметы должны оставаться в доступной зоне, а монтажный зазор и вентиляцию проверяют отдельно.",
    role: "vertical-storage-explorer", layout: "до потолка", legend: "Что будет храниться наверху",
    limitations: ["Высоту измеряют в нескольких точках.", "Верхние секции не должны перекрывать вентиляцию и сервисный доступ."],
    options: [
      { id: "seasonal", label: "Сезонные вещи", result: "Антресоль подходит для редкого доступа.", caution: "безопасный способ доставать вещи" },
      { id: "supplies", label: "Запасы", result: "Запасы лучше разделить по весу и частоте использования.", caution: "нагрузку полок и видимость содержимого" },
      { id: "appliances", label: "Редкая техника", result: "Крупную технику нельзя убирать наверх автоматически.", caution: "вес, высоту подъёма и свободное место для использования" },
    ],
    media: media("ceiling", "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp", "Визуализация кухни до потолка", "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-1.webp", "Визуализация верхних секций кухни"),
    links: [{ href: "/scenarios/do-potolka", label: "Проверить частоту доступа" }, { href: "/materials/furnitura", label: "Изучить механизмы верхних секций" }, { href: "/blog/kuhnya-do-potolka-plyusy-minusy-cena", label: "Разобрать плюсы и ограничения" }, { href: "/calculator", label: "Передать высоту для расчёта" }],
  },
  "kuhni-bez-ruchek": {
    title: "Кухня без ручек: сравните способы открывания",
    question: "Какой способ открывания без ручек подходит и какие у него ограничения?",
    answer: "Единого механизма для всей кухни нет: активные ящики, верхние шкафы и встроенная техника требуют разных сценариев хвата.",
    role: "opening-mechanism-comparison", layout: "без ручек", legend: "Как вы хотите открывать фасады",
    limitations: ["Посудомойка и холодильник проверяются отдельно.", "Удобство зависит от высоты хвата, веса фасада и частоты использования."],
    options: [
      { id: "profile", label: "Профиль", result: "Постоянная зона хвата удобна для активных нижних модулей.", caution: "доступность хвата и очистку профиля" },
      { id: "push", label: "Нажатие", result: "Гладкая поверхность сохраняется, но фасад открывается от нажатия.", caution: "случайные срабатывания и усилие на тяжёлых фасадах" },
      { id: "integrated", label: "Фрезерованный хват", result: "Хват становится частью фасада без отдельной ручки.", caution: "материал фасада и удобство для верхних и высоких секций" },
    ],
    media: media("opening", "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek.webp", "Визуализация кухни без ручек", "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek-rakurs-1.webp", "Визуализация зоны открывания фасадов"),
    links: [{ href: "/materials/furnitura", label: "Сравнить механизмы и фурнитуру" }, { href: "/styles/minimalizm", label: "Проверить минималистичный стиль" }, { href: "/materials/mdf-fasady", label: "Сравнить поверхности МДФ" }, { href: "/blog/kuhnya-bez-ruchek-plyusy-minusy", label: "Разобрать плюсы и ограничения" }],
  },
};

function lineFrames(): LayoutVisualFrame[] {
  const base = "/media/visual-rescue/pryamye-kuhni";
  return [
    visualFrame(base, "line-balanced", "Средняя линия", "Прямая кухня средней длины с разделёнными зонами", "Зоны можно разделить без длинных переходов.", "не разрывает ли пенал рабочую поверхность"),
    visualFrame(base, "line-compact", "Компактная", "Компактная прямая кухня с мойкой и короткой рабочей поверхностью", "На короткой линии сначала фиксируются обязательные зоны.", "габариты техники и непрерывный участок столешницы"),
    visualFrame(base, "line-long", "Длинная", "Длинная прямая кухня с увеличенной рабочей поверхностью и хранением", "Длинная линия добавляет хранение и увеличивает маршрут.", "расстояние между холодильником, мойкой и варочной"),
    visualFrame(base, "line-work-zone", "Рабочая зона", "Крупный план последовательности варочной поверхности, столешницы и мойки", "Непрерывная столешница связывает основные действия.", "где останется место для подготовки продуктов"),
    visualFrame(base, "line-second-angle", "Второй ракурс", "Прямая кухня под углом с видимой глубиной рабочей поверхности", "Второй ракурс показывает глубину и свободное место перед линией.", "не мешают ли открытые фасады проходу"),
    visualFrame(base, "line-l-compare", "Сравнить с угловой", "Та же кухня с добавленной короткой угловой стороной", "Вторая сторона добавляет столешницу, но занимает часть помещения.", "нужна ли дополнительная сторона ценой свободного прохода"),
  ];
}

function visualFrame(base: string, id: string, label: string, alt: string, result: string, caution: string): LayoutVisualFrame {
  return {
    id,
    label,
    webp: `${base}/webp/${id}.webp`,
    avif: `${base}/avif/${id}.avif`,
    alt,
    caption: "AI-визуализация для сравнения планировки, не фотография реализованного объекта.",
    result,
    caution,
  };
}

function media(id: string, first: string, firstAlt: string, second: string, secondAlt: string): PilotMedia[] {
  return [
    { id: `${id}-overview`, webp: first, alt: firstAlt, caption: "Идея планировки, не фотография реализованного объекта", width: 1200, height: 800 },
    { id: `${id}-detail`, webp: second, alt: secondAlt, caption: "Визуальный сценарий для сравнения", width: 1200, height: 800 },
  ];
}

export function isLayoutBatchSlug(slug: string) {
  return Boolean(configs[slug]);
}

export function LayoutBatchPage({ slug }: { slug: string }) {
  const config = configs[slug];
  if (!config) return null;
  const route = `/catalog/${slug}`;
  return (
    <ExploreContextProvider sourceRoute={route}>
      <div className="bg-stone-50 pb-24 text-stone-950">
        <div className="container-site py-6 md:py-10">
          <nav aria-label="Хлебные крошки" className="flex min-h-11 flex-wrap items-center gap-2 text-sm text-stone-600"><Link href="/">Главная</Link><span aria-hidden="true">/</span><Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>{config.layout}</span></nav>
          <header className="mt-5 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-700">Проверка планировки</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{config.title}</h1>
            <p className="mt-4 max-w-2xl text-lg font-bold leading-7 md:text-xl md:leading-8">{config.question}</p>
            {!config.visualFrames ? <p className="mt-3 max-w-3xl leading-7 text-stone-700">{config.answer}</p> : null}
          </header>

          {config.visualFrames ? (
            <div className="mt-6"><LayoutVisualExplorer route={route} layout={config.layout} role={config.role} legend={config.legend} frames={config.visualFrames} /></div>
          ) : (
            <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_.95fr]" aria-labelledby="decision-heading">
              <div><h2 id="decision-heading" className="sr-only">Интерактивная проверка</h2><LayoutDecisionModel route={route} layout={config.layout} role={config.role} legend={config.legend} options={config.options} /></div>
              <MediaSequence items={config.media} label={`Визуальная серия: ${config.question}`} />
            </section>
          )}

          {config.visualFrames ? <details className="mt-6 rounded-2xl border border-stone-200 bg-white p-5"><summary className="min-h-11 cursor-pointer content-center font-bold">Почему начинаем с планировки</summary><p className="mt-3 max-w-3xl leading-7 text-stone-700">{config.answer}</p></details> : null}

          <section className="mt-10 grid gap-6 md:grid-cols-2" aria-labelledby="limits-heading">
            <div className="rounded-3xl border border-stone-200 bg-white p-6"><h2 id="limits-heading" className="text-2xl font-black">Ограничения, которые нельзя пропустить</h2><ul className="mt-4 space-y-3">{config.limitations.map((item) => <li key={item} className="flex gap-3 leading-7"><span aria-hidden="true">—</span><span>{item}</span></li>)}</ul></div>
            <ContextSummary />
          </section>

          <section className="mt-10" aria-labelledby="continue-heading"><h2 id="continue-heading" className="mb-4 text-2xl font-black">Продолжить изучение</h2><nav aria-label="Связанные сценарии, материалы и статьи" className="grid gap-3 sm:grid-cols-2">{config.links.map((item) => <Link key={item.href} href={item.href} className="min-h-12 rounded-2xl border border-stone-200 bg-white p-4 font-bold hover:border-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950">{item.label}</Link>)}</nav></section>
          <div className="mt-8"><RelatedExplorationRail route={route} /></div>

          <section id="form" className="mt-12 scroll-mt-24 grid overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid-cols-[.85fr_1.15fr]" aria-labelledby="lead-heading">
            <div className="p-6 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-300">Следующий шаг</p><h2 id="lead-heading" className="mt-2 text-3xl font-black">Передайте выбранный сценарий</h2><p className="mt-4 leading-7 text-stone-300">Форма получит тип страницы и последний выбор. Точная применимость, комплектация и стоимость подтверждаются после исходных данных.</p><div className="mt-6 text-stone-950"><ContextSummary /></div></div>
            <div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source={`catalog/${slug}-layout-batch`} sourcePage={route} sourceType="catalog-layout-interactive" formType="layout-decision" formLocation="layout-final" submitLabel="Передать параметры" defaultKitchenType={config.layout} answersEventName="layout-batch-answers" defaultAnswers={{ sourceRoute: route, interactionRole: config.role, layout: config.layout }} showHasMeasurements /></div>
          </section>
        </div>
      </div>
    </ExploreContextProvider>
  );
}
