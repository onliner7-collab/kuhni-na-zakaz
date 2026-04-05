import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Кухни на заказ в Минске — замер и проект бесплатно",
  description:
    "Кухни на заказ в Минске и Минской области. Собственное производство, гарантия 5 лет. Замер и 3D-проект бесплатно. Изготовление от 14 дней.",
  alternates: { canonical: "/" },
};

const ADVANTAGES = [
  { title: "Собственное производство", desc: "Изготавливаем на своём заводе — контролируем каждый этап" },
  { title: "Гарантия 5 лет", desc: "На фурнитуру Blum. На корпус и фасады — 2 года" },
  { title: "Замер и проект бесплатно", desc: "Выезжаем в день обращения. 3D-проект за 3 дня" },
  { title: "Фиксированная цена", desc: "Цена фиксируется в договоре. Никаких доплат" },
  { title: "От 14 дней", desc: "Минимальный срок изготовления стандартных кухонь" },
  { title: "Работаем по области", desc: "Борисов, Молодечно, Жодино, Солигорск и другие города" },
];

const STEPS = [
  { n: "01", t: "Заявка", d: "Оставьте заявку или позвоните. Отвечаем за 30 минут." },
  { n: "02", t: "Консультация", d: "Обсуждаем задачу, бюджет, стиль." },
  { n: "03", t: "Замер", d: "Бесплатный выезд на объект." },
  { n: "04", t: "Проект и смета", d: "3D-проект и фиксированная цена. До 3 дней." },
  { n: "05", t: "Производство", d: "Изготовление на своём заводе. 14–30 дней." },
  { n: "06", t: "Монтаж", d: "Доставка и установка под ключ. Убираем мусор." },
];

async function getHomeData() {
  try {
    const [kitchens, cases, reviews, faqs] = await Promise.all([
      prisma.kitchen.findMany({ where: { published: true }, take: 6, orderBy: { createdAt: "desc" } }),
      prisma.portfolioCase.findMany({ where: { published: true }, take: 3, orderBy: { createdAt: "desc" } }),
      prisma.review.findMany({ where: { status: "PUBLISHED" }, take: 5, orderBy: { createdAt: "desc" } }),
      prisma.fAQItem.findMany({ where: { page: "home" }, orderBy: { order: "asc" }, take: 8 }),
    ]);
    return { kitchens, cases, reviews, faqs };
  } catch {
    return { kitchens: [], cases: [], reviews: [], faqs: [] };
  }
}

export default async function HomePage() {
  const { kitchens, cases, reviews, faqs } = await getHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "КухниMinsk",
    description: "Кухни на заказ в Минске и Минской области",
    telephone: "+375291234567",
    email: "info@kuhniminsk.by",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Минск",
      addressCountry: "BY",
      streetAddress: "ул. Притыцкого, 100",
    },
    geo: { "@type": "GeoCoordinates", latitude: 53.9, longitude: 27.5667 },
    openingHours: ["Mo-Sa 09:00-19:00", "Su 10:00-17:00"],
    priceRange: "от 900 BYN",
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
            ).toFixed(1),
            reviewCount: reviews.length,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-stone-100 to-stone-200 py-20 lg:py-32 overflow-hidden">
        <div className="container-site relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Кухни на заказ{" "}
              <span className="text-primary">в Минске</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Собственное производство. Фиксированная цена в договоре.
              Гарантия 5 лет. Замер и 3D-проект — бесплатно.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/contacts#form" className="btn-primary" data-testid="hero-cta-order">
                Заказать замер бесплатно
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/catalog" className="btn-outline" data-testid="hero-cta-catalog">
                Смотреть каталог
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              {["Замер бесплатно", "Проект за 3 дня", "От 14 дней"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="section-padding bg-background">
        <div className="container-site">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv) => (
              <div key={adv.title} className="card-base p-6">
                <CheckCircle className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold text-base mb-1">{adv.title}</h3>
                <p className="text-sm text-muted-foreground">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section className="section-padding bg-muted/30">
        <div className="container-site">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Каталог кухонь</h2>
            <Link href="/catalog" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Все категории <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {kitchens.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { slug: "uglovye-kuhni", t: "Угловые кухни", p: "от 1 800 BYN" },
                { slug: "pryamye-kuhni", t: "Прямые кухни", p: "от 1 200 BYN" },
                { slug: "p-obraznye-kuhni", t: "П-образные кухни", p: "от 3 500 BYN" },
                { slug: "kuhni-s-ostrovom", t: "Кухни с островом", p: "от 4 500 BYN" },
                { slug: "malenkie-kuhni", t: "Маленькие кухни", p: "от 900 BYN" },
                { slug: "kuhni-do-potolka", t: "Кухни до потолка", p: "от 2 200 BYN" },
              ].map((cat) => (
                <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="card-base hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <span className="text-stone-400 text-sm">Фото кухни</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{cat.t}</h3>
                    <p className="text-primary font-medium mt-1 text-sm">{cat.p}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchens.map((k) => (
                <Link key={k.id} href={`/catalog/${k.slug}`} className="card-base hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center overflow-hidden">
                    {k.mainImage ? (
                      <img src={k.mainImage} alt={k.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-stone-400 text-sm">Фото кухни</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-semibold text-lg group-hover:text-primary transition-colors">{k.title}</h3>
                    <p className="text-primary font-medium mt-1 text-sm">от {k.priceFrom.toLocaleString("ru")} BYN</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PORTFOLIO */}
      {(cases.length > 0 || true) && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Наши работы</h2>
              <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                Все проекты <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {cases.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { t: "Угловая кухня в минимализме", city: "Минск", area: 14, price: "2 800–3 200 BYN" },
                  { t: "Скандинавская кухня", city: "Борисов", area: 10, price: "1 800–2 100 BYN" },
                  { t: "Кухня с островом", city: "Минск, Партизанский р-н", area: 22, price: "5 500–6 200 BYN" },
                ].map((c, i) => (
                  <div key={i} className="card-base">
                    <div className="h-56 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center">
                      <span className="text-stone-400 text-sm">Фото проекта</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-semibold">{c.t}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} м²</p>
                      <p className="text-primary font-medium text-sm mt-1">{c.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cases.map((c) => (
                  <Link key={c.id} href={`/portfolio/${c.slug}`} className="card-base hover:shadow-md transition-shadow group">
                    <div className="h-56 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center overflow-hidden">
                      {c.mainImage ? (
                        <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-stone-400 text-sm">Фото проекта</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} м²</p>
                      <p className="text-primary font-medium text-sm mt-1">
                        {c.priceFrom.toLocaleString("ru")}–{c.priceTo.toLocaleString("ru")} BYN
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* STEPS */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-site">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-center mb-12">
            Как мы работаем
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="text-3xl font-serif font-bold text-primary/60 shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-semibold text-background">{s.t}</h3>
                  <p className="text-sm text-background/70 mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Отзывы клиентов</h2>
              <Link href="/reviews" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                Все отзывы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="card-base p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span className="font-medium">{r.name}</span> · {r.city}
                    {r.date && ` · ${r.date}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && <FAQSection items={faqs} />}

      {/* CTA BANNER */}
      <section className="py-16 bg-primary">
        <div className="container-site text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Хотите точный расчёт?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Оставьте заявку — перезвоним в течение 30 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacts#form"
              className="bg-background text-foreground hover:bg-background/90 px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              data-testid="banner-cta"
            >
              Заказать бесплатный замер
            </Link>
            <a
              href="tel:+375291234567"
              className="flex items-center gap-2 text-primary-foreground border border-primary-foreground/30 hover:border-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              +375 (29) 123-45-67
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="form" className="section-padding bg-background">
        <div className="container-site max-w-2xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-2">Оставить заявку</h2>
          <p className="text-center text-muted-foreground mb-8">Замер и консультация — бесплатно</p>
          <ContactForm source="home" />
        </div>
      </section>
    </>
  );
}
