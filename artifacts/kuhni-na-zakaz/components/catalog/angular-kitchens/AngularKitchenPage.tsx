import Link from "@/components/navigation/Link";
import { ExploreContextProvider } from "@/components/exploration";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, type JsonLdObject } from "@/lib/schema-org";
import { AngularStage5Interactive } from "./AngularStage5Interactive";

export const angularFaq = [
  { question: "Как заказать угловую кухню по своим размерам?", answer: "Оставьте имя и телефон для расчёта. Обсудим длину двух стен, технику, фасады и хранение. На замере проверим геометрию помещения и коммуникации, затем согласуем проект, комплектацию и договор." },
  { question: "Сколько стоит угловая кухня на заказ?", answer: "Стоимость зависит от длины обеих стен, фасадов, столешницы, количества ящиков и механизма угла. Доставку, монтаж и состав работ согласовываем отдельно. Итоговая цена фиксируется после согласования проекта и комплектации." },
  { question: "Подойдёт ли Г-образная кухня для маленького помещения?", answer: "Да, если две линии шкафов оставляют удобный проход и место для открывания дверей и техники. Для компактной кухни можно сократить второе плечо, оставить рабочую поверхность в углу и обойтись без высоких шкафов у окна." },
  { question: "Можно ли разместить мойку в углу?", answer: "Можно, но сначала проверяем расположение труб, доступ к сифону и удобство подхода. Мойка на прямом участке часто оставляет больше непрерывной рабочей поверхности. Оба варианта есть в интерактивном выборе на странице." },
  { question: "Какой механизм выбрать для углового шкафа?", answer: "Глубокая полка подходит для редко используемой посуды. Карусель поворачивает полки к проёму. Выдвижная система выводит корзины наружу. Выбор зависит от размеров шкафа, частоты использования и бюджета." },
  { question: "Какие сроки изготовления и гарантия?", answer: "Срок изготовления согласовываем в договоре после выбора материалов и комплектации. Гарантия: 2 года на корпус и фасады, 5 лет на фурнитуру Blum и 1 год на монтажные работы. Условия и исключения опубликованы в разделе гарантии." },
];

const examples = [
  ["compact", "Компактная бежевая кухня", "Короткое второе плечо, отдельный холодильник и рабочая поверхность в углу."],
  ["white", "Белая кухня без ручек", "Две линии шкафов, встроенная техника и столешница под дерево."],
  ["green", "Зелёная кухня до потолка", "Мойка у окна, высокие верхние шкафы и духовка в пенале."],
];
const defaultAnswers = { sourcePage: "/catalog/uglovye-kuhni", kitchenType: "angular", selectedCornerType: "worktop", selectedMechanism: "shelf", selectedMaterial: "warm-white", wallOneLength: 240, wallTwoLength: 180, windowPosition: "нет рядом", doorPosition: "нет рядом", communicationsPosition: "уточнить на замере", pageUrl: "/catalog/uglovye-kuhni" };
const cta = "inline-flex min-h-12 items-center justify-center rounded-full bg-stone-950 px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700";

export function AngularKitchenPage({ jsonLd }: { jsonLd: JsonLdObject[] }) {
  return <>
    <main id="angular-content" className="overflow-x-clip bg-[#f7f5f0] pb-24 text-stone-950">
      <div className="container-site">
        <nav aria-label="Хлебные крошки" className="flex min-h-11 flex-wrap items-center gap-2 text-xs text-stone-600 md:text-sm">
          <Link className="inline-flex min-h-11 items-center" href="/">Главная</Link><span aria-hidden="true">/</span>
          <Link className="inline-flex min-h-11 items-center" href="/catalog">Каталог</Link><span aria-hidden="true">/</span><span>Угловые кухни</span>
        </nav>
        <section className="grid gap-5 pb-8 pt-2 md:grid-cols-2 md:items-center md:gap-10 md:py-10" aria-labelledby="angular-title">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">По вашим размерам • своё производство</p>
            <h1 id="angular-title" className="mt-2 text-3xl font-black leading-tight tracking-tight md:text-5xl">Угловые кухни на заказ</h1>
            <p className="mt-3 max-w-xl text-base leading-6 text-stone-700 md:text-lg md:leading-7">Изготовим Г-образную кухню под две стены, вашу технику и привычки. Подберём фасады, столешницу и удобное хранение в углу.</p>
            <a href="#calculate" className={`mt-4 w-full sm:w-auto ${cta}`}>Рассчитать угловую кухню</a>
            <p className="mt-2 text-sm text-stone-600">Достаточно имени и телефона. Размеры уточним вместе.</p>
            <p className="mt-4 text-sm text-stone-700">Производство в Борисове. Комплектация, цена и срок — в договоре.</p>
          </div>
          <figure className="overflow-hidden rounded-2xl bg-stone-200">
            <picture>
              <source srcSet="/media/pilots/angular-kitchens/avif/angular-kitchens-hero-corner-wide-portrait.avif" type="image/avif" />
              <img src="/media/pilots/angular-kitchens/webp/angular-kitchens-hero-corner-wide-portrait.webp" alt="Светлая угловая кухня с дубовыми деталями и рабочей поверхностью вдоль двух стен" width="900" height="1200" fetchPriority="high" className="h-48 w-full object-cover object-[50%_55%] sm:h-72 md:h-[440px]" />
            </picture>
            <figcaption className="px-3 py-2 text-xs text-stone-600">Вариант дизайна, созданный нейросетью.</figcaption>
          </figure>
        </section>
      </div>
      <ExploreContextProvider sourceRoute="/catalog/uglovye-kuhni">
        <div className="container-site space-y-12 md:space-y-20">
          <section aria-labelledby="examples-title">
            <h2 id="examples-title" className="text-2xl font-black md:text-3xl">Варианты угловых кухонь</h2>
            <p className="mt-2 max-w-3xl text-stone-600">Выберите идею для своей комнаты. Планировку и размеры адаптируем под помещение; изображения созданы нейросетью.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {examples.map(([id, title, copy]) => <article key={id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <img src={`/uploads/angular-commercial-20261008/${id}.webp`} srcSet={`/uploads/angular-commercial-20261008/${id}-600.webp 600w, /uploads/angular-commercial-20261008/${id}.webp 1200w`} sizes="(min-width: 768px) 33vw, 100vw" width="1200" height="800" alt={title} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
                <div className="p-4"><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p></div>
              </article>)}
            </div>
          </section>
          <section id="catalog-prices" aria-labelledby="price-title" className="scroll-mt-24 rounded-2xl bg-amber-100 p-5 md:p-8">
            <h2 id="price-title" className="text-2xl font-black md:text-3xl">Цена угловой кухни: сравните комплектации</h2>
            <p className="mt-3 max-w-3xl leading-7">Одинаковая планировка может стоить по-разному. Сравнивайте состав кухни: фасады, столешницу, ящики и угловой механизм. По размерам подготовим предварительный расчёт; итоговую стоимость закрепим в договоре.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[["Базовая", "Простые фасады, столешница из ламината и глубокая полка в углу. Для тех, кому важна доступная стоимость."], ["Больше удобства", "Выдвижные ящики и карусель вместо глубокой полки. Добавляем доступ к посуде без изменения общей планировки."], ["Максимум хранения", "Шкафы до потолка, выдвижной угловой механизм и выбранные фасады. Состав и бюджет согласуем отдельно."]].map(([title, copy]) => <article key={title} className="rounded-xl bg-white p-4"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{copy}</p></article>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-700">Доставка, подъём, монтаж, вырезы под мойку и технику обсуждаются в смете. <Link href="/prices" className="underline underline-offset-4">Подробнее о расчёте стоимости</Link>.</p>
            <div className="mt-5 grid gap-3 border-t border-amber-950/15 pt-5 sm:grid-cols-3">
              <p className="text-sm leading-6"><strong className="block">Своё производство</strong>Борисов — изготовление под размеры комнаты.</p>
              <p className="text-sm leading-6"><strong className="block">Гарантия по договору</strong>2 года на корпус и фасады. <Link href="/warranty" className="underline">Все условия</Link>.</p>
              <p className="text-sm leading-6"><strong className="block">Срок согласуем заранее</strong>Он зависит от материалов и комплектации. <Link href="/delivery-installation" className="underline">Доставка и монтаж</Link>.</p>
            </div>
          </section>
          <section id="calculate" aria-labelledby="calculate-title" className="scroll-mt-24 overflow-hidden rounded-2xl bg-stone-950 lg:grid lg:grid-cols-2">
            <div className="p-5 text-white md:p-8">
              <h2 id="calculate-title" className="text-2xl font-black md:text-3xl">Рассчитать угловую кухню</h2>
              <p className="mt-3 leading-7 text-stone-300">Оставьте контакты — обсудим размеры двух стен, расположение техники и желаемый бюджет. Если замеров ещё нет, поможем определить следующий шаг.</p>
              <p className="mt-4 text-sm leading-6 text-stone-300">Параметры из блока выбора ниже сохраняются в заявке. Вы сможете обсудить их с дизайнером.</p>
            </div>
            <div id="form" className="bg-white p-5 md:p-8">
              <ContactForm source="catalog/uglovye-kuhni-stage-5" sourcePage="/catalog/uglovye-kuhni" sourceType="catalog-angular-interactive" formType="angular-calculation" formLocation="angular-final" submitLabel="Рассчитать угловую кухню" defaultKitchenType="Угловая" compact showKitchenType={false} cityLabel="Город или район (необязательно)" answersEventName="angular-kitchen-answers" defaultAnswers={defaultAnswers} />
            </div>
          </section>
          <section aria-label="Выбор планировки, материалов и хранения"><AngularStage5Interactive /></section>
          <section aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-2xl font-black md:text-3xl">Вопросы перед заказом</h2>
            <div className="mt-5 divide-y divide-stone-200 border-y border-stone-200">{angularFaq.map(({question, answer}) => <details key={question} className="py-4"><summary className="cursor-pointer text-base font-bold leading-6">{question}</summary><p className="mt-3 max-w-3xl leading-7 text-stone-700">{answer}</p></details>)}</div>
          </section>
          <section aria-labelledby="next-title">
            <h2 id="next-title" className="text-2xl font-black">Что ещё поможет выбрать кухню</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["/catalog/malenkie-kuhni", "Кухни для маленькой комнаты"], ["/materials/mdf-fasady", "Фасады из МДФ"], ["/materials/furnitura", "Фурнитура и механизмы"], ["/design-proekt-kuhni", "Дизайн-проект кухни"], ["/portfolio", "Портфолио кухонь"], ["/reviews", "Отзывы клиентов"]].map(([href, label]) => <Link key={href} href={href} className="flex min-h-12 items-center rounded-xl border border-stone-300 bg-white px-4 py-3 font-bold hover:border-amber-700">{label}</Link>)}</div>
            <p className="mt-6 leading-7 text-stone-600">Условия заказа по вашему адресу: <Link href="/locations/borisov" className="underline">Борисов</Link>, <Link href="/locations/minsk" className="underline">Минск</Link>, <Link href="/locations/minskaya-oblast" className="underline">Минская область</Link> и <Link href="/locations" className="underline">другие города</Link>.</p>
            <p className="mt-4 leading-7 text-stone-600">Перед замером: <Link href="/blog/uglovaya-kuhnya-razmery-planirovka" className="underline">размеры и планировка угловой кухни</Link>.</p>
            <a href="#calculate" className={`mt-5 ${cta}`}>Рассчитать угловую кухню</a>
          </section>
        </div>
      </ExploreContextProvider>
    </main>
    <JsonLd data={jsonLd} />
  </>;
}
