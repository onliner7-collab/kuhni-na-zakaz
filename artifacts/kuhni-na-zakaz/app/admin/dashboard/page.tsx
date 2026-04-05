import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UtensilsCrossed, Star, FileText, BookOpen, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Дашборд" };

async function getStats() {
  try {
    const [kitchens, pendingReviews, leads, posts, users] = await Promise.all([
      prisma.kitchen.count(),
      prisma.review.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
      prisma.blogPost.count(),
      prisma.user.count(),
    ]);
    return { kitchens, pendingReviews, leads, posts, users };
  } catch {
    return { kitchens: 0, pendingReviews: 0, leads: 0, posts: 0, users: 0 };
  }
}

async function getRecentLeads() {
  try {
    return await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getStats();
  const recentLeads = await getRecentLeads();

  const STAT_CARDS = [
    { label: "Кухни в каталоге", value: stats.kitchens, icon: UtensilsCrossed, href: "/admin/kitchens", color: "text-amber-600" },
    { label: "Новых отзывов", value: stats.pendingReviews, icon: Star, href: "/admin/reviews", color: "text-yellow-600", alert: stats.pendingReviews > 0 },
    { label: "Заявок всего", value: stats.leads, icon: FileText, href: "/admin/leads", color: "text-blue-600" },
    { label: "Статей блога", value: stats.posts, icon: BookOpen, href: "/admin/blog", color: "text-green-600" },
    { label: "Пользователей", value: stats.users, icon: Users, href: "/admin/users", color: "text-purple-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Дашборд</h1>
        <p className="text-muted-foreground text-sm mt-1">Добрый день, {session?.name}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <Link key={card.href} href={card.href} className={`card-base p-4 hover:shadow-md transition-shadow ${card.alert ? "border-yellow-300 bg-yellow-50" : ""}`}>
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
            {card.alert && <div className="text-xs text-yellow-600 font-medium mt-1">Требует внимания</div>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Последние заявки</h2>
            <Link href="/admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1">
              Все <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">Заявок пока нет</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-medium">{lead.name}</span>
                    <span className="text-muted-foreground ml-2">{lead.phone}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("ru")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-base p-6">
          <h2 className="font-semibold mb-4">Быстрые действия</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/kitchens/new", label: "Добавить кухню" },
              { href: "/admin/portfolio/new", label: "Добавить проект" },
              { href: "/admin/reviews", label: "Проверить отзывы" },
              { href: "/admin/blog/new", label: "Написать статью" },
              { href: "/admin/settings", label: "Изменить настройки" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-sm">
                {action.label}
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
