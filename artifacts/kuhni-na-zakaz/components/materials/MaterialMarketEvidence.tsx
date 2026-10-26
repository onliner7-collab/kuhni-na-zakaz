import { MATERIAL_QUOTE_INCLUDES } from "@/data/material-quote-terms";

/** Quote terms only. Competitor research is kept outside the public interface. */
export function MaterialMarketEvidence({ materialId }: { materialId?: string }) {
  return <section id="material-quote" data-material-quote={materialId || "all"} className="mt-10 scroll-mt-28 rounded-3xl border border-stone-200 bg-white p-4 text-stone-950 md:scroll-mt-48 md:p-6" aria-labelledby="material-quote-title">
    <h2 id="material-quote-title" className="text-2xl font-bold">Что входит в расчёт вашей кухни</h2>
    <p className="mt-3 rounded-xl bg-violet-50 p-4 text-sm leading-6">{MATERIAL_QUOTE_INCLUDES}</p>
    <p className="mt-3 text-sm leading-6">Стоимость рассчитываем в BYN по размерам помещения, выбранным фасадам, столешнице и фурнитуре. Бытовую технику, мойку, смеситель и дополнительные работы включаем в проект после согласования.</p>
    <p className="mt-3 text-sm leading-6">Отправьте размеры и пожелания. Сравним выбранные материалы на одном проекте и подготовим понятную комплектацию. Серию, декор, финиш и торец согласуем по образцу и спецификации.</p>
    <a href="#materials-form" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-violet-800 px-5 py-3 font-semibold text-white">Рассчитать мою кухню</a>
  </section>;
}
