import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { createBulkImportSession } from "@/lib/bulk-import/v1";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const preview = await createBulkImportSession(buffer, file.name);

    return NextResponse.json(preview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
