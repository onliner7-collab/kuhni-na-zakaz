import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileText, Handshake, Instagram, Mail, MapPin, Phone, Ruler, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { prisma } from "@/lib/db";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { getSameAsLinks, resolveContactInfo } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Контакты и заявка на замер",
  description: "Контакты производителя кухонь на заказ: телефоны, email, адрес и форма заявки. Условия замера и консультации уточняются при заявке.",
  alternates: { canonical: "/contacts" },
};

export const revalidate = 3600;

const serviceArea = [
  "Минск",
  "Минская область",
  "Брест",
  "Гродно",
  "Гомель",
  "Витебск",
  "Могилёв",
];

const trustItems = [
  {
    title: "Договор и смета",
    text: "До запуска работ фиксируем комплектацию, стоимость и сроки в договоре.",
    icon: FileText,
  },
  {
    title: "Согласование проекта",
    text: "После замера готовим планировку и 3D-проект, затем вносим правки до утверждения.",
    icon: Ruler,
  },
  {
    title: "Оплата по этапам",
    text: "Сначала видите смету, затем условия предоплаты и финального расчета прописываются в договоре.",
    icon: Handshake,
  },
  {
    title: "Гарантия письменно",
    text: "Гарантия на фурнитуру, корпус, фасады и монтаж указывается в документах по заказу.",
    icon: ShieldCheck,
  },
];

export default async function ContactsPage() {
  const s = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);
  const c = resolveContactInfo(s);
  const sameAs = getSameAsLinks(c);
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Контакты", path: "/contacts" },
  ]);
  const jsonLdLocalBusiness = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl("/")}#localbusiness`,
    name: c.siteName,
    url: siteUrl("/contacts"),
    telephone: c.phone,
    email: c.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Дзержинского, д. 90, каб. 1а",
      postalCode: "222520",
      addressLocality: "Борисов",
      addressCountry: "BY",
    },
    openingHoursSpecification: c.workingHours
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "10:00",
            closes: "17:00",
          },
        ]
      : undefined,
    areaServed: [
      { "@type": "City", name: "Минск" },
      { "@type": "AdministrativeArea", name: "Минская область" },
      { "@type": "Country", name: "Беларусь" },
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdLocalBusiness]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Контакты</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-4">Контакты для расчета кухни</h1>
        <p className="mb-10 max-w-3xl text-muted-foreground">
          Принимаем заявки на кухни по размерам, замер, проектирование, производство, доставку и монтаж по Минску и Беларуси. Производственный и юридический адрес находится в Борисове; отдельный офис или шоурум в Минске на сайте не заявляем.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Телефон</div>
                  <a href={`tel:${c.phone}`} className="text-muted-foreground hover:text-primary">
                    {c.phoneDisplay}
                  </a>
                  {c.phone2 && c.phoneDisplay2 && (
                    <a href={`tel:${c.phone2}`} className="block text-muted-foreground hover:text-primary">
                      {c.phoneDisplay2}
                    </a>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`tel:${c.phone}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                      <Phone className="h-4 w-4" aria-hidden />
                      Позвонить
                    </a>
                    {c.whatsapp && (
                      <a href={c.whatsapp} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                        WhatsApp
                      </a>
                    )}
                    {c.viber && (
                      <a href={c.viber} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                        Viber
                      </a>
                    )}
                    {c.telegram && (
                      <a href={c.telegram} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <a href={`mailto:${c.email}`} className="text-muted-foreground hover:text-primary">
                    {c.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Производство и юридический адрес</div>
                  <p className="text-muted-foreground">{c.address}</p>
                  <p className="mt-1 text-sm text-muted-foreground">УНП {CONTACT_DEFAULTS.unp}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Замер, проектирование, доставка и монтаж выполняются по Минску, Минской области и другим городам Беларуси по согласованию заявки.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Время работы</div>
                  {c.workingHours.split(",").map((h) => (
                    <p key={h.trim()} className="text-muted-foreground">{h.trim()}</p>
                  ))}
                </div>
              </div>
              {c.instagram && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Instagram</div>
                    <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      {CONTACT_DEFAULTS.instagramLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {c.addressMap && (
              <div className="h-72 overflow-hidden rounded-xl border border-border">
                <iframe
                  src={c.addressMap}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Карта: ${c.address}`}
                />
              </div>
            )}
          </div>
          <div id="form">
            <h2 className="font-serif text-2xl font-bold mb-6">Оставить заявку</h2>
            <ContactForm source="contacts" />
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold mb-6">Как строится работа</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-xl border border-border bg-white p-5">
                <Icon className="mb-4 h-5 w-5 text-primary" aria-hidden />
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="font-serif text-2xl font-bold mb-3">Зона обслуживания</h2>
          <p className="mb-5 text-muted-foreground">
            Работаем с заявками по Беларуси. Условия замера, доставки и монтажа уточняются по адресу и составу проекта.
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceArea.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-foreground">
                {item}
              </span>
            ))}
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
