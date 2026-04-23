"use client";

import { useDeferredValue, useMemo, useState } from "react";
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
  const tCatalog = useTranslations("products.catalog");
  const itemsPerPage = 9;
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearchQuery = useDeferredValue(searchQuery);

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
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedThickness(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filtered = products.filter((p) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const thicknessMatch =
      selectedThickness === null || p.thickness.includes(selectedThickness);
    const searchSource = `${p.name} ${p.material} ${p.categoryLabel ?? p.category}`.toLowerCase();
    const searchMatch =
      deferredSearchQuery.trim().length === 0 ||
      searchSource.includes(deferredSearchQuery.trim().toLowerCase());
    return categoryMatch && thicknessMatch && searchMatch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filtered.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <div className="space-y-10">
      <div className="border border-outline-variant/30 bg-surface-container-low px-6 py-7 md:px-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
              {tCatalog("title")}
            </h2>
            <p className="mt-4 font-body text-sm leading-7 text-on-surface-variant md:text-base">
              {tCatalog("description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border border-outline-variant/30 bg-white px-4 py-4">
              <p className="font-headline text-2xl font-black text-primary">
                {products.length}
              </p>
              <p className="mt-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                {tCatalog("stats.items")}
              </p>
            </div>
            <div className="border border-outline-variant/30 bg-white px-4 py-4">
              <p className="font-headline text-2xl font-black text-primary">
                {categories.length}
              </p>
              <p className="mt-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                {tCatalog("stats.categories")}
              </p>
            </div>
            <div className="border border-outline-variant/30 bg-white px-4 py-4">
              <p className="font-headline text-2xl font-black text-primary">
                {filtered.length}
              </p>
              <p className="mt-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                {tCatalog("stats.visible")}
              </p>
            </div>
            <div className="border border-outline-variant/30 bg-white px-4 py-4">
              <p className="font-headline text-2xl font-black text-primary">
                {selectedThickness ?? tCatalog("stats.all")}
              </p>
              <p className="mt-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                {tCatalog("stats.thickness")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row">
        <ProductsFilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          selectedThickness={selectedThickness}
          onCategoryChange={toggleCategory}
          onThicknessChange={setSelectedThickness}
          onReset={resetFilters}
        />

        <div className="flex-1">
          <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/30 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                <span className="font-semibold text-primary">{filtered.length}</span>{" "}
                {t("results")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                className="min-w-[240px] border border-outline-variant/40 bg-white px-4 py-3 font-body text-sm text-on-surface outline-none transition-colors focus:border-primary"
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={tCatalog("searchPlaceholder")}
                value={searchQuery}
              />
              {(selectedCategories.length > 0 ||
                selectedThickness !== null ||
                searchQuery.trim().length > 0) && (
                <button
                  className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-secondary"
                  onClick={resetFilters}
                  type="button"
                >
                  {tCatalog("clearFilters")}
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-outline-variant/50 bg-surface-container-low px-6 py-24 text-center">
              <p className="font-body text-base text-on-surface-variant">
                {t("noProducts")}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 border-t border-outline-variant/20 pt-6">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`min-w-11 px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                          page === safeCurrentPage
                            ? "bg-primary text-on-primary"
                            : "border border-outline-variant/40 bg-white text-primary hover:border-primary"
                        }`}
                        onClick={() => setCurrentPage(page)}
                        type="button"
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
