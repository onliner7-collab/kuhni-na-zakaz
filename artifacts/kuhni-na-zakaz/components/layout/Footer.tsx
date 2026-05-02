import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

const FOOTER_LINKS = {
  catalog: [
    { href: "/catalog/uglovye-kuhni", label: "Угловые кухни" },
    { href: "/catalog/pryamye-kuhni", label: "Прямые кухни" },
    { href: "/catalog/p-obraznye-kuhni", label: "П-образные" },
    { href: "/catalog/kuhni-s-ostrovom", label: "С островом" },
    { href: "/catalog/malenkie-kuhni", label: "Маленькие кухни" },
    { href: "/catalog/kuhni-do-potolka", label: "До потолка" },
  ],
  info: [
    { href: "/about", label: "О компании" },
    { href: "/portfolio", label: "Портфолио" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/delivery-installation", label: "Доставка и монтаж" },
    { href: "/warranty", label: "Гарантия" },
    { href: "/blog", label: "Блог" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Условия использования" },
    { href: "/personal-data", label: "Персональные данные" },
  ],
  priorityCities: [
    { href: "/locations/minsk", label: "Минск" },
    { href: "/locations/minskaya-oblast", label: "Минская область" },
    { href: "/locations/gomel", label: "Гомель" },
    { href: "/locations/mogilev", label: "Могилёв" },
    { href: "/locations/vitebsk", label: "Витебск" },
  ],
};

const FOOTER_DEFAULTS = {
  phone: CONTACT_DEFAULTS.phone,
  phoneDisplay: CONTACT_DEFAULTS.phoneDisplay,
  email: CONTACT_DEFAULTS.email,
  address: CONTACT_DEFAULTS.address,
  workingHours: CONTACT_DEFAULTS.workingHours,
};

export async function Footer() {
  const s = process.env.DATABASE_URL
    ? await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null)
    : null;
  const c = {
    phone: s?.phone || FOOTER_DEFAULTS.phone,
    phoneDisplay: s?.phoneDisplay || FOOTER_DEFAULTS.phoneDisplay,
    phone2: s?.phone2 || "",
    phoneDisplay2: s?.phoneDisplay2 || "",
    email: s?.email || FOOTER_DEFAULTS.email,
    address: s?.address || FOOTER_DEFAULTS.address,
    workingHours: s?.workingHours || FOOTER_DEFAULTS.workingHours,
    instagram: s?.instagram || "",
    vk: s?.vk || "",
    youtube: s?.youtube || "",
    telegram: s?.telegram || "",
  };

  return (
    <footer className="mt-16" style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 50%, #0f1525 100%)" }}>
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                <span className="text-white font-black text-sm">К</span>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Кухни<span style={{ background: "linear-gradient(135deg, #a78bfa, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Кухни на заказ по всей Беларуси. Собственное производство.
            </p>
            <div className="mt-4 space-y-2.5">
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0 text-violet-400" />
                {c.phoneDisplay}
              </a>
              {c.phone2 && c.phoneDisplay2 && (
                <a href={`tel:${c.phone2}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-violet-400" />
                  {c.phoneDisplay2}
                </a>
              )}
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0 text-violet-400" />
                {c.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
                {c.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4 shrink-0 text-violet-400" />
                {c.workingHours}
              </div>
              {(c.instagram || c.vk || c.youtube || c.telegram) && (
                <div className="flex items-center gap-3 pt-1">
                  {c.instagram && (
                    <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" title="Instagram">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  {c.vk && (
                    <a href={c.vk} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" title="ВКонтакте">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.6-.19 1.37 1.26 2.185 1.817.617.422 1.086.33 1.086.33l2.182-.03s1.141-.071.6-.968c-.044-.073-.314-.661-1.619-1.87-1.365-1.262-1.183-1.057.462-3.238.999-1.33 1.399-2.142 1.274-2.49-.12-.332-.855-.244-.855-.244l-2.455.015s-.182-.025-.317.056c-.132.079-.217.262-.217.262s-.387 1.028-.903 1.903c-1.088 1.848-1.524 1.946-1.702 1.831-.413-.267-.31-1.073-.31-1.646 0-1.79.272-2.535-.528-2.727-.265-.064-.46-.106-1.137-.113-.869-.009-1.603.003-2.02.206-.277.135-.491.437-.361.454.161.021.527.098.721.362.25.341.241 1.107.241 1.107s.144 2.108-.335 2.369c-.329.18-.78-.187-1.748-1.865-.497-.858-.873-1.808-.873-1.808s-.072-.176-.201-.271c-.157-.114-.376-.15-.376-.15l-2.33.015s-.35.01-.479.162c-.114.135-.009.414-.009.414s1.826 4.27 3.892 6.423c1.894 1.974 4.043 1.843 4.043 1.843h.974z"/></svg>
                    </a>
                  )}
                  {c.youtube && (
                    <a href={c.youtube} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" title="YouTube">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  )}
                  {c.telegram && (
                    <a href={c.telegram.startsWith("http") ? c.telegram : `https://t.me/${c.telegram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" title="Telegram">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Каталог</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.catalog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">О компании</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities + Legal */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Кухни по городам</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.priorityCities.map((city) => (
                <li key={city.href}>
                  <Link href={city.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Правовое</h3>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} КухниBY. Все права защищены.
          </p>
          <p className="text-sm text-white/30">
            УНП {CONTACT_DEFAULTS.unp} | {c.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
