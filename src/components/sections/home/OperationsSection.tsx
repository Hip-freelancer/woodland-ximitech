import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function OperationsSection() {
  const t = useTranslations("home.operations");
  const items = t.raw("items") as Array<{ title: string; description: string }>;
  const leadItems = items.slice(0, 2);
  const supportItems = items.slice(2);

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-24 md:py-32">
      <div className="mb-14 ">
        <p className="mb-3 text-xs font-label font-bold uppercase tracking-[0.3em] text-secondary">
          {t("eyebrow")}
        </p>
        <h2 className="font-headline text-4xl font-black uppercase tracking-tighter text-primary md:text-5xl">
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {leadItems.map((item, index) => (
            <Link
              key={item.title}
              href="/operations"
              className={`relative overflow-hidden border px-8 py-9 ${
                index === 0
                  ? "border-primary/16 bg-primary text-white"
                  : "border-outline-variant/40 bg-surface-container-low"
              }`}
            >
              <p
                className={`font-label text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  index === 0 ? "text-primary-fixed" : "text-secondary"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3
                className={`mt-4 font-headline text-2xl font-black uppercase tracking-tight ${
                  index === 0 ? "text-white" : "text-primary"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-5 font-body text-sm leading-7 ${
                  index === 0 ? "text-white/78" : "text-on-surface-variant"
                }`}
              >
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {supportItems.map((item, index) => (
            <Link
              key={item.title}
              href="/operations"
              className="border border-outline-variant/35 bg-white px-7 py-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,55,31,0.1)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-primary">
                  {item.title}
                </h3>
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">
                  {String(index + 3).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 font-body text-sm leading-7 text-on-surface-variant">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
