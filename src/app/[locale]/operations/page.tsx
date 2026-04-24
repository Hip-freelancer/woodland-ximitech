import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import SectionDivider from "@/components/ui/SectionDivider";
import CtaBannerSection from "@/components/sections/home/CtaBannerSection";
import { buildLocalizedMetadata, buildWoodlandSeoKeywords } from "@/lib/metadata";
import { getOperationsPageContent } from "@/lib/operationsPageContent";
import { DEFAULT_PAGE_HERO_BACKGROUND_IMAGE } from "@/lib/pageHeroMedia";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = getOperationsPageContent(locale);

  return buildLocalizedMetadata({
    locale,
    path: "/operations",
    title: `${content.subtitle} | ${content.title}`,
    description: content.description,
    keywords: buildWoodlandSeoKeywords(locale, [
      content.title,
      content.subtitle,
      "kho xưởng gỗ Bình Dương",
      "năng lực cung ứng ván ép",
    ]),
    image: content.sections[0]?.image,
  });
}

export default async function OperationsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const content = getOperationsPageContent(locale);

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("operations") },
        ]}
      />
      <PageHero
        label={content.subtitle}
        title={content.title}
        description={content.description}
        backgroundImage={DEFAULT_PAGE_HERO_BACKGROUND_IMAGE}
      />
      <SectionDivider />

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-outline-variant/30 bg-surface-container-low p-8 md:p-10">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
              {content.subtitle}
            </p>
            <h2 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
              {content.title}
            </h2>
            <div className="mt-6 space-y-5 font-body text-base leading-8 text-on-surface-variant">
              {content.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {content.stats.map((item) => (
              <article
                key={item.label}
                className="border border-outline-variant/30 bg-white p-6 shadow-[0_18px_40px_rgba(18,55,31,0.06)]"
              >
                <p className="font-headline text-3xl font-black uppercase tracking-tight text-primary">
                  {item.value}
                </p>
                <p className="mt-3 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {content.sections.map((section, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <section
            key={section.title}
            className={index % 2 === 0 ? "bg-white" : "bg-surface-container-low"}
          >
            <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:py-20 xl:grid-cols-2 xl:items-center">
              <div className={imageFirst ? "xl:order-2" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden border border-outline-variant/30 bg-surface-container shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(max-width: 1279px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={imageFirst ? "xl:order-1" : undefined}>
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                  {content.subtitle}
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-6 space-y-5 font-body text-base leading-8 text-on-surface-variant">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.items ? (
                  <ul className="mt-8 grid gap-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="border border-outline-variant/30 bg-white px-5 py-4 font-body text-sm leading-7 text-on-surface-variant"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="border border-primary/10 bg-[linear-gradient(135deg,#0f3f22_0%,#1e6b3b_100%)] px-8 py-10 text-white shadow-[0_28px_80px_rgba(18,55,31,0.16)] md:px-12 md:py-14">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">
            {content.subtitle}
          </p>
          <p className="mt-5 max-w-4xl font-body text-lg leading-8 text-white/88">
            {content.closing}
          </p>
        </div>
      </section>

      <CtaBannerSection />
    </>
  );
}
