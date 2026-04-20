import AboutHeroSection from "@/components/sections/about/AboutHeroSection";
import VisionMissionSection from "@/components/sections/about/VisionMissionSection";
import CoreValuesSection from "@/components/sections/about/CoreValuesSection";
import HistoryTimelineSection from "@/components/sections/about/HistoryTimelineSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import SectionDivider from "@/components/ui/SectionDivider";

export default function AboutPage() {
  return (
    <>
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
