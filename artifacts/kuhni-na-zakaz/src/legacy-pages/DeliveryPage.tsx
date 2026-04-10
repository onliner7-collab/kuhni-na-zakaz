import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck } from "lucide-react";

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

export function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "Р”РѕСЃС‚Р°РІРєР° Рё РјРѕРЅС‚Р°Р¶" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Р”РѕСЃС‚Р°РІРєР° Рё РјРѕРЅС‚Р°Р¶ РєСѓС…РЅРё</h1>
        <p className="text-muted-foreground text-lg mb-12">РџСЂРёРІРѕР·РёРј Рё СѓСЃС‚Р°РЅР°РІР»РёРІР°РµРј РєСѓС…РЅРё РїРѕРґ РєР»СЋС‡. РЈР±РёСЂР°РµРј Р·Р° СЃРѕР±РѕР№ СѓРїР°РєРѕРІРєСѓ Рё СЃС‚СЂРѕРёС‚РµР»СЊРЅС‹Р№ РјСѓСЃРѕСЂ.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-secondary/30 rounded-2xl p-8">
            <Truck className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-bold font-serif mb-4">Р”РѕСЃС‚Р°РІРєР°</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РџРѕ РњРёРЅСЃРєСѓ вЂ” Р±РµСЃРїР»Р°С‚РЅРѕ</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РџРѕ РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё вЂ” РѕС‚ 50 BYN</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РЎРѕРіР»Р°СЃСѓРµРј СѓРґРѕР±РЅРѕРµ РІСЂРµРјСЏ</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РџРѕРґСЉС‘Рј РЅР° СЌС‚Р°Р¶ РІРєР»СЋС‡С‘РЅ</li>
            </ul>
          </div>
          <div className="bg-secondary/30 rounded-2xl p-8">
            <h2 className="text-xl font-bold font-serif mb-4">РњРѕРЅС‚Р°Р¶</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РЎР±РѕСЂРєР° РєРѕСЂРїСѓСЃРѕРІ Рё РЅР°РІРµСЃРєР°</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РџРѕРґРєР»СЋС‡РµРЅРёРµ РјРѕР№РєРё</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Р’СЃС‚СЂРѕР№РєР° С‚РµС…РЅРёРєРё</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РЈР±РѕСЂРєР° РїРѕСЃР»Рµ РјРѕРЅС‚Р°Р¶Р°</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> РЎРґР°С‡Р° СЂР°Р±РѕС‚ Рё РёРЅСЃС‚СЂСѓРєС‚Р°Р¶</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">РЎС‚РѕРёРјРѕСЃС‚СЊ РјРѕРЅС‚Р°Р¶Р°</h2>
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-semibold">РўРёРї</th>
                  <th className="text-right p-4 font-semibold">РЎС‚РѕРёРјРѕСЃС‚СЊ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "РџСЂСЏРјР°СЏ РєСѓС…РЅСЏ РґРѕ 3 Рј", price: "РѕС‚ 150 BYN" },
                  { type: "РЈРіР»РѕРІР°СЏ РєСѓС…РЅСЏ", price: "РѕС‚ 200 BYN" },
                  { type: "Рџ-РѕР±СЂР°Р·РЅР°СЏ РєСѓС…РЅСЏ", price: "РѕС‚ 280 BYN" },
                  { type: "РљСѓС…РЅСЏ СЃ РѕСЃС‚СЂРѕРІРѕРј", price: "РѕС‚ 350 BYN" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                    <td className="p-4">{row.type}</td>
                    <td className="p-4 text-right font-semibold text-primary">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold font-serif mb-2">Р“РѕС‚РѕРІС‹ Рє РјРѕРЅС‚Р°Р¶Сѓ?</h2>
          <p className="text-muted-foreground mb-4">РЎРѕРіР»Р°СЃСѓРµРј СѓРґРѕР±РЅСѓСЋ РґР°С‚Сѓ РґРѕСЃС‚Р°РІРєРё Рё РјРѕРЅС‚Р°Р¶Р°.</p>
          <Button asChild data-testid="btn-delivery-cta">
            <Link href="/contacts">Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РјРѕРЅС‚Р°Р¶</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeliveryPage;

