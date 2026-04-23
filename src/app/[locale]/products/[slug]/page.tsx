import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import ProductDetailGallery from "@/components/sections/products/ProductDetailGallery";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import SectionDivider from "@/components/ui/SectionDivider";
import { COMPANY_INFO } from "@/lib/companyInfo";
import ProductCard from "@/components/ui/ProductCard";
import NewsPreviewCard from "@/components/ui/NewsPreviewCard";
import {
  fetchVisibleNews,
  fetchVisibleProductBySlug,
  fetchVisibleProducts,
} from "@/lib/content";
import { getAllProducts, getNewsArticles } from "@/lib/staticData";
import type { Locale, NewsArticle, Product } from "@/types";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const fallbackProducts = getAllProducts(locale);
  const product =
    (await fetchVisibleProductBySlug(slug, locale)) ??
    fallbackProducts.find((item) => item.slug === slug) ??
    null;

  if (!product) {
    return { title: "Not Found" };
  }

  return {
    title: `${product.name} | Woodland`,
    description: product.description.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

function TechnicalDataTable({ product }: { product: Product }) {
  const t = useTranslations("productDetail.technicalData");
  const tDetail = useTranslations("productDetail");

  const rows =
    product.specifications.length > 0
      ? product.specifications
      : [
          {
            attribute: tDetail("attributes.grade"),
            specification: product.grade,
            tolerance: "±0",
            standard: "Ref.",
          },
          {
            attribute: tDetail("attributes.material"),
            specification: product.material,
            tolerance: "—",
            standard: "Ref.",
          },
          {
            attribute: tDetail("attributes.bonding"),
            specification: product.bonding,
            tolerance: "—",
            standard: "Ref.",
          },
          {
            attribute: tDetail("attributes.dimensions"),
            specification: product.dimensions[0] ?? tDetail("updating"),
            tolerance: "±2mm",
            standard: "Ref.",
          },
          {
            attribute: tDetail("attributes.thickness"),
            specification: product.thickness.length
              ? `${product.thickness.join(", ")}mm`
              : tDetail("updating"),
            tolerance: "±0.1mm",
            standard: "Ref.",
          },
        ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/28">
            {[t("attribute"), t("specification"), t("tolerance"), t("standard")].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-widest text-white/72"
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
              className="border-b border-white/20 transition-colors duration-200 hover:bg-white/6"
            >
              <td className="px-6 py-5 font-label text-xs font-semibold uppercase tracking-widest text-white">
                {row.attribute}
              </td>
              <td className="px-6 py-5 font-body text-sm text-white/88">
                {row.specification}
              </td>
              <td className="px-6 py-5 font-body text-sm text-white/82">
                {row.tolerance}
              </td>
              <td className="px-6 py-5 font-body text-sm text-white/82">
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
  const fallbackProducts = getAllProducts(locale);
  const fallbackNews = getNewsArticles(locale);
  const [resolvedProduct, products, articles] = await Promise.all([
    fetchVisibleProductBySlug(slug, locale),
    fetchVisibleProducts(locale),
    fetchVisibleNews(locale, 6),
  ]);
  const product =
    resolvedProduct ??
    fallbackProducts.find((item) => item.slug === slug) ??
    null;

  if (!product) {
    notFound();
  }

  const recentProductsSource = products.length > 0 ? products : fallbackProducts;
  const recentNewsSource = articles.length > 0 ? articles : fallbackNews;
  const recentProducts = recentProductsSource
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);
  const recentNews = recentNewsSource.slice(0, 3);

  return (
    <ProductDetailContent
      locale={locale}
      product={product}
      recentNews={recentNews}
      recentProducts={recentProducts}
    />
  );
}

function ProductDetailContent({
  locale,
  product,
  recentNews,
  recentProducts,
}: {
  locale: Locale;
  product: Product;
  recentNews: NewsArticle[];
  recentProducts: Product[];
}) {
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("products"), href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="mx-auto max-w-[1440px] px-6 py-8">
        <Link
          className="inline-flex items-center gap-1 font-label text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:text-primary"
          href="/products"
        >
          <ArrowLeft size={12} />
          {tCommon("backToProducts")}
        </Link>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1.15fr_0.85fr]">
          <ProductDetailGallery
            images={
              product.galleryImages.length > 0
                ? product.galleryImages
                : [product.image]
            }
            productName={product.name}
          />

          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="border border-outline-variant/30 bg-white p-8 shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge label={product.series} variant="green" />
                <span className="inline-flex border border-outline-variant/50 px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                  {product.categoryLabel ?? product.category}
                </span>
              </div>

              <h1 className="mt-5 font-headline text-4xl font-black uppercase leading-[0.98] tracking-tight text-primary md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-5 border-b border-outline-variant/30 pb-6">
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  {product.series || t("attributes.grade")}
                </span>
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  {product.availability || t("inStock")}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {t("attributes.material")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {product.material || t("updating")}
                  </p>
                </div>
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {t("attributes.thickness")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {product.thickness.length > 0
                      ? `${product.thickness.join(", ")}mm`
                      : t("updating")}
                  </p>
                </div>
              </div>

              <div
                className="rich-content mt-7 font-body text-base leading-relaxed text-on-surface-variant"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {t("attributes.grade")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {product.grade || t("updating")}
                  </p>
                </div>
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {t("attributes.bonding")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {product.bonding || t("updating")}
                  </p>
                </div>
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {t("attributes.dimensions")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {product.dimensions[0] || t("updating")}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="flex items-center justify-center gap-2 bg-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary"
                  href="/contact"
                >
                  {t("contactQuote")}
                  <ArrowRight size={14} />
                </Link>
                <a
                  className="flex items-center justify-center gap-2 border border-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-primary transition-colors duration-300 hover:bg-primary hover:text-on-primary"
                  href={COMPANY_INFO.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Download size={14} />
                  {t("downloadCatalog")}
                </a>
              </div>

              <div className="mt-8 space-y-4 border-t border-outline-variant/30 pt-6">
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
                        {t("updating")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    {t("attributes.dimensions")}
                  </span>
                  <span className="text-right font-body text-sm text-on-surface-variant">
                    {product.dimensions[0] ?? t("updating")}
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="border border-outline-variant/30 bg-primary px-5 py-5 text-white">
                    <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-fixed">
                      Woodland
                    </p>
                    <p className="mt-3 font-body text-sm leading-7 text-white/78">
                      {t("cta.subtitle")}
                    </p>
                  </div>
                  <div className="border border-outline-variant/30 bg-surface-container-low px-5 py-5">
                    <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                      {t("contactCardLabel")}
                    </p>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="mt-3 block font-body text-sm font-semibold text-primary transition-colors hover:text-secondary"
                    >
                      {COMPANY_INFO.email}
                    </a>
                    <a
                      href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, "")}`}
                      className="mt-2 block font-body text-sm text-on-surface-variant transition-colors hover:text-primary"
                    >
                      {COMPANY_INFO.hotline}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {product.applications.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-6 py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("applications.title")}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-on-surface-variant">
              {t("applications.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {product.applications.map((application) => (
                <article
                  key={`${application.order}-${application.title}`}
                  className="group overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
                    <Link href="/contact" className="block h-full w-full">
                      <Image
                        alt={application.title}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        fill
                        src={application.image}
                      />
                    </Link>
                  </div>
                  <div className="p-7">
                    <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-primary">
                      {application.title}
                    </h3>
                    <p className="mt-4 font-body text-sm leading-7 text-on-surface-variant">
                      {application.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}

      <section className="relative overflow-hidden bg-primary py-16 grain-overlay">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6">
          <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed">
            {t("technicalData.subtitle")}
          </p>
          <h2 className="mb-10 font-headline text-3xl font-black uppercase leading-none tracking-tight text-white">
            {t("technicalData.title")}
          </h2>
          <div className="overflow-hidden border border-white/12 bg-white/6 backdrop-blur-sm">
            <TechnicalDataTable product={product} />
          </div>
        </div>
      </section>

      <SectionDivider />
      {recentProducts.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-6 py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentProducts.title")}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-on-surface-variant">
              {t("recentProducts.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {recentProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}
      {recentNews.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-6 py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentNews.title")}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-on-surface-variant">
              {t("recentNews.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {recentNews.map((article) => (
                <NewsPreviewCard
                  key={article._id}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}
      <CtaBannerSection />
    </>
  );
}
