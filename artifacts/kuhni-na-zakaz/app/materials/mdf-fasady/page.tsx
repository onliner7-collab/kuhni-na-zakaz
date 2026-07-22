import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { ArrowRight, CircleAlert, Layers3 } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContextSummary, ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import { MaterialSurfaceComparator } from "@/components/materials/MaterialSurfaceComparator";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Фасады МДФ для кухни: поверхность и сравнение";
const description = "Как сравнить поверхность фасадов МДФ: крупный план, визуальные различия, вопросы к образцу, ограничения и следующий шаг без неподтверждённых свойств и цен.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/materials/mdf-fasady" },
  robots: { index: true, follow: true },
  openGraph: buildOpenGraph("/materials/mdf-fasady", title, description),
  twitter: buildTwitterMetadata(title, description),
};

const comparison = [
  { question: "Как выглядит поверхность?", action: "Рассмотреть один физический образец при дневном и искусственном свете." },
  { question: "Как читается торец?", action: "Попросить показать фактический образец торца и способ обработки выбранного решения." },
  { question: "Как выглядит рядом с окружением?", action: "Сопоставить образец со столешницей, стеной и освещением проекта." },
  { question: "Что известно об уходе?", action: "Запросить подтверждённые рекомендации именно для выбранного покрытия." },
];

const limitations = [
  "Экран не подтверждает точный оттенок, фактуру или степень блеска.",
  "Состав и доступные варианты уточняются для выбранного покрытия.",
  "Цена не выводится без размеров, покрытия и состава заказа.",
  "Совместимость со стилем и планировкой проверяется в конкретном проекте, а не по названию материала.",
];

const nextLinks = [
  { href: "/styles", title: "Сопоставить со стилем", text: "Открыть стили как отдельный визуальный вопрос, без обещания совместимости." },
  { href: "/catalog/uglovye-kuhni", title: "Проверить угловую планировку", text: "Сначала оценить форму помещения, затем возвращаться к фасаду." },
  { href: "/materials/furnitura", title: "Перейти к механизмам", text: "Фурнитура — отдельный слой выбора после внешней поверхности фасада." },
  { href: "/calculator", title: "Передать выбор в расчёт", text: "Зафиксировать МДФ как интерес, не обещая цену до исходных данных." },
];

export default function MdfFacadesPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Материалы", path: "/materials" }, { name: "Фасады МДФ", path: "/materials/mdf-fasady" }]);

  return <ExploreContextProvider sourceRoute="/materials/mdf-fasady">
    <JsonLd data={breadcrumb} />
    <div className="overflow-x-clip bg-[#f7f5f2] pb-28 text-stone-950 md:pb-16">
      <section className="border-b border-stone-200 bg-white">
        <div className="container-site py-6 md:py-12">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-stone-600" aria-label="Хлебные крошки"><Link href="/" className="min-h-11 content-center">Главная</Link><span aria-hidden="true">/</span><Link href="/materials" className="min-h-11 content-center">Материалы</Link><span aria-hidden="true">/</span><span>Фасады МДФ</span></nav>
          <div className="mt-4 max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Поверхности фасадов МДФ</p><h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Как меняется фасад МДФ при разном свете</h1><p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">Выберите поверхность, свет или сочетание. Экран задаёт визуальное направление, а точный вариант подтверждается по образцу.</p></div>
        </div>
      </section>

      <div className="container-site py-6 md:py-12">
        <MaterialSurfaceComparator />

        <section id="compare" className="mt-16 scroll-mt-24" aria-labelledby="compare-title"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Сравнение</p><h2 id="compare-title" className="mt-2 text-3xl font-bold md:text-4xl">Вопросы, которые можно проверить по образцу</h2><div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-stone-100"><tr><th className="p-4 font-bold">Вопрос</th><th className="p-4 font-bold">Следующее действие</th></tr></thead><tbody>{comparison.map((row) => <tr key={row.question} className="border-t border-stone-200"><th scope="row" className="p-4 align-top font-semibold">{row.question}</th><td className="p-4 leading-6 text-stone-600">{row.action}</td></tr>)}</tbody></table></div></section>

        <section id="limits" className="mt-16 scroll-mt-24 overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-50" aria-labelledby="limits-title"><div className="grid lg:grid-cols-[.75fr_1.25fr]"><figure className="min-h-0 bg-white"><img src="/media/pilots/mdf-fasady/webp/mdf-surface-cutaway.webp" alt="Условная схема основы, покрытия и торца фасада МДФ" width="1200" height="675" loading="lazy" decoding="async" className="aspect-[16/9] h-auto w-full object-cover lg:h-full" /><figcaption className="px-5 py-3 text-sm text-stone-600">Условная AI-иллюстрация слоёв; состав конкретного фасада подтверждается по образцу и документации.</figcaption></figure><div className="p-6 md:p-9"><div className="flex items-start gap-3"><CircleAlert className="mt-1 h-7 w-7 shrink-0 text-amber-800" aria-hidden /><h2 id="limits-title" className="min-w-0 text-3xl font-bold leading-tight">Что нужно уточнить</h2></div><ul className="mt-6 grid gap-3">{limitations.map((item) => <li key={item} className="flex gap-3 rounded-2xl bg-white p-4 text-sm leading-6"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-700" />{item}</li>)}</ul></div></div></section>

        <section className="mt-16" aria-labelledby="combination-title"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-800">Стиль и планировка</p><h2 id="combination-title" className="mt-2 text-3xl font-bold md:text-4xl">Продолжите с отдельным вопросом</h2><p className="mt-3 max-w-3xl leading-7 text-stone-600">Мы не объявляем МДФ совместимым с конкретным стилем или формой только по названию. Переходы ниже помогают проверить следующий слой решения.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{nextLinks.map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-stone-200 bg-white p-5 hover:border-violet-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-700"><Layers3 className="h-5 w-5 text-violet-800" aria-hidden /><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-800">Открыть <ArrowRight className="h-4 w-4" aria-hidden /></span></Link>)}</div></section>

        <section className="mt-8" aria-labelledby="mdf-transition-title"><h2 id="mdf-transition-title" className="sr-only">Переходы после сравнения поверхности</h2><RelatedExplorationRail route="/materials/mdf-fasady" /></section>

        <section id="calculation" className="mt-16 scroll-mt-24 grid overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="calculation-title"><div className="p-6 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-300">Цена или заявка</p><h2 id="calculation-title" className="mt-2 text-3xl font-bold md:text-4xl">Передайте визуальное направление</h2><p className="mt-4 leading-7 text-stone-300">Форма сохраняет интерес к МДФ. Цена и вариант покрытия определяются после уточнения заказа.</p><div className="mt-6 text-stone-950"><ContextSummary /></div></div><div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="material-mdf-surface" sourcePage="/materials/mdf-fasady" sourceType="material" submitLabel="Передать вопрос по фасадам" answersEventName="mdf-surface-answers" defaultAnswers={{ material: "МДФ", evidenceStatus: "requires-sample-confirmation" }} /></div></section>
      </div>
    </div>
  </ExploreContextProvider>;
}
