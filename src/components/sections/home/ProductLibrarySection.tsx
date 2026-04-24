import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProductLibraryClient from "@/components/sections/home/ProductLibraryClient";
import type { Product } from "@/types";

const PRODUCT_LIBRARY_BG =
  "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg";

interface ProductLibrarySectionProps {
  products: Product[];
}

export default function ProductLibrarySection({
  products,
}: ProductLibrarySectionProps) {
  const t = useTranslations("home.productLibrary");

  return (
    <section
      className="relative overflow-hidden py-32 text-white"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(16, 52, 30, 0.88) 0%, rgba(31, 111, 58, 0.82) 45%, rgba(47, 122, 83, 0.78) 100%), url(${PRODUCT_LIBRARY_BG})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,228,200,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex border border-primary-fixed/40 bg-primary-fixed/12 px-4 py-2 text-xs font-label font-bold uppercase tracking-[0.3em] text-primary-fixed shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
              {t("eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)] md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-3xl font-body text-sm leading-7 text-white/82 md:text-base">
              {t("description")}
            </p>
            <div className="mt-4 h-1 w-32 rounded-full bg-[linear-gradient(90deg,#b7e4c8_0%,#98d3b2_55%,rgba(183,228,200,0.22)_100%)] shadow-[0_0_28px_rgba(183,228,200,0.28)]" />
          </div>

          <Link
            href="/products"
            className="whitespace-nowrap border-b-2 border-primary-fixed pb-1 font-headline text-sm font-bold uppercase tracking-widest text-white transition-colors hover:text-primary-fixed"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <ProductLibraryClient products={products} />
      </div>
    </section>
  );
}
