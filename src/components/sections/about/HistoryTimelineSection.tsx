import Image from "next/image";
import { useTranslations } from "next-intl";
import { ABOUT_PAGE_GALLERY_IMAGES } from "@/lib/aboutPageMedia";

export default function HistoryTimelineSection() {
  const t = useTranslations("about.history");
  const tOperations = useTranslations("about.operations");
  const tTeam = useTranslations("about.team");
  const highlights = tOperations.raw("highlights") as string[];
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-12">
          <div className="border border-outline-variant/40 bg-surface-container-low p-10 md:p-12">
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tight text-primary">
              {tOperations("title")}
            </h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant">
              {tOperations("description")}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="border border-outline-variant/30 bg-white px-5 py-5"
                >
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-body text-sm leading-7 text-on-surface-variant">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-outline-variant/40 bg-primary p-10 md:p-12">
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tight text-white">
              {tTeam("title")}
            </h2>
            <p className="mt-6  font-body text-base leading-8 text-white/78">
              {tTeam("description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {ABOUT_PAGE_GALLERY_IMAGES.map((item, index) => (
            <article
              key={item.key}
              className="group overflow-hidden border border-outline-variant/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,55,31,0.1)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={items[index]?.title ?? "Woodland"}
                  fill
                  sizes="(max-width: 1279px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-headline text-xl font-bold uppercase tracking-tight text-primary">
                  {items[index]?.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
                  {items[index]?.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
