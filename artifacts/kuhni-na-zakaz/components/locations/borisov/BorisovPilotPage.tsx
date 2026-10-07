import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ExploreContextProvider } from "@/components/exploration";
import type { RegionalLocationData } from "@/data/locations";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, MapPin, Ruler, Truck, Wallet } from "lucide-react";
import { BorisovJourney } from "./BorisovJourney";
import { BorisovKitchenPicker } from "./BorisovKitchenPicker";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

type Props = { location: RegionalLocationData; cases: unknown[]; hasLocalCases: boolean; jsonLd: JsonLdObject[] };
const button = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 font-bold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700";

export function BorisovPilotPage({ location, jsonLd }: Props) {
  return <ExploreContextProvider sourceRoute="/locations/borisov">
    <JsonLd data={jsonLd} />
    <main className="overflow-x-clip bg-[#f5f4ef] pb-28 text-stone-950 md:pb-16">
      <section className="container-site pt-3 pb-8 md:pt-6 md:pb-14">
        <nav className="flex items-center gap-2 text-xs text-stone-600" aria-label="Хлебные крошки"><Link href="/" className="min-h-11 content-center">Главная</Link><span aria-hidden>/</span><Link href="/locations" className="min-h-11 content-center">Города</Link><span aria-hidden>/</span><span>Борисов</span></nav>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Для вашего дома · Борисов</p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl">Кухни на заказ в Борисове</h1>
            <p className="mt-4 max-w-lg text-base leading-6 text-stone-600 md:text-lg md:leading-7">Кухня с вашим характером — для семейных завтраков и гостей, которые задержатся до вечера. Производим в Борисове под ваши размеры.</p>
            <div className="mt-5 hidden lg:block"><a href="#calculation" className={button}>Рассчитать мою кухню <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200 lg:col-start-2 lg:row-span-2">
            <picture><source media="(max-width: 767px)" srcSet="/uploads/locations/borisov-3d/borisov-hero-bright-mobile-20260628-480.webp" /><img src="/uploads/locations/borisov-3d/borisov-hero-bright-20260628.webp" alt="Светлая кухня с деревянными акцентами и полуостровом" width="1200" height="800" fetchPriority="high" className="aspect-[4/3] w-full object-cover object-[center_60%] lg:aspect-[5/4]" /></picture>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-stone-800">Вдохновение для вашей кухни</span>
          </div>
          <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-2">
            <div id="borisov-hero-action" className="lg:hidden"><a href="#calculation" className={button + " w-full"}>Рассчитать мою кухню <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
            <a href="#housing" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-emerald-900 lg:justify-start">Посмотреть идеи кухонь <ArrowRight className="h-4 w-4" aria-hidden /></a>
            <div className="grid grid-cols-3 gap-2 border-t border-stone-300 pt-3 text-[11px] font-semibold leading-4 text-stone-700 md:text-sm">
              <span><Ruler className="mb-1 h-4 w-4 text-emerald-800" aria-hidden />Под ваши размеры</span><span><Wallet className="mb-1 h-4 w-4 text-emerald-800" aria-hidden />Выбор комплектации</span><span><Truck className="mb-1 h-4 w-4 text-emerald-800" aria-hidden />Доставка и монтаж</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container-site space-y-12 md:space-y-20">
        <BorisovKitchenPicker />
        <section aria-labelledby="price-title">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Разумный бюджет</p><h2 id="price-title" className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Недорогая кухня в Борисове — без лишнего</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Бюджет ограничен — идеи нет. Подберём фасады, планировку и комплектацию для кухни, которая радует каждый день.</p>
          <div className="mt-6 grid overflow-hidden rounded-[1.5rem] bg-[#e8e9df] md:grid-cols-2"><img src="/media/visual-rescue/pryamye-kuhni/webp/line-compact.webp" alt="Лаконичная прямая кухня с практичной рабочей зоной" width="1200" height="800" loading="lazy" decoding="async" className="hidden aspect-[3/2] h-full w-full object-cover md:block" /><div className="p-5 md:p-8"><ol className="space-y-3">{[["01", "Простая планировка", "Стандартные модули вместо сложных конструкций."], ["02", "Практичные фасады", "Сравним ЛДСП и МДФ по цене и уходу."], ["03", "Нужная фурнитура", "Оставим удобные механизмы, уберём необязательные."]].map(([n,title,text]) => <li key={n} className="flex gap-4"><span className="text-sm font-bold text-emerald-800">{n}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-stone-600">{text}</p></div></li>)}</ol><details className="mt-5 border-t border-stone-400/30 pt-2"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold">От чего зависит окончательная цена?</summary><p className="mt-2 text-sm leading-6 text-stone-700">{location.priceNote}</p><Link href="/prices" className="inline-flex min-h-11 items-center text-sm font-bold text-emerald-800">Подробнее о стоимости →</Link></details></div></div>
        </section>
<section id="local-proof" className="scroll-mt-24 rounded-2xl bg-white p-5 md:p-8" aria-labelledby="local-title"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Рядом с вашим домом</p><h2 id="local-title" className="mt-2 text-2xl font-bold md:text-3xl">Производство — в Борисове</h2><p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">От нашего производства в Борисове — к вашему семейному столу. Создаём кухни, которые хочется фотографировать ещё до первого ужина.</p><div className="mt-4 grid gap-5 md:grid-cols-2"><p className="flex gap-3 text-sm leading-6 text-stone-600"><MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-800" aria-hidden /><span>Производственный и юридический адрес: {CONTACT_DEFAULTS.address}.</span></p><p className="text-sm leading-6 text-stone-600">Хотите купить кухню для дома в Борисовском районе? Укажите населённый пункт: замер, доставку, подъём и монтаж согласуем по вашему адресу.</p></div><Link href="/delivery-installation" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-emerald-800">Как проходят доставка и монтаж →</Link></section>
        <BorisovJourney />
        <section id="calculation" className="scroll-mt-24 grid overflow-hidden rounded-[1.5rem] bg-emerald-950 text-white lg:grid-cols-2" aria-labelledby="calculation-title"><div id="measure" className="scroll-mt-24 p-5 md:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Следующий шаг</p><h2 id="calculation-title" className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Сколько будет стоить ваша кухня?</h2><p className="mt-4 max-w-md leading-7 text-emerald-50/85">Оставьте контакт — обсудим размеры, технику и бюджет. Точную цену закрепим после согласования проекта.</p><div className="mt-6 flex items-center gap-3 text-sm text-emerald-100"><Ruler className="h-5 w-5 shrink-0" aria-hidden /><span>Есть план или фото? Подготовьте их к разговору.</span></div></div><div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="location-borisov" sourcePage="/locations/borisov" sourceType="location-region" city="Борисов" cityKey="borisov" submitLabel="Рассчитать мою кухню" answersEventName="borisov-journey-answers" showHasMeasurements={false} showCity={false} showKitchenType={false} compact /></div></section>
        <section aria-labelledby="faq-title"><h2 id="faq-title" className="text-3xl font-bold tracking-tight md:text-4xl">Перед заказом</h2><div className="mt-5 divide-y divide-stone-200 rounded-2xl bg-white px-5 md:px-7">{location.faq.slice(0, 5).map(item => <details key={item.question} className="group" data-borisov-faq><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-bold md:text-base focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">{item.question}<ArrowRight className="h-4 w-4 shrink-0 text-emerald-800 group-open:rotate-90" aria-hidden /></summary><p className="pb-5 text-sm leading-7 text-stone-600">{item.answer}</p></details>)}</div><details className="mt-3"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold text-emerald-900">Ещё вопросы о кухнях в Борисове</summary><div className="mt-2 divide-y divide-stone-200 rounded-2xl bg-white px-5 md:px-7">{location.faq.slice(5).map(item => <details key={item.question} data-borisov-faq><summary className="min-h-14 cursor-pointer content-center py-4 text-sm font-bold">{item.question}</summary><p className="pb-5 text-sm leading-7 text-stone-600">{item.answer}</p></details>)}</div></details></section>
      </div>
    </main>
  </ExploreContextProvider>;
}
