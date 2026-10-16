import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { ExploreContextProvider } from "@/components/exploration";
import { MaterialDetailsLink } from "@/components/materials/MaterialsSelection";
import { MaterialsLeadSummary } from "@/components/materials/MaterialsHub";
import { MdfPhotoGallery } from "@/components/materials/MdfPhotoGallery";
import { MaterialSurfaceComparator } from "@/components/materials/MaterialSurfaceComparator";
import { MdfVisualJourney, MdfVisualComparison, MdfVisualEquipment, MdfSolutionActions, MdfConstructionCompare } from "@/components/materials/MdfVisualJourney";
import { MaterialDecisionExplorer } from "@/components/materials/MaterialDecisionExplorer";
import { MaterialDetailGallery } from "@/components/sections/MaterialDetailGallery";
import { MATERIAL_EXPLORATION } from "@/data/material-exploration";
import { MATERIAL_SOLUTIONS } from "@/data/material-solutions";
import { MDF_FAQ, MDF_SCENARIOS, MDF_PRICE_RESEARCH } from "@/data/mdf-content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Кухни с фасадами МДФ на заказ — покрытия и комплектация";
const description = "Не покупайте кухню, пока не сравните фасады у нас. МДФ, плёнка, эмаль — в чём разница? Посмотрите фото и детали вблизи, выберите свой вариант.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/materials/mdf-fasady" }, robots: { index: true, follow: true },
  openGraph: buildOpenGraph("/materials/mdf-fasady", title, description, { images: [{ url: "/images/mdf-facades-20261015/film-apartment.webp", width: 1200, height: 800, alt: "Светлая кухня с гладкими фасадами МДФ — визуальный пример" }] }),
  twitter: buildTwitterMetadata(title, description, "/images/mdf-facades-20261015/film-apartment.webp"),
};
const disclosure = "rounded-2xl border border-stone-200 bg-white p-4 md:p-5";
const summary = "min-h-11 cursor-pointer content-center text-base font-bold";
const coatingNotes: Record<string, string> = {
  "mdf-film": "Декор и профиль выбирают по образцу.", "mdf-enamel": "Цвет и финиш проверяют по выкрасу.",
  hpl: "Сравните облицовку и кромку.", acrylic: "Посмотрите отражения и торец.", veneer: "Оцените рисунок натурального дерева.",
};

export default function MdfFacadesPage() {
  return <ExploreContextProvider sourceRoute="/materials/mdf-fasady">
    <JsonLd data={breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Материалы", path: "/materials" }, { name: "Кухни с фасадами МДФ", path: "/materials/mdf-fasady" }])}/>
    <div className="bg-[#f7f5f2] pb-24 text-stone-950"><div className="container-site py-3 md:py-6">
      <nav aria-label="Хлебные крошки" className="mb-2 flex flex-wrap items-center gap-2 text-xs text-stone-600"><Link href="/" className="inline-flex min-h-11 items-center">Главная</Link><span aria-hidden>/</span><Link href="/materials" className="inline-flex min-h-11 items-center">Материалы</Link><span aria-hidden>/</span><span aria-current="page">МДФ</span></nav>
      <MdfVisualJourney/>

      <section id="coatings" className="mt-10 scroll-mt-24" aria-labelledby="mdf-coatings-title"><h2 id="mdf-coatings-title" className="text-2xl font-bold md:text-3xl">Какое покрытие вам ближе?</h2><p className="mt-2 text-sm text-stone-600">МДФ — основа. Внешний вид задаёт покрытие.</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{MATERIAL_SOLUTIONS.filter(m => m.id !== "ldsp").map(m => <article key={m.id} id={m.id === "mdf-film" ? "plenka" : undefined} data-material-id={m.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-200 bg-white"><img src={m.id === "mdf-film" ? "/images/mdf-facades-20261015/film-country.webp" : m.id === "mdf-enamel" ? "/images/mdf-facades-20261015/enamel-apartment.webp" : m.image} alt={`Визуальный пример кухни: ${m.title.toLowerCase()}`} width={1200} height={800} loading="lazy" className="aspect-[3/2] w-full object-cover"/><div className="p-4"><h3 className="text-xl font-bold">{m.title}</h3><p className="my-2 text-sm leading-6 text-stone-600">{coatingNotes[m.id]}</p><MdfSolutionActions id={m.id}/>{m.id !== "mdf-film" && <MaterialDetailsLink id={m.id}>Фото и подробности →</MaterialDetailsLink>}</div></article>)}</div><p className="mt-3 text-xs text-stone-500">Визуальные примеры. Для HPL, акрила и шпона основание уточняется по исполнению.</p></section>

      <div className="mt-10"><MaterialSurfaceComparator/></div>
      <MdfVisualComparison/>
      <details className={`${disclosure} mt-4`}><summary className={summary}>ЛДСП: четыре ракурса и фото в интерьере</summary><div className="mt-4 space-y-5"><MaterialDecisionExplorer config={MATERIAL_EXPLORATION.ldsp}/><MaterialDetailGallery slug="ldsp" title="ЛДСП для кухни"/><MaterialDetailsLink id="ldsp">Открыть страницу ЛДСП →</MaterialDetailsLink></div></details>
      <MdfVisualEquipment/>

      <details className={`${disclosure} mt-8`}><summary className={summary}>Все фотографии кухонь и фасадов — 12 примеров</summary><MdfPhotoGallery/></details>

      <section className="mt-8" aria-labelledby="mdf-more-title"><h2 id="mdf-more-title" className="mb-4 text-2xl font-bold">Что важно перед заказом</h2><MdfConstructionCompare/><div className="grid gap-3">
        <details id="construction" className={`${disclosure} scroll-mt-24`}><summary className={summary}>Основа, покрытие, корпус: в чём разница?</summary><div className="mt-3 grid gap-3 text-sm leading-6"><p><strong>Основа фасада — МДФ.</strong> Древесноволокнистая плита задаёт форму; возможность фрезеровки зависит от плиты и технологии.</p><p><strong>Покрытие</strong> формирует наружную поверхность: плёнка, окраска или облицовка. Торец и обратная сторона согласуются отдельно.</p><p><strong>Корпус</strong> — стенки и полки шкафов. Столешница, петли и ящики — отдельные позиции комплектации.</p><a href="https://www.egger.com/it/mobili-arredamento-dinterni/gamma/prodotti/mdfe05mb?country=IT" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-violet-800 underline">О свойствах основы: документация EGGER</a></div></details>
        <details id="rooms" className={`${disclosure} scroll-mt-24`}><summary className={summary}>Для квартиры, частного дома или дачи</summary><div className="mt-3 grid gap-4 text-sm leading-6">{MDF_SCENARIOS.map(s => <div key={s.title}><h3 className="font-bold">{s.title}</h3><p>{s.text}</p><Link href={s.href} className="inline-flex min-h-11 items-center font-semibold text-violet-800 underline">{s.link} →</Link></div>)}<p>Укажите адрес, этаж и подъезд. Выезд, доставку и монтаж согласуем до договора.</p></div></details>
        <details id="care" className={`${disclosure} scroll-mt-24`}><summary className={summary}>Уход, вода, пар и повреждения</summary><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6"><li>Убирайте воду и конденсат со стыков. Не направляйте пар чайника на фасады.</li><li>Используйте мягкую слегка влажную салфетку, затем вытрите насухо. Средство — по инструкции покрытия.</li><li>Зазоры у духовки и защиту от пара задают инструкции мебели и техники.</li><li>Ремонт, замену и совпадение декора уточняют у изготовителя. Для неотапливаемого помещения нужен подтверждённый допуск.</li></ul><a href="https://alanmebel.by/kompanija/pravila-ekspluataczii-mebeli/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm text-violet-800 underline">Пример инструкции производителя</a></details>
        <details className={disclosure}><summary className={summary}>Почему стоимость рассчитывается индивидуально?</summary><p className="mt-3 text-sm leading-6">Размеры, покрытие, ящики, столешница и услуги меняют смету. Ставка за метр не равна цене целой кухни. Для одинаковой комплектации пока недостаточно сопоставимых предложений Беларуси.</p><details className="mt-3"><summary className={summary}>Источники исследования цен</summary><ul className="mt-3 grid gap-3 text-sm leading-6">{MDF_PRICE_RESEARCH.map(r => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-violet-800 underline">{r.seller}: {r.model}</a><p>{r.reason}</p></li>)}</ul></details></details>
      </div></section>
      <details id="questions" className={`${disclosure} mt-3 scroll-mt-24`}><summary className={summary}>Частые вопросы о фасадах МДФ</summary><div className="mt-3 grid gap-3">{MDF_FAQ.map(([q,a]) => <details key={q} className="rounded-xl bg-stone-50 p-4"><summary className={summary}>{q}</summary><p className="mt-2 text-sm leading-6 text-stone-600">{a}</p></details>)}</div></details>

      <section id="materials-form" className="mt-10 scroll-mt-24 overflow-hidden rounded-3xl bg-white p-4 md:p-7" aria-labelledby="mdf-calculation-title"><h2 id="mdf-calculation-title" className="mb-4 text-2xl font-bold md:text-3xl">Рассчитать выбранную кухню</h2><div className="grid gap-5 lg:grid-cols-2"><MaterialsLeadSummary/><ContactForm source="material-mdf-facades" sourcePage="/materials/mdf-fasady" sourceType="material" submitLabel="Рассчитать кухню" answersEventName="mdf-facades-answers"/></div></section>
    </div></div>
  </ExploreContextProvider>;
}
