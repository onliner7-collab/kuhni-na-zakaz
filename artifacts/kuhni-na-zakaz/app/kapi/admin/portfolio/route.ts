import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

export async function GET() {
  try {
    await requireAdmin();
    const cases = await prisma.portfolioCase.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(cases);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const portfolioCase = await prisma.portfolioCase.create({ data: cleanPortfolioCaseInput(data) as any });
    return NextResponse.json(portfolioCase, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
