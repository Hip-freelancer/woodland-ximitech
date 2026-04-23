import { getTranslations } from "next-intl/server";
import AboutHeroSection from "@/components/sections/about/AboutHeroSection";
import VisionMissionSection from "@/components/sections/about/VisionMissionSection";
import CoreValuesSection from "@/components/sections/about/CoreValuesSection";
import HistoryTimelineSection from "@/components/sections/about/HistoryTimelineSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import SectionDivider from "@/components/ui/SectionDivider";
import { buildLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });

  return buildLocalizedMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("about") },
        ]}
      />
      <AboutHeroSection />
      <SectionDivider />
      <VisionMissionSection />
      <SectionDivider />
      <CoreValuesSection />
      <SectionDivider />
      <HistoryTimelineSection />
      <CtaBannerSection />
    </>
  );
}
