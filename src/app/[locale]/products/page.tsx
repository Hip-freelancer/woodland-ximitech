import { useTranslations } from "next-intl";
import ProductsGrid from "@/components/sections/products/ProductsGrid";
import SectionDivider from "@/components/ui/SectionDivider";
import { ALL_PRODUCTS } from "@/lib/staticData";

function ProductsHero() {
  const t = useTranslations("products.hero");
  return (
    <section className="bg-primary py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed mb-4">
          {t("subtitle")}
        </p>
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase text-white leading-none tracking-tight">
          {t("title")}
        </h1>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <SectionDivider />
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <ProductsGrid products={ALL_PRODUCTS} />
      </section>
    </>
  );
}
