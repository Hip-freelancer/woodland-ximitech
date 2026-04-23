import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function CtaBannerSection() {
  const t = useTranslations("home.cta");

  return (
    <section className="max-w-[1440px] mx-auto px-12 mb-32">
      <div className="bg-primary-container p-16 md:p-24 relative overflow-hidden flex flex-col items-center text-center grain-overlay">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2 text-[220px] leading-none text-primary-fixed-dim">
          ○
        </div>
        <div className="relative z-10 max-w-5xl">
          <h2 className="mb-8 pt-[0.16em] pb-[0.08em] font-headline text-4xl font-black uppercase leading-[1.12] tracking-tighter text-on-primary [text-wrap:balance] md:text-6xl">
            {t("title")}
          </h2>
          <p className="mb-12 font-body text-base leading-8 text-primary-fixed [text-wrap:balance] md:text-lg md:leading-9 xl:text-xl">
            {t("subtitle")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface text-primary px-12 py-6 font-headline font-bold uppercase text-sm tracking-widest hover:bg-secondary hover:text-on-secondary transition-all duration-500"
          >
            {t("button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
