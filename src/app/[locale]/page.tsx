import HeroSection from "@/components/sections/home/HeroSection";
import AboutPreviewSection from "@/components/sections/home/AboutPreviewSection";
import FeaturedProductsSection from "@/components/sections/home/FeaturedProductsSection";
import WhyChooseUsSection from "@/components/sections/home/WhyChooseUsSection";
import ProjectsSection from "@/components/sections/home/ProjectsSection";
import NewsSection from "@/components/sections/home/NewsSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import { PROJECTS } from "@/lib/staticData";
import { fetchFeaturedProducts, fetchVisibleNews } from "@/lib/content";
import type { Locale } from "@/types";

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

  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseUsSection />
      <ProjectsSection projects={PROJECTS} />
      <NewsSection articles={newsArticles} />
      <CtaBannerSection />
    </>
  );
}
