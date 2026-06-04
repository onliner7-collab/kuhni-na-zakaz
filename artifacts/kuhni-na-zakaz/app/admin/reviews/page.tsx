import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ReviewModerationList } from "@/components/admin/ReviewModerationList";
import type { ReviewFull } from "@/components/admin/ReviewModerationList";

export const metadata: Metadata = { title: "Модерация отзывов" };

async function enrichWithCases(reviews: Awaited<ReturnType<typeof prisma.review.findMany>>) {
  const slugs = [...new Set(reviews.map((r) => r.caseSlug).filter(Boolean))];
  const cases = slugs.length
    ? await prisma.portfolioCase.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, title: true },
      })
    : [];
  const caseMap = Object.fromEntries(cases.map((c) => [c.slug, c.title]));
  return reviews.map((r) => ({
    ...r,
    caseTitle: r.caseSlug ? (caseMap[r.caseSlug] || r.caseSlug) : "",
    region: r.region ?? "",
    source: r.source ?? "website",
    sourceUrl: r.sourceUrl ?? "",
    featured: r.featured ?? false,
    managerNote: r.managerNote ?? "",
    rejectionReason: r.rejectionReason ?? null,
    moderatedAt: r.moderatedAt ? r.moderatedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  })) as ReviewFull[];
}

export default async function AdminReviewsPage() {
  const session = await getSession();

  const [newRaw, pendingRaw, publishedRaw, rejectedRaw] = await Promise.all([
    prisma.review.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.review.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.review.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 30 }).catch(() => []),
    prisma.review.findMany({ where: { status: { in: ["REJECTED", "DELETED"] } }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
  ]);

  const [newReviews, pending, published, rejected] = await Promise.all([
    enrichWithCases(newRaw),
    enrichWithCases(pendingRaw),
    enrichWithCases(publishedRaw),
    enrichWithCases(rejectedRaw),
  ]);

  const totalPending = newReviews.length + pending.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Модерация отзывов</h1>
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            {published.length} опубликовано
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {rejected.length} отклонено
          </span>
        </div>
      </div>

      {totalPending > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-yellow-900 font-semibold">{totalPending} {totalPending === 1 ? "отзыв ждёт" : totalPending < 5 ? "отзыва ждут" : "отзывов ждут"} проверки</p>
            <p className="text-yellow-700 text-sm">Эти отзывы были переведены в ручную проверку. Новые отзывы с сайта публикуются автоматически.</p>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-muted/30 rounded-xl text-sm text-muted-foreground">
        <strong className="text-foreground">Статусы:</strong>{" "}
        <span className="text-yellow-600 font-medium">Новые</span> — отзывы, вручную отправленные на разбор.{" "}
        <span className="text-blue-600 font-medium">На проверке</span> — взяты в работу, но решение не принято.{" "}
        <span className="text-green-600 font-medium">Опубликовано</span> — видны посетителям сайта.{" "}
        <span className="text-red-600 font-medium">Отклонено</span> — скрыты с публичных страниц.
      </div>

      <ReviewModerationList
        newReviews={newReviews}
        pending={pending}
        published={published}
        rejected={rejected}
        canModerate={session?.role === "SUPER_ADMIN" || session?.role === "MANAGER"}
      />
    </div>
  );
}
