import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, BadgeCheck, CircleDollarSign, Layers3, MapPin, Sparkles } from "lucide-react";
import { AngularKitchenShowroom } from "./AngularKitchenShowroom";

const MEDIA_BASE = "/media/pilots/angular-kitchens";

type Props = {
  priceFrom: number;
  jsonLd: JsonLdObject[];
};

export function AngularKitchenPage({ priceFrom, jsonLd }: Props) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="overflow-x-clip bg-[#f7f5f0] text-stone-950 pb-28 md:pb-16">
        <section className="relative min-h-[min(820px,calc(100svh-72px))] overflow-hidden bg-stone-950 text-white">
          <picture className="absolute inset-0">
            <source type="image/avif" srcSet={`${MEDIA_BASE}/avif/angular-kitchens-hero-corner-wide-portrait.avif`} />
            <img src={`${MEDIA_BASE}/webp/angular-kitchens-hero-corner-wide-portrait.webp`} alt="Светлая угловая кухня с серо-бежевыми фасадами и дубовыми деталями" width="900" height="1200" fetchPriority="high" className="h-full w-full object-cover object-center md:object-[center_62%]" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/20 to-stone-950/95 md:bg-gradient-to-r md:from-stone-950/90 md:via-stone-950/45 md:to-transparent" />
          <div className="container-site relative flex min-h-[min(820px,calc(100svh-72px))] flex-col justify-end py-10 md:justify-center md:py-20">
            <nav className="mb-auto flex items-center gap-2 pt-4 text-sm text-white/80 md:mb-8 md:pt-0" aria-label="Хлебные крошки">
              <Link href="/" className="min-h-11 content-center hover:text-white">Главная</Link><span aria-hidden>/</span><Link href="/catalog" className="min-h-11 content-center hover:text-white">Каталог</Link><span aria-hidden>/</span><span>Угловые кухни</span>
            </nav>
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur"><Sparkles className="h-4 w-4 text-amber-300" aria-hidden />Цифровой шоурум</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl md:text-7xl">Угловая кухня на заказ под ваши размеры</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85 md:text-lg">Проверьте планировку, загляните внутрь угла и сравните механизмы до расчёта проекта.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#planning" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-bold text-stone-950 hover:bg-amber-200"><span className="md:hidden">Планировка</span><span className="hidden md:inline">Посмотреть планировку</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="#calculate" className="inline-flex min-h-12 items-center rounded-full border border-white/35 bg-black/20 px-5 py-3 font-bold text-white backdrop-blur hover:bg-white/10">Рассчитать кухню</Link>
              </div>
              <p className="mt-4 text-xs text-white/70">AI-концепт для выбора решения, не фотография выполненного проекта.</p>
            </div>
          </div>
        </section>

        <div className="container-site py-14 md:py-20">
          <section className="mb-16 grid gap-4 sm:grid-cols-3 md:mb-24" aria-label="Коротко об угловой кухне">
            {[{icon:BadgeCheck,title:"Под помещение",text:"Учитываем стены, коммуникации, технику и проходы после замера."},{icon:CircleDollarSign,title:`Ориентир от ${priceFrom.toLocaleString("ru")} BYN`,text:"Точная сумма зависит от размеров, фасадов, столешницы и механизмов."},{icon:Layers3,title:"Три способа использовать угол",text:"Рабочая поверхность, мойка или хранение — выбор зависит от помещения."}].map((item) => { const Icon=item.icon; return <article key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5"><Icon className="h-6 w-6 text-amber-700" aria-hidden /><h2 className="mt-3 font-bold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p></article>; })}
          </section>

          <AngularKitchenShowroom />

          <section id="catalog-prices" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="price-title">
            <div className="rounded-[2rem] bg-amber-200 p-6 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-900">Цена</p>
              <h2 id="price-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Что влияет на стоимость угловой кухни</h2>
              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[{title:"Длина двух плеч",text:"Больше корпусов, фасадов и столешницы — выше общий объём проекта."},{title:"Механизм угла",text:"Полка, карусель и выдвижная система различаются по устройству и стоимости."},{title:"Фасады и столешница",text:"Материал, покрытие и обработка влияют на смету сильнее декоративных мелочей."},{title:"Ящики и внутренняя организация",text:"Количество направляющих, корзин и разделителей считают по выбранной комплектации."}].map((item)=><article key={item.title} className="rounded-2xl bg-white/80 p-5"><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{item.text}</p></article>)}
              </div>
              <p className="mt-6 text-sm font-medium text-amber-950">Ориентир начинается от {priceFrom.toLocaleString("ru")} BYN. Точную цену фиксируем после размеров и согласования комплектации.</p>
            </div>
          </section>

          <section className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 md:p-8">
              <h2 className="text-2xl font-bold">Подходящие материалы</h2>
              <p className="mt-3 leading-7 text-stone-600">Для угла важны не только цвет и стиль: возле мойки нужна аккуратная защита кромок, а механизм должен соответствовать сценарию хранения.</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/materials/mdf-fasady" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Фасады МДФ <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="/materials/plastik-hpl" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Пластик HPL <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="/materials/furnitura" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Фурнитура и механизмы <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 md:p-8">
              <h2 className="text-2xl font-bold">Проекты и полезные материалы</h2>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/portfolio/uglovaya-kuhnya-sovremennaya-001" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Современная угловая кухня <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="/blog/uglovaya-kuhnya-razmery-planirovka" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Размеры и планировка <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                <Link href="/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat" className="flex min-h-12 items-center justify-between rounded-xl border border-stone-200 px-4 font-semibold hover:border-stone-500">Угловая или прямая <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-[2rem] border border-stone-200 bg-white p-6 md:mt-24 md:p-8" aria-labelledby="service-title">
            <MapPin className="h-7 w-7 text-amber-700" aria-hidden />
            <h2 id="service-title" className="mt-3 text-3xl font-bold">Изготавливаем в Борисове, принимаем заказы по Беларуси</h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-600">Работаем в Минске, Борисове, Минской области и других городах, перечисленных на сайте. Для дальних регионов минимальная стоимость заказа — от 1000 белорусских рублей.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/locations/minsk" className="rounded-full border border-stone-300 px-4 py-2 font-semibold hover:border-stone-700">Минск</Link>
              <Link href="/locations/borisov" className="rounded-full border border-stone-300 px-4 py-2 font-semibold hover:border-stone-700">Борисов</Link>
              <Link href="/locations/minskaya-oblast" className="rounded-full border border-stone-300 px-4 py-2 font-semibold hover:border-stone-700">Минская область</Link>
              <Link href="/locations" className="rounded-full bg-stone-950 px-4 py-2 font-semibold text-white">Все города</Link>
            </div>
          </section>

          <section id="calculate" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="calculate-title">
            <div className="grid overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid-cols-[.85fr_1.15fr]">
              <div className="p-6 md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Следующий шаг</p>
                <h2 id="calculate-title" className="mt-2 text-3xl font-bold md:text-4xl">Рассчитать угловую кухню</h2>
                <p className="mt-4 leading-7 text-stone-300">Пришлите размеры или оставьте заявку на уточнение замера. Специалист поможет выбрать вариант угла и подготовит расчёт под комплектацию.</p>
                <Link href="/design-proekt-kuhni" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-5 py-3 font-bold hover:bg-white/10">Собрать дизайн-проект <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </div>
              <div id="form" className="bg-white p-5 text-stone-950 md:p-8"><ContactForm source="catalog/uglovye-kuhni-stage-3" /></div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
