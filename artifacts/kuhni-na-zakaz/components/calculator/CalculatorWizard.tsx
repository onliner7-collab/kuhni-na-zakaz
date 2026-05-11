"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Phone, Calculator } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

interface PriceResult {
  priceFrom: number;
  priceTo: number;
  priceCenter: number;
  area: number;
  factors: { label: string; impact: "neutral" | "positive" | "warning" }[];
}

interface Step {
  id: string;
  title: string;
  subtitle?: string;
  type: "choice" | "slider";
  options?: { key: string; label: string; desc?: string; emoji?: string }[];
  sliderMin?: number; sliderMax?: number; sliderDefault?: number; sliderUnit?: string;
}

const STEPS: Step[] = [
  {
    id: "layout", title: "Форма кухни", subtitle: "Как расположены шкафы?",
    type: "choice",
    options: [
      { key: "straight", label: "Прямая", desc: "Один ряд шкафов вдоль стены", emoji: "▬" },
      { key: "corner", label: "Угловая (Г-образная)", desc: "Два ряда, соединённых в углу", emoji: "⌐" },
      { key: "u_shape", label: "П-образная", desc: "Три стороны — максимум хранения", emoji: "⊓" },
      { key: "with_island", label: "С островом", desc: "Свободностоящий остров в центре", emoji: "▣" },
    ],
  },
  {
    id: "area", title: "Размер кухни", subtitle: "Укажите длину гарнитура в погонных метрах",
    type: "slider", sliderMin: 1, sliderMax: 8, sliderDefault: 3, sliderUnit: "п.м",
  },
  {
    id: "style", title: "Стиль кухни", subtitle: "Какой стиль вам близок?",
    type: "choice",
    options: [
      { key: "modern", label: "Современный", desc: "Чистые линии, минимум декора", emoji: "◻" },
      { key: "scandinavian", label: "Скандинавский", desc: "Светлые тона, дерево, уют", emoji: "🌿" },
      { key: "minimalist", label: "Минимализм", desc: "Скрытые ручки, монохром", emoji: "▫" },
      { key: "loft", label: "Лофт", desc: "Фактуры, металл, открытые полки", emoji: "🔩" },
      { key: "classic", label: "Классический", desc: "Фрезеровка, патина, карнизы", emoji: "🏛" },
      { key: "provence", label: "Прованс", desc: "Состаренные фасады, пастель", emoji: "🌸" },
    ],
  },
  {
    id: "material", title: "Материал фасадов", subtitle: "Основной материал кухонных фасадов",
    type: "choice",
    options: [
      { key: "mdf_film", label: "МДФ плёнка ПВХ", desc: "Доступно, практично, много цветов", emoji: "💧" },
      { key: "plastic_acrylic", label: "Пластик / акрил", desc: "Глянец или матовость, стойкость к царапинам", emoji: "✨" },
      { key: "enamel_matte", label: "Эмаль матовая", desc: "Любой цвет RAL, широкий дизайн", emoji: "🎨" },
      { key: "veneer", label: "Натуральный шпон", desc: "Тепло дерева с практичностью МДФ", emoji: "🪵" },
      { key: "solid_wood", label: "Массив дерева", desc: "Высшая прочность, ремонтируется", emoji: "🌳" },
    ],
  },
  {
    id: "countertop", title: "Столешница", subtitle: "Материал столешницы",
    type: "choice",
    options: [
      { key: "postforming", label: "ДСП постформинг", desc: "Бюджетный вариант, стойкий к влаге", emoji: "📋" },
      { key: "acrylic", label: "Искусственный камень", desc: "Без швов, тёплый на ощупь, ремонтируется", emoji: "🪨" },
      { key: "quartz", label: "Кварцевый агломерат", desc: "Прочный, термостойкий, без ухода", emoji: "💎" },
      { key: "marble", label: "Натуральный мрамор", desc: "Премиальный вид, уникальный рисунок", emoji: "🗿" },
    ],
  },
  {
    id: "hardware", title: "Уровень фурнитуры", subtitle: "Петли, ящики, подъёмники",
    type: "choice",
    options: [
      { key: "economy", label: "Экономная", desc: "Стандартные петли и направляющие", emoji: "🔧" },
      { key: "standard", label: "Стандарт (Blum, Hettich)", desc: "Плавное закрывание, полный ход ящиков", emoji: "⚙️" },
      { key: "premium", label: "Премиум (Blum Aventos)", desc: "Servo Drive, гарантия 10 лет", emoji: "🏆" },
    ],
  },
  {
    id: "tech", title: "Встроенная техника", subtitle: "Техника от нас или закупаете сами?",
    type: "choice",
    options: [
      { key: "none", label: "Без встроенной техники", desc: "Приобретаете и устанавливаете сами", emoji: "❌" },
      { key: "basic", label: "Базовый комплект", desc: "Духовой шкаф + варочная поверхность", emoji: "🍳" },
      { key: "full", label: "Полный комплект", desc: "Холодильник + посудомойка + духовой + варочная", emoji: "🏠" },
    ],
  },
  {
    id: "priority", title: "Ваш приоритет", subtitle: "Что для вас важнее?",
    type: "choice",
    options: [
      { key: "economy", label: "Главное — сэкономить", desc: "Оптимизируем под бюджет", emoji: "💰" },
      { key: "balance", label: "Баланс цены и качества", desc: "Оптимальное соотношение", emoji: "⚖️" },
      { key: "design", label: "Дизайн — в приоритете", desc: "Готовы инвестировать в эстетику", emoji: "🎨" },
      { key: "practical", label: "Максимальная практичность", desc: "Функционал важнее внешнего вида", emoji: "🔑" },
    ],
  },
];

const DEFAULTS: Record<string, string | number> = {
  layout: "corner", area: 12, style: "modern", material: "mdf_film",
  countertop: "postforming", hardware: "standard", tech: "none", priority: "balance",
};

function getKitchenTypeLabel(layout: string) {
  const labels: Record<string, string> = {
    straight: "Прямая",
    corner: "Угловая",
    u_shape: "П-образная",
    with_island: "С островом",
  };

  return labels[layout] || "";
}

export function CalculatorWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({ ...DEFAULTS });
  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const currentStep = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = ((step) / totalSteps) * 100;

  function selectOption(key: string) {
    trackCalculatorStart();
    setAnswers(a => ({ ...a, [currentStep.id]: key }));
    if (step < totalSteps - 1) setTimeout(() => setStep(s => s + 1), 260);
  }

  async function calculate() {
    setLoading(true);
    trackCalculatorStart();
    trackAnalyticsEvent(ANALYTICS_EVENTS.COST_CALCULATION, {
      source: "calculator_wizard",
    });
    trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_SUBMIT, {
      source: "calculator_wizard",
    });
    try {
      const res = await fetch("/kapi/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
    } catch {}
    setLoading(false);
  }

  function trackCalculatorStart() {
    if (hasTrackedStart) return;

    setHasTrackedStart(true);
    trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_START, {
      source: "calculator_wizard",
    });
  }

  const isLastStep = step === totalSteps - 1;
  const currentAnswer = answers[currentStep?.id];

  // Result screen
  if (result) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <CheckCircle className="w-4 h-4" /> Расчёт готов
          </div>
          <h2 className="font-serif text-3xl font-bold mb-2">Ориентировочная стоимость</h2>
          <p className="text-muted-foreground">для кухни {result.area} п.м с вашими параметрами</p>
        </div>

        {/* Price block */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">Диапазон стоимости</p>
          <p className="font-black text-4xl text-primary mb-1">
            {result.priceFrom.toLocaleString("ru")} — {result.priceTo.toLocaleString("ru")} BYN
          </p>
          <p className="text-muted-foreground text-sm">
            средняя оценка: <strong>{result.priceCenter.toLocaleString("ru")} BYN</strong>
          </p>
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Это ориентир, а не смета.</strong> Точная стоимость зависит от точных размеров, конфигурации мест под технику, высоты помещения и других деталей. Итоговую цену покажем после замера и согласования условий.
            </p>
          </div>
        </div>

        {/* Factors */}
        <div className="card-base p-4">
          <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Что влияет на цену</h3>
          <ul className="space-y-2">
            {result.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${f.impact === "positive" ? "bg-green-500" : f.impact === "warning" ? "bg-amber-400" : "bg-gray-300"}`} />
                <span className="text-muted-foreground">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {!showForm ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => {
              trackAnalyticsEvent(ANALYTICS_EVENTS.MEASURE_REQUEST, {
                source: "calculator_result",
              });
              setShowForm(true);
            }}
              data-testid="calculator-show-form"
              className="flex items-center justify-center gap-2 py-3 px-5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" /> Согласовать замер
            </button>
            <button onClick={() => { setResult(null); setStep(0); setAnswers({ ...DEFAULTS }); }}
              className="flex items-center justify-center gap-2 py-3 px-5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              <Calculator className="w-4 h-4" /> Пересчитать
            </button>
          </div>
        ) : (
          <div className="card-base p-5">
            <h3 className="font-serif text-xl font-semibold mb-1">Согласовать замер</h3>
            <p className="text-sm text-muted-foreground mb-4">Менеджер уточнит детали, адрес и ближайшее доступное время</p>
            <ContactForm
              source="calculator"
              sourceType="calculator"
              formType="calculator"
              defaultKitchenType={typeof answers.layout === "string" ? getKitchenTypeLabel(answers.layout) : ""}
            />
          </div>
        )}

        {/* Related cases teaser */}
        <div className="text-center pt-2">
          <Link href="/portfolio" className="text-sm text-primary hover:underline">
            Посмотреть похожие реализованные проекты →
          </Link>
        </div>
      </div>
    );
  }

  // Wizard steps
  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Шаг {step + 1} из {totalSteps}</span>
          <span>{Math.round(progress)}% завершено</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        <h2 className="font-serif text-2xl font-bold mb-1">{currentStep.title}</h2>
        {currentStep.subtitle && <p className="text-muted-foreground mb-5">{currentStep.subtitle}</p>}

        {currentStep.type === "choice" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStep.options?.map(opt => {
              const selected = currentAnswer === opt.key;
              return (
                <button key={opt.key} type="button" onClick={() => selectOption(opt.key)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"}`}>
                  {opt.emoji && <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>}
                  <div>
                    <p className={`font-semibold text-sm ${selected ? "text-primary" : "text-gray-800"}`}>{opt.label}</p>
                    {opt.desc && <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>}
                  </div>
                  {selected && <CheckCircle className="w-4 h-4 text-primary shrink-0 ml-auto mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}

        {currentStep.type === "slider" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl font-black text-primary">{answers[currentStep.id] ?? currentStep.sliderDefault}</span>
              <span className="text-2xl text-muted-foreground ml-1">{currentStep.sliderUnit}</span>
            </div>
            <input type="range"
              min={currentStep.sliderMin} max={currentStep.sliderMax}
              value={answers[currentStep.id] as number ?? currentStep.sliderDefault}
              onChange={e => {
                trackCalculatorStart();
                setAnswers(a => ({ ...a, [currentStep.id]: Number(e.target.value) }));
              }}
              className="w-full accent-primary h-2 rounded-full cursor-pointer" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStep.sliderMin} {currentStep.sliderUnit}</span>
              <span>{currentStep.sliderMax} {currentStep.sliderUnit}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4, 5, 6, 7].map(n => (
                <button key={n} type="button"
                  onClick={() => {
                    trackCalculatorStart();
                    setAnswers(a => ({ ...a, [currentStep.id]: n }));
                  }}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${answers[currentStep.id] === n ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}>
                  {n} п.м
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        {isLastStep ? (
          <button type="button" onClick={calculate} disabled={loading}
            data-testid="calculator-submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? "Считаем..." : "Рассчитать стоимость"} <Calculator className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={() => {
            trackCalculatorStart();
            setStep(s => s + 1);
          }}
            data-testid="calculator-next"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Далее <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
