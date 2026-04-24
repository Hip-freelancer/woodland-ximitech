"use client";

import { useState, type FormEvent } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import ProductCard from "@/components/ui/ProductCard";
import ProductsFilterSidebar from "./ProductsFilterSidebar";
import type { Product } from "@/types";

interface ProductsGridProps {
  categories: Array<{ label: string; slug: string }>;
  currentPage: number;
  initialCategories?: string[];
  initialSearch?: string;
  initialThickness?: number | null;
  products: Product[];
  totalItems: number;
  totalPages: number;
}

export default function ProductsGrid({
  categories,
  currentPage,
  initialCategories = [],
  initialSearch = "",
  initialThickness = null,
  products,
  totalItems,
  totalPages,
}: ProductsGridProps) {
  const t = useTranslations("products");
  const tCatalog = useTranslations("products.catalog");
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(
    initialThickness,
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildHref = ({
    nextCategories = selectedCategories,
    nextPage = 1,
    nextSearch = searchQuery,
    nextThickness = selectedThickness,
  }: {
    nextCategories?: string[];
    nextPage?: number;
    nextSearch?: string;
    nextThickness?: number | null;
  } = {}) => {
    const params = new URLSearchParams();

    if (nextCategories.length > 0) {
      params.set("category", nextCategories.join(","));
    }

    if (nextThickness !== null) {
      params.set("thickness", String(nextThickness));
    }

    if (nextSearch.trim()) {
      params.set("q", nextSearch.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    return queryString ? `/products?${queryString}` : "/products";
  };

  const toggleCategory = (cat: string) => {
    const nextCategories = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];

    setSelectedCategories(nextCategories);
    router.push(buildHref({ nextCategories }));
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedThickness(null);
    setSearchQuery("");
    router.push("/products");
  };

  const updateThickness = (value: number | null) => {
    setSelectedThickness(value);
    router.push(buildHref({ nextThickness: value }));
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildHref({ nextSearch: searchQuery }));
  };

  return (
    <div className="space-y-10">
      <div className="border border-outline-variant/30 bg-surface-container-low px-6 py-7 md:px-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="">
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
                {totalItems}
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
                {products.length}
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
          isMobileOpen={mobileFiltersOpen}
          selectedCategories={selectedCategories}
          selectedThickness={selectedThickness}
          onCategoryChange={toggleCategory}
          onClose={() => setMobileFiltersOpen(false)}
          onThicknessChange={updateThickness}
          onReset={resetFilters}
        />

        <div className="flex-1">
          <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/30 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                <span className="font-semibold text-primary">
                  {totalItems}
                </span>{" "}
                {t("results")}
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={submitSearch}
            >
              <button
                className="inline-flex items-center justify-center gap-2 border border-outline-variant/40 bg-white px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
                type="button"
              >
                <SlidersHorizontal size={14} />
                Bộ lọc
              </button>
              <input
                className="min-w-[240px] border border-outline-variant/40 bg-white px-4 py-3 font-body text-sm text-on-surface outline-none transition-colors focus:border-primary"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={tCatalog("searchPlaceholder")}
                value={searchQuery}
              />
              <button
                className="border border-primary bg-primary px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-secondary"
                type="submit"
              >
                Tìm
              </button>
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
            </form>
          </div>

          {products.length === 0 ? (
            <div className="border border-dashed border-outline-variant/50 bg-surface-container-low px-6 py-24 text-center">
              <p className="font-body text-base text-on-surface-variant">
                {t("noProducts")}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 border-t border-outline-variant/20 pt-6">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <Link
                      key={page}
                      className={`min-w-11 px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                        page === currentPage
                          ? "bg-primary text-on-primary"
                          : "border border-outline-variant/40 bg-white text-primary hover:border-primary"
                      }`}
                      href={buildHref({ nextPage: page })}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
