import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";

const STATIC_CASES: Record<string, { title: string; city: string; area: number; style: string; material: string; priceFrom: number; priceTo: number; days: number; description: string; task: string; solution: string }> = {
  "uglovaya-kuhnya-minsk-kirova": { title: "Угловая кухня в стиле минимализм", city: "Минск, ул. Кирова", area: 14, style: "Минимализм", material: "Эмаль матовая", priceFrom: 2800, priceTo: 3200, days: 21, description: "Угловая кухня 14 м² в двухкомнатной квартире.", task: "Разместить максимум хранения на 4 погонных метрах без ощущения тесноты.", solution: "Закрытые фасады до потолка, встроенная техника, скрытые ручки." },
  "pryamaya-kuhnya-borisov": { title: "Прямая кухня в скандинавском стиле", city: "Борисов", area: 10, style: "Скандинавский", material: "МДФ плёнка", priceFrom: 1800, priceTo: 2100, days: 18, description: "Прямая кухня 10 м² в частном доме.", task: "Сделать функциональную кухню для большой семьи.", solution: "Светлые фасады с плёнкой, удобная мойка, выдвижные ящики с полным ходом." },
  "kuhnya-s-ostrovom-minsk-partizansky": { title: "Кухня с островом — проект для новостройки", city: "Минск, Партизанский р-н", area: 22, style: "Современный", material: "Шпон ясень", priceFrom: 5500, priceTo: 6200, days: 30, description: "Просторная кухня-гостиная 22 м² в новостройке.", task: "Создать открытое пространство с функциональным островом.", solution: "Остров 160×90 см совмещает зону приготовления и барную стойку на 4 места." },
  "klassicheskaya-kuhnya-molodechno": { title: "Классическая кухня в частном доме", city: "Молодечно", area: 18, style: "Классический", material: "МДФ крашеный", priceFrom: 4200, priceTo: 4800, days: 28, description: "Классическая кухня с патиной 18 м² в загородном доме.", task: "Воссоздать ощущение классики с современными удобствами.", solution: "Фасады с фрезеровкой и патиной, карнизы, встроенная посудомойка." },
  "malenkaya-kuhnya-studiya": { title: "Кухня для квартиры-студии, 6 м²", city: "Минск, Сухарево", area: 6, style: "Минимализм", material: "Пластик глянец", priceFrom: 1200, priceTo: 1500, days: 14, description: "Компактная кухня для студии.", task: "Уместить всё необходимое на 6 квадратах.", solution: "Навесные шкафы до потолка, встроенная техника, складная столешница." },
  "kuhnya-do-potolka-minsk-vostok": { title: "Кухня до потолка — максимум хранения", city: "Минск, Восток", area: 12, style: "Современный", material: "Эмаль матовая", priceFrom: 3100, priceTo: 3600, days: 24, description: "Кухня с фасадами до потолка 12 м².", task: "Обеспечить хранение для большого количества посуды.", solution: "Шкафы высотой 2,7 м, pull-out ящики, встроенный холодильник." },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const c = await prisma.portfolioCase.findUnique({ where: { slug } });
    if (c) return { title: c.seoTitle || c.title, description: c.seoDescription || c.description.slice(0, 160), alternates: { canonical: `/portfolio/${slug}` } };
  } catch {}
  const s = STATIC_CASES[slug];
  if (s) return { title: s.title, description: s.description, alternates: { canonical: `/portfolio/${slug}` } };
  return { title: "Проект кухни" };
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params;
  let data: typeof STATIC_CASES[string] | null = null;
  try {
    const c = await prisma.portfolioCase.findUnique({ where: { slug } });
    if (c && c.published) data = { title: c.title, city: c.city, area: c.area, style: c.style, material: c.material, priceFrom: c.priceFrom, priceTo: c.priceTo, days: c.days, description: c.description, task: c.task, solution: c.solution };
  } catch {}
  if (!data) data = STATIC_CASES[slug] || null;
  if (!data) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <Link href="/portfolio" className="hover:text-primary">Портфолио</Link><span>/</span>
          <span className="text-foreground">{data.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
              <span>📍 {data.city}</span><span>📐 {data.area} м²</span>
              <span>🎨 {data.style}</span><span>🪵 {data.material}</span><span>📅 {data.days} дней</span>
            </div>
            <div className="h-80 bg-gradient-to-br from-stone-200 to-amber-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-stone-400">Фото проекта</span>
            </div>
            <p className="text-muted-foreground mb-6">{data.description}</p>
            <div className="space-y-4">
              <div className="card-base p-5"><h2 className="font-semibold mb-2">Задача</h2><p className="text-sm text-muted-foreground">{data.task}</p></div>
              <div className="card-base p-5"><h2 className="font-semibold mb-2">Решение</h2><p className="text-sm text-muted-foreground">{data.solution}</p></div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                <p className="font-semibold text-primary">Стоимость: {data.priceFrom.toLocaleString("ru")}–{data.priceTo.toLocaleString("ru")} BYN</p>
              </div>
            </div>
          </div>
          <div>
            <div className="card-base p-6 sticky top-20">
              <h2 className="font-serif text-xl font-semibold mb-4">Хотите похожий проект?</h2>
              <ContactForm source={`portfolio/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
