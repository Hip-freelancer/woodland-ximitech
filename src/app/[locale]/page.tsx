import HeroSection from "@/components/sections/home/HeroSection";
import AboutPreviewSection from "@/components/sections/home/AboutPreviewSection";
import FeaturedProductsSection from "@/components/sections/home/FeaturedProductsSection";
import WhyChooseUsSection from "@/components/sections/home/WhyChooseUsSection";
import ProjectsSection from "@/components/sections/home/ProjectsSection";
import NewsSection from "@/components/sections/home/NewsSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import { FEATURED_PRODUCTS, PROJECTS, NEWS_ARTICLES } from "@/lib/staticData";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <FeaturedProductsSection products={FEATURED_PRODUCTS} />
      <WhyChooseUsSection />
      <ProjectsSection projects={PROJECTS} />
      <NewsSection articles={NEWS_ARTICLES} />
      <CtaBannerSection />
    </>
  );
}
