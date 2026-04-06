import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Условия использования сайта КухниBY.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Условия использования</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">Условия использования</h1>
        <div className="prose prose-stone max-w-none space-y-6 text-muted-foreground">
          <p>Используя сайт kuhniby.by, вы принимаете настоящие условия использования.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">1. Интеллектуальная собственность</h2>
          <p>Все материалы сайта (тексты, изображения, логотипы) являются собственностью КухниBY. Копирование без разрешения запрещено.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">2. Информация на сайте</h2>
          <p>Цены и сроки носят ориентировочный характер. Точные данные согласуются при личном контакте.</p>
          <h2 className="font-serif text-xl font-semibold text-foreground">3. Ограничение ответственности</h2>
          <p>Мы не несём ответственности за ущерб, возникший в результате использования информации на сайте.</p>
        </div>
      </div>
    </div>
  );
}
