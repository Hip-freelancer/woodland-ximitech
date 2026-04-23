import Image from "next/image";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMPANY_INFO, PRIMARY_ADDRESS } from "@/lib/companyInfo";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery" },
  { key: "products", href: "/products" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
  { key: "salesTeam", href: "/sales-team" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const productGroups = t.raw("productGroups") as string[];
  const directChannels = [
    {
      href: `tel:${COMPANY_INFO.hotline.replace(/\s+/g, "")}`,
      icon: Phone,
      label: COMPANY_INFO.hotline,
    },
    {
      href: `tel:${COMPANY_INFO.secondaryPhone.replace(/\s+/g, "")}`,
      icon: Phone,
      label: COMPANY_INFO.secondaryPhone,
    },
    {
      href: `mailto:${COMPANY_INFO.email}`,
      icon: Mail,
      label: COMPANY_INFO.email,
    },
  ];

  return (
    <footer className="mt-20 overflow-hidden border-t border-primary/10 bg-[linear-gradient(180deg,#f9fcfa_0%,#eef6f1_100%)] text-slate-900">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:py-20">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden border border-primary/10 bg-white shadow-[0_28px_80px_rgba(18,55,31,0.08)]">
            <div className="grid gap-8 p-8 md:p-10 xl:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                  Woodland
                </p>
                <div className="relative mt-5 h-[82px] w-[82px]">
                  <Image
                    alt="Woodland"
                    className="object-contain"
                    fill
                    sizes="82px"
                    src="/logowoodland.png"
                  />
                </div>
                <p className="mt-6 max-w-md font-body text-sm leading-8 text-slate-600">
                  {t("description")}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={COMPANY_INFO.facebook}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/12 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:border-secondary hover:text-secondary"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Facebook
                    <ExternalLink size={12} />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-secondary"
                  >
                    {tNav("contact")}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] bg-[linear-gradient(135deg,#0e4a26_0%,#1d7340_100%)] p-6 text-white shadow-[0_24px_60px_rgba(18,55,31,0.18)] md:p-8">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">
                  {t("contactTitle")}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {directChannels.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex min-h-[76px] items-start gap-3 rounded-[22px] border border-white/12 bg-white/8 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12"
                    >
                      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white">
                        <Icon size={17} />
                      </span>
                      <span className="font-body text-sm leading-6 text-white/90">
                        {label}
                      </span>
                    </a>
                  ))}

                  <div className="rounded-[22px] border border-white/12 bg-white/8 p-4 sm:col-span-2">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white">
                        <MapPin size={17} />
                      </span>
                      <div className="space-y-3">
                        <p className="font-body text-sm leading-6 text-white/90">
                          {PRIMARY_ADDRESS}
                        </p>
                        <p className="font-body text-sm leading-6 text-white/74">
                          {COMPANY_INFO.warehouseAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border border-primary/10 bg-white shadow-[0_28px_80px_rgba(18,55,31,0.08)]">
            <div className="border-b border-primary/8 px-8 py-7 md:px-9">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
                {t("mapTitle")}
              </p>
              <p className="mt-3 max-w-md font-body text-sm leading-7 text-slate-600">
                {t("mapDescription")}
              </p>
            </div>
            <div className="relative aspect-[16/11] min-h-[320px] bg-slate-100">
              <iframe
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.1121240935627!2d106.7468828!3d11.0302137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174db4fddc324f9%3A0x95995226c1887fcf!2sWoodLand!5e0!3m2!1svi!2s!4v1776923463617!5m2!1svi!2s"
                title="Woodland footer map"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-[0.8fr_0.8fr_1.4fr]">
          <div className="border border-primary/10 bg-white p-8 shadow-[0_16px_42px_rgba(18,55,31,0.05)]">
            <h5 className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {t("navigation")}
            </h5>
            <nav className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3">
              {navLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="font-body text-sm text-slate-600 transition-colors duration-300 hover:text-primary"
                >
                  {tNav(key)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border border-primary/10 bg-white p-8 shadow-[0_16px_42px_rgba(18,55,31,0.05)]">
            <h5 className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {t("productsTitle")}
            </h5>
            <div className="mt-6 space-y-3">
              {productGroups.map((group) => (
                <p key={group} className="font-body text-sm text-slate-600">
                  {group}
                </p>
              ))}
            </div>
          </div>

          <div className="border border-primary/10 bg-white p-8 shadow-[0_16px_42px_rgba(18,55,31,0.05)]">
            <h5 className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {t("directChannel")}
            </h5>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {directChannels.map(({ href, icon: Icon, label }) => (
                <a
                  key={`bottom-${label}`}
                  href={href}
                  className="flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-4 font-body text-sm text-slate-700 transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300">
                    <Icon size={16} />
                  </span>
                  <span className="break-all">{label}</span>
                </a>
              ))}
              <a
                href={COMPANY_INFO.website}
                className="flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-4 font-body text-sm text-slate-700 transition-all duration-300 hover:bg-primary hover:text-white md:col-span-2"
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300">
                  <ExternalLink size={16} />
                </span>
                <span>
                  {t("websiteLabel")} {COMPANY_INFO.website}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {t("copyright")}
          </p>
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Woodland Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
