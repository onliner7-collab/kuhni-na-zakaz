import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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

const LOCATION_DATA: Record<string, {
  title: string;
  cityName: string;
  description: string;
  areas: string[];
  deliveryCost: string;
}> = {
  "minsk": {
    title: "Кухни на заказ в Минске",
    cityName: "Минск",
    description: "Изготавливаем кухни на заказ по всему Минску. Собственное производство в городе — никаких наценок за логистику. Бесплатный выезд замерщика в любой район.",
    areas: ["Партизанский", "Советский", "Московский", "Ленинский", "Первомайский", "Заводской", "Октябрьский", "Центральный", "Сухарево", "Малиновка", "Уручье"],
    deliveryCost: "Доставка по Минску — бесплатно",
  },
  "minskaya-oblast": {
    title: "Кухни на заказ в Минской области",
    cityName: "Минская область",
    description: "Работаем по всей Минской области. Доставляем и монтируем кухни в Борисове, Молодечно, Жодино, Солигорске, Слуцке и других городах.",
    areas: ["Борисов", "Молодечно", "Жодино", "Солигорск", "Слуцк", "Дзержинск", "Вилейка", "Клецк", "Копыль", "Марьина Горка"],
    deliveryCost: "Доставка по области — от 50 BYN",
  },
};

export function LocationPage() {
  const { city } = useParams<{ city: string }>();
  const data = LOCATION_DATA[city];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">Страница не найдена</h1>
        <Button asChild><Link href="/">На главную</Link></Button>
      </div>
    );
  }

  const localPortfolio = PORTFOLIO_ITEMS.filter(item =>
    item.city.toLowerCase().includes(data.cityName.toLowerCase().split(" ")[0])
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[
        { label: "Главная", href: "/" },
        { label: data.title },
      ]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{data.title}</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">{data.description}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-secondary/30 rounded-2xl p-6">
            <h2 className="font-bold font-serif text-xl mb-4">Районы обслуживания</h2>
            <div className="flex flex-wrap gap-2">
              {data.areas.map((area, i) => (
                <span key={i} className="flex items-center gap-1 text-sm bg-white border rounded-full px-3 py-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="font-bold font-serif text-xl mb-4">Условия работы в {data.cityName === "Минск" ? "Минске" : "Минской области"}</h2>
            <ul className="space-y-3">
              {[
                "Бесплатный выезд замерщика",
                "3D-проект за 3 рабочих дня",
                data.deliveryCost,
                "Монтаж под ключ",
                "Гарантия по договору 2–5 лет",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-serif text-lg mb-4">Оставить заявку</h3>
              <p className="text-sm text-muted-foreground mb-4">Перезвоним в течение 30 минут и ответим на все вопросы</p>
              <Button className="w-full mb-3" asChild data-testid="btn-location-cta">
                <Link href="/contacts">Оставить заявку</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+375291234567">Позвонить</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {localPortfolio.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif mb-6">Наши проекты в {data.cityName === "Минск" ? "Минске" : data.cityName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localPortfolio.map((item) => (
              <Link key={item.slug} href={`/portfolio/${item.slug}`}>
                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-44 bg-secondary rounded-t-xl" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.area} п.м · {item.style}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
