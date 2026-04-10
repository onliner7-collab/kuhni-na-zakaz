import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield } from "lucide-react";

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

export function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "Р“Р°СЂР°РЅС‚РёСЏ" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Р“Р°СЂР°РЅС‚РёСЏ РЅР° РєСѓС…РЅРё</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          РњС‹ РЅРµСЃС‘Рј РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ Р·Р° РєР°С‡РµСЃС‚РІРѕ СЃРІРѕРµР№ СЂР°Р±РѕС‚С‹. Р’СЃРµ СѓСЃР»РѕРІРёСЏ РїСЂРѕРїРёСЃС‹РІР°СЋС‚СЃСЏ РІ РґРѕРіРѕРІРѕСЂРµ.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "2 РіРѕРґР°", desc: "Р“Р°СЂР°РЅС‚РёСЏ РЅР° РєРѕСЂРїСѓСЃ Рё С„Р°СЃР°РґС‹", icon: <Shield className="w-8 h-8 text-primary" /> },
            { title: "5 Р»РµС‚", desc: "Р“Р°СЂР°РЅС‚РёСЏ РЅР° С„СѓСЂРЅРёС‚СѓСЂСѓ Blum", icon: <Shield className="w-8 h-8 text-primary" /> },
            { title: "1 РіРѕРґ", desc: "Р“Р°СЂР°РЅС‚РёСЏ РЅР° РјРѕРЅС‚Р°Р¶РЅС‹Рµ СЂР°Р±РѕС‚С‹", icon: <Shield className="w-8 h-8 text-primary" /> },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 bg-secondary/30 rounded-2xl">
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <div className="text-3xl font-bold text-primary mb-1">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">Р§С‚Рѕ РІС…РѕРґРёС‚ РІ РіР°СЂР°РЅС‚РёР№РЅРѕРµ РѕР±СЃР»СѓР¶РёРІР°РЅРёРµ</h2>
          <ul className="space-y-3">
            {[
              "Р‘РµСЃРїР»Р°С‚РЅР°СЏ СЂРµРіСѓР»РёСЂРѕРІРєР° РїРµС‚РµР»СЊ Рё РЅР°РїСЂР°РІР»СЏСЋС‰РёС…",
              "Р—Р°РјРµРЅР° РґРµС„РµРєС‚РЅС‹С… С„Р°СЃР°РґРѕРІ РёР»Рё С„СѓСЂРЅРёС‚СѓСЂС‹",
              "РЈСЃС‚СЂР°РЅРµРЅРёРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРµРЅРЅС‹С… РґРµС„РµРєС‚РѕРІ",
              "РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ РјР°СЃС‚РµСЂР° РїРѕ СѓС…РѕРґСѓ",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold font-serif mb-2">Р’РѕРїСЂРѕСЃС‹ РїРѕ РіР°СЂР°РЅС‚РёРё?</h2>
          <p className="text-muted-foreground mb-4">Р—РІРѕРЅРёС‚Рµ РёР»Рё РїРёС€РёС‚Рµ вЂ” РїРѕРјРѕР¶РµРј СЂР°Р·РѕР±СЂР°С‚СЊСЃСЏ.</p>
          <Button asChild data-testid="btn-warranty-cta">
            <Link href="/contacts">РЎРІСЏР·Р°С‚СЊСЃСЏ</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default WarrantyPage;

