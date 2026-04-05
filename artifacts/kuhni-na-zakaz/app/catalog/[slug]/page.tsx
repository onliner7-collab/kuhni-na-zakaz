import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { CheckCircle } from "lucide-react";

const STATIC_CATEGORIES: Record<string, { title: string; description: string; priceFrom: number; features: string[]; content: string }> = {
  "uglovye-kuhni": {
    title: "Угловые кухни на заказ в Минске",
    description: "Угловые кухни на заказ в Минске — оптимальное использование угловых зон. От 1 800 BYN. Замер бесплатно.",
    priceFrom: 1800,
    features: ["Эффективное использование угла", "Вместительность", "Зонирование рабочей поверхности", "Любые размеры"],
    content: "Угловая кухня — одно из самых популярных решений для жилых квартир. Она позволяет рационально использовать угловую зону и создать эргономичное рабочее пространство. Подходит для кухонь площадью от 8 м².",
  },
  "pryamye-kuhni": {
    title: "Прямые кухни на заказ в Минске",
    description: "Прямые кухни на заказ в Минске — классика дизайна. От 1 200 BYN. Замер бесплатно.",
    priceFrom: 1200,
    features: ["Простой монтаж", "Лаконичность", "Подходят для узких кухонь", "Экономичность"],
    content: "Прямая кухня — классическое решение для узких и небольших кухонь. Все рабочие зоны расположены вдоль одной стены, что упрощает планировку и позволяет эффективно использовать пространство.",
  },
  "p-obraznye-kuhni": {
    title: "П-образные кухни на заказ в Минске",
    description: "П-образные кухни на заказ — максимум рабочего пространства. От 3 500 BYN. Замер бесплатно.",
    priceFrom: 3500,
    features: ["Максимум хранения", "Большая рабочая поверхность", "Разделение зон", "Для просторных кухонь"],
    content: "П-образная кухня обеспечивает максимальное рабочее и хранительное пространство. Идеальна для кухонь площадью от 14 м² и больших семей.",
  },
  "kuhni-s-ostrovom": {
    title: "Кухни с островом на заказ в Минске",
    description: "Кухни с островом на заказ — для открытых пространств. От 4 500 BYN. Замер бесплатно.",
    priceFrom: 4500,
    features: ["Барная стойка", "Дополнительные рабочие поверхности", "Место для хранения", "Совмещение зон"],
    content: "Кухня с островом — решение для просторных кухонь-гостиных. Остров совмещает рабочую зону, место для хранения и барную стойку для совместного времяпровождения.",
  },
  "malenkie-kuhni": {
    title: "Маленькие кухни на заказ в Минске",
    description: "Маленькие кухни на заказ до 8 м² — Минск и область. От 900 BYN. Замер бесплатно.",
    priceFrom: 900,
    features: ["Компактные решения", "Встроенная техника", "Вертикальное хранение", "Складные элементы"],
    content: "Маленькая кухня — это не ограничение, а задача для дизайнера. Мы создаём кухни на 6–8 м², в которых продуманы каждый сантиметр и все функции.",
  },
  "kuhni-do-potolka": {
    title: "Кухни до потолка на заказ в Минске",
    description: "Кухни с фасадами до потолка — максимум хранения. От 2 200 BYN. Замер бесплатно.",
    priceFrom: 2200,
    features: ["Максимум высоты", "Нет пыли на верхних шкафах", "Монолитный вид", "Дополнительное хранение"],
    content: "Кухня с фасадами до самого потолка — современное и функциональное решение. Нет открытого пространства сверху — нет пыли. Максимум места для хранения.",
  },
  "kuhni-bez-ruchek": {
    title: "Кухни без ручек на заказ в Минске",
    description: "Кухни без ручек — современный дизайн. Нажимные механизмы или J-профиль. От 2 000 BYN.",
    priceFrom: 2000,
    features: ["Чистый дизайн", "Удобный уход", "Современный вид", "Нажимные механизмы"],
    content: "Кухня без ручек — выбор тех, кто ценит лаконичный современный дизайн. Фасады открываются нажатием или с помощью J-профиля. Легко содержать в чистоте.",
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const kitchen = await prisma.kitchen.findUnique({ where: { slug } });
    if (kitchen) {
      return {
        title: kitchen.seoTitle || kitchen.title,
        description: kitchen.seoDescription || kitchen.description.slice(0, 160),
        alternates: { canonical: `/catalog/${slug}` },
      };
    }
  } catch {}

  const cat = STATIC_CATEGORIES[slug];
  if (cat) {
    return {
      title: cat.title,
      description: cat.description,
      alternates: { canonical: `/catalog/${slug}` },
    };
  }
  return { title: "Кухня на заказ" };
}

export default async function CatalogItemPage({ params }: Props) {
  const { slug } = await params;

  let data: { title: string; description: string; priceFrom: number; features: string[]; content: string } | null = null;

  try {
    const kitchen = await prisma.kitchen.findUnique({ where: { slug } });
    if (kitchen && kitchen.published) {
      data = {
        title: kitchen.title,
        description: kitchen.description,
        priceFrom: kitchen.priceFrom,
        features: kitchen.features,
        content: kitchen.description,
      };
    }
  } catch {}

  if (!data) {
    data = STATIC_CATEGORIES[slug] || null;
  }

  if (!data) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span className="text-foreground">{data.title.split(" ").slice(0, 3).join(" ")}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
            <p className="text-muted-foreground text-lg mb-6">{data.content}</p>
            <div className="card-base p-6 mb-6">
              <h2 className="font-semibold mb-4">Особенности</h2>
              <ul className="space-y-2">
                {data.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="font-semibold text-primary text-lg">Стоимость: от {data.priceFrom.toLocaleString("ru")} BYN</p>
              <p className="text-sm text-muted-foreground mt-1">Точная цена — после замера и согласования проекта</p>
            </div>
          </div>
          <div>
            <div className="card-base p-6 sticky top-20">
              <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
              <p className="text-sm text-muted-foreground mb-4">Бесплатно и без обязательств</p>
              <ContactForm source={`catalog/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
