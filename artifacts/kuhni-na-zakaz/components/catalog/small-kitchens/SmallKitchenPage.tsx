import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { SMALL_KITCHEN_PATH, smallKitchenFaq, smallKitchenPriorities, smallPriorityImage } from "@/data/small-kitchens";
import { priceExamples, exampleImage, startingPrice } from "@/data/prices-showcase";
import { SmallKitchenExplorer } from "./SmallKitchenExplorer";
import { SmallKitchenSelection } from "./SmallKitchenSelection";

const roomTasks = [
  { title: "Кухня 5 м²: обязательные функции", image: "/images/prices-showcase/generated/modern-small-2m-1.webp", text: "Начните с мойки, плиты, холодильника и свободной поверхности. Проверим, помещаются ли они в одну линию и где останется место для стола.", check: "Не каждое помещение 5 м² подходит для углового гарнитура. Нужны длины стен и положение двери." },
  { title: "Кухня 6 м²: прямая или угловая", image: "/images/prices-showcase/generated/scandi-corner-1.webp", text: "Сравните одну рабочую линию и две стены. Угловая кухня может добавить поверхность, а прямая — освободить место напротив.", check: "В хрущёвке отдельно учитываем трубы, радиатор и вентиляцию. Планировка определяется замером." },
  { title: "Кухня 7 м²: техника и обеденная зона", image: "/images/small-kitchens-20261011/straight-overview.webp", text: "Обсудим высокий холодильник, посудомоечную машину и стол. Проверим, можно ли пользоваться ими, не перекрывая проход.", check: "Прибавка площади не гарантирует место для всей техники: важны форма комнаты и проёмы." },
];

function SmallKitchenDetails() {
  const examples = priceExamples.filter(model => ["modern-small-2m", "scandi-corner"].includes(model.id));
  return <>
    <section className="mt-12" aria-labelledby="small-room-heading">
      <h2 id="small-room-heading" className="text-2xl font-black md:text-3xl">Кухни для маленького помещения 5, 6 и 7 м²</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Площадь — отправная точка. Для проекта нужны длины стен, окно, дверь и коммуникации. Изображения показывают идеи, а не измеренные помещения указанной площади.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{roomTasks.map(task => <article key={task.title} className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
        <img src={task.image} alt={`Пример компактной планировки для обсуждения задачи «${task.title}»`} width={1200} height={800} loading="lazy" className="aspect-[3/2] w-full object-cover" />
        <div className="p-4"><h3 className="text-lg font-black">{task.title}</h3><p className="mt-3 text-sm leading-6 text-stone-700">{task.text}</p><details className="mt-3 border-t border-stone-200"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold">Что проверить</summary><p className="mt-2 text-sm leading-6 text-stone-700">{task.check}</p></details></div>
      </article>)}</div>
      <Link href="/blog/kuhnya-6-kv-m-v-hruschevke" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4">Подробнее о кухне 6 м² в хрущёвке →</Link>
    </section>

    <section className="mt-12" aria-labelledby="small-price-heading">
      <h2 id="small-price-heading" className="text-2xl font-black md:text-3xl">Стоимость маленькой кухни: примеры комплектаций</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Базовые комплектации из раздела цен. Начальные цены утверждены 11 октября 2026 года; изменения размеров и состава требуют расчёта. Размеры относятся к мебели, а не к площади комнаты.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{examples.map(model => <article key={model.id} className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
        <img src={exampleImage(model)} alt={`Пример дизайна: ${model.name.toLowerCase()}`} width={762} height={506} loading="lazy" className="aspect-[3/2] w-full object-cover" />
        <div className="p-5"><h3 className="text-xl font-black">{model.name}</h3><p className="mt-2 text-2xl font-black">{startingPrice(model)}</p><p className="mt-2 text-sm text-stone-600">Базовая комплектация · {model.dimensions} · {model.facadeMaterial}</p>
          <details className="mt-4 rounded-xl bg-stone-50 px-4"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold">Состав и что оплачивается отдельно</summary><h4 className="mt-2 text-sm font-bold">В базовой комплектации</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6">{model.equipment.map(item => <li key={item}>{item}</li>)}</ul><h4 className="mt-4 text-sm font-bold">Не входит в начальную цену</h4><ul className="mt-2 list-disc space-y-2 pb-4 pl-5 text-sm leading-6">{model.exclude.map(item => <li key={item}>{item}</li>)}</ul></details>
        </div>
      </article>)}</div>
      <div className="mt-4 flex flex-wrap gap-3"><Link href="/prices" className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-bold">Из чего складывается цена</Link><Link href="/calculator" className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-bold">Калькулятор кухни</Link></div>
    </section>

    <section className="mt-12 grid gap-5 rounded-3xl bg-stone-950 p-5 text-white md:grid-cols-2 md:p-8" aria-labelledby="small-budget-heading">
      <div><h2 id="small-budget-heading" className="text-2xl font-black">Недорогая маленькая кухня: что упростить</h2><p className="mt-3 text-sm leading-6 text-stone-300">Простая планировка, практичные фасады и только нужные механизмы. Сравнивайте одинаковый состав: небольшая кухня не всегда дешевле, если в ней много сложной фурнитуры.</p><Link href="/scenarios/byudzhetnaya-kuhnya" className="mt-4 inline-flex min-h-11 items-center font-bold text-amber-300 underline underline-offset-4">Бюджетные решения →</Link></div>
      <div className="space-y-3"><details className="rounded-xl bg-white/10 px-4"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold">Где можно сократить затраты</summary><p className="pb-4 text-sm leading-6 text-stone-300">Сравнить ЛДСП и покрытия МДФ, количество ящиков и варианты углового хранения. Отказаться от лишнего декора и механизмов, которыми вы не будете пользоваться.</p></details><details className="rounded-xl bg-white/10 px-4"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold">Что требует проверки даже при экономии</summary><p className="pb-4 text-sm leading-6 text-stone-300">Крепления, подходящая нагрузка фурнитуры, защита торцов у мойки и условия установки техники. Их выбирают под реальное использование, а не только по цене.</p></details></div>
    </section>

    <section className="mt-12" aria-labelledby="small-before-order-heading">
      <h2 id="small-before-order-heading" className="text-2xl font-black md:text-3xl">Что проверить перед заказом компактной кухни</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{smallKitchenPriorities.slice(1).map(item => <details key={item.id} className="rounded-2xl border border-stone-200 bg-white px-4"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold">{item.title}</summary><p className="mt-2 text-sm leading-6 text-stone-700">{item.tradeoff}</p><p className="mt-2 pb-4 text-sm leading-6"><strong>Проверяем:</strong> {item.check}</p></details>)}</div>
      <nav aria-label="Связанные решения для маленькой кухни" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
        { href: "/catalog/pryamye-kuhni", label: "Прямые планировки" },
        { href: "/catalog/uglovye-kuhni", label: "Угловые планировки" },
        { href: "/catalog/kuhni-do-potolka", label: "Шкафы до потолка" },
        { href: "/scenarios/dlya-malenkoy-kuhni", label: "Организация маленькой кухни" },
        { href: "/materials/ldsp", label: "Практичные фасады ЛДСП" },
        { href: "/materials/mdf-fasady", label: "Фасады МДФ и покрытия" },
        { href: "/design-proekt-kuhni", label: "Что входит в проект кухни" },
        { href: "/locations", label: "Условия заказа по городам" },
      ].map(link => <Link key={link.href} href={link.href} className="flex min-h-12 items-center rounded-xl border border-stone-200 bg-white p-3 text-sm font-bold hover:border-stone-500 focus-visible:ring-2 focus-visible:ring-amber-600">{link.label} →</Link>)}</nav>
    </section>

    <section className="mt-12" aria-labelledby="small-faq-heading"><h2 id="small-faq-heading" className="text-2xl font-black md:text-3xl">Вопросы о маленьких кухнях на заказ</h2><div className="mt-5 space-y-3">{smallKitchenFaq.map(item => <details key={item.question} className="rounded-2xl border border-stone-200 bg-white px-4"><summary className="min-h-12 cursor-pointer content-center py-3 text-sm font-bold">{item.question}</summary><p className="pb-4 text-sm leading-6 text-stone-700">{item.answer}</p></details>)}</div></section>
  </>;
}

export function SmallKitchenPage() {
  return <>
    <JsonLd data={[
      breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Каталог", path: "/catalog" }, { name: "Маленькие кухни", path: SMALL_KITCHEN_PATH }]),
      compactJsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", url: siteUrl(SMALL_KITCHEN_PATH), name: "Маленькие кухни на заказ — компактные планировки", description: "Выбор маленьких прямых и угловых кухонь, проверка рабочей зоны, хранения и техники, примеры комплектаций и расчёт по размерам.", image: siteUrl(smallPriorityImage("overview")), mainEntity: { "@type": "Service", name: "Изготовление маленьких кухонь по индивидуальным размерам", provider: { "@type": "Organization", name: "КухниBY", url: siteUrl("/") } } }),
      compactJsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: smallKitchenFaq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }),
    ]} />
    <ExploreContextProvider sourceRoute={SMALL_KITCHEN_PATH}>
      <div className="bg-stone-50 pb-24 text-stone-950"><div className="container-site py-4 md:py-8">
        <nav aria-label="Хлебные крошки" className="flex min-h-11 flex-wrap items-center gap-2 text-xs text-stone-600 md:text-sm"><Link href="/">Главная</Link><span aria-hidden="true">/</span><Link href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>Маленькие кухни</span></nav>
        <header className="mt-3"><h1 className="max-w-4xl text-3xl font-black leading-tight md:text-5xl">Маленькие кухни на заказ</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 md:text-base">Выберите, что важно сохранить: столешницу, хранение, технику или проход. Затем сравните компактные кухни и отправьте размеры для расчёта.</p></header>
        <SmallKitchenExplorer />
        <SmallKitchenSelection><SmallKitchenDetails /></SmallKitchenSelection>
      </div></div>
    </ExploreContextProvider>
  </>;
}
