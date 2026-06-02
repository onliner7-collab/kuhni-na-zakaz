import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  DoorOpen,
  Hand,
  LampDesk,
  Layers3,
  PackageCheck,
  PanelTopOpen,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TableProperties,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";

const pageTitle = "Фурнитура для кухни на заказ";
const pageDescription =
  "Разбираем фурнитуру для кухни на заказ: петли, направляющие, доводчики, подъемные механизмы, ручки и системы хранения. Поможем подобрать решение под проект кухни в Минске и Беларуси.";

export const metadata: Metadata = {
  title: "Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики",
  description: pageDescription,
  alternates: { canonical: "/materials/furnitura" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Фурнитура для кухни на заказ",
    description: pageDescription,
    url: "/materials/furnitura",
    type: "article",
  },
};

const importanceItems = [
  {
    icon: ShieldCheck,
    title: "Срок службы",
    text: "Петли, направляющие и доводчики принимают ежедневную нагрузку, поэтому слабая фурнитура быстрее выдает проблемы, чем фасады или столешница.",
  },
  {
    icon: SlidersHorizontal,
    title: "Удобство",
    text: "Полное выдвижение, мягкое закрывание, подъемники и органайзеры меняют сценарий пользования кухней каждый день.",
  },
  {
    icon: CircleDollarSign,
    title: "Бюджет",
    text: "Одна и та же планировка может заметно отличаться по цене из-за уровня направляющих, подъемных механизмов, профилей и систем хранения.",
  },
];

const hardwareCategories = [
  {
    icon: DoorOpen,
    title: "Петли для кухонных фасадов",
    text: "Накладные, полунакладные, вкладные, угловые и специальные петли подбирают под тип корпуса, фасада и угол открывания.",
  },
  {
    icon: SlidersHorizontal,
    title: "Направляющие для ящиков кухни",
    text: "Роликовые, шариковые, скрытые и системы полного выдвижения влияют на плавность хода, нагрузку и доступ к дальним зонам.",
  },
  {
    icon: PanelTopOpen,
    title: "Подъемные механизмы для верхних шкафов",
    text: "Откидные, складные и вертикальные механизмы удобны там, где распашные фасады мешают проходу или рабочей зоне.",
  },
  {
    icon: Hand,
    title: "Ручки, профили и кухни без ручек",
    text: "Классические ручки, профиль Gola, интегрированные ручки и push-to-open подбирают по стилю, уходу и привычкам семьи.",
  },
  {
    icon: Boxes,
    title: "Системы хранения для кухни",
    text: "Карго, бутылочницы, органайзеры, лотки, выкатные корзины и разделители помогают использовать каждый модуль без хаоса.",
  },
  {
    icon: BadgeCheck,
    title: "Доводчики и мягкое закрывание",
    text: "Доводчики снижают ударную нагрузку на фасады и корпуса, особенно в ящиках, сушках и часто используемых шкафах.",
  },
  {
    icon: Settings2,
    title: "Угловые системы",
    text: "Карусели, выдвижные полки и угловые механизмы делают глубокие углы доступнее в Г-образных и П-образных кухнях.",
  },
  {
    icon: Layers3,
    title: "Цокольная и монтажная фурнитура",
    text: "Ножки, цоколи, крепеж, навесы, заглушки и демпферы не всегда видны, но отвечают за ровную установку и аккуратный вид.",
  },
  {
    icon: TableProperties,
    title: "Фурнитура для столешниц и панелей",
    text: "Соединители, планки, пристеночные бортики и защитные элементы подбирают под материал столешницы и влажные зоны.",
  },
  {
    icon: PackageCheck,
    title: "Фурнитура для встроенной техники",
    text: "Крепления, петли, фасадные системы и вентиляционные решения важны для посудомоечной машины, холодильника, духовки и СВЧ.",
  },
  {
    icon: LampDesk,
    title: "Подсветка и электрофурнитура",
    text: "LED-профили, выключатели, розеточные блоки и кабель-каналы лучше планировать до производства корпусов.",
  },
  {
    icon: Wrench,
    title: "Уплотнители, демпферы и заглушки",
    text: "Небольшие детали защищают торцы, убирают шум, закрывают технологические отверстия и помогают кухне выглядеть завершенной.",
  },
];

const comparisonRows = [
  {
    task: "Нижние ящики",
    hardware: "Скрытые направляющие, боковины, доводчики",
    why: "Дают полный доступ к хранению, выдерживают посуду и продукты, закрываются мягко.",
  },
  {
    task: "Верхние шкафы",
    hardware: "Петли с доводчиком или подъемные механизмы",
    why: "Помогают безопасно открывать фасады на уровне головы и выше.",
  },
  {
    task: "Кухня без ручек",
    hardware: "Профиль Gola, интегрированные ручки или push-to-open",
    why: "Сохраняют чистую линию фасадов, но требуют точной настройки и продуманной эргономики.",
  },
  {
    task: "Угловая кухня",
    hardware: "Карусель, выдвижная угловая система, петли 165 градусов",
    why: "Делают глубокий угол доступным и уменьшают мертвые зоны хранения.",
  },
  {
    task: "Небольшая кухня",
    hardware: "Карго, бутылочница, органайзеры, узкие выкатные секции",
    why: "Позволяют использовать узкие модули и сохранять порядок без лишних шкафов.",
  },
];

const budgetLevels = [
  {
    title: "Эконом",
    text: "Базовые петли, простые направляющие и минимум специальных механизмов. Подходит для аккуратной кухни с понятным бюджетом.",
  },
  {
    title: "Средний уровень",
    text: "Петли и направляющие с доводчиками, несколько органайзеров, надежные ручки или простой профиль.",
  },
  {
    title: "Выше среднего",
    text: "Скрытые направляющие полного выдвижения, подъемники для верхних шкафов, продуманное хранение и качественные демпферы.",
  },
  {
    title: "Премиум",
    text: "Сложные подъемные системы, профильные решения, электрофурнитура, угловые механизмы и индивидуальная комплектация под сценарии семьи.",
  },
];

const faqItems = [
  {
    question: "Какая фурнитура лучше для кухни на заказ?",
    answer:
      "Лучший вариант зависит от планировки, веса фасадов, количества ящиков и бюджета. Обычно стоит начинать с надежных петель, направляющих полного или частичного выдвижения и доводчиков на часто используемых модулях.",
  },
  {
    question: "Стоит ли выбирать петли с доводчиком?",
    answer:
      "Да, если кухня используется каждый день. Петли с доводчиком уменьшают хлопки фасадов, берегут корпус и делают закрывание спокойнее. Экономить на них стоит только в редко используемых шкафах.",
  },
  {
    question: "Какие направляющие лучше для кухонных ящиков?",
    answer:
      "Для основных ящиков удобны скрытые направляющие или системы полного выдвижения с доводчиком. Для легких и редко используемых секций можно рассмотреть более простые решения.",
  },
  {
    question: "Что лучше: ручки или кухня без ручек?",
    answer:
      "Ручки практичны, понятны и дешевле в реализации. Кухня без ручек выглядит более лаконично, но требует точной геометрии фасадов, правильных профилей или качественного push-to-open.",
  },
  {
    question: "Нужны ли подъемные механизмы для верхних шкафов?",
    answer:
      "Они полезны для широких фасадов, шкафов над рабочей зоной и кухонь, где распашные дверцы мешают. Для узких верхних модулей иногда достаточно обычных петель с доводчиком.",
  },
  {
    question: "Можно ли сэкономить на кухонной фурнитуре?",
    answer:
      "Можно, но точечно. Лучше не удешевлять петли, направляющие нагруженных ящиков и крепеж. Экономию безопаснее искать в количестве специальных систем, типе ручек и уровне внутренних органайзеров.",
  },
  {
    question: "От чего зависит цена фурнитуры для кухни?",
    answer:
      "На цену влияют бренд, нагрузка, тип выдвижения, наличие доводчика, сложность подъемных или угловых механизмов, количество ящиков, профильные решения и электрофурнитура.",
  },
  {
    question: "Какая фурнитура подходит для маленькой кухни?",
    answer:
      "В маленькой кухне особенно полезны направляющие полного выдвижения, узкие карго, разделители ящиков, бутылочницы и решения для углов. Они помогают не увеличивать габариты кухни, но добавить удобное хранение.",
  },
];

const internalLinks = [
  { href: "/materials", label: "Все материалы" },
  { href: "/materials/mdf-fasady", label: "МДФ фасады" },
  { href: "/materials/ldsp", label: "ЛДСП" },
  { href: "/materials/plastik-hpl", label: "Пластик HPL" },
  { href: "/prices", label: "Цены на кухни" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
];

export default function FurnituraMaterialsPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Материалы", path: "/materials" },
    { name: "Фурнитура", path: "/materials/furnitura" },
  ]);
  const jsonLdFaq = faqJsonLd(faqItems);
  const jsonLdWebPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: siteUrl("/materials/furnitura"),
    isPartOf: { "@type": "WebSite", name: "КухниBY", url: siteUrl() },
    about: "Кухонная фурнитура для кухонь на заказ",
  });

  return (
    <>
      <JsonLd data={jsonLdFaq ? [jsonLdBreadcrumb, jsonLdWebPage, jsonLdFaq] : [jsonLdBreadcrumb, jsonLdWebPage]} />
      <div className="section-padding">
        <main className="container-site">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link href="/materials" className="hover:text-primary">Материалы</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground">Фурнитура</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-primary">Комплектация кухни</p>
              <h1 className="mb-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Фурнитура для кухни на заказ
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Петли, направляющие, доводчики, подъемные механизмы, ручки и системы хранения влияют на то,
                насколько удобно пользоваться кухней через год, пять и десять лет. Разбираем, что стоит заложить
                в проект сразу, а где можно выбрать более спокойное решение без потери надежности.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#calculation"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Рассчитать кухню <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#faq"
                  className="inline-flex min-h-11 items-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Получить консультацию по фурнитуре
                </Link>
              </div>
            </div>
            <aside className="rounded-2xl border border-border bg-white p-6 shadow-sm" aria-labelledby="hardware-summary">
              <Sparkles className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
              <h2 id="hardware-summary" className="font-serif text-2xl font-bold">Что обсуждаем на замере</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>Какие ящики будут самыми тяжелыми и частыми в использовании.</li>
                <li>Где нужны доводчики, полное выдвижение и подъемные механизмы.</li>
                <li>Подходит ли кухня без ручек под планировку и привычки семьи.</li>
                <li>Какие системы хранения действительно окупятся в вашем проекте.</li>
              </ul>
            </aside>
          </section>

          <section className="mt-16 grid gap-5 md:grid-cols-3" aria-labelledby="importance-heading">
            <div className="md:col-span-3">
              <h2 id="importance-heading" className="font-serif text-3xl font-bold">Почему фурнитура важна при заказе кухни</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                Фасады и столешница задают внешний вид, но именно кухонная фурнитура отвечает за движение, доступ,
                шум, нагрузку и ежедневную эргономику.
              </p>
            </div>
            {importanceItems.map((item) => (
              <article key={item.title} className="card-base p-6">
                <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </section>

          <section className="mt-16" aria-labelledby="categories-heading">
            <div className="mb-6 max-w-3xl">
              <h2 id="categories-heading" className="font-serif text-3xl font-bold">Виды фурнитуры для кухни</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                При проектировании кухни на заказ мы смотрим не на отдельную деталь, а на связку: корпус, фасад,
                вес, сценарий открывания, влажные зоны и бюджет.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hardwareCategories.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border bg-white p-5">
                  <item.icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="comparison-heading">
            <div className="mb-6 flex items-center gap-3">
              <TableProperties className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 id="comparison-heading" className="font-serif text-3xl font-bold">Какая фурнитура нужна для кухни</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Задача</th>
                    <th className="p-4 font-semibold">Что обычно используют</th>
                    <th className="p-4 font-semibold">Зачем это нужно</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.task} className="border-t border-border">
                      <th scope="row" className="p-4 font-semibold text-foreground">{row.task}</th>
                      <td className="p-4 text-muted-foreground">{row.hardware}</td>
                      <td className="p-4 text-muted-foreground">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16" aria-labelledby="budget-heading">
            <div className="mb-6 flex items-center gap-3">
              <CircleDollarSign className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 id="budget-heading" className="font-serif text-3xl font-bold">Как выбрать фурнитуру по бюджету</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {budgetLevels.map((item) => (
                <article key={item.title} className="card-base p-6">
                  <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="links-heading">
            <h2 id="links-heading" className="font-serif text-3xl font-bold">Куда перейти дальше</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {internalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section id="faq" className="mt-16 scroll-mt-24" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-serif text-3xl font-bold">FAQ</h2>
            <div className="mt-6 space-y-3">
              {faqItems.map((item, index) => (
                <details key={item.question} className="group card-base p-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold">
                    <span>{item.question}</span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="calculation" className="mt-16 scroll-mt-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-center font-serif text-3xl font-bold">Подобрать фурнитуру под проект кухни</h2>
              <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
                Оставьте заявку: уточним планировку, вес фасадов, количество ящиков, желаемый уровень фурнитуры
                и подготовим расчет кухни без обещаний точной цены до замера.
              </p>
              <div className="mt-8">
                <ContactForm source="materials/furnitura" sourceType="materials" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
