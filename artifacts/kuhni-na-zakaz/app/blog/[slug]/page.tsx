import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/sections/ContactForm";

const STATIC_POSTS: Record<string, { title: string; excerpt: string; category: string; readTime: number; content: string }> = {
  "kak-vybrat-kuhnyu": {
    title: "Как выбрать кухню на заказ: 7 вопросов перед заказом",
    excerpt: "Рассказываем о ключевых вещах, которые нужно продумать до встречи с дизайнером.",
    category: "Советы", readTime: 6,
    content: `Заказ кухни — серьёзное решение. Вот 7 вопросов, которые помогут вам подготовиться.

**1. Какая планировка?** Угловая, прямая, П-образная? Это определяет конфигурацию гарнитура.

**2. Какой бюджет?** Чётко определите диапазон: материалы, фурнитура и монтаж влияют на итоговую цену.

**3. Какие функции нужны?** Место для посудомоечной машины, духовки, большого холодильника?

**4. Какой стиль?** Минимализм, классика, скандинавский? Это повлияет на выбор фасадов.

**5. Какой материал?** МДФ, пластик, эмаль, шпон — у каждого свои плюсы и минусы.

**6. Есть ли нестандартные условия?** Потолки выше 2,7 м, ниши, колонны, неровные стены.

**7. Когда нужна кухня?** Срок изготовления влияет на выбор материалов и доступность мастеров.`
  },
  "skolko-stoit-kuhnya-na-zakaz": {
    title: "Сколько стоит кухня на заказ в Минске: честные цифры",
    excerpt: "Разбираем из чего складывается цена: материалы, фурнитура, монтаж, доставка.",
    category: "Цены", readTime: 8,
    content: `Цена кухни на заказ складывается из нескольких составляющих. Разберём каждую.

**Корпус (каркас)**: 30–40% от стоимости. Чаще всего ЛДСП EGGER или Blum.

**Фасады**: 25–35% от стоимости. МДФ плёнка — бюджетно. Эмаль — дороже, но красивее.

**Столешница**: 10–15%. Постформинг — недорого. Керамика — премиум.

**Фурнитура**: 10–20%. Blum — надёжно, Hettich — компромисс, GTV — эконом.

**Монтаж и доставка**: фиксированная ставка от 200 BYN.

**Итого**: прямая кухня из МДФ — от 1 200 BYN. Угловая из эмали — от 2 500 BYN. С островом из шпона — от 5 000 BYN.`
  },
  "kuhnya-dlya-malenkoy-kvartiry": {
    title: "Кухня для маленькой квартиры: 10 приёмов дизайнеров",
    excerpt: "Как сделать кухню функциональной и красивой, если площадь всего 6–9 м².",
    category: "Дизайн", readTime: 7,
    content: `Маленькая кухня — это задача, которую решали сотни раз. Вот что реально работает.

1. **Шкафы до потолка** — используйте каждый сантиметр высоты.
2. **Встроенная техника** — духовка, посудомойка, холодильник прячутся за фасадами.
3. **Складная столешница** — раскладывается при необходимости.
4. **Светлые фасады** — зрительно расширяют пространство.
5. **Скрытые ручки** — нет выступающих деталей, которые мешают движению.
6. **Выдвижные ящики вместо полок** — удобнее и вместительнее.
7. **Фартук до потолка** — лёгкий и визуально удлиняет пространство.
8. **Угловые решения** — карусель или выдвижная система.
9. **Магнитный держатель ножей** — освобождает столешницу.
10. **Правило рабочего треугольника** — мойка, плита, холодильник на минимальном расстоянии.`
  },
  "kakie-fasady-luchshe": {
    title: "Какие фасады лучше: МДФ, пластик, эмаль или шпон",
    excerpt: "Сравниваем популярные материалы для кухонных фасадов по цене, прочности и внешнему виду.",
    category: "Материалы", readTime: 9,
    content: `Выбор фасадов — ключевое решение при заказе кухни. Разберём 4 основных варианта.

**МДФ с плёнкой ПВХ**: самый популярный. Цена от 1 200 BYN. Богатый выбор декоров. Боится влаги на торцах. Средний ресурс — 10–15 лет.

**Пластик (HPL/акрил)**: прочный и влагостойкий. Цена от 1 500 BYN. Легко моется. Видны царапины на глянце.

**Эмаль (крашеный МДФ)**: премиальный вид. Цена от 2 200 BYN. Идеально ровная поверхность. Требует бережного ухода. Срок — 15–20 лет.

**Шпон**: натуральный срез дерева. Цена от 3 200 BYN. Тепло и уникальная текстура. Требует специального ухода. Не любит влагу.

**Вывод**: для бюджетной кухни — МДФ плёнка. Для баланса цены и качества — пластик. Для долговечности — эмаль. Для премиума — шпон.`
  },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p) return { title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt, alternates: { canonical: `/blog/${slug}` } };
  } catch {}
  const s = STATIC_POSTS[slug];
  if (s) return { title: s.title, description: s.excerpt, alternates: { canonical: `/blog/${slug}` } };
  return { title: "Статья" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let data: { title: string; excerpt: string; category: string; readTime: number; content: string } | null = null;
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p && p.published) data = { title: p.title, excerpt: p.excerpt, category: p.category, readTime: p.readTime, content: p.content };
  } catch {}
  if (!data) data = STATIC_POSTS[slug] || null;
  if (!data) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary">Блог</Link><span>/</span>
          <span className="text-foreground line-clamp-1">{data.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge>{data.category}</Badge>
              <span className="text-xs text-muted-foreground">{data.readTime} мин чтения</span>
            </div>
            <h1 className="font-serif text-4xl font-bold mb-6 leading-tight">{data.title}</h1>
            <div className="h-64 bg-gradient-to-br from-stone-200 to-amber-50 rounded-xl flex items-center justify-center mb-8">
              <span className="text-stone-400">Иллюстрация к статье</span>
            </div>
            <div className="prose prose-stone max-w-none">
              {data.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">{para}</p>
              ))}
            </div>
          </article>
          <aside>
            <div className="card-base p-6 sticky top-20">
              <h2 className="font-serif text-xl font-semibold mb-4">Нужна консультация?</h2>
              <p className="text-sm text-muted-foreground mb-4">Замер и проект — бесплатно</p>
              <ContactForm source={`blog/${slug}`} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
