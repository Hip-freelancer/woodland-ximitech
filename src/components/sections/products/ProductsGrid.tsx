"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ui/ProductCard";
import ProductsFilterSidebar from "./ProductsFilterSidebar";
import type { Product } from "@/types";

interface ProductsGridProps {
  initialCategories?: string[];
  products: Product[];
}

export default function ProductsGrid({
  initialCategories = [],
  products,
}: ProductsGridProps) {
  const t = useTranslations("products");
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          products.map((product) => [
            product.category,
            product.categoryLabel ?? product.category,
          ])
        ).entries()
      ).map(([slug, label]) => ({ label, slug })),
    [products]
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = products.filter((p) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const thicknessMatch =
      selectedThickness === null || p.thickness.includes(selectedThickness);
    return categoryMatch && thicknessMatch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <ProductsFilterSidebar
        categories={categories}
        selectedCategories={selectedCategories}
        selectedThickness={selectedThickness}
        onCategoryChange={toggleCategory}
        onThicknessChange={setSelectedThickness}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <p className="font-label text-xs text-on-surface-variant">
            <span className="font-semibold text-primary">{filtered.length}</span>{" "}
            {t("results")}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-base text-on-surface-variant">{t("noProducts")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
