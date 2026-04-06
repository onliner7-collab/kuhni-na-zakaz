import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const steps = await prisma.configStep.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      options: { where: { active: true }, orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(steps);
}
