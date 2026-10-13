import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { MobileCalculator } from "@/components/calculator/MobileCalculator";
import { KitchenPlan } from "@/components/calculator/KitchenPlan";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { estimate, initialSelection, layouts } from "@/lib/calculator/config";
import "./calculator.css";
import "./preview.css";

export const dynamic = "force-dynamic";
const title = "Калькулятор кухни — расчёт по размерам в метрах";
const description = "Подготовьте расчёт кухни на заказ в Минске: выберите планировку, размеры в метрах и материалы. Отправьте заявку с телефоном или почтой для уточнения стоимости.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/calculator" },
  openGraph: buildOpenGraph("/calculator", title, description), twitter: buildTwitterMetadata(title, description),
};
const faq = [
  { question: "Можно ли рассчитать стоимость кухни онлайн без телефона?", answer: "Выбрать планировку, размеры и комплектацию можно без контактов. Если для выбранного варианта заполнены тарифы, предварительная цена появится на экране. Если тарифа пока нет, предложим заявку на индивидуальный расчёт. Для заявки достаточно телефона или электронной почты — можно указать оба." },
  { question: "Как рассчитать погонные метры угловой кухни?", answer: "Укажите длину двух участков вдоль стен в метрах: например, 2,4 и 1,8. Калькулятор сложит их и покажет 4,2 м. Это сумма сторон для предварительного расчёта. Верхний ряд второй раз не прибавляйте. Конструкцию угла и фактические размеры модулей уточним при проектировании." },
  { question: "Что делать, если размеры кухни пока примерные?", answer: "Введите приблизительные размеры и оставьте отметку «Размеры пока примерные». Например, для прямой кухни укажите 3 м, для П-образной — длину каждой из трёх сторон. Итоговую смету подготовим после уточнения размеров." },
  { question: "Можно ли рассчитать кухню из МДФ, ЛДСП или до потолка?", answer: "Да. На шаге комплектации откройте «Настроить материалы отдельно». Выберите фасады из ЛДСП, МДФ в плёнке, МДФ в эмали или с пластиковым покрытием, а также обычные верхние шкафы, шкафы до потолка или вариант без верхних шкафов." },
  { question: "Входят ли техника, доставка и монтаж в расчёт?", answer: "Эти расходы обсуждаются отдельно. Базовый состав мебели: корпуса, фасады, выбранные верхние шкафы, столешница и фурнитура. Техника, мойка, смеситель, фартук, подсветка, доставка, подъём, монтаж и подключение техники требуют отдельного согласования." },
  { question: "Почему предварительная цена отличается от окончательной сметы?", answer: "Расчёт по метрам опирается на типовую комплектацию. Итог зависит от высоты и глубины шкафов, количества ящиков, конкретных механизмов, углов, вырезов и особенностей помещения. До заказа согласуем состав и стоимость. Для кухни с островом или нестандартными размерами подготовим индивидуальный расчёт." },
];
export default async function CalculatorPage() {
  const tariffs = await prisma.priceRule.findMany({ where: { key: { startsWith: "calc_v2_" }, active: true }, select: { key: true, value: true, active: true } }).catch(() => []);
  const hasPrices = estimate({ ...initialSelection, lengths: ["3", "", ""] }, tariffs).status === "priced";
  return <div className="calculator-page">
    <JsonLd data={[breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Калькулятор кухни", path: "/calculator" }]), faqJsonLd(faq)!]} />
    <div className="calc-container">
      <nav className="calc-breadcrumb" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Калькулятор кухни</span></nav>
      <header className="calc-header"><p className="calc-eyebrow">Кухня под ваши размеры</p><h1>Калькулятор<br className="calc-mobile-break" /> стоимости кухни</h1><p>Выберите планировку, укажите размеры в метрах и соберите комплектацию. Мы поможем уточнить стоимость кухни на заказ.</p><div className="calc-header-tags"><span>3 простых шага</span><span>Все размеры в метрах</span></div>
        {!hasPrices && <p className="calc-availability">Сейчас калькулятор готовит заявку на расчёт. Стоимость уточнит менеджер — автоматические цены пока не опубликованы.</p>}
      </header>
      <MobileCalculator hasPrices={hasPrices} />
      <section className="calc-guide" aria-labelledby="calc-guide-title"><h2 id="calc-guide-title">Как измерить кухню в метрах</h2><p className="calc-muted">Измеряйте участки, которые займёт гарнитур, а не площадь комнаты. Для каждого поля есть своя буква на схеме.</p><div className="calc-guide-grid">{layouts.map((item, index) => <article key={item.id}><KitchenPlan layout={item.id} detailed /><h3>{item.title}</h3><p>{["Одна сторона: А = 3 м.", "Две стороны: 2,4 + 1,8 = 4,2 м.", "Три стороны: 2 + 3 + 2 = 7 м."][index]}</p></article>)}</div><p className="calc-note">Верхние шкафы не удваивают длину. Сложную геометрию, места под технику и устройство углов уточним при подготовке проекта.</p></section>
      <section className="calc-faq" aria-labelledby="calc-faq-title"><h2 id="calc-faq-title">Вопросы о расчёте стоимости кухни</h2>{faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
      <section className="calc-links" aria-label="Что посмотреть перед заказом"><Link href="/prices"><strong>Цены и комплектации</strong><span>Что влияет на бюджет кухни</span></Link><Link href="/catalog/uglovye-kuhni"><strong>Угловые кухни</strong><span>Идеи для двух стен</span></Link><Link href="/delivery-installation"><strong>Доставка и установка</strong><span>Условия и состав работ</span></Link></section>
    </div>
  </div>;
}
