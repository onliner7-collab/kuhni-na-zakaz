import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { prisma } from "@/lib/db";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Контакты и бесплатный замер",
  description: "Контакты производителя кухонь на заказ: телефоны, email, адрес и форма заявки. Закажите бесплатный замер и консультацию по всей Беларуси.",
  alternates: { canonical: "/contacts" },
};

const DEFAULTS = {
  phone: "+375291234567",
  phoneDisplay: "+375 (29) 123-45-67",
  phone2: "",
  phoneDisplay2: "",
  email: "info@kuhni.minsk.by",
  address: "г. Минск, ул. Притыцкого, 100",
  workingHours: "Пн–Сб 9:00–19:00, Вс 10:00–17:00",
};

export default async function ContactsPage() {
  const s = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);
  const c = {
    phone: s?.phone || DEFAULTS.phone,
    phoneDisplay: s?.phoneDisplay || DEFAULTS.phoneDisplay,
    phone2: s?.phone2 || DEFAULTS.phone2,
    phoneDisplay2: s?.phoneDisplay2 || DEFAULTS.phoneDisplay2,
    email: s?.email || DEFAULTS.email,
    address: s?.address || DEFAULTS.address,
    workingHours: s?.workingHours || DEFAULTS.workingHours,
  };
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Контакты", path: "/contacts" },
  ]);
  const jsonLdLocalBusiness = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s?.siteName || "КухниBY",
    url: siteUrl("/contacts"),
    telephone: c.phone,
    email: c.email,
    address: c.address,
    openingHours: ["Mo-Sa 09:00-19:00", "Su 10:00-17:00"],
    areaServed: { "@type": "Country", name: "Belarus" },
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
        <h1 className="font-serif text-4xl font-bold mb-10">Контакты</h1>
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
                  <div className="font-medium">Адрес</div>
                  <p className="text-muted-foreground">{c.address}</p>
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
            </div>
            <div className="h-56 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl flex items-center justify-center">
              <p className="text-stone-400 text-sm">Карта — {c.address}</p>
            </div>
          </div>
          <div id="form">
            <h2 className="font-serif text-2xl font-bold mb-6">Оставить заявку</h2>
            <ContactForm source="contacts" />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
