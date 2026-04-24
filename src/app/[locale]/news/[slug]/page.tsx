import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import FeaturedProductsCarousel from "@/components/sections/home/FeaturedProductsCarousel";
import NewsSectionCarousel from "@/components/sections/home/NewsSectionCarousel";
import StructuredData from "@/components/seo/StructuredData";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import SectionDivider from "@/components/ui/SectionDivider";
import {
  fetchVisibleNews,
  fetchVisibleNewsBySlug,
  fetchVisibleProducts,
} from "@/lib/content";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildLocalizedMetadata,
  buildWoodlandSeoKeywords,
  getAbsoluteUrl,
  resolveSeoFields,
} from "@/lib/metadata";
import { getAllProducts, getNewsArticles } from "@/lib/staticData";
import type { Locale, NewsArticle } from "@/types";

function buildArticleJsonLd(locale: Locale, article: NewsArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: [getAbsoluteUrl(article.image)],
    datePublished: article.publishDate,
    dateModified: article.updatedAt || article.publishDate,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Woodland",
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/logowoodland.png"),
      },
    },
    description: article.excerpt,
    articleSection: article.categoryLabel ?? article.category,
    mainEntityOfPage: getAbsoluteUrl(`/${locale}/news/${article.slug}`),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const fallbackArticles = getNewsArticles(locale);
  const article =
    (await fetchVisibleNewsBySlug(slug, locale)) ??
    fallbackArticles.find((item) => item.slug === slug) ??
    null;

  if (!article) {
    return { title: "Not Found" };
  }

  const seo = resolveSeoFields(article.seo, {
    title: article.title,
    description: article.excerpt,
  });

  return buildLocalizedMetadata({
    locale,
    path: `/news/${article.slug}`,
    title: seo.title,
    description: seo.description,
    keywords: buildWoodlandSeoKeywords(locale, [
      seo.keywords,
      article.title,
      article.categoryLabel ?? article.category,
    ]),
    image: article.image,
    type: "article",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const [t, tCommon, tNav, fallbackArticles, fallbackProducts, resolvedArticle, newsArticles, products] =
    await Promise.all([
      getTranslations({ locale, namespace: "newsBase.detail" }),
      getTranslations({ locale, namespace: "common" }),
      getTranslations({ locale, namespace: "nav" }),
      Promise.resolve(getNewsArticles(locale)),
      Promise.resolve(getAllProducts(locale)),
      fetchVisibleNewsBySlug(slug, locale),
      fetchVisibleNews(locale, 6),
      fetchVisibleProducts(locale),
    ]);
  const article =
    resolvedArticle ??
    fallbackArticles.find((item) => item.slug === slug) ??
    null;

  if (!article) {
    notFound();
  }

  const recentNewsSource = newsArticles.length > 0 ? newsArticles : fallbackArticles;
  const recentProductsSource = products.length > 0 ? products : fallbackProducts;
  const recentNews = recentNewsSource
    .filter((item) => item.slug !== article.slug)
    .slice(0, 6);
  const recentProducts = recentProductsSource.slice(0, 6);
  const publishDate = new Date(article.publishDate).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
  const breadcrumbItems = [
    { label: tNav("home"), path: "/" },
    { label: tNav("news"), path: "/news" },
    { label: article.title, path: `/news/${article.slug}` },
  ];
  const structuredData = [
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    buildArticleJsonLd(locale, article),
    buildFaqJsonLd(article.faqItems),
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <>
      <StructuredData data={structuredData} />

      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("news"), href: "/news" },
          { label: article.title },
        ]}
      />

      <article className="bg-surface pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <Link
            className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-primary"
            href="/news"
          >
            ← {tCommon("backToNews")}
          </Link>

          <div className="mt-6 space-y-8">
            <div className="border border-outline-variant/30 bg-white p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                {(article.categoryLabel ?? article.category) ? (
                  <span className="inline-flex bg-tertiary-fixed px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                    {article.categoryLabel ?? article.category}
                  </span>
                ) : null}
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
                  {publishDate}
                </span>
              </div>

              <h1 className="mt-6 font-headline text-4xl font-black uppercase leading-[1.05] tracking-tight text-primary md:text-6xl">
                {article.title}
              </h1>

              <p className="mt-6 font-body text-base leading-8 text-on-surface-variant md:text-lg">
                {article.excerpt}
              </p>

              <div className="mt-8 grid gap-4 border-t border-outline-variant/20 pt-6 sm:grid-cols-2">
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                    {t("author")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {article.author}
                  </p>
                </div>
                <div className="border border-outline-variant/30 bg-surface-container-low px-4 py-4">
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                    {tNav("news")}
                  </p>
                  <p className="mt-2 font-body text-sm font-semibold text-primary">
                    {article.categoryLabel ?? article.category}
                  </p>
                </div>
              </div>

              {article.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-outline-variant/30 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative overflow-hidden border border-outline-variant/30 bg-white p-3 shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                <Image
                  alt={article.title}
                  className="object-cover"
                  fill
                  priority
                  src={article.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-outline-variant/30 bg-surface-container-low px-5 py-5">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                  Woodland
                </p>
                <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                  {article.categoryLabel ?? article.category}
                </p>
              </div>

              <div className="border border-outline-variant/30 bg-white px-5 py-5">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                  {t("recentProducts")}
                </p>
                <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                  {locale === "vi"
                    ? "Xem thêm các dòng vật liệu Woodland để đối chiếu theo bài viết đang đọc."
                    : "Explore Woodland material lines related to the article you are reading."}
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-secondary"
                >
                  {tNav("products")}
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="border border-outline-variant/30 bg-white p-6 sm:p-8 lg:p-10">
              <div
                className="rich-content rich-content--editorial font-body text-lg leading-relaxed text-on-surface"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>
      </article>

      <SectionDivider />

      {recentNews.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentNews")}
            </h2>
            <div className="mt-10">
              <NewsSectionCarousel articles={recentNews} />
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}

      {recentProducts.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentProducts")}
            </h2>
            <div className="mt-10">
              <FeaturedProductsCarousel products={recentProducts} />
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}

      <CtaBannerSection />
    </>
  );
}
