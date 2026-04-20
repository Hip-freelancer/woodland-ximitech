import { useTranslations } from "next-intl";

export default function VisionMissionSection() {
  const t = useTranslations("about");

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#331917] p-10 relative grain-overlay overflow-hidden">
          <div className="relative z-10">
            <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#396759] mb-4">
              01
            </p>
            <h2 className="font-headline font-black text-3xl uppercase text-white leading-tight tracking-tight mb-6">
              {t("vision.title")}
            </h2>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              {t("vision.description")}
            </p>
          </div>
        </div>

        <div className="bg-[#f5f3f2] p-10">
          <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#396759] mb-4">
            02
          </p>
          <h2 className="font-headline font-black text-3xl uppercase text-[#331917] leading-tight tracking-tight mb-6">
            {t("mission.title")}
          </h2>
          <p className="font-body text-sm text-[#534340] leading-relaxed">
            {t("mission.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
