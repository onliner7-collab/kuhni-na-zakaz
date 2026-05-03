import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Manrope } from "next/font/google";

import { prisma } from "@/lib/db";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Toaster } from "@/components/ui/toaster";
import {
  AnalyticsProvider,
  GoogleTagManagerNoScript,
} from "@/components/analytics/AnalyticsProvider";
import { getSiteUrl } from "@/lib/site-url";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
});

const siteUrl = getSiteUrl();
const faviconVersion = "20260421b";
const localBusinessImage =
  "https://kuhni.minsk.by/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp";

export const metadata: Metadata = {
  title: {
    default:
      "Кухни на заказ в Минске и по Беларуси — завод, замер и 3D | КухниBY",
    template: "%s | КухниBY",
  },
  description:
    "Кухни на заказ от производителя: Минск, Брест, Гродно, Гомель, Витебск, Могилёв. Завод, замер и 3D за 3 дня бесплатно. Гарантия 5 лет, от 1200 BYN. Фикс. смета.",
  keywords: [
    "кухни на заказ",
    "кухни на заказ Минск",
    "кухни на заказ Беларусь",
    "кухни от производителя",
    "бесплатный замер кухни",
    "кухни под заказ",
    "кухни Минск",
    "кухни Минская область",
  ],
  metadataBase: new URL(siteUrl),
  manifest: `/manifest.webmanifest?v=${faviconVersion}`,
  icons: {
    icon: [
      { url: `/favicon.ico?v=${faviconVersion}`, sizes: "any" },
      { url: `/icon.svg?v=${faviconVersion}`, type: "image/svg+xml" },
    ],
    shortcut: [`/favicon.ico?v=${faviconVersion}`],
    apple: [
      {
        url: `/apple-icon.png?v=${faviconVersion}`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: siteUrl,
    siteName: "КухниBY",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  const siteSettings =
    !isAdmin && process.env.DATABASE_URL
      ? await prisma.siteSettings
          .findFirst({ where: { id: 1 } })
          .catch(() => null)
      : null;

  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        {!isAdmin && <GoogleTagManagerNoScript />}
        {!isAdmin && <AnalyticsProvider />}
        {!isAdmin && (
          <Header
            phone={siteSettings?.phoneDisplay}
            phoneHref={siteSettings?.phone ? `tel:${siteSettings.phone}` : undefined}
          />
        )}
        {isAdmin ? children : <main>{children}</main>}
        {!isAdmin && <Footer />}
        {!isAdmin && (
          <MobileCTA
            phoneHref={siteSettings?.phone ? `tel:${siteSettings.phone}` : undefined}
          />
        )}
        {!isAdmin && (
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteSettings?.siteName || "КухниBY",
                url: siteUrl,
                logo: `${siteUrl}/logo.png`,
                email: siteSettings?.email || CONTACT_DEFAULTS.email,
                image: localBusinessImage,
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: siteSettings?.phone || CONTACT_DEFAULTS.phone,
                  contactType: "sales",
                  areaServed: "BY",
                  availableLanguage: ["Russian", "Belarusian"],
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Минск",
                  addressCountry: "BY",
                },
              }),
            }}
          />
        )}
        <Toaster />
      </body>
    </html>
  );
}
