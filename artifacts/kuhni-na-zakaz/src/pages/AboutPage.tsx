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
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
      <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">О компании КухниMinsk</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-lg text-muted-foreground mb-4">
                КухниMinsk — производственная компания по изготовлению кухонь на заказ в Минске и Минской области.
                Работаем с 2018 года. За это время сделали более 300 кухонь.
              </p>
              <p className="text-muted-foreground mb-6">
                Мы не посредники — у нас собственное производство. Это значит, что вы получаете честную цену и полный контроль над качеством на каждом этапе.
              </p>
              <ul className="space-y-3">
                {[
                  "Собственное производство в Минске",
                  "Бесплатный замер и 3D-проект",
                  "Гарантия 2–5 лет по договору",
                  "Монтаж под ключ включая уборку",
                  "Работаем по всей Минской области",
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
              { number: "300+", label: "Проектов выполнено" },
              { number: "7 лет", label: "На рынке" },
              { number: "4.9/5", label: "Средний рейтинг" },
              { number: "14 дн", label: "Срок от замера" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-secondary/30 rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold font-serif mb-2">Хотите узнать больше?</h2>
              <p className="text-muted-foreground">Приезжайте в наш шоурум в Минске. Покажем образцы материалов и ответим на все вопросы.</p>
            </div>
            <Button size="lg" className="flex-shrink-0" asChild data-testid="btn-about-cta">
              <Link href="/contacts">Записаться на встречу</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
