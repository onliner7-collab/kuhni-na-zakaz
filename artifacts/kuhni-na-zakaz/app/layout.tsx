import type { Metadata } from "next";
import { headers } from "next/headers";

import { prisma } from "@/lib/db";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniby.by";
const faviconVersion = "20260421b";

export const metadata: Metadata = {
  title: {
    default: "Кухни на заказ по Беларуси | КухниBY",
    template: "%s | КухниBY",
  },
  description:
    "Проектируем, изготавливаем и устанавливаем кухни на заказ по всей Беларуси. Собственное производство. Гарантия 5 лет. Замер и 3D-проект бесплатно.",
  keywords: [
    "кухни на заказ",
    "кухни на заказ Беларусь",
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
    title: "Кухни на заказ по Беларуси | КухниBY",
    description:
      "Проектируем, изготавливаем и устанавливаем кухни на заказ по всей Беларуси. Замер и 3D-проект бесплатно.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Кухни на заказ по Беларуси | КухниBY",
    description:
      "Проектируем, изготавливаем и устанавливаем кухни на заказ по всей Беларуси. Замер и 3D-проект бесплатно.",
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
    <html lang="ru">
      <body>
        {!isAdmin && (
          <Header
            phone={siteSettings?.phoneDisplay}
            phoneHref={siteSettings?.phone ? `tel:${siteSettings.phone}` : undefined}
          />
        )}
        {isAdmin ? children : <main>{children}</main>}
        {!isAdmin && <Footer />}
        {!isAdmin && <MobileCTA />}
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
                telephone: siteSettings?.phone || "+375291234567",
                email: siteSettings?.email || "info@kuhniby.by",
                address: siteSettings?.address || "Минск, Беларусь",
              }),
            }}
          />
        )}
        <Toaster />
      </body>
    </html>
  );
}
