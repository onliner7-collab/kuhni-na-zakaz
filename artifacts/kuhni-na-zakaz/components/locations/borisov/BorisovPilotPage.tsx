import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import type { RegionalLocationData } from "@/data/locations";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, Factory, MapPin, Ruler, ShieldCheck, Truck, Wrench } from "lucide-react";
import { BorisovJourney } from "./BorisovJourney";

const MEDIA_BASE = "/media/pilots/borisov";

type PortfolioCase = {
  id: string | number;
  title: string;
  slug: string;
  mainImage: string;
  city: string;
};

type Props = {
  location: RegionalLocationData;
  cases: PortfolioCase[];
  hasLocalCases: boolean;
  jsonLd: JsonLdObject[];
};

const kitchenTypes = [
  { href: "/catalog/pryamye-kuhni", title: "Прямая", text: "Для одной стены и компактного рабочего маршрута." },
  { href: "/catalog/uglovye-kuhni", title: "Угловая", text: "Для двух стен и большего объёма хранения." },
  { href: "/catalog/p-obraznye-kuhni", title: "П-образная", text: "Для помещения, где можно сохранить удобные проходы." },
  { href: "/catalog/kuhni-s-ostrovom", title: "С островом", text: "Для просторной кухни после проверки расстояний." },
];

export function BorisovPilotPage({ location, cases, hasLocalCases, jsonLd }: Props) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="overflow-x-clip bg-[#f5f4ef] pb-28 text-stone-950 md:pb-16">
        <section className="relative min-h-[min(840px,calc(100svh-72px))] overflow-hidden bg-emerald-950 text-white">
          <picture className="absolute inset-0">
            <source type="image/avif" srcSet={`${MEDIA_BASE}/avif/borisov-hero-idea-to-kitchen-portrait.avif`} />
            <img src={`${MEDIA_BASE}/webp/borisov-hero-idea-to-kitchen-portrait.webp`} alt="Путь от эскиза до готовой современной кухни" width="900" height="1200" fetchPriority="high" className="h-full w-full object-cover md:object-[center_58%]" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/35 via-emerald-950/25 to-emerald-950 md:bg-gradient-to-r md:from-emerald-950 md:via-emerald-950/70 md:to-transparent" />
          <div className="container-site relative flex min-h-[min(840px,calc(100svh-72px))] flex-col justify-end py-10 md:justify-center md:py-20">
            <nav className="mb-auto flex items-center gap-2 pt-3 text-sm text-white/75 md:mb-8 md:pt-0" aria-label="Хлебные крошки"><Link href="/" className="min-h-11 content-center">Главная</Link><span>/</span><Link href="/locations" className="min-h-11 content-center">Города</Link><span>/</span><span>Борисов</span></nav>
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em]"><Factory className="h-4 w-4 text-emerald-300" aria-hidden />Производство в Борисове</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl md:text-7xl">Кухни на заказ в Борисове: от идеи до монтажа</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85 md:text-lg">Показываем весь путь: выбор решения, замер, проектирование, производство, доставка и установка.</p>
              <div className="mt-6 flex flex-wrap gap-3"><Link href="#process" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-300 px-5 py-3 font-bold text-emerald-950">Посмотреть процесс <ArrowRight className="h-4 w-4" aria-hidden /></Link><Link href="#measure" className="inline-flex min-h-12 items-center rounded-full border border-white/30 bg-black/15 px-5 py-3 font-bold">Записаться на замер</Link></div>
              <p className="mt-4 text-xs text-white/70">AI-концепт, не фотография выполненного проекта или реального цеха.</p>
            </div>
          </div>
        </section>

        <div className="container-site py-14 md:py-20">
          <section className="mb-16 grid gap-4 md:mb-24 md:grid-cols-3" aria-label="Главное о заказе в Борисове">
            <article className="rounded-2xl border border-stone-200 bg-white p-5"><Factory className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Производство в Борисове</h2><p className="mt-2 text-sm leading-6 text-stone-600">Без выдуманного шоурума или отдельного адреса на странице.</p></article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5"><MapPin className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Замер по записи</h2><p className="mt-2 text-sm leading-6 text-stone-600">Условия выезда подтверждаются по конкретному адресу и готовности помещения.</p></article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5"><Truck className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">Доставка и монтаж</h2><p className="mt-2 text-sm leading-6 text-stone-600">Логистика входит в обсуждение проекта до запуска в производство.</p></article>
          </section>

          <BorisovJourney />

          <section className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="borisov-types-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Виды кухонь</p>
            <h2 id="borisov-types-title" className="mt-2 text-3xl font-bold md:text-4xl">Выберите форму для своего помещения</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{kitchenTypes.map((item) => <Link key={item.href} href={item.href} className="group rounded-2xl border border-stone-200 bg-white p-5 hover:border-emerald-700"><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Открыть категорию <ArrowRight className="h-4 w-4" aria-hidden /></span></Link>)}</div>
          </section>

          <section id="location-prices" className="mt-16 scroll-mt-24 rounded-[2rem] bg-stone-950 p-6 text-white md:mt-24 md:p-10" aria-labelledby="borisov-price-title">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Стоимость</p><h2 id="borisov-price-title" className="mt-2 text-3xl font-bold md:text-4xl">Смета зависит от проекта, а не только от длины</h2>
            <p className="mt-4 max-w-3xl leading-7 text-stone-300">Ориентир на странице — от {location.priceFrom.toLocaleString("ru")} BYN. Точная сумма появляется после размеров, фасадов, столешницы, фурнитуры, техники и условий монтажа.</p>
          </section>

          <section className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 lg:grid-cols-4" aria-label="Условия заказа">
            {[{icon:Ruler,title:"Замер",text:location.measurementText},{icon:Truck,title:"Доставка",text:location.deliveryText},{icon:Wrench,title:"Монтаж",text:location.installationText},{icon:ShieldCheck,title:"Поддержка",text:location.warrantyText}].map(({icon:Icon,title,text}) => <article key={title} className="rounded-2xl border border-stone-200 bg-white p-5"><Icon className="h-6 w-6 text-emerald-800" aria-hidden /><h2 className="mt-3 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></article>)}
          </section>

          <section className="mt-16 md:mt-24" aria-labelledby="borisov-concepts-title">
            <div className="grid gap-8 lg:grid-cols-2">
              <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">AI-концепты</p><h2 id="borisov-concepts-title" className="mt-2 text-3xl font-bold">Идеи — отдельно от выполненных работ</h2><p className="mt-3 leading-7 text-stone-600">Концепты помогают обсуждать форму и настроение. Они не подтверждают реализацию конкретного объекта.</p><figure className="mt-6 overflow-hidden rounded-[1.5rem] bg-white"><picture><source type="image/avif" srcSet={`${MEDIA_BASE}/avif/borisov-concepts-angular-oak-landscape.avif`} /><img src={`${MEDIA_BASE}/webp/borisov-concepts-angular-oak-landscape.webp`} alt="Концепт угловой кухни с дубовыми деталями" width="1200" height="800" loading="lazy" className="aspect-[3/2] w-full object-cover" /></picture><figcaption className="px-5 py-3 text-sm text-stone-500">AI-концепт, не реализованный проект.</figcaption></figure></div>
              <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Реальные проекты</p><h2 className="mt-2 text-3xl font-bold">Только с подтверждённым городом</h2><p className="mt-3 leading-7 text-stone-600">Мы не подставляем проекты из других городов под Борисов.</p>{hasLocalCases ? <div className="mt-6 grid gap-4 sm:grid-cols-2">{cases.slice(0,2).map((item) => <Link key={item.id} href={`/portfolio/${item.slug}`} className="overflow-hidden rounded-2xl border border-stone-200 bg-white"><Image src={optimizedImageSrc(item.mainImage) || item.mainImage} alt={item.title} width={640} height={480} className="aspect-[4/3] w-full object-cover" /><div className="p-4"><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm text-stone-500">{item.city}</p></div></Link>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-sm leading-6 text-stone-600">Сейчас в данных сайта нет подтверждённых проектов с городом «Борисов». Посмотрите общее <Link href="/portfolio" className="font-bold text-emerald-800 underline">портфолио</Link>, не считая его локальным доказательством.</div>}</div>
            </div>
          </section>

          <section id="measure" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="borisov-measure-title">
            <div className="grid overflow-hidden rounded-[2rem] bg-emerald-950 text-white lg:grid-cols-[.8fr_1.2fr]"><div className="p-6 md:p-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Предварительный расчёт</p><h2 id="borisov-measure-title" className="mt-2 text-3xl font-bold md:text-4xl">Начать с размеров и фото</h2><p className="mt-4 leading-7 text-emerald-50/75">Оставьте контакты. Специалист уточнит помещение, технику и удобный порядок замера — без обещания точной цены до исходных данных.</p></div><div className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="location-borisov-stage-4" sourcePage="/locations/borisov" sourceType="location-region" city="Борисов" cityKey="borisov" submitLabel="Записаться на замер" /></div></div>
          </section>
        </div>
      </main>
    </>
  );
}
