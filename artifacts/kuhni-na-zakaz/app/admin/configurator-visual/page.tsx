import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Layers, LayoutTemplate, Palette, ChefHat, Settings, Grid3x3, Wrench, Zap, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Конфигуратор кухни — Каталоги" };

const sections = [
  {
    href: "/admin/configurator-visual/modules",
    icon: Grid3x3,
    title: "Модули",
    description: "Нижние, верхние, пеналы, угловые, под мойку, с ящиками и витринами",
  },
  {
    href: "/admin/configurator-visual/templates",
    icon: LayoutTemplate,
    title: "Шаблоны планировок",
    description: "Прямая, угловая, П-образная, с островом, компактные и прочие",
  },
  {
    href: "/admin/configurator-visual/facades",
    icon: Palette,
    title: "Фасады",
    description: "МДФ, эмаль, шпон, пластик — цвета, декоры, фактуры",
  },
  {
    href: "/admin/configurator-visual/countertops",
    icon: Layers,
    title: "Столешницы",
    description: "Ламинат, камень, кварц, дерево — толщина и цвета",
  },
  {
    href: "/admin/configurator-visual/skinals",
    icon: ChefHat,
    title: "Скинали / фартуки",
    description: "Стекло, плитка, акрил, МДФ",
  },
  {
    href: "/admin/configurator-visual/handles",
    icon: Wrench,
    title: "Ручки и безручечные системы",
    description: "Стандартные, врезные, push-to-open, интегрированные",
  },
  {
    href: "/admin/configurator-visual/mechanisms",
    icon: Settings,
    title: "Механизмы открывания",
    description: "Aventos и аналоги, мягкое закрытие, выдвижные системы",
  },
  {
    href: "/admin/configurator-visual/appliances",
    icon: Zap,
    title: "Встраиваемая техника",
    description: "Духовки, варочные панели, посудомойки, холодильники",
  },
  {
    href: "/admin/configurator-visual/compatibility",
    icon: AlertTriangle,
    title: "Правила совместимости",
    description: "Несовместимые и обязательные комбинации компонентов",
  },
  {
    href: "/admin/configurator-visual/settings",
    icon: Settings,
    title: "Настройки конфигуратора",
    description: "Дефолтные размеры, тексты шаринга, брендинг экспорта",
  },
];

export default function AdminConfiguratorVisualPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Визуальный конфигуратор</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Управление каталогами и настройками конструктора кухни
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm",
                "hover:border-violet-400 hover:shadow-md transition-all"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-100 p-2 text-violet-700 group-hover:bg-violet-200 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{s.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{s.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
