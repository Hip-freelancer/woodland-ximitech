import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";

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
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {t("address")}
          </p>
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
              href="tel:+18005550000"
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              +1 (800) 555-WOOD
            </a>
            <a
              href="tel:+15035550192"
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              +1 (503) 555-0192
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
              href="mailto:exports@woodland.com"
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              exports@woodland.com
            </a>
            <a
              href="mailto:press@woodland.com"
              className="block font-body text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              press@woodland.com
            </a>
          </div>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyjKTqABoGof0NcA1RSJ-fwA51tdr-MUCc7UTbDwS6E4jDGKM9biuOnml_WwSR5YTJ_0pNCXA-DI9lwfa1zkPJ0uBRS4as6CF0e2qLLhIT-332UJQ0bSk1tXDmcNXsos9ZIAMIqvJhrtxc4nTle6FVImCKzHkUaFPFO7sSH-fj8WkQpjk43lzI8qEO9Ma-jGINr2RtUwVirdG9Iwio-e6fJvJzbNLfNfgd6yt5Q2hhYJMN6FJ3yMYpJEwwu8WFZ0e4gcMuG4UXQFB5"
          alt="Woodland factory"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-sm px-3 py-2">
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-white">
            Portland, OR — HQ
          </p>
        </div>
      </div>
    </div>
  );
}
