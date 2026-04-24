"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface ProductLibraryClientProps {
  products: Product[];
}

const INITIAL_VISIBLE_PRODUCTS = 6;
const EXPANDED_VISIBLE_PRODUCTS = 9;

export default function ProductLibraryClient({
  products,
}: ProductLibraryClientProps) {
  const t = useTranslations("home.productLibrary");
  const [isExpanded, setIsExpanded] = useState(false);

  if (products.length === 0) {
    return (
      <div className="border border-white/15 bg-white/6 px-6 py-16 text-center backdrop-blur-sm">
        <p className="font-body text-base text-white/80">{t("empty")}</p>
      </div>
    );
  }

  const visibleProducts = products.slice(
    0,
    isExpanded ? EXPANDED_VISIBLE_PRODUCTS : INITIAL_VISIBLE_PRODUCTS,
  );
  const hasMoreProducts =
    products.length > INITIAL_VISIBLE_PRODUCTS && !isExpanded;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMoreProducts ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex items-center justify-center border border-primary-fixed bg-white/8 px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-fixed transition-colors duration-300 hover:bg-primary-fixed hover:text-primary"
            onClick={() => setIsExpanded(true)}
          >
            {t("showMore")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
