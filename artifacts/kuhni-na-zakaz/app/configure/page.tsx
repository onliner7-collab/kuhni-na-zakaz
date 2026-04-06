import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ConfiguratorFlow } from "@/components/configurator/ConfiguratorFlow";

export const metadata: Metadata = {
  title: "Подбор кухни — персональный конфигуратор | КухниBY",
  description: "Ответьте на 8 вопросов и получите персональные рекомендации по стилю, материалам и похожим проектам. Бесплатно, без звонков.",
  alternates: { canonical: "/configure" },
};

export default function ConfigurePage() {
  return (
    <div className="section-padding">
      <div className="container-site max-w-2xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Подбор кухни</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Персональный подбор
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
            Найдём кухню<br />
            <span className="text-gradient">именно для вас</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Ответьте на несколько вопросов — покажем подходящие стили, материалы и реализованные проекты.
            Без давления и сразу по делу.
          </p>
        </div>

        {/* Wizard card */}
        <div className="card-base p-6 lg:p-10">
          <ConfiguratorFlow />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Данные используются только для подбора рекомендаций. Никаких звонков без вашего запроса.
        </p>
      </div>
    </div>
  );
}
