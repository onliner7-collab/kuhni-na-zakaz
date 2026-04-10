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
    title: "Р­РєРѕРЅРѕРј",
    priceFrom: 900,
    priceTo: 1800,
    description: "РћРїС‚РёРјР°Р»СЊРЅС‹Рµ СЂРµС€РµРЅРёСЏ Р±РµР· РїРѕС‚РµСЂРё РєР°С‡РµСЃС‚РІР°",
    features: [
      "РљРѕСЂРїСѓСЃ Р›Р”РЎРџ EGGER",
      "Р¤Р°СЃР°РґС‹ РњР”Р¤ РїР»С‘РЅРєР°",
      "Р¤СѓСЂРЅРёС‚СѓСЂР° GTV",
      "РЎС‚Р°РЅРґР°СЂС‚РЅР°СЏ СЃС‚РѕР»РµС€РЅРёС†Р°",
      "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡",
    ],
    color: "border-secondary",
  },
  {
    title: "РЎСЂРµРґРЅРёР№",
    priceFrom: 1800,
    priceTo: 3500,
    description: "Р›СѓС‡С€РµРµ СЃРѕРѕС‚РЅРѕС€РµРЅРёРµ С†РµРЅС‹ Рё РєР°С‡РµСЃС‚РІР°",
    features: [
      "РљРѕСЂРїСѓСЃ Р›Р”РЎРџ Blum",
      "Р¤Р°СЃР°РґС‹ РњР”Р¤ СЌРјР°Р»СЊ РёР»Рё РїР»Р°СЃС‚РёРє",
      "Р¤СѓСЂРЅРёС‚СѓСЂР° Hettich",
      "РџРѕСЃС‚С„РѕСЂРјРёРЅРі РёР»Рё HPL-СЃС‚РѕР»РµС€РЅРёС†Р°",
      "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡",
      "Р’СЃС‚СЂРѕРµРЅРЅР°СЏ С‚РµС…РЅРёРєР°",
    ],
    color: "border-primary",
    popular: true,
  },
  {
    title: "РџСЂРµРјРёСѓРј",
    priceFrom: 3500,
    priceTo: 8000,
    description: "РРЅРґРёРІРёРґСѓР°Р»СЊРЅС‹Р№ РґРёР·Р°Р№РЅ Рё РјР°С‚РµСЂРёР°Р»С‹ РІС‹СЃС€РµРіРѕ РєР»Р°СЃСЃР°",
    features: [
      "РљРѕСЂРїСѓСЃ Р›Р”РЎРџ Blum Tandembox",
      "Р¤Р°СЃР°РґС‹ С€РїРѕРЅ РёР»Рё РєСЂР°С€РµРЅС‹Р№ РњР”Р¤",
      "Р¤СѓСЂРЅРёС‚СѓСЂР° Blum",
      "РљРІР°СЂС†, Р°РєСЂРёР» РёР»Рё РєРµСЂР°РјРёРєР°",
      "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡",
      "Р’СЃС‚СЂРѕРµРЅРЅР°СЏ С‚РµС…РЅРёРєР° Рё РѕСЃРІРµС‰РµРЅРёРµ",
      "3D-РІРёР·СѓР°Р»РёР·Р°С†РёСЏ",
    ],
    color: "border-secondary",
  },
];

const QUIZ_STEPS = [
  {
    id: "type",
    question: "РљР°РєР°СЏ РєРѕРЅС„РёРіСѓСЂР°С†РёСЏ РєСѓС…РЅРё?",
    options: ["РџСЂСЏРјР°СЏ", "РЈРіР»РѕРІР°СЏ", "Рџ-РѕР±СЂР°Р·РЅР°СЏ", "РЎ РѕСЃС‚СЂРѕРІРѕРј", "РќРµ Р·РЅР°СЋ, РЅСѓР¶РЅР° РїРѕРјРѕС‰СЊ"],
  },
  {
    id: "size",
    question: "РџСЂРёРјРµСЂРЅС‹Р№ СЂР°Р·РјРµСЂ РєСѓС…РЅРё",
    options: ["Р”Рѕ 2 Рї.Рј", "2вЂ“4 Рї.Рј", "4вЂ“6 Рї.Рј", "Р‘РѕР»СЊС€Рµ 6 Рї.Рј"],
  },
  {
    id: "style",
    question: "РџСЂРµРґРїРѕС‡С‚РёС‚РµР»СЊРЅС‹Р№ СЃС‚РёР»СЊ",
    options: ["РЎРѕРІСЂРµРјРµРЅРЅС‹Р№", "РљР»Р°СЃСЃРёС‡РµСЃРєРёР№", "РЎРєР°РЅРґРёРЅР°РІСЃРєРёР№", "РњРёРЅРёРјР°Р»РёР·Рј", "Р•С‰С‘ РЅРµ СЂРµС€РёР»(Р°)"],
  },
  {
    id: "material",
    question: "РњР°С‚РµСЂРёР°Р» С„Р°СЃР°РґРѕРІ",
    options: ["РњР”Р¤ РїР»С‘РЅРєР° (Р±СЋРґР¶РµС‚)", "РџР»Р°СЃС‚РёРє / HPL", "Р­РјР°Р»СЊ РјР°С‚РѕРІР°СЏ", "РЁРїРѕРЅ РґРµСЂРµРІР°", "РќРµ РІР°Р¶РЅРѕ"],
  },
  {
    id: "budget",
    question: "Р’Р°С€ Р±СЋРґР¶РµС‚",
    options: ["Р”Рѕ 1 500 BYN", "1 500вЂ“3 000 BYN", "3 000вЂ“6 000 BYN", "Р‘РѕР»РµРµ 6 000 BYN"],
  },
  {
    id: "appliances",
    question: "РќСѓР¶РЅР° Р»Рё РІСЃС‚СЂРѕРµРЅРЅР°СЏ С‚РµС…РЅРёРєР°?",
    options: ["Р”Р°, РІСЃСЏ С‚РµС…РЅРёРєР°", "РўРѕР»СЊРєРѕ РґСѓС…РѕРІРєР° Рё РІР°СЂРѕС‡РЅР°СЏ", "РўРѕР»СЊРєРѕ РїРѕСЃСѓРґРѕРјРѕР№РєР°", "РўРµС…РЅРёРєР° РµСЃС‚СЊ, РЅРµ РЅСѓР¶РЅР°"],
  },
  {
    id: "contacts",
    question: "РљСѓРґР° РѕС‚РїСЂР°РІРёС‚СЊ СЂР°СЃС‡С‘С‚?",
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
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "Р¦РµРЅС‹" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Р¦РµРЅС‹ РЅР° РєСѓС…РЅРё РЅР° Р·Р°РєР°Р·</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          РџСЂРѕР·СЂР°С‡РЅС‹Рµ С†РµРЅС‹ Р±РµР· "РѕС‚". РЎС‚РѕРёРјРѕСЃС‚СЊ Р·Р°РІРёСЃРёС‚ РѕС‚ СЂР°Р·РјРµСЂРѕРІ, РјР°С‚РµСЂРёР°Р»РѕРІ Рё С„СѓСЂРЅРёС‚СѓСЂС‹.
        </p>
      </motion.div>

      {/* РЎРµРіРјРµРЅС‚С‹ С†РµРЅ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {PRICE_SEGMENTS.map((seg, i) => (
          <motion.div key={seg.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`h-full border-2 ${seg.popular ? "border-primary shadow-lg" : seg.color} relative`}>
              {seg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                  РџРѕРїСѓР»СЏСЂРЅС‹Р№ РІС‹Р±РѕСЂ
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-serif text-2xl">{seg.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{seg.description}</p>
                <p className="text-3xl font-bold">
                  {seg.priceFrom.toLocaleString("ru")}вЂ“{seg.priceTo.toLocaleString("ru")} <span className="text-lg font-normal text-muted-foreground">BYN</span>
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
                  Р Р°СЃСЃС‡РёС‚Р°С‚СЊ СЃС‚РѕРёРјРѕСЃС‚СЊ
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Р§С‚Рѕ РІС…РѕРґРёС‚ РІ С†РµРЅСѓ */}
      <section className="mb-20 bg-secondary/30 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold font-serif mb-8 text-center">Р§С‚Рѕ РІС…РѕРґРёС‚ РІ СЃС‚РѕРёРјРѕСЃС‚СЊ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Р—Р°РјРµСЂ Рё РїСЂРѕРµРєС‚", desc: "Р’С‹РµР·Рґ Р·Р°РјРµСЂС‰РёРєР° Рё 3D-РІРёР·СѓР°Р»РёР·Р°С†РёСЏ вЂ” Р±РµСЃРїР»Р°С‚РЅРѕ" },
            { title: "РџСЂРѕРёР·РІРѕРґСЃС‚РІРѕ", desc: "РР·РіРѕС‚РѕРІР»РµРЅРёРµ РЅР° СЃРѕР±СЃС‚РІРµРЅРЅРѕРј РїСЂРѕРёР·РІРѕРґСЃС‚РІРµ РІ РњРёРЅСЃРєРµ" },
            { title: "Р”РѕСЃС‚Р°РІРєР°", desc: "Р”РѕСЃС‚Р°РІРєР° РґРѕ РїРѕРґСЉРµР·РґР° РёР»Рё РЅР° СЌС‚Р°Р¶" },
            { title: "РњРѕРЅС‚Р°Р¶", desc: "РЎР±РѕСЂРєР°, РЅР°РІРµСЃРєР°, РїРѕРґРєР»СЋС‡РµРЅРёРµ РјРѕР№РєРё Рё С‚РµС…РЅРёРєРё" },
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

      {/* РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ / РєРІРёР· */}
      <section id="calculator" className="mb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-4 text-center">Р Р°СЃСЃС‡РёС‚Р°Р№С‚Рµ СЃС‚РѕРёРјРѕСЃС‚СЊ РІР°С€РµР№ РєСѓС…РЅРё</h2>
          <p className="text-center text-muted-foreground mb-8">РћС‚РІРµС‚СЊС‚Рµ РЅР° 6 РІРѕРїСЂРѕСЃРѕРІ вЂ” РїСЂРёС€Р»С‘Рј РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ СЂР°СЃС‡С‘С‚ РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚</p>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-8">
              {quizStep < QUIZ_STEPS.length && !submitted ? (
                <>
                  {/* РџСЂРѕРіСЂРµСЃСЃ */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Р’РѕРїСЂРѕСЃ {quizStep + 1} РёР· {QUIZ_STEPS.length}</span>
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
                          <label className="text-sm font-medium mb-1 block">Р’Р°С€Рµ РёРјСЏ</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="РРІР°РЅ"
                            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            data-testid="input-quiz-name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">РўРµР»РµС„РѕРЅ</label>
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
                          РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ <Link href="/privacy-policy" className="underline">РїРѕР»РёС‚РёРєРѕР№ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</Link>
                        </p>
                        <Button type="submit" className="w-full" size="lg" data-testid="btn-quiz-submit">
                          РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃС‡С‘С‚ <ChevronRight className="w-4 h-4 ml-1" />
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
                      в†ђ РќР°Р·Р°Рґ
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2">Р—Р°СЏРІРєР° РїСЂРёРЅСЏС‚Р°!</h3>
                  <p className="text-muted-foreground">РџРѕР·РІРѕРЅРёРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚ Рё РїСЂРёС€Р»С‘Рј РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ СЂР°СЃС‡С‘С‚.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default PricesPage;

