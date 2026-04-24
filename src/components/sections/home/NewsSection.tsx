import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NewsSectionCarousel from "@/components/sections/home/NewsSectionCarousel";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const t = useTranslations("home.news");

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 md:py-32">
      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary">
            {t("eyebrow")}
          </p>
          <h2 className="pt-[0.2em] font-headline text-4xl font-black uppercase tracking-tighter text-primary md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-on-surface-variant md:text-base">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 border border-primary px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:bg-primary hover:text-on-primary"
        >
          {t("viewAll")}
          <span>→</span>
        </Link>
      </div>

      {articles.length > 0 ? <NewsSectionCarousel articles={articles} /> : null}
    </section>
  );
}
