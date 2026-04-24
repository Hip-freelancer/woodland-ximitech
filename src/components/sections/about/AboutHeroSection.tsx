import { useTranslations } from "next-intl";
import { ABOUT_PAGE_HERO_IMAGE } from "@/lib/aboutPageMedia";

export default function AboutHeroSection() {
  const t = useTranslations("about.hero");

  return (
    <section
      className="relative flex min-h-[76vh] items-end overflow-hidden pb-20"
      style={{
        backgroundImage: `url('${ABOUT_PAGE_HERO_IMAGE}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(12,42,24,0.92)_0%,rgba(22,84,45,0.74)_48%,rgba(31,111,58,0.26)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,228,200,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6">
        <div className="max-w-4xl border border-white/12 bg-black/12 p-5 backdrop-blur-[2px] sm:p-8 md:p-12">
          <p className="mb-4 font-label text-xs font-semibold uppercase tracking-widest text-primary-fixed">
            {t("subtitle")}
          </p>
          <h1 className="mb-6 font-headline text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl md:text-7xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl font-body text-base leading-8 text-white/78 md:text-lg">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
