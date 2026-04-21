import { useTranslations } from "next-intl";

export default function AboutHeroSection() {
  const t = useTranslations("about.hero");

  return (
    <section
      className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnlS2xBYQYwZqLef1lV9u_XW9a_4JHdSmIoUrBjd2-Ku-K-95lpHGr9pMcFgNhZTYjZKlbZnBTzGOR3rJPNxl5VP6My8MIegv_6ORlRe3yZuxt8WxuMZSeJnhtOa370M_UWp6A0BCqdYoW4OCfsU0jVFqeyMl_aAumB0ot5wJnVZOx72UXg_4mRAx1l38a4oNYEMffV4ShwX6Wwe-QYURjLE5Vbh1pONqrcy-ioP0wK7FHw-GqyNA-SdCh8PNWiffC6xgOcbI1FWtO')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 w-full">
        <p className="font-label text-xs font-semibold uppercase tracking-widest text-primary-fixed mb-4">
          {t("subtitle")}
        </p>
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase text-white leading-none tracking-tight mb-6">
          {t("title")}
        </h1>
        <p className="font-body text-base text-white/70 max-w-xl">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
