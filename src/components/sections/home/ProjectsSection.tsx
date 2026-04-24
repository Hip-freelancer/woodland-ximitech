import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { HomeFeaturedVideo } from "@/lib/homeFeaturedVideos";

interface ProjectsSectionProps {
  videos: HomeFeaturedVideo[];
}

export default function ProjectsSection({ videos }: ProjectsSectionProps) {
  const t = useTranslations("home.projects");
  const visibleVideos = videos.slice(0, 4);

  if (visibleVideos.length === 0) {
    return null;
  }

  return (
    <section className="bg-primary py-24 text-white grain-overlay md:py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-label font-bold uppercase tracking-[0.3em] text-primary-fixed">
              {t("subtitle")}
            </p>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tighter text-on-primary md:text-5xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-primary"
          >
            {t("viewAll")}
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
          {visibleVideos.map((video) => (
            <article
              key={video._id}
              className="group overflow-hidden bg-white/8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/12 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)]"
            >
              <Link href={video.href} className="flex h-full flex-col">
                <div className="relative aspect-[4/7] overflow-hidden bg-white/10">
                  <video
                    autoPlay
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    src={video.videoUrl}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 to-transparent opacity-60" />
                </div>

                <div className="flex flex-1 flex-col justify-between px-3 pb-4 pt-4 text-center sm:px-5 sm:pb-6">
                  <p className="line-clamp-2 text-balance font-headline text-sm font-bold uppercase leading-[1.35] text-white sm:text-[1.05rem]">
                    {video.title}
                  </p>
                  <p className="mt-4 font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary-fixed">
                    {t("viewAll")} »
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
