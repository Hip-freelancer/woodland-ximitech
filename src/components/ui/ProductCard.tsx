import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");

  return (
    <article className="group overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]">
      <Link href={`/products/${product.slug}`} className="block h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/24 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        </div>

        <div className="p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex bg-tertiary-fixed px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
              {product.grade}
            </span>
            <span className="inline-flex border border-outline-variant/50 px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
              {product.categoryLabel ?? product.category}
            </span>
          </div>

          <h3 className="min-h-[4.5rem] font-headline text-[1.85rem] font-black uppercase leading-[1.05] tracking-tight text-primary transition-colors duration-300 group-hover:text-secondary">
            {product.name}
          </h3>

          <p className="mt-4 min-h-[3.5rem] break-words whitespace-pre-wrap font-body text-sm leading-7 text-on-surface-variant">
            {product.material}
            {product.thickness.length > 0
              ? ` | ${product.thickness.slice(0, 2).join("-")}mm`
              : ""}
          </p>

          <div className="mt-8 flex items-end justify-between gap-4 border-t border-outline-variant/40 pt-6">
            <span className="text-xs font-label font-bold uppercase tracking-[0.14em] text-primary">
              {product.thickness.length > 0
                ? `${t("specificationLabel")}: ${product.thickness[0]}-${product.thickness[product.thickness.length - 1]}mm`
                : `${t("specificationLabel")}: ${t("updating")}`}
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors duration-300 group-hover:text-secondary">
              {t("viewDetails")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
