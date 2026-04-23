import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const t = useTranslations("home.news");
  const locale = useLocale();
  const featuredArticle = articles[0] ?? null;
  const secondaryArticles = articles.slice(1, 3);

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

      {featuredArticle ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="group h-full overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_rgba(18,55,31,0.14)]">
            <Link
              href={`/news/${featuredArticle.slug}`}
              className="flex h-full flex-col"
            >
              <div className="relative min-h-[460px] flex-1 overflow-hidden">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <time className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-white/78">
                    {new Date(featuredArticle.publishDate).toLocaleDateString(
                      locale === "vi" ? "vi-VN" : "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </time>
                  <h3 className="mt-4  font-headline text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                    {featuredArticle.title}
                  </h3>
                </div>
              </div>
              <div className="border-t border-outline-variant/20 bg-white px-8 py-7 md:px-10 md:py-8">
                <p className=" line-clamp-3 font-body text-sm leading-7 text-on-surface-variant md:text-base">
                  {featuredArticle.excerpt}
                </p>
                <span className="mt-5 inline-flex font-label text-xs font-bold uppercase tracking-widest text-secondary transition-transform duration-300 group-hover:translate-x-1">
                  {t("readMore")} →
                </span>
              </div>
            </Link>
          </article>

          <div className="grid grid-cols-1 gap-6">
            {secondaryArticles.map((article) => (
              <article
                key={article._id}
                className="group overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]"
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="grid md:grid-cols-[0.95fr_1.05fr]"
                >
                  <div className="relative min-h-[220px] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <time className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-outline">
                      {new Date(article.publishDate).toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </time>
                    <h3 className="mt-3 font-headline text-xl font-bold uppercase leading-tight text-primary transition-colors duration-300 group-hover:text-secondary">
                      {article.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 break-words whitespace-pre-wrap font-body text-sm leading-7 text-on-surface-variant">
                      {article.excerpt}
                    </p>
                    <span className="mt-6 inline-flex font-label text-xs font-bold uppercase tracking-widest text-secondary">
                      {t("readMore")} →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
