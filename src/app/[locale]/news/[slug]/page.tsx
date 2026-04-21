import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import { fetchVisibleNewsBySlug } from "@/lib/content";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const article = await fetchVisibleNewsBySlug(slug, locale);

  if (!article) {
    return { title: "Not Found" };
  }

  return {
    title: `${article.title} | Woodland News`,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { locale, slug } = await params;
  const article = await fetchVisibleNewsBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <>
      <article className="bg-surface pt-32 pb-20">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="mb-12">
            <Link
              className="mb-10 inline-block font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-secondary"
              href="/news"
            >
              ← Back to News
            </Link>

            <div className="mb-6 flex items-center gap-4">
              <span className="inline-block bg-tertiary-fixed px-2 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
                {article.categoryLabel ?? article.category}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
                {new Date(article.publishDate).toLocaleDateString(
                  locale === "vi" ? "vi-VN" : "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            <h1 className="mb-8 font-headline text-4xl font-black uppercase leading-tight tracking-tight text-primary md:text-6xl">
              {article.title}
            </h1>

            <p className="font-body text-sm font-medium uppercase tracking-widest text-on-surface-variant">
              Written by {article.author}
            </p>
          </div>

          <div className="relative mb-16 h-[300px] w-full overflow-hidden md:h-[500px]">
            <Image
              alt={article.title}
              className="object-cover"
              fill
              priority
              src={article.image}
            />
          </div>

          <div
            className="rich-content font-body text-lg leading-relaxed text-on-surface"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
      <CtaBannerSection />
    </>
  );
}
