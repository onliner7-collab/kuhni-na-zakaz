import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calculator } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/catalog", label: "Каталог" },
    { href: "/prices", label: "Цены" },
    { href: "/portfolio", label: "Портфолио" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/about", label: "О нас" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            Кухни<span className="text-primary">Minsk</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+375296261547" className="font-medium hover:text-primary transition-colors">
              +375 (29) 626-15-47
            </a>
            <Button data-testid="button-header-calculate">Рассчитать стоимость</Button>
          </div>

          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 absolute w-full left-0 top-16">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+375296261547" className="text-lg font-medium mt-4">
                +375 (29) 626-15-47
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-card border-t py-12 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight mb-4 block">
              Кухни<span className="text-primary">Minsk</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Производство кухонь на заказ в Минске и Минской области. Воплощаем мечты в реальность с гарантией качества.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-serif text-lg">Навигация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalog" className="hover:text-primary">Каталог</Link></li>
              <li><Link href="/portfolio" className="hover:text-primary">Портфолио</Link></li>
              <li><Link href="/prices" className="hover:text-primary">Цены</Link></li>
              <li><Link href="/about" className="hover:text-primary">О компании</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-serif text-lg">Услуги</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/delivery-installation" className="hover:text-primary">Доставка и монтаж</Link></li>
              <li><Link href="/warranty" className="hover:text-primary">Гарантия</Link></li>
              <li><Link href="/styles" className="hover:text-primary">Стили кухонь</Link></li>
              <li><Link href="/materials" className="hover:text-primary">Материалы</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-serif text-lg">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>г. Минск, ул. Притыцкого, 100</li>
              <li><a href="tel:+375296261547" className="hover:text-primary">+375 (29) 626-15-47</a></li>
              <li><a href="mailto:onliner7@gmail.com" className="hover:text-primary">onliner7@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Кухни Minsk. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-primary">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:text-primary">Условия использования</Link>
          </div>
        </div>
      </footer>

      {/* Mobile CTA Panel */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t p-4 flex gap-4 z-50 pb-safe">
        <Button variant="outline" className="flex-1" asChild>
          <a href="tel:+375296261547"><Phone className="w-4 h-4 mr-2" /> Позвонить</a>
        </Button>
        <Button className="flex-1" asChild>
          <Link href="/#contact-form"><Calculator className="w-4 h-4 mr-2" /> Оставить заявку</Link>
        </Button>
      </div>
    </div>
  );
}