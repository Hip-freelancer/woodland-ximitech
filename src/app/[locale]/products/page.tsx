import { getTranslations } from "next-intl/server";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import SectionDivider from "@/components/ui/SectionDivider";
import PageHero from "@/components/ui/PageHero";
import { fetchVisibleProducts } from "@/lib/content";
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

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "products.hero" });
  const products = await fetchVisibleProducts(locale);
  const initialCategories = normalizeCategoryQuery(query.category);

  return (
    <>
      <PageHero label={t("subtitle")} title={t("title")} />
      <SectionDivider />
      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <ProductsGrid
          key={initialCategories.join("|") || "all-products"}
          products={products}
          initialCategories={initialCategories}
        />
      </section>
    </>
  );
}
