import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import SectionDivider from "@/components/ui/SectionDivider";
import { getGalleryMedia } from "@/lib/galleryMedia";
import { buildLocalizedMetadata, buildWoodlandSeoKeywords } from "@/lib/metadata";
import type { Locale } from "@/types";

function GalleryCard({
  item,
  priority = false,
}: {
  item: ReturnType<typeof getGalleryMedia>[number];
  priority?: boolean;
}) {
  return (
    <article className="overflow-hidden border border-outline-variant/30 bg-white shadow-[0_18px_40px_rgba(18,55,31,0.06)]">
      <div className="relative aspect-[4/3]">
        {item.mediaType === "video" ? (
          <video
            autoPlay
            className="h-full w-full object-cover"
            controls
            loop
            muted
            playsInline
            preload="metadata"
            src={item.src}
          />
        ) : (
          <Image
            alt={item.title}
            className="object-cover"
            fill
            priority={priority}
            src={item.src}
          />
        )}
      </div>
      <div className="p-8">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
          {item.category}
        </p>
        <h2 className="mt-3 min-h-[3.6rem] text-balance font-headline text-2xl font-bold uppercase tracking-tight text-primary">
          {item.title}
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.gallery" });

  return buildLocalizedMetadata({
    locale,
    path: "/gallery",
    title: t("title"),
    description: t("subtitle"),
    keywords: buildWoodlandSeoKeywords(locale, [t("title"), t("subtitle")]),
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.gallery" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const galleryItems = getGalleryMedia(locale);
  const videos = galleryItems.filter((item) => item.mediaType === "video");
  const images = galleryItems.filter((item) => item.mediaType === "image");

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("gallery") },
        ]}
      />
      <PageHero label="Woodland" title={t("title")} description={t("subtitle")} />
      <SectionDivider />

      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="border border-outline-variant/30 bg-surface-container-low p-8 md:p-10">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            {t("videosEyebrow")}
          </p>
          <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
            {t("videosTitle")}
          </h2>
          <p className="mt-4 max-w-3xl font-body text-sm leading-8 text-on-surface-variant md:text-base">
            {t("videosSubtitle")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {videos.map((item, index) => (
            <GalleryCard key={item._id} item={item} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="border-y border-outline-variant/20 bg-surface-container-lowest">
        <div className="mx-auto max-w-[1440px] px-6 py-16">
          <div className="border border-outline-variant/30 bg-white p-8 md:p-10">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
              {t("imagesEyebrow")}
            </p>
            <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {t("imagesTitle")}
            </h2>
            <p className="mt-4 max-w-3xl font-body text-sm leading-8 text-on-surface-variant md:text-base">
              {t("imagesSubtitle")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {images.map((item, index) => (
              <GalleryCard key={item._id} item={item} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
