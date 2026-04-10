import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-muted-foreground mb-8">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {item.href ? <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ContactsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setLocation("/thanks"), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "Р“Р»Р°РІРЅР°СЏ", href: "/" }, { label: "РљРѕРЅС‚Р°РєС‚С‹" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">РљРѕРЅС‚Р°РєС‚С‹</h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl">
          РЎРІСЏР¶РёС‚РµСЃСЊ СЃ РЅР°РјРё Р»СЋР±С‹Рј СѓРґРѕР±РЅС‹Рј СЃРїРѕСЃРѕР±РѕРј. РћС‚РІРµС‡Р°РµРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* РљРѕРЅС‚Р°РєС‚РЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">РўРµР»РµС„РѕРЅ</p>
                  <a href={`tel:${SITE_CONFIG.phone}`} className="text-primary hover:underline text-lg font-medium" data-testid="link-phone">
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-2">РњРµСЃСЃРµРЅРґР¶РµСЂС‹</p>
                  <div className="flex gap-3">
                    <a href={SITE_CONFIG.telegram} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline" data-testid="link-telegram">
                      Telegram
                    </a>
                    <a href={SITE_CONFIG.viber} className="text-sm text-primary hover:underline" data-testid="link-viber">
                      Viber
                    </a>
                    <a href={SITE_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline" data-testid="link-whatsapp">
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary hover:underline" data-testid="link-email">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">РђРґСЂРµСЃ</p>
                  <p className="text-muted-foreground">{SITE_CONFIG.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">РЁРѕСѓСЂСѓРј: РїРѕ Р·Р°РїРёСЃРё</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Р РµР¶РёРј СЂР°Р±РѕС‚С‹</p>
                  <p className="text-muted-foreground text-sm">{SITE_CONFIG.workingHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* РљР°СЂС‚Р° (Р·Р°РіР»СѓС€РєР°) */}
          <div className="bg-secondary rounded-2xl h-52 flex items-center justify-center text-muted-foreground text-sm">
            РљР°СЂС‚Р° вЂ” {SITE_CONFIG.address}
          </div>
        </div>

        {/* Р¤РѕСЂРјР° */}
        <div>
          <h2 className="text-2xl font-bold font-serif mb-6">РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ</h2>
          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold font-serif mb-2">Р—Р°СЏРІРєР° РїСЂРёРЅСЏС‚Р°!</h3>
              <p className="text-muted-foreground">РџРѕР·РІРѕРЅРёРј РІ С‚РµС‡РµРЅРёРµ 30 РјРёРЅСѓС‚ РІ СЂР°Р±РѕС‡РµРµ РІСЂРµРјСЏ.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
              <div>
                <label className="text-sm font-medium mb-1 block">Р’Р°С€Рµ РёРјСЏ *</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="РРІР°РЅ"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">РўРµР»РµС„РѕРЅ *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+375 (29) 000-00-00"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="input-contact-phone"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Р“РѕСЂРѕРґ</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="РњРёРЅСЃРє"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="input-contact-city"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">РљРѕРјРјРµРЅС‚Р°СЂРёР№</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="РћРїРёС€РёС‚Рµ РІР°С€Сѓ Р·Р°РґР°С‡Сѓ РёР»Рё РІРѕРїСЂРѕСЃ..."
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  data-testid="textarea-contact-comment"
                />
              </div>
              {/* honeypot */}
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
              <p className="text-xs text-muted-foreground">
                РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ <Link href="/privacy-policy" className="underline">РїРѕР»РёС‚РёРєРѕР№ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</Link>
              </p>
              <Button type="submit" size="lg" className="w-full" data-testid="btn-contact-submit">
                РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactsPage;

