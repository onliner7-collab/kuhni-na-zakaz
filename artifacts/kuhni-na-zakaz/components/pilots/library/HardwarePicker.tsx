"use client";

import { useMemo, useState } from "react";

const questions = [
  { id: "frequency", legend: "Как часто используется кухня?", options: ["Несколько раз в неделю", "Каждый день", "Интенсивно каждый день"] },
  { id: "storage", legend: "Что важнее в хранении?", options: ["Простота", "Удобный доступ", "Больше специализированных зон"] },
  { id: "priority", legend: "Что обсудить в первую очередь?", options: ["Петли", "Основные ящики", "Подъёмники и узкие модули"] },
] as const;

export function HardwarePicker() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const result = useMemo(() => Object.values(answers).length === questions.length ? `Черновик для обсуждения: ${Object.values(answers).join("; ")}.` : "Ответьте на три вопроса — итог станет кратким черновиком для проектировщика.", [answers]);
  return (
    <section data-component="HardwarePicker" className="rounded-3xl bg-slate-100 p-4 sm:p-6">
      <h2 className="text-2xl font-black">Подобрать сценарий фурнитуры</h2>
      <p className="mt-2 text-slate-600">Результат не является спецификацией, сметой или обещанием характеристик.</p>
      <div className="mt-5 grid gap-5">{questions.map((question) => <fieldset key={question.id}><legend className="font-black">{question.legend}</legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{question.options.map((option) => <label key={option} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border bg-white p-3"><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} /><span>{option}</span></label>)}</div></fieldset>)}</div>
      <p role="status" aria-live="polite" className="mt-5 rounded-xl bg-white p-4 font-semibold">{result}</p>
    </section>
  );
}
