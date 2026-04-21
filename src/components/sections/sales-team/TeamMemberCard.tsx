import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone, Mail } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { TeamMember } from "@/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const t = useTranslations("salesTeam.contact");

  return (
    <div className="group bg-surface-container-low">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="mb-3">
          <Badge label={member.region} variant="green" />
        </div>
        <h3 className="font-headline font-black text-xl uppercase text-primary tracking-wide mb-1">
          {member.name}
        </h3>
        <p className="font-body text-sm text-on-surface-variant mb-5">{member.title}</p>

        <div className="space-y-2 mb-5">
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Phone size={13} className="text-secondary" />
            <span className="font-label text-[10px] uppercase tracking-widest mr-1">
              {t("directLine")}:
            </span>
            {member.phone}
          </a>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Mail size={13} className="text-secondary" />
            {member.email}
          </a>
        </div>

        <div className="flex gap-2">
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 bg-secondary text-on-secondary hover:bg-primary transition-colors duration-200"
            >
              {t("whatsapp")}
            </a>
          )}
          {member.zalo && (
            <a
              href={`https://zalo.me/${member.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors duration-200"
            >
              {t("zalo")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
