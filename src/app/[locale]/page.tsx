import HeroSection from "@/components/sections/home/HeroSection";
import AboutPreviewSection from "@/components/sections/home/AboutPreviewSection";
import FeaturedProductsSection from "@/components/sections/home/FeaturedProductsSection";
import ProductLibrarySection from "@/components/sections/home/ProductLibrarySection";
import OperationsSection from "@/components/sections/home/OperationsSection";
import ProjectsSection from "@/components/sections/home/ProjectsSection";
import NewsSection from "@/components/sections/home/NewsSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import FaqSection from "@/components/ui/FaqSection";
import StructuredData from "@/components/seo/StructuredData";
import {
  getAllProducts,
  getFeaturedProducts,
  getNewsArticles,
} from "@/lib/staticData";
import { getHomeFeaturedVideos } from "@/lib/homeFeaturedVideos";
import { getHomeFaqItems } from "@/lib/faqContent";
import {
  fetchFeaturedProducts,
  fetchVisibleNews,
  fetchVisibleProducts,
} from "@/lib/content";
import {
  buildLocalizedMetadata,
  buildFaqJsonLd,
  buildWoodlandSeoKeywords,
  getDefaultLocaleDescription,
} from "@/lib/metadata";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const title = locale === "vi" ? "WOODLAND | Gỗ công nghiệp Woodland" : "WOODLAND | Industrial Wood Solutions";

  return buildLocalizedMetadata({
    locale,
    path: "/",
    title,
    description: getDefaultLocaleDescription(locale),
    keywords: buildWoodlandSeoKeywords(locale),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [featuredProducts, allProducts, newsArticles] = await Promise.all([
    fetchFeaturedProducts(locale, 6),
    fetchVisibleProducts(locale),
    fetchVisibleNews(locale, 6),
  ]);
  const resolvedFeaturedProducts =
    featuredProducts.length > 0 ? featuredProducts : getFeaturedProducts(locale);
  const resolvedProducts =
    (allProducts.length > 0 ? allProducts : getAllProducts(locale)).slice(0, 9);
  const featuredVideos = getHomeFeaturedVideos(locale);
  const resolvedNewsArticles =
    newsArticles.length > 0 ? newsArticles : getNewsArticles(locale);
  const homeFaqItems = getHomeFaqItems(locale);
  const faqJsonLd = buildFaqJsonLd(homeFaqItems);

  return (
    <>
      {faqJsonLd ? <StructuredData data={faqJsonLd} /> : null}
      <HeroSection locale={locale} />
      <AboutPreviewSection />
      <FeaturedProductsSection products={resolvedFeaturedProducts} />
      <ProductLibrarySection products={resolvedProducts} />
      <OperationsSection />
      <ProjectsSection videos={featuredVideos} />
      <NewsSection articles={resolvedNewsArticles} />
      <FaqSection
        items={homeFaqItems}
        subtitle={
          locale === "vi"
            ? "Các câu hỏi phổ biến về Woodland, ván ép Bình Dương, plywood và lựa chọn vật liệu gỗ công nghiệp."
            : "Common questions about Woodland, plywood in Binh Duong and industrial wood material selection."
        }
        title={locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
      />
      <CtaBannerSection />
    </>
  );
}
