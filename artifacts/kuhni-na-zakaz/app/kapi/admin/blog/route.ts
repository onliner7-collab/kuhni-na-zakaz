import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
  readTime: z.number().int().min(1).default(5),
  coverImage: z.string().default(""),
  relatedCaseSlugs: z.array(z.string()).default([]),
  relatedStyleSlugs: z.array(z.string()).default([]),
  relatedScenarioSlugs: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export async function GET() {
  try {
    await requireAdmin();
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = BlogSchema.parse(body);
    const post = await prisma.blogPost.create({ data });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    if (err.code === "P2002") return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
