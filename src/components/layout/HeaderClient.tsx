"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale, NewsMenuCategory, ProductMenuCategory } from "@/types";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Globe,
  Menu,
  Package2,
  X,
} from "lucide-react";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "operations", href: "/operations" },
  { key: "gallery", href: "/gallery" },
  { key: "products", href: "/products" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
  { key: "salesTeam", href: "/sales-team" },
] as const;

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getProductCategoryHref(slug: string) {
  return `/products?category=${encodeURIComponent(slug)}`;
}

function getNewsCategoryHref(slug: string) {
  return `/news?category=${encodeURIComponent(slug)}`;
}

function ProductMenuCards({
  categories,
  itemCountLabel,
  moreProductsLabel,
}: {
  categories: ProductMenuCategory[];
  itemCountLabel: (count: number) => string;
  moreProductsLabel: (count: number) => string;
}) {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
      {categories.map((category) => {
        const overflowCount = category.productCount - category.products.length;
        const categoryHref = getProductCategoryHref(category.slug);

        return (
          <article key={category.slug} className="group/card min-w-0">
            <Link
              href={categoryHref}
              className="group/image relative block aspect-[4/3] overflow-hidden rounded-[26px] bg-surface-container"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/80 text-on-primary">
                  <Package2 size={30} strokeWidth={1.6} />
                </div>
              )}
              <span className="sr-only">{category.name}</span>
            </Link>

            <div className="pt-5">
              <Link
                href={categoryHref}
                className="block font-headline text-[1.05rem] font-black uppercase leading-snug tracking-tight text-primary transition-colors duration-200 hover:text-secondary"
              >
                {category.name}
              </Link>

              <p className="mt-2 text-[10px] font-label font-semibold uppercase tracking-[0.2em] text-outline">
                {itemCountLabel(category.productCount)}
              </p>

              <ul className="mt-5 space-y-3">
                {category.products.map((product) => (
                  <li key={product._id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group/item inline-flex items-start gap-2 font-body text-sm leading-7 text-on-surface-variant transition-all duration-200 hover:translate-x-1 hover:text-primary"
                    >
                      <span className="line-clamp-2">{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {overflowCount > 0 ? (
                <p className="mt-4 text-[10px] font-label font-semibold uppercase tracking-[0.2em] text-secondary">
                  {moreProductsLabel(overflowCount)}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function NewsMenuCards({
  categories,
  itemCountLabel,
}: {
  categories: NewsMenuCategory[];
  itemCountLabel: (count: number) => string;
}) {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <article key={category.slug} className="group/card min-w-0">
          <Link
            href={getNewsCategoryHref(category.slug)}
            className="group/image relative block aspect-[4/3] max-h-[180px] overflow-hidden rounded-[26px] bg-surface-container"
          >
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/80 text-on-primary">
                <CalendarDays size={30} strokeWidth={1.6} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute left-5 bottom-5 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-white/88">
              {itemCountLabel(category.articleCount)}
            </span>
          </Link>

          <div className="pt-5">
            <Link
              href={getNewsCategoryHref(category.slug)}
              className="block font-headline text-[1.05rem] font-black uppercase leading-snug tracking-tight text-primary transition-colors duration-200 hover:text-secondary"
            >
              {category.name}
            </Link>

            <ul className="mt-5 space-y-3">
              {category.articles.map((article) => (
                <li key={article._id}>
                  <Link
                    href={`/news/${article.slug}`}
                    className="group/item inline-flex items-start gap-2 font-body text-sm leading-7 text-on-surface-variant transition-all duration-200 hover:translate-x-1 hover:text-primary"
                  >
                    <span className="line-clamp-2">{article.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

function AnimatedCollapse({
  open,
  scroll = false,
  children,
}: {
  open: boolean;
  scroll?: boolean;
  children: React.ReactNode;
}) {
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
    } else {
      const t = setTimeout(() => setRendered(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1)",
        ...(scroll && open ? { maxHeight: "calc(100svh - 64px)", overflowY: "auto" } : {}),
      }}
    >
      <div style={{ overflow: "hidden" }}>
        {rendered ? children : null}
      </div>
    </div>
  );
}

interface HeaderClientProps {
  locale: Locale;
  newsMenu: NewsMenuCategory[];
  productMenu: ProductMenuCategory[];
}

export default function HeaderClient({
  locale,
  newsMenu,
  productMenu,
}: HeaderClientProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [desktopNewsOpen, setDesktopNewsOpen] = useState(false);
  const hasProductMenu = productMenu.length > 0;
  const hasNewsMenu = newsMenu.length > 0;

  const toggleLocale = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setMobileNewsOpen(false);
    router.push(pathname, { locale: locale === "en" ? "vi" : "en" });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setMobileNewsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/92 backdrop-blur-xl shadow-sm">
      <div className="relative mx-auto flex w-full max-w-[1920px] items-center justify-between px-5 py-1.5 md:px-8">
        <Link
          href="/"
          className="relative block h-[50px] w-[50px] shrink-0 md:h-[58px] md:w-[58px]"
        >
          <Image
            alt="Woodland"
            className="object-contain"
            fill
            priority
            sizes="58px"
            src="/logowoodland.png"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map(({ key, href }) => {
            const baseClass = `font-headline text-sm font-bold uppercase tracking-widest pb-1 transition-colors duration-300 ${
              isActiveLink(pathname, href)
                ? "border-b-2 border-primary text-primary"
                : "text-outline hover:text-primary"
            }`;

            if (key !== "products" && key !== "news") {
              return (
                <Link key={key} href={href} className={baseClass}>
                  {t(key)}
                </Link>
              );
            }

            if (key === "products") {
              return (
                <div
                  key={key}
                  className="relative flex items-center"
                  onMouseEnter={() => setDesktopProductsOpen(true)}
                  onMouseLeave={() => setDesktopProductsOpen(false)}
                >
                  <Link
                    href={href}
                    className={`${baseClass} inline-flex items-center gap-2`}
                  >
                    {t(key)}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        desktopProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  <div
                    className={`absolute left-1/2 top-full z-50 w-[min(1180px,calc(100vw-2rem))] -translate-x-1/2 pt-5 transition-all duration-300 ${
                      desktopProductsOpen
                        ? "pointer-events-auto visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden border border-outline-variant/50 bg-surface-container-lowest px-8 py-8 shadow-[0_24px_60px_rgba(18,55,31,0.12)]">
                      <div className="mb-6 flex items-center justify-between gap-6 border-b border-outline-variant/40 pb-5">
                        <div>
                          <p className="text-[10px] font-label font-semibold uppercase tracking-[0.28em] text-secondary">
                            {t("productMenu.eyebrow")}
                          </p>
                          <h3 className="mt-2 font-headline text-2xl font-black uppercase leading-none tracking-tight text-primary">
                            {t("productMenu.title")}
                          </h3>
                        </div>

                        <Link
                          href="/products"
                          className="inline-flex items-center gap-2 whitespace-nowrap font-label text-xs font-bold uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:text-secondary"
                        >
                          {t("productMenu.browseAll")}
                          <ChevronRight size={15} />
                        </Link>
                      </div>

                      <div className="min-w-0">
                        {hasProductMenu ? (
                          <ProductMenuCards
                            categories={productMenu}
                            itemCountLabel={(count) =>
                              t("productMenu.itemCount", { count })
                            }
                            moreProductsLabel={(count) =>
                              t("productMenu.moreProducts", { count })
                            }
                          />
                        ) : (
                          <div className="flex min-h-[240px] items-center justify-center rounded-[26px] border border-dashed border-outline-variant/70 bg-surface-container-low p-8 text-center">
                            <p className="max-w-sm font-body text-sm leading-6 text-on-surface-variant">
                              {t("productMenu.empty")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={key}
                className="relative flex items-center"
                onMouseEnter={() => setDesktopNewsOpen(true)}
                onMouseLeave={() => setDesktopNewsOpen(false)}
              >
                <Link
                  href={href}
                  className={`${baseClass} inline-flex items-center gap-2`}
                >
                  {t(key)}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      desktopNewsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                <div
                  className={`absolute left-1/2 top-full z-50 w-[min(1080px,calc(100vw-2rem))] -translate-x-1/2 pt-5 transition-all duration-300 ${
                    desktopNewsOpen
                      ? "pointer-events-auto visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible translate-y-2 opacity-0"
                  }`}
                >
                  <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden border border-outline-variant/50 bg-surface-container-lowest px-8 py-8 shadow-[0_24px_60px_rgba(18,55,31,0.12)]">
                    <div className="mb-6 flex items-center justify-between gap-6 border-b border-outline-variant/40 pb-5">
                      <div>
                        <p className="text-[10px] font-label font-semibold uppercase tracking-[0.28em] text-secondary">
                          {t("gallery")}
                        </p>
                        <h3 className="mt-2 font-headline text-2xl font-black uppercase leading-none tracking-tight text-primary">
                          {t("news")}
                        </h3>
                      </div>

                      <Link
                        href="/news"
                        className="inline-flex items-center gap-2 whitespace-nowrap font-label text-xs font-bold uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:text-secondary"
                      >
                        {t("news")}
                        <ChevronRight size={15} />
                      </Link>
                    </div>

                    <div className="min-w-0">
                      {hasNewsMenu ? (
                        <NewsMenuCards
                          categories={newsMenu}
                          itemCountLabel={(count) =>
                            locale === "vi"
                              ? `${count} bài viết`
                              : `${count} articles`
                          }
                        />
                      ) : (
                        <div className="flex min-h-[240px] items-center justify-center rounded-[26px] border border-dashed border-outline-variant/70 bg-surface-container-low p-8 text-center">
                          <p className="max-w-sm font-body text-sm leading-6 text-on-surface-variant">
                            {locale === "vi"
                              ? "Danh mục tin tức đang được cập nhật."
                              : "News categories are being updated."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

          <div className="flex items-center gap-5">
          <button
            onClick={toggleLocale}
            className="hidden items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant transition-colors duration-300 hover:text-primary md:flex"
          >
            <Globe size={14} />
            {locale === "en" ? "VI" : "EN"}
          </button>

          <Link
            href="/contact"
            className="hidden bg-primary px-5 py-2 font-headline text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary transition-colors duration-300 hover:bg-secondary md:block"
          >
            {t("getQuote")}
          </Link>

          <button
            className="relative flex h-10 w-10 items-center justify-center text-primary transition-colors duration-200 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                mobileOpen ? "rotate-90 opacity-100 scale-100" : "rotate-0 opacity-0 scale-75"
              }`}
            >
              <X size={22} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                mobileOpen ? "-rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
              }`}
            >
              <Menu size={22} />
            </span>
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <AnimatedCollapse open={mobileOpen} scroll>
        <nav className="flex flex-col gap-3 border-t border-surface-variant bg-surface px-6 py-4">
            {navLinks.map(({ key, href }) => {
              const activeClass = isActiveLink(pathname, href)
                ? "border-primary/25 bg-primary/8 text-primary"
                : "border-surface-variant text-on-surface-variant";

              if (key !== "products" && key !== "news") {
                return (
                  <Link
                    key={key}
                    href={href}
                    className={`rounded-2xl border px-4 py-3.5 font-headline text-sm font-bold uppercase tracking-widest transition-all duration-150 active:scale-[0.98] active:opacity-80 ${activeClass}`}
                    onClick={closeMobileMenu}
                  >
                    {t(key)}
                  </Link>
                );
              }

              if (key === "products") {
                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-low"
                  >
                    <button
                      onClick={() => setMobileProductsOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between px-4 py-3.5 text-left font-headline text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                        isActiveLink(pathname, href)
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      <span>{t(key)}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          mobileProductsOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    <AnimatedCollapse open={mobileProductsOpen}>
                      <div className="border-t border-outline-variant/40 px-4 pb-4 pt-3">
                        <Link
                          href="/products"
                          className="mb-3 inline-flex items-center gap-2 font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary"
                          onClick={closeMobileMenu}
                        >
                          {t("productMenu.browseAll")}
                          <ChevronRight size={14} />
                        </Link>

                        {hasProductMenu ? (
                          <div className="space-y-2">
                            {productMenu.map((category) => (
                              <Link
                                key={category.slug}
                                href={getProductCategoryHref(category.slug)}
                                className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-white/80 px-4 py-3 transition-colors duration-200 active:bg-primary/8"
                                onClick={closeMobileMenu}
                              >
                                <span className="font-body text-sm font-semibold text-on-surface">
                                  {category.name}
                                </span>
                                <span className="shrink-0 text-[10px] font-label font-semibold uppercase tracking-[0.18em] text-outline">
                                  {t("productMenu.itemCount", {
                                    count: category.productCount,
                                  })}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="font-body text-sm text-on-surface-variant">
                            {t("productMenu.empty")}
                          </p>
                        )}
                      </div>
                    </AnimatedCollapse>
                  </div>
                );
              }

              return (
                <Link
                  key={key}
                  href={href}
                  className={`rounded-2xl border px-4 py-3 font-headline text-sm font-bold uppercase tracking-widest ${activeClass}`}
                  onClick={closeMobileMenu}
                >
                  {t(key)}
                </Link>
              );
            })}

            <button
              onClick={toggleLocale}
              className="flex w-fit items-center gap-1.5 pt-2 text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant"
            >
              <Globe size={14} />
              {locale === "en" ? "Tiếng Việt" : "English"}
            </button>
          </nav>
        </AnimatedCollapse>
      </div>
    </header>
  );
}
