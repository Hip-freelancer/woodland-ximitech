import Image from "next/image";
import { useTranslations } from "next-intl";

const milestones = [
  {
    year: "1974",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnV7XlkPUWQLyq07zHe6FBxNKuZg2gTQNdW6_eTHGNeBxEdDcv0XY8029Ee-U8Pla_hsTIBbZKrk6ndAPFDPdHyJugBTGHnUx0ZZvnsaLg247p8IK7dk6gTS4gtCztI9m6v3kGHHfoFOcH7AM2ig15VbTHt-Ubo9oXxCLr4BSYzOAT_LpiGBYIaJjFBHfMyp1xxkUdp9Ia4KIJb-kF85Qax0LtAyk6IS-6SHZKzZC_z6LHsU2yrSK2Yntlxv66ymK_TmwYlZMRrJ9X",
  },
  {
    year: "1998",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiIaHQTXgdtnyT9Qh3tn0lWpIITq_saVMlDFkcQby5fEzPKsoVITPbdpLN5ByrxnOAT28cU8kACKhmikuRRwDgYmGHzISL8oZjLlhQzSDiRR16VVI7p9kqUoCHVbz3FTvpODBsW71-zwzskPBz5nFsH8Ml3G2svAHNxBiqRw76OsY0afujbdvhwBug5I6QA5iD6KdOcb1v4dS_p5EEzapFkc9FU1OmuT0qYFu-I8-MbPaLIVE4G1dOo96brMJxl3wLOscbdjJLcuF4",
  },
  {
    year: "2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQVD9V-P0D0_qMbfv6tUK3Wdkx0CimbtfjroknNvq1yk2dogSF34BJFqLnb-oxbhRoi8RAORm5Mz06lVY5USM9CWxu8SW-hBEDvVu7_adQJGTH3xziAS3kzRUEVScf7NgBdM2tdm61R3mHMelB3ilcK-IXqWoIIXMz46P2j1aZbIIfUxAuRFbB-DxpEqc-WVUF2VyxpH-D5t6lpZMAAgqb5WiWR31Gz7EUNqzI5GajkDrl8cieUIif58JXzokynqnk0bXS1tda3jcv",
  },
];

export default function HistoryTimelineSection() {
  const t = useTranslations("about.history");

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-24">
      <h2 className="font-headline font-black text-4xl uppercase text-primary leading-none tracking-tight mb-16">
        {t("title")}
      </h2>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-surface-variant ml-4 md:ml-8" />

        <div className="flex flex-col gap-16">
          {milestones.map(({ year }, i) => (
            <div
              key={year}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center z-10">
                <span className="font-label text-[8px] md:text-[10px] font-semibold text-white uppercase tracking-widest text-center leading-none">
                  {year}
                </span>
              </div>

              <div
                className={`pl-16 md:pl-24 ${i % 2 === 1 ? "md:order-2" : ""}`}
              >
                <p className="font-headline font-black text-4xl text-surface-variant mb-2">
                  {year}
                </p>
                <h3 className="font-headline font-bold text-xl uppercase text-primary tracking-wide mb-4">
                  {t(`milestones.${year}.title`)}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {t(`milestones.${year}.description`)}
                </p>
              </div>

              <div
                className={`relative aspect-video overflow-hidden ${i % 2 === 1 ? "md:order-1" : ""}`}
              >
                <Image
                  src={milestones[i].image}
                  alt={`Woodland ${year}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
