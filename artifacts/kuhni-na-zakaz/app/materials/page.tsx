import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Материалы для кухонь — МДФ, эмаль, шпон, пластик",
  description: "Материалы для кухонных фасадов: МДФ плёнка, пластик HPL, эмаль матовая, шпон, ЛДСП EGGER. Цены и сравнение.",
  alternates: { canonical: "/materials" },
};

const STATIC_MATERIALS = [
  { slug: "mdf", title: "Фасады МДФ", description: "МДФ с плёнкой ПВХ — самый популярный материал. Богатый выбор декоров.", priceFrom: 1200, pros: ["Доступная цена", "Богатый выбор цветов", "Лёгкий ремонт"], cons: ["Боится влаги на срезах", "Средняя ударопрочность"] },
  { slug: "plastik", title: "Пластиковые фасады", description: "Пластик HPL и акрил — прочные, влагостойкие, лёгкие в уходе.", priceFrom: 1500, pros: ["Очень прочные", "Легко моются", "Не выцветают"], cons: ["Видны царапины", "Сложно ремонтировать"] },
  { slug: "emal", title: "Эмалевые фасады", description: "Крашеные МДФ-фасады. Идеально ровная поверхность, премиальный вид.", priceFrom: 2200, pros: ["Ровная поверхность", "Богатая палитра", "Премиальный вид"], cons: ["Выше цена", "Требует бережного ухода"] },
  { slug: "shpon", title: "Шпонированные фасады", description: "Натуральный срез дерева на основе МДФ. Тепло и природность.", priceFrom: 3200, pros: ["Натуральный вид", "Тактильная приятность", "Уникальная текстура"], cons: ["Требует специального ухода", "Чувствителен к влаге"] },
  { slug: "egger", title: "EGGER (ЛДСП)", description: "Немецкий ЛДСП. Надёжный, декоративный, сотни текстур.", priceFrom: 900, pros: ["Бюджетный вариант", "Широкий выбор декоров", "Прочность"], cons: ["Ограниченные формы", "Нельзя гнуть"] },
];

async function getMaterials() {
  try {
    return await prisma.materialPage.findMany({ where: { published: true }, orderBy: { id: "asc" } });
  } catch {
    return [];
  }
}

export default async function MaterialsPage() {
  const materials = await getMaterials();
  const display = materials.length > 0 ? materials : STATIC_MATERIALS;

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Материалы</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-4">Материалы для кухонь</h1>
        <p className="text-muted-foreground mb-10">Сравните материалы по цене, прочности и внешнему виду</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((m) => (
            <Link key={m.slug} href={`/materials/${m.slug}`} className="card-base hover:shadow-md transition-shadow group">
              <div className="h-44 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <span className="text-stone-400 text-sm">Образец материала</span>
              </div>
              <div className="p-5">
                <h2 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{m.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                <p className="text-primary font-semibold mt-2 text-sm">от {m.priceFrom.toLocaleString("ru")} BYN</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
