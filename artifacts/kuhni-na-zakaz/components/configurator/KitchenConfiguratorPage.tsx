"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layers, LayoutTemplate, Palette, Box, Save, Share2, ChevronDown } from "lucide-react";
import { KitchenConfigurator } from "./KitchenConfigurator";

type View = "landing" | "configurator";

const HOW_IT_WORKS = [
  { icon: Box, title: "Помещение", desc: "Укажите размеры, двери, окна и выступы" },
  { icon: LayoutTemplate, title: "Планировка", desc: "Выберите готовый шаблон или расставьте модули вручную" },
  { icon: Palette, title: "Стиль", desc: "Фасады, столешницы, скинали, ручки и техника" },
  { icon: Layers, title: "2D / 3D", desc: "Смотрите план и трёхмерную модель в реальном времени" },
  { icon: Save, title: "Сохранение", desc: "Проект автоматически сохраняется. Можно вернуться позже" },
  { icon: Share2, title: "Поделиться", desc: "Отправьте проект родственникам или менеджеру" },
];

interface KitchenConfiguratorPageProps {
  catalog: Parameters<typeof KitchenConfigurator>[0]["catalog"];
}

export function KitchenConfiguratorPage({ catalog }: KitchenConfiguratorPageProps) {
  const [view, setView] = useState<View>("landing");

  if (view === "configurator") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <KitchenConfigurator catalog={catalog} />
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white py-20 px-4">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/30 px-4 py-1.5 text-sm font-medium text-amber-300 mb-6"
          >
            ✨ Визуальный конфигуратор — новый инструмент
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5"
          >
            Спроектируйте кухню<br />
            <span className="text-amber-400">прямо здесь</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-300 leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Задайте помещение, выберите планировку, материалы — и увидьте результат в 2D и 3D.
            Сохраните и поделитесь с дизайнером.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("configurator")}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-lg shadow-amber-900/40 transition-all"
              style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
            >
              Начать проектирование
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-400"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-black text-stone-900 text-center mb-10"
          >
            Как это работает
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-4 rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ───────────────────────────────────── */}
      <section className="py-14 px-4 border-t">
        <div className="max-w-xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-black text-stone-900 mb-3"
          >
            Готовы начать?
          </motion.h2>
          <p className="text-muted-foreground text-sm mb-6">
            Бесплатно, без регистрации. Проект автоматически сохраняется в браузере.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setView("configurator")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-md shadow-amber-200 transition-all"
            style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
          >
            Открыть конфигуратор
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </main>
  );
}
