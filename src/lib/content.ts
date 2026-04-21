import "server-only";

import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/Category";
import NewsArticleModel from "@/models/NewsArticle";
import ProductModel from "@/models/Product";
import type {
  Category,
  Locale,
  NewsArticle,
  Product,
  ProductMenuCategory,
  ProductMenuItem,
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

function localize(value: LocalizedValue | undefined, locale: Locale) {
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
