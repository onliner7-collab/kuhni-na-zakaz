"use client";

import Link from "@/components/navigation/Link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import {
  LayoutDashboard, UtensilsCrossed, Images, Star, FileText,
  BookOpen, MapPin, Settings, Users, Key, Activity, LogOut, ChevronLeft,
  DollarSign, Globe, Bell, Phone, Home, Route, Palette, Layers, UserCircle,
  HelpCircle, ChefHat, FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

const NAV_GROUPS = [
  {
    label: "\u041a\u043e\u043d\u0442\u0435\u043d\u0442",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "\u041f\u0430\u043d\u0435\u043b\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/kitchens", icon: UtensilsCrossed, label: "\u041a\u0443\u0445\u043d\u0438", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/portfolio", icon: Images, label: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/reviews", icon: Star, label: "\u041e\u0442\u0437\u044b\u0432\u044b", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/blog", icon: BookOpen, label: "\u0411\u043b\u043e\u0433", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/prices", icon: DollarSign, label: "\u0426\u0435\u043d\u044b", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/configurator-visual", icon: ChefHat, label: "\u0412\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043e\u0440", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/imports", icon: FileSpreadsheet, label: "Bulk import", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430",
    items: [
      { href: "/admin/homepage", icon: Home, label: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/scenarios", icon: Route, label: "\u0421\u0446\u0435\u043d\u0430\u0440\u0438\u0438 \u0432\u044b\u0431\u043e\u0440\u0430", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/styles", icon: Palette, label: "\u0421\u0442\u0438\u043b\u0438 \u043a\u0443\u0445\u043e\u043d\u044c", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/materials", icon: Layers, label: "\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/pages", icon: FileText, label: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0441\u0430\u0439\u0442\u0430", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/faq", icon: HelpCircle, label: "FAQ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/locations", icon: MapPin, label: "\u0413\u043e\u0440\u043e\u0434\u0430 \u0438 \u0440\u0435\u0433\u0438\u043e\u043d\u044b", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/leads", icon: Globe, label: "\u0417\u0430\u044f\u0432\u043a\u0438", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "\u0421\u0438\u0441\u0442\u0435\u043c\u0430",
    items: [
      { href: "/admin/contacts", icon: Phone, label: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0441\u0430\u0439\u0442\u0430", roles: ["SUPER_ADMIN"] },
      { href: "/admin/notifications", icon: Bell, label: "\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f Telegram", roles: ["SUPER_ADMIN"] },
      { href: "/admin/settings", icon: Settings, label: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0441\u0430\u0439\u0442\u0430", roles: ["SUPER_ADMIN"] },
      { href: "/admin/users", icon: Users, label: "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438", roles: ["SUPER_ADMIN"] },
      { href: "/admin/guest-access", icon: Key, label: "\u0413\u043e\u0441\u0442\u0435\u0432\u043e\u0439 \u0434\u043e\u0441\u0442\u0443\u043f", roles: ["SUPER_ADMIN"] },
      { href: "/admin/activity-log", icon: Activity, label: "\u0416\u0443\u0440\u043d\u0430\u043b \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/profile", icon: UserCircle, label: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "\u0421\u0443\u043f\u0435\u0440 \u0410\u0434\u043c\u0438\u043d", color: "text-violet-300" },
  MANAGER: { label: "\u041c\u0435\u043d\u0435\u0434\u0436\u0435\u0440", color: "text-blue-300" },
  GUEST: { label: "\u0413\u043e\u0441\u0442\u0435\u0432\u043e\u0439 \u0434\u043e\u0441\u0442\u0443\u043f", color: "text-amber-300" },
};

const SIDEBAR_BG = "linear-gradient(180deg, #1a0533 0%, #0f1525 100%)";
const BRAND_LETTER = "\u041a";
const BRAND_NAME = "\u041a\u0443\u0445\u043d\u0438";
const COLLAPSE_LABEL = "\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u043c\u0435\u043d\u044e";
const EXPAND_LABEL = "\u0420\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u043c\u0435\u043d\u044e";
const LOGOUT_LABEL = "\u0412\u044b\u0439\u0442\u0438";
const LOGOUT_TEXT = "\u0412\u044b\u0439\u0442\u0438 \u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043c\u044b";
const OPEN_SITE_LABEL = "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0430\u0439\u0442";

export function AdminSidebar({ session }: { session: SessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);

  useLayoutEffect(() => {
    setCollapsed(window.innerWidth < 768);
  }, []);

  const isGuest = !!session.guestSections;
  const roleInfo = ROLE_LABELS[session.role] ?? { label: session.role, color: "text-white/50" };

  function isVisible(item: { roles: string[]; href: string }) {
    if (isGuest) return session.guestSections!.some((s) => item.href.includes(s));
    return item.roles.includes(session.role);
  }

  async function handleLogout() {
    await fetch("/kapi/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-200 shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
      style={{ background: SIDEBAR_BG }}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/8">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
            >
              <span className="text-white font-black text-xs">{BRAND_LETTER}</span>
            </div>
            <span className="font-black text-base text-white tracking-tight truncate">
              {BRAND_NAME}
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                BY
              </span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin/dashboard" className="mx-auto">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
            >
              <span className="text-white font-black text-sm">{BRAND_LETTER}</span>
            </div>
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/8 transition-colors shrink-0 ml-1"
            aria-label={COLLAPSE_LABEL}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/8">
          <p className="text-sm text-white font-semibold truncate">{session.name}</p>
          <p className={cn("text-xs truncate mt-0.5", roleInfo.color)}>{roleInfo.label}</p>
        </div>
      )}

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 mb-1 p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors"
          aria-label={EXPAND_LABEL}
          title={EXPAND_LABEL}
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      )}

      <nav className="flex-1 py-2 overflow-y-auto space-y-4">
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
              {collapsed && <div className="border-t border-white/8 mx-2 mb-2" />}
              {visible.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      collapsed && "justify-center px-2",
                      active
                        ? "bg-violet-600/30 text-violet-200 border border-violet-500/30"
                        : "text-white/50 hover:text-white hover:bg-white/6"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-violet-300" : "")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/8 space-y-1">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/6 transition-all",
            collapsed && "justify-center px-2"
          )}
          data-testid="admin-logout"
          title={LOGOUT_LABEL}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && LOGOUT_TEXT}
        </button>
        {!collapsed && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-all"
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            {OPEN_SITE_LABEL}
          </Link>
        )}
      </div>
    </aside>
  );
}
