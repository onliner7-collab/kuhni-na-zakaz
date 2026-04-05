import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";

const STATIC: Record<string, { title: string; description: string; priceFrom: number; content: string }> = {
  "sovremennye": { title: "Современные кухни на заказ в Минске", description: "Современный стиль: чёткие линии, функциональность, минимум декора. От 1 800 BYN.", priceFrom: 1800, content: "Современный стиль кухни — это торжество функциональности над декором. Чистые линии, встроенная техника, скрытые ручки и нейтральные цвета создают пространство, в котором приятно готовить и отдыхать." },
  "klassicheskie": { title: "Классические кухни на заказ в Минске", description: "Классический стиль: фрезеровка, карнизы, натуральные материалы. От 3 500 BYN.", priceFrom: 3500, content: "Классическая кухня — это вне моды. Фасады с фрезеровкой, декоративные карнизы, патина, натуральный камень или дерево. Кухня, которая будет актуальна через 20 лет." },
  "skandinavskie": { title: "Скандинавские кухни на заказ в Минске", description: "Скандинавский стиль: белые фасады, дерево, функциональность. От 2 000 BYN.", priceFrom: 2000, content: "Скандинавский стиль — это свет, простота и натуральность. Белые фасады, деревянные акценты, открытые полки. Кухня, в которой хочется проводить время." },
  "minimalizm": { title: "Кухни в стиле минимализм на заказ", description: "Минимализм: скрытые ручки, встроенная техника, монохром. От 2 200 BYN.", priceFrom: 2200, content: "Минимализм — только необходимое. Монохромная палитра, встроенная техника, нажимные механизмы вместо ручек. Кухня, которая выглядит дорого при минимуме деталей." },
  "loft": { title: "Кухни в стиле лофт на заказ", description: "Лофт: металл, открытый бетон, промышленная эстетика. От 2 500 BYN.", priceFrom: 2500, content: "Лофт — это характер. Открытые металлические трубы, кирпичная кладка, бетонные поверхности. Кухня для тех, кто не боится смелых решений." },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const s = await prisma.stylePage.findUnique({ where: { slug } });
    if (s) return { title: s.seoTitle || s.title, description: s.seoDescription || s.description, alternates: { canonical: `/styles/${slug}` } };
  } catch {}
  const st = STATIC[slug];
  if (st) return { title: st.title, description: st.description, alternates: { canonical: `/styles/${slug}` } };
  return { title: "Стиль кухни" };
}

export default async function StylePage({ params }: Props) {
  const { slug } = await params;
  let data: { title: string; description: string; priceFrom: number; content: string } | null = null;
  try {
    const s = await prisma.stylePage.findUnique({ where: { slug } });
    if (s && s.published) data = { title: s.title, description: s.description, priceFrom: s.priceFrom, content: s.content };
  } catch {}
  if (!data) data = STATIC[slug] || null;
  if (!data) notFound();

  return (
    <div className="section-padding">
      <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <Link href="/styles" className="hover:text-primary">Стили</Link><span>/</span>
          <span className="text-foreground">{data.title.split(" ").slice(0, 3).join(" ")}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl font-bold mb-4">{data.title}</h1>
            <div className="h-72 bg-gradient-to-br from-stone-200 to-amber-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-stone-400">Фото стиля</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{data.content}</p>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="font-semibold text-primary text-lg">Стоимость: от {data.priceFrom.toLocaleString("ru")} BYN</p>
              <p className="text-sm text-muted-foreground mt-1">Точная цена — после замера</p>
            </div>
          </div>
          <div>
            <div className="card-base p-6 sticky top-20">
              <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
              <ContactForm source={`styles/${slug}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
