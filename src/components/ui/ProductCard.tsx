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
    <div className="bg-white overflow-hidden group">
      <div className="h-80 relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-10">
        <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-label font-bold uppercase tracking-widest px-2 py-1 mb-6">
          {product.grade}
        </span>
        <p className="text-[10px] font-label font-bold uppercase tracking-[0.18em] text-outline mb-2">
          {product.category}
        </p>
        <h3 className="font-headline font-bold text-2xl uppercase mb-4 tracking-tight text-primary">
          {product.name}
        </h3>

        <p className="font-body text-sm text-on-surface-variant mb-8">
          {product.material} | {product.thickness.slice(0, 2).join("-")}mm
        </p>

        <div className="flex justify-between items-center pt-8 border-t border-outline-variant/40">
          <span className="text-xs font-label font-bold uppercase text-primary">
            Spec: {product.thickness[0]}-
            {product.thickness[product.thickness.length - 1]}mm
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="font-label text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors duration-300"
          >
            {t("viewDetails")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
