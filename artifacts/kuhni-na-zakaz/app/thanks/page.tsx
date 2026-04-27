import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Спасибо за заявку",
  description: "Заявка на кухню принята. Специалист перезвонит в течение 30 минут в рабочее время и поможет согласовать следующий шаг.",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Спасибо за заявку", path: "/thanks" },
  ]);
  const jsonLdPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Спасибо за заявку",
    url: siteUrl("/thanks"),
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdPage]} />
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-4">Заявка получена!</h1>
        <p className="text-muted-foreground mb-2">Перезвоним в течение 30 минут в рабочее время.</p>
        <p className="text-muted-foreground mb-8">Пн–Сб 9:00–19:00, Вс 10:00–17:00</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">На главную</Link>
          <Link href="/portfolio" className="btn-outline">Смотреть работы</Link>
        </div>
        </div>
      </div>
    </>
  );
}
