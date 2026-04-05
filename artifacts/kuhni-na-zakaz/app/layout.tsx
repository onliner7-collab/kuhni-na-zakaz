import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Кухни на заказ в Минске | КухниMinsk",
    template: "%s | КухниMinsk",
  },
  description:
    "Кухни на заказ в Минске и Минской области. Собственное производство. Гарантия 5 лет. Замер и проект бесплатно. Звоните: +375 (29) 123-45-67",
  keywords: ["кухни на заказ", "кухни Минск", "кухни Минская область"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniminsk.by"
  ),
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniminsk.by",
    siteName: "КухниMinsk",
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

  return (
    <html lang="ru">
      <body>
        {!isAdmin && <Header />}
        {isAdmin ? children : <main>{children}</main>}
        {!isAdmin && <Footer />}
        {!isAdmin && <MobileCTA />}
        <Toaster />
      </body>
    </html>
  );
}
