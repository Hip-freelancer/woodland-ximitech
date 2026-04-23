import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { COMPANY_INFO, PRIMARY_ADDRESS } from "@/lib/companyInfo";

export default function ContactInfoPanel() {
  const t = useTranslations("contact.info");

  return (
    <div className="space-y-8">
      <div>
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
          {t("headquarters")}
        </p>
        <div className="flex gap-3">
          <MapPin size={16} className="text-secondary mt-0.5 shrink-0" />
          <div className="space-y-2 font-body text-sm leading-relaxed text-on-surface-variant">
            <p>{PRIMARY_ADDRESS}</p>
            <p>{COMPANY_INFO.warehouseAddress}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
          {t("phone")}
        </p>
        <div className="flex gap-3">
          <Phone size={16} className="text-secondary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <a
              href={`tel:${COMPANY_INFO.hotline.replace(/\s+/g, "")}`}
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {COMPANY_INFO.hotline}
            </a>
            <a
              href={`tel:${COMPANY_INFO.secondaryPhone.replace(/\s+/g, "")}`}
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {COMPANY_INFO.secondaryPhone}
            </a>
          </div>
        </div>
      </div>

      <div>
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
          {t("email")}
        </p>
        <div className="flex gap-3">
          <Mail size={16} className="text-secondary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {COMPANY_INFO.email}
            </a>
            <a
              href={COMPANY_INFO.website}
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {COMPANY_INFO.website}
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-outline-variant/40 bg-surface-container-lowest">
        <div className="relative aspect-video">
          <iframe
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.1121240935627!2d106.7468828!3d11.0302137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174db4fddc324f9%3A0x95995226c1887fcf!2sWoodLand!5e0!3m2!1svi!2s!4v1776923463617!5m2!1svi!2s"
            title="Woodland location map"
          />
        </div>
      </div>
    </div>
  );
}
