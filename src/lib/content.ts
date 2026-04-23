import "server-only";

import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";
import HomeSettingsModel from "@/models/HomeSettings";
import NewsArticleModel from "@/models/NewsArticle";
import ProductModel from "@/models/Product";
import TeamMemberModel from "@/models/TeamMember";
import { DEFAULT_HOME_SETTINGS } from "@/lib/homeSettingsDefaults";
import type {
  Category,
  HomeSettings,
  Locale,
  NewsArticle,
  Product,
  ProductMenuCategory,
  ProductMenuItem,
  TeamMember,
} from "@/types";

interface LocalizedValue {
  en?: string;
  vi?: string;
}

interface CategoryDocument {
  _id: unknown;
  createdAt?: Date | string;
  image?: string;
  isVisible?: boolean;
  name?: LocalizedValue;
  priority?: number;
  slug?: string;
  updatedAt?: Date | string;
}

interface ProductDocument {
  _id: unknown;
  applications?: Array<{
    image?: string;
    order?: number;
    subtitle?: LocalizedValue;
    title?: LocalizedValue;
  }>;
  availability?: LocalizedValue;
  bonding?: LocalizedValue;
  category?: string;
  certifications?: string[];
  createdAt?: Date | string;
  description?: LocalizedValue;
  dimensions?: string[];
  featured?: boolean;
  galleryImages?: string[];
  grade?: LocalizedValue;
  image?: string;
  isVisible?: boolean;
  material?: LocalizedValue;
  name?: LocalizedValue;
  priority?: number;
  series?: string;
  slug?: string;
  specifications?: Array<{
    attribute?: LocalizedValue;
    specification?: LocalizedValue;
    standard?: string;
    tolerance?: string;
  }>;
  thickness?: number[];
  updatedAt?: Date | string;
}

interface NewsDocument {
  _id: unknown;
  author?: string;
  category?: string;
  content?: LocalizedValue;
  createdAt?: Date | string;
  excerpt?: LocalizedValue;
  image?: string;
  isVisible?: boolean;
  priority?: number;
  publishDate?: Date | string;
  slug?: string;
  tags?: string[];
  title?: LocalizedValue;
  updatedAt?: Date | string;
}

interface HomeSettingsDocument {
  _id: unknown;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: Date | string;
  heroSlides?: Array<{
    _id?: unknown;
    alt?: LocalizedValue;
    isVisible?: boolean;
    mediaType?: "image" | "video";
    mediaUrl?: string;
    order?: number;
    posterUrl?: string;
  }>;
  heroStats?: Array<{
    _id?: unknown;
    isVisible?: boolean;
    label?: LocalizedValue;
    order?: number;
    value?: LocalizedValue;
  }>;
  updatedAt?: Date | string;
}

interface TeamMemberDocument {
  _id: unknown;
  createdAt?: Date | string;
  email?: string;
  image?: string;
  isVisible?: boolean;
  name?: LocalizedValue;
  order?: number;
  phone?: string;
  region?: LocalizedValue;
  title?: LocalizedValue;
  updatedAt?: Date | string;
  whatsapp?: string;
  zalo?: string;
}

function localize(value: LocalizedValue | string | undefined, locale: Locale) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value) {
    return "";
  }

  if (locale === "vi") {
    return value.vi || value.en || "";
  }

  return value.en || value.vi || "";
}

function formatDate(value: Date | string | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
}

function stripHtml(input: string) {
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function serializeCategory(doc: CategoryDocument, locale: Locale): Category {
  return {
    _id: String(doc._id),
    createdAt: formatDate(doc.createdAt),
    image: doc.image ?? "",
    isVisible: doc.isVisible ?? true,
    name: localize(doc.name, locale),
    priority: doc.priority ?? 0,
    slug: doc.slug ?? "",
    updatedAt: formatDate(doc.updatedAt),
  };
}

function serializeProduct(
  doc: ProductDocument,
  locale: Locale,
  categoryMap: Map<string, Category>
): Product {
  const galleryImages = Array.isArray(doc.galleryImages)
    ? doc.galleryImages.filter(Boolean)
    : [];
  const image = doc.image || galleryImages[0] || "";
  const mergedImages = image
    ? [image, ...galleryImages.filter((item) => item !== image)]
    : galleryImages;

  return {
    _id: String(doc._id),
    applications: (doc.applications ?? [])
      .map((item, index) => ({
        image: item.image ?? "",
        order: item.order ?? index,
        subtitle: localize(item.subtitle, locale),
        title: localize(item.title, locale),
      }))
      .sort((left, right) => left.order - right.order),
    availability: localize(doc.availability, locale),
    bonding: localize(doc.bonding, locale),
    category: doc.category ?? "",
    categoryLabel: categoryMap.get(doc.category ?? "")?.name ?? (doc.category ?? ""),
    certifications: doc.certifications ?? [],
    createdAt: formatDate(doc.createdAt),
    description: localize(doc.description, locale),
    dimensions: doc.dimensions ?? [],
    featured: doc.featured ?? false,
    galleryImages: mergedImages,
    grade: localize(doc.grade, locale),
    image,
    isVisible: doc.isVisible ?? true,
    material: localize(doc.material, locale),
    name: localize(doc.name, locale),
    priority: doc.priority ?? 0,
    series: doc.series ?? "",
    slug: doc.slug ?? "",
    specifications: (doc.specifications ?? []).map((item) => ({
      attribute: localize(item.attribute, locale),
      specification: localize(item.specification, locale),
      standard: item.standard ?? "",
      tolerance: item.tolerance ?? "",
    })),
    thickness: doc.thickness ?? [],
    updatedAt: formatDate(doc.updatedAt),
  };
}

function serializeProductMenuItem(
  doc: ProductDocument,
  locale: Locale
): ProductMenuItem | null {
  const galleryImages = Array.isArray(doc.galleryImages)
    ? doc.galleryImages.filter(Boolean)
    : [];
  const image = doc.image || galleryImages[0] || "";
  const name = localize(doc.name, locale);
  const slug = doc.slug ?? "";

  if (!name || !slug) {
    return null;
  }

  return {
    _id: String(doc._id),
    image,
    name,
    slug,
  };
}

function resolveMenuCategorySlug(
  rawCategory: string,
  categoryMap: Map<string, Category>
) {
  const normalizedCategory = rawCategory.trim();

  if (!normalizedCategory) {
    return null;
  }

  if (categoryMap.has(normalizedCategory)) {
    return normalizedCategory;
  }

  const loweredCategory = normalizedCategory.toLowerCase();

  for (const category of categoryMap.values()) {
    if (
      category.slug.toLowerCase() === loweredCategory ||
      category.name.toLowerCase() === loweredCategory
    ) {
      return category.slug;
    }
  }

  return normalizedCategory;
}

function serializeNews(
  doc: NewsDocument,
  locale: Locale,
  categoryMap: Map<string, Category>
): NewsArticle {
  const content = localize(doc.content, locale);
  const excerpt = localize(doc.excerpt, locale) || stripHtml(content).slice(0, 180);

  return {
    _id: String(doc._id),
    author: doc.author ?? "Editorial",
    category: doc.category ?? "",
    categoryLabel: categoryMap.get(doc.category ?? "")?.name ?? (doc.category ?? ""),
    content,
    createdAt: formatDate(doc.createdAt),
    excerpt,
    image: doc.image ?? "",
    isVisible: doc.isVisible ?? true,
    priority: doc.priority ?? 0,
    publishDate: formatDate(doc.publishDate),
    slug: doc.slug ?? "",
    tags: doc.tags ?? [],
    title: localize(doc.title, locale),
    updatedAt: formatDate(doc.updatedAt),
  };
}

function serializeHomeSettings(
  doc: HomeSettingsDocument | null
): HomeSettings {
  const source = doc ?? {
    ...DEFAULT_HOME_SETTINGS,
    _id: "default-home-settings",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const heroSlides = (source.heroSlides ?? DEFAULT_HOME_SETTINGS.heroSlides)
    .map((slide, index) => {
      const mediaType: "image" | "video" =
        slide.mediaType === "video" ? "video" : "image";

      return {
        _id: slide._id ? String(slide._id) : `slide-${index}`,
        alt: {
          en: slide.alt?.en || slide.alt?.vi || "",
          vi: slide.alt?.vi || slide.alt?.en || "",
        },
        isVisible: slide.isVisible ?? true,
        mediaType,
        mediaUrl: slide.mediaUrl ?? "",
        order: slide.order ?? index,
        posterUrl: slide.posterUrl ?? "",
      };
    })
    .filter((slide) => slide.mediaUrl)
    .sort((left, right) => left.order - right.order);

  const heroStats = (source.heroStats ?? DEFAULT_HOME_SETTINGS.heroStats)
    .map((stat, index) => ({
      _id: stat._id ? String(stat._id) : `stat-${index}`,
      isVisible: stat.isVisible ?? true,
      label: {
        en: stat.label?.en || stat.label?.vi || "",
        vi: stat.label?.vi || stat.label?.en || "",
      },
      order: stat.order ?? index,
      value: {
        en: stat.value?.en || stat.value?.vi || "",
        vi: stat.value?.vi || stat.value?.en || "",
      },
    }))
    .filter((stat) => stat.value.en || stat.value.vi || stat.label.en || stat.label.vi)
    .sort((left, right) => left.order - right.order);

  return {
    _id: String(source._id),
    contactEmail: source.contactEmail ?? DEFAULT_HOME_SETTINGS.contactEmail,
    contactPhone: source.contactPhone ?? DEFAULT_HOME_SETTINGS.contactPhone,
    createdAt: formatDate(source.createdAt) || new Date().toISOString(),
    heroSlides,
    heroStats,
    updatedAt: formatDate(source.updatedAt) || new Date().toISOString(),
  };
}

function serializeTeamMember(doc: TeamMemberDocument, locale: Locale): TeamMember {
  return {
    _id: String(doc._id),
    createdAt: formatDate(doc.createdAt),
    email: doc.email ?? "",
    image: doc.image ?? "",
    isVisible: doc.isVisible ?? true,
    name: localize(doc.name, locale),
    order: doc.order ?? 0,
    phone: doc.phone ?? "",
    region: localize(doc.region, locale),
    title: localize(doc.title, locale),
    updatedAt: formatDate(doc.updatedAt),
    whatsapp: doc.whatsapp ?? "",
    zalo: doc.zalo ?? "",
  };
}

async function getVisibleCategoryMap(locale: Locale) {
  await dbConnect();
  const categories = (await CategoryModel.find({ isVisible: true })
    .sort({ priority: 1, createdAt: -1 })
    .lean()) as CategoryDocument[];

  const serialized = categories.map((item) => serializeCategory(item, locale));

  return new Map(serialized.map((item) => [item.slug, item]));
}

export async function fetchVisibleCategories(locale: Locale) {
  const categoryMap = await getVisibleCategoryMap(locale);
  return Array.from(categoryMap.values());
}

export async function fetchHomeSettings() {
  await dbConnect();

  const settings = (await HomeSettingsModel.findOne({})
    .sort({ updatedAt: -1 })
    .lean()) as HomeSettingsDocument | null;

  return serializeHomeSettings(settings);
}

export async function fetchVisibleProducts(locale: Locale) {
  await dbConnect();

  const [categoryMap, products] = await Promise.all([
    getVisibleCategoryMap(locale),
    ProductModel.find({ isVisible: true })
      .sort({ priority: 1, createdAt: -1 })
      .lean(),
  ]);

  return (products as ProductDocument[]).map((item) =>
    serializeProduct(item, locale, categoryMap)
  );
}

export async function fetchProductMenu(locale: Locale, limitPerCategory = 4) {
  await dbConnect();

  const [categoryMap, products] = await Promise.all([
    getVisibleCategoryMap(locale),
    ProductModel.find({ isVisible: true })
      .sort({ priority: 1, createdAt: -1 })
      .lean(),
  ]);

  const groups = new Map<string, ProductMenuCategory>();

  for (const category of categoryMap.values()) {
    groups.set(category.slug, {
      image: category.image,
      name: category.name,
      productCount: 0,
      products: [],
      slug: category.slug,
    });
  }

  for (const product of products as ProductDocument[]) {
    const categorySlug = resolveMenuCategorySlug(product.category ?? "", categoryMap);

    const item = serializeProductMenuItem(product, locale);

    if (!item || !categorySlug) {
      continue;
    }

    const group =
      groups.get(categorySlug) ??
      {
        image: "",
        name: categoryMap.get(categorySlug)?.name ?? categorySlug,
        productCount: 0,
        products: [],
        slug: categorySlug,
      };

    groups.set(categorySlug, group);

    group.productCount += 1;

    if (group.products.length < limitPerCategory) {
      group.products.push(item);
    }

    if (!group.image && item.image) {
      group.image = item.image;
    }
  }

  return Array.from(groups.values()).filter((group) => group.productCount > 0);
}

export async function fetchFeaturedProducts(locale: Locale, limit = 3) {
  await dbConnect();

  const [categoryMap, products] = await Promise.all([
    getVisibleCategoryMap(locale),
    ProductModel.find({ featured: true, isVisible: true })
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit)
      .lean(),
  ]);

  return (products as ProductDocument[]).map((item) =>
    serializeProduct(item, locale, categoryMap)
  );
}

export async function fetchVisibleProductBySlug(slug: string, locale: Locale) {
  await dbConnect();

  const [categoryMap, product] = await Promise.all([
    getVisibleCategoryMap(locale),
    ProductModel.findOne({ isVisible: true, slug }).lean(),
  ]);

  if (!product) {
    return null;
  }

  return serializeProduct(product as ProductDocument, locale, categoryMap);
}

export async function fetchVisibleNews(locale: Locale, limit?: number) {
  await dbConnect();

  const query = NewsArticleModel.find({ isVisible: true }).sort({
    priority: 1,
    publishDate: -1,
  });

  if (typeof limit === "number") {
    query.limit(limit);
  }

  const [categoryMap, news] = await Promise.all([
    getVisibleCategoryMap(locale),
    query.lean(),
  ]);

  return (news as NewsDocument[]).map((item) =>
    serializeNews(item, locale, categoryMap)
  );
}

export async function fetchVisibleNewsBySlug(slug: string, locale: Locale) {
  await dbConnect();

  const [categoryMap, article] = await Promise.all([
    getVisibleCategoryMap(locale),
    NewsArticleModel.findOne({ isVisible: true, slug }).lean(),
  ]);

  if (!article) {
    return null;
  }

  return serializeNews(article as NewsDocument, locale, categoryMap);
}

export async function fetchVisibleTeamMembers(locale: Locale) {
  await dbConnect();

  const members = (await TeamMemberModel.find({ isVisible: true })
    .sort({ order: 1, createdAt: -1 })
    .lean()) as TeamMemberDocument[];

  return members.map((item) => serializeTeamMember(item, locale));
}
