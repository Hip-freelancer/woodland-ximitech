import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactInfoPanel from "@/components/sections/contact/ContactInfoPanel";
import Badge from "@/components/ui/Badge";
import BreadcrumbBar from "@/components/ui/BreadcrumbBar";
import SectionDivider from "@/components/ui/SectionDivider";
import PageHero from "@/components/ui/PageHero";
import type { Locale } from "@/types";

const CERTIFICATIONS = [
  "Plywood nhập khẩu",
  "Plywood Melamine",
  "Plywood Việt Nam",
  "Gỗ Cao Su Ghép Finger",
  "Plywood Phủ Veneer",
  "Ván MDF",
];

function CertificationsSection() {
  const t = useTranslations("contact");
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12">
      <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-6">
        {t("certifications")}
      </p>
      <div className="flex flex-wrap gap-3">
        {CERTIFICATIONS.map((cert) => (
           <Badge key={cert} label={cert} />
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });

  return {
    title: `${t("title")} | Woodland`,
    description: t("subtitle"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tForm = await getTranslations({ locale, namespace: "contact.form" });
  const tHero = await getTranslations({ locale, namespace: "contact.hero" });

  return (
    <>
      <BreadcrumbBar
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("contact") },
        ]}
      />
      <PageHero label="Woodland" title={tHero("title")} description={tHero("subtitle")} />
      <SectionDivider />

      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-16">
          <div className="md:col-span-4">
            <h2 className="font-headline font-black text-3xl uppercase text-primary leading-none tracking-tight mb-10">
              {tForm("title")}
            </h2>
            <ContactForm />
          </div>
          <div className="md:col-span-3">
            <ContactInfoPanel />
          </div>
        </div>
      </section>

      <SectionDivider />
      <CertificationsSection />
    </>
  );
}
