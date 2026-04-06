import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronRight } from "lucide-react";

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-muted-foreground mb-8">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const PRICE_SEGMENTS = [
  {
    title: "Эконом",
    priceFrom: 900,
    priceTo: 1800,
    description: "Оптимальные решения без потери качества",
    features: [
      "Корпус ЛДСП EGGER",
      "Фасады МДФ плёнка",
      "Фурнитура GTV",
      "Стандартная столешница",
      "Монтаж под ключ",
    ],
    color: "border-secondary",
  },
  {
    title: "Средний",
    priceFrom: 1800,
    priceTo: 3500,
    description: "Лучшее соотношение цены и качества",
    features: [
      "Корпус ЛДСП Blum",
      "Фасады МДФ эмаль или пластик",
      "Фурнитура Hettich",
      "Постформинг или HPL-столешница",
      "Монтаж под ключ",
      "Встроенная техника",
    ],
    color: "border-primary",
    popular: true,
  },
  {
    title: "Премиум",
    priceFrom: 3500,
    priceTo: 8000,
    description: "Индивидуальный дизайн и материалы высшего класса",
    features: [
      "Корпус ЛДСП Blum Tandembox",
      "Фасады шпон или крашеный МДФ",
      "Фурнитура Blum",
      "Кварц, акрил или керамика",
      "Монтаж под ключ",
      "Встроенная техника и освещение",
      "3D-визуализация",
    ],
    color: "border-secondary",
  },
];

const QUIZ_STEPS = [
  {
    id: "type",
    question: "Какая конфигурация кухни?",
    options: ["Прямая", "Угловая", "П-образная", "С островом", "Не знаю, нужна помощь"],
  },
  {
    id: "size",
    question: "Примерный размер кухни",
    options: ["До 2 п.м", "2–4 п.м", "4–6 п.м", "Больше 6 п.м"],
  },
  {
    id: "style",
    question: "Предпочтительный стиль",
    options: ["Современный", "Классический", "Скандинавский", "Минимализм", "Ещё не решил(а)"],
  },
  {
    id: "material",
    question: "Материал фасадов",
    options: ["МДФ плёнка (бюджет)", "Пластик / HPL", "Эмаль матовая", "Шпон дерева", "Не важно"],
  },
  {
    id: "budget",
    question: "Ваш бюджет",
    options: ["До 1 500 BYN", "1 500–3 000 BYN", "3 000–6 000 BYN", "Более 6 000 BYN"],
  },
  {
    id: "appliances",
    question: "Нужна ли встроенная техника?",
    options: ["Да, вся техника", "Только духовка и варочная", "Только посудомойка", "Техника есть, не нужна"],
  },
  {
    id: "contacts",
    question: "Куда отправить расчёт?",
    type: "form",
  },
];

export function PricesPage() {
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const handleAnswer = (option: string) => {
    const step = QUIZ_STEPS[quizStep];
    setAnswers(prev => ({ ...prev, [step.id]: option }));
    setQuizStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setLocation("/thanks"), 2000);
  };

  const currentStep = QUIZ_STEPS[quizStep];
  const progress = Math.round((quizStep / QUIZ_STEPS.length) * 100);

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Цены" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Цены на кухни на заказ</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Прозрачные цены без "от". Стоимость зависит от размеров, материалов и фурнитуры.
        </p>
      </motion.div>

      {/* Сегменты цен */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {PRICE_SEGMENTS.map((seg, i) => (
          <motion.div key={seg.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`h-full border-2 ${seg.popular ? "border-primary shadow-lg" : seg.color} relative`}>
              {seg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Популярный выбор
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-serif text-2xl">{seg.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{seg.description}</p>
                <p className="text-3xl font-bold">
                  {seg.priceFrom.toLocaleString("ru")}–{seg.priceTo.toLocaleString("ru")} <span className="text-lg font-normal text-muted-foreground">BYN</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {seg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={seg.popular ? "default" : "outline"} data-testid={`btn-price-${seg.title.toLowerCase()}`}>
                  Рассчитать стоимость
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Что входит в цену */}
      <section className="mb-20 bg-secondary/30 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold font-serif mb-8 text-center">Что входит в стоимость</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Замер и проект", desc: "Выезд замерщика и 3D-визуализация — бесплатно" },
            { title: "Производство", desc: "Изготовление на собственном производстве в Минске" },
            { title: "Доставка", desc: "Доставка до подъезда или на этаж" },
            { title: "Монтаж", desc: "Сборка, навеска, подключение мойки и техники" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">0{i + 1}</span>
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Калькулятор / квиз */}
      <section id="calculator" className="mb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-4 text-center">Рассчитайте стоимость вашей кухни</h2>
          <p className="text-center text-muted-foreground mb-8">Ответьте на 6 вопросов — пришлём предварительный расчёт в течение 30 минут</p>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-8">
              {quizStep < QUIZ_STEPS.length && !submitted ? (
                <>
                  {/* Прогресс */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Вопрос {quizStep + 1} из {QUIZ_STEPS.length}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <motion.div
                    key={quizStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold font-serif mb-5">{currentStep.question}</h3>

                    {currentStep.type === "form" ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Ваше имя</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Иван"
                            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            data-testid="input-quiz-name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Телефон</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+375 (29) 000-00-00"
                            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            data-testid="input-quiz-phone"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Нажимая кнопку, вы соглашаетесь с <Link href="/privacy-policy" className="underline">политикой конфиденциальности</Link>
                        </p>
                        <Button type="submit" className="w-full" size="lg" data-testid="btn-quiz-submit">
                          Получить расчёт <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentStep.options?.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(option)}
                            className="text-left border rounded-xl px-4 py-3 text-sm hover:border-primary hover:bg-primary/5 transition-all font-medium"
                            data-testid={`btn-quiz-option-${i}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {quizStep > 0 && (
                    <button
                      onClick={() => setQuizStep(prev => prev - 1)}
                      className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Назад
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2">Заявка принята!</h3>
                  <p className="text-muted-foreground">Позвоним в течение 30 минут и пришлём предварительный расчёт.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
