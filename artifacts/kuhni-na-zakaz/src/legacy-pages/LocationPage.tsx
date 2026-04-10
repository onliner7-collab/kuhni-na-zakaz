import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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

const LOCATION_DATA: Record<string, {
  title: string;
  cityName: string;
  description: string;
  areas: string[];
  deliveryCost: string;
}> = {
  "minsk": {
    title: "РљСѓС…РЅРё РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРµ",
    cityName: "РњРёРЅСЃРє",
    description: "РР·РіРѕС‚Р°РІР»РёРІР°РµРј РєСѓС…РЅРё РЅР° Р·Р°РєР°Р· РїРѕ РІСЃРµРјСѓ РњРёРЅСЃРєСѓ. РЎРѕР±СЃС‚РІРµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ РІ РіРѕСЂРѕРґРµ вЂ” РЅРёРєР°РєРёС… РЅР°С†РµРЅРѕРє Р·Р° Р»РѕРіРёСЃС‚РёРєСѓ. Р‘РµСЃРїР»Р°С‚РЅС‹Р№ РІС‹РµР·Рґ Р·Р°РјРµСЂС‰РёРєР° РІ Р»СЋР±РѕР№ СЂР°Р№РѕРЅ.",
    areas: ["РџР°СЂС‚РёР·Р°РЅСЃРєРёР№", "РЎРѕРІРµС‚СЃРєРёР№", "РњРѕСЃРєРѕРІСЃРєРёР№", "Р›РµРЅРёРЅСЃРєРёР№", "РџРµСЂРІРѕРјР°Р№СЃРєРёР№", "Р—Р°РІРѕРґСЃРєРѕР№", "РћРєС‚СЏР±СЂСЊСЃРєРёР№", "Р¦РµРЅС‚СЂР°Р»СЊРЅС‹Р№", "РЎСѓС…Р°СЂРµРІРѕ", "РњР°Р»РёРЅРѕРІРєР°", "РЈСЂСѓС‡СЊРµ"],
    deliveryCost: "Р”РѕСЃС‚Р°РІРєР° РїРѕ РњРёРЅСЃРєСѓ вЂ” Р±РµСЃРїР»Р°С‚РЅРѕ",
  },
  "minskaya-oblast": {
    title: "РљСѓС…РЅРё РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё",
    cityName: "РњРёРЅСЃРєР°СЏ РѕР±Р»Р°СЃС‚СЊ",
    description: "Р Р°Р±РѕС‚Р°РµРј РїРѕ РІСЃРµР№ РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё. Р”РѕСЃС‚Р°РІР»СЏРµРј Рё РјРѕРЅС‚РёСЂСѓРµРј РєСѓС…РЅРё РІ Р‘РѕСЂРёСЃРѕРІРµ, РњРѕР»РѕРґРµС‡РЅРѕ, Р–РѕРґРёРЅРѕ, РЎРѕР»РёРіРѕСЂСЃРєРµ, РЎР»СѓС†РєРµ Рё РґСЂСѓРіРёС… РіРѕСЂРѕРґР°С….",
    areas: ["Р‘РѕСЂРёСЃРѕРІ", "РњРѕР»РѕРґРµС‡РЅРѕ", "Р–РѕРґРёРЅРѕ", "РЎРѕР»РёРіРѕСЂСЃРє", "РЎР»СѓС†Рє", "Р”Р·РµСЂР¶РёРЅСЃРє", "Р’РёР»РµР№РєР°", "РљР»РµС†Рє", "РљРѕРїС‹Р»СЊ", "РњР°СЂСЊРёРЅР° Р“РѕСЂРєР°"],
    deliveryCost: "Р”РѕСЃС‚Р°РІРєР° РїРѕ РѕР±Р»Р°СЃС‚Рё вЂ” РѕС‚ 50 BYN",
  },
};

export function LocationPage() {
  const { city } = useParams<{ city: string }>();
  const data = LOCATION_DATA[city];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">РЎС‚СЂР°РЅРёС†Р° РЅРµ РЅР°Р№РґРµРЅР°</h1>
        <Button asChild><Link href="/">РќР° РіР»Р°РІРЅСѓСЋ</Link></Button>
      </div>
    );
  }

  const localPortfolio = PORTFOLIO_ITEMS.filter(item =>
    item.city.toLowerCase().includes(data.cityName.toLowerCase().split(" ")[0])
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "Р“Р»Р°РІРЅР°СЏ", href: "/" },
        { label: data.title },
      ]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{data.title}</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">{data.description}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-secondary/30 rounded-2xl p-6">
            <h2 className="font-bold font-serif text-xl mb-4">Р Р°Р№РѕРЅС‹ РѕР±СЃР»СѓР¶РёРІР°РЅРёСЏ</h2>
            <div className="flex flex-wrap gap-2">
              {data.areas.map((area, i) => (
                <span key={i} className="flex items-center gap-1 text-sm bg-white border rounded-full px-3 py-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="font-bold font-serif text-xl mb-4">РЈСЃР»РѕРІРёСЏ СЂР°Р±РѕС‚С‹ РІ {data.cityName === "РњРёРЅСЃРє" ? "РњРёРЅСЃРєРµ" : "РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё"}</h2>
            <ul className="space-y-3">
              {[
                "Р‘РµСЃРїР»Р°С‚РЅС‹Р№ РІС‹РµР·Рґ Р·Р°РјРµСЂС‰РёРєР°",
                "3D-РїСЂРѕРµРєС‚ Р·Р° 3 СЂР°Р±РѕС‡РёС… РґРЅСЏ",
                data.deliveryCost,
                "РњРѕРЅС‚Р°Р¶ РїРѕРґ РєР»СЋС‡",
                "Р“Р°СЂР°РЅС‚РёСЏ РїРѕ РґРѕРіРѕРІРѕСЂСѓ 2вЂ“5 Р»РµС‚",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-serif text-lg mb-4">РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ</h3>
              <p className="text-sm text-muted-foreground mb-4">РџРµСЂРµР·РІРѕРЅРёРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚ Рё РѕС‚РІРµС‚РёРј РЅР° РІСЃРµ РІРѕРїСЂРѕСЃС‹</p>
              <Button className="w-full mb-3" asChild data-testid="btn-location-cta">
                <Link href="/contacts">РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+375291234567">РџРѕР·РІРѕРЅРёС‚СЊ</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {localPortfolio.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">РќР°С€Рё РїСЂРѕРµРєС‚С‹ РІ {data.cityName === "РњРёРЅСЃРє" ? "РњРёРЅСЃРєРµ" : data.cityName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localPortfolio.map((item) => (
              <Link key={item.slug} href={`/portfolio/${item.slug}`}>
                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-44 bg-secondary rounded-t-xl" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.area} Рї.Рј В· {item.style}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default LocationPage;

