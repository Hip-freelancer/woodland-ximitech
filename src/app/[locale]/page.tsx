import HeroSection from "@/components/sections/home/HeroSection";
import AboutPreviewSection from "@/components/sections/home/AboutPreviewSection";
import FeaturedProductsSection from "@/components/sections/home/FeaturedProductsSection";
import ProductLibrarySection from "@/components/sections/home/ProductLibrarySection";
import OperationsSection from "@/components/sections/home/OperationsSection";
import NewsSection from "@/components/sections/home/NewsSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import { getFeaturedProducts, getNewsArticles } from "@/lib/staticData";
import { fetchFeaturedProducts, fetchVisibleNews } from "@/lib/content";
import { buildLocalizedMetadata, getDefaultLocaleDescription } from "@/lib/metadata";
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
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [featuredProducts, newsArticles] = await Promise.all([
    fetchFeaturedProducts(locale),
    fetchVisibleNews(locale, 3),
  ]);
  const resolvedFeaturedProducts =
    featuredProducts.length > 0 ? featuredProducts : getFeaturedProducts(locale);
  const resolvedNewsArticles =
    newsArticles.length > 0 ? newsArticles : getNewsArticles(locale);

  return (
    <>
      <HeroSection locale={locale} />
      <AboutPreviewSection />
      <FeaturedProductsSection products={resolvedFeaturedProducts} />
      <ProductLibrarySection />
      <OperationsSection />
      <NewsSection articles={resolvedNewsArticles} />
      <CtaBannerSection />
    </>
  );
}
