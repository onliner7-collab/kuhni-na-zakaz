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
    q: "Дополнительно",
    opts: ["Встроенная техника", "Фасады до потолка", "Барная стойка", "Ничего из перечисленного"],
    multi: true,
  },
];

const PRICES: Record<string, number> = {
  "Прямая": 1200, "Угловая": 1800, "П-образная": 3500, "С островом": 4500,
  "До 6 м²": 0, "6–10 м²": 500, "10–15 м²": 1200, "Более 15 м²": 2500,
  "МДФ плёнка": 0, "Пластик": 300, "Эмаль матовая": 800, "Шпон / дерево": 1500,
  "Эконом (GTV)": 0, "Стандарт (Hettich)": 400, "Премиум (Blum)": 900,
  "Встроенная техника": 600, "Фасады до потолка": 400, "Барная стойка": 500,
};

export function PriceQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [done, setDone] = useState(false);

  const cur = STEPS[step];
  const selected = answers[step] || [];

  function toggle(opt: string) {
    if (cur.multi) {
      const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
      setAnswers({ ...answers, [step]: next });
    } else {
      setAnswers({ ...answers, [step]: [opt] });
    }
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function calcPrice() {
    let total = 0;
    Object.values(answers).forEach((opts) => {
      opts.forEach((o) => { total += PRICES[o] || 0; });
    });
    return total;
  }

  if (done) {
    const price = calcPrice();
    return (
      <div className="card-base p-8 text-center max-w-xl mx-auto">
        <h3 className="font-serif text-2xl font-semibold mb-2">Ориентировочная стоимость</h3>
        <p className="text-4xl font-bold text-primary my-4">от {price.toLocaleString("ru")} BYN</p>
        <p className="text-muted-foreground text-sm mb-6">Точный расчёт — после замера и согласования. Это приблизительная оценка.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setStep(0); setAnswers({}); setDone(false); }} variant="outline">Пересчитать</Button>
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
      {cur.multi && <p className="text-xs text-muted-foreground mb-3">Можно выбрать несколько</p>}
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
      <Button onClick={next} disabled={selected.length === 0} className="w-full">
        {step === STEPS.length - 1 ? "Рассчитать стоимость" : "Далее →"}
      </Button>
    </div>
  );
}
