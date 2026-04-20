"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ui/ProductCard";
import ProductsFilterSidebar from "./ProductsFilterSidebar";
import type { Product } from "@/types";

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const t = useTranslations("products");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(null);

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
        selectedCategories={selectedCategories}
        selectedThickness={selectedThickness}
        onCategoryChange={toggleCategory}
        onThicknessChange={setSelectedThickness}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <p className="font-label text-xs text-[#534340]">
            <span className="font-semibold text-[#331917]">{filtered.length}</span>{" "}
            {t("results")}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-base text-[#534340]">{t("noProducts")}</p>
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
