import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

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

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "Рћ РєРѕРјРїР°РЅРёРё" }]} />
      <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Рћ РєРѕРјРїР°РЅРёРё РљСѓС…РЅРёMinsk</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                РљСѓС…РЅРёMinsk вЂ” РїСЂРѕРёР·РІРѕРґСЃС‚РІРµРЅРЅР°СЏ РєРѕРјРїР°РЅРёСЏ РїРѕ РёР·РіРѕС‚РѕРІР»РµРЅРёСЋ РєСѓС…РѕРЅСЊ РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРµ Рё РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё.
                Р Р°Р±РѕС‚Р°РµРј СЃ 2018 РіРѕРґР°. Р—Р° СЌС‚Рѕ РІСЂРµРјСЏ СЃРґРµР»Р°Р»Рё Р±РѕР»РµРµ 300 РєСѓС…РѕРЅСЊ.
              </p>
              <p className="text-muted-foreground mb-6">
                РњС‹ РЅРµ РїРѕСЃСЂРµРґРЅРёРєРё вЂ” Сѓ РЅР°СЃ СЃРѕР±СЃС‚РІРµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ. Р­С‚Рѕ Р·РЅР°С‡РёС‚, С‡С‚Рѕ РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ С‡РµСЃС‚РЅСѓСЋ С†РµРЅСѓ Рё РїРѕР»РЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ РЅР°Рґ РєР°С‡РµСЃС‚РІРѕРј РЅР° РєР°Р¶РґРѕРј СЌС‚Р°РїРµ.
              </p>
              <ul className="space-y-3">
                {[
                  "РЎРѕР±СЃС‚РІРµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ РІ РњРёРЅСЃРєРµ",
                  "Р‘РµСЃРїР»Р°С‚РЅС‹Р№ Р·Р°РјРµСЂ Рё 3D-РїСЂРѕРµРєС‚",
                  "Р“Р°СЂР°РЅС‚РёСЏ 2вЂ“5 Р»РµС‚ РїРѕ РґРѕРіРѕРІРѕСЂСѓ",
                  "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡ РІРєР»СЋС‡Р°СЏ СѓР±РѕСЂРєСѓ",
                  "Р Р°Р±РѕС‚Р°РµРј РїРѕ РІСЃРµР№ РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary rounded-2xl h-64 lg:h-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { number: "300+", label: "РџСЂРѕРµРєС‚РѕРІ РІС‹РїРѕР»РЅРµРЅРѕ" },
              { number: "7 Р»РµС‚", label: "РќР° СЂС‹РЅРєРµ" },
              { number: "4.9/5", label: "РЎСЂРµРґРЅРёР№ СЂРµР№С‚РёРЅРі" },
              { number: "14 РґРЅ", label: "РЎСЂРѕРє РѕС‚ Р·Р°РјРµСЂР°" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-secondary/30 rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold font-serif mb-2">РҐРѕС‚РёС‚Рµ СѓР·РЅР°С‚СЊ Р±РѕР»СЊС€Рµ?</h2>
              <p className="text-muted-foreground">РџСЂРёРµР·Р¶Р°Р№С‚Рµ РІ РЅР°С€ С€РѕСѓСЂСѓРј РІ РњРёРЅСЃРєРµ. РџРѕРєР°Р¶РµРј РѕР±СЂР°Р·С†С‹ РјР°С‚РµСЂРёР°Р»РѕРІ Рё РѕС‚РІРµС‚РёРј РЅР° РІСЃРµ РІРѕРїСЂРѕСЃС‹.</p>
            </div>
            <Button size="lg" className="flex-shrink-0" asChild data-testid="btn-about-cta">
              <Link href="/contacts">Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РІСЃС‚СЂРµС‡Сѓ</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutPage;

