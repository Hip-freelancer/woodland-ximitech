import { useTranslations } from "next-intl";
import { Leaf, Shield, Globe } from "lucide-react";

const icons = [
  <Leaf key="sustainability" size={28} />,
  <Shield key="quality" size={28} />,
  <Globe key="export" size={28} />,
];

const valueKeys = ["sustainability", "quality", "export"] as const;

export default function CoreValuesSection() {
  const t = useTranslations("about.values");

  return (
    <section className="bg-[#f5f3f2] py-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="font-headline font-black text-4xl uppercase text-[#331917] leading-none tracking-tight mb-16 text-center">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueKeys.map((key, i) => (
            <div key={key} className="bg-white p-10 text-center">
              <div className="text-[#396759] flex justify-center mb-6">{icons[i]}</div>
              <h3 className="font-headline font-bold text-xl uppercase text-[#331917] tracking-wide mb-4">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-sm text-[#534340] leading-relaxed">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
