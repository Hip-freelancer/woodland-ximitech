import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import SectionDivider from "@/components/ui/SectionDivider";
import { fetchVisibleProductBySlug } from "@/lib/content";
import type { Locale, Product } from "@/types";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

function TechnicalDataTable({ product }: { product: Product }) {
  const t = useTranslations("productDetail.technicalData");

  const rows = [
    {
      attribute: t("attribute"),
      specification: product.grade,
      tolerance: "±0",
      standard: "EN 314-2",
    },
    {
      attribute: "Core Material",
      specification: product.material,
      tolerance: "—",
      standard: "EN 636",
    },
    {
      attribute: "Bonding",
      specification: product.bonding,
      tolerance: "—",
      standard: "EN 314-2",
    },
    {
      attribute: "Dimensions",
      specification: product.dimensions[0] ?? "Updating",
      tolerance: "±2mm",
      standard: "EN 315",
    },
    {
      attribute: "Thickness",
      specification: product.thickness.length
        ? `${product.thickness.join(", ")}mm`
        : "Updating",
      tolerance: "±0.1mm",
      standard: "EN 1084",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-variant">
            {[t("attribute"), t("specification"), t("tolerance"), t("standard")].map(
              (heading) => (
                <th
                  key={heading}
                  className="py-3 pr-6 text-left font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.attribute}-${row.standard}`}
              className="border-b border-surface-container-low transition-colors duration-200 hover:bg-surface-container-low"
            >
              <td className="py-4 pr-6 font-label text-xs font-semibold uppercase tracking-widest text-primary">
                {row.attribute}
              </td>
              <td className="py-4 pr-6 font-body text-sm text-on-surface-variant">
                {row.specification}
              </td>
              <td className="py-4 pr-6 font-body text-sm text-on-surface-variant">
                {row.tolerance}
              </td>
              <td className="py-4 font-body text-sm text-on-surface-variant">
                {row.standard}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const product = await fetchVisibleProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="flex items-center gap-2 font-label text-xs text-on-surface-variant">
          <Link
            className="flex items-center gap-1 transition-colors hover:text-primary"
            href="/products"
          >
            <ArrowLeft size={12} />
            {tCommon("backToProducts")}
          </Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-16">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-7">
          <div className="space-y-4 md:col-span-4">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                alt={product.name}
                className="object-cover"
                fill
                priority
                src={product.image}
              />
            </div>

            {product.galleryImages.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {product.galleryImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden">
                    <Image
                      alt={`${product.name} ${index + 1}`}
                      className="object-cover"
                      fill
                      src={image}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="md:col-span-3">
            <Badge label={product.series} variant="green" />
            <h1 className="mt-4 mb-6 font-headline text-4xl font-black uppercase leading-none tracking-tight text-primary md:text-5xl">
              {product.name}
            </h1>
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              {product.categoryLabel ?? product.category}
            </p>

            <div
              className="rich-content mb-8 font-body text-base leading-relaxed text-on-surface-variant"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="flex items-center justify-center gap-2 bg-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary"
                href="/contact"
              >
                {t("contactQuote")}
                <ArrowRight size={14} />
              </Link>
              <button className="flex items-center justify-center gap-2 border border-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-primary transition-colors duration-300 hover:bg-primary hover:text-on-primary">
                <Download size={14} />
                {t("downloadCatalog")}
              </button>
            </div>

            <div className="space-y-3 bg-surface-container-low p-6">
              <div className="flex justify-between gap-4">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  {t("availability")}
                </span>
                <span className="text-right font-body text-sm font-semibold text-secondary">
                  {product.availability || t("inStock")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  {t("certification")}
                </span>
                <div className="flex flex-wrap justify-end gap-1">
                  {product.certifications.length > 0 ? (
                    product.certifications.map((certification) => (
                      <Badge key={certification} label={certification} />
                    ))
                  ) : (
                    <span className="font-body text-sm text-on-surface-variant">
                      Updating
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-primary py-16 grain-overlay">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6">
          <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed">
            {t("technicalData.subtitle")}
          </p>
          <h2 className="mb-10 font-headline text-3xl font-black uppercase leading-none tracking-tight text-white">
            {t("technicalData.title")}
          </h2>
          <div className="bg-primary-container/50">
            <TechnicalDataTable product={product} />
          </div>
        </div>
      </section>

      <SectionDivider />
      <CtaBannerSection />
    </>
  );
}
