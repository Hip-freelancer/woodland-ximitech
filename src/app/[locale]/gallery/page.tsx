import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import SectionDivider from "@/components/ui/SectionDivider";
import { getGalleryItems } from "@/lib/staticData";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.gallery" });

  return {
    title: `${t("title")} | Woodland`,
    description: t("subtitle"),
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.gallery" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const galleryItems = getGalleryItems(locale);

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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item, index) => (
            <article
              key={item._id}
              className="overflow-hidden border border-outline-variant/30 bg-white"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  alt={item.title}
                  className="object-cover"
                  fill
                  priority={index < 2}
                  src={item.image}
                />
              </div>
              <div className="p-8">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                  {item.category}
                </p>
                <h2 className="mt-3 font-headline text-2xl font-bold uppercase tracking-tight text-primary">
                  {item.title}
                </h2>
                <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
