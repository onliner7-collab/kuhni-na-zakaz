const WEBP_REWRITE_PREFIXES = ["/uploads/seo-showcase/", "/images/"] as const;

export function optimizedImageSrc(src: string | null | undefined) {
  if (!src) return src;

  const canUseGeneratedWebp =
    src.endsWith(".png") && WEBP_REWRITE_PREFIXES.some((prefix) => src.startsWith(prefix));

  return canUseGeneratedWebp ? src.replace(/\.png$/i, ".webp") : src;
}
