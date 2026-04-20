import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const t = useTranslations("home.news");

  return (
    <section className="py-32 px-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
        <div>
          <p className="text-xs font-label uppercase tracking-[0.3em] text-[#396759] font-bold mb-3">
            {t("subtitle")}
          </p>
          <h2 className="font-headline font-black text-5xl text-[#331917] uppercase tracking-tighter">
            {t("title")}
          </h2>
        </div>
        <Link
          href="/contact"
          className="font-headline font-bold uppercase text-sm tracking-widest text-[#331917] hover:text-[#396759] transition-colors border-b-2 border-[#331917] pb-1 whitespace-nowrap"
        >
          {t("viewAll")} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {articles.map((article) => (
          <article key={article._id} className="space-y-6 group cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="space-y-4">
              <time className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-[#827472]">
                {new Date(article.publishDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h3 className="font-headline font-bold text-xl uppercase leading-tight group-hover:text-[#396759] transition-colors text-[#331917]">
                {article.title}
              </h3>
              <p className="font-body text-sm text-[#504443] line-clamp-3">
                {article.excerpt}
              </p>
              <span className="font-label text-xs font-bold uppercase tracking-widest text-[#396759]">
                {t("readMore")} →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
