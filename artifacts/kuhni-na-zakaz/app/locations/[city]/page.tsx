import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/sections/ContactForm";
import { CheckCircle } from "lucide-react";

const LOCATIONS: Record<string, {
  city: string; title: string; h1: string; description: string;
  content: string; areas: string[]; deliveryCost: string;
  phone: string; seoTitle: string; seoDesc: string;
}> = {
  minsk: {
    city: "Минск", title: "Кухни на заказ в Минске — замер бесплатно | КухниMinsk",
    h1: "Кухни на заказ в Минске",
    description: "Кухни на заказ в Минске от производителя. Собственное производство. Замер и 3D-проект бесплатно. Гарантия 5 лет. Изготовление от 14 дней.",
    content: `Мы производим кухни на заказ для жителей Минска уже более 10 лет. Собственный цех, штат дизайнеров и монтажников — всё для того, чтобы ваша кухня была сделана точно в срок и без лишних нервов.

Работаем во всех районах Минска: Центральный, Советский, Фрунзенский, Московский, Партизанский, Ленинский, Октябрьский, Заводской.

После замера подготовим 3D-проект в течение 3 рабочих дней. Цена фиксируется в договоре.`,
    areas: ["Центральный район", "Советский район", "Фрунзенский район", "Московский район", "Партизанский район", "Ленинский район", "Октябрьский район", "Заводской район"],
    deliveryCost: "Бесплатно при заказе от 3 000 BYN",
    phone: "+375 (29) 123-45-67",
    seoTitle: "Кухни на заказ в Минске от производителя | КухниMinsk",
    seoDesc: "Кухни на заказ в Минске. Собственное производство. Замер бесплатно. Гарантия 5 лет. От 900 BYN. Звоните: +375 (29) 123-45-67",
  },
  "minskaya-oblast": {
    city: "Минская область", title: "Кухни на заказ в Минской области | КухниMinsk",
    h1: "Кухни на заказ в Минской области",
    description: "Кухни на заказ в Минской области: Борисов, Молодечно, Жодино, Солигорск. Доставка и монтаж. Замер выездной — бесплатно.",
    content: `Изготавливаем кухни для жителей Минской области. Выезжаем на замер в любой населённый пункт области. Доставляем и устанавливаем силами собственных монтажников.

Работаем в Борисове, Молодечно, Жодино, Солигорске, Слуцке, Несвиже, Клецке, Копыле и других городах и посёлках.

Стоимость доставки по области зависит от расстояния — от 50 BYN. При крупном заказе доставка бесплатно.`,
    areas: ["Борисов", "Молодечно", "Жодино", "Солигорск", "Слуцк", "Несвиж", "Клецк", "Копыль", "Дзержинск", "Вилейка"],
    deliveryCost: "от 50 BYN (зависит от расстояния)",
    phone: "+375 (29) 123-45-67",
    seoTitle: "Кухни на заказ в Минской области | КухниMinsk",
    seoDesc: "Кухни на заказ в Минской области: Борисов, Молодечно, Жодино, Слуцк. Доставка и монтаж. Замер бесплатно.",
  },
};

interface Props { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const loc = LOCATIONS[city];
  if (!loc) return { title: "Не найдено" };
  return {
    title: loc.seoTitle,
    description: loc.seoDesc,
    alternates: { canonical: `/locations/${city}` },
    openGraph: { title: loc.seoTitle, description: loc.seoDesc },
  };
}

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const loc = LOCATIONS[city];
  if (!loc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "КухниMinsk",
    description: loc.description,
    telephone: "+375291234567",
    address: { "@type": "PostalAddress", addressLocality: loc.city, addressCountry: "BY" },
    areaServed: loc.areas,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">Кухни в {loc.city}</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h1 className="font-serif text-4xl font-bold mb-4">{loc.h1}</h1>
              <p className="text-lg text-muted-foreground mb-6">{loc.description}</p>
              <div className="prose prose-stone max-w-none mb-8">
                {loc.content.split("\n\n").map((p, i) => <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{p}</p>)}
              </div>
              <div className="card-base p-6 mb-6">
                <h2 className="font-semibold mb-4">Работаем в:</h2>
                <div className="grid grid-cols-2 gap-2">
                  {loc.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />{area}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-base p-5">
                  <h3 className="font-semibold mb-1">Доставка</h3>
                  <p className="text-sm text-muted-foreground">{loc.deliveryCost}</p>
                </div>
                <div className="card-base p-5">
                  <h3 className="font-semibold mb-1">Замер</h3>
                  <p className="text-sm text-muted-foreground">Выездной замер — бесплатно</p>
                </div>
              </div>
            </div>
            <div>
              <div className="card-base p-6 sticky top-20">
                <h2 className="font-serif text-xl font-semibold mb-2">Заказать замер</h2>
                <p className="text-sm text-muted-foreground mb-4">в {loc.city}</p>
                <ContactForm source={`locations/${city}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
