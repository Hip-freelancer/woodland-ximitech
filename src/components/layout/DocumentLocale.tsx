"use client";

import { useEffect } from "react";
import type { Locale } from "@/types";

interface DocumentLocaleProps {
  locale: Locale;
}

export default function DocumentLocale({ locale }: DocumentLocaleProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  return null;
}
