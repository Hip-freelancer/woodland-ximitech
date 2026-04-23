import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import TeamMemberCard from "@/components/sections/sales-team/TeamMemberCard";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import PageHero from "@/components/ui/PageHero";
import SectionDivider from "@/components/ui/SectionDivider";
import { fetchVisibleTeamMembers } from "@/lib/content";
import type { Locale } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "salesTeam.hero" });

  return {
    title: `${t("title")} | Woodland`,
    description: t("subtitle"),
  };
}

export default async function SalesTeamPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [tHero, tNav, tPage, tSupport, members] = await Promise.all([
    getTranslations({ locale, namespace: "salesTeam.hero" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "salesTeam.page" }),
    getTranslations({ locale, namespace: "salesTeam.support" }),
    fetchVisibleTeamMembers(locale),
  ]);

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("salesTeam") },
        ]}
      />
      <PageHero label="Woodland" title={tHero("title")} description={tHero("subtitle")} />
      <SectionDivider />

      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid gap-6 border border-outline-variant/30 bg-surface-container-low p-8 md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {tPage("deskLabel")}
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {tPage("title")}
            </h2>
          </div>
          <p className="font-body text-sm leading-8 text-on-surface-variant md:text-base">
            {tPage("description")}
          </p>
        </div>

        {members.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <TeamMemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-outline-variant/40 bg-white px-6 py-20 text-center">
            <p className="font-body text-base text-on-surface-variant">
              {tPage("empty")}
            </p>
          </div>
        )}
      </section>

      <SectionDivider />

      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-primary/18 bg-primary p-10 text-white">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-fixed">
              Woodland
            </p>
            <h2 className="mt-4 max-w-4xl px-2 pt-[0.35em] pb-[0.22em] font-headline text-xl font-bold uppercase leading-[1.45] tracking-normal [text-wrap:balance] md:text-[2rem] xl:text-[2rem]">
              {tSupport("title")}
            </h2>
            <p className="mt-5 max-w-2xl font-body text-sm leading-8 text-white/78">
              {tSupport("subtitle")}
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 border border-outline-variant/30 bg-white p-8 md:p-10">
            <div>
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-outline">
                {tPage("directLabel")}
              </p>
              <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                {tPage("ctaDescription")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 bg-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-[0.18em] text-on-primary transition-colors duration-300 hover:bg-secondary"
            >
              {tSupport("button")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
