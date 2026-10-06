import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContextSummary, ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import type { RegionalLocationData } from "@/data/locations";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { BorisovJourney } from "./BorisovJourney";

type Props = {
  location: RegionalLocationData;
  cases: unknown[];
  hasLocalCases: boolean;
  jsonLd: JsonLdObject[];
};

const kitchenTypes = [
  { href: "/catalog/uglovye-kuhni", label: "Угловые кухни", text: "Для планировок с двумя рабочими стенами и дополнительным хранением." },
  { href: "/catalog/pryamye-kuhni", label: "Прямые кухни", text: "Для компактных помещений и понятной линейной планировки." },
  { href: "/catalog/p-obraznye-kuhni", label: "П-образные кухни", text: "Когда нужно задействовать три стены и разделить рабочие зоны." },
  { href: "/catalog/kuhni-do-potolka", label: "Кухни до потолка", text: "Для дополнительного хранения и аккуратной верхней линии шкафов." },
];

export function BorisovPilotPage({ location, jsonLd }: Props) {
  return (
    <ExploreContextProvider sourceRoute="/locations/borisov">
      <JsonLd data={jsonLd} />
      <div className="overflow-x-clip bg-[#f5f4ef] pb-28 text-stone-950 md:pb-16">
        <section className="border-b border-stone-200 bg-emerald-950 text-white">
          <div className="container-site py-12 md:py-20">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-emerald-100/80" aria-label="Хлебные крошки">
              <Link href="/" className="min-h-11 content-center">Главная</Link>
              <span aria-hidden="true">/</span>
              <Link href="/locations" className="min-h-11 content-center">Города</Link>
              <span aria-hidden="true">/</span>
              <span>Борисов</span>
            </nav>

            <div className="mt-10 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Кухни на заказ · Борисов</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">{location.h1}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">{location.intro}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#calculation" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-300 px-5 font-bold text-emerald-950 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white">Рассчитать кухню <ArrowRight className="h-4 w-4" aria-hidden /></a>
                  <Link href="/catalog" className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-5 font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-white">Посмотреть каталог</Link>
                </div>
              </div>
              <figure className="overflow-hidden rounded-[2rem] bg-emerald-900">
                <img src="/media/pilots/borisov/webp/borisov-process-request.webp" alt="Эскиз кухни на заказ перед расчётом проекта" width="1200" height="800" fetchPriority="high" className="aspect-[3/2] h-auto w-full object-cover" />
                <figcaption className="px-5 py-3 text-sm text-emerald-50/75">Иллюстрация этапа расчёта, не фотография выполненного объекта в Борисове.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <div className="container-site py-12 md:py-20">
          <section className="grid gap-4 md:grid-cols-3" aria-label="Что входит в заказ кухни">
            <article className="rounded-2xl border border-emerald-200 bg-white p-5"><CheckCircle2 className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Проект под размеры</h2><p className="mt-2 text-sm leading-6 text-stone-600">Начинаем с плана, фото помещения и списка техники, затем уточняем точные размеры на замере.</p></article>
            <article className="rounded-2xl border border-emerald-200 bg-white p-5"><CheckCircle2 className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Планировка и материалы</h2><p className="mt-2 text-sm leading-6 text-stone-600">Подбираем форму кухни, фасады, столешницу и фурнитуру под помещение и задачу.</p></article>
            <article className="rounded-2xl border border-emerald-200 bg-white p-5"><CheckCircle2 className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Доставка и монтаж</h2><p className="mt-2 text-sm leading-6 text-stone-600">Условия рассчитываются по адресу, комплектации, этажности и готовности объекта.</p></article>
          </section>

          <section className="mt-16" aria-labelledby="types-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Каталог решений</p>
            <h2 id="types-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Какие кухни можно заказать в Борисове</h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-600">Выберите близкую планировку, а окончательную комплектацию адаптируем под размеры, технику и особенности помещения.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kitchenTypes.map((type) => (
                <Link key={type.href} href={type.href} className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">
                  <h3 className="font-bold">{type.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{type.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Посмотреть варианты <ArrowRight className="h-4 w-4" aria-hidden /></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 rounded-[2rem] bg-white p-6 md:grid-cols-2 md:p-9" aria-labelledby="corner-title">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Угловая планировка</p>
              <h2 id="corner-title" className="mt-2 text-3xl font-bold">Угловые кухни на заказ в Борисове</h2>
              <p className="mt-4 leading-7 text-stone-600">Угловая кухня подходит, когда рабочая зона занимает две стены. До расчёта определяем длину каждой стороны, расположение мойки и техники, проходы, угол, вентиляцию и розетки. Так цена зависит от реальной комплектации, а не от случайной фотографии из каталога.</p>
              <Link href="/catalog/uglovye-kuhni" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-950 px-5 font-bold text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">Каталог угловых кухонь <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <div className="rounded-2xl bg-[#f5f4ef] p-5">
              <h3 className="font-bold">Что подготовить для расчёта</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
                <li>Размеры обеих стен и высоту помещения.</li>
                <li>Фото зоны кухни, выводов воды, вентиляции и электрики.</li>
                <li>Список встроенной техники и пожелания к хранению.</li>
                <li>Ориентир по бюджету, чтобы предложить подходящую комплектацию.</li>
              </ul>
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_.9fr]" aria-labelledby="price-title">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Цена и комплектация</p>
              <h2 id="price-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Недорогая кухня в Борисове: как выбрать без ложной экономии</h2>
              <p className="mt-4 max-w-3xl leading-7 text-stone-600">Запросы «дешёвая кухня» и «кухни недорого» понятны, но у кухни на заказ нет честной единой цены без замеров. Более доступный вариант строится на простой планировке, практичных фасадах, нужном наборе модулей и фурнитуре без лишних сложных механизмов. Мы сравним варианты в одной смете, чтобы было видно, за что вы платите.</p>
            </div>
            <aside className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
              <CircleAlert className="h-6 w-6 text-amber-800" aria-hidden />
              <h3 className="mt-3 font-bold">Что влияет на стоимость</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">{location.priceNote}</p>
              <Link href="/prices" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Как формируется цена <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </aside>
          </section>

          <div className="mt-16"><BorisovJourney /></div>

          <section id="local-proof" className="mt-16 scroll-mt-24 rounded-[2rem] border border-stone-300 bg-white p-6 md:p-9" aria-labelledby="proof-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-stone-500">Честная привязка к городу</p>
            <h2 id="proof-title" className="mt-2 text-3xl font-bold">Примеры решений и выполненные работы</h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-600">Для страницы используются иллюстрации процесса и каталог решений. Реальные работы и отзывы с привязкой к Борисову добавляются только после проверки источника; это помогает сравнивать предложения по фактам, а не по неподтверждённым фотографиям.</p>
          </section>

          <section className="mt-16" aria-labelledby="faq-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Вопросы перед заказом</p>
            <h2 id="faq-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Частые вопросы о кухнях в Борисове</h2>
            <div className="mt-7 max-w-4xl space-y-3">
              {location.faq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">{item.question}<ArrowRight className="h-4 w-4 shrink-0 text-emerald-800 transition-transform group-open:rotate-90" aria-hidden /></summary>
                  <p className="px-5 pb-5 leading-7 text-stone-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="borisov-transition-title"><h2 id="borisov-transition-title" className="sr-only">Полезные переходы</h2><RelatedExplorationRail route="/locations/borisov" /></section>

          <div id="measure" className="scroll-mt-24" />
          <section id="calculation" className="mt-16 scroll-mt-24 grid overflow-hidden rounded-[2rem] bg-emerald-950 text-white lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="calculation-title">
            <div className="p-6 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Расчёт кухни</p><h2 id="calculation-title" className="mt-2 text-3xl font-bold md:text-4xl">Рассчитать кухню для Борисова</h2><p className="mt-4 leading-7 text-emerald-50/75">Передайте размеры, фото помещения и пожелания к планировке. Сначала обсудим ориентир, а точную цену и условия закрепим после проверки комплектации и помещения.</p><div className="mt-6"><ContextSummary /></div></div>
            <div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="location-borisov" sourcePage="/locations/borisov" sourceType="location-region" city="Борисов" cityKey="borisov" submitLabel="Рассчитать кухню" answersEventName="borisov-journey-answers" showHasMeasurements={false} /></div>
          </section>
        </div>
      </div>
    </ExploreContextProvider>
  );
}
