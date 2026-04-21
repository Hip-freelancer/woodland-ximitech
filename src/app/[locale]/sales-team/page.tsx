import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import TeamMemberCard from "@/components/sections/sales-team/TeamMemberCard";
import SectionDivider from "@/components/ui/SectionDivider";
import { TEAM_MEMBERS } from "@/lib/staticData";

function SalesTeamHero() {
  const t = useTranslations("salesTeam.hero");
  return (
    <section className="bg-primary py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed mb-4">
          Team
        </p>
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase text-white leading-none tracking-tight mb-6">
          {t("title")}
        </h1>
        <p className="font-body text-base text-white/60 max-w-xl">{t("subtitle")}</p>
      </div>
    </section>
  );
}

function TechnicalSupportSection() {
  const t = useTranslations("salesTeam.support");
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-16">
      <div className="bg-surface-container-low p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-headline font-bold text-2xl uppercase text-primary tracking-wide mb-2">
            {t("title")}
          </h2>
          <p className="font-body text-sm text-on-surface-variant">{t("subtitle")}</p>
        </div>
        <Link
          href="/contact"
          className="flex items-center gap-2 bg-primary text-on-primary font-label text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-secondary transition-colors duration-300 whitespace-nowrap"
        >
          {t("button")}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export default function SalesTeamPage() {
  return (
    <>
      <SalesTeamHero />
      <SectionDivider />

      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member._id} member={member} />
          ))}
        </div>
      </section>

      <SectionDivider />
      <TechnicalSupportSection />
    </>
  );
}
