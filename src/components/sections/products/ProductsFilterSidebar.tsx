"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const THICKNESSES = [12, 18, 21, 24];

interface ProductsFilterSidebarProps {
  categories: Array<{ label: string; slug: string }>;
  isMobileOpen: boolean;
  onCategoryChange: (cat: string) => void;
  onClose: () => void;
  onReset: () => void;
  onThicknessChange: (t: number | null) => void;
  selectedCategories: string[];
  selectedThickness: number | null;
}

interface FilterPanelProps {
  categories: Array<{ label: string; slug: string }>;
  hasActiveFilters: boolean;
  isMobile?: boolean;
  onCategoryChange: (cat: string) => void;
  onClose?: () => void;
  onReset: () => void;
  onThicknessChange: (t: number | null) => void;
  selectedCategories: string[];
  selectedThickness: number | null;
}

function FilterPanel({
  categories,
  hasActiveFilters,
  isMobile = false,
  onCategoryChange,
  onClose,
  onReset,
  onThicknessChange,
  selectedCategories,
  selectedThickness,
}: FilterPanelProps) {
  const t = useTranslations("products.filters");
  const tCatalog = useTranslations("products.catalog");

  return (
    <div
      className={`border border-outline-variant/40 bg-surface-container-lowest shadow-[0_22px_40px_rgba(18,55,31,0.06)] ${
        isMobile ? "h-full overflow-y-auto p-5" : "sticky top-24 p-6"
      }`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-5">
        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            Woodland
          </p>
          <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tight text-primary">
            {t("title")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters ? (
            <button
              className="inline-flex items-center border border-outline-variant/60 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors duration-200 hover:border-secondary hover:text-secondary"
              onClick={onReset}
              type="button"
            >
              {tCatalog("reset")}
            </button>
          ) : null}
          {isMobile ? (
            <button
              className="inline-flex items-center justify-center border border-outline-variant/60 p-2 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
              onClick={onClose}
              type="button"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {t("type")}
        </p>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label
              key={category.slug}
              className={`flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 transition-colors duration-200 ${
                selectedCategories.includes(category.slug)
                  ? "border-primary/25 bg-primary/7"
                  : "border-outline-variant/40 bg-white hover:border-primary/35"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => onCategoryChange(category.slug)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                <span className="font-body text-sm text-on-surface-variant">
                  {category.label}
                </span>
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-outline-variant/30 pt-6">
        <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {t("thickness")}
        </p>
        <div className="flex flex-wrap gap-2">
          {THICKNESSES.map((mm) => (
            <button
              key={mm}
              onClick={() =>
                onThicknessChange(selectedThickness === mm ? null : mm)
              }
              className={`px-3 py-2 font-label text-xs font-semibold uppercase tracking-[0.16em] border transition-colors duration-200 ${
                selectedThickness === mm
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant/50 bg-white text-on-surface-variant hover:border-primary"
              }`}
              type="button"
            >
              {mm}mm
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-outline-variant/30 pt-6">
        <p className="font-body text-sm leading-7 text-on-surface-variant">
          {tCatalog("helper")}
        </p>
      </div>
    </div>
  );
}

export default function ProductsFilterSidebar({
  categories,
  isMobileOpen,
  onCategoryChange,
  onClose,
  onReset,
  onThicknessChange,
  selectedCategories,
  selectedThickness,
}: ProductsFilterSidebarProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedThickness !== null;

  return (
    <>
      <aside className="hidden w-full shrink-0 lg:block lg:w-[300px]">
        <FilterPanel
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onCategoryChange={onCategoryChange}
          onReset={onReset}
          onThicknessChange={onThicknessChange}
          selectedCategories={selectedCategories}
          selectedThickness={selectedThickness}
        />
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-[65] bg-black/30 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white">
            <FilterPanel
              categories={categories}
              hasActiveFilters={hasActiveFilters}
              isMobile
              onCategoryChange={onCategoryChange}
              onClose={onClose}
              onReset={onReset}
              onThicknessChange={onThicknessChange}
              selectedCategories={selectedCategories}
              selectedThickness={selectedThickness}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
