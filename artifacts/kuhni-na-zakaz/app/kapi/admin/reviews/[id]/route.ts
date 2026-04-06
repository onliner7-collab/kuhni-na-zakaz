import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const moderateSchema = z.object({
  action: z.enum(["publish", "reject", "delete", "pending"]),
  reason: z.string().optional(),
  managerNote: z.string().optional(),
});

const editSchema = z.object({
  featured: z.boolean().optional(),
  caseSlug: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  region: z.string().optional(),
  managerNote: z.string().optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id: parseInt(id) } });
  if (!review) return NextResponse.json({ error: "Не найден" }, { status: 404 });
  return NextResponse.json(review);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const reviewId = parseInt(id);
  const body = await req.json();

  if (body.action !== undefined) {
    const parsed = moderateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

    const { action, reason, managerNote } = parsed.data;
    const statusMap = { publish: "PUBLISHED", reject: "REJECTED", delete: "DELETED", pending: "PENDING" } as const;
    const status = statusMap[action];

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        status,
        moderatedById: session.userId || undefined,
        moderatedAt: new Date(),
        rejectionReason: reason,
        ...(managerNote !== undefined ? { managerNote } : {}),
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

  const parsed = editSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: parsed.data,
  }).catch(() => null);

  if (!review) return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
  return NextResponse.json({ ok: true, review });
}
