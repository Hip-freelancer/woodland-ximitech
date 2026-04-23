import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import "@/models/Category";
import "@/models/NewsArticle";
import Category from "@/models/Category";
import NewsArticle from "@/models/NewsArticle";
import dbConnect from "@/lib/dbConnect";
import {
  buildCategorySlugCandidates,
  stripLegacyCategorySuffix,
  type CategoryContentType,
} from "@/lib/category";

interface CategoryRecord {
  _id: mongoose.Types.ObjectId;
  contentType?: CategoryContentType;
  image?: string;
  isVisible?: boolean;
  name?: { en?: string; vi?: string };
  priority?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  slug?: string;
}

interface NewsRecord {
  _id: mongoose.Types.ObjectId;
  category?: string;
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDefaultSeo(label: string) {
  return {
    description: label ? `Danh mục ${label}` : "",
    keywords: label.toLowerCase(),
    title: label,
  };
}

async function run() {
  await dbConnect();

  const [categories, newsArticles] = await Promise.all([
    Category.find({}).lean<CategoryRecord[]>(),
    NewsArticle.find({}, { category: 1 }).lean<NewsRecord[]>(),
  ]);

  const categoryOperations: mongoose.AnyBulkWriteOperation<CategoryRecord>[] = [];
  const normalizedExistingNewsSlugs = new Set(
    categories
      .filter((item) => item.contentType === "news")
      .map((item) => stripLegacyCategorySuffix(item.slug ?? ""))
      .filter(Boolean)
  );

  for (const category of categories) {
    const nextSlug = stripLegacyCategorySuffix(category.slug ?? "");
    const nextContentType = category.contentType === "news" ? "news" : "product";

    categoryOperations.push({
      updateOne: {
        filter: { _id: category._id },
        update: {
          $set: {
            contentType: nextContentType,
            slug: nextSlug,
          },
        },
      },
    });
  }

  const newsCategoryMap = new Map<string, string>();
  const newsCategoriesToCreate: Array<{
    contentType: "news";
    image: string;
    isVisible: boolean;
    name: { en: string; vi: string };
    priority: number;
    seo: { title: string; description: string; keywords: string };
    slug: string;
  }> = [];

  for (const article of newsArticles) {
    const rawCategory = (article.category || "").trim();

    if (!rawCategory) {
      continue;
    }

    const normalizedSlug = stripLegacyCategorySuffix(rawCategory);

    newsCategoryMap.set(rawCategory, normalizedSlug);

    if (normalizedExistingNewsSlugs.has(normalizedSlug)) {
      continue;
    }

    const matchedSourceCategory = categories.find((category) =>
      buildCategorySlugCandidates(category.slug ?? "").includes(normalizedSlug)
    );
    const resolvedLabel =
      matchedSourceCategory?.name?.vi ||
      matchedSourceCategory?.name?.en ||
      titleCaseFromSlug(normalizedSlug);

    newsCategoriesToCreate.push({
      contentType: "news",
      image: matchedSourceCategory?.image ?? "",
      isVisible: matchedSourceCategory?.isVisible ?? true,
      name: {
        en: matchedSourceCategory?.name?.en || titleCaseFromSlug(normalizedSlug),
        vi: matchedSourceCategory?.name?.vi || titleCaseFromSlug(normalizedSlug),
      },
      priority: matchedSourceCategory?.priority ?? 0,
      seo: {
        ...buildDefaultSeo(resolvedLabel),
        ...matchedSourceCategory?.seo,
      },
      slug: normalizedSlug,
    });

    normalizedExistingNewsSlugs.add(normalizedSlug);
  }

  if (categoryOperations.length > 0) {
    await Category.bulkWrite(categoryOperations);
  }

  if (newsCategoriesToCreate.length > 0) {
    await Category.insertMany(newsCategoriesToCreate, { ordered: false });
  }

  const newsOperations = Array.from(newsCategoryMap.entries()).map(
    ([rawCategory, normalizedSlug]) => ({
      updateMany: {
        filter: { category: rawCategory },
        update: {
          $set: {
            category: normalizedSlug,
          },
        },
      },
    })
  );

  if (newsOperations.length > 0) {
    await NewsArticle.bulkWrite(newsOperations);
  }

  console.log(
    JSON.stringify(
      {
        createdNewsCategories: newsCategoriesToCreate.length,
        normalizedCategories: categoryOperations.length,
        normalizedNewsCategoryRefs: newsOperations.length,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error("Không thể migrate category content type:", error);
  process.exit(1);
});
