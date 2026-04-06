"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

interface Option {
  id: number; key: string; label: string; description: string;
  emoji: string; tags: string[];
}
interface Step {
  id: number; key: string; question: string; hint: string;
  emoji: string; type: string; options: Option[];
}

export function ConfiguratorFlow() {
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch("/kapi/configurator/steps")
      .then(r => r.json())
      .then(data => { setSteps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const step = steps[current];
  const progress = steps.length ? ((current) / steps.length) * 100 : 0;
  const isLast = current === steps.length - 1;
  const answered = step ? !!answers[step.key] : false;

  const selectOption = useCallback((stepKey: string, optKey: string) => {
    setAnswers(a => ({ ...a, [stepKey]: optKey }));
    // Auto-advance after short delay
    if (!isLast) {
      setTimeout(() => {
        setAnimating(true);
        setTimeout(() => { setCurrent(c => c + 1); setAnimating(false); }, 200);
      }, 300);
    }
  }, [isLast]);

  const goBack = () => {
    if (current > 0) {
      setAnimating(true);
      setTimeout(() => { setCurrent(c => c - 1); setAnimating(false); }, 150);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      // Aggregate tags from all answers
      const allTags: string[] = [];
      for (const s of steps) {
        const chosen = answers[s.key];
        if (chosen) {
          const opt = s.options.find(o => o.key === chosen);
          if (opt) allTags.push(...opt.tags);
        }
      }
      const uniqueTags = [...new Set(allTags)];

      // Save result
      await fetch("/kapi/configurator/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, tags: uniqueTags }),
      });

      // Navigate to result page with tags
      const params = new URLSearchParams({ tags: uniqueTags.join(",") });
      // Also pass individual key answers for calculator pre-fill
      for (const [k, v] of Object.entries(answers)) params.set(k, v);
      router.push("/configure/result?" + params.toString());
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!steps.length) {
    return <p className="text-center text-muted-foreground py-10">Конфигуратор временно недоступен</p>;
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">Шаг {current + 1} из {steps.length}</span>
          <span>{Math.round(progress)}% готово</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex gap-1.5 mt-3 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i < current ? "w-2 h-2 bg-primary" :
              i === current ? "w-6 h-2 bg-primary" :
              "w-2 h-2 bg-gray-200"
            }`} />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className={`transition-all duration-200 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
        <div className="text-center mb-6">
          {step.emoji && <div className="text-4xl mb-3">{step.emoji}</div>}
          <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-2">{step.question}</h2>
          {step.hint && <p className="text-muted-foreground">{step.hint}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {step.options.map(opt => {
            const selected = answers[step.key] === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => selectOption(step.key, opt.key)}
                className={`group flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                  selected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-gray-200 hover:border-primary/40 hover:bg-gray-50/80"
                }`}
              >
                {opt.emoji && (
                  <span className="text-2xl shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    {opt.emoji}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm leading-tight ${selected ? "text-primary" : "text-gray-800"}`}>
                    {opt.label}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.description}</p>
                  )}
                </div>
                <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 transition-all ${
                  selected ? "text-primary scale-100" : "text-transparent scale-75"
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={goBack}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="flex items-center gap-3">
          {!answered && current > 0 && (
            <button
              type="button"
              onClick={() => {
                setAnimating(true);
                setTimeout(() => { setCurrent(c => c + 1); setAnimating(false); }, 150);
              }}
              className="text-sm text-muted-foreground hover:text-gray-600 transition-colors"
            >
              Пропустить
            </button>
          )}

          {isLast ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={!answered || submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Подбираем...</>
              ) : (
                <>Показать мою кухню <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (answered || current > 0) {
                  setAnimating(true);
                  setTimeout(() => { setCurrent(c => c + 1); setAnimating(false); }, 150);
                }
              }}
              disabled={!answered}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              Далее <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
