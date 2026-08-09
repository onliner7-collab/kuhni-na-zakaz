import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { getImageDisclosure } from "@/lib/image-disclosure";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ALLOWED_EXTENSIONS = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolvePublicImage(src: string) {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("\0")) return null;
  if (getImageDisclosure(src).kind !== "generated") return null;

  const cleanSrc = src.split("?")[0] ?? src;
  const ext = path.extname(cleanSrc).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return null;

  const absolutePath = path.resolve(PUBLIC_DIR, `.${cleanSrc}`);
  const relativePath = path.relative(PUBLIC_DIR, absolutePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return null;

  return absolutePath;
}

function watermarkSvg(width: number, height: number) {
  const fontSize = Math.max(16, Math.round(Math.min(width, height) / 34));
  const paddingX = Math.max(18, Math.round(fontSize * 0.95));
  const paddingY = Math.max(14, Math.round(fontSize * 0.8));
  const textWidth = Math.round(fontSize * 4.9);
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = Math.round(fontSize * 1.85);
  const x = Math.max(12, width - boxWidth - Math.round(width * 0.025));
  const y = Math.max(12, height - boxHeight - Math.round(height * 0.025));
  const textX = x + Math.round(boxWidth / 2);
  const textY = y + Math.round(boxHeight * 0.62);

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="${Math.round(fontSize * 0.35)}" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.26)" stroke-width="1"/>
      <text x="${textX}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="${Math.round(fontSize * 0.12)}" fill="rgba(255,255,255,0.72)">КухниBY</text>
    </svg>
  `);
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src") ?? "";
  const imagePath = resolvePublicImage(src);

  if (!imagePath) {
    return new NextResponse("Недоступное изображение", { status: 400 });
  }

  try {
    const input = await readFile(imagePath);
    const requestedWidth = Number(request.nextUrl.searchParams.get("w"));
    const maxWidth = Number.isFinite(requestedWidth) ? Math.max(320, Math.min(1600, Math.round(requestedWidth))) : undefined;
    const image = sharp(input).rotate();
    const metadata = await image.metadata();
    const sourceWidth = metadata.width ?? 1200;
    const sourceHeight = metadata.height ?? 900;
    const width = maxWidth && sourceWidth > maxWidth ? maxWidth : sourceWidth;
    const height = Math.round(sourceHeight * (width / sourceWidth));
    const output = await image
      .resize({ width, withoutEnlargement: true })
      .composite([{ input: watermarkSvg(width, height), blend: "over" }])
      // The watermark is applied on the request path used by article LCP images.
      // A low WebP effort keeps the same visual quality while avoiding multi-second cold renders.
      .webp({ quality: 84, effort: 1 })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Robots-Tag": "index",
      },
    });
  } catch {
    return new NextResponse("Изображение не найдено", { status: 404 });
  }
}
