import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const CTA_BANNER_BG =
  "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg";

export default function CtaBannerSection() {
  const t = useTranslations("home.cta");

  return (
    <section className="mx-auto mb-16 max-w-[1440px] px-4 sm:px-6 md:px-12 md:mb-32">
      <div
        className="relative overflow-hidden p-8 text-center grain-overlay sm:p-12 md:p-16 lg:p-24"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(16, 52, 30, 0.88) 0%, rgba(31, 111, 58, 0.82) 48%, rgba(47, 122, 83, 0.78) 100%), url(${CTA_BANNER_BG})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,228,200,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="pointer-events-none absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-[220px] leading-none text-primary-fixed-dim opacity-10">
          ○
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
          <h2 className="mb-6 pt-[0.16em] pb-[0.08em] font-headline text-3xl font-black uppercase leading-[1.12] tracking-tighter text-on-primary [text-wrap:balance] drop-shadow-[0_8px_24px_rgba(0,0,0,0.24)] sm:text-4xl md:mb-8 md:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="mb-12 font-body text-base leading-8 text-primary-fixed [text-wrap:balance] md:text-lg md:leading-9 xl:text-xl">
            {t("subtitle")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-primary transition-all duration-500 hover:bg-secondary hover:text-on-secondary sm:px-12 sm:py-6"
          >
            {t("button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
