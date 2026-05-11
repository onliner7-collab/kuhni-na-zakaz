export function isPublicContentSlug(slug: string | null | undefined) {
  if (!slug) return false;

  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) return false;

  return !/(^|-)pilot($|-)/.test(normalizedSlug);
}

export function publicSlugWhere() {
  return {
    not: "",
    notIn: ["pilot", "test"],
  };
}
