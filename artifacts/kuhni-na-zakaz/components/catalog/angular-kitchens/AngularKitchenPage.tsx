import Link from "@/components/navigation/Link";
import { MobileHero, type PilotMedia } from "@/components/pilots/library";
import { ContextSummary, ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { ArrowRight, CircleDollarSign, MapPin } from "lucide-react";
import { AngularStage5Interactive } from "./AngularStage5Interactive";

type Props = { priceFrom: number; jsonLd: JsonLdObject[] };

const hero: PilotMedia = {
  id: "PILOT-AK-01-001",
  avif: "/media/pilots/angular-kitchens/avif/angular-kitchens-hero-corner-wide-portrait.avif",
  webp: "/media/pilots/angular-kitchens/webp/angular-kitchens-hero-corner-wide-portrait.webp",
  alt: "Светлая угловая кухня с серо-бежевыми фасадами и дубовыми деталями",
  caption: "AI-концепт угловой кухни.",
  width: 900,
  height: 1200,
};

const defaultAnswers = {
  sourcePage: "/catalog/uglovye-kuhni",
  kitchenType: "angular",
  selectedCornerType: "worktop",
  selectedMechanism: "shelf",
  selectedMaterial: "warm-white",
  wallOneLength: 240,
  wallTwoLength: 180,
  windowPosition: "нет рядом",
  doorPosition: "нет рядом",
  communicationsPosition: "уточнить на замере",
  pageUrl: "/catalog/uglovye-kuhni",
};

export function AngularKitchenPage({ priceFrom, jsonLd }: Props) {
  return (
    <ExploreContextProvider sourceRoute="/catalog/uglovye-kuhni">
      <JsonLd data={jsonLd} />
      <main className="overflow-x-clip bg-[#f7f5f0] pb-28 text-stone-950 md:pb-16">
        <div className="container-site pt-4 md:pt-8">
          <nav className="mb-4 flex min-h-11 items-center gap-2 text-sm text-stone-600" aria-label="Хлебные крошки">
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-stone-950">Главная</Link><span aria-hidden="true">/</span><Link href="/catalog" className="inline-flex min-h-11 items-center hover:text-stone-950">Каталог</Link><span aria-hidden="true">/</span><span>Угловые кухни</span>
          </nav>
          <MobileHero
            variant="spatial"
            eyebrow="Интерактивный выбор планировки"
            title="Угловые кухни на заказ"
            description="Посмотрите планировку, хранение и варианты использования угла."
            media={hero}
            disclosure="AI-концепт для выбора решения, не фотография выполненного проекта."
            actions={<><a href="#calculate" className="inline-flex min-h-12 items-center rounded-full bg-stone-950 px-5 py-3 font-black text-white">Рассчитать угловую кухню</a><a href="#inside" className="inline-flex min-h-12 items-center rounded-full border border-stone-400 px-5 py-3 font-black">Посмотреть внутри</a></>}
          />
        </div>

        <div className="container-site py-14 md:py-20">
          <AngularStage5Interactive />

          <section className="mt-10" aria-labelledby="exploration-context-title">
            <h2 id="exploration-context-title" className="sr-only">Сохранённый контекст выбора</h2>
            <ContextSummary />
          </section>

          <section className="mt-10" aria-labelledby="related-exploration-title">
            <h2 id="related-exploration-title" className="sr-only">Связанные шаги выбора</h2>
            <RelatedExplorationRail route="/catalog/uglovye-kuhni" />
          </section>

          <section id="catalog-prices" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="price-title">
            <div className="rounded-[2rem] bg-amber-200 p-5 sm:p-6 md:p-10">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-950">Цена</p>
              <h2 id="price-title" className="mt-2 text-3xl font-black tracking-tight md:text-4xl">От чего зависит стоимость угловой кухни</h2>
              <p className="mt-3 max-w-3xl leading-7 text-amber-950">Не рассчитываем итоговую сумму по одной картинке. Сначала нужны размеры, выбранные материалы и состав работ.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Размер", "Длина двух стен определяет количество корпусов, фасадов и столешницы."],
                  ["Фасады", "Материал, покрытие и сложность обработки меняют комплектацию."],
                  ["Столешница", "На смету влияют материал, стыки, вырезы и обработка кромок."],
                  ["Механизм угла", "Полка, карусель и выдвижная система устроены по-разному."],
                  ["Фурнитура", "Количество ящиков, направляющих, корзин и подъёмников считают отдельно."],
                  ["Встроенная техника", "Нужны размеры и способ установки каждой позиции."],
                  ["Доставка", "Зависит от адреса, объёма, подъезда и условий разгрузки."],
                  ["Монтаж", "Учитывает сборку, подгонку, вырезы и согласованный состав работ."],
                ].map(([title, text]) => <article key={title} className="rounded-2xl bg-white/85 p-4"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{text}</p></article>)}
              </div>
              <p className="mt-6 font-bold text-amber-950">Актуальный ориентир на сайте — от {priceFrom.toLocaleString("ru")} BYN; точную сумму фиксируют после согласования проекта.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Link href="/prices" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-amber-950/30 px-5 py-3 font-black">Перейти к ценам <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><a href="#calculate" className="inline-flex min-h-12 items-center rounded-full bg-stone-950 px-5 py-3 font-black text-white">Получить предварительный расчёт</a></div>
            </div>
          </section>

          <section className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2" aria-labelledby="projects-title">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 md:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-800">Реальные работы</p>
              <h2 id="projects-title" className="mt-2 text-2xl font-black">Реализованные угловые кухни</h2>
              <p className="mt-3 leading-7 text-stone-600">Отдельно показываем страницу подтверждённого проекта, не смешивая её с AI-концептами этой страницы.</p>
              <Link href="/portfolio/uglovaya-kuhnya-sovremennaya-001" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-stone-300 px-5 py-3 font-black">Открыть реализованный проект <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-white md:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-300">Варианты для обсуждения</p>
              <h2 className="mt-2 text-2xl font-black">Концепты возможных решений</h2>
              <p className="mt-3 leading-7 text-stone-300">Все иллюстрации интерактивного блока сгенерированы как концепты и не выдаются за выполненные кухни.</p>
              <Link href="/design-proekt-kuhni" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-black text-stone-950">Собрать свой дизайн-проект <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </section>

          <section className="mt-16 rounded-[2rem] border border-stone-200 bg-white p-6 md:mt-24 md:p-8" aria-labelledby="service-title">
            <MapPin className="h-7 w-7 text-amber-800" aria-hidden="true" />
            <h2 id="service-title" className="mt-3 text-3xl font-black">Зона обслуживания</h2>
            <p className="mt-3 max-w-3xl leading-7 text-stone-600">Производство находится в Борисове. Работаем по Минску, Минской области и другим указанным на сайте городам. Для дальних регионов минимальная стоимость заказа — от 1000 BYN.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/locations/borisov" className="min-h-11 content-center rounded-full border border-stone-300 px-4 font-bold">Борисов</Link><Link href="/locations/minsk" className="min-h-11 content-center rounded-full border border-stone-300 px-4 font-bold">Минск</Link><Link href="/locations/minskaya-oblast" className="min-h-11 content-center rounded-full border border-stone-300 px-4 font-bold">Минская область</Link><Link href="/locations" className="min-h-11 content-center rounded-full bg-stone-950 px-4 font-bold text-white">Все локации</Link></div>
          </section>

          <section id="calculate" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="calculate-title">
            <div className="grid overflow-hidden rounded-[2rem] bg-stone-950 text-white lg:grid-cols-[.8fr_1.2fr]">
              <div className="p-6 md:p-10">
                <CircleDollarSign className="h-7 w-7 text-amber-300" aria-hidden="true" />
                <h2 id="calculate-title" className="mt-3 text-3xl font-black md:text-4xl">Рассчитать угловую кухню</h2>
                <p className="mt-4 leading-7 text-stone-300">Выбранные тип угла, механизм, материал, размеры и положение проёмов передаются в заявку отдельными структурированными полями. Их можно уточнить перед отправкой.</p>
              </div>
              <div id="form" className="bg-white p-5 text-stone-950 md:p-8">
                <ContactForm source="catalog/uglovye-kuhni-stage-5" sourcePage="/catalog/uglovye-kuhni" sourceType="catalog-angular-interactive" formType="angular-calculation" formLocation="angular-final" submitLabel="Рассчитать угловую кухню" defaultKitchenType="Угловая" showHasMeasurements showRoomFile answersEventName="angular-kitchen-answers" defaultAnswers={defaultAnswers} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </ExploreContextProvider>
  );
}
