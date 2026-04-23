import { getTranslations } from "next-intl/server";
import NewsListSection from "@/components/sections/news/NewsListSection";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import { fetchVisibleNews } from "@/lib/content";
import { getNewsArticles } from "@/lib/staticData";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsBase.hero" });

  return {
    title: `${t("title")} | Woodland`,
    description: t("subtitle"),
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsBase.hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const articles = await fetchVisibleNews(locale);
  const resolvedArticles = articles.length > 0 ? articles : getNewsArticles(locale);

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: t("title") },
        ]}
      />
      <PageHero label="Woodland" title={t("title")} description={t("subtitle")} />
      <NewsListSection articles={resolvedArticles} />
      <CtaBannerSection />
    </>
  );
}
