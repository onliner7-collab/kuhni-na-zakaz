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
  const fontSize = Math.max(28, Math.round(Math.min(width, height) / 15));
  const cornerFontSize = Math.max(16, Math.round(fontSize * 0.45));
  const centerX = Math.round(width / 2);
  const centerY = Math.round(height / 2);
  const cornerX = Math.max(24, width - Math.round(width * 0.04));
  const cornerY = Math.max(24, height - Math.round(height * 0.05));

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.03)"/>
      <g transform="translate(${centerX} ${centerY}) rotate(-14)">
        <rect x="${-fontSize * 3.25}" y="${-fontSize * 0.9}" width="${fontSize * 6.5}" height="${fontSize * 1.8}" rx="${fontSize * 0.22}" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.34)" stroke-width="2"/>
        <text x="0" y="${fontSize * 0.35}" text-anchor="middle" font-family="Georgia, serif" font-size="${fontSize}" font-weight="700" letter-spacing="${Math.round(fontSize * 0.12)}" fill="rgba(255,255,255,0.52)">КухниBY</text>
      </g>
      <g transform="translate(${cornerX} ${cornerY})">
        <rect x="${-cornerFontSize * 4.8}" y="${-cornerFontSize * 1.35}" width="${cornerFontSize * 4.8}" height="${cornerFontSize * 1.9}" rx="${cornerFontSize * 0.28}" fill="rgba(0,0,0,0.24)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
        <text x="${-cornerFontSize * 2.4}" y="${-cornerFontSize * 0.08}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${cornerFontSize}" font-weight="700" letter-spacing="${Math.round(cornerFontSize * 0.12)}" fill="rgba(255,255,255,0.66)">КухниBY</text>
      </g>
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
    const image = sharp(input).rotate();
    const metadata = await image.metadata();
    const width = metadata.width ?? 1200;
    const height = metadata.height ?? 900;
    const output = await image
      .composite([{ input: watermarkSvg(width, height), blend: "over" }])
      .webp({ quality: 84, effort: 4 })
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
