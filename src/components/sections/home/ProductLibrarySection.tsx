import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ProductLibrarySection() {
  const t = useTranslations("home.productLibrary");
  const items = t.raw("items") as string[];

  return (
    <section className="bg-primary py-32 text-white">
      <div className="mx-auto max-w-[1440px] px-12">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-label font-bold uppercase tracking-[0.3em] text-primary-fixed">
              {t("eyebrow")}
            </p>
            <h2 className="font-headline text-5xl font-black uppercase tracking-tighter text-on-primary">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/products"
            className="whitespace-nowrap border-b-2 border-on-primary pb-1 font-headline text-sm font-bold uppercase tracking-widest text-on-primary transition-colors hover:text-primary-fixed"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="border-b border-white/14 pb-5"
            >
              <h3 className="font-headline text-xl font-bold uppercase leading-tight text-white">
                {item}
              </h3>
              <Link
                href="/contact"
                className="mt-3 inline-block font-label text-xs font-semibold uppercase tracking-[0.18em] text-primary-fixed transition-colors hover:text-white"
              >
                {t("contactItem")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
