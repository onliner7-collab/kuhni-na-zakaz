import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ReviewModerationList } from "@/components/admin/ReviewModerationList";

export const metadata: Metadata = { title: "Модерация отзывов" };

export default async function AdminReviewsPage() {
  const session = await getSession();

  const [newReviews, published, rejected] = await Promise.all([
    prisma.review.findMany({ where: { status: { in: ["NEW", "PENDING"] } }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.review.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
    prisma.review.findMany({ where: { status: { in: ["REJECTED", "DELETED"] } }, orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Модерация отзывов</h1>
      {newReviews.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">⚠ {newReviews.length} отзывов ждут проверки</p>
        </div>
      )}
      <ReviewModerationList
        newReviews={JSON.parse(JSON.stringify(newReviews))}
        published={JSON.parse(JSON.stringify(published))}
        rejected={JSON.parse(JSON.stringify(rejected))}
        canModerate={session?.role === "SUPER_ADMIN" || session?.role === "MANAGER"}
      />
    </div>
  );
}
