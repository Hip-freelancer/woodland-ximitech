import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutPreviewSection() {
  const t = useTranslations("home.about");

  return (
    <section className="py-32 px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative group aspect-[4/5] w-full overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-tertiary-fixed -z-10" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw-Hp6--4boMLamw7bgoEEXH5_Dl7hSKXvdGtNXx4OZgA1jhBDXXcrh-aXNEzqHbv_6nOGn5-rl7iDu00O5OOWpVMF5R3G-5cWdvclIL0Evskc5ZgpuVF78fQIrKqKrostyJal4YUfUXErC3tJAB8W8ZeKXrIYKB3LDzBTTpI77OULFulHRRG9vr2G6fR4sPq7pZ_Vll0txlvK61in-zgJMKPl6jedEJbhiP_u0LFq20e0V71bNhZMHoYyCtQnZ9Ra1gfspZ-sd0pX"
            alt="Woodland factory"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-12 -right-12 bg-primary-container p-12 text-on-primary shadow-2xl max-w-sm hidden md:block grain-overlay">
            <h3 className="font-headline font-bold text-2xl uppercase mb-4 tracking-tight">
              {t("legacyTitle")}
            </h3>
            <p className="font-body text-sm opacity-80 leading-loose">
              {t("legacyDescription")}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <span className="text-xs font-label uppercase tracking-[0.3em] text-secondary font-bold">
            {t("badge")}
          </span>
          <h2 className="pt-4 font-headline font-black text-5xl text-primary uppercase tracking-tighter leading-none">
            {t("title")}
          </h2>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-xl">
            {t("description")}
          </p>

          <div className="flex gap-12 pt-2">
            <div>
              <p className="font-headline font-bold text-4xl text-primary mb-1">
                {t("stat1Value")}
              </p>
              <p className="text-xs font-label uppercase tracking-widest text-outline">
                {t("stat1Label")}
              </p>
            </div>
            <div>
              <p className="font-headline font-bold text-4xl text-primary mb-1">
                {t("stat2Value")}
              </p>
              <p className="text-xs font-label uppercase tracking-widest text-outline">
                {t("stat2Label")}
              </p>
            </div>
          </div>

          <Link
            href="/about"
            className="font-headline font-bold uppercase text-sm tracking-widest text-primary hover:text-secondary transition-colors border-b-2 border-primary pb-1 inline-block"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </section>
  );
}
