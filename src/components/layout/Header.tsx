"use client";

// React
import { useState } from "react";

// Next / i18n
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

// Icons
import { Menu, X, Globe } from "lucide-react";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "contact", href: "/contact" },
  { key: "salesTeam", href: "/sales-team" },
];

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLocale = () => {
    router.push(pathname, { locale: locale === "en" ? "vi" : "en" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-[1920px] mx-auto w-full px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-headline font-black text-2xl tracking-tighter text-[#331917] uppercase"
        >
          Woodland
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`font-headline font-bold uppercase tracking-widest text-sm pb-1 transition-colors duration-300 ${
                pathname === href
                  ? "text-[#331917] border-b-2 border-[#331917]"
                  : "text-[#827472] hover:text-[#331917]"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLocale}
            className="hidden md:flex items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-[#534340] hover:text-[#331917] transition-colors duration-300"
          >
            <Globe size={14} />
            {locale === "en" ? "VI" : "EN"}
          </button>

          <Link
            href="/contact"
            className="hidden md:block bg-[#331917] text-white font-headline font-bold uppercase tracking-wider text-xs px-6 py-2.5 hover:bg-[#396759] transition-colors duration-300"
          >
            {t("getQuote")}
          </Link>

          <button
            className="md:hidden text-[#331917]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#fbf9f8] border-t border-[#e4e2e1]">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-headline text-sm font-bold uppercase tracking-widest text-[#534340]"
                onClick={() => setMobileOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-[#534340] w-fit"
            >
              <Globe size={14} />
              {locale === "en" ? "Tiếng Việt" : "English"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
