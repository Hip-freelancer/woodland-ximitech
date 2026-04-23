"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BackToTopButton() {
  const t = useTranslations("common");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 480);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label={t("backToTop")}
      className={`fixed bottom-5 left-3 z-[65] flex h-14 w-14 items-center justify-center rounded-[20px] border border-primary/12 bg-white/96 text-primary shadow-[0_18px_42px_rgba(18,55,31,0.18)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white md:bottom-8 md:left-5 md:h-16 md:w-16 md:rounded-[22px] ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={scrollToTop}
      type="button"
    >
      <ArrowUp size={22} className="md:h-6 md:w-6" />
    </button>
  );
}
