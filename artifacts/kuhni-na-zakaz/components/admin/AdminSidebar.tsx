"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, UtensilsCrossed, Images, Star, FileText,
  BookOpen, MapPin, Settings, Users, Key, Activity, LogOut, ChevronLeft,
  DollarSign, Globe, Bell, Phone, Home, Route, Palette, Layers, UserCircle,
  Sparkles, Bookmark, HelpCircle, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

const NAV_GROUPS = [
  {
    label: "Контент",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Панель управления", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/kitchens", icon: UtensilsCrossed, label: "Кухни", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/portfolio", icon: Images, label: "Портфолио", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/reviews", icon: Star, label: "Отзывы", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/blog", icon: BookOpen, label: "Блог", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/prices", icon: DollarSign, label: "Цены", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/configurator", icon: Sparkles, label: "Конфигуратор", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "Структура",
    items: [
      { href: "/admin/homepage", icon: Home, label: "Главная страница", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/scenarios", icon: Route, label: "Сценарии выбора", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/styles", icon: Palette, label: "Стили кухонь", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/materials", icon: Layers, label: "Материалы", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/pages", icon: FileText, label: "Страницы сайта", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/faq", icon: HelpCircle, label: "FAQ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/locations", icon: MapPin, label: "Города и регионы", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/leads", icon: Globe, label: "Заявки", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/saved-configs", icon: Bookmark, label: "Сохранённые подборы", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "Система",
    items: [
      { href: "/admin/contacts", icon: Phone, label: "Контакты сайта", roles: ["SUPER_ADMIN"] },
      { href: "/admin/notifications", icon: Bell, label: "Уведомления Telegram", roles: ["SUPER_ADMIN"] },
      { href: "/admin/settings", icon: Settings, label: "Настройки сайта", roles: ["SUPER_ADMIN"] },
      { href: "/admin/users", icon: Users, label: "Пользователи", roles: ["SUPER_ADMIN"] },
      { href: "/admin/guest-access", icon: Key, label: "Гостевой доступ", roles: ["SUPER_ADMIN"] },
      { href: "/admin/activity-log", icon: Activity, label: "Журнал действий", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/profile", icon: UserCircle, label: "Мой профиль", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Супер Админ", color: "text-violet-300" },
  MANAGER: { label: "Менеджер", color: "text-blue-300" },
  GUEST: { label: "Гостевой доступ", color: "text-amber-300" },
};

const SIDEBAR_BG = "linear-gradient(180deg, #1a0533 0%, #0f1525 100%)";

export function AdminSidebar({ session }: { session: SessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isGuest = !!session.guestSections;
  const roleInfo = ROLE_LABELS[session.role] ?? { label: session.role, color: "text-white/50" };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isVisible(item: { roles: string[]; href: string }) {
    if (isGuest) return session.guestSections!.some((s) => item.href.includes(s));
    return item.roles.includes(session.role);
  }

  async function handleLogout() {
    await fetch("/kapi/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function NavItems({ onItemClick }: { onItemClick?: () => void }) {
    return (
      <nav className="flex-1 py-3 overflow-y-auto space-y-4">
        {NAV_GROUPS.map((group) => {
          const visible = group.items.filter(isVisible);
          if (visible.length === 0) return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-4 text-xs font-bold text-white/25 uppercase tracking-widest mb-1">
                  {group.label}
                </p>
              )}
              {visible.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-violet-600/30 text-violet-200 border border-violet-500/30"
                        : "text-white/50 hover:text-white hover:bg-white/6"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-violet-300" : "")} />
                    <span className={cn(collapsed && "sr-only")}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    );
  }

  function LogoutArea({ showLabel }: { showLabel: boolean }) {
    return (
      <div className="p-3 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/6 transition-all"
          data-testid="admin-logout"
          title={!showLabel ? "Выйти" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {showLabel && "Выйти из системы"}
        </button>
        {showLabel && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-all mt-1"
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            Открыть сайт
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 h-14 border-b border-white/10"
        style={{ background: "#1a0533" }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white/70 hover:text-white p-1.5 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
          >
            <span className="text-white font-black text-xs">К</span>
          </div>
          <span className="font-black text-sm text-white tracking-tight">
            Кухни<span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span>
          </span>
        </Link>
        <span className="ml-auto text-xs text-white/30">{session.name}</span>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative z-10 w-72 max-w-[85vw] flex flex-col overflow-hidden"
            style={{ background: SIDEBAR_BG }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
              <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                >
                  <span className="text-white font-black text-xs">К</span>
                </div>
                <span className="font-black text-base text-white tracking-tight">
                  Кухни<span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/8 transition-colors"
                aria-label="Закрыть меню"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-sm text-white font-semibold truncate">{session.name}</p>
              <p className={cn("text-xs truncate mt-0.5", roleInfo.color)}>{roleInfo.label}</p>
            </div>
            {/* Nav — force collapsed=false for mobile */}
            <nav className="flex-1 py-3 overflow-y-auto space-y-4">
              {NAV_GROUPS.map((group) => {
                const visible = group.items.filter(isVisible);
                if (visible.length === 0) return null;
                return (
                  <div key={group.label}>
                    <p className="px-4 text-xs font-bold text-white/25 uppercase tracking-widest mb-1">
                      {group.label}
                    </p>
                    {visible.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 mx-2 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                            active
                              ? "bg-violet-600/30 text-violet-200 border border-violet-500/30"
                              : "text-white/50 hover:text-white hover:bg-white/6"
                          )}
                        >
                          <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-violet-300" : "")} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
            <LogoutArea showLabel={true} />
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-200 shrink-0",
          collapsed ? "w-14" : "w-60"
        )}
        style={{ background: SIDEBAR_BG }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                <span className="text-white font-black text-xs">К</span>
              </div>
              <span className="font-black text-base text-white tracking-tight">
                Кухни<span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/8 transition-colors ml-auto"
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-sm text-white font-semibold truncate">{session.name}</p>
            <p className={cn("text-xs truncate mt-0.5", roleInfo.color)}>{roleInfo.label}</p>
          </div>
        )}

        <NavItems />
        <LogoutArea showLabel={!collapsed} />
      </aside>
    </>
  );
}
