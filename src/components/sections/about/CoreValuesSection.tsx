import { useTranslations } from "next-intl";
import { Leaf, Shield, Waves } from "lucide-react";

const icons = [
  <Waves key="marine" size={28} />,
  <Shield key="melamine" size={28} />,
  <Leaf key="flexible" size={28} />,
];

export default function CoreValuesSection() {
  const t = useTranslations("about");
  const portfolioItems = t.raw("portfolio.items") as Array<{
    title: string;
    description: string;
  }>;
  const valueItems = t.raw("values.items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section className="bg-surface-container-low py-24">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-tight text-primary">
            {t("portfolio.title")}
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant">
            {t("portfolio.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {portfolioItems.map((item, i) => (
            <div
              key={item.title}
              className="border border-outline-variant/30 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,55,31,0.1)]"
            >
              <div className="mb-6 flex justify-center text-secondary">{icons[i]}</div>
              <h3 className="mb-4 font-headline text-xl font-bold uppercase tracking-wide text-primary">
                {item.title}
              </h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {valueItems.map((item, index) => (
            <div
              key={item.title}
              className={`border px-8 py-8 ${
                index === 1
                  ? "border-primary/16 bg-primary text-white"
                  : "border-outline-variant/40 bg-surface"
              }`}
            >
              <p
                className={`font-label text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  index === 1 ? "text-primary-fixed" : "text-secondary"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3
                className={`mt-3 font-headline text-xl font-bold uppercase tracking-tight ${
                  index === 1 ? "text-white" : "text-primary"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-4 font-body text-sm leading-relaxed ${
                  index === 1 ? "text-white/78" : "text-on-surface-variant"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
