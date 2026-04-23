import { getTranslations } from "next-intl/server";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import SectionDivider from "@/components/ui/SectionDivider";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import { fetchVisibleProducts } from "@/lib/content";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products.hero" });

  return {
    title: `${t("title")} | Woodland`,
    description: t("subtitle"),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "products.hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const products = await fetchVisibleProducts(locale);
  const initialCategories = normalizeCategoryQuery(query.category);
  const resolvedProducts = products.length > 0 ? products : getAllProducts(locale);

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
          key={initialCategories.join("|") || "all-products"}
          products={resolvedProducts}
          initialCategories={initialCategories}
        />
      </section>
    </>
  );
}
