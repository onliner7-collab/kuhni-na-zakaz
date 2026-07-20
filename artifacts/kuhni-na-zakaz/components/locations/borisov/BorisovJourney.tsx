"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useExploreContext } from "@/components/exploration/ExploreContext";

const steps = [
  { id: "request", label: "Заявка", title: "Описываем задачу", text: "Оставьте город, контакт и то, что уже известно о помещении. До заявки точные условия не фиксируются.", image: "borisov-process-request", alt: "Эскиз кухни на столе как иллюстрация первого обращения" },
  { id: "estimate", label: "Предварительный расчёт", title: "Собираем исходные данные", text: "Фото, примерные размеры и список техники помогают обсудить направление. Это не окончательная смета.", image: "borisov-process-estimate", alt: "План помещения и список техники для предварительного расчёта кухни" },
  { id: "measure", label: "Замер", title: "Проверяем помещение", text: "Вопрос о возможности и формате замера решается после заявки по конкретному адресу и готовности объекта.", image: "borisov-process-measure", alt: "Измерительные инструменты и образцы в помещении кухни" },
  { id: "project", label: "Проект", title: "Согласуем планировку", text: "Уточняются размеры, фасады, столешница, техника и выбранные механизмы. Состав проекта зависит от задачи.", image: "borisov-process-project", alt: "Чертежи кухни и образцы материалов на столе" },
  { id: "production", label: "Производство", title: "Передаём согласованный заказ", text: "Запуск возможен только после согласования проекта и комплектации. Сроки на странице не обещаются.", image: "borisov-process-production", alt: "Подготовленные детали кухни как иллюстрация производственного этапа" },
  { id: "delivery", label: "Доставка", title: "Согласуем логистику", text: "Адрес, объём, подъём и готовность помещения влияют на способ доставки. Конкретные условия уточняются отдельно.", image: "borisov-process-delivery", alt: "Упакованные детали кухни у дверного проёма перед доставкой" },
  { id: "installation", label: "Монтаж", title: "Завершаем установку", text: "Формат монтажа и готовность помещения обсуждаются по конкретному заказу; универсальных сроков нет.", image: "borisov-process-installation", alt: "Выравнивание кухонного фасада как иллюстрация монтажа" },
] as const;

const choices = [
  { key: "layout", label: "Планировка", values: ["Прямая", "Угловая", "П-образная"] },
  { key: "style", label: "Стиль", values: ["Современный", "Минимализм", "Неоклассика"] },
  { key: "materials", label: "Фасад", values: ["МДФ", "ЛДСП", "Пока не знаю"] },
] as const;

export function BorisovJourney() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { updateContext } = useExploreContext();
  const current = steps[active];
  const summary = useMemo(() => Object.values(selected).filter(Boolean).join(" · ") || "Параметры пока не выбраны", [selected]);

  function choose(key: string, value: string) {
    setSelected((previous) => ({ ...previous, [key]: value }));
    if (key === "materials") updateContext({ materials: [value] }, "material_selected");
    else updateContext({ [key]: value } as never, `${key}_selected`);
    window.dispatchEvent(new CustomEvent("borisov-journey-answers", { detail: { ...selected, [key]: value } }));
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <section id="process" className="scroll-mt-24" aria-labelledby="borisov-process-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Путь заказа</p>
        <h2 id="borisov-process-title" className="mt-2 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">Сначала вопрос, затем подтверждённые условия</h2>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">Ниже — порядок обсуждения заказа. Локальные адреса, сроки, зона выезда и проекты не считаются подтверждёнными без отдельного источника.</p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Этапы заказа кухни">
          {steps.map((step, index) => (
            <li key={step.id}>
              <button type="button" aria-pressed={index === active} onClick={() => setActive(index)} className={`min-h-12 w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 motion-reduce:transition-none ${index === active ? "border-emerald-900 bg-emerald-950 text-white" : "border-stone-200 bg-white hover:border-stone-400"}`}>
                <span className="mr-2 opacity-70">0{index + 1}</span>{step.label}
                <span className={`mt-2 block text-xs font-normal leading-5 ${index === active ? "text-emerald-50/80" : "text-stone-600"}`}>{step.text}</span>
              </button>
            </li>
          ))}
        </ol>

        <article id={`borisov-step-${current.id}`} className="mt-5 grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white lg:grid-cols-[1.15fr_.85fr]" aria-live="polite">
          <figure className="bg-stone-100"><img key={current.image} src={`/media/pilots/borisov/webp/${current.image}.webp`} alt={current.alt} width="1200" height="800" loading="lazy" decoding="async" className="aspect-[3/2] h-auto w-full object-cover" /><figcaption className="px-5 py-3 text-sm text-stone-600">AI‑иллюстрация этапа заказа, не фотография реального объекта.</figcaption></figure>
          <div className="p-6 md:p-9"><p className="text-sm font-bold text-emerald-800">Шаг {active + 1} из {steps.length}</p>
          <h3 className="mt-2 text-2xl font-bold">{current.title}</h3>
          <p className="mt-3 max-w-2xl leading-7 text-stone-600">{current.text}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => setActive((value) => (value + steps.length - 1) % steps.length)} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-stone-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Предыдущий этап"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
            <button type="button" onClick={() => setActive((value) => (value + 1) % steps.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-950 px-5 font-bold text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Следующий этап">Следующий этап <ChevronRight className="h-4 w-4" aria-hidden /></button>
          </div></div>
        </article>
      </section>

      <section id="types" className="scroll-mt-24 rounded-[2rem] bg-emerald-950 p-5 text-white md:p-9" aria-labelledby="borisov-choice-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Уточнить вопрос</p>
        <h2 id="borisov-choice-title" className="mt-2 text-3xl font-bold md:text-4xl">Выберите то, что уже известно</h2>
        <p className="mt-3 max-w-3xl leading-7 text-emerald-50/75">Это черновик для заявки, не обещание совместимости, цены или результата.</p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {choices.map((group) => <fieldset key={group.key}><legend className="mb-2 font-bold">{group.label}</legend><div className="flex flex-wrap gap-2">{group.values.map((value) => { const isSelected = selected[group.key] === value; return <button key={value} type="button" aria-pressed={isSelected} onClick={() => choose(group.key, value)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-300 ${isSelected ? "border-emerald-300 bg-emerald-300 text-emerald-950" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`}>{isSelected && <Check className="mr-1 inline h-4 w-4" aria-hidden />}{value}</button>; })}</div></fieldset>)}
        </div>
        <div className="mt-7 rounded-2xl bg-white p-5 text-stone-950"><h3 className="font-bold">Контекст заявки</h3><p className="mt-2 text-sm leading-6 text-stone-600" aria-live="polite">{summary}</p><a href="#measure" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-950 px-5 font-bold text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-700">Перейти к заявке <ArrowRight className="h-4 w-4" aria-hidden /></a></div>
      </section>
    </div>
  );
}
