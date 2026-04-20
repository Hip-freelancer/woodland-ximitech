import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download, ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import SectionDivider from "@/components/ui/SectionDivider";
import { ALL_PRODUCTS } from "@/lib/staticData";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

function TechnicalDataTable({ product }: { product: (typeof ALL_PRODUCTS)[0] }) {
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
      specification: product.dimensions[0] ?? "1220×2440mm",
      tolerance: "±2mm",
      standard: "EN 315",
    },
    {
      attribute: "Thickness",
      specification: product.thickness.join(", ") + "mm",
      tolerance: "±0.1mm",
      standard: "EN 1084",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e4e2e1]">
            {[t("attribute"), t("specification"), t("tolerance"), t("standard")].map(
              (h) => (
                <th
                  key={h}
                  className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340] text-left py-3 pr-6"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[#f5f3f2] hover:bg-[#f5f3f2] transition-colors duration-200"
            >
              <td className="font-label text-xs font-semibold uppercase tracking-widest text-[#331917] py-4 pr-6">
                {row.attribute}
              </td>
              <td className="font-body text-sm text-[#534340] py-4 pr-6">
                {row.specification}
              </td>
              <td className="font-body text-sm text-[#534340] py-4 pr-6">
                {row.tolerance}
              </td>
              <td className="font-body text-sm text-[#534340] py-4">{row.standard}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = ALL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <ProductDetailContent product={product} />
  );
}

function ProductDetailContent({ product }: { product: (typeof ALL_PRODUCTS)[0] }) {
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");

  return (
    <>
      <section className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 font-label text-xs text-[#534340]">
          <Link href="/products" className="hover:text-[#331917] transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            {tCommon("backToProducts")}
          </Link>
          <span>/</span>
          <span className="text-[#331917]">{product.name}</span>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-10 items-start">
          <div className="md:col-span-4">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <Badge label={product.series} variant="green" />
            <h1 className="font-headline font-black text-4xl md:text-5xl uppercase text-[#331917] leading-none tracking-tight mt-4 mb-6">
              {product.name}
            </h1>
            <p className="font-body text-base text-[#534340] leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-[#331917] text-white font-label text-xs font-semibold uppercase tracking-widest px-6 py-4 hover:bg-[#4b2e2b] transition-colors duration-300"
              >
                {t("contactQuote")}
                <ArrowRight size={14} />
              </Link>
              <button className="flex items-center justify-center gap-2 border border-[#331917] text-[#331917] font-label text-xs font-semibold uppercase tracking-widest px-6 py-4 hover:bg-[#331917] hover:text-white transition-colors duration-300">
                <Download size={14} />
                {t("downloadCatalog")}
              </button>
            </div>

            <div className="bg-[#f5f3f2] p-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340]">
                  {t("availability")}
                </span>
                <span className="font-body text-sm text-[#396759] font-semibold">
                  {t("inStock")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340]">
                  {t("certification")}
                </span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} label={cert} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-[#331917] py-16 relative grain-overlay overflow-hidden">
        <div className="relative z-10 max-w-[1440px] mx-auto px-6">
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#396759] mb-4">
            {t("technicalData.subtitle")}
          </p>
          <h2 className="font-headline font-black text-3xl uppercase text-white leading-none tracking-tight mb-10">
            {t("technicalData.title")}
          </h2>
          <div className="bg-[#4b2e2b]/50">
            <TechnicalDataTable product={product} />
          </div>
        </div>
      </section>

      <SectionDivider />
      <CtaBannerSection />
    </>
  );
}
