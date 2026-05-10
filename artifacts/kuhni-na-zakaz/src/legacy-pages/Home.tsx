import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Ruler, FileText, Wrench, Shield, Clock, Star, ChevronDown, ChevronRight, Phone } from "lucide-react";
import { PORTFOLIO_ITEMS, REVIEWS, FAQ_ITEMS, STEPS, CATALOG_CATEGORIES } from "@/lib/data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setLocation("/thanks"), 2000);
  };

  const advantages = [
    { icon: <Ruler className="w-7 h-7 text-primary" />, title: "РџРѕРґ СЂР°Р·РјРµСЂ РїРѕРјРµС‰РµРЅРёСЏ", desc: "РџСЂРѕРµРєС‚РёСЂСѓРµРј РґРѕ РјРёР»Р»РёРјРµС‚СЂР° РїРѕРґ РІР°С€Сѓ РїР»Р°РЅРёСЂРѕРІРєСѓ вЂ” РЅРµСЃС‚Р°РЅРґР°СЂС‚РЅС‹Рµ СѓРіР»С‹, СЃРєРѕС€РµРЅРЅС‹Рµ СЃС‚РµРЅС‹, Р»СЋР±С‹Рµ РІС‹СЃРѕС‚С‹" },
    { icon: <FileText className="w-7 h-7 text-primary" />, title: "РџСЂРѕР·СЂР°С‡РЅР°СЏ СЃРјРµС‚Р°", desc: "Р¤РёРєСЃРёСЂСѓРµРј С†РµРЅСѓ РІ РґРѕРіРѕРІРѕСЂРµ. РќРёРєР°РєРёС… В«РїРѕ С„Р°РєС‚СѓВ» вЂ” РІС‹ Р·РЅР°РµС‚Рµ СЃС‚РѕРёРјРѕСЃС‚СЊ РґРѕ СЃС‚Р°СЂС‚Р° РїСЂРѕРёР·РІРѕРґСЃС‚РІР°" },
    { icon: <CheckCircle className="w-7 h-7 text-primary" />, title: "РЎРѕРІСЂРµРјРµРЅРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹", desc: "Р›Р”РЎРџ Blum, EGGER, С„СѓСЂРЅРёС‚СѓСЂР° Hettich Рё Blum. РўРѕР»СЊРєРѕ С‚Рѕ, С‡С‚Рѕ РїСЂРѕС€Р»Рѕ РїСЂРѕРІРµСЂРєСѓ РІСЂРµРјРµРЅРµРј" },
    { icon: <Wrench className="w-7 h-7 text-primary" />, title: "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡", desc: "Р”РѕСЃС‚Р°РІР»СЏРµРј, СЃРѕР±РёСЂР°РµРј, РїРѕРґРєР»СЋС‡Р°РµРј РјРѕР№РєСѓ Рё С‚РµС…РЅРёРєСѓ. РЈР±РёСЂР°РµРј СѓРїР°РєРѕРІРєСѓ Рё СЃС‚СЂРѕРёС‚РµР»СЊРЅС‹Р№ РјСѓСЃРѕСЂ" },
    { icon: <Clock className="w-7 h-7 text-primary" />, title: "Р РµР°Р»СЊРЅС‹Рµ СЃСЂРѕРєРё", desc: "РћС‚ Р·Р°РјРµСЂР° РґРѕ РјРѕРЅС‚Р°Р¶Р° вЂ” 14вЂ“30 РґРЅРµР№. РЎСЂРѕРє РїСЂРѕРїРёСЃР°РЅ РІ РґРѕРіРѕРІРѕСЂРµ, Рё РјС‹ РµРіРѕ СЃРѕР±Р»СЋРґР°РµРј" },
    { icon: <Shield className="w-7 h-7 text-primary" />, title: "Р“Р°СЂР°РЅС‚РёСЏ РїРѕ РґРѕРіРѕРІРѕСЂСѓ", desc: "2 РіРѕРґР° РЅР° РєРѕСЂРїСѓСЃ Рё С„Р°СЃР°РґС‹, 5 Р»РµС‚ РЅР° С„СѓСЂРЅРёС‚СѓСЂСѓ Blum. РџРёСЃСЊРјРµРЅРЅР°СЏ РіР°СЂР°РЅС‚РёСЏ, РЅРµ РЅР° СЃР»РѕРІР°С…" },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="container relative z-10 text-center text-white px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-amber-300/90 text-sm font-medium tracking-widest uppercase mb-4">РЎРѕР±СЃС‚РІРµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ В· РњРёРЅСЃРє</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight">
              РљСѓС…РЅРё РЅР° Р·Р°РєР°Р·<br/>
              <span className="text-amber-300">РІ РњРёРЅСЃРєРµ Рё РѕР±Р»Р°СЃС‚Рё</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
              РџСЂРѕРµРєС‚РёСЂСѓРµРј Рё РёР·РіРѕС‚Р°РІР»РёРІР°РµРј РєСѓС…РЅРё РїРѕРґ РІР°С€ СЂР°Р·РјРµСЂ, Р±СЋРґР¶РµС‚ Рё СЃС‚РёР»СЊ.<br className="hidden md:block" />
              Р‘РµСЃРїР»Р°С‚РЅС‹Р№ Р·Р°РјРµСЂ, 3D-РїСЂРѕРµРєС‚ Рё СЂР°СЃС‡С‘С‚ СЃС‚РѕРёРјРѕСЃС‚Рё.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mb-10"
          >
            {["РЎСЂРѕРє РѕС‚ 14 РґРЅРµР№", "Р“Р°СЂР°РЅС‚РёСЏ РґРѕ 5 Р»РµС‚", "Р—Р°РјРµСЂ В· РџСЂРѕРµРєС‚ В· РњРѕРЅС‚Р°Р¶"].map((label, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/20">
                <CheckCircle className="w-3.5 h-3.5 text-amber-300" /> {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-base px-8 py-6 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-full" asChild data-testid="btn-hero-calc">
              <Link href="/prices#calculator">Р Р°СЃСЃС‡РёС‚Р°С‚СЊ СЃС‚РѕРёРјРѕСЃС‚СЊ</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full border-white/40 text-white hover:bg-white/10" asChild data-testid="btn-hero-project">
              <Link href="/portfolio">РЎРјРѕС‚СЂРµС‚СЊ РїСЂРѕРµРєС‚С‹</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* РџР Р•РРњРЈР©Р•РЎРўР’Рђ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">РџРѕС‡РµРјСѓ РІС‹Р±РёСЂР°СЋС‚ РЅР°СЃ</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">РњС‹ РґРµР»Р°РµРј РїСЂРѕС†РµСЃСЃ Р·Р°РєР°Р·Р° РєСѓС…РЅРё РїСЂРѕСЃС‚С‹Рј Рё РїРѕРЅСЏС‚РЅС‹Рј РѕС‚ РїРµСЂРІРѕРіРѕ Р·РІРѕРЅРєР° РґРѕ РїРѕСЃР»РµРґРЅРµРіРѕ РіРІРѕР·РґСЏ.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-secondary/20 h-full">
                  <CardContent className="p-7 flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {adv.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-serif mb-1.5">{adv.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{adv.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* РљРђРўР•Р“РћР РР */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">РљР°С‚Р°Р»РѕРі РєСѓС…РѕРЅСЊ</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Р’С‹Р±РµСЂРёС‚Рµ РєРѕРЅС„РёРіСѓСЂР°С†РёСЋ РїРѕРґ РІР°С€Рµ РїРѕРјРµС‰РµРЅРёРµ. РљР°Р¶РґРѕРµ СЂРµС€РµРЅРёРµ вЂ” РїРѕ СЂР°Р·РјРµСЂСѓ, РЅРµ СЃС‚Р°РЅРґР°СЂС‚.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATALOG_CATEGORIES.slice(0, 7).map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link href={`/catalog/${cat.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer" data-testid={`card-cat-${cat.slug}`}>
                    <div className="h-40 bg-gradient-to-br from-stone-200 to-stone-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-all duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">РѕС‚ {cat.priceFrom.toLocaleString("ru")} BYN</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={7}
              variants={fadeUp}
            >
              <Link href="/catalog">
                <Card className="group h-full flex items-center justify-center min-h-[180px] bg-primary/5 border-primary/20 border-2 border-dashed hover:bg-primary/10 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <ChevronRight className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-primary text-sm">Р’РµСЃСЊ РєР°С‚Р°Р»РѕРі</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* РџРћР РўР¤РћР›РРћ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-2">Р’С‹РїРѕР»РЅРµРЅРЅС‹Рµ РїСЂРѕРµРєС‚С‹</h2>
              <p className="text-muted-foreground">Р РµР°Р»СЊРЅС‹Рµ РєСѓС…РЅРё, СЂРµР°Р»СЊРЅС‹Рµ РєР»РёРµРЅС‚С‹. РџР»РѕС‰Р°РґСЊ, СЃС‚РёР»СЊ, С†РµРЅР° вЂ” РІСЃС‘ С‡РµСЃС‚РЅРѕ.</p>
            </div>
            <Link href="/portfolio" className="text-primary font-medium hover:underline flex-shrink-0 flex items-center gap-1">
              Р’СЃРµ РїСЂРѕРµРєС‚С‹ <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_ITEMS.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link href={`/portfolio/${item.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full" data-testid={`card-portfolio-home-${item.slug}`}>
                    <div className="h-48 bg-gradient-to-br from-stone-200 to-amber-100 relative">
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-xs bg-white/90 text-stone-800 px-2 py-1 rounded-full font-medium">{item.style}</span>
                        <span className="text-xs bg-white/90 text-stone-800 px-2 py-1 rounded-full font-medium">{item.area} Рї.Рј</span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold font-serif mb-1 group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.city}</p>
                      <p className="font-semibold text-primary text-sm">{item.priceFrom.toLocaleString("ru")}вЂ“{item.priceTo.toLocaleString("ru")} BYN</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* РљРђРљ РњР« Р РђР‘РћРўРђР•Рњ */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">РљР°Рє РјС‹ СЂР°Р±РѕС‚Р°РµРј</h2>
            <p className="text-white/60 max-w-xl mx-auto">РћС‚ Р·РІРѕРЅРєР° РґРѕ РіРѕС‚РѕРІРѕР№ РєСѓС…РЅРё вЂ” 6 РїСЂРѕР·СЂР°С‡РЅС‹С… С€Р°РіРѕРІ Р±РµР· СЃСЋСЂРїСЂРёР·РѕРІ</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 items-start"
              >
                <span className="text-4xl font-bold text-amber-400/40 font-serif leading-none flex-shrink-0">{step.number}</span>
                <div>
                  <h3 className="font-bold text-lg font-serif mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={6}
            variants={fadeUp}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-8 rounded-full" asChild data-testid="btn-steps-cta">
              <Link href="/contacts">РќР°С‡Р°С‚СЊ вЂ” РѕСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* РћРўР—Р«Р’Р« */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-2">Р§С‚Рѕ РіРѕРІРѕСЂСЏС‚ РєР»РёРµРЅС‚С‹</h2>
              <p className="text-muted-foreground">РўРѕР»СЊРєРѕ СЂРµР°Р»СЊРЅС‹Рµ РѕС‚Р·С‹РІС‹ РѕС‚ Р»СЋРґРµР№, РєРѕС‚РѕСЂС‹Рµ Р·Р°РєР°Р·Р°Р»Рё Сѓ РЅР°СЃ РєСѓС…РЅСЋ</p>
            </div>
            <Link href="/reviews" className="text-primary font-medium hover:underline flex-shrink-0 flex items-center gap-1">
              Р’СЃРµ РѕС‚Р·С‹РІС‹ <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.slice(0, 3).map((review, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full" data-testid={`card-review-home-${i}`}>
                  <CardContent className="p-6">
                    <StarRating rating={review.rating} />
                    <p className="text-sm leading-relaxed text-muted-foreground my-4 line-clamp-4">{review.text}</p>
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.city} В· {review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Р§Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹</h2>
            <p className="text-muted-foreground">РЎРѕР±СЂР°Р»Рё СЃР°РјС‹Рµ СЂР°СЃРїСЂРѕСЃС‚СЂР°РЅС‘РЅРЅС‹Рµ РІРѕРїСЂРѕСЃС‹ Рё РѕС‚РІРµС‚РёР»Рё С‡РµСЃС‚РЅРѕ</p>
          </motion.div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    data-testid={`btn-faq-${i}`}
                  >
                    <span className="font-semibold text-sm md:text-base">{item.question}</span>
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                      {item.answer}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Р¤РћР РњРђ Р—РђРЇР’РљР */}
      <section className="py-20 bg-background" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ</h2>
              <p className="text-muted-foreground">РџРµСЂРµР·РІРѕРЅРёРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚ РІ СЂР°Р±РѕС‡РµРµ РІСЂРµРјСЏ. РћР±СЃСѓРґРёРј Р·Р°РґР°С‡Сѓ Рё РѕС‚РІРµС‚РёРј РЅР° РІСЃРµ РІРѕРїСЂРѕСЃС‹.</p>
            </motion.div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-serif mb-2">Р—Р°СЏРІРєР° РїСЂРёРЅСЏС‚Р°!</h3>
                <p className="text-muted-foreground">РџРѕР·РІРѕРЅРёРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚.</p>
              </motion.div>
            ) : (
              <motion.form
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                variants={fadeUp}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="text-sm font-medium mb-1 block">Р’Р°С€Рµ РёРјСЏ *</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="РРІР°РЅ"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    data-testid="input-home-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">РўРµР»РµС„РѕРЅ *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+375 (29) 000-00-00"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    data-testid="input-home-phone"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Р“РѕСЂРѕРґ</label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="РњРёРЅСЃРє"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    data-testid="input-home-city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">РљРѕРјРјРµРЅС‚Р°СЂРёР№</label>
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="РЈРіР»РѕРІР°СЏ, 3 Рї.Рј, СЌРєРѕРЅРѕРј Р±СЋРґР¶РµС‚..."
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    data-testid="input-home-comment"
                  />
                </div>
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" className="w-full" data-testid="btn-home-submit">
                    РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ <Link href="/privacy-policy" className="underline">РїРѕР»РёС‚РёРєРѕР№ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</Link>
                  </p>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      {/* РљРћРќРўРђРљРўР« */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif mb-2">РќР°С€Рё РєРѕРЅС‚Р°РєС‚С‹</h2>
              <p className="text-muted-foreground text-sm">Рі. РњРёРЅСЃРє, СѓР». РџСЂРёС‚С‹С†РєРѕРіРѕ, 100 В· РџРЅвЂ“РЎР± 9:00вЂ“19:00, Р’СЃ 10:00вЂ“17:00</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild data-testid="btn-contacts-call">
                <a href="tel:+375293720674" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +375 (29) 372-06-74
                </a>
              </Button>
              <Button asChild>
                <Link href="/contacts" data-testid="btn-contacts-page">Р’СЃРµ РєРѕРЅС‚Р°РєС‚С‹</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

