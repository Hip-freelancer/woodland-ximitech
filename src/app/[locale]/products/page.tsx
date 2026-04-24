import { getTranslations } from "next-intl/server";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import SectionDivider from "@/components/ui/SectionDivider";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import { fetchVisibleCategories, fetchVisibleProductsPage } from "@/lib/content";
import { buildLocalizedMetadata, buildWoodlandSeoKeywords } from "@/lib/metadata";
import { getAllProducts } from "@/lib/staticData";
import type { Locale } from "@/types";

function normalizeCategoryQuery(value: string | string[] | undefined) {
  const rawValues = Array.isArray(value) ? value : [value];

  return Array.from(
    new Set(
      rawValues
        .flatMap((item) => (item ?? "").split(","))
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function normalizeSingleQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizePageQuery(value: string | string[] | undefined) {
  const parsed = Number.parseInt(normalizeSingleQuery(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizeThicknessQuery(value: string | string[] | undefined) {
  const parsed = Number.parseInt(normalizeSingleQuery(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products.hero" });

  return buildLocalizedMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("subtitle"),
    keywords: buildWoodlandSeoKeywords(locale, [t("title"), t("subtitle")]),
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
    q?: string | string[];
    thickness?: string | string[];
  }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "products.hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const initialCategories = normalizeCategoryQuery(query.category);
  const initialPage = normalizePageQuery(query.page);
  const initialSearch = normalizeSingleQuery(query.q);
  const initialThickness = normalizeThicknessQuery(query.thickness);
  const [categories, paginatedProducts] = await Promise.all([
    fetchVisibleCategories(locale, "product"),
    fetchVisibleProductsPage(locale, {
      categories: initialCategories,
      page: initialPage,
      pageSize: 9,
      search: initialSearch,
      thickness: initialThickness,
    }),
  ]);
  const hasActiveQuery =
    initialCategories.length > 0 ||
    initialSearch.trim().length > 0 ||
    initialThickness !== null ||
    initialPage > 1;
  const fallbackProducts =
    paginatedProducts.items.length > 0 || hasActiveQuery ? [] : getAllProducts(locale);
  const resolvedProducts =
    paginatedProducts.items.length > 0 ? paginatedProducts.items : fallbackProducts;

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: t("title") },
        ]}
      />
      <PageHero label={t("subtitle")} title={t("title")} />
      <SectionDivider />
      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <ProductsGrid
          key={`${initialCategories.join("|") || "all-products"}-${initialPage}-${initialSearch}-${initialThickness ?? "all"}`}
          categories={categories.map((category) => ({
            label: category.name,
            slug: category.slug,
          }))}
          currentPage={paginatedProducts.page}
          initialSearch={initialSearch}
          initialThickness={initialThickness}
          products={resolvedProducts}
          initialCategories={initialCategories}
          totalItems={paginatedProducts.totalItems}
          totalPages={paginatedProducts.totalPages}
        />
      </section>
    </>
  );
}
