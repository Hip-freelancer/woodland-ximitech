import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import {
  COMPANY_DESCRIPTION_EN,
  COMPANY_DESCRIPTION_VI,
  COMPANY_INFO,
} from "@/lib/companyInfo";
import type { Locale, SeoFields } from "@/types";

export const SITE_ORIGIN = COMPANY_INFO.website.replace(/\/+$/, "");
export const SITE_URL = new URL(COMPANY_INFO.website);
export const DEFAULT_OG_IMAGE = "/logowoodland.png";

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

export function getLocalizedPath(locale: Locale, path = "/") {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function buildLanguageAlternates(path = "/") {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      getLocalizedPath(locale as Locale, path),
    ])
  );
}

export function resolveSeoFields(
  seo: SeoFields | undefined,
  defaults: {
    description: string;
    keywords?: string;
    title: string;
  }
) {
  return {
    description: seo?.description?.trim() || defaults.description,
    keywords: seo?.keywords?.trim() || defaults.keywords || "",
    title: seo?.title?.trim() || defaults.title,
  };
}

export function buildLocalizedMetadata({
  description,
  image = DEFAULT_OG_IMAGE,
  keywords,
  locale,
  path = "/",
  title,
  type = "website",
}: {
  description: string;
  image?: string;
  keywords?: string;
  locale: Locale;
  path?: string;
  title: string;
  type?: "article" | "website";
}): Metadata {
  const keywordList = keywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const localizedPath = getLocalizedPath(locale, path);

  return {
    title,
    description,
    keywords: keywordList?.length ? keywordList : undefined,
    alternates: {
      canonical: localizedPath,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      type,
      url: localizedPath,
      siteName: COMPANY_INFO.name,
      locale: OPEN_GRAPH_LOCALE[locale],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function getDefaultLocaleDescription(locale: Locale) {
  return locale === "vi" ? COMPANY_DESCRIPTION_VI : COMPANY_DESCRIPTION_EN;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_INFO.name,
    url: SITE_ORIGIN,
    logo: getAbsoluteUrl(DEFAULT_OG_IMAGE),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: COMPANY_INFO.email,
        telephone: COMPANY_INFO.hotline,
      },
    ],
    sameAs: [COMPANY_INFO.facebook],
  };
}

export function buildWebsiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY_INFO.name,
    url: SITE_ORIGIN,
    inLanguage: locale,
  };
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  items: Array<{ label: string; path?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: getAbsoluteUrl(
        item.path ? getLocalizedPath(locale, item.path) : getLocalizedPath(locale)
      ),
    })),
  };
}
