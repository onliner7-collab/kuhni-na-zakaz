import { NextRequest, NextResponse } from "next/server";

import {
  handleImageDelete,
  handleImageUpload,
  isImageUploadBucket,
} from "@/lib/admin-image-upload";

export const runtime = "nodejs";

interface Context {
  params: Promise<{ entity: string }>;
}

function resolveBucketResponse(entity: string) {
  if (isImageUploadBucket(entity)) return entity;
  return null;
}

export async function POST(req: NextRequest, { params }: Context) {
  const { entity } = await params;
  const bucket = resolveBucketResponse(entity);

  if (!bucket)
    return NextResponse.json({ error: "Unsupported upload target" }, { status: 404 });

  return handleImageUpload(req, bucket);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { entity } = await params;
  const bucket = resolveBucketResponse(entity);

  if (!bucket)
    return NextResponse.json({ error: "Unsupported upload target" }, { status: 404 });

  return handleImageDelete(req, bucket);
}
