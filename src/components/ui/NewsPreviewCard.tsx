import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale, NewsArticle } from "@/types";

interface NewsPreviewCardProps {
  article: NewsArticle;
  locale: Locale;
}

export default function NewsPreviewCard({
  article,
  locale,
}: NewsPreviewCardProps) {
  const t = useTranslations("newsBase.list");

  return (
    <article className="group h-full overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]">
      <Link href={`/news/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
          <Image
            alt={article.title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            fill
            src={article.image}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="inline-block bg-tertiary-fixed px-2 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
              {article.categoryLabel ?? article.category}
            </span>
            <time className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
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

          <h3 className="min-h-[4rem] font-headline text-2xl font-bold uppercase tracking-tight text-primary transition-colors group-hover:text-secondary">
            {article.title}
          </h3>

          <p className="mt-4 line-clamp-3 min-h-[5.25rem] break-words whitespace-pre-wrap font-body text-sm leading-7 text-on-surface-variant">
            {article.excerpt}
          </p>

          <div className="mt-auto border-t border-outline-variant/40 pt-6">
            <span className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors group-hover:text-secondary">
              {t("readMore")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
