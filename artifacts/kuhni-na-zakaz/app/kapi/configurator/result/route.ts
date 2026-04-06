import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { answers, tags } = await req.json();
    const result = await prisma.configResult.create({
      data: { answers, tags },
    });
    return NextResponse.json({ id: result.id, sessionId: result.sessionId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
