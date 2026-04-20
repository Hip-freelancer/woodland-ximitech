"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";

const CATEGORIES = ["Film Faced", "Commercial", "Birch Premium"];
const THICKNESSES = [12, 18, 21, 24];
const APPLICATIONS = [
  "Concrete Formwork",
  "Structural Roofing",
  "Industrial Flooring",
  "Cabinetry & Joinery",
];

interface ProductsFilterSidebarProps {
  selectedCategories: string[];
  selectedThickness: number | null;
  onCategoryChange: (cat: string) => void;
  onThicknessChange: (t: number | null) => void;
}

export default function ProductsFilterSidebar({
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
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340] mb-4">
            {t("type")}
          </p>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onCategoryChange(cat)}
                  className="w-3.5 h-3.5 accent-[#331917]"
                />
                <span className="font-body text-sm text-[#534340]">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340] mb-4">
            {t("thickness")}
          </p>
          <div className="flex flex-wrap gap-2">
            {THICKNESSES.map((mm) => (
              <button
                key={mm}
                onClick={() => onThicknessChange(selectedThickness === mm ? null : mm)}
                className={`font-label text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border transition-colors duration-200 ${
                  selectedThickness === mm
                    ? "bg-[#331917] text-white border-[#331917]"
                    : "border-[#e4e2e1] text-[#534340] hover:border-[#331917]"
                }`}
              >
                {mm}mm
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340] mb-4">
            {t("application")}
          </p>
          <div className="flex flex-col gap-2">
            {APPLICATIONS.map((app) => (
              <button
                key={app}
                className="font-body text-sm text-[#534340] hover:text-[#331917] text-left transition-colors duration-200"
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#f5f3f2] p-5">
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#331917] mb-2">
            {t("support")}
          </p>
          <button className="flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-widest text-[#396759] hover:text-[#331917] transition-colors duration-200 mt-3">
            <Download size={12} />
            {t("downloadSpec")}
          </button>
        </div>
      </div>
    </aside>
  );
}
