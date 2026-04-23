export type CategoryContentType = "product" | "news";

const LEGACY_CATEGORY_SUFFIXES = ["-tieng-viet", "-ban-tieng-viet"];

export function normalizeCategoryContentType(
  value: unknown,
  fallback: CategoryContentType = "product"
): CategoryContentType {
  return value === "news" ? "news" : fallback;
}

export function stripLegacyCategorySuffix(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();

  for (const suffix of LEGACY_CATEGORY_SUFFIXES) {
    if (normalizedSlug.endsWith(suffix)) {
      return normalizedSlug.slice(0, -suffix.length);
    }
  }

  return normalizedSlug;
}

export function buildCategorySlugCandidates(rawValue: string) {
  const normalizedValue = rawValue.trim().toLowerCase();

  if (!normalizedValue) {
    return [];
  }

  return Array.from(
    new Set([normalizedValue, stripLegacyCategorySuffix(normalizedValue)])
  );
}

export function categorySlugMatches(categorySlug: string, rawValue: string) {
  const categoryCandidates = buildCategorySlugCandidates(categorySlug);
  const rawCandidates = buildCategorySlugCandidates(rawValue);

  return rawCandidates.some((candidate) => categoryCandidates.includes(candidate));
}
