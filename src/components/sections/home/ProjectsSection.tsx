import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations("home.projects");

  return (
    <section className="py-32 bg-primary grain-overlay overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <p className="text-xs font-label uppercase tracking-[0.3em] text-primary-fixed font-bold mb-3">
              {t("subtitle")}
            </p>
            <h2 className="font-headline font-black text-5xl text-on-primary uppercase tracking-tighter">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="font-headline font-bold uppercase text-sm tracking-widest text-on-primary hover:text-primary-fixed transition-colors border-b-2 border-on-primary pb-1 whitespace-nowrap"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[800px]">
          {projects[0] && (
            <div className="col-span-12 lg:col-span-7 h-full relative group overflow-hidden">
              <Image
                src={projects[0].image}
                alt={projects[0].title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-12 flex flex-col justify-end">
                <p className="mb-2 text-[10px] font-label font-semibold uppercase tracking-[0.22em] text-primary-fixed">
                  {projects[0].category}
                </p>
                <p className="font-headline font-bold text-2xl text-white uppercase">
                  {projects[0].title}
                </p>
                <p className="text-primary-fixed text-sm">
                  {projects[0].description}
                </p>
              </div>
            </div>
          )}

          <div className="col-span-12 lg:col-span-5 h-full grid grid-rows-2 gap-6">
            {projects.slice(1, 3).map((project) => (
              <div key={project._id} className="relative group overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                  <p className="mb-2 text-[10px] font-label font-semibold uppercase tracking-[0.22em] text-primary-fixed">
                    {project.category}
                  </p>
                  <p className="font-headline font-bold text-xl text-white uppercase">
                    {project.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
