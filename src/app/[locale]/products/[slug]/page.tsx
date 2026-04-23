import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import ProductDetailGallery from "@/components/sections/products/ProductDetailGallery";
import StructuredData from "@/components/seo/StructuredData";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import Badge from "@/components/ui/Badge";
import NewsPreviewCard from "@/components/ui/NewsPreviewCard";
import ProductCard from "@/components/ui/ProductCard";
import SectionDivider from "@/components/ui/SectionDivider";
import { COMPANY_INFO } from "@/lib/companyInfo";
import {
  fetchVisibleNews,
  fetchVisibleProductBySlug,
  fetchVisibleProducts,
} from "@/lib/content";
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  getAbsoluteUrl,
  resolveSeoFields,
} from "@/lib/metadata";
import { getAllProducts, getNewsArticles } from "@/lib/staticData";
import type { Locale, Product } from "@/types";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

function stripHtml(input: string) {
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveProductSummary(product: Product, t: Awaited<ReturnType<typeof getTranslations>>) {
  const summaryItems = [
    {
      label: t("attributes.material"),
      value: product.material,
    },
    {
      label: t("attributes.thickness"),
      value: product.thickness.length > 0 ? `${product.thickness.join(", ")}mm` : "",
    },
    {
      label: t("attributes.grade"),
      value: product.grade,
    },
    {
      label: t("attributes.bonding"),
      value: product.bonding,
    },
    {
      label: t("attributes.dimensions"),
      value: product.dimensions.join(", "),
    },
  ].filter((item) => item.value.trim().length > 0);

  const technicalCards = [
    {
      label: t("availability"),
      value: product.availability,
    },
    {
      label: t("certification"),
      value: product.certifications.join(", "),
    },
  ].filter((item) => item.value.trim().length > 0);

  return { summaryItems, technicalCards };
}

function buildProductJsonLd(locale: Locale, product: Product) {
  const productPath = `/products/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image:
      product.galleryImages.length > 0
        ? product.galleryImages.map((image) => getAbsoluteUrl(image))
        : [getAbsoluteUrl(product.image)],
    description: stripHtml(product.description),
    brand: {
      "@type": "Brand",
      name: "Woodland",
    },
    category: product.categoryLabel ?? product.category,
    sku: product.slug,
    url: getAbsoluteUrl(`/${locale}${productPath}`),
    offers: product.availability
      ? {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: getAbsoluteUrl(`/${locale}${productPath}`),
        }
      : undefined,
  };
}

function TechnicalDataSection({
  product,
  t,
}: {
  product: Product;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const rows = product.specifications.filter(
    (row) =>
      row.attribute.trim() ||
      row.specification.trim() ||
      row.tolerance.trim() ||
      row.standard.trim()
  );

  const fallbackFacts = [
    {
      label: t("attributes.material"),
      value: product.material,
    },
    {
      label: t("attributes.grade"),
      value: product.grade,
    },
    {
      label: t("attributes.bonding"),
      value: product.bonding,
    },
    {
      label: t("attributes.dimensions"),
      value: product.dimensions.join(", "),
    },
    {
      label: t("attributes.thickness"),
      value: product.thickness.length > 0 ? `${product.thickness.join(", ")}mm` : "",
    },
  ].filter((item) => item.value.trim().length > 0);

  return (
    <section className="relative overflow-hidden bg-primary py-14 sm:py-16 grain-overlay">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed">
          {t("technicalData.subtitle")}
        </p>
        <h2 className="font-headline text-3xl font-black uppercase leading-none tracking-tight text-white md:text-4xl">
          {t("technicalData.title")}
        </h2>

        {rows.length > 0 ? (
          <div className="mt-10 overflow-hidden border border-white/12 bg-white/6 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-white/28">
                    {[
                      t("technicalData.attribute"),
                      t("technicalData.specification"),
                      t("technicalData.tolerance"),
                      t("technicalData.standard"),
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left font-label text-[10px] font-semibold uppercase tracking-widest text-white/72"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={`${row.attribute}-${row.standard}-${index}`}
                      className="border-b border-white/20 transition-colors duration-200 hover:bg-white/6"
                    >
                      <td className="px-6 py-5 font-label text-xs font-semibold uppercase tracking-widest text-white">
                        {row.attribute}
                      </td>
                      <td className="px-6 py-5 font-body text-sm text-white/88">
                        {row.specification}
                      </td>
                      <td className="px-6 py-5 font-body text-sm text-white/82">
                        {row.tolerance || "—"}
                      </td>
                      <td className="px-6 py-5 font-body text-sm text-white/82">
                        {row.standard || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : fallbackFacts.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {fallbackFacts.map((item) => (
              <div
                key={item.label}
                className="border border-white/12 bg-white/8 px-5 py-5 backdrop-blur-sm"
              >
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white/64">
                  {item.label}
                </p>
                <p className="mt-3 font-body text-sm leading-7 text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-white/20 bg-white/8 px-6 py-12 text-center font-body text-sm text-white/78">
            {t("updating")}
          </div>
        )}
      </div>
    </section>
  );
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

  const seo = resolveSeoFields(product.seo, {
    title: product.name,
    description: stripHtml(product.description).slice(0, 160),
  });

  return buildLocalizedMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const fallbackProducts = getAllProducts(locale);
  const fallbackNews = getNewsArticles(locale);
  const [t, tCommon, tNav, resolvedProduct, products, articles] =
    await Promise.all([
      getTranslations({ locale, namespace: "productDetail" }),
      getTranslations({ locale, namespace: "common" }),
      getTranslations({ locale, namespace: "nav" }),
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
  const { summaryItems, technicalCards } = resolveProductSummary(product, t);
  const breadcrumbItems = [
    { label: tNav("home"), path: "/" },
    { label: tNav("products"), path: "/products" },
    { label: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbJsonLd(locale, breadcrumbItems),
          buildProductJsonLd(locale, product),
        ]}
      />

      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("products"), href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-1 font-label text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:text-primary"
          href="/products"
        >
          <ArrowLeft size={12} />
          {tCommon("backToProducts")}
        </Link>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <ProductDetailGallery
            images={
              product.galleryImages.length > 0
                ? product.galleryImages
                : [product.image]
            }
            productName={product.name}
          />

          <div>
            <div className="overflow-hidden border border-outline-variant/30 bg-white shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
              <div className="border-b border-outline-variant/20 bg-surface-container-low/70 px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-center gap-2">
                  {product.series ? <Badge label={product.series} variant="green" /> : null}
                  {(product.categoryLabel ?? product.category) ? (
                    <span className="inline-flex border border-outline-variant/50 px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                      {product.categoryLabel ?? product.category}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-5 pt-[0.18em] pb-[0.12em] font-headline text-3xl font-black uppercase leading-[1.12] tracking-tight text-primary [text-wrap:balance] sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                {(product.availability || product.series) && technicalCards.length > 0 ? (
                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-outline-variant/20 pt-5">
                    {technicalCards.map((item) => (
                      <div key={item.label} className="min-w-[180px]">
                        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                          {item.label}
                        </p>
                        <p className="mt-2 font-body text-sm font-semibold text-primary">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                {summaryItems.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {summaryItems.map((item) => (
                      <div
                        key={item.label}
                        className="border border-outline-variant/30 bg-surface-container-low px-4 py-4"
                      >
                        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-outline">
                          {item.label}
                        </p>
                        <p className="mt-2 font-body text-sm font-semibold text-primary">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div
                  className="rich-content mt-7 font-body text-base leading-8 text-on-surface-variant"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {product.certifications.length > 0 ? (
                  <div className="mt-8 border-t border-outline-variant/20 pt-6">
                    <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                      {t("certification")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.certifications.map((certification) => (
                        <Badge key={certification} label={certification} />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link
                    className="flex items-center justify-center gap-2 bg-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary"
                    href="/contact"
                  >
                    {t("contactQuote")}
                    <ArrowRight size={14} />
                  </Link>
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

      <TechnicalDataSection product={product} t={t} />

      {product.applications.length > 0 ? (
        <>
          <SectionDivider />
          <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
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
        </>
      ) : null}

      <SectionDivider />

      {recentProducts.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
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
          <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
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
