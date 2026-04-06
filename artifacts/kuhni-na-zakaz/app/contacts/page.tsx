import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Контакты КухниBY — кухни на заказ по Беларуси",
  description: "Контакты КухниBY: телефон, email, адрес. Заказать замер бесплатно.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
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
                  <a href="tel:+375291234567" className="text-muted-foreground hover:text-primary">+375 (29) 123-45-67</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <a href="mailto:info@kuhniby.by" className="text-muted-foreground hover:text-primary">info@kuhniby.by</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Адрес</div>
                  <p className="text-muted-foreground">г. Минск, ул. Притыцкого, 100</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Время работы</div>
                  <p className="text-muted-foreground">Пн–Сб 9:00–19:00</p>
                  <p className="text-muted-foreground">Вс 10:00–17:00</p>
                </div>
              </div>
            </div>
            <div className="h-56 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl flex items-center justify-center">
              <p className="text-stone-400 text-sm">Карта — г. Минск, ул. Притыцкого, 100</p>
            </div>
          </div>
          <div id="form">
            <h2 className="font-serif text-2xl font-bold mb-6">Оставить заявку</h2>
            <ContactForm source="contacts" />
          </div>
        </div>
      </div>
    </div>
  );
}
