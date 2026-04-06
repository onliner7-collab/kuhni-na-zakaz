import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/sections/ContactForm";
import { renderContent } from "@/lib/render-content";

const STATIC_POSTS: Record<string, { title: string; excerpt: string; category: string; readTime: number; content: string; relatedCaseSlugs?: string[]; relatedStyleSlugs?: string[]; relatedScenarioSlugs?: string[] }> = {
  "kak-vybrat-kuhnyu": {
    title: "Как выбрать кухню на заказ: 7 вопросов перед заказом",
    excerpt: "Рассказываем о ключевых вещах, которые нужно продумать до встречи с дизайнером.",
    category: "Советы", readTime: 6,
    relatedStyleSlugs: ["minimalizm", "skandinavskie"],
    relatedScenarioSlugs: ["semya-s-detmi", "lyublyu-gotovit"],
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
    relatedStyleSlugs: ["sovremennye", "minimalizm"],
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
    relatedScenarioSlugs: ["malenkaya-kukhnya"],
    relatedStyleSlugs: ["minimalizm"],
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
    relatedStyleSlugs: ["minimalizm", "klassicheskie"],
    relatedScenarioSlugs: ["hochu-krasivo"],
    content: `Выбор фасадов — ключевое решение при заказе кухни. Разберём 4 основных варианта.

**МДФ с плёнкой ПВХ**: самый популярный. Цена от 1 200 BYN. Богатый выбор декоров. Боится влаги на торцах. Средний ресурс — 10–15 лет.

**Пластик (HPL/акрил)**: прочный и влагостойкий. Цена от 1 500 BYN. Легко моется. Видны царапины на глянце.

**Эмаль (крашеный МДФ)**: премиальный вид. Цена от 2 200 BYN. Идеально ровная поверхность. Требует бережного ухода. Срок — 15–20 лет.

**Шпон**: натуральный срез дерева. Цена от 3 200 BYN. Тепло и уникальная текстура. Требует специального ухода. Не любит влагу.

**Вывод**: для бюджетной кухни — МДФ плёнка. Для баланса цены и качества — пластик. Для долговечности — эмаль. Для премиума — шпон.`
  },
};

interface Props { params: Promise<{ slug: string }> }

async function getRelatedContent(relatedCaseSlugs: string[], relatedStyleSlugs: string[], relatedScenarioSlugs: string[]) {
  try {
    const [cases, styles, scenarios] = await Promise.all([
      relatedCaseSlugs.length > 0
        ? prisma.portfolioCase.findMany({
            where: { slug: { in: relatedCaseSlugs }, published: true },
            select: { id: true, slug: true, title: true, city: true, area: true, priceFrom: true, mainImage: true, style: true },
          })
        : Promise.resolve([]),
      relatedStyleSlugs.length > 0
        ? prisma.stylePage.findMany({
            where: { slug: { in: relatedStyleSlugs }, published: true },
            select: { id: true, slug: true, title: true, description: true, image: true, priceFrom: true },
          })
        : Promise.resolve([]),
      relatedScenarioSlugs.length > 0
        ? prisma.scenarioPage.findMany({
            where: { slug: { in: relatedScenarioSlugs }, published: true },
            select: { id: true, slug: true, title: true, icon: true, intro: true },
          })
        : Promise.resolve([]),
    ]);
    return { cases, styles, scenarios };
  } catch { return { cases: [], styles: [], scenarios: [] }; }
}

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
  let data: { title: string; excerpt: string; category: string; readTime: number; content: string; relatedCaseSlugs?: string[]; relatedStyleSlugs?: string[]; relatedScenarioSlugs?: string[] } | null = null;
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p && p.published) data = {
      title: p.title, excerpt: p.excerpt, category: p.category, readTime: p.readTime, content: p.content,
      relatedCaseSlugs: p.relatedCaseSlugs,
      relatedStyleSlugs: p.relatedStyleSlugs,
      relatedScenarioSlugs: p.relatedScenarioSlugs,
    };
  } catch {}
  if (!data) data = STATIC_POSTS[slug] || null;
  if (!data) notFound();

  const { cases, styles, scenarios } = await getRelatedContent(
    data.relatedCaseSlugs ?? [],
    data.relatedStyleSlugs ?? [],
    data.relatedScenarioSlugs ?? [],
  );

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
            <div className="space-y-4">
              {renderContent(data.content)}
            </div>

            {/* Похожие проекты */}
            {cases.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold">Похожие проекты из портфолио</h2>
                  <Link href="/portfolio" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                    Все работы <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cases.map((c) => (
                    <Link key={c.slug} href={`/portfolio/${c.slug}`}
                      className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all bg-white">
                      <div className="h-36 overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                        {c.mainImage
                          ? <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-3xl">🏠</div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{c.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {c.city && <span>{c.city}</span>}
                          {c.area > 0 && <span>{c.area} м²</span>}
                        </div>
                        {c.priceFrom > 0 && <p className="text-primary font-semibold text-xs mt-1">от {c.priceFrom.toLocaleString("ru")} BYN</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Подходящие стили */}
            {styles.length > 0 && (
              <section className="mt-10 pt-8 border-t border-border">
                <h2 className="font-serif text-xl font-bold mb-5">Стили кухонь по теме</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {styles.map((s) => (
                    <Link key={s.slug} href={`/styles/${s.slug}`}
                      className="group flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md bg-white transition-all">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-stone-200 to-amber-100">
                        {s.image && <img src={s.image} alt={s.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>
                        {s.priceFrom > 0 && <p className="text-primary text-xs font-medium mt-1">от {s.priceFrom.toLocaleString("ru")} BYN</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 self-center" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Сценарии */}
            {scenarios.length > 0 && (
              <section className="mt-10 pt-8 border-t border-border">
                <h2 className="font-serif text-xl font-bold mb-5">Подходит для вашего сценария</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scenarios.map((s) => (
                    <Link key={s.slug} href={`/scenarios/${s.slug}`}
                      className="group flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md bg-white transition-all">
                      {s.icon && <span className="text-2xl flex-shrink-0">{s.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.title}</p>
                        {s.intro && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.intro}</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside>
            <div className="space-y-5 sticky top-20">
              <div className="card-base p-6">
                <h2 className="font-serif text-xl font-semibold mb-4">Нужна консультация?</h2>
                <p className="text-sm text-muted-foreground mb-4">Замер и проект — бесплатно</p>
                <ContactForm source={`blog/${slug}`} />
              </div>

              <div className="card-base p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Другие статьи
                </h3>
                <div className="space-y-1">
                  {Object.entries(STATIC_POSTS).filter(([s]) => s !== slug).slice(0, 3).map(([s, p]) => (
                    <Link key={s} href={`/blog/${s}`}
                      className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <span className="line-clamp-1">{p.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                    </Link>
                  ))}
                  <Link href="/blog" className="block text-center mt-2 text-xs text-primary hover:underline">Все статьи →</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
