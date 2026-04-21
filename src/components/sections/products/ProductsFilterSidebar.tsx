"use client";

import { useTranslations } from "next-intl";

const THICKNESSES = [12, 18, 21, 24];

interface ProductsFilterSidebarProps {
  categories: Array<{ label: string; slug: string }>;
  selectedCategories: string[];
  selectedThickness: number | null;
  onCategoryChange: (cat: string) => void;
  onThicknessChange: (t: number | null) => void;
}

export default function ProductsFilterSidebar({
  categories,
  selectedCategories,
  selectedThickness,
  onCategoryChange,
  onThicknessChange,
}: ProductsFilterSidebarProps) {
  const t = useTranslations("products.filters");

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
            {t("type")}
          </p>
          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => onCategoryChange(category.slug)}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="font-body text-sm text-on-surface-variant">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-4">
            {t("thickness")}
          </p>
          <div className="flex flex-wrap gap-2">
            {THICKNESSES.map((mm) => (
              <button
                key={mm}
                onClick={() =>
                  onThicknessChange(selectedThickness === mm ? null : mm)
                }
                className={`font-label text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border transition-colors duration-200 ${
                  selectedThickness === mm
                    ? "bg-primary text-on-primary border-primary"
                    : "border-surface-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {mm}mm
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
