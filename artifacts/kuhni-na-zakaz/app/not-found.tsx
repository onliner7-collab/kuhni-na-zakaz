import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="text-center max-w-md px-4">
        <div className="font-serif text-8xl font-bold text-primary/30 mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold mb-4">Страница не найдена</h1>
        <p className="text-muted-foreground mb-8">Возможно, страница была удалена или вы перешли по устаревшей ссылке.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">На главную</Link>
          <Link href="/catalog" className="btn-outline">Каталог кухонь</Link>
        </div>
      </div>
    </div>
  );
}
