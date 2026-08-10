"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import Link from "@/components/navigation/Link";
import { useExploreContext } from "@/components/exploration";

const choices = [
  { id: "compact", label: "Компактная кухня", title: "Больше хранения без тесного прохода", text: "Сценарий для типовой городской кухни: форма, хранение до потолка, ящики и подготовка монтажа.", image: "/uploads/locations/soligorsk-visual-l0/soligorsk-compact-base.webp", avif: "/uploads/locations/soligorsk-visual-l0/soligorsk-compact-base.avif", alt: "Компактная угловая кухня со свободным проходом", href: "/locations/soligorsk", link: "Открыть сценарий Солигорска" },
  { id: "new-build", label: "Новостройка", title: "Планировка и коммуникации до установки", text: "Проверьте хранение до потолка, встроенную технику и положение инженерных выводов.", image: "/uploads/locations/fanipol-visual-l0/fanipol-new-build-base.webp", avif: "/uploads/locations/fanipol-visual-l0/fanipol-new-build-base.avif", alt: "Светлая кухня для новостройки с удобным проходом", href: "/locations/fanipol", link: "Открыть сценарий Фаниполя" },
  { id: "family", label: "Семейная кухня", title: "Длинная рабочая зона для ежедневной готовки", text: "Сравните прямую и угловую форму, глубокие ящики и завершающий этап монтажа.", image: "/uploads/locations/gomel-visual-l0/gomel-family-straight.webp", avif: "/uploads/locations/gomel-visual-l0/gomel-family-straight.avif", alt: "Семейная кухня с большой рабочей поверхностью", href: "/locations/gomel", link: "Открыть сценарий Гомеля" },
] as const;

export function LocationHubExplorer() {
  const [activeId, setActiveId] = useState<(typeof choices)[number]["id"]>(choices[0].id);
  const { updateContext } = useExploreContext();
  const active = choices.find((choice) => choice.id === activeId) ?? choices[0];

  return (
    <section aria-labelledby="location-hub-explorer-title" data-location-hub-explorer data-dock-suppress className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
      <picture key={active.id}>
        <source srcSet={active.avif} type="image/avif" />
        <img src={active.image} alt={active.alt} width={1200} height={800} fetchPriority="high" className="aspect-[3/2] h-auto w-full object-cover motion-safe:animate-[fade-in_.2s_ease-out] motion-reduce:animate-none" />
      </picture>
      <div className="p-4 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Начните с помещения</p>
        <h2 id="location-hub-explorer-title" className="mt-2 font-serif text-2xl font-bold md:text-3xl">Какую кухню вы планируете?</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label="Сценарии кухни">
          {choices.map((choice) => {
            const selected = choice.id === active.id;
            return (
              <button key={choice.id} type="button" aria-pressed={selected} onClick={() => { setActiveId(choice.id); updateContext({ location: choice.label }, `location_hub:${choice.id}`); }} className={`min-h-12 rounded-xl border px-3 py-2.5 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-stone-50 hover:border-stone-600"}`}>
                <span className="flex items-center gap-2">{selected ? <Check className="h-4 w-4" aria-hidden /> : null}{choice.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl bg-stone-100 p-4" aria-live="polite">
          <h3 className="font-black">{active.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{active.text}</p>
          <Link href={active.href} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">
            {active.link}<ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
