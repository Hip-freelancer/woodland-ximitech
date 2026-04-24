import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AnimatedCountText from "@/components/ui/AnimatedCountText";

export default function AboutPreviewSection() {
  const t = useTranslations("home.about");
  const tCommon = useTranslations("common");

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
        <div className="relative overflow-hidden border border-outline-variant/30 bg-surface-container-low p-3 shadow-[0_24px_50px_rgba(18,55,31,0.08)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image
            src="https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg"
            alt="Woodland factory"
            fill
            sizes="(max-width: 1279px) 100vw, 50vw"
            className="object-cover"
          />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-7 left-7 hidden max-w-sm border border-white/14 bg-primary/92 p-8 text-on-primary shadow-[0_24px_50px_rgba(18,55,31,0.24)] md:block">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-fixed">
              {t("badge")}
            </p>
            <h3 className="mt-3 font-headline text-2xl font-black uppercase tracking-tight text-white">
              {t("legacyTitle")}
            </h3>
            <p className="mt-3 font-body text-sm leading-7 text-white/78">
              {t("legacyDescription")}
            </p>
          </div>
        </div>

        <div className="flex h-full flex-col border border-outline-variant/30 bg-white p-8 md:p-10 xl:p-14">
          <p className="text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary">
            {t("badge")}
          </p>
          <h2 className="pt-[0.2em] font-headline text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl font-body text-base leading-8 text-on-surface-variant md:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-outline-variant/30 bg-surface-container-low px-6 py-6">
              <AnimatedCountText
                className="font-headline text-4xl font-black text-primary"
                value={t("stat1Value")}
              />
              <p className="mt-2 text-xs font-label uppercase tracking-widest text-outline">
                {t("stat1Label")}
              </p>
            </div>
            <div className="border border-outline-variant/30 bg-surface-container-low px-6 py-6">
              <AnimatedCountText
                className="font-headline text-4xl font-black text-primary"
                value={t("stat2Value")}
              />
              <p className="mt-2 text-xs font-label uppercase tracking-widest text-outline">
                {t("stat2Label")}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary px-6 py-4 font-label text-xs font-semibold uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary"
            >
              {tCommon("learnMore")}
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
