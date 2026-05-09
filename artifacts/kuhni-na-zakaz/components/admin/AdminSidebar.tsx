"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, UtensilsCrossed, Images, Star, FileText,
  BookOpen, MapPin, Settings, Users, Key, Activity, LogOut, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Дашборд", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/kitchens", icon: UtensilsCrossed, label: "Кухни", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/portfolio", icon: Images, label: "Портфолио", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/reviews", icon: Star, label: "Отзывы", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/blog", icon: BookOpen, label: "Блог", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/prices", icon: FileText, label: "Цены", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/pages", icon: FileText, label: "Страницы", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/locations", icon: MapPin, label: "Города", roles: ["SUPER_ADMIN", "MANAGER"] },
  { href: "/admin/settings", icon: Settings, label: "Настройки", roles: ["SUPER_ADMIN"] },
  { href: "/admin/users", icon: Users, label: "Пользователи", roles: ["SUPER_ADMIN"] },
  { href: "/admin/guest-access", icon: Key, label: "Гостевой доступ", roles: ["SUPER_ADMIN"] },
  { href: "/admin/activity-log", icon: Activity, label: "Журнал", roles: ["SUPER_ADMIN", "MANAGER"] },
];

export function AdminSidebar({ session }: { session: SessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = pathname ?? "";
  const guestSections = session.guestSections?.map((s) => s.trim()).filter(Boolean);

  const visibleNav = NAV.filter((item) =>
    guestSections
      ? guestSections.some((s) => item.href === `/admin/${s}` || item.href.startsWith(`/admin/${s}/`))
      : item.roles.includes(session.role)
  );

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className={cn("bg-foreground text-background flex flex-col transition-all duration-200", collapsed ? "w-14" : "w-56")}>
      <div className="flex items-center justify-between p-4 border-b border-background/10">
        {!collapsed && <span className="font-serif font-semibold text-background">КухниMinsk</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-background/60 hover:text-background p-1">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
      {!collapsed && (
        <div className="px-4 py-2 border-b border-background/10">
          <p className="text-xs text-background/60 truncate">{session.name}</p>
          <p className="text-xs text-background/40 truncate">{session.role === "SUPER_ADMIN" ? "Супер Админ" : "Менеджер"}</p>
        </div>
      )}
      <nav className="flex-1 py-2 overflow-y-auto">
        {visibleNav.map((item) => {
          const active = currentPath === item.href || currentPath.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                active ? "bg-background/10 text-background" : "text-background/60 hover:text-background hover:bg-background/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-background/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-background/60 hover:text-background transition-colors"
          data-testid="admin-logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Выйти"}
        </button>
      </div>
    </aside>
  );
}
