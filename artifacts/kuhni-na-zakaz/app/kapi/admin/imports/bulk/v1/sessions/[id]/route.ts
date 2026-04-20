import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getBulkImportSession } from "@/lib/bulk-import/v1";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: Context) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const preview = await getBulkImportSession(id);
    return NextResponse.json(preview);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Session not found" },
      { status: 404 }
    );
  }
}
