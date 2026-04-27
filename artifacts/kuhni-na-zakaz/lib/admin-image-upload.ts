import { randomUUID } from "crypto";
import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

import { requireAdmin } from "@/lib/auth";

export const IMAGE_UPLOAD_BUCKETS = ["kitchens", "materials", "portfolio", "styles"] as const;

export type ImageUploadBucket = (typeof IMAGE_UPLOAD_BUCKETS)[number];

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1600;

function sanitizeBaseName(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "image"
  );
}

function extFromFile(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

function getUploadDir(bucket: ImageUploadBucket) {
  return path.join(process.cwd(), "public", "uploads", bucket);
}

function getPublicPrefix(bucket: ImageUploadBucket) {
  return `/uploads/${bucket}/`;
}

async function optimizeUploadedImage(buffer: Buffer, file: File) {
  if (file.type === "image/gif") return buffer;

  const pipeline = sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true });

  switch (file.type) {
    case "image/jpeg":
      return pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    case "image/png":
      return pipeline.png({ compressionLevel: 9, quality: 76, effort: 10, palette: true }).toBuffer();
    case "image/webp":
      return pipeline.webp({ quality: 76, effort: 6 }).toBuffer();
    default:
      return buffer;
  }
}

export function isImageUploadBucket(value: string): value is ImageUploadBucket {
  return IMAGE_UPLOAD_BUCKETS.includes(value as ImageUploadBucket);
}

export function resolvePublicUploadPath(bucket: ImageUploadBucket, imagePath: string) {
  const publicPrefix = getPublicPrefix(bucket);
  if (!imagePath.startsWith(publicPrefix)) return null;

  const relativePath = imagePath.slice(publicPrefix.length);
  if (!relativePath || relativePath.includes("..") || path.isAbsolute(relativePath)) return null;

  return path.join(getUploadDir(bucket), relativePath);
}

export async function handleImageUpload(req: NextRequest, bucket: ImageUploadBucket) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File))
      return NextResponse.json({ error: "file is required" }, { status: 400 });

    if (!ALLOWED_TYPES.has(file.type))
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });

    if (file.size > MAX_FILE_SIZE)
      return NextResponse.json({ error: "Image must be 8MB or smaller" }, { status: 400 });

    const uploadDir = getUploadDir(bucket);
    await mkdir(uploadDir, { recursive: true });

    const ext = extFromFile(file);
    const safeName = sanitizeBaseName(file.name);
    const filename = `${Date.now()}-${safeName}-${randomUUID().slice(0, 8)}${ext}`;
    const absolutePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    const optimizedBuffer = await optimizeUploadedImage(buffer, file);
    await writeFile(absolutePath, optimizedBuffer);

    return NextResponse.json({ url: `${getPublicPrefix(bucket)}${filename}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}

export async function handleImageDelete(req: NextRequest, bucket: ImageUploadBucket) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imagePath } = await req.json();
    if (typeof imagePath !== "string" || imagePath.length === 0)
      return NextResponse.json({ error: "imagePath is required" }, { status: 400 });

    const absolutePath = resolvePublicUploadPath(bucket, imagePath);
    if (!absolutePath) {
      return NextResponse.json(
        { error: `Only local uploaded ${bucket} images can be deleted` },
        { status: 400 }
      );
    }

    await rm(absolutePath, { force: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 400 }
    );
  }
}
