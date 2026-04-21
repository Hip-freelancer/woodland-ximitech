import { useTranslations } from "next-intl";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactInfoPanel from "@/components/sections/contact/ContactInfoPanel";
import Badge from "@/components/ui/Badge";
import SectionDivider from "@/components/ui/SectionDivider";
import PageHero from "@/components/ui/PageHero";

const CERTIFICATIONS = [
  "FSC-C000000",
  "PEFC-CERTIFIED",
  "ISO-14001",
  "EPD-VERIFIED",
  "BREEAM-A+",
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

export default function ContactPage() {
  const tForm = useTranslations("contact.form");
  const tHero = useTranslations("contact.hero");

  return (
    <>
      <PageHero label="Contact" title={tHero("title")} description={tHero("subtitle")} />
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
