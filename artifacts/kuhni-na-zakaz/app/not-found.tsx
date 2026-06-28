import type { Metadata } from "next";
import Link from "@/components/navigation/Link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const importantLinks = [
  { href: "/catalog", label: "Каталог кухонь" },
  { href: "/prices", label: "Цены" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/contacts", label: "Контакты" },
  { href: "/blog", label: "Блог" },
];

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="text-center max-w-2xl px-4">
        <div className="font-serif text-8xl font-bold text-primary/30 mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold mb-4">Страница не найдена</h1>
        <p className="text-muted-foreground mb-8">
          Возможно, страница была удалена или вы перешли по устаревшей ссылке.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            На главную
          </Link>
          <Link href="/catalog" className="btn-outline">
            Каталог кухонь
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {importantLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
