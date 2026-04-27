import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { applyBulkImportSession } from "@/lib/bulk-import/v1";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_: NextRequest, { params }: Context) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await applyBulkImportSession(id);
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
    revalidatePath("/", "layout");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Confirm failed" },
      { status: 400 }
    );
  }
}
