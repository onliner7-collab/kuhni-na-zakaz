import { Link } from "wouter";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/data";

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

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</h1>
        <p className="text-muted-foreground">Р”Р°С‚Р° РІСЃС‚СѓРїР»РµРЅРёСЏ РІ СЃРёР»Сѓ: 1 СЏРЅРІР°СЂСЏ 2025 Рі.</p>
        <p>РќР°СЃС‚РѕСЏС‰Р°СЏ РїРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё РѕРїРёСЃС‹РІР°РµС‚, РєР°Рє {SITE_CONFIG.name} СЃРѕР±РёСЂР°РµС‚, РёСЃРїРѕР»СЊР·СѓРµС‚ Рё Р·Р°С‰РёС‰Р°РµС‚ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ СЃР°Р№С‚Р°.</p>
        <h2 className="font-serif">1. РљР°РєРёРµ РґР°РЅРЅС‹Рµ РјС‹ СЃРѕР±РёСЂР°РµРј</h2>
        <p>РњС‹ СЃРѕР±РёСЂР°РµРј РґР°РЅРЅС‹Рµ, РєРѕС‚РѕСЂС‹Рµ РІС‹ РґРѕР±СЂРѕРІРѕР»СЊРЅРѕ РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚Рµ РїСЂРё Р·Р°РїРѕР»РЅРµРЅРёРё С„РѕСЂРј: РёРјСЏ, РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР°, email, РєРѕРјРјРµРЅС‚Р°СЂРёР№.</p>
        <h2 className="font-serif">2. РљР°Рє РјС‹ РёСЃРїРѕР»СЊР·СѓРµРј РґР°РЅРЅС‹Рµ</h2>
        <p>Р”Р°РЅРЅС‹Рµ РёСЃРїРѕР»СЊР·СѓСЋС‚СЃСЏ РёСЃРєР»СЋС‡РёС‚РµР»СЊРЅРѕ РґР»СЏ СЃРІСЏР·Рё СЃ РІР°РјРё РїРѕ РІР°С€РµРјСѓ Р·Р°РїСЂРѕСЃСѓ. РњС‹ РЅРµ РїРµСЂРµРґР°С‘Рј РґР°РЅРЅС‹Рµ С‚СЂРµС‚СЊРёРј Р»РёС†Р°Рј Р±РµР· РІР°С€РµРіРѕ СЃРѕРіР»Р°СЃРёСЏ.</p>
        <h2 className="font-serif">3. РҐСЂР°РЅРµРЅРёРµ РґР°РЅРЅС‹С…</h2>
        <p>Р”Р°РЅРЅС‹Рµ С…СЂР°РЅСЏС‚СЃСЏ РЅР° Р·Р°С‰РёС‰С‘РЅРЅС‹С… СЃРµСЂРІРµСЂР°С… Рё СѓРґР°Р»СЏСЋС‚СЃСЏ РїРѕ РІР°С€РµРјСѓ Р·Р°РїСЂРѕСЃСѓ.</p>
        <h2 className="font-serif">4. РљРѕРЅС‚Р°РєС‚С‹</h2>
        <p>РџРѕ РІРѕРїСЂРѕСЃР°Рј РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "РЈСЃР»РѕРІРёСЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">РЈСЃР»РѕРІРёСЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ СЃР°Р№С‚Р°</h1>
        <p className="text-muted-foreground">Р”Р°С‚Р° РІСЃС‚СѓРїР»РµРЅРёСЏ РІ СЃРёР»Сѓ: 1 СЏРЅРІР°СЂСЏ 2025 Рі.</p>
        <p>РСЃРїРѕР»СЊР·СѓСЏ РґР°РЅРЅС‹Р№ СЃР°Р№С‚, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ РЅР°СЃС‚РѕСЏС‰РёРјРё СѓСЃР»РѕРІРёСЏРјРё РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ.</p>
        <h2 className="font-serif">1. РСЃРїРѕР»СЊР·РѕРІР°РЅРёРµ СЃР°Р№С‚Р°</h2>
        <p>РЎР°Р№С‚ РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ РІ РёРЅС„РѕСЂРјР°С†РёРѕРЅРЅС‹С… С†РµР»СЏС…. Р’СЃСЏ РёРЅС„РѕСЂРјР°С†РёСЏ РЅР° СЃР°Р№С‚Рµ СЏРІР»СЏРµС‚СЃСЏ Р°РєС‚СѓР°Р»СЊРЅРѕР№ РЅР° РјРѕРјРµРЅС‚ РїСѓР±Р»РёРєР°С†РёРё.</p>
        <h2 className="font-serif">2. РРЅС‚РµР»Р»РµРєС‚СѓР°Р»СЊРЅР°СЏ СЃРѕР±СЃС‚РІРµРЅРЅРѕСЃС‚СЊ</h2>
        <p>Р’СЃРµ РјР°С‚РµСЂРёР°Р»С‹ СЃР°Р№С‚Р° (С‚РµРєСЃС‚С‹, С„РѕС‚Рѕ, РґРёР·Р°Р№РЅ) СЏРІР»СЏСЋС‚СЃСЏ СЃРѕР±СЃС‚РІРµРЅРЅРѕСЃС‚СЊСЋ {SITE_CONFIG.name}.</p>
        <h2 className="font-serif">3. РљРѕРЅС‚Р°РєС‚С‹</h2>
        <p>РџРѕ РІРѕРїСЂРѕСЃР°Рј: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}

export function PersonalDataPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "РЎРѕРіР»Р°СЃРёРµ РЅР° РѕР±СЂР°Р±РѕС‚РєСѓ РґР°РЅРЅС‹С…" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold font-serif mb-6">РЎРѕРіР»Р°СЃРёРµ РЅР° РѕР±СЂР°Р±РѕС‚РєСѓ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…</h1>
        <p>РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ В«РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓВ» РёР»Рё В«РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃС‡С‘С‚В», РІС‹ РґР°С‘С‚Рµ СЃРѕРіР»Р°СЃРёРµ {SITE_CONFIG.name} РЅР° РѕР±СЂР°Р±РѕС‚РєСѓ РІР°С€РёС… РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С… РІ СЃРѕРѕС‚РІРµС‚СЃС‚РІРёРё СЃ Р—Р°РєРѕРЅРѕРј Р РµСЃРїСѓР±Р»РёРєРё Р‘РµР»Р°СЂСѓСЃСЊ В«Рћ Р·Р°С‰РёС‚Рµ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…В».</p>
        <h2 className="font-serif">Р¦РµР»СЊ РѕР±СЂР°Р±РѕС‚РєРё</h2>
        <p>РћР±СЂР°Р±РѕС‚РєР° РґР°РЅРЅС‹С… РѕСЃСѓС‰РµСЃС‚РІР»СЏРµС‚СЃСЏ РёСЃРєР»СЋС‡РёС‚РµР»СЊРЅРѕ СЃ С†РµР»СЊСЋ РѕР±СЂР°Р±РѕС‚РєРё РІР°С€РµРіРѕ РѕР±СЂР°С‰РµРЅРёСЏ Рё РїСЂРµРґРѕСЃС‚Р°РІР»РµРЅРёСЏ Р·Р°РїСЂРѕС€РµРЅРЅС‹С… СѓСЃР»СѓРі.</p>
        <h2 className="font-serif">Р’Р°С€Рё РїСЂР°РІР°</h2>
        <p>Р’С‹ РІРїСЂР°РІРµ РѕС‚РѕР·РІР°С‚СЊ СЃРІРѕС‘ СЃРѕРіР»Р°СЃРёРµ РІ Р»СЋР±РѕР№ РјРѕРјРµРЅС‚, РЅР°РїСЂР°РІРёРІ Р·Р°РїСЂРѕСЃ РЅР° email: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
      </motion.div>
    </div>
  );
}

export default PrivacyPolicyPage;

