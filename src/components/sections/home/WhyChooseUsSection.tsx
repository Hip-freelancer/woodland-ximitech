import { useTranslations } from "next-intl";
import { Leaf, Settings, FlaskConical, Globe } from "lucide-react";

const icons = [
  <Leaf key="eco" size={24} />,
  <Settings key="precision" size={24} />,
  <FlaskConical key="quality" size={24} />,
  <Globe key="logistics" size={24} />,
];

const itemKeys = ["eco", "precision", "quality", "logistics"] as const;

export default function WhyChooseUsSection() {
  const t = useTranslations("home.whyChooseUs");

  return (
    <section className="py-32 px-12 max-w-[1440px] mx-auto text-center">
      <h2 className="font-headline font-black text-5xl text-[#331917] uppercase tracking-tighter mb-24">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {itemKeys.map((key, i) => (
          <div key={key} className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center bg-[#eae8e7] mb-8 text-[#331917]">
              {icons[i]}
            </div>
            <h3 className="font-headline font-bold uppercase tracking-tight text-lg mb-4 text-[#331917]">
              {t(`items.${key}.title`)}
            </h3>
            <p className="font-body text-sm text-[#504443] leading-relaxed px-4">
              {t(`items.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
