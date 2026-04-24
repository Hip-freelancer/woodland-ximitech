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
export const DEFAULT_OG_IMAGE =
  "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg";

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

export function buildWoodlandSeoKeywords(
  locale: Locale,
  extraKeywords: Array<string | undefined> = []
) {
  const baseKeywords =
    locale === "vi"
      ? [
          "Woodland",
          "gỗ ván ép Bình Dương",
          "ván ép Bình Dương",
          "plywood Bình Dương",
          "gỗ công nghiệp Bình Dương",
          "nhà cung cấp ván ép",
          "plywood melamine",
          "plywood marine",
          "gỗ cao su ghép",
        ]
      : [
          "Woodland",
          "plywood supplier Binh Duong",
          "industrial wood Vietnam",
          "plywood Vietnam",
          "melamine plywood",
          "marine plywood",
          "finger-joint rubberwood",
          "wood panel supplier",
        ];

  return Array.from(
    new Set(
      [...extraKeywords, ...baseKeywords]
        .flatMap((value) => (value ?? "").split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).join(", ");
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

  const absoluteCanonical = getAbsoluteUrl(localizedPath);
  const absoluteImage = image.startsWith("http") ? image : getAbsoluteUrl(image);

  return {
    title,
    description,
    keywords: keywordList?.length ? keywordList : undefined,
    metadataBase: SITE_URL,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: {
      canonical: absoluteCanonical,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          getAbsoluteUrl(getLocalizedPath(loc as Locale, path)),
        ])
      ),
    },
    openGraph: {
      title,
      description,
      type,
      url: absoluteCanonical,
      siteName: COMPANY_INFO.name,
      locale: OPEN_GRAPH_LOCALE[locale],
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
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

export function buildFaqJsonLd(
  faqItems: Array<{ answer: string; question: string }> | undefined
) {
  const items = (faqItems ?? []).filter(
    (item) => item.question.trim() && item.answer.trim()
  );

  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
