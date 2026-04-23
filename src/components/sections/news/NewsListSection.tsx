"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsListSectionProps {
  articles: NewsArticle[];
}

export default function NewsListSection({ articles }: NewsListSectionProps) {
  const t = useTranslations("newsBase");
  const locale = useLocale();
  const itemsPerPage = 7;
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(
        articles
          .filter((article) => article.category)
          .map((article) => [
            article.category as string,
            article.categoryLabel ?? article.category ?? "",
          ])
      ).entries()
    );

    return uniqueCategories.map(([slug, label]) => ({ label, slug }));
  }, [articles]);

  const filteredArticles = articles.filter((article) => {
    const categoryMatch =
      filter === "all" ? true : article.category === filter;
    const searchSource = `${article.title} ${article.excerpt} ${article.categoryLabel ?? article.category ?? ""}`.toLowerCase();
    const searchMatch =
      deferredSearchQuery.trim().length === 0 ||
      searchSource.includes(deferredSearchQuery.trim().toLowerCase());
    return categoryMatch && searchMatch;
  });
  const featuredArticle = filteredArticles[0] ?? null;
  const paginatedRemaining = filteredArticles.slice(1);
  const totalPages = Math.max(1, Math.ceil(paginatedRemaining.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const remainingArticles = paginatedRemaining.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <section className="bg-surface py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-12 flex flex-col gap-4 border-b border-outline-variant/20 pb-6">
          <div className="flex flex-wrap gap-4">
          <button
            className={`border px-6 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
              filter === "all"
                ? "border-primary bg-primary text-white"
                : "border-outline-variant bg-transparent text-primary hover:bg-primary/5"
            }`}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            type="button"
          >
            {t("filters.all")}
          </button>

          {categories.map((category) => (
            <button
              key={category.slug}
              className={`border px-6 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                filter === category.slug
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant bg-transparent text-primary hover:bg-primary/5"
              }`}
              onClick={() => {
                setFilter(category.slug);
                setCurrentPage(1);
              }}
              type="button"
            >
              {category.label}
            </button>
          ))}
          </div>

          <div className="flex justify-end">
            <input
              className="w-full max-w-sm border border-outline-variant/40 bg-white px-4 py-3 font-body text-sm text-on-surface outline-none transition-colors focus:border-primary"
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("list.searchPlaceholder")}
              value={searchQuery}
            />
          </div>
        </div>

        {featuredArticle ? (
          <div className="space-y-10">
            <article className="group h-full overflow-hidden border border-outline-variant/30 bg-white">
              <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="relative block min-h-[420px] overflow-hidden"
                >
                  <Image
                    alt={featuredArticle.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    priority
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
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            alt={article.title}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            fill
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
                        <button
                          key={page}
                          className={`min-w-11 px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                            page === safeCurrentPage
                              ? "bg-primary text-on-primary"
                              : "border border-outline-variant/40 bg-white text-primary hover:border-primary"
                          }`}
                          onClick={() => setCurrentPage(page)}
                          type="button"
                        >
                          {page}
                        </button>
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
