import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { PublicChrome } from "@/components/layout/PublicChrome";
import { Toaster } from "@/components/ui/toaster";
import { getSiteUrl } from "@/lib/site-url";
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
const homeTitle = "Кухни на заказ в Минске и Беларуси";
const homeDescription =
  "Проектируем мебель под размеры помещения: замер, 3D-проект, производство, монтаж и смета в договоре. Работаем с квартирами, студиями и частными домами.";

export const metadata: Metadata = {
  applicationName: siteName,
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: homeDescription,
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
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <PublicChrome>{children}</PublicChrome>
        <Toaster />
      </body>
    </html>
  );
}
