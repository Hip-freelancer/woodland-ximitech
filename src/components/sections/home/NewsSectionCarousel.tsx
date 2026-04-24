"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsSectionCarouselProps {
  articles: NewsArticle[];
}

const ITEMS_PER_SLIDE = 3;
const AUTOPLAY_DELAY = 5000;

function chunkArticles(articles: NewsArticle[], size: number) {
  const chunks: NewsArticle[][] = [];

  for (let index = 0; index < articles.length; index += size) {
    chunks.push(articles.slice(index, index + size));
  }

  return chunks;
}

function NewsSlide({ articles }: { articles: NewsArticle[] }) {
  const t = useTranslations("home.news");
  const locale = useLocale();
  const featuredArticle = articles[0] ?? null;
  const secondaryArticles = articles.slice(1, 3);

  if (!featuredArticle) {
    return null;
  }

  return (
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
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 40vw"
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
              <h3 className="mt-4 font-headline text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                {featuredArticle.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-1 flex-col border-t border-outline-variant/20 bg-white px-8 py-7 md:px-10 md:py-8">
            <p className="line-clamp-3 font-body text-sm leading-7 text-on-surface-variant md:text-base">
              {featuredArticle.excerpt}
            </p>
            <div className="mt-auto border-t border-outline-variant/20 pt-5">
              <span className="inline-flex font-label text-xs font-bold uppercase tracking-widest text-secondary transition-transform duration-300 group-hover:translate-x-1">
                {t("readMore")} →
              </span>
            </div>
          </div>
        </Link>
      </article>

      <div className="grid grid-cols-1 gap-6">
        {secondaryArticles.map((article) => (
          <article
            key={article._id}
            className="group h-full overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]"
          >
            <Link
              href={`/news/${article.slug}`}
              className="grid h-full md:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="relative min-h-[220px] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 30vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex h-full flex-col p-6">
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
                <div className="mt-auto border-t border-outline-variant/20 pt-6">
                  <span className="inline-flex font-label text-xs font-bold uppercase tracking-widest text-secondary">
                    {t("readMore")} →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function NewsSectionCarousel({
  articles,
}: NewsSectionCarouselProps) {
  const slides = chunkArticles(articles, ITEMS_PER_SLIDE);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = slideRefs.current.reduce((maxHeight, slide) => {
        if (!slide) {
          return maxHeight;
        }

        return Math.max(maxHeight, slide.offsetHeight);
      }, 0);

      if (nextHeight > 0) {
        setContainerHeight(nextHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    slideRefs.current.forEach((slide) => {
      if (slide) {
        resizeObserver.observe(slide);
      }
    });

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [slides]);

  if (slides.length <= 1) {
    return <NewsSlide articles={articles} />;
  }

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={containerHeight ? { height: `${containerHeight}px` } : undefined}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const shouldReserveLayout = isActive && containerHeight === null;

          return (
            <div
              key={`news-slide-${index}`}
              aria-hidden={!isActive}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              className={`transition-all duration-700 ${
                isActive
                  ? shouldReserveLayout
                    ? "relative translate-y-0 opacity-100"
                    : "absolute inset-0 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 translate-y-4 opacity-0"
              }`}
            >
              <NewsSlide articles={slide} />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {slides.map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`news-dot-${index}`}
              type="button"
              aria-label={`Go to news slide ${index + 1}`}
              aria-pressed={isActive}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-10 bg-primary"
                  : "w-2.5 bg-outline-variant hover:bg-primary/60"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
