import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATALOG_CATEGORIES } from "@/lib/data";

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-muted-foreground mb-8" aria-label="Навигация">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Каталог кухонь на заказ</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Изготавливаем кухни под размер вашего помещения. Выберите конфигурацию и рассчитайте стоимость.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATALOG_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/catalog/${cat.slug}`}>
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer h-full" data-testid={`card-catalog-${cat.slug}`}>
                <div className="h-52 bg-secondary relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium text-sm">Смотреть варианты</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="font-bold text-xl font-serif mb-2 group-hover:text-primary transition-colors">{cat.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">от {cat.priceFrom.toLocaleString("ru")} BYN</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold font-serif mb-3">Не нашли подходящий вариант?</h2>
        <p className="text-muted-foreground mb-6">Опишите задачу — предложим решение под ваш размер и бюджет.</p>
        <Button size="lg" asChild data-testid="btn-catalog-cta">
          <Link href="/contacts">Получить бесплатную консультацию</Link>
        </Button>
      </div>
    </div>
  );
}

export function CatalogItemPage() {
  const { category } = useParams<{ category: string }>();
  const cat = CATALOG_CATEGORIES.find(c => c.slug === category);

  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">Категория не найдена</h1>
        <Link href="/catalog"><Button>В каталог</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "Главная", href: "/" },
        { label: "Каталог", href: "/catalog" },
        { label: cat.title },
      ]} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-secondary rounded-2xl h-80 lg:h-full min-h-64" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">{cat.title}</h1>
          <p className="text-muted-foreground text-lg mb-6">{cat.description}</p>
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Особенности:</h3>
            <ul className="space-y-2">
              {cat.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-2xl font-bold mb-6">от {cat.priceFrom.toLocaleString("ru")} BYN</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" data-testid="btn-category-calculate">Рассчитать стоимость</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/portfolio">Смотреть портфолио</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
