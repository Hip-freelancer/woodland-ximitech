import type { MetadataRoute } from "next";
import dbConnect from "@/lib/dbConnect";
import { getAbsoluteUrl, getLocalizedPath } from "@/lib/metadata";
import ProductModel from "@/models/Product";
import NewsArticleModel from "@/models/NewsArticle";
import type { Locale } from "@/types";

const LOCALES: Locale[] = ["en", "vi"];
const STATIC_PATHS = [
  "/",
  "/about",
  "/operations",
  "/contact",
  "/gallery",
  "/news",
  "/products",
  "/sales-team",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const [products, news] = await Promise.all([
    ProductModel.find({ isVisible: true }).select("slug updatedAt").lean(),
    NewsArticleModel.find({ isVisible: true }).select("slug updatedAt").lean(),
  ]);

  const staticEntries = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, path)),
      lastModified: new Date(),
    }))
  );

  const productEntries = LOCALES.flatMap((locale) =>
    products.map((product) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, `/products/${product.slug}`)),
      lastModified: product.updatedAt ?? new Date(),
    }))
  );

  const newsEntries = LOCALES.flatMap((locale) =>
    news.map((article) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, `/news/${article.slug}`)),
      lastModified: article.updatedAt ?? new Date(),
    }))
  );

  return [...staticEntries, ...productEntries, ...newsEntries];
}
