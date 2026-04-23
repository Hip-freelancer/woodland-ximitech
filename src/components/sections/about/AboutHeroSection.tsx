import { useTranslations } from "next-intl";

export default function AboutHeroSection() {
  const t = useTranslations("about.hero");

  return (
    <section
      className="relative flex min-h-[76vh] items-end overflow-hidden pb-20"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/58 to-primary/15" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6">
        <div className="max-w-4xl border border-white/12 bg-black/12 p-8 backdrop-blur-[2px] md:p-12">
        <p className="mb-4 font-label text-xs font-semibold uppercase tracking-widest text-primary-fixed">
          {t("subtitle")}
        </p>
        <h1 className="mb-6 font-headline text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl font-body text-base leading-8 text-white/74 md:text-lg">
          {t("description")}
        </p>
        </div>
      </div>
    </section>
  );
}
