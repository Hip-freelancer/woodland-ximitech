import { getTranslations } from "next-intl/server";
import NewsListSection from "@/components/sections/news/NewsListSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import PageHero from "@/components/ui/PageHero";
import { fetchVisibleNews } from "@/lib/content";
import type { Locale } from "@/types";

export const metadata = {
  title: "News & Insights | Woodland",
  description:
    "Industry knowledge, company updates, and advancements in architectural plywood and sustainable forestry from Woodland.",
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsBase.hero" });
  const articles = await fetchVisibleNews(locale);

  return (
    <>
      <PageHero label="Woodland News" title={t("title")} description={t("subtitle")} />
      <NewsListSection articles={articles} />
      <CtaBannerSection />
    </>
  );
}
