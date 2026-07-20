import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContextSummary, ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import type { RegionalLocationData } from "@/data/locations";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { BorisovJourney } from "./BorisovJourney";

type PortfolioCase = { id: string | number; title: string; slug: string; mainImage: string; city: string };
type Props = { location: RegionalLocationData; cases: PortfolioCase[]; hasLocalCases: boolean; jsonLd: JsonLdObject[] };

const links = [
  { href: "/catalog/pryamye-kuhni", label: "Прямая кухня" },
  { href: "/catalog/uglovye-kuhni", label: "Угловая кухня" },
  { href: "/catalog/p-obraznye-kuhni", label: "П‑образная кухня" },
  { href: "/materials/mdf-fasady", label: "Сравнить фасады МДФ" },
];

export function BorisovPilotPage({ location, cases, hasLocalCases, jsonLd }: Props) {
  return <ExploreContextProvider sourceRoute="/locations/borisov">
    <JsonLd data={jsonLd} />
    <div className="overflow-x-clip bg-[#f5f4ef] pb-28 text-stone-950 md:pb-16">
      <section className="border-b border-stone-200 bg-emerald-950 text-white">
        <div className="container-site py-12 md:py-20">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-emerald-100/80" aria-label="Хлебные крошки"><Link href="/" className="min-h-11 content-center">Главная</Link><span aria-hidden="true">/</span><Link href="/locations" className="min-h-11 content-center">Города</Link><span aria-hidden="true">/</span><span>Борисов</span></nav>
          <div className="mt-10 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Заказ кухни для Борисова</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Как проходит заказ кухни для Борисова</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">Вопрос пользователя → подтверждённые условия → этапы заказа → следующий шаг. Там, где локальных данных нет, мы это показываем явно.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="#process" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-300 px-5 font-bold text-emerald-950 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white">Посмотреть путь <ArrowRight className="h-4 w-4" aria-hidden /></a><a href="#measure" className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-5 font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-white">Оставить вопрос</a></div></div>
          <figure className="overflow-hidden rounded-[2rem] bg-emerald-900"><img src="/media/pilots/borisov/webp/borisov-process-request.webp" alt="Эскиз кухни на столе перед обсуждением заказа" width="1200" height="800" fetchPriority="high" className="aspect-[3/2] h-auto w-full object-cover" /><figcaption className="px-5 py-3 text-sm text-emerald-50/75">AI‑иллюстрация процесса, не локальный проект.</figcaption></figure></div>
        </div>
      </section>

      <div className="container-site pt-10 md:pt-16"><BorisovJourney /></div>

      <div className="container-site py-12 md:py-20">
        <section className="grid gap-4 md:grid-cols-3" aria-label="Подтверждённые границы страницы">
          <article className="rounded-2xl border border-emerald-200 bg-white p-5"><CheckCircle2 className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Что подтверждено</h2><p className="mt-2 text-sm leading-6 text-stone-600">На странице описан порядок обсуждения заказа и передача контекста в заявку.</p></article>
          <article className="rounded-2xl border border-amber-200 bg-white p-5"><CircleAlert className="h-6 w-6 text-amber-700" aria-hidden /><h2 className="mt-3 font-bold">Что уточняется</h2><p className="mt-2 text-sm leading-6 text-stone-600">Адрес, зона выезда, логистика, сроки и стоимость зависят от исходных данных.</p></article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5"><CircleAlert className="h-6 w-6 text-stone-600" aria-hidden /><h2 className="mt-3 font-bold">BLOCKED_BY_INPUT</h2><p className="mt-2 text-sm leading-6 text-stone-600">Локальный real proof для Борисова не подключён: exact-city evidence отсутствует.</p></article>
        </section>

        <section id="local-proof" className="mt-16 scroll-mt-24 rounded-[2rem] border border-dashed border-stone-300 bg-white p-6 md:p-9" aria-labelledby="local-proof-title"><p className="text-sm font-bold uppercase tracking-[0.16em] text-stone-500">Локальное доказательство</p><h2 id="local-proof-title" className="mt-2 text-3xl font-bold">Подтверждённых проектов в Борисове пока нет</h2><p className="mt-3 max-w-3xl leading-7 text-stone-600">AI-концепты и изображения без provenance не считаются локальным proof. Не подставляем Минск или Минскую область вместо Борисова.</p>{hasLocalCases && cases.length ? <p className="mt-4 text-sm text-amber-800">Данные найдены, но требуют отдельной проверки источника перед публикацией.</p> : <p className="mt-4 text-sm font-semibold text-stone-700">Статус: BLOCKED_BY_INPUT — добавление возможно после подтверждения владельцем проекта и media set.</p>}</section>

        <section className="mt-16" aria-labelledby="next-title"><h2 id="next-title" className="text-3xl font-bold">Следующий шаг</h2><p className="mt-3 max-w-2xl leading-7 text-stone-600">Выберите ближайший вопрос или передайте исходные данные специалисту. Точная цена и сроки появляются только после проверки комплектации и помещения.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{links.map((link) => <Link key={link.href} href={link.href} className="rounded-2xl border border-stone-200 bg-white p-5 font-bold hover:border-emerald-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">{link.label}<ArrowRight className="mt-4 h-4 w-4 text-emerald-800" aria-hidden /></Link>)}</div></section>

        <section className="mt-8" aria-labelledby="borisov-transition-title"><h2 id="borisov-transition-title" className="sr-only">Переходы после изучения процесса</h2><RelatedExplorationRail route="/locations/borisov" /></section>

        <section id="measure" className="mt-16 scroll-mt-24 grid overflow-hidden rounded-[2rem] bg-emerald-950 text-white lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="measure-title"><div className="p-6 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Заявка</p><h2 id="measure-title" className="mt-2 text-3xl font-bold md:text-4xl">Передайте вопрос и известные параметры</h2><p className="mt-4 leading-7 text-emerald-50/75">Укажите Борисов как город заявки. Адрес, формат выезда, стоимость и сроки уточняются после получения исходных данных.</p><div className="mt-6"><ContextSummary /></div></div><div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="location-borisov-process" sourcePage="/locations/borisov" sourceType="location-region" city="Борисов" cityKey="borisov" submitLabel="Передать вопрос" answersEventName="borisov-journey-answers" showHasMeasurements={false} /></div></section>
      </div>
    </div>
  </ExploreContextProvider>;
}
