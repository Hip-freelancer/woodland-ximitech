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
    <section className="bg-[#f5f3f2] py-32 grain-overlay">
      <div className="max-w-[1440px] mx-auto px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <p className="text-xs font-label uppercase tracking-[0.3em] text-[#396759] font-bold mb-4">
              {t("subtitle")}
            </p>
            <h2 className="font-headline font-black text-5xl uppercase text-[#331917] leading-none tracking-tighter">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/products"
            className="font-headline font-bold uppercase text-sm tracking-widest text-[#331917] hover:text-[#396759] transition-colors border-b-2 border-[#331917] pb-1 whitespace-nowrap"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
