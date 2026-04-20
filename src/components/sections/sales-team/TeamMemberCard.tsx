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
    <div className="group bg-[#f5f3f2]">
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
        <h3 className="font-headline font-black text-xl uppercase text-[#331917] tracking-wide mb-1">
          {member.name}
        </h3>
        <p className="font-body text-sm text-[#534340] mb-5">{member.title}</p>

        <div className="space-y-2 mb-5">
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2 font-body text-sm text-[#534340] hover:text-[#331917] transition-colors"
          >
            <Phone size={13} className="text-[#396759]" />
            <span className="font-label text-[10px] uppercase tracking-widest mr-1">
              {t("directLine")}:
            </span>
            {member.phone}
          </a>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 font-body text-sm text-[#534340] hover:text-[#331917] transition-colors"
          >
            <Mail size={13} className="text-[#396759]" />
            {member.email}
          </a>
        </div>

        <div className="flex gap-2">
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 bg-[#396759] text-white hover:bg-[#2d5548] transition-colors duration-200"
            >
              {t("whatsapp")}
            </a>
          )}
          {member.zalo && (
            <a
              href={`https://zalo.me/${member.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 border border-[#331917] text-[#331917] hover:bg-[#331917] hover:text-white transition-colors duration-200"
            >
              {t("zalo")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
