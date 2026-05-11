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
import { resolveContactInfo } from "@/lib/contact-info";

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

const preferredSiteUrl = "https://kuhni.minsk.by";
const siteUrl = getSiteUrl(preferredSiteUrl);
const faviconVersion = "20260511";
const siteName = "КухниBY";
const homeTitle =
  "Кухни на заказ в Минске и по Беларуси — завод, замер и 3D | КухниBY";
const homeDescription =
  "Кухни на заказ от производителя: Минск, Брест, Гродно, Гомель, Витебск, Могилёв. Завод, замер и 3D-проект по согласованным условиям. Гарантия фиксируется в договоре, от 1200 BYN.";

export const metadata: Metadata = {
  applicationName: siteName,
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: homeDescription,
  keywords: [
    "кухни на заказ",
    "кухни на заказ Минск",
    "кухни на заказ Беларусь",
    "кухни от производителя",
    "замер кухни по заявке",
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
      {
        url: `/icon-192.png?v=${faviconVersion}`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: `/icon-512.png?v=${faviconVersion}`,
        sizes: "512x512",
        type: "image/png",
      },
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
    siteName,
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
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
  const contactInfo = resolveContactInfo(siteSettings);

  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        {!isAdmin && <GoogleTagManagerNoScript />}
        {!isAdmin && <AnalyticsProvider />}
        {!isAdmin && (
          <Header
            phone={contactInfo.phoneDisplay}
            phoneHref={`tel:${contactInfo.phone}`}
          />
        )}
        {isAdmin ? children : <main>{children}</main>}
        {!isAdmin && <Footer />}
        {!isAdmin && (
          <MobileCTA
            phoneHref={`tel:${contactInfo.phone}`}
          />
        )}
        <Toaster />
      </body>
    </html>
  );
}
