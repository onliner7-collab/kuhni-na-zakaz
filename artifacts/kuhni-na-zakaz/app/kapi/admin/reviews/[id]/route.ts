import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["publish", "reject", "delete"]),
  reason: z.string().optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const reviewId = parseInt(id);
  const body = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  const { action, reason } = parsed.data;

  const statusMap = { publish: "PUBLISHED", reject: "REJECTED", delete: "DELETED" } as const;
  const status = statusMap[action];

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      status,
      moderatedById: session.userId || undefined,
      moderatedAt: new Date(),
      rejectionReason: reason,
    },
  }).catch(() => null);

  if (!review) return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });

  await prisma.activityLog.create({
    data: {
      userId: session.userId || undefined,
      action: `REVIEW_${action.toUpperCase()}`,
      entity: "Review",
      entityId: reviewId,
      ip: req.headers.get("x-forwarded-for") || "",
      userAgent: req.headers.get("user-agent") || "",
    },
  }).catch(() => {});

  return NextResponse.json({ ok: true, review });
}
