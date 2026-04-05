import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { CheckCircle, XCircle } from "lucide-react";

const STATIC: Record<string, { title: string; description: string; priceFrom: number; pros: string[]; cons: string[]; content: string }> = {
  "mdf": { title: "Фасады МДФ на заказ", description: "МДФ плёнка ПВХ — доступный и популярный материал. От 1 200 BYN.", priceFrom: 1200, pros: ["Доступная цена", "Богатый выбор цветов", "Лёгкий ремонт"], cons: ["Боится влаги на срезах", "Средняя ударопрочность"], content: "МДФ с покрытием ПВХ — самый популярный выбор для кухонных фасадов в Беларуси. Основа из плотного МДФ покрывается плёнкой под любой цвет или текстуру. Срок службы — 10–15 лет при правильном уходе." },
  "plastik": { title: "Пластиковые фасады на заказ", description: "HPL и акрил — прочные и влагостойкие фасады. От 1 500 BYN.", priceFrom: 1500, pros: ["Очень прочные", "Легко моются", "Не выцветают"], cons: ["Видны царапины на глянце", "Сложно ремонтировать"], content: "Пластиковые фасады (HPL и акрил) — идеальный выбор для тех, кто ценит практичность. Поверхность выдерживает механическое воздействие и легко чистится. Глянцевый акрил создаёт эффект зеркала." },
  "emal": { title: "Эмалевые фасады на заказ", description: "Крашеный МДФ с эмалью — премиальный вид. От 2 200 BYN.", priceFrom: 2200, pros: ["Идеально ровная поверхность", "Богатая палитра RAL", "Премиальный вид"], cons: ["Требует бережного ухода", "Дороже МДФ плёнки"], content: "Эмалевые фасады — выбор тех, кто хочет идеальный результат. МДФ-основа покрывается несколькими слоями эмали с шлифовкой между слоями. Поверхность получается гладкой и равномерной." },
  "shpon": { title: "Шпонированные фасады на заказ", description: "Натуральный шпон — тепло дерева без цены массива. От 3 200 BYN.", priceFrom: 3200, pros: ["Натуральный вид дерева", "Уникальная текстура", "Тактильная приятность"], cons: ["Требует специального ухода", "Чувствителен к влаге и теплу"], content: "Шпонированные фасады — это тонкий срез натурального дерева на основе МДФ. Ясень, дуб, орех, венге — каждый лист имеет уникальный рисунок. Тепло дерева за разумные деньги." },
  "egger": { title: "ЛДСП EGGER для кухонь", description: "Немецкий ЛДСП EGGER — надёжный и доступный. От 900 BYN.", priceFrom: 900, pros: ["Бюджетный вариант", "Сотни декоров", "Прочность и стабильность"], cons: ["Ограниченные формы", "Нельзя гнуть или фрезеровать"], content: "ЛДСП EGGER — немецкий стандарт качества. Используется для корпусов и плоских фасадов. Сотни декоров: под дерево, бетон, камень. Оптимальный выбор для бюджетных кухонь." },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const m = await prisma.materialPage.findUnique({ where: { slug } });
    if (m) return { title: m.seoTitle || m.title, description: m.seoDescription || m.description, alternates: { canonical: `/materials/${slug}` } };
  } catch {}
  const s = STATIC[slug];
  if (s) return { title: s.title, description: s.description, alternates: { canonical: `/materials/${slug}` } };
  return { title: "Материал для кухни" };
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;
  let data: typeof STATIC[string] | null = null;
  try {
    const m = await prisma.materialPage.findUnique({ where: { slug } });
    if (m && m.published) data = { title: m.title, description: m.description, priceFrom: m.priceFrom, pros: m.pros, cons: m.cons, content: m.content };
  } catch {}
  if (!data) data = STATIC[slug] || null;
  if (!data) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <Link href="/materials" className="hover:text-primary">Материалы</Link><span>/</span>
          <span className="text-foreground">{data.title.split(" ").slice(0, 2).join(" ")}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
            <div className="h-64 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl flex items-center justify-center mb-6">
              <span className="text-stone-400">Образец материала</span>
            </div>
            <p className="text-muted-foreground mb-6">{data.content}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card-base p-5">
                <h2 className="font-semibold mb-3 text-green-700">Плюсы</h2>
                <ul className="space-y-2">
                  {data.pros.map((p) => <li key={p} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />{p}</li>)}
                </ul>
              </div>
              <div className="card-base p-5">
                <h2 className="font-semibold mb-3 text-red-600">Минусы</h2>
                <ul className="space-y-2">
                  {data.cons.map((c) => <li key={c} className="flex items-start gap-2 text-sm"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />{c}</li>)}
                </ul>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <p className="font-semibold text-primary">Кухня из {data.title.toLowerCase()}: от {data.priceFrom.toLocaleString("ru")} BYN</p>
            </div>
          </div>
          <div>
            <div className="card-base p-6 sticky top-20">
              <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
              <ContactForm source={`materials/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
