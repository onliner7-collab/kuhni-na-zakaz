import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка и монтаж кухни в Минске",
  description: "Доставка и монтаж кухни под ключ в Минске и Минской области. Цены на монтаж от 200 BYN.",
  alternates: { canonical: "/delivery-installation" },
};

export default function DeliveryPage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Доставка и монтаж</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-6">Доставка и монтаж</h1>
        <div className="space-y-8">
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Доставка</h2>
            <ul className="space-y-3">
              {["Доставка по Минску — бесплатно при заказе от 3 000 BYN", "Доставка по Минской области — от 50 BYN (зависит от расстояния)", "Доставляем в удобное для вас время", "Заранее согласуем дату и время"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Монтаж</h2>
            <p className="text-muted-foreground mb-4">Монтаж включает: распаковку, сборку корпусов, навеску шкафов, регулировку петель и ящиков, установку столешницы, подключение мойки.</p>
            <ul className="space-y-3">
              {["Монтаж стандартной кухни — от 200 BYN", "Сложный монтаж (П-образная, с островом) — от 350 BYN", "Демонтаж старой кухни — от 100 BYN", "Подключение встроенной техники — от 50 BYN за единицу"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">После монтажа</h2>
            <ul className="space-y-3">
              {["Убираем строительный мусор и упаковку", "Проверяем работу всех механизмов", "Регулируем петли и доводчики", "Инструктируем по уходу за кухней", "Оставляем контакты для гарантийных вопросов"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
