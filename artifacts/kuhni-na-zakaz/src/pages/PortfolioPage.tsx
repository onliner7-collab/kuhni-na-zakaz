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
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Портфолио" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Портфолио выполненных проектов</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Реальные кухни, реальные клиенты. Площадь, стиль, цена — всё честно.
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
                      <span>{item.area} м²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.days} дней</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold text-primary">
                      {item.priceFrom.toLocaleString("ru")}–{item.priceTo.toLocaleString("ru")} BYN
                    </span>
                    <span className="text-xs text-muted-foreground">Смотреть →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-6">Хотите похожий результат? Рассчитаем стоимость под вашу планировку.</p>
        <Button size="lg" asChild data-testid="btn-portfolio-cta">
          <Link href="/contacts">Получить расчёт стоимости</Link>
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
        <h1 className="text-3xl font-bold font-serif mb-4">Проект не найден</h1>
        <Button asChild><Link href="/portfolio">К портфолио</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "Главная", href: "/" },
        { label: "Портфолио", href: "/portfolio" },
        { label: item.title },
      ]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Все проекты
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
              <h3 className="font-bold font-serif text-lg mb-4">О проекте</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Город</dt>
                  <dd className="font-medium">{item.city}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Площадь</dt>
                  <dd className="font-medium">{item.area} м²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Стиль</dt>
                  <dd className="font-medium">{item.style}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Материал</dt>
                  <dd className="font-medium">{item.material}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Срок</dt>
                  <dd className="font-medium">{item.days} дней</dd>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <dt className="text-muted-foreground">Стоимость</dt>
                  <dd className="font-bold text-primary">{item.priceFrom.toLocaleString("ru")}–{item.priceTo.toLocaleString("ru")} BYN</dd>
                </div>
              </dl>
            </div>
            <Button className="w-full" size="lg" data-testid="btn-case-cta">
              Хочу такую же кухню
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold font-serif mb-3">Задача</h2>
            <p className="text-muted-foreground">{item.task}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif mb-3">Решение</h2>
            <p className="text-muted-foreground">{item.solution}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
