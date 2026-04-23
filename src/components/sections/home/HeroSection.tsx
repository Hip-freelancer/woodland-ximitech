import { getTranslations } from "next-intl/server";
import { fetchHomeSettings } from "@/lib/content";
import type { Locale } from "@/types";
import HeroSliderClient from "./HeroSliderClient";

export default async function HeroSection({ locale }: { locale: Locale }) {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: "home.hero" }),
    fetchHomeSettings(),
  ]);

  return (
    <HeroSliderClient
      actions={{
        primary: t("viewProducts"),
        secondary: t("ourProcess"),
      }}
      actionHrefs={{
        primary: "/products",
        secondary: "/about",
      }}
      locale={locale}
      settings={settings}
      subtitle={t("subtitle")}
      title={t("title")}
    />
  );
}
