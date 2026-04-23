import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface FeaturedProductsSectionProps {
  products: Product[];
}

export default function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  const t = useTranslations("home.featuredProducts");

  return (
    <section className="bg-surface-container-low py-24 md:py-32 grain-overlay">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary">
              {t("eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-on-surface-variant md:text-base">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-primary px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:bg-primary hover:text-on-primary"
          >
            {t("viewAll")}
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
