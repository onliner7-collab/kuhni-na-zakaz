import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Кухни на заказ по Беларуси — замер и проект бесплатно",
  description:
    "Проектируем, изготавливаем и устанавливаем кухни под заказ по всей Беларуси. Подберём решение под ваш размер, бюджет и стиль. Замер и 3D-проект бесплатно.",
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
    name: "КухниBY",
    description: "Кухни на заказ по всей Беларуси. Собственное производство.",
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
      <section
        className="relative py-20 lg:py-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1060 40%, #0f1a3d 100%)" }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }}
        />

        <div className="container-site relative z-10">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-200 border border-violet-500/30 bg-violet-500/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              По всей Беларуси — от 14 дней
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Кухни на заказ{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                по Беларуси
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/60 leading-relaxed">
              Проектируем, изготавливаем и устанавливаем кухни под заказ.
              Фиксированная цена в договоре. Гарантия 5 лет. Замер и 3D-проект — бесплатно.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contacts#form"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                data-testid="hero-cta-order"
              >
                Заказать замер бесплатно
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all active:scale-95"
                data-testid="hero-cta-catalog"
              >
                Смотреть каталог
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
              {["Замер бесплатно", "Проект за 3 дня", "От 14 дней"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />
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
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">
              Почему выбирают нас
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">6 причин доверить кухню нам</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((adv, i) => (
              <div key={adv.title} className="group rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all bg-white">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white font-black text-sm"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{adv.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { slug: "uglovye-kuhni", t: "Угловые кухни", p: "от 1 800 BYN" },
                { slug: "pryamye-kuhni", t: "Прямые кухни", p: "от 1 200 BYN" },
                { slug: "p-obraznye-kuhni", t: "П-образные кухни", p: "от 3 500 BYN" },
                { slug: "kuhni-s-ostrovom", t: "Кухни с островом", p: "от 4 500 BYN" },
                { slug: "malenkie-kuhni", t: "Маленькие кухни", p: "от 900 BYN" },
                { slug: "kuhni-do-potolka", t: "Кухни до потолка", p: "от 2 200 BYN" },
              ].map((cat) => (
                <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all bg-white">
                  <div className="h-48 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f3f0ff, #e0f2fe)" }}>
                    <span className="text-violet-300 text-sm font-medium">Фото кухни</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cat.t}</h3>
                    <p className="text-primary font-bold mt-1 text-sm">{cat.p}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {kitchens.map((k) => (
                <Link key={k.id} href={`/catalog/${k.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all bg-white">
                  <div className="h-48 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #f3f0ff, #e0f2fe)" }}>
                    {k.mainImage ? (
                      <img src={k.mainImage} alt={k.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-violet-300 text-sm font-medium">Фото кухни</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{k.title}</h3>
                    <p className="text-primary font-bold mt-1 text-sm">от {k.priceFrom.toLocaleString("ru")} BYN</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { t: "Угловая кухня в минимализме", city: "Минск", area: 14, price: "2 800–3 200 BYN" },
                  { t: "Скандинавская кухня", city: "Борисов", area: 10, price: "1 800–2 100 BYN" },
                  { t: "Кухня с островом", city: "Минск, Партизанский р-н", area: 22, price: "5 500–6 200 BYN" },
                ].map((c, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-border bg-white">
                    <div className="h-56 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5f3ff, #ecfeff)" }}>
                      <span className="text-violet-300 text-sm font-medium">Фото проекта</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold">{c.t}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} м²</p>
                      <p className="text-primary font-bold text-sm mt-1">{c.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cases.map((c) => (
                  <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all bg-white">
                    <div className="h-56 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #f5f3ff, #ecfeff)" }}>
                      {c.mainImage ? (
                        <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-violet-300 text-sm font-medium">Фото проекта</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} м²</p>
                      <p className="text-primary font-bold text-sm mt-1">
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
      <section
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 60%, #0c1a30 100%)" }}
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-white">
              Как мы работаем
            </h2>
            <p className="mt-3 text-white/40 text-lg">6 шагов от заявки до готовой кухни</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 p-5 rounded-2xl border border-white/8 bg-white/4 hover:border-violet-500/30 hover:bg-white/8 transition-all">
                <div
                  className="text-2xl font-black shrink-0 leading-none mt-0.5"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-white">{s.t}</h3>
                  <p className="text-sm text-white/50 mt-1 leading-relaxed">{s.d}</p>
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
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0891b2 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)" }}
        />
        <div className="container-site text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Хотите точный расчёт?
          </h2>
          <p className="text-white/75 mb-8 text-lg">
            Оставьте заявку — перезвоним в течение 30 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacts#form"
              className="bg-white text-violet-700 hover:bg-white/90 px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl"
              data-testid="banner-cta"
            >
              Заказать бесплатный замер
            </Link>
            <a
              href="tel:+375291234567"
              className="flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold transition-all"
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
