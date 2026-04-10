import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Maximize2, Calendar, ArrowLeft } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/lib/data";

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

export function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "РџРѕСЂС‚С„РѕР»РёРѕ" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">РџРѕСЂС‚С„РѕР»РёРѕ РІС‹РїРѕР»РЅРµРЅРЅС‹С… РїСЂРѕРµРєС‚РѕРІ</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Р РµР°Р»СЊРЅС‹Рµ РєСѓС…РЅРё, СЂРµР°Р»СЊРЅС‹Рµ РєР»РёРµРЅС‚С‹. РџР»РѕС‰Р°РґСЊ, СЃС‚РёР»СЊ, С†РµРЅР° вЂ” РІСЃС‘ С‡РµСЃС‚РЅРѕ.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_ITEMS.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/portfolio/${item.slug}`}>
              <Card className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer h-full" data-testid={`card-portfolio-${item.slug}`}>
                <div className="h-52 bg-secondary relative">
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs">{item.style}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h2 className="font-bold text-lg font-serif mb-3 group-hover:text-primary transition-colors leading-tight">{item.title}</h2>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.area} Рї.Рј</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.days} РґРЅРµР№</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold text-primary">
                      {item.priceFrom.toLocaleString("ru")}вЂ“{item.priceTo.toLocaleString("ru")} BYN
                    </span>
                    <span className="text-xs text-muted-foreground">РЎРјРѕС‚СЂРµС‚СЊ в†’</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-6">РҐРѕС‚РёС‚Рµ РїРѕС…РѕР¶РёР№ СЂРµР·СѓР»СЊС‚Р°С‚? Р Р°СЃСЃС‡РёС‚Р°РµРј СЃС‚РѕРёРјРѕСЃС‚СЊ РїРѕРґ РІР°С€Сѓ РїР»Р°РЅРёСЂРѕРІРєСѓ.</p>
        <Button size="lg" asChild data-testid="btn-portfolio-cta">
          <Link href="/contacts">РџРѕР»СѓС‡РёС‚СЊ СЂР°СЃС‡С‘С‚ СЃС‚РѕРёРјРѕСЃС‚Рё</Link>
        </Button>
      </div>
    </div>
  );
}

export function PortfolioItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = PORTFOLIO_ITEMS.find(p => p.slug === slug);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">РџСЂРѕРµРєС‚ РЅРµ РЅР°Р№РґРµРЅ</h1>
        <Button asChild><Link href="/portfolio">Рљ РїРѕСЂС‚С„РѕР»РёРѕ</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "Р“Р»Р°РІРЅР°СЏ", href: "/" },
        { label: "РџРѕСЂС‚С„РѕР»РёРѕ", href: "/portfolio" },
        { label: item.title },
      ]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Р’СЃРµ РїСЂРѕРµРєС‚С‹
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-6">{item.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-2xl h-80 md:h-96 mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/70 rounded-xl h-28" />
              <div className="bg-secondary/70 rounded-xl h-28" />
              <div className="bg-secondary/70 rounded-xl h-28" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold font-serif text-lg mb-4">Рћ РїСЂРѕРµРєС‚Рµ</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Р“РѕСЂРѕРґ</dt>
                  <dd className="font-medium">{item.city}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Р”Р»РёРЅР°</dt>
                  <dd className="font-medium">{item.area} Рї.Рј</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">РЎС‚РёР»СЊ</dt>
                  <dd className="font-medium">{item.style}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">РњР°С‚РµСЂРёР°Р»</dt>
                  <dd className="font-medium">{item.material}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">РЎСЂРѕРє</dt>
                  <dd className="font-medium">{item.days} РґРЅРµР№</dd>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <dt className="text-muted-foreground">РЎС‚РѕРёРјРѕСЃС‚СЊ</dt>
                  <dd className="font-bold text-primary">{item.priceFrom.toLocaleString("ru")}вЂ“{item.priceTo.toLocaleString("ru")} BYN</dd>
                </div>
              </dl>
            </div>
            <Button className="w-full" size="lg" data-testid="btn-case-cta">
              РҐРѕС‡Сѓ С‚Р°РєСѓСЋ Р¶Рµ РєСѓС…РЅСЋ
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold font-serif mb-3">Р—Р°РґР°С‡Р°</h2>
            <p className="text-muted-foreground">{item.task}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif mb-3">Р РµС€РµРЅРёРµ</h2>
            <p className="text-muted-foreground">{item.solution}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PortfolioPage;

