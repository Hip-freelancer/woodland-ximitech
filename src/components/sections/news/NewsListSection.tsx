"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsListSectionProps {
  articles: NewsArticle[];
}

export default function NewsListSection({ articles }: NewsListSectionProps) {
  const t = useTranslations("newsBase");
  const [filter, setFilter] = useState("all");

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

  const filteredArticles =
    filter === "all"
      ? articles
      : articles.filter((article) => article.category === filter);

  return (
    <section className="bg-surface py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-20 flex flex-wrap gap-4">
          <button
            className={`border px-6 py-3 font-label text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
              filter === "all"
                ? "border-primary bg-primary text-white"
                : "border-outline-variant bg-transparent text-primary hover:bg-primary/5"
            }`}
            onClick={() => setFilter("all")}
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
              onClick={() => setFilter(category.slug)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <div
                key={article._id}
                className="group overflow-hidden border border-outline-variant/30 bg-white"
              >
                <div className="relative h-[400px] overflow-hidden">
                  <Image
                    alt={article.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    priority={index === 0}
                    src={article.image}
                  />
                </div>

                <div className="p-10">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="inline-block bg-tertiary-fixed px-2 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                      {article.categoryLabel ?? article.category}
                    </span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
                      {new Date(article.publishDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <h3 className="mb-6 font-headline text-2xl font-bold uppercase tracking-tight text-primary transition-colors hover:text-secondary md:text-3xl">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="mb-10 line-clamp-4 break-words whitespace-pre-wrap font-body text-base text-on-surface-variant">
                    {article.excerpt}
                  </p>

                  <div className="border-t border-outline-variant/40 pt-8">
                    <Link
                      className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
                      href={`/news/${article.slug}`}
                    >
                      {t("list.readMore")}
                      <svg
                        fill="none"
                        height="10"
                        viewBox="0 0 14 10"
                        width="14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 1L13 5M13 5L9 9M13 5H1"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center font-body font-medium text-outline">
              {t("list.noResults")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
