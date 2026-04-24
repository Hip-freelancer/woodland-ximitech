import { getTranslations } from "next-intl/server";
import NewsListSection from "@/components/sections/news/NewsListSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import {
  fetchVisibleCategories,
  fetchVisibleNewsPage,
} from "@/lib/content";
import { buildLocalizedMetadata, buildWoodlandSeoKeywords } from "@/lib/metadata";
import { getNewsArticles } from "@/lib/staticData";
import type { Locale } from "@/types";

function normalizeSingleQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizePageQuery(value: string | string[] | undefined) {
  const parsed = Number.parseInt(normalizeSingleQuery(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsBase.hero" });

  return buildLocalizedMetadata({
    locale,
    path: "/news",
    title: t("title"),
    description: t("subtitle"),
    keywords: buildWoodlandSeoKeywords(locale, [t("title"), t("subtitle")]),
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "newsBase.hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const initialCategory = normalizeSingleQuery(query.category);
  const initialPage = normalizePageQuery(query.page);
  const initialSearch = normalizeSingleQuery(query.q);
  const [categories, paginatedNews] = await Promise.all([
    fetchVisibleCategories(locale, "news"),
    fetchVisibleNewsPage(locale, {
      category: initialCategory,
      page: initialPage,
      pageSize: 7,
      search: initialSearch,
    }),
  ]);
  const hasActiveQuery =
    initialCategory.trim().length > 0 ||
    initialSearch.trim().length > 0 ||
    initialPage > 1;
  const fallbackArticles =
    paginatedNews.items.length > 0 || hasActiveQuery ? [] : getNewsArticles(locale);
  const resolvedArticles =
    paginatedNews.items.length > 0 ? paginatedNews.items : fallbackArticles;

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: t("title") },
        ]}
      />
      <PageHero label="Woodland" title={t("title")} description={t("subtitle")} />
      <NewsListSection
        articles={resolvedArticles}
        categories={categories.map((category) => ({
          label: category.name,
          slug: category.slug,
        }))}
        currentCategory={initialCategory}
        currentPage={paginatedNews.page}
        currentSearch={initialSearch}
        totalItems={paginatedNews.totalItems}
        totalPages={paginatedNews.totalPages}
      />
      <CtaBannerSection />
    </>
  );
}
