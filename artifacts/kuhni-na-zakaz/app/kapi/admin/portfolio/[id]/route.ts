import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Ctx { params: Promise<{ id: string }> }

const portfolioCaseFields = [
  "externalId",
  "title",
  "shortTitle",
  "slug",
  "city",
  "cityKey",
  "region",
  "district",
  "kitchenType",
  "area",
  "layout",
  "style",
  "styleSlug",
  "color",
  "material",
  "materials",
  "materialSlugs",
  "scenarioSlugs",
  "priceFrom",
  "priceTo",
  "priceNote",
  "size",
  "facades",
  "countertop",
  "fittings",
  "workDuration",
  "days",
  "completedAt",
  "description",
  "task",
  "constraints",
  "solution",
  "result",
  "features",
  "relatedLocationSlugs",
  "mainImage",
  "images",
  "imageAlts",
  "imageCaptions",
  "alt",
  "photosBefore",
  "photosAfter",
  "reviewIds",
  "featured",
  "order",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "published",
] as const;

function cleanPortfolioCaseInput(input: Record<string, unknown>) {
  return Object.fromEntries(
    portfolioCaseFields
      .filter((field) => field in input)
      .map((field) => [field, input[field]]),
  );
}

export async function GET(_: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const c = await prisma.portfolioCase.findUnique({ where: { id: Number(id) } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(c);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = await req.json();
    const c = await prisma.portfolioCase.update({ where: { id: Number(id) }, data: cleanPortfolioCaseInput(data) as any });
    return NextResponse.json(c);
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.portfolioCase.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
