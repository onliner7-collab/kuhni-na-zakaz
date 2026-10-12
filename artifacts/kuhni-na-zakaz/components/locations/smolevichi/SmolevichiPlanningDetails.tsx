"use client";

import { useState } from "react";
import Link from "@/components/navigation/Link";
import { smolevichiPlanningDetails } from "@/data/smolevichi-planning";

export function SmolevichiPlanningDetails() {
  const [opened, setOpened] = useState(false);
  return <details id="smolevichi-planning-details" onToggle={event => setOpened(event.currentTarget.open)} className="group mt-8 rounded-2xl border border-stone-300 bg-stone-50">
    <summary className="cursor-pointer rounded-2xl px-5 py-5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:px-7">
      Кухня до потолка и встроенная техника
      <span className="mt-1 block text-sm font-normal leading-6 text-stone-600">Два решения для хранения и удобства — посмотреть фото и детали</span>
    </summary>
    <div className="border-t border-stone-200 p-5 md:p-7">
      <p className="max-w-3xl leading-7 text-stone-700">Эти решения можно добавить к разным планировкам. Сначала проверяем высоту помещения и требования техники, затем определяем размеры шкафов.</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">{smolevichiPlanningDetails.map(item => <article key={item.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="aspect-[3/2] bg-stone-200">{opened ? <img src={item.image} srcSet={`${item.image.replace(".webp", "-mobile.webp")} 720w, ${item.image} 1200w`} sizes="(max-width: 767px) 100vw, 50vw" alt={item.alt} width={1200} height={800} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}</div>
        <div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Идея дизайна</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-700">{item.text}</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">{item.checks.map(check => <li key={check}>{check}</li>)}</ul><Link href={item.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{item.link} →</Link></div>
      </article>)}</div>
      <Link href="/catalog" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">Все идеи кухонь →</Link>
    </div>
  </details>;
}
