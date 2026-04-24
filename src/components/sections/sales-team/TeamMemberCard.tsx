import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail, MessageCircleMore, Phone } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const t = useTranslations("salesTeam.contact");

  return (
    <article className="group relative flex flex-col overflow-hidden border border-outline-variant/30 bg-white shadow-[0_8px_32px_rgba(18,55,31,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_rgba(18,55,31,0.16)]">
      {/* Photo strip */}
      <div className="relative h-56 overflow-hidden bg-surface-container-low sm:h-64">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Region badge */}
        <span className="absolute left-4 top-4 inline-flex border border-white/24 bg-primary/90 px-3 py-1.5 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {member.region}
        </span>

        {/* Name overlay on photo */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-headline text-xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-sm sm:text-2xl">
            {member.name}
          </h3>
          <p className="mt-1 font-body text-sm text-white/80">{member.title}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col divide-y divide-outline-variant/20">
        {/* Contact rows */}
        {member.phone ? (
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-primary/4 active:bg-primary/8"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone size={14} />
            </span>
            <div className="min-w-0">
              <p className="font-label text-[9px] font-semibold uppercase tracking-widest text-outline">
                {t("directLine")}
              </p>
              <p className="mt-0.5 font-body text-sm font-semibold text-on-surface">
                {member.phone}
              </p>
            </div>
          </a>
        ) : null}

        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-primary/4 active:bg-primary/8"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={14} />
            </span>
            <div className="min-w-0">
              <p className="font-label text-[9px] font-semibold uppercase tracking-widest text-outline">
                Email
              </p>
              <p className="mt-0.5 truncate font-body text-sm font-semibold text-on-surface">
                {member.email}
              </p>
            </div>
          </a>
        ) : null}

        {/* Action buttons */}
        {(member.whatsapp || member.zalo) ? (
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {member.whatsapp && (
              <a
                href={`https://wa.me/${member.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 bg-secondary px-4 py-2.5 font-label text-[10px] font-semibold uppercase tracking-widest text-on-secondary transition-colors duration-200 hover:bg-primary"
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
                className="inline-flex flex-1 items-center justify-center gap-2 border border-primary px-4 py-2.5 font-label text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors duration-200 hover:bg-primary hover:text-on-primary"
              >
                <MessageCircleMore size={13} />
                {t("zalo")}
              </a>
            )}
          </div>
        ) : null}
      </div>

      {/* Hover accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-secondary transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  );
}
