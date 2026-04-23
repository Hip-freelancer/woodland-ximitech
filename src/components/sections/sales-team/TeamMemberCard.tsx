import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail, MessageCircleMore, Phone } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const t = useTranslations("salesTeam.contact");
  const hasFooterActions = Boolean(
    member.phone || member.email || member.whatsapp || member.zalo,
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(18,55,31,0.12)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent opacity-80" />
        <div className="absolute left-5 top-5 inline-flex border border-white/24 bg-primary/88 px-3 py-1.5 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {member.region}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-primary">
          {member.name}
        </h3>
        <p className="mt-2 font-body text-sm leading-7 text-on-surface-variant">
          {member.title}
        </p>

        {hasFooterActions ? (
          <div className="mt-auto border-t border-outline-variant/30 pt-6">
            <div className="space-y-3">
              {member.phone ? (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 font-body text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  <span className="flex h-9 w-9 items-center justify-center bg-surface-container-low text-secondary">
                    <Phone size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="mr-1 font-label text-[10px] uppercase tracking-widest text-outline">
                      {t("directLine")}:
                    </span>
                    {member.phone}
                  </span>
                </a>
              ) : null}

              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 font-body text-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  <span className="flex h-9 w-9 items-center justify-center bg-surface-container-low text-secondary">
                    <Mail size={14} />
                  </span>
                  <span className="truncate">{member.email}</span>
                </a>
              ) : null}
            </div>

            {member.whatsapp || member.zalo ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-secondary px-4 py-2.5 font-label text-[10px] font-semibold uppercase tracking-widest text-on-secondary transition-colors duration-200 hover:bg-primary"
                  >
                    <MessageCircleMore size={13} />
                    {t("whatsapp")}
                  </a>
                )}
                {member.zalo && (
                  <a
                    href={`https://zalo.me/${member.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-primary px-4 py-2.5 font-label text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors duration-200 hover:bg-primary hover:text-on-primary"
                  >
                    <MessageCircleMore size={13} />
                    {t("zalo")}
                  </a>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
