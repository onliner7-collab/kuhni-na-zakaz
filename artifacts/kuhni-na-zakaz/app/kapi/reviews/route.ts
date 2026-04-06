import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  region: z.string().max(100).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(20).max(5000),
  caseSlug: z.string().max(200).optional().default(""),
  source: z.string().max(50).optional().default("website"),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Неверный формат данных", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const review = await prisma.review.create({
      data: {
        name: data.name,
        city: data.city,
        region: data.region || "",
        phone: data.phone || "",
        rating: data.rating,
        text: data.text,
        caseSlug: data.caseSlug || "",
        source: data.source || "website",
        status: "NEW",
      },
    });

    return NextResponse.json({ ok: true, id: review.id });
  } catch (err) {
    console.error("[REVIEWS POST]", err);
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}
