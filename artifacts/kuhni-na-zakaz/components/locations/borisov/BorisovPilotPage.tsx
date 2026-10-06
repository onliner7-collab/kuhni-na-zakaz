import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ExploreContextProvider } from "@/components/exploration";
import type { RegionalLocationData } from "@/data/locations";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, Check, Ruler, Truck, Wallet } from "lucide-react";
import { BorisovJourney } from "./BorisovJourney";

type Props = { location: RegionalLocationData; cases: unknown[]; hasLocalCases: boolean; jsonLd: JsonLdObject[] };
const corner = "/media/visual-rescue/pryamye-kuhni/webp/line-l-compare.webp";
const kitchenTypes = [
  { href: "/catalog/uglovye-kuhni", label: "Угловые", text: "Две стены — больше рабочей зоны", image: corner, alt: "Светлая угловая кухня с мойкой у окна" },
  { href: "/catalog/pryamye-kuhni", label: "Прямые", text: "Всё нужное в одной линии", image: "/media/visual-rescue/pryamye-kuhni/webp/line-balanced.webp", alt: "Прямая кухня с кремовыми фасадами" },
  { href: "/catalog/malenkie-kuhni", label: "Маленькие", text: "Каждый сантиметр с пользой", image: "/media/visual-rescue/malenkie-kuhni/webp/small-overview.webp", alt: "Компактная зелёная кухня с деревянной столешницей" },
  { href: "/catalog/kuhni-do-potolka", label: "До потолка", text: "Дополнительный ярус хранения", image: "/media/visual-rescue/kuhni-do-potolka/webp/ceiling-overview.webp", alt: "Бежевая кухня со шкафами до потолка" },
];
const button = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 font-bold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700";

export function BorisovPilotPage({ location, jsonLd }: Props) {
  return <ExploreContextProvider sourceRoute="/locations/borisov">
    <JsonLd data={jsonLd} />
    <div className="overflow-x-clip bg-[#f5f4ef] pb-28 text-stone-950 md:pb-16">
      <section className="container-site pt-3 pb-8 md:pt-6 md:pb-14">
        <nav className="flex items-center gap-2 text-xs text-stone-600" aria-label="Хлебные крошки"><Link href="/" className="min-h-11 content-center">Главная</Link><span aria-hidden>/</span><Link href="/locations" className="min-h-11 content-center">Города</Link><span aria-hidden>/</span><span>Борисов</span></nav>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Для вашего дома · Борисов</p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl">{location.h1}</h1>
            <p className="mt-4 max-w-lg text-base leading-6 text-stone-600 md:text-lg md:leading-7">Ваша планировка, любимые оттенки и удобное хранение. Подберём кухню под помещение и бюджет.</p>
            <div className="mt-5 hidden lg:block"><a href="#calculation" className={button}>Рассчитать мою кухню <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200 lg:col-start-2 lg:row-span-2">
            <picture><source media="(max-width: 767px)" srcSet="/uploads/locations/borisov-3d/borisov-hero-bright-mobile-20260628-480.webp" /><img src="/uploads/locations/borisov-3d/borisov-hero-bright-20260628.webp" alt="Светлая кухня с деревянными акцентами и полуостровом" width="1200" height="800" fetchPriority="high" className="aspect-[4/3] w-full object-cover object-[center_60%] lg:aspect-[5/4]" /></picture>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-stone-800">Вдохновение для вашей кухни</span>
          </div>
          <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-2">
            <div id="borisov-hero-action" className="lg:hidden"><a href="#calculation" className={button + " w-full"}>Рассчитать мою кухню <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
            <a href="#types" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-emerald-900 lg:justify-start">Выбрать планировку <ArrowRight className="h-4 w-4" aria-hidden /></a>
            <div className="grid grid-cols-3 gap-3 border-t border-stone-300 pt-4 text-xs font-semibold leading-5 text-stone-700 md:text-sm">
              <span><Ruler className="mb-2 h-5 w-5 text-emerald-800" aria-hidden />Под ваши размеры</span><span><Wallet className="mb-2 h-5 w-5 text-emerald-800" aria-hidden />Выбор комплектации</span><span><Truck className="mb-2 h-5 w-5 text-emerald-800" aria-hidden />Доставка и монтаж</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container-site space-y-12 md:space-y-20">
        <section id="types" className="scroll-mt-24" aria-labelledby="types-title">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Начните с формы</p><h2 id="types-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Какая кухня вам подходит?</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">{kitchenTypes.map(type => <Link key={type.href} href={type.href} className="group overflow-hidden rounded-2xl bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
            <img src={type.image} alt={type.alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" /><div className="p-3 md:p-5"><h3 className="flex items-center justify-between gap-2 font-bold md:text-lg">{type.label}<ArrowRight className="h-4 w-4 shrink-0 text-emerald-800" aria-hidden /></h3><p className="mt-1 text-xs leading-5 text-stone-600 md:text-sm">{type.text}</p></div>
          </Link>)}</div>
        </section>
        <section id="local-proof" className="grid scroll-mt-24 overflow-hidden rounded-[1.5rem] bg-white lg:grid-cols-2" aria-labelledby="corner-title">
          <img src={corner} alt="Угловая кухня с непрерывной столешницей вдоль двух стен" width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] h-full w-full object-cover" />
          <div className="p-5 md:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Больше места для жизни</p><h2 id="corner-title" className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Угловые кухни в Борисове</h2><p className="mt-3 leading-6 text-stone-600">Для двух рабочих стен: готовить, мыть и хранить удобно, когда всё на своём месте.</p><ul className="mt-5 space-y-3 text-sm">{["Рабочая поверхность между мойкой и плитой", "Хранение в углу без труднодоступных полок", "Место для техники и свободные проходы"].map(text => <li key={text} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-emerald-800" aria-hidden />{text}</li>)}</ul><Link href="/catalog/uglovye-kuhni" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-emerald-800">Смотреть угловые кухни <ArrowRight className="h-4 w-4" aria-hidden /></Link></div>
        </section>
        <section aria-labelledby="price-title">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Разумный бюджет</p><h2 id="price-title" className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Недорогая кухня в Борисове — без лишнего</h2>
          <div className="mt-6 grid overflow-hidden rounded-[1.5rem] bg-[#e8e9df] md:grid-cols-2"><img src="/media/visual-rescue/pryamye-kuhni/webp/line-compact.webp" alt="Лаконичная прямая кухня с практичной рабочей зоной" width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] h-full w-full object-cover" /><div className="p-5 md:p-8"><ol className="space-y-5">{[["01", "Простая планировка", "Стандартные модули вместо сложных конструкций."], ["02", "Практичные фасады", "Сравним ЛДСП и МДФ по цене и уходу."], ["03", "Нужная фурнитура", "Оставим удобные механизмы, уберём необязательные."]].map(([n,title,text]) => <li key={n} className="flex gap-4"><span className="text-sm font-bold text-emerald-800">{n}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-600">{text}</p></div></li>)}</ol><details className="mt-5 border-t border-stone-400/30 pt-2"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold">От чего зависит окончательная цена?</summary><p className="mt-2 text-sm leading-6 text-stone-700">{location.priceNote}</p><Link href="/prices" className="inline-flex min-h-11 items-center text-sm font-bold text-emerald-800">Подробнее о стоимости →</Link></details></div></div>
        </section>
        <BorisovJourney />
        <section aria-labelledby="faq-title"><h2 id="faq-title" className="text-3xl font-bold tracking-tight md:text-4xl">Что важно знать перед заказом</h2><div className="mt-5 divide-y divide-stone-200 rounded-2xl bg-white px-5 md:px-7">{location.faq.map(item => <details key={item.question} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-bold md:text-base focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">{item.question}<ArrowRight className="h-4 w-4 shrink-0 text-emerald-800 group-open:rotate-90" aria-hidden /></summary><p className="pb-5 text-sm leading-7 text-stone-600">{item.answer}</p></details>)}</div></section>
        <section id="calculation" className="scroll-mt-24 grid overflow-hidden rounded-[1.5rem] bg-emerald-950 text-white lg:grid-cols-2" aria-labelledby="calculation-title"><div id="measure" className="scroll-mt-24 p-5 md:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Следующий шаг</p><h2 id="calculation-title" className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Сколько будет стоить ваша кухня?</h2><p className="mt-4 max-w-md leading-7 text-emerald-50/85">Оставьте контакт — обсудим размеры, технику и бюджет. Точную цену закрепим после согласования проекта.</p><div className="mt-6 flex items-center gap-3 text-sm text-emerald-100"><Ruler className="h-5 w-5 shrink-0" aria-hidden /><span>Есть план или фото? Подготовьте их к разговору.</span></div></div><div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="location-borisov" sourcePage="/locations/borisov" sourceType="location-region" city="Борисов" cityKey="borisov" submitLabel="Обсудить расчёт" answersEventName="borisov-journey-answers" showHasMeasurements={false} showCity={false} showKitchenType={false} compact /></div></section>
      </div>
    </div>
  </ExploreContextProvider>;
}
