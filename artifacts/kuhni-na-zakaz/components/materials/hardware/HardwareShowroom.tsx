"use client";

import { useMemo, useState } from "react";
import { Check, CircleHelp, CornerDownRight, DoorOpen, PanelTopOpen, SlidersHorizontal } from "lucide-react";

const MEDIA_BASE = "/media/pilots/hardware";

const mechanisms = [
  {
    id: "hinge",
    label: "Петля",
    icon: DoorOpen,
    stem: "hardware-hotspots-hinge-landscape",
    alt: "Кухонная петля внутри открытого шкафа",
    title: "Петля отвечает за движение фасада",
    text: "При выборе важны тип фасада, расположение шкафа и сценарий открывания. Доводчик обсуждается отдельно для часто используемых модулей.",
  },
  {
    id: "runner",
    label: "Направляющая",
    icon: SlidersHorizontal,
    stem: "hardware-hotspots-runner-landscape",
    alt: "Направляющая полностью открытого кухонного ящика",
    title: "Направляющая определяет доступ к ящику",
    text: "Разные типы направляющих дают разный доступ к глубине. Решение подбирают под назначение ящика и выбранную комплектацию.",
  },
  {
    id: "lift",
    label: "Подъёмник",
    icon: PanelTopOpen,
    stem: "hardware-hotspots-lift-landscape",
    alt: "Подъёмный механизм верхнего кухонного шкафа",
    title: "Подъёмник освобождает зону перед верхним шкафом",
    text: "Он уместен, когда распашной фасад мешает рабочей зоне. Конкретный механизм выбирают после размеров и материала фасада.",
  },
  {
    id: "corner",
    label: "Угол",
    icon: CornerDownRight,
    stem: "hardware-hotspots-corner-landscape",
    alt: "Выдвижной механизм в угловом кухонном шкафу",
    title: "Угловая система выводит хранение к проёму",
    text: "Простая полка, карусель и связанная выдвижная система по-разному используют объём и влияют на смету.",
  },
] as const;

const levels = [
  { id: "calm", title: "Спокойная", text: "Базовые механизмы, специальные системы только там, где без них неудобно." },
  { id: "daily", title: "Ежедневная", text: "Доводчики на частых фасадах, удобные основные ящики и продуманная внутренняя организация." },
  { id: "comfort", title: "Максимум удобства", text: "Больше полного выдвижения, подъёмников и систем хранения под конкретные привычки." },
] as const;

function HardwarePicture({ stem, alt }: { stem: string; alt: string }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${MEDIA_BASE}/avif/${stem}.avif`} />
      <img src={`${MEDIA_BASE}/webp/${stem}.webp`} alt={alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
    </picture>
  );
}

export function HardwareShowroom() {
  const [mechanismId, setMechanismId] = useState<(typeof mechanisms)[number]["id"]>("hinge");
  const [level, setLevel] = useState<(typeof levels)[number]["id"]>("daily");
  const [answers, setAnswers] = useState({ drawers: true, uppers: false, corner: false });
  const active = mechanisms.find((item) => item.id === mechanismId) ?? mechanisms[0];
  const ActiveIcon = active.icon;
  const recommendation = useMemo(() => {
    const selected = [answers.drawers && "полное выдвижение основных ящиков", answers.uppers && "подъёмники для верхних шкафов", answers.corner && "система доступа в угол"].filter(Boolean);
    return selected.length > 0 ? selected.join(", ") : "базовые петли и направляющие без специальных систем";
  }, [answers]);

  return (
    <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
      <section id="mechanisms" className="scroll-mt-24" aria-labelledby="hardware-stand-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">Виртуальный шкаф</p>
        <h2 id="hardware-stand-title" className="mt-2 max-w-3xl font-serif text-3xl font-bold md:text-4xl">Нажмите на механизм и разберите его роль</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <figure className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950">
            <HardwarePicture stem={active.stem} alt={active.alt} />
            <figcaption className="flex items-center gap-3 bg-slate-950 px-5 py-4 text-sm text-white"><ActiveIcon className="h-5 w-5 text-sky-300" aria-hidden />AI-иллюстрация механизма без бренда и неподтверждённых характеристик.</figcaption>
          </figure>
          <div className="space-y-3">
            {mechanisms.map((item) => {
              const Icon = item.icon;
              const selected = item.id === mechanismId;
              return <button key={item.id} type="button" onClick={() => setMechanismId(item.id)} aria-pressed={selected} className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${selected ? "border-blue-700 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-400"}`}><span className="flex items-center gap-3 font-bold"><span className={`grid h-11 w-11 place-items-center rounded-full ${selected ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-700"}`}><Icon className="h-5 w-5" aria-hidden /></span>{item.label}</span>{selected && <span className="mt-3 block"><strong className="block text-lg">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-slate-600">{item.text}</span></span>}</button>;
            })}
          </div>
        </div>
      </section>

      <section id="compare" className="scroll-mt-24 rounded-[2rem] bg-slate-950 p-5 text-white md:p-9" aria-labelledby="hardware-compare-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-300">Технический разрез</p>
        <h2 id="hardware-compare-title" className="mt-2 font-serif text-3xl font-bold md:text-4xl">Частичное или полное выдвижение</h2>
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <figure className="overflow-hidden rounded-[1.5rem] bg-white"><HardwarePicture stem="hardware-compare-partial-full-drawer-landscape" alt="Сравнение частичного и полного выдвижения кухонного ящика" /><figcaption className="px-5 py-3 text-sm text-slate-600">AI-иллюстрация: слева ограниченный доступ к глубине, справа ящик выдвинут полностью.</figcaption></figure>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><article className="rounded-2xl border border-white/15 bg-white/5 p-5"><h3 className="font-bold">Частичное выдвижение</h3><p className="mt-2 text-sm leading-6 text-slate-300">Подходит для спокойных сценариев, когда содержимое у задней стенки используют редко.</p></article><article className="rounded-2xl border border-sky-300/30 bg-sky-300/10 p-5"><h3 className="font-bold">Полное выдвижение</h3><p className="mt-2 text-sm leading-6 text-slate-200">Открывает обзор всей глубины и полезно для основных ящиков с ежедневным доступом.</p></article></div>
        </div>
      </section>

      <section id="package" className="scroll-mt-24" aria-labelledby="hardware-package-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">Уровень комплектации</p>
        <h2 id="hardware-package-title" className="mt-2 font-serif text-3xl font-bold md:text-4xl">Где удобство действительно заметно</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{levels.map((item) => <button key={item.id} type="button" onClick={() => setLevel(item.id)} aria-pressed={level === item.id} className={`min-h-40 rounded-2xl border p-5 text-left ${level === item.id ? "border-blue-800 bg-blue-50 shadow-sm" : "border-slate-200 bg-white"}`}><span className="flex items-center gap-2 text-lg font-bold">{level === item.id && <Check className="h-5 w-5 text-blue-800" aria-hidden />}{item.title}</span><span className="mt-3 block text-sm leading-6 text-slate-600">{item.text}</span></button>)}</div>
        <div className="mt-6 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5"><h3 className="font-bold">Где нежелательно экономить вслепую</h3><p className="mt-2 leading-7 text-slate-700">Сначала обсуждают петли часто используемых фасадов, направляющие основных ящиков и крепёж. Экономию безопаснее искать в количестве специальных механизмов, а не в неподтверждённых обещаниях бренда.</p></div>
      </section>

      <section id="pick" className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-5 md:p-9" aria-labelledby="hardware-pick-title">
        <div className="flex items-center gap-3"><CircleHelp className="h-7 w-7 text-blue-800" aria-hidden /><h2 id="hardware-pick-title" className="font-serif text-3xl font-bold">Мини-подбор комплектации</h2></div>
        <p className="mt-3 leading-7 text-slate-600">Отметьте только те сценарии, которые важны каждый день.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{[
          { key: "drawers" as const, label: "Нужен полный доступ к основным ящикам" },
          { key: "uppers" as const, label: "Распашные верхние фасады мешают" },
          { key: "corner" as const, label: "Нужно регулярно пользоваться дальним углом" },
        ].map((item) => <button key={item.key} type="button" onClick={() => setAnswers((current) => ({ ...current, [item.key]: !current[item.key] }))} aria-pressed={answers[item.key]} className={`min-h-24 rounded-2xl border p-4 text-left font-semibold ${answers[item.key] ? "border-blue-800 bg-blue-50" : "border-slate-200"}`}>{answers[item.key] && <Check className="mr-2 inline h-5 w-5 text-blue-800" aria-hidden />}{item.label}</button>)}</div>
        <div className="mt-6 rounded-2xl bg-slate-100 p-5" aria-live="polite"><p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-800">Обсудить в первую очередь</p><p className="mt-2 text-lg font-bold">{recommendation}</p><p className="mt-2 text-sm leading-6 text-slate-600">Это ориентир для разговора, а не техническая спецификация. Совместимость подтверждается после проекта.</p></div>
      </section>
    </div>
  );
}
