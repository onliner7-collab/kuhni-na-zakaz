import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layers, LayoutTemplate, Palette, Box, Save, Share2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Визуальный конфигуратор кухни",
  description:
    "Спроектируйте кухню мечты: задайте размеры помещения, выберите планировку, модули, фасады и материалы. Увидьте результат в 2D и 3D.",
};

const STEPS = [
  {
    icon: Box,
    title: "Помещение",
    description: "Укажите размеры комнаты, двери, окна и выступы",
  },
  {
    icon: LayoutTemplate,
    title: "Планировка",
    description: "Выберите готовый шаблон или расставьте модули вручную",
  },
  {
    icon: Palette,
    title: "Материалы",
    description: "Фасады, столешницы, скинали, ручки и техника",
  },
  {
    icon: Layers,
    title: "2D / 3D просмотр",
    description: "Увидьте кухню на плане и в объёме",
  },
  {
    icon: Save,
    title: "Сохранение",
    description: "Сохраните проект и вернитесь к нему позже",
  },
  {
    icon: Share2,
    title: "Поделиться",
    description: "Отправьте проект себе, родственникам или менеджеру",
  },
];

export default function KitchenConfiguratorPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-stone-50 to-amber-50/40 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 mb-6">
            Новый инструмент
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-stone-900 leading-tight mb-4">
            Визуальный конфигуратор кухни
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-xl mx-auto">
            Спроектируйте кухню прямо в браузере — задайте помещение,
            выберите планировку, материалы и увидьте результат в 3D.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Кнопка будет активна с этапа 2 */}
            <button
              disabled
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-white opacity-60 cursor-not-allowed"
              )}
              style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
              title="Скоро — конфигуратор в разработке"
            >
              Начать проектирование
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <Link
              href="/contacts"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Консультация с дизайнером
            </Link>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Конфигуратор находится в разработке. Скоро будет доступен.
          </p>
        </div>
      </section>

      {/* Шаги */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-stone-900 text-center mb-10">
            Как это будет работать
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex gap-4 rounded-xl border bg-card p-5">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-12 px-4 bg-stone-50">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-stone-700 font-semibold text-lg mb-3">
            Хотите кухню уже сейчас?
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Пока конфигуратор в разработке — оставьте заявку и наш дизайнер сделает 3D-проект бесплатно.
          </p>
          <Link
            href="/contacts"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-white"
            )}
            style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
          >
            Получить бесплатный проект
          </Link>
        </div>
      </section>
    </main>
  );
}
