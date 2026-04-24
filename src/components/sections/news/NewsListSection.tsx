"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsListSectionProps {
  articles: NewsArticle[];
  categories: Array<{ label: string; slug: string }>;
  currentCategory?: string;
  currentPage: number;
  currentSearch?: string;
  totalItems: number;
  totalPages: number;
}

export default function NewsListSection({
  articles,
  categories,
  currentCategory = "",
  currentPage,
  currentSearch = "",
  totalItems,
  totalPages,
}: NewsListSectionProps) {
  const t = useTranslations("newsBase");
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const featuredArticle = articles[0] ?? null;
  const remainingArticles = articles.slice(1);

  const buildHref = ({
    nextCategory = currentCategory,
    nextPage = 1,
    nextSearch = searchQuery,
  }: {
    nextCategory?: string;
    nextPage?: number;
    nextSearch?: string;
  } = {}) => {
    const params = new URLSearchParams();

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    if (nextSearch.trim()) {
      params.set("q", nextSearch.trim());
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    return queryString ? `/news?${queryString}` : "/news";
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildHref({ nextSearch: searchQuery }));
  };

  return (
    <section className="bg-surface py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-12 flex flex-col gap-4 border-b border-outline-variant/20 pb-6">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            <span className="text-primary">{totalItems}</span>{" "}
            {locale === "vi" ? "bài viết" : "articles"}
          </p>
          <div className="flex flex-wrap gap-4">
          <Link
            className={`border px-6 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
              !currentCategory
                ? "border-primary bg-primary text-white"
                : "border-outline-variant bg-transparent text-primary hover:bg-primary/5"
            }`}
            href={buildHref({ nextCategory: "" })}
          >
            {t("filters.all")}
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              className={`border px-6 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                currentCategory === category.slug
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant bg-transparent text-primary hover:bg-primary/5"
              }`}
              href={buildHref({ nextCategory: category.slug })}
            >
              {category.label}
            </Link>
          ))}
          </div>

          <form className="flex justify-end gap-3" onSubmit={submitSearch}>
            <input
              className="w-full max-w-sm border border-outline-variant/40 bg-white px-4 py-3 font-body text-sm text-on-surface outline-none transition-colors focus:border-primary"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("list.searchPlaceholder")}
              value={searchQuery}
            />
            <button
              className="border border-primary bg-primary px-5 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-secondary"
              type="submit"
            >
              Tìm
            </button>
          </form>
        </div>

        {featuredArticle ? (
          <div className="space-y-10">
            <article className="group h-full overflow-hidden border border-outline-variant/30 bg-white">
              <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="relative block aspect-[16/9] min-h-[280px] max-h-[480px] overflow-hidden xl:aspect-auto xl:min-h-[420px] xl:max-h-none"
                >
                  <Image
                    alt={featuredArticle.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    priority
                    sizes="(max-width: 1279px) 100vw, 60vw"
                    src={featuredArticle.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                </Link>

                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div>
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                      <span className="inline-flex bg-tertiary-fixed px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                        {featuredArticle.categoryLabel ?? featuredArticle.category}
                      </span>
                      <time className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-outline">
                        {new Date(featuredArticle.publishDate).toLocaleDateString(
                          locale === "vi" ? "vi-VN" : "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    <h2 className="max-w-2xl font-headline text-3xl font-black uppercase tracking-tight text-primary transition-colors duration-300 group-hover:text-secondary md:text-5xl">
                      <Link href={`/news/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="mt-6 max-w-xl break-words whitespace-pre-wrap font-body text-base leading-8 text-on-surface-variant">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-outline-variant/30 pt-6">
                    <Link
                      className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
                      href={`/news/${featuredArticle.slug}`}
                    >
                      {t("list.readMore")}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {remainingArticles.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {remainingArticles.map((article) => (
                    <article
                      key={article._id}
                      className="group h-full overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]"
                    >
                      <Link
                        href={`/news/${article.slug}`}
                        className="flex h-full flex-col"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[4/3]">
                          <Image
                            alt={article.title}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                            src={article.image}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        <div className="flex flex-1 flex-col p-8">
                          <div className="mb-5 flex flex-wrap items-center gap-3">
                            <span className="inline-flex bg-tertiary-fixed px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                              {article.categoryLabel ?? article.category}
                            </span>
                            <time className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-outline">
                              {new Date(article.publishDate).toLocaleDateString(
                                locale === "vi" ? "vi-VN" : "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </time>
                          </div>

                          <h3 className="min-h-[4rem] font-headline text-2xl font-bold uppercase tracking-tight text-primary transition-colors duration-300 group-hover:text-secondary">
                            {article.title}
                          </h3>

                          <p className="mt-4 line-clamp-3 min-h-[5.25rem] break-words whitespace-pre-wrap font-body text-sm leading-7 text-on-surface-variant">
                            {article.excerpt}
                          </p>

                          <div className="mt-auto border-t border-outline-variant/40 pt-6">
                            <span className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors group-hover:text-secondary">
                              {t("list.readMore")}
                              <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 border-t border-outline-variant/20 pt-6">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (page) => (
                        <Link
                          key={page}
                          className={`min-w-11 px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                            page === currentPage
                              ? "bg-primary text-on-primary"
                              : "border border-outline-variant/40 bg-white text-primary hover:border-primary"
                          }`}
                          href={buildHref({ nextPage: page })}
                        >
                          {page}
                        </Link>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="col-span-full py-20 text-center font-body font-medium text-outline">
            {t("list.noResults")}
          </div>
        )}
      </div>
    </section>
  );
}
