import { NextRequest } from "next/server";

import { handleImageDelete, handleImageUpload } from "@/lib/admin-image-upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handleImageUpload(req, "styles");
}

export async function DELETE(req: NextRequest) {
  return handleImageDelete(req, "styles");
}
