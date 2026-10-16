"use client";
import { useEffect, useState } from "react";
import { MDF_PHOTOS } from "@/data/mdf-gallery";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { MaterialDetailsLink, materialButton, useMaterials } from "./MaterialsSelection";

const photos = MDF_PHOTOS;
export function MdfPhotoGallery() {
  const { state, updateView, ready } = useMaterials();
  const [isOpen, setOpen] = useState(false);
  const filters = state.mdfGallery;
  function update(patch: Partial<typeof filters>) { updateView({ mdfGallery: { ...filters, ...patch } }); }
  useEffect(() => {
    if (ready && !isOpen && filters.activePhoto && location.hash === "#gallery") document.getElementById(filters.activePhoto)?.scrollIntoView({ block: "center" });
  }, [ready, isOpen, filters.activePhoto]);
  const visible = photos.filter(p => (!filters.material || p.material === filters.material) && (!filters.layout || p.layout === filters.layout));
  const active = visible.findIndex(p => p.id === filters.activePhoto);
  function open(index: number) {
    const p = visible[index];
    if (p) { updateView({ mdfGallery: { ...filters, activePhoto: p.id, limit: Math.max(filters.limit, index + 1) }, recentViews: [p.id, ...state.recentViews.filter(v => v !== p.id)].slice(0, 10) }); setOpen(true); }
  }
  return <section id="gallery" className="mt-12 scroll-mt-24" aria-labelledby="mdf-gallery-title">
    <h2 id="mdf-gallery-title" className="text-3xl font-bold">Примеры кухонь и фасадов МДФ</h2>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">Визуальные примеры, созданные ИИ, показывают идею цвета, профиля и планировки. Это не фотографии выполненных нами заказов. Точное покрытие и доступность подтверждаются по образцу.</p>
    <div className="mt-5 flex flex-wrap items-end gap-4">
      <label className="grid min-w-0 gap-2 text-sm font-semibold">Покрытие<select disabled={!ready} className="min-h-11 max-w-full rounded-xl border border-stone-300 bg-white p-3" value={filters.material} onChange={e => update({ material: e.target.value, limit: 6, activePhoto: null })}><option value="">Все покрытия МДФ</option><option value="mdf-film">МДФ в плёнке</option><option value="mdf-enamel">МДФ с эмалью</option></select></label>
      <label className="grid min-w-0 gap-2 text-sm font-semibold">Планировка и ракурс<select disabled={!ready} className="min-h-11 max-w-full rounded-xl border border-stone-300 bg-white p-3" value={filters.layout} onChange={e=>update({layout:e.target.value,limit:6,activePhoto:null})}><option value="">Все ракурсы</option>{Array.from(new Set(photos.map(p=>p.layout))).map(v=><option key={v}>{v}</option>)}</select></label>
      <button disabled={!ready} className={materialButton} onClick={()=>update({material:"",layout:"",limit:6,activePhoto:null})}>Сбросить фильтры галереи</button>
    </div>
    <p role="status" className="mt-3 text-sm text-stone-600">Найдено примеров: {visible.length}</p>
    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.slice(0,filters.limit).map((p,index)=><figure id={p.id} key={p.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-200 bg-white"><button disabled={!ready} className="block w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-violet-700" aria-label={`Увеличить: ${p.alt}`} onClick={()=>open(index)}><img src={p.src} alt={p.alt} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover"/></button><figcaption className="p-4 text-sm leading-6"><p>{p.caption}</p><MaterialDetailsLink id={p.material}>Уточнить исполнение →</MaterialDetailsLink></figcaption></figure>)}</div>
    {!visible.length && <p className="mt-4 rounded-xl bg-white p-5">В этой подборке нет примеров с выбранными фильтрами. Сбросьте фильтры, чтобы увидеть кухни МДФ.</p>}
    {visible.length>filters.limit && <button className={`${materialButton} mt-5`} onClick={()=>update({limit:filters.limit+6})}>Показать ещё ракурсы и детали</button>}
    <ImageLightbox images={visible} open={isOpen && active>=0} currentIndex={Math.max(0,active)} onOpenChange={setOpen} onIndexChange={open} label="Примеры фасадов МДФ" footer={active>=0?<MaterialDetailsLink id={visible[active].material}>Подробнее об исполнении →</MaterialDetailsLink>:undefined}/>
  </section>;
}
