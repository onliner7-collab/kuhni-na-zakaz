"use client";

import Link from "next/link";
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
    label: "РљРѕРЅС‚РµРЅС‚",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "РџР°РЅРµР»СЊ СѓРїСЂР°РІР»РµРЅРёСЏ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/kitchens", icon: UtensilsCrossed, label: "РљСѓС…РЅРё", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/portfolio", icon: Images, label: "РџРѕСЂС‚С„РѕР»РёРѕ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/reviews", icon: Star, label: "РћС‚Р·С‹РІС‹", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/blog", icon: BookOpen, label: "Р‘Р»РѕРі", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/prices", icon: DollarSign, label: "Р¦РµРЅС‹", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/configurator-visual", icon: ChefHat, label: "Р’РёР·СѓР°Р»СЊРЅС‹Р№ РєРѕРЅС„РёРіСѓСЂР°С‚РѕСЂ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/imports", icon: FileSpreadsheet, label: "Bulk import", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "РЎС‚СЂСѓРєС‚СѓСЂР°",
    items: [
      { href: "/admin/homepage", icon: Home, label: "Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/scenarios", icon: Route, label: "РЎС†РµРЅР°СЂРёРё РІС‹Р±РѕСЂР°", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/styles", icon: Palette, label: "РЎС‚РёР»Рё РєСѓС…РѕРЅСЊ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/materials", icon: Layers, label: "РњР°С‚РµСЂРёР°Р»С‹", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/pages", icon: FileText, label: "РЎС‚СЂР°РЅРёС†С‹ СЃР°Р№С‚Р°", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/faq", icon: HelpCircle, label: "FAQ", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/locations", icon: MapPin, label: "Р“РѕСЂРѕРґР° Рё СЂРµРіРёРѕРЅС‹", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/leads", icon: Globe, label: "Р—Р°СЏРІРєРё", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "РЎРёСЃС‚РµРјР°",
    items: [
      { href: "/admin/contacts", icon: Phone, label: "РљРѕРЅС‚Р°РєС‚С‹ СЃР°Р№С‚Р°", roles: ["SUPER_ADMIN"] },
      { href: "/admin/notifications", icon: Bell, label: "РЈРІРµРґРѕРјР»РµРЅРёСЏ Telegram", roles: ["SUPER_ADMIN"] },
      { href: "/admin/settings", icon: Settings, label: "РќР°СЃС‚СЂРѕР№РєРё СЃР°Р№С‚Р°", roles: ["SUPER_ADMIN"] },
      { href: "/admin/users", icon: Users, label: "РџРѕР»СЊР·РѕРІР°С‚РµР»Рё", roles: ["SUPER_ADMIN"] },
      { href: "/admin/guest-access", icon: Key, label: "Р“РѕСЃС‚РµРІРѕР№ РґРѕСЃС‚СѓРї", roles: ["SUPER_ADMIN"] },
      { href: "/admin/activity-log", icon: Activity, label: "Р–СѓСЂРЅР°Р» РґРµР№СЃС‚РІРёР№", roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/profile", icon: UserCircle, label: "РњРѕР№ РїСЂРѕС„РёР»СЊ", roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "РЎСѓРїРµСЂ РђРґРјРёРЅ", color: "text-violet-300" },
  MANAGER: { label: "РњРµРЅРµРґР¶РµСЂ", color: "text-blue-300" },
  GUEST: { label: "Р“РѕСЃС‚РµРІРѕР№ РґРѕСЃС‚СѓРї", color: "text-amber-300" },
};

const SIDEBAR_BG = "linear-gradient(180deg, #1a0533 0%, #0f1525 100%)";

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
              <span className="text-white font-black text-xs">Рљ</span>
            </div>
            <span className="font-black text-base text-white tracking-tight truncate">
              РљСѓС…РЅРё<span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BY</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin/dashboard" className="mx-auto">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
            >
              <span className="text-white font-black text-sm">Рљ</span>
            </div>
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/8 transition-colors shrink-0 ml-1"
            aria-label="РЎРІРµСЂРЅСѓС‚СЊ РјРµРЅСЋ"
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
          aria-label="Р Р°Р·РІРµСЂРЅСѓС‚СЊ РјРµРЅСЋ"
          title="Р Р°Р·РІРµСЂРЅСѓС‚СЊ РјРµРЅСЋ"
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
          title="Р’С‹Р№С‚Рё"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Р’С‹Р№С‚Рё РёР· СЃРёСЃС‚РµРјС‹"}
        </button>
        {!collapsed && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-all"
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            РћС‚РєСЂС‹С‚СЊ СЃР°Р№С‚
          </Link>
        )}
      </div>
    </aside>
  );
}
