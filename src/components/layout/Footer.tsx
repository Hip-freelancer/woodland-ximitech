import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "contact", href: "/contact" },
  { key: "salesTeam", href: "/sales-team" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-stone-900 w-full pt-24 pb-12 px-12 mt-20 border-t border-stone-800/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <p className="font-headline font-bold text-stone-100 tracking-widest text-xl mb-6 uppercase">
              Woodland
            </p>
            <p className="font-body text-stone-400 text-sm leading-loose">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="text-stone-100 font-bold uppercase text-xs tracking-widest mb-4">
              {t("navigation")}
            </h5>
            <nav className="flex flex-col gap-3">
              {navLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
                >
                  {tNav(key)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="text-stone-100 font-bold uppercase text-xs tracking-widest mb-4">
              Market Presence
            </h5>
            <Link
              href="/products"
              className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
            >
              Global Export
            </Link>
            <Link
              href="/products"
              className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
            >
              Project Gallery
            </Link>
            <Link
              href="/contact"
              className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="text-stone-100 font-bold uppercase text-xs tracking-widest mb-4">
              {t("legal")}
            </h5>
            <Link
              href="/"
              className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/"
              className="font-body text-stone-400 hover:text-stone-200 transition-colors duration-300"
            >
              {t("terms")}
            </Link>
            <div className="pt-2">
              <p className="text-stone-100 font-bold uppercase text-xs tracking-widest mb-3">
                {t("newsletter.title")}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 bg-stone-800 border border-stone-700 px-3 py-2 text-xs font-body text-stone-200 placeholder:text-stone-500 focus:outline-none"
                />
                <button className="bg-[#396759] px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-[#2d5548] transition-colors duration-300">
                  {t("newsletter.button")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-stone-800/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label text-stone-400 text-[10px] tracking-widest uppercase">
            {t("copyright")}
          </p>
          <p className="font-label text-stone-500 text-[10px] tracking-widest uppercase">
            ISO 9001:2015 CERTIFIED FACILITY
          </p>
        </div>
      </div>
    </footer>
  );
}
