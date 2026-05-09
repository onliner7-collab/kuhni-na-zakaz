/** Локальные пути, для которых `scripts/optimize-site-images.js` создаёт одноимённые `.webp`. */
const WEBP_REWRITE_PREFIXES = [
  "/uploads/seo-showcase/",
  "/uploads/kitchens/",
  "/uploads/portfolio/",
  "/images/",
] as const;

export function optimizedImageSrc(src: string | null | undefined) {
  if (!src) return src;

  const lower = src.toLowerCase();
  const hasRasterExt = /\.(png|jpe?g)$/i.test(lower);
  const inOptimizedTree = WEBP_REWRITE_PREFIXES.some((prefix) =>
    src.startsWith(prefix),
  );

  return hasRasterExt && inOptimizedTree
    ? src.replace(/\.(png|jpe?g)$/i, ".webp")
    : src;
}

export function isPreoptimizedRasterSrc(src: string | null | undefined) {
  if (!src) return false;

  return /\.(webp|avif)$/i.test(src);
}
