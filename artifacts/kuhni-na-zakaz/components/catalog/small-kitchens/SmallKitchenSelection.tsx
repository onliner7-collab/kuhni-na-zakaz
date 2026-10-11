"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { useExploreContext } from "@/components/exploration";
import { SMALL_KITCHEN_PATH, smallKitchenIdeas, type SmallKitchenIdea } from "@/data/small-kitchens";

function IdeaCard({ idea, selected, onChoose }: { idea: SmallKitchenIdea; selected: boolean; onChoose: () => void }) {
  const [view, setView] = useState(0);
  const image = idea.views[view];
  return (
    <article className={`min-w-0 overflow-hidden rounded-3xl border bg-white ${selected ? "border-amber-600 ring-2 ring-amber-200" : "border-stone-200"}`} data-idea-id={idea.id}>
      <div className="relative aspect-[3/2] bg-stone-100">
        <img src={image.src} alt={image.alt} width={1200} height={800} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold">{view + 1} / {idea.views.length} · {image.label}</span>
      </div>
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-4 gap-2" aria-label={`Ракурсы: ${idea.name}`}>
          {idea.views.map((item, index) => <button key={item.src} type="button" onClick={() => setView(index)} aria-pressed={view === index} aria-label={`${idea.name}: ${item.label}`}
            className={`min-h-11 overflow-hidden rounded-lg border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${view === index ? "border-amber-600" : "border-transparent"}`}>
            <img src={item.src} alt="" width={180} height={120} loading="lazy" className="aspect-[3/2] w-full object-cover" />
          </button>)}
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-amber-800">{idea.tag}</p>
        <h3 className="mt-2 text-xl font-black leading-snug">{idea.name}</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">{idea.text}</p>
        <p className="mt-3 text-sm leading-6"><strong>Для маленькой кухни:</strong> {idea.benefit}</p>
        <details className="mt-3 border-t border-stone-200 pt-2"><summary className="min-h-11 cursor-pointer content-center text-sm font-bold">Проверить в своём помещении</summary><p className="mt-2 text-sm leading-6 text-stone-700">{idea.check}</p></details>
        <button type="button" aria-pressed={selected} onClick={onChoose} className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 ${selected ? "bg-amber-100 text-stone-950" : "bg-stone-950 text-white"}`}>
          {selected ? <Check size={18} aria-hidden /> : null}{selected ? "Выбрано для расчёта" : "Выбрать для расчёта"}
        </button>
      </div>
    </article>
  );
}

export function SmallKitchenSelection({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { context, updateContext } = useExploreContext();
  const selected = smallKitchenIdeas.find(idea => idea.id === selectedId);
  const priority = context.sourceRoute === SMALL_KITCHEN_PATH && context.scenario?.startsWith("Маленькая кухня:") ? context.scenario : "Приоритет пока не выбран";
  const answers = { sourceRoute: SMALL_KITCHEN_PATH, selectedIdea: selected?.id || "", selectedIdeaName: selected?.name || "", kitchenType: selected?.layout || "", priority };

  function choose(idea: SmallKitchenIdea) {
    setSelectedId(idea.id);
    updateContext({ layout: idea.layout, evidencePreference: "ideas" }, `small-kitchen-idea:${idea.id}`);
  }

  return <>
    <section id="small-kitchen-ideas" aria-labelledby="small-ideas-heading" className="mt-12 scroll-mt-40">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Выбор компактной планировки</p>
      <h2 id="small-ideas-heading" className="mt-2 text-2xl font-black md:text-3xl">Маленькие кухни: варианты и ракурсы</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Сравните небольшие прямые и угловые гарнитуры. Это примеры дизайна: размеры, материалы и наполнение согласуем в проекте вашего помещения.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{smallKitchenIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} selected={idea.id === selectedId} onChoose={() => choose(idea)} />)}</div>
      <p className="mt-4 text-xs leading-5 text-stone-500">Дополнительные ракурсы показывают варианты наполнения. Точное расположение шкафов и техники фиксируется в согласованном проекте.</p>
      {selected ? <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 text-sm"><p><strong>Для расчёта:</strong> {selected.name}</p><a href="#form" className="inline-flex min-h-11 items-center rounded-xl bg-stone-950 px-4 py-2 font-bold text-white focus-visible:ring-2 focus-visible:ring-amber-600">Отправить размеры ↓</a></div> : null}
    </section>
    {children}
    <section id="form" aria-labelledby="small-form-heading" className="mt-12 scroll-mt-40 overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid lg:grid-cols-2">
      <div className="bg-stone-950 p-5 text-white md:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">По вашим размерам</p>
        <h2 id="small-form-heading" className="mt-2 text-2xl font-black md:text-3xl">Рассчитать маленькую кухню</h2>
        <p className="mt-4 text-sm leading-6 text-stone-300">Оставьте контакт и размеры стен. Обсудим размещение техники, рабочую поверхность, фасады и состав сметы.</p>
        <dl className="mt-6 space-y-4 text-sm"><div><dt className="text-stone-400">Выбранный вариант</dt><dd className="mt-1 font-bold" data-testid="small-selected-idea">{selected?.name || "Можно обсудить при обращении"}</dd></div><div><dt className="text-stone-400">Что важно сохранить</dt><dd className="mt-1 font-bold" data-testid="small-selected-priority">{priority}</dd></div></dl>
        <p className="mt-6 text-sm leading-6 text-stone-300">Укажите окно, дверь и коммуникации. Замер, доставку и монтаж согласуем для вашего адреса.</p>
      </div>
      <div className="p-5 md:p-8"><ContactForm source="catalog" sourcePage={SMALL_KITCHEN_PATH} sourceType="catalog-small-kitchen" formType="small-kitchen-calculation" formLocation="small-kitchen-final" submitLabel="Отправить на расчёт" compact showDimensions showComment showHasMeasurements defaultKitchenType={selected?.layout} defaultAnswers={answers} /></div>
    </section>
  </>;
}
