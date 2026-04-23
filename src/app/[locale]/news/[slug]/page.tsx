import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import SectionDivider from "@/components/ui/SectionDivider";
import ProductCard from "@/components/ui/ProductCard";
import NewsPreviewCard from "@/components/ui/NewsPreviewCard";
import {
  fetchVisibleNews,
  fetchVisibleNewsBySlug,
  fetchVisibleProducts,
} from "@/lib/content";
import { getAllProducts, getNewsArticles } from "@/lib/staticData";
import type { Locale } from "@/types";

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

  return {
    title: `${article.title} | Woodland`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "newsBase.detail" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const fallbackArticles = getNewsArticles(locale);
  const fallbackProducts = getAllProducts(locale);
  const [resolvedArticle, newsArticles, products] = await Promise.all([
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
    .slice(0, 3);
  const recentProducts = recentProductsSource.slice(0, 3);

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("news"), href: "/news" },
          { label: article.title },
        ]}
      />

      <article className="bg-surface pb-20 pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:items-end">
            <div className="border border-outline-variant/30 bg-white p-8 md:p-10">
            <Link
              className="mb-8 inline-block font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
              href="/news"
            >
              ← {tCommon("backToNews")}
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex bg-tertiary-fixed px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                {article.categoryLabel ?? article.category}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
                {new Date(article.publishDate).toLocaleDateString(
                  locale === "vi" ? "vi-VN" : "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            <h1 className="font-headline text-4xl font-black uppercase leading-tight tracking-tight text-primary md:text-6xl">
              {article.title}
            </h1>

            <p className="mt-6 font-body text-base leading-8 text-on-surface-variant">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-outline-variant/30 pt-6">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                {t("author")} • {article.author}
              </p>
              {article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
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
            </div>

            <div className="relative overflow-hidden border border-outline-variant/30 bg-white p-3 shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
              <div className="relative h-[320px] overflow-hidden md:h-[520px]">
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

          <div className="mx-auto mt-14 grid max-w-[1200px] gap-10 xl:grid-cols-[0.9fr_0.1fr]">
            <div className="border border-outline-variant/30 bg-white p-8 md:p-12">
              <div
                className="rich-content rich-content--editorial font-body text-lg leading-relaxed text-on-surface"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div className="hidden xl:block">
              <div className="sticky top-28 border border-outline-variant/30 bg-surface-container-low p-5">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                  Woodland
                </p>
                <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                  {article.categoryLabel ?? article.category}
                </p>
              </div>
            </div>
          </div>

          {article.tags.length > 0 ? (
            <div className="mx-auto mt-10 max-w-[1200px] border-t border-outline-variant/20 pt-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
      <SectionDivider />
      {recentNews.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-6 py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentNews")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {recentNews.map((item) => (
                <NewsPreviewCard key={item._id} article={item} locale={locale} />
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      ) : null}
      {recentProducts.length > 0 ? (
        <>
          <section className="mx-auto max-w-[1440px] px-6 py-16">
            <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Woodland
            </p>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("recentProducts")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {recentProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
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
