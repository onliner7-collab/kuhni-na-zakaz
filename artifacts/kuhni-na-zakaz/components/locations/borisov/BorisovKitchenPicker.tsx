"use client";

import { useState } from "react";
import Link from "@/components/navigation/Link";
import { useExploreContext } from "@/components/exploration/ExploreContext";
import { ArrowRight, Check } from "lucide-react";

const base = "/media/borisov-20261007/";
const ideas = [
  { id: "apartment", label: "Для квартиры", title: "Компактная кухня для квартиры", text: "Одна рабочая линия и хранение до потолка.", alt: "Идея светлой прямой кухни для квартиры с деревянной столешницей", layout: "Прямая", style: "Современный", detail: "Светлые фасады · дерево · верхние шкафы", image: base + "apartment.webp" },
  { id: "dacha", label: "Для дачи", title: "Простая кухня для дачи", text: "Нужная техника и открытая полка для посуды.", alt: "Идея зелёной кухни для дачи с открытой полкой и окном в сад", layout: "Прямая", style: "Скандинавский", detail: "Зелёные фасады · дерево · открытая полка", image: base + "dacha.webp" },
  { id: "village", label: "Для деревни", title: "Угловая кухня для деревенского дома", text: "Рабочая поверхность вдоль двух стен и мойка у окна.", alt: "Идея угловой кремовой кухни с рамочными фасадами для деревенского дома", layout: "Угловая", style: "Неоклассика", detail: "Рамочные фасады · дерево · угловая планировка", image: base + "village.webp" },
  { id: "country", label: "Для частного дома", title: "Кухня с островом для загородного дома", text: "Отдельная рабочая зона, когда хватает места для проходов.", alt: "Идея графитовой кухни с островом и деревянными шкафами для загородного дома", layout: "С островом", style: "Лофт", detail: "Графит · дерево · остров", image: base + "country.webp" },
] as const;
const layouts = [
  { label: "Прямая", href: "/catalog/pryamye-kuhni", image: ideas[0].image, alt: ideas[0].alt, text: "Вдоль одной стены" },
  { label: "Угловая", href: "/catalog/uglovye-kuhni", image: ideas[2].image, alt: ideas[2].alt, text: "Две рабочие стены" },
  { label: "П-образная", href: "/catalog/p-obraznye-kuhni", image: "/media/visual-rescue/p-obraznye-kuhni/webp/u-overview.webp", alt: "Идея П-образной кухни с рабочими поверхностями вдоль трёх сторон", text: "Три стороны для готовки" },
  { label: "С островом", href: "/catalog/kuhni-s-ostrovom", image: ideas[3].image, alt: ideas[3].alt, text: "Отдельная рабочая зона" },
] as const;
const styles = [
  { label: "Современный", idea: ideas[0], href: "/styles/sovremennye" },
  { label: "Неоклассика", idea: ideas[2], href: "/styles/neoklassika" },
  { label: "Лофт", idea: ideas[3], href: "/styles/loft" },
  { label: "Скандинавский", idea: ideas[1], href: "/styles/skandinavskie" },
] as const;
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700";
const colors = [{ label: "Светлый", hex: "#eee8dc" }, { label: "Под дерево", hex: "#a77c4e" }, { label: "Зелёный", hex: "#7e8b73" }, { label: "Графит", hex: "#41433e" }];

function KitchenImage({ image, alt, small = false, thumbnail = false }: { image: string; alt: string; small?: boolean; thumbnail?: boolean }) {
  const responsive = image.startsWith(base);
  return <img src={image} srcSet={responsive ? `${image.replace(".webp", "-480.webp")} 480w, ${image} 1200w` : undefined} sizes={thumbnail ? "64px" : small ? "(max-width: 767px) 45vw, 280px" : "(max-width: 767px) 100vw, 600px"} alt={alt} width={1200} height={800} loading="lazy" decoding="async" className={thumbnail ? "h-16 w-12 shrink-0 object-cover sm:w-16" : "aspect-[3/2] w-full object-cover"} />;
}

export function BorisovKitchenPicker() {
  const [housing, setHousing] = useState<number | null>(null);
  const [layout, setLayout] = useState(0);
  const [style, setStyle] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { updateContext } = useExploreContext();
  const choose = (key: string, value: string, extra: Record<string, string> = {}) => {
    const next = { ...selected, ...extra, [key]: value };
    setSelected(next);
    if (key === "materials") updateContext({ materials: [value] }, "material_selected");
    if (key === "scenario") updateContext({ scenario: value }, "scenario_selected");
    if (key === "layout") updateContext({ layout: value }, "layout_selected");
    if (key === "style") updateContext({ style: value }, "style_selected");
    window.dispatchEvent(new CustomEvent("borisov-journey-answers", { detail: next }));
  };
  return <div className="space-y-12 md:space-y-20">
    <section id="housing" className="scroll-mt-24" aria-labelledby="housing-title">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Борисов и район</p>
      <h2 id="housing-title" className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Куда выбираете кухню?</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Для квартиры, дачи или дома в деревне — начните с идеи, которая ближе вашей задаче.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{ideas.map((idea, index) => <button key={idea.id} type="button" aria-pressed={housing === index} onClick={() => { setHousing(index); choose("scenario", idea.label, { idea: idea.title }); }} className={`overflow-hidden rounded-2xl border-2 bg-white text-left ${focus} ${housing === index ? "border-emerald-800" : "border-transparent"}`}>
        <KitchenImage image={idea.image} alt={idea.alt} small /><span className="flex min-h-14 items-center justify-between gap-2 px-3 py-3 text-sm font-bold">{idea.label}{housing === index && <Check className="h-4 w-4 shrink-0 text-emerald-800" aria-hidden />}</span>
      </button>)}</div>
      <p className="mt-3 text-xs text-stone-600">Идеи дизайна, созданные с помощью ИИ.</p>
      {housing !== null && <article className="mt-5 overflow-hidden rounded-2xl bg-white md:grid md:grid-cols-2" aria-live="polite">
        <KitchenImage image={ideas[housing].image} alt={ideas[housing].alt} /><div className="p-5 md:p-7"><h3 className="text-xl font-bold">{ideas[housing].title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{ideas[housing].text}</p><p className="mt-3 text-xs text-stone-600">{ideas[housing].detail}</p><a href="#calculation" className={`mt-4 inline-flex min-h-12 items-center gap-2 font-bold text-emerald-800 ${focus}`}>Рассчитать похожую <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
      </article>}
      <details className="mt-3"><summary className={`min-h-11 cursor-pointer content-center text-sm font-bold text-emerald-900 ${focus}`}>Ещё идеи для небольшой кухни</summary><div className="mt-3 grid grid-cols-2 gap-3">{[{ image: "/media/visual-rescue/malenkie-kuhni/webp/small-overview.webp", alt: "Идея небольшой кухни с продуманным хранением", label: "Маленькие кухни", href: "/catalog/malenkie-kuhni" }, { image: "/media/visual-rescue/kuhni-do-potolka/webp/ceiling-overview.webp", alt: "Идея кухни со шкафами до потолка", label: "Кухни до потолка", href: "/catalog/kuhni-do-potolka" }].map(item => <Link key={item.href} href={item.href} className={`overflow-hidden rounded-2xl bg-white ${focus}`}><KitchenImage image={item.image} alt={item.alt} small /><span className="block min-h-12 px-3 py-3 text-sm font-bold">{item.label} →</span></Link>)}</div></details>
    </section>
    <section id="types" className="scroll-mt-24" aria-labelledby="types-title">
      <h2 id="types-title" className="text-3xl font-bold tracking-tight md:text-4xl">Выберите планировку</h2>
      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">{layouts.map((item, index) => <button key={item.label} type="button" aria-pressed={selected.layout === item.label} onClick={() => { setLayout(index); choose("layout", item.label); }} className={`min-h-14 rounded-xl border px-3 py-3 text-sm font-bold ${focus} ${selected.layout === item.label ? "border-emerald-950 bg-emerald-950 text-white" : "border-stone-300 bg-white"}`}>{item.label}{selected.layout === item.label && <Check className="ml-2 inline h-4 w-4" aria-hidden />}</button>)}</div>
      <article className="mt-4 overflow-hidden rounded-2xl bg-white md:grid md:grid-cols-2"><KitchenImage image={layouts[layout].image} alt={layouts[layout].alt} /><div className="p-5 md:p-7" aria-live="polite"><p className="text-xs font-semibold text-stone-600">Идея планировки</p><h3 className="mt-2 text-xl font-bold">{layout === 3 ? "Кухня с островом" : `${layouts[layout].label} кухня`} в Борисове</h3><p className="mt-2 text-sm text-stone-600">{layouts[layout].text}. Размеры и проходы проверим по вашему помещению.</p><Link href={layouts[layout].href} className={`mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800 ${focus}`}>Больше примеров <ArrowRight className="h-4 w-4" aria-hidden /></Link></div></article>
    </section>
    <section aria-labelledby="styles-title">
      <h2 id="styles-title" className="text-3xl font-bold tracking-tight md:text-4xl">Какая атмосфера вам ближе?</h2>
      <div className="mt-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 lg:grid-cols-4">{styles.map((item, index) => <button key={item.label} type="button" aria-pressed={selected.style === item.label} onClick={() => { setStyle(index); choose("style", item.label); }} className={`flex items-center overflow-hidden rounded-xl border-2 bg-white text-left ${focus} ${selected.style === item.label ? "border-emerald-800" : "border-transparent"}`}><KitchenImage image={item.idea.image} alt={item.idea.alt} thumbnail /><span className="min-w-0 break-words px-2 py-2 text-xs font-bold md:text-sm">{item.label}{selected.style === item.label && <Check className="ml-1 inline h-3 w-3 text-emerald-800" aria-hidden />}</span></button>)}</div>
      <div className="mt-4 overflow-hidden rounded-2xl bg-white md:grid md:grid-cols-2"><KitchenImage image={styles[style].idea.image} alt={styles[style].idea.alt} /><div className="space-y-3 p-4 md:p-7">
        <Link href={styles[style].href} className={`inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800 ${focus}`}>Больше кухонь: {styles[style].label.toLowerCase()} стиль →</Link>
        <details><summary className={`min-h-11 cursor-pointer content-center text-sm font-bold ${focus}`}>Выбрать материал и цвет</summary><div className="mt-3 space-y-4">
        <fieldset><legend className="mb-2 text-sm font-bold">Материал фасадов</legend><div className="flex flex-wrap gap-2">{["ЛДСП", "МДФ", "Пока не знаю"].map(value => <button key={value} type="button" aria-pressed={selected.materials === value} onClick={() => choose("materials", value)} className={`min-h-11 rounded-full border px-4 text-sm ${focus} ${selected.materials === value ? "border-emerald-950 bg-emerald-950 text-white" : "border-stone-300"}`}>{value}</button>)}</div></fieldset>
        <fieldset><legend className="mb-2 text-sm font-bold">Оттенок для вашего проекта</legend><div className="grid grid-cols-2 gap-2">{colors.map(color => <button key={color.label} type="button" aria-pressed={selected.color === color.label} onClick={() => choose("color", color.label)} className={`flex min-h-11 items-center gap-2 rounded-xl border p-2 text-xs ${focus} ${selected.color === color.label ? "border-emerald-800 bg-emerald-50" : "border-stone-200"}`}><span aria-hidden className="h-6 w-6 shrink-0 rounded-full border border-stone-400" style={{ backgroundColor: color.hex }} />{color.label}</button>)}</div></fieldset>
        <p className="text-xs leading-5 text-stone-600">Фото показывает стиль. Материал и точный оттенок выберем по образцам.</p>
        </div></details>
      </div></div>
      <details className="mt-3"><summary className={`min-h-11 cursor-pointer content-center text-sm font-bold text-emerald-900 ${focus}`}>Все планировки и стили</summary><div className="grid grid-cols-2 gap-2">{layouts.map(item => <Link key={item.href} href={item.href} className={`inline-flex min-h-11 items-center text-sm underline ${focus}`}>{item.label} кухни</Link>)}{styles.map(item => <Link key={item.href} href={item.href} className={`inline-flex min-h-11 items-center text-sm underline ${focus}`}>{item.label}</Link>)}</div></details>
      <div className="mt-4 rounded-2xl bg-[#e8e9df] p-5"><p className="text-sm font-semibold" aria-live="polite">{Object.entries(selected).filter(([key]) => key !== "idea").map(([, value]) => value).join(" · ") || "Можно оставить выбор дизайнеру"}</p><a href="#calculation" className={`mt-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-950 px-5 text-sm font-bold text-white ${focus}`}>Рассчитать мою кухню <ArrowRight className="h-4 w-4" aria-hidden /></a><button type="button" onClick={() => { setSelected({}); setHousing(null); setLayout(0); setStyle(0); updateContext({ scenario: undefined, layout: undefined, style: undefined, materials: undefined }, "selection_reset"); window.dispatchEvent(new CustomEvent("borisov-journey-answers", { detail: {} })); }} className={`ml-3 inline-flex min-h-11 items-center text-xs underline ${focus}`}>Сбросить выбор</button></div>
    </section>
  </div>;
}
