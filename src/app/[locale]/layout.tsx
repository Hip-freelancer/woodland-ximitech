import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import DocumentLocale from "@/components/layout/DocumentLocale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/ui/BackToTopButton";
import QuickContactRail from "@/components/ui/QuickContactRail";
import { fetchHomeSettings } from "@/lib/content";
import type { Locale } from "@/types";

export const metadata: Metadata = {
  title: "WOODLAND | Gỗ công nghiệp Woodland",
  description:
    "WOODLAND cung cấp plywood, gỗ ghép, MDF và các dòng gỗ công nghiệp cho nội thất, xây dựng và sản xuất.",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "vi")) {
    notFound();
  }

  const [messages, homeSettings] = await Promise.all([
    getMessages(),
    fetchHomeSettings(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLocale locale={locale as Locale} />
      <Header locale={locale as Locale} />
      <main className="pt-16">{children}</main>
      <Footer />
      <QuickContactRail
        locale={locale as Locale}
        settings={homeSettings}
      />
      <BackToTopButton />
    </NextIntlClientProvider>
  );
}
