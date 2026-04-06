import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Toaster } from "@/components/ui/toaster";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "Кухни на заказ по Беларуси | КухниBY",
    template: "%s | КухниBY",
  },
  description:
    "Проектируем, изготавливаем и устанавливаем кухни под заказ по всей Беларуси. Собственное производство. Гарантия 5 лет. Замер и 3D-проект бесплатно.",
  keywords: ["кухни на заказ", "кухни на заказ Беларусь", "кухни под заказ", "кухни Минск", "кухни Минская область"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniby.by"
  ),
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniby.by",
    siteName: "КухниBY",
  },
  robots: {
    index: true,
    follow: true,
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

  const siteSettings = !isAdmin
    ? await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null)
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
        <Toaster />
      </body>
    </html>
  );
}
