import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UtensilsCrossed, Star, FileText, BookOpen, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Панель управления" };

async function getStats() {
  try {
    const [kitchens, pendingReviews, newLeads, totalLeads, posts, users] = await Promise.all([
      prisma.kitchen.count(),
      prisma.review.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.lead.count(),
      prisma.blogPost.count(),
      prisma.user.count(),
    ]);
    return { kitchens, pendingReviews, newLeads, totalLeads, posts, users };
  } catch {
    return { kitchens: 0, pendingReviews: 0, newLeads: 0, totalLeads: 0, posts: 0, users: 0 };
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
  if (!session) redirect("/admin/login");
  const stats = await getStats();
  const recentLeads = await getRecentLeads();

  const STAT_CARDS = [
    {
      label: "Кухни в каталоге",
      sub: "Отображаются на сайте",
      value: stats.kitchens,
      icon: UtensilsCrossed,
      href: "/admin/kitchens",
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-100",
    },
    {
      label: "Отзывов на проверке",
      sub: "Нужно одобрить или отклонить",
      value: stats.pendingReviews,
      icon: Star,
      href: "/admin/reviews",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
      alert: stats.pendingReviews > 0,
    },
    {
      label: "Новых заявок",
      sub: stats.newLeads > 0 ? "Ждут звонка — требуют внимания" : `Всего заявок: ${stats.totalLeads}`,
      value: stats.newLeads,
      icon: FileText,
      href: "/admin/leads?status=new",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
      alert: stats.newLeads > 0,
    },
    {
      label: "Статей в блоге",
      sub: "Опубликованных и черновиков",
      value: stats.posts,
      icon: BookOpen,
      href: "/admin/blog",
      color: "text-green-600",
      bg: "bg-green-50 border-green-100",
    },
    {
      label: "Пользователей",
      sub: "Имеют доступ к панели",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      color: "text-pink-600",
      bg: "bg-pink-50 border-pink-100",
    },
  ];

  const QUICK_ACTIONS = [
    { href: "/admin/kitchens/new", label: "Добавить кухню в каталог", desc: "Новая позиция появится на /catalog" },
    { href: "/admin/portfolio/new", label: "Добавить выполненный проект", desc: "Публикуется в разделе Портфолио" },
    { href: "/admin/leads?status=new", label: "Обработать новые заявки", desc: stats.newLeads > 0 ? `${stats.newLeads} ждут звонка` : "Нет необработанных", alert: stats.newLeads > 0 },
    { href: "/admin/reviews", label: "Проверить новые отзывы", desc: `${stats.pendingReviews} ждут модерации`, alert: stats.pendingReviews > 0 },
    { href: "/admin/blog/new", label: "Написать статью", desc: "Публикуется в разделе Блог" },
    { href: "/admin/settings", label: "Настройки сайта", desc: "Телефон, адрес, реквизиты" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-black text-foreground">Панель управления</h1>
        <p className="text-muted-foreground mt-1">
          Добро пожаловать, <span className="font-semibold text-foreground">{session?.name}</span>. Здесь вы управляете всем содержимым сайта.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`rounded-2xl p-4 border hover:shadow-md transition-all hover:scale-[1.02] ${card.alert ? "border-amber-300 bg-amber-50" : card.bg}`}
          >
            <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
            <div className="text-2xl font-black">{card.value}</div>
            <div className="text-xs font-semibold text-foreground mt-0.5">{card.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{card.sub}</div>
            {card.alert && (
              <div className="text-xs text-amber-700 font-semibold mt-2 flex items-center gap-1">
                ⚠ Требует внимания
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">Последние заявки</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Клиенты, оставившие заявку на сайте</p>
            </div>
            <Link href="/admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              Все заявки <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Заявок пока нет</p>
              <p className="text-xs text-muted-foreground mt-1">Когда клиент заполнит форму — заявка появится здесь</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold">{lead.name}</span>
                    <span className="text-muted-foreground ml-2">{lead.phone}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("ru")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-4">
            <h2 className="font-bold text-lg">Быстрые действия</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Часто используемые разделы</p>
          </div>
          <div className="space-y-1">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors ${action.alert ? "bg-amber-50 border border-amber-200" : ""}`}
              >
                <div>
                  <div className="text-sm font-semibold">{action.label}</div>
                  <div className={`text-xs mt-0.5 ${action.alert ? "text-amber-700" : "text-muted-foreground"}`}>{action.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
