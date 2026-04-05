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
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Доставка и монтаж" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Доставка и монтаж кухни</h1>
        <p className="text-muted-foreground text-lg mb-12">Привозим и устанавливаем кухни под ключ. Убираем за собой упаковку и строительный мусор.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-secondary/30 rounded-2xl p-8">
            <Truck className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-bold font-serif mb-4">Доставка</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> По Минску — бесплатно</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> По Минской области — от 50 BYN</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Согласуем удобное время</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Подъём на этаж включён</li>
            </ul>
          </div>
          <div className="bg-secondary/30 rounded-2xl p-8">
            <h2 className="text-xl font-bold font-serif mb-4">Монтаж</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Сборка корпусов и навеска</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Подключение мойки</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Встройка техники</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Уборка после монтажа</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Сдача работ и инструктаж</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">Стоимость монтажа</h2>
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Тип</th>
                  <th className="text-right p-4 font-semibold">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Прямая кухня до 3 м", price: "от 150 BYN" },
                  { type: "Угловая кухня", price: "от 200 BYN" },
                  { type: "П-образная кухня", price: "от 280 BYN" },
                  { type: "Кухня с островом", price: "от 350 BYN" },
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
          <h2 className="text-xl font-bold font-serif mb-2">Готовы к монтажу?</h2>
          <p className="text-muted-foreground mb-4">Согласуем удобную дату доставки и монтажа.</p>
          <Button asChild data-testid="btn-delivery-cta">
            <Link href="/contacts">Записаться на монтаж</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
