import { MATERIAL_SOLUTIONS, MATERIAL_PRICE_SCENARIOS } from "@/data/material-solutions";
import { MATERIAL_RESEARCH_DATE, MATERIAL_MARKET_LABEL, MATERIAL_QUOTE_INCLUDES, materialOffers, materialPriceStatus } from "@/data/material-pricing";

/** Server-rendered evidence shared by the hub and all six detail pages. */
export function MaterialMarketEvidence({ materialId }: { materialId?: string }) {
  const materials = MATERIAL_SOLUTIONS.filter(m => !materialId || m.id === materialId);
  return <section id="market-prices" className="mt-10 scroll-mt-28 rounded-3xl border border-stone-200 bg-white p-4 text-stone-950 md:scroll-mt-48 md:p-6" aria-labelledby="market-prices-title">
    <h2 id="market-prices-title" className="text-2xl font-bold">Опубликованные цены: примеры и состав</h2>
    <p className="mt-3 text-sm leading-6">{MATERIAL_MARKET_LABEL}.</p>
    <p className="mt-2 text-sm text-stone-600">Проверка источников: <time dateTime={MATERIAL_RESEARCH_DATE}>{new Date(MATERIAL_RESEARCH_DATE + "T12:00:00Z").toLocaleDateString("ru-BY", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Minsk" })}</time>. Это дата проверки публикаций, а не подтверждение действующей сметы продавца.</p>
    <p className="mt-3 rounded-xl bg-violet-50 p-4 text-sm leading-6">{MATERIAL_QUOTE_INCLUDES}</p>
    <div className="mt-4 space-y-3">{materials.map(m => {
      const offers = materialOffers(m.id);
      const examples = offers.filter(o => o.status === "verified" && o.materialConfirmed && o.publicExample);
      return <details key={m.id} open={Boolean(materialId)} data-material-evidence={m.id} className="rounded-2xl border border-stone-200 p-4">
        <summary className="min-h-11 cursor-pointer content-center font-bold">{m.title} · {examples.length} {examples.length === 1 ? "пример" : "примера"} с опубликованной ценой</summary>
        <p className="mt-3 text-sm leading-6">Изучено наблюдений: {offers.length}; компаний: {new Set(offers.map(o => o.companyGroup)).size}. Часть публикаций исключена из сравнения. Это не количество сопоставимых смет.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{examples.map(o => <article key={o.id} data-offer-id={o.id} className="min-w-0 rounded-xl bg-stone-50 p-4 text-sm leading-6">
          <h3 className="font-bold">{o.company} · {o.model}</h3>
          <p className="mt-2 font-bold text-violet-900">{o.priceType === "от" ? "От " : ""}{o.price?.toLocaleString("ru-BY")} BYN · {o.unit}</p>
          <p className="mt-2">{o.region}. {o.layout}; {o.dimensions}. Фасады: {o.coating}.</p>
          <p className="mt-2">Корпус: {o.carcass}. Столешница: {o.worktop}. Механизмы: {o.mechanisms}.</p>
          <p className="mt-2 text-stone-600">{o.reason}. Техника, доставка, подъём и монтаж включены только при прямом указании в публикации; неизвестные позиции не считаем бесплатными.</p>
          {o.promotion !== "Не подтверждена" && <p className="mt-2">Условия публикации: {o.promotion}.</p>}
          <a href={o.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center font-semibold text-violet-800 underline">Открыть источник предложения ↗</a>
        </article>)}</div>
        <details className="mt-3 rounded-xl bg-amber-50 p-4"><summary className="min-h-11 cursor-pointer content-center font-semibold">Можно ли получить диапазон для одинаковой кухни?</summary>
          {MATERIAL_PRICE_SCENARIOS.map(s => <p key={s.id} data-price-status={`${m.id}:${s.id}`} className="mt-3 text-sm leading-6"><strong>{s.title}:</strong> диапазон пока не подтверждён. Сопоставимых предложений: {materialPriceStatus(m.id, s.id).comparableCount}. {materialPriceStatus(m.id, s.id).reason}</p>)}
          <p className="mt-3 text-sm leading-6">Нужны минимум 3 сопоставимых предложения от 2 независимых компаний на один состав. Ставки за погонный метр, цену фасада за м² и цену кухни не смешиваем. Поправки на длину и фурнитуру не придумываем. Цены «от» не задают верхнюю границу рынка.</p>
        </details>
      </details>;
    })}</div>
    <details className="mt-4"><summary className="min-h-11 cursor-pointer content-center font-semibold">Материалы, серии и условия заказа</summary><p className="mt-2 text-sm leading-6">Изготавливаем на заказ все шесть решений: ЛДСП, МДФ в плёнке, МДФ с эмалью, HPL, акрил и шпон. Серию, основу, покрытие, декор, финиш и торец согласуем по образцу и спецификации. Справочные документы производителей и ИИ-иллюстрации не подтверждают доступность конкретной серии. Бытовую технику, мойку, смеситель и дополнительные работы включаем в проект после согласования.</p></details>
  </section>;
}
