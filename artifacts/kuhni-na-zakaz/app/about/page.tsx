import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "О компании — кухни на заказ в Минске",
  description: "КухниMinsk — производитель кухонь на заказ в Минске. Собственное производство, опыт с 2015 года, более 1000 реализованных проектов.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { n: "10+", t: "лет на рынке", d: "Работаем с 2015 года" },
  { n: "1000+", t: "кухонь изготовлено", d: "За всё время работы" },
  { n: "5 лет", t: "гарантия", d: "На фурнитуру Blum" },
  { n: "14 дней", t: "минимальный срок", d: "Для стандартных моделей" },
];

const VALUES = [
  { t: "Честность", d: "Называем реальные цены. Цена в договоре = цена на момент сдачи." },
  { t: "Качество", d: "Используем только проверенные материалы: EGGER, Blum, Hettich." },
  { t: "Ответственность", d: "Берём на себя гарантийные обязательства и выполняем их." },
  { t: "Уважение", d: "Приходим вовремя, убираем после монтажа, не оставляем вопросов открытыми." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "КухниMinsk",
  foundingDate: "2015",
  description: "Производитель кухонь на заказ в Минске и Минской области",
  telephone: "+375291234567",
  email: "info@kuhniminsk.by",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Минск",
    addressCountry: "BY",
    streetAddress: "ул. Притыцкого, 100",
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">О компании</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-6">О компании</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {FACTS.map((f) => (
              <div key={f.t} className="card-base p-5 text-center">
                <div className="font-serif text-3xl font-bold text-primary">{f.n}</div>
                <div className="font-medium text-sm mt-1">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Кто мы</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>КухниMinsk — производитель кухонь на заказ в Минске и Минской области. Работаем с 2015 года, изготовили более 1 000 кухонь.</p>
                <p>У нас собственное производство: фрезерные станки с ЧПУ, кромкооблицовочное и покрасочное оборудование. Это позволяет контролировать качество на каждом этапе.</p>
                <p>Работаем напрямую с клиентом — без посредников. Замер, проект, производство, монтаж — всё делаем сами.</p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Наши ценности</h2>
              <div className="space-y-4">
                {VALUES.map((v) => (
                  <div key={v.t} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{v.t}</div>
                      <div className="text-sm text-muted-foreground">{v.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8">Свяжитесь с нами</h2>
            <ContactForm source="about" />
          </div>
        </div>
      </div>
    </>
  );
}
