import { useTranslations } from "next-intl";

export default function VisionMissionSection() {
  const t = useTranslations("about");

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
          {t("hero.subtitle")}
        </p>
        <p className="font-body text-lg leading-relaxed text-on-surface-variant">
          {t("hero.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden border border-primary/18 bg-primary p-10 grain-overlay md:p-12">
          <div className="relative z-10 max-w-xl">
            <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-primary-fixed mb-4">
              01
            </p>
            <h2 className="font-headline font-black text-3xl uppercase text-white leading-tight tracking-tight mb-6">
              {t("vision.title")}
            </h2>
            <p className="font-body text-sm leading-8 text-white/74 md:text-base">
              {t("vision.description")}
            </p>
          </div>
        </div>

        <div className="border border-outline-variant/30 bg-surface-container-low p-10 md:p-12">
          <p className="mb-4 font-label text-[10px] font-semibold uppercase tracking-widest text-secondary">
            02
          </p>
          <h2 className="mb-6 font-headline text-3xl font-black uppercase leading-tight tracking-tight text-primary">
            {t("mission.title")}
          </h2>
          <p className="font-body text-sm leading-8 text-on-surface-variant md:text-base">
            {t("mission.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
