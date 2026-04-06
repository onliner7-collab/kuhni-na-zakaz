"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    q: "Планировка кухни",
    opts: ["Прямая", "Угловая", "П-образная", "С островом"],
    multi: false,
  },
  {
    q: "Площадь кухни",
    opts: ["До 6 м²", "6–10 м²", "10–15 м²", "Более 15 м²"],
    multi: false,
  },
  {
    q: "Материал фасадов",
    opts: ["МДФ плёнка", "Пластик", "Эмаль матовая", "Шпон / дерево"],
    multi: false,
  },
  {
    q: "Фурнитура",
    opts: ["Эконом (GTV)", "Стандарт (Hettich)", "Премиум (Blum)"],
    multi: false,
  },
  {
    q: "Встроенная техника",
    opts: ["Без техники", "Базовый комплект", "Полный комплект"],
    multi: false,
  },
];

type Answers = Record<number, string[]>;

function mapToCalcInput(answers: Answers) {
  const layout = ({ "Прямая": "straight", "Угловая": "corner", "П-образная": "u_shape", "С островом": "with_island" } as Record<string, string>)[answers[0]?.[0]] || "straight";
  const area = ({ "До 6 м²": 5, "6–10 м²": 8, "10–15 м²": 12, "Более 15 м²": 20 } as Record<string, number>)[answers[1]?.[0]] || 12;
  const material = ({ "МДФ плёнка": "mdf_film", "Пластик": "plastic_acrylic", "Эмаль матовая": "enamel_matte", "Шпон / дерево": "veneer" } as Record<string, string>)[answers[2]?.[0]] || "mdf_film";
  const hardware = ({ "Эконом (GTV)": "economy", "Стандарт (Hettich)": "standard", "Премиум (Blum)": "premium" } as Record<string, string>)[answers[3]?.[0]] || "economy";
  const tech = ({ "Без техники": "none", "Базовый комплект": "basic", "Полный комплект": "full" } as Record<string, string>)[answers[4]?.[0]] || "none";

  return {
    area,
    layout,
    material,
    hardware,
    tech,
    style: "modern",
    countertop: "postforming",
    priority: "balance",
  };
}

interface CalcResult {
  priceFrom: number;
  priceTo: number;
  priceCenter: number;
  factors?: { label: string; impact: string }[];
}

export function PriceQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cur = STEPS[step];
  const selected = answers[step] || [];

  function toggle(opt: string) {
    setAnswers({ ...answers, [step]: [opt] });
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      submitCalc();
    }
  }

  async function submitCalc() {
    setLoading(true);
    setError(null);
    try {
      const input = mapToCalcInput(answers);
      const res = await fetch("/kapi/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Ошибка расчёта");
      const data: CalcResult = await res.json();
      setResult(data);
      setDone(true);
    } catch {
      setError("Не удалось рассчитать. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
    setResult(null);
    setError(null);
  }

  if (done && result) {
    return (
      <div className="card-base p-8 text-center max-w-xl mx-auto">
        <h3 className="font-serif text-2xl font-semibold mb-2">Ориентировочная стоимость</h3>
        <p className="text-4xl font-bold text-primary my-4">
          от {result.priceFrom.toLocaleString("ru")} BYN
        </p>
        <p className="text-lg text-muted-foreground mb-2">
          до {result.priceTo.toLocaleString("ru")} BYN
        </p>
        <p className="text-muted-foreground text-sm mb-6">Точный расчёт — после замера и согласования. Это приблизительная оценка.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline">Пересчитать</Button>
          <a href="/contacts#form" className={buttonVariants()}>Заказать замер</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-8 max-w-xl mx-auto" data-testid="price-quiz">
      <div className="flex justify-between text-xs text-muted-foreground mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full mx-0.5 transition-colors", i <= step ? "bg-primary" : "bg-border")} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Вопрос {step + 1} из {STEPS.length}</p>
      <h3 className="font-serif text-xl font-semibold mb-4">{cur.q}</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cur.opts.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={cn(
              "p-3 rounded-lg border text-sm text-left transition-colors",
              selected.includes(opt)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            )}
            data-testid={`quiz-opt-${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-destructive text-sm mb-3">{error}</p>}
      <Button onClick={next} disabled={selected.length === 0 || loading} className="w-full">
        {loading ? "Считаем..." : step === STEPS.length - 1 ? "Рассчитать стоимость" : "Далее →"}
      </Button>
    </div>
  );
}
