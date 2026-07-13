"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";

const MEDIA_BASE = "/media/pilots/borisov";

const journey = [
  {
    id: "design",
    label: "Проект",
    title: "Собираем задачу и планировку",
    text: "Фото помещения, примерные размеры и список техники помогают подготовить первый вариант до точного замера.",
    stem: "borisov-process-design-landscape",
    alt: "Проектирование кухни по размерам помещения",
    caption: "Иллюстрация процесса: проектирование.",
  },
  {
    id: "measure",
    label: "Замер",
    title: "Проверяем помещение",
    text: "На объекте уточняем стены, углы, воду, электрику, вентиляцию, технику и условия заноса.",
    stem: "borisov-process-measure-landscape",
    alt: "Замер помещения перед проектированием кухни",
    caption: "Иллюстрация процесса: замер помещения.",
  },
  {
    id: "assembly",
    label: "Производство",
    title: "Готовим детали и собираем корпуса",
    text: "После согласования проекта и комплектации заказ передаётся в производство в Борисове.",
    stem: "borisov-process-assembly-landscape",
    alt: "Сборка корпуса кухонного шкафа",
    caption: "Иллюстрация процесса производства, не фотография реального цеха.",
  },
  {
    id: "installation",
    label: "Монтаж",
    title: "Доставляем и устанавливаем",
    text: "Маршрут, занос и монтаж согласуются по адресу и готовности помещения; после установки регулируется фурнитура.",
    stem: "borisov-process-installation-landscape",
    alt: "Монтаж кухонных шкафов в помещении",
    caption: "Иллюстрация процесса: монтаж кухни.",
  },
] as const;

const optionGroups = [
  { id: "shape", label: "Форма", options: ["Прямая", "Угловая", "П-образная"] },
  { id: "style", label: "Стиль", options: ["Современный", "Минимализм", "Неоклассика"] },
  { id: "facade", label: "Фасад", options: ["Светлый", "Древесный", "Графитовый"] },
  { id: "worktop", label: "Столешница", options: ["Светлый камень", "Тёплая", "Контрастная"] },
  { id: "hardware", label: "Фурнитура", options: ["Базовая", "С доводчиками", "Системы хранения"] },
] as const;

type Selections = Record<(typeof optionGroups)[number]["id"], string>;

const initialSelections = Object.fromEntries(optionGroups.map((group) => [group.id, group.options[0]])) as Selections;

function ProcessPicture({ item }: { item: (typeof journey)[number] }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${MEDIA_BASE}/avif/${item.stem}.avif`} />
      <img
        src={`${MEDIA_BASE}/webp/${item.stem}.webp`}
        alt={item.alt}
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
        className="aspect-[3/2] w-full object-cover"
      />
    </picture>
  );
}

export function BorisovJourney() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>(initialSelections);
  const activeStep = journey[step];
  const summary = useMemo(
    () => optionGroups.map((group) => selections[group.id]).join(" · "),
    [selections],
  );

  return (
    <div className="space-y-16 md:space-y-24">
      <section id="process" className="scroll-mt-24" aria-labelledby="borisov-process-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">Путь заказа</p>
        <h2 id="borisov-process-title" className="mt-2 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          От первого сообщения до установленной кухни
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-4" role="tablist" aria-label="Этапы заказа кухни">
          {journey.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === step}
              onClick={() => setStep(index)}
              className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${index === step ? "border-emerald-900 bg-emerald-950 text-white" : "border-stone-200 bg-white hover:border-stone-400"}`}
            >
              <span className={`mr-2 ${index === step ? "text-emerald-200" : "text-emerald-800"}`}>0{index + 1}</span>{item.label}
            </button>
          ))}
        </div>
        <article className="mt-5 grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white lg:grid-cols-[1.2fr_.8fr]">
          <figure className="bg-stone-100">
            <ProcessPicture item={activeStep} />
            <figcaption className="px-5 py-3 text-sm text-stone-600">{activeStep.caption}</figcaption>
          </figure>
          <div className="flex flex-col justify-center p-6 md:p-9">
            <p className="text-sm font-bold text-emerald-800">Шаг {step + 1} из {journey.length}</p>
            <h3 className="mt-2 text-2xl font-bold">{activeStep.title}</h3>
            <p className="mt-3 leading-7 text-stone-600">{activeStep.text}</p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setStep((step - 1 + journey.length) % journey.length)} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-stone-300" aria-label="Предыдущий этап"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
              <button type="button" onClick={() => setStep((step + 1) % journey.length)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-950 px-5 font-bold text-white" aria-label="Следующий этап">Дальше <ChevronRight className="h-5 w-5" aria-hidden /></button>
            </div>
          </div>
        </article>
      </section>

      <section id="types" className="scroll-mt-24 rounded-[2rem] bg-emerald-950 p-5 text-white md:p-9" aria-labelledby="borisov-choice-title">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Черновик выбора</p>
        <h2 id="borisov-choice-title" className="mt-2 text-3xl font-bold md:text-4xl">Соберите направление будущей кухни</h2>
        <p className="mt-3 max-w-3xl leading-7 text-emerald-50/75">Это не технический проект и не расчёт цены. Выбор помогает сформулировать задачу перед замером.</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <div className="space-y-5">
            {optionGroups.map((group) => (
              <fieldset key={group.id}>
                <legend className="mb-2 font-bold">{group.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = selections[group.id] === option;
                    return <button key={option} type="button" onClick={() => setSelections((current) => ({ ...current, [group.id]: option }))} aria-pressed={active} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${active ? "border-emerald-300 bg-emerald-300 text-emerald-950" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}`}>{active && <Check className="mr-1 inline h-4 w-4" aria-hidden />}{option}</button>;
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="rounded-[1.5rem] bg-white p-5 text-stone-950">
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-2xl bg-stone-100" aria-hidden>
              <div className="absolute inset-x-[9%] bottom-[18%] h-[36%] rounded bg-stone-300" />
              <div className="absolute inset-x-[14%] bottom-[54%] h-[26%] rounded bg-[#d8cbb8]" />
              <div className="absolute bottom-[18%] left-[9%] h-[62%] w-[15%] rounded bg-emerald-800" />
              <div className="absolute inset-x-[9%] bottom-[52%] h-3 rounded bg-stone-100 shadow" />
            </div>
            <h3 className="mt-5 text-xl font-bold">Ваш ориентир</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600" aria-live="polite">{summary}</p>
            <a href="#measure" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-950 px-5 font-bold text-white">Передать выбор специалисту <ArrowRight className="h-4 w-4" aria-hidden /></a>
          </div>
        </div>
      </section>
    </div>
  );
}
