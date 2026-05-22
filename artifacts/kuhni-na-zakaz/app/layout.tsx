import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope } from "next/font/google";

import { prisma } from "@/lib/db";
import { FloatingSocialButtons } from "@/components/layout/FloatingSocialButtons";
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
import { CANONICAL_SITE_URL, SITE_NAME } from "@/lib/seo";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: true,
});

const preferredSiteUrl = CANONICAL_SITE_URL;
const siteUrl = getSiteUrl(preferredSiteUrl);
const faviconVersion = "20260512";
const siteName = SITE_NAME;
const defaultSocialImage = {
  url: "/opengraph.jpg",
  width: 1200,
  height: 630,
  alt: "КухниBY — кухни на заказ в Минске и Беларуси",
};
const homeTitle =
  "Индивидуальные кухни на заказ: проектирование, изготовление, сборка и установка, работаем по всей стране";
const homeDescription =
  "Проектируем, производим и устанавливаем кухонные гарнитуры под размеры: Минск, областные центры и районы Беларуси. Смета, 3D-проект и гарантия фиксируются в договоре.";

export const metadata: Metadata = {
  applicationName: siteName,
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: homeDescription,
  keywords: [
    "мебель для кухни под размеры",
    "кухонные гарнитуры Минск",
    "кухонная мебель Беларусь",
    "кухни от производителя",
    "замер кухни по заявке",
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
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [defaultSocialImage.url],
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
    <html lang="ru" className={manrope.variable}>
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
        {!isAdmin && (
          <FloatingSocialButtons
            instagram={contactInfo.instagram}
            telegram={contactInfo.telegram}
          />
        )}
        <Toaster />
      </body>
    </html>
  );
}
