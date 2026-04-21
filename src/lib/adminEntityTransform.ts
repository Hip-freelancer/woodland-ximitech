import { createSlug } from "@/lib/slug";
import { normalizeLocalizedRichText } from "@/lib/richText";

interface LocalizedInput {
  en?: unknown;
  vi?: unknown;
}

interface SeoInput {
  title?: unknown;
  description?: unknown;
  keywords?: unknown;
}

interface ProductSpecInput {
  attribute?: LocalizedInput;
  specification?: LocalizedInput;
  tolerance?: unknown;
  standard?: unknown;
}

interface ProductApplicationInput {
  order?: unknown;
  title?: LocalizedInput;
  subtitle?: LocalizedInput;
  image?: unknown;
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLocalizedText(value: unknown) {
  const input = asRecord(value) as LocalizedInput;

  return {
    en: normalizeString(input.en),
    vi: normalizeString(input.vi),
  };
}

function normalizeSeo(value: unknown) {
  const input = asRecord(value) as SeoInput;

  return {
    description: normalizeString(input.description),
    keywords: normalizeString(input.keywords),
    title: normalizeString(input.title),
  };
}

function normalizeNumber(value: unknown, fallback = 0) {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return fallback;
}

function normalizeStringList(value: unknown, separators: RegExp = /[\n,]+/) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeString(item))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(separators)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeNumberList(value: unknown) {
  return normalizeStringList(value).map((item) => Number(item)).filter(Number.isFinite);
}

function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeProductSpecs(value: unknown) {
  return parseJsonArray<ProductSpecInput>(value)
    .map((item) => ({
      attribute: normalizeLocalizedText(item.attribute),
      specification: normalizeLocalizedText(item.specification),
      standard: normalizeString(item.standard),
      tolerance: normalizeString(item.tolerance),
    }))
    .filter(
      (item) =>
        item.attribute.en ||
        item.attribute.vi ||
        item.specification.en ||
        item.specification.vi ||
        item.standard ||
        item.tolerance
    );
}

function normalizeProductApplications(value: unknown) {
  return parseJsonArray<ProductApplicationInput>(value)
    .map((item, index) => ({
      image: normalizeString(item.image),
      order: normalizeNumber(item.order, index),
      subtitle: normalizeLocalizedText(item.subtitle),
      title: normalizeLocalizedText(item.title),
    }))
    .filter(
      (item) =>
        item.title.en || item.title.vi || item.subtitle.en || item.subtitle.vi || item.image
    );
}

function getSlugFromLocalizedText(value: unknown, fallback = "") {
  const localized = normalizeLocalizedText(value);
  const source = localized.vi || localized.en || fallback;

  return createSlug(source);
}

export function normalizeAdminEntityPayload(entity: string, payload: unknown) {
  const body = asRecord(payload);

  switch (entity.toLowerCase()) {
    case "categories": {
      const name = normalizeLocalizedText(body.name);
      const slug = getSlugFromLocalizedText(body.name, normalizeString(body.slug));

      return {
        image: normalizeString(body.image),
        isVisible: normalizeBoolean(body.isVisible, true),
        name,
        priority: normalizeNumber(body.priority, 0),
        seo: normalizeSeo(body.seo),
        slug,
      };
    }

    case "news": {
      const title = normalizeLocalizedText(body.title);
      const slug = getSlugFromLocalizedText(body.title, normalizeString(body.slug));

      return {
        author: normalizeString(body.author) || "Editorial",
        category: normalizeString(body.category),
        content: normalizeLocalizedRichText(body.content),
        excerpt: normalizeLocalizedText(body.excerpt),
        image: normalizeString(body.image),
        isVisible: normalizeBoolean(body.isVisible, true),
        priority: normalizeNumber(body.priority, 0),
        publishDate:
          normalizeString(body.publishDate) || new Date().toISOString().split("T")[0],
        seo: normalizeSeo(body.seo),
        slug,
        tags: normalizeStringList(body.tags),
        title,
      };
    }

    case "products": {
      const name = normalizeLocalizedText(body.name);
      const slug = getSlugFromLocalizedText(body.name, normalizeString(body.slug));
      const galleryImages = normalizeStringList(body.galleryImages ?? body.galleryImagesText, /\n+/);
      const image = galleryImages[0] || normalizeString(body.image);
      const normalizedGalleryImages = image
        ? [image, ...galleryImages.filter((item) => item !== image)]
        : galleryImages;

      return {
        applications: normalizeProductApplications(
          body.applications ?? body.applicationsJson
        ),
        availability: normalizeLocalizedText(body.availability),
        bonding: normalizeLocalizedText(body.bonding),
        category: normalizeString(body.category),
        certifications: normalizeStringList(
          body.certifications ?? body.certificationsText
        ),
        description: normalizeLocalizedRichText(body.description),
        dimensions: normalizeStringList(body.dimensions ?? body.dimensionsText),
        featured: normalizeBoolean(body.featured, false),
        galleryImages: normalizedGalleryImages,
        grade: normalizeLocalizedText(body.grade),
        image,
        isVisible: normalizeBoolean(body.isVisible, true),
        material: normalizeLocalizedText(body.material),
        name,
        priority: normalizeNumber(body.priority, 0),
        seo: normalizeSeo(body.seo),
        series: normalizeString(body.series),
        slug,
        specifications: normalizeProductSpecs(
          body.specifications ?? body.specificationsJson
        ),
        thickness: normalizeNumberList(body.thickness ?? body.thicknessText),
      };
    }

    default:
      return payload;
  }
}
