import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Гарантия на кухни — 5 лет на фурнитуру",
  description: "Гарантия на кухни на заказ: 5 лет на фурнитуру Blum, 2 года на корпус и фасады, 1 год на монтажные работы.",
  alternates: { canonical: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Гарантия</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-6">Гарантия</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { years: "5 лет", label: "на фурнитуру Blum" },
            { years: "2 года", label: "на корпус и фасады" },
            { years: "1 год", label: "на монтажные работы" },
          ].map((g) => (
            <div key={g.label} className="card-base p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-serif text-3xl font-bold text-primary">{g.years}</div>
              <div className="text-sm text-muted-foreground mt-1">{g.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Что входит в гарантийное обслуживание</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Регулировка петель, доводчиков, ящиков</li>
              <li>• Замена дефектных фасадов и элементов корпуса</li>
              <li>• Замена фурнитуры при заводском браке</li>
              <li>• Устранение недостатков монтажа</li>
            </ul>
          </div>
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Что не входит в гарантию</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Механические повреждения от ударов и порезов</li>
              <li>• Повреждения от воды (если не соблюдены правила эксплуатации)</li>
              <li>• Самостоятельное вмешательство в конструкцию</li>
              <li>• Естественный износ материалов</li>
            </ul>
          </div>
          <div className="card-base p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Как обратиться по гарантии</h2>
            <p className="text-sm text-muted-foreground">Позвоните нам по телефону <a href="tel:+375291234567" className="text-primary hover:underline">+375 (29) 123-45-67</a> или напишите на <a href="mailto:info@kuhniby.by" className="text-primary hover:underline">info@kuhniby.by</a>. Укажите дату покупки и опишите проблему. Свяжемся в течение 1 рабочего дня.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
