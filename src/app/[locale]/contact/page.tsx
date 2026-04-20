import { useTranslations } from "next-intl";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactInfoPanel from "@/components/sections/contact/ContactInfoPanel";
import Badge from "@/components/ui/Badge";
import SectionDivider from "@/components/ui/SectionDivider";

const CERTIFICATIONS = [
  "FSC-C000000",
  "PEFC-CERTIFIED",
  "ISO-14001",
  "EPD-VERIFIED",
  "BREEAM-A+",
];

function ContactHero() {
  const t = useTranslations("contact.hero");
  return (
    <section className="bg-[#331917] py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#396759] mb-4">
          Contact
        </p>
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase text-white leading-none tracking-tight mb-6">
          {t("title")}
        </h1>
        <p className="font-body text-base text-white/60 max-w-xl">{t("subtitle")}</p>
      </div>
    </section>
  );
}

function CertificationsSection() {
  const t = useTranslations("contact");
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12">
      <p className="font-label text-[10px] font-semibold uppercase tracking-widest text-[#534340] mb-6">
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
  const t = useTranslations("contact.form");

  return (
    <>
      <ContactHero />
      <SectionDivider />

      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-16">
          <div className="md:col-span-4">
            <h2 className="font-headline font-black text-3xl uppercase text-[#331917] leading-none tracking-tight mb-10">
              {t("title")}
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
