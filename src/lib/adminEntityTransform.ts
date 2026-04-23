import { createSlug } from "@/lib/slug";
import { normalizeCategoryContentType } from "@/lib/category";
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

interface HomeHeroSlideInput {
  alt?: LocalizedInput;
  isVisible?: unknown;
  mediaType?: unknown;
  mediaUrl?: unknown;
  order?: unknown;
  posterUrl?: unknown;
}

interface HomeHeroStatInput {
  isVisible?: unknown;
  label?: LocalizedInput;
  order?: unknown;
  value?: LocalizedInput;
}

interface TeamMemberInput {
  email?: unknown;
  image?: unknown;
  isVisible?: unknown;
  name?: LocalizedInput;
  order?: unknown;
  phone?: unknown;
  region?: LocalizedInput;
  title?: LocalizedInput;
  whatsapp?: unknown;
  zalo?: unknown;
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

function normalizeHomeHeroSlides(value: unknown) {
  return parseJsonArray<HomeHeroSlideInput>(value)
    .map((item, index) => ({
      alt: normalizeLocalizedText(item.alt),
      isVisible: normalizeBoolean(item.isVisible, true),
      mediaType: normalizeString(item.mediaType) === "video" ? "video" : "image",
      mediaUrl: normalizeString(item.mediaUrl),
      order: normalizeNumber(item.order, index),
      posterUrl: normalizeString(item.posterUrl),
    }))
    .filter((item) => item.mediaUrl)
    .sort((left, right) => left.order - right.order);
}

function normalizeHomeHeroStats(value: unknown) {
  return parseJsonArray<HomeHeroStatInput>(value)
    .map((item, index) => ({
      isVisible: normalizeBoolean(item.isVisible, true),
      label: normalizeLocalizedText(item.label),
      order: normalizeNumber(item.order, index),
      value: normalizeLocalizedText(item.value),
    }))
    .filter(
      (item) =>
        item.value.en || item.value.vi || item.label.en || item.label.vi
    )
    .sort((left, right) => left.order - right.order);
}

function normalizeTeamMember(value: unknown) {
  const input = asRecord(value) as TeamMemberInput;

  return {
    email: normalizeString(input.email),
    image: normalizeString(input.image),
    isVisible: normalizeBoolean(input.isVisible, true),
    name: normalizeLocalizedText(input.name),
    order: normalizeNumber(input.order, 0),
    phone: normalizeString(input.phone),
    region: normalizeLocalizedText(input.region),
    title: normalizeLocalizedText(input.title),
    whatsapp: normalizeString(input.whatsapp),
    zalo: normalizeString(input.zalo),
  };
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
        contentType: normalizeCategoryContentType(body.contentType),
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

    case "home-settings": {
      return {
        contactEmail: normalizeString(body.contactEmail),
        contactPhone: normalizeString(body.contactPhone),
        heroSlides: normalizeHomeHeroSlides(body.heroSlides ?? body.heroSlidesJson),
        heroStats: normalizeHomeHeroStats(body.heroStats ?? body.heroStatsJson),
      };
    }

    case "team": {
      return normalizeTeamMember(body);
    }

    default:
      return payload;
  }
}
