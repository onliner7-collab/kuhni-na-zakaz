"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Heart, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { useExploreContext } from "@/components/exploration";
import { catalogColors, catalogLayouts, catalogMaterials, catalogModels, catalogRooms, catalogStyles, type CatalogModel } from "@/data/catalog-showcase";

type Filters = { layout: string; style: string; size: string; material: string; color: string; room: string };
const initial: Filters = { layout: "all", style: "all", size: "all", material: "all", color: "all", room: "all" };
const options = {
  layout: [{ id: "all", label: "Все планировки" }, ...catalogLayouts],
  style: [{ id: "all", label: "Все стили" }, ...catalogStyles],
  size: [{ id: "all", label: "Любая длина" }, { id: "compact", label: "До 2,4 м" }, { id: "medium", label: "Более 2,4 до 3 м" }, { id: "large", label: "Более 3 м" }],
  material: [{ id: "all", label: "Любые фасады" }, ...catalogMaterials],
  color: [{ id: "all", label: "Все цвета" }, ...catalogColors],
  room: [{ id: "all", label: "Любое помещение" }, ...catalogRooms],
};
const labels: Record<keyof Filters, string> = { layout: "Планировка", style: "Стиль", size: "Длина основной стены", material: "Фасады для проекта", color: "Цвет", room: "Помещение" };
const layoutLabel = (model: CatalogModel) => catalogLayouts.find((item) => item.id === model.layout)?.label ?? "Угловая";
const money = (model: CatalogModel) => model.priceFrom ? `от ${model.priceFrom.toLocaleString("ru-BY")} BYN` : "По индивидуальному расчёту";
const storageKey = "catalog-selection-v1";

function matches(model: CatalogModel, filters: Filters) {
  return (filters.layout === "all" || model.layout === filters.layout)
    && (filters.style === "all" || model.style === filters.style)
    && (filters.material === "all" || model.material === filters.material)
    && (filters.color === "all" || model.color === filters.color)
    && (filters.room === "all" || model.rooms.some((room) => room === filters.room))
    && (filters.size === "all" || (model.maxWall !== null && (filters.size === "compact" ? model.maxWall <= 2.4 : filters.size === "medium" ? model.maxWall > 2.4 && model.maxWall <= 3 : model.maxWall > 3)));
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; opener?.focus(); };
  }, []);
  return <dialog ref={dialog} className="catalog-dialog" aria-labelledby="catalog-dialog-title" onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === dialog.current) onClose(); }}>
    <div className="catalog-dialog-heading"><h2 id="catalog-dialog-title">{title}</h2><button autoFocus className="catalog-icon" title="Закрыть" aria-label="Закрыть окно" onClick={onClose}><X size={22} /></button></div>
    {children}
  </dialog>;
}

function ModelDetails({ model, choose, onClose }: { model: CatalogModel; choose: (model: CatalogModel) => void; onClose: () => void }) {
  const [view, setView] = useState(0);
  const touch = useRef<number | null>(null);
  const next = (step: number) => setView((value) => (value + step + model.images.length) % model.images.length);
  const layout = catalogLayouts.find((item) => item.id === model.layout);
  const style = catalogStyles.find((item) => item.id === model.style);
  const material = catalogMaterials.find((item) => item.id === model.material);
  return <Modal title={model.name} onClose={onClose}>
    <div className="catalog-detail">
      <div>
        <div className="catalog-detail-image" tabIndex={0} aria-label="Фото выбранной кухни" onKeyDown={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); next(e.key === "ArrowLeft" ? -1 : 1); } }} onTouchStart={(e) => { touch.current = e.touches[0].clientX; }} onTouchEnd={(e) => { if (touch.current !== null) { const delta = e.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 45) next(delta < 0 ? 1 : -1); } touch.current = null; }}>
          <Image src={model.images[view]} alt={`${model.name}, ${view === 0 ? "общий вид" : `ракурс ${view + 1}`}, пример дизайна`} fill sizes="(max-width: 767px) 94vw, 600px" className="object-cover" />
          {model.images.length > 1 && <><button className="catalog-icon catalog-prev" aria-label="Предыдущий ракурс" title="Предыдущий ракурс" onClick={() => next(-1)}><ArrowLeft size={20} /></button><button className="catalog-icon catalog-next" aria-label="Следующий ракурс" title="Следующий ракурс" onClick={() => next(1)}><ArrowRight size={20} /></button></>}
        </div>
        {model.images.length > 1 && <div className="catalog-thumbs">{model.images.map((src, index) => <button key={src} aria-label={`Ракурс ${index + 1}`} aria-pressed={view === index} onClick={() => setView(index)}><Image src={src} alt="" width={150} height={100} /></button>)}</div>}
        <p className="catalog-muted">Пример дизайна. Размеры и материалы согласуем под ваше помещение.</p>
      </div>
      <div>
        <p>{model.description}</p>
        <dl className="catalog-spec"><div><dt>Планировка</dt><dd>{layoutLabel(model)}</dd></div><div><dt>Размеры примера</dt><dd>{model.dimensions}</dd></div><div><dt>Фасады</dt><dd>{model.facade}</dd></div><div><dt>Стоимость</dt><dd>{money(model)}</dd></div></dl>
        <details><summary>Комплектация и расчёт</summary><ul>{model.equipment.map((item) => <li key={item}>{item}</li>)}</ul>{model.priceFrom && <><p>Стартовая цена базовой кухни, утверждена 11 октября 2026. Итоговая смета зависит от выбранных размеров и состава проекта.</p><strong>Отдельно рассчитываются:</strong><ul>{model.exclude.map((item) => <li key={item}>{item}</li>)}</ul></>}</details>
        <div className="catalog-detail-links">{[layout, style, material].filter(Boolean).map((item) => <Link key={item!.href} href={item!.href}>{item!.label}</Link>)}</div>
        <button className="catalog-primary" onClick={() => { onClose(); choose(model); }}>Рассчитать похожую кухню</button>
      </div>
    </div>
  </Modal>;
}

export function VisualCatalog() {
  const [filters, setFilters] = useState<Filters>(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [opened, setOpened] = useState<CatalogModel | null>(null);
  const [selected, setSelected] = useState<CatalogModel | null>(null);
  const [notice, setNotice] = useState("");
  const { updateContext } = useExploreContext();
  const form = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (value) {
        const restored = { ...initial };
        for (const key of Object.keys(initial) as (keyof Filters)[]) if (options[key].some((item) => item.id === value.filters?.[key])) restored[key] = value.filters[key];
        setFilters(restored);
        if (Array.isArray(value.saved)) setSaved(value.saved.filter((id: unknown) => catalogModels.some((model) => model.id === id)));
        setSelected(catalogModels.find((model) => model.id === value.selected) ?? null);
      }
    } catch { /* Подбор работает и при недоступном хранилище браузера. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { sessionStorage.setItem(storageKey, JSON.stringify({ filters, saved, selected: selected?.id })); } catch {} } }, [filters, saved, selected, ready]);
  const visible = useMemo(() => catalogModels.filter((model) => matches(model, filters) && (!onlySaved || saved.includes(model.id))), [filters, onlySaved, saved]);
  const compared = catalogModels.filter((model) => compare.includes(model.id));
  const active = Object.keys(filters).filter((key) => filters[key as keyof Filters] !== "all").length;
  function choose(model: CatalogModel) {
    setSelected(model);
    updateContext({ layout: layoutLabel(model), style: catalogStyles.find((style) => style.id === model.style)?.label, sourceRoute: "/catalog" }, `catalog-model:${model.id}`);
    window.requestAnimationFrame(() => form.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }
  function toggleCompare(id: string) {
    if (compare.includes(id)) { setCompare(compare.filter((item) => item !== id)); setNotice(""); }
    else if (compare.length < 3) { setCompare([...compare, id]); setNotice(""); }
    else setNotice("В сравнении уже три кухни. Уберите одну, чтобы добавить другую.");
  }
  const filterFields = <div className="catalog-filter-fields">{(Object.keys(initial) as (keyof Filters)[]).map((key) => <label key={key}><span>{labels[key]}</span><select aria-label={labels[key]} value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>{options[key].map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>)}</div>;
  const answers = useMemo(() => ({ model: selected?.id ?? "", modelName: selected?.name ?? "", style: selected?.style ?? "", layout: selected?.layout ?? "", dimensions: selected?.dimensions ?? "", room: filters.room, priceFrom: selected?.priceFrom ?? null }), [selected, filters.room]);
  return <>
    <section aria-labelledby="catalog-selection-title" className="catalog-selection" id="models">
      <div className="catalog-toolbar"><h2 id="catalog-selection-title">Модели кухонь</h2><div className="catalog-toolbar-actions"><button className="catalog-control catalog-filter-toggle" onClick={() => setShowFilters(true)}><SlidersHorizontal size={18} /> Фильтры{active ? ` · ${active}` : ""}</button><button className="catalog-control" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}><Heart size={18} /> Избранное{saved.length ? ` · ${saved.length}` : ""}</button></div></div>
      <div className="catalog-desktop-filters">{filterFields}</div>
      <div className="catalog-rooms" aria-label="Выбор помещения">{catalogRooms.map((room) => <button key={room.id} aria-pressed={filters.room === room.id} onClick={() => setFilters({ ...filters, room: filters.room === room.id ? "all" : room.id })}>{room.label}</button>)}</div>
      <div className="catalog-result"><span role="status">Показано: {visible.length} из {catalogModels.length}</span>{(active > 0 || onlySaved) && <button className="catalog-reset" onClick={() => { setFilters(initial); setOnlySaved(false); }}><RotateCcw size={16} /> Сбросить</button>}{compare.length > 0 && <button className="catalog-control" onClick={() => setShowCompare(true)}>Сравнить · {compare.length}</button>}</div>
      <p className="catalog-muted">Примеры дизайна, а не готовые комплекты со склада. Длина — размер основной стены; площадь помещения уточняется отдельно.</p>
      {visible.length === 0 ? <div className="catalog-empty"><h3>Такого сочетания пока нет</h3><p>Измените фильтры или отправьте параметры для индивидуального проекта.</p><button className="catalog-control" onClick={() => { setFilters(initial); setOnlySaved(false); }}>Показать все модели</button><a className="catalog-primary" href="#catalog-request">Отправить свои параметры</a></div> : <div className="catalog-grid">{visible.map((model) => <article className="catalog-card" id={`model-${model.id}`} key={model.id} data-testid={`catalog-model-${model.id}`}>
        <div className="catalog-card-photo"><button className="catalog-photo-open" aria-label={`Открыть модель: ${model.name}`} onClick={() => setOpened(model)}><Image src={model.images[0]} alt={`${model.name}, пример дизайна кухни`} fill  sizes="(max-width: 599px) calc(100vw - 32px), (max-width: 1023px) 46vw, 30vw" className="object-cover" /></button><button className="catalog-icon catalog-save" title={saved.includes(model.id) ? "Убрать из избранного" : "Сохранить модель"} aria-label={`${saved.includes(model.id) ? "Убрать из избранного" : "Сохранить"}: ${model.name}`} aria-pressed={saved.includes(model.id)} onClick={() => setSaved(saved.includes(model.id) ? saved.filter((id) => id !== model.id) : [...saved, model.id])}><Heart size={20} fill={saved.includes(model.id) ? "currentColor" : "none"} /></button></div>
        <div className="catalog-card-body"><p className="catalog-eyebrow">{layoutLabel(model)} · {catalogStyles.find((style) => style.id === model.style)?.label}</p><h3><button onClick={() => setOpened(model)}>{model.name}</button></h3><p className="catalog-dimensions">{model.dimensions}</p><p className="catalog-price">{money(model)}</p><div className="catalog-card-actions"><button className="catalog-primary" onClick={() => choose(model)}>Рассчитать похожую</button><button className="catalog-icon" title="Добавить в сравнение" aria-label={`Сравнить: ${model.name}`} aria-pressed={compare.includes(model.id)} onClick={() => toggleCompare(model.id)}>{compare.includes(model.id) ? <Check size={20} /> : <SlidersHorizontal size={20} />}</button></div><Link className="catalog-category-link" href={catalogLayouts.find((layout) => layout.id === model.layout)!.href}>Планировка: {layoutLabel(model).toLowerCase()} <ArrowRight size={15} /></Link></div>
      </article>)}</div>}
      <p role="status" className="catalog-notice">{notice}</p>
    </section>
    <section ref={form} id="catalog-request" className="catalog-request" aria-labelledby="catalog-request-title">
      <div><p className="catalog-eyebrow">Ваш вариант</p><h2 id="catalog-request-title">Рассчитать кухню по вашим размерам</h2>{selected ? <div className="catalog-chosen"><Image src={selected.images[0]} alt={selected.name} width={180} height={120} /><div><h3>{selected.name}</h3><p>{selected.dimensions}</p><button className="catalog-reset" onClick={() => setSelected(null)}>Убрать модель</button></div></div> : <p>Выберите понравившуюся модель или отправьте размеры для индивидуального проекта.</p>}<p className="catalog-muted">Уточним помещение, технику и комплектацию. Итоговая стоимость — после расчёта проекта.</p><Link href="/prices">Что входит в стоимость кухни</Link></div>
      <ContactForm source="catalog" sourcePage="/catalog" formType="catalog-model" formLocation="catalog-request" showCity showKitchenType showDimensions showComment showRoomFile defaultKitchenType={selected ? layoutLabel(selected) === "С полуостровом" ? "С островом" : layoutLabel(selected) : ""} defaultDimensions={selected?.dimensions ?? ""} defaultComment={selected ? `Модель каталога: ${selected.name}. ${selected.facade}. Размеры и материал требуется согласовать.` : ""} defaultAnswers={answers} submitLabel="Получить расчёт" />
    </section>
    {showFilters && <Modal title="Подобрать кухню" onClose={() => setShowFilters(false)}><div className="catalog-filter-dialog">{filterFields}<p className="catalog-muted">Размеры примеров помогают сузить выбор. Для угловой кухни нужны обе длины стен.</p><button className="catalog-primary" onClick={() => setShowFilters(false)}>Показать {visible.length} моделей</button><button className="catalog-reset" onClick={() => setFilters(initial)}><RotateCcw size={16} /> Сбросить фильтры</button></div></Modal>}
    {opened && <ModelDetails key={opened.id} model={opened} choose={choose} onClose={() => setOpened(null)} />}
    {showCompare && <Modal title="Сравнение кухонь" onClose={() => setShowCompare(false)}><div className="catalog-comparison">{compared.map((model) => <div key={model.id}><Image src={model.images[0]} alt={model.name} width={600} height={400} /><h3>{model.name}</h3><dl className="catalog-spec"><div><dt>Форма</dt><dd>{layoutLabel(model)}</dd></div><div><dt>Размеры</dt><dd>{model.dimensions}</dd></div><div><dt>Фасады</dt><dd>{model.facade}</dd></div><div><dt>Цена базовой кухни</dt><dd>{money(model)}</dd></div></dl><button className="catalog-primary" onClick={() => { setShowCompare(false); choose(model); }}>Выбрать эту кухню</button><button className="catalog-reset" onClick={() => setCompare(compare.filter((id) => id !== model.id))}>Убрать из сравнения</button></div>)}</div>{compared.length === 0 && <p className="catalog-empty">Добавьте модели для сравнения.</p>}</Modal>}
  </>;
}
