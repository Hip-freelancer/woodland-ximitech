"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale, ProductMenuCategory } from "@/types";
import {
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

function getCategoryHref(slug: string) {
  return `/products?category=${encodeURIComponent(slug)}`;
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
        const categoryHref = getCategoryHref(category.slug);

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

interface HeaderClientProps {
  locale: Locale;
  productMenu: ProductMenuCategory[];
}

export default function HeaderClient({
  locale,
  productMenu,
}: HeaderClientProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const hasProductMenu = productMenu.length > 0;

  const toggleLocale = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
    router.push(pathname, { locale: locale === "en" ? "vi" : "en" });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="relative mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-tighter text-primary"
        >
          Woodland
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ key, href }) => {
            const baseClass = `font-headline text-sm font-bold uppercase tracking-widest pb-1 transition-colors duration-300 ${
              isActiveLink(pathname, href)
                ? "border-b-2 border-primary text-primary"
                : "text-outline hover:text-primary"
            }`;

            if (key !== "products") {
              return (
                <Link key={key} href={href} className={baseClass}>
                  {t(key)}
                </Link>
              );
            }

            return (
              <div key={key} className="group/product relative flex items-center">
                <Link
                  href={href}
                  className={`${baseClass} inline-flex items-center gap-2`}
                >
                  {t(key)}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover/product:rotate-180 group-focus-within/product:rotate-180"
                  />
                </Link>

                <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-[min(1180px,calc(100vw-2rem))] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-all duration-300 group-hover/product:pointer-events-auto group-hover/product:visible group-hover/product:translate-y-0 group-hover/product:opacity-100 group-focus-within/product:pointer-events-auto group-focus-within/product:visible group-focus-within/product:translate-y-0 group-focus-within/product:opacity-100">
                  <div className="overflow-hidden border border-outline-variant/50 bg-surface-container-lowest px-8 py-8 shadow-[0_24px_60px_rgba(18,55,31,0.12)]">
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
          })}
        </nav>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLocale}
            className="hidden items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant transition-colors duration-300 hover:text-primary md:flex"
          >
            <Globe size={14} />
            {locale === "en" ? "VI" : "EN"}
          </button>

          <Link
            href="/contact"
            className="hidden bg-primary px-6 py-2.5 font-headline text-xs font-bold uppercase tracking-wider text-on-primary transition-colors duration-300 hover:bg-secondary md:block"
          >
            {t("getQuote")}
          </Link>

          <button
            className="text-primary md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-surface-variant bg-surface md:hidden">
          <nav className="flex flex-col gap-3 px-6 py-4">
            {navLinks.map(({ key, href }) => {
              const activeClass = isActiveLink(pathname, href)
                ? "border-primary/25 bg-primary/8 text-primary"
                : "border-surface-variant text-on-surface-variant";

              if (key !== "products") {
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
              }

              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-low"
                >
                  <button
                    onClick={() => setMobileProductsOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left font-headline text-sm font-bold uppercase tracking-widest ${
                      isActiveLink(pathname, href)
                        ? "text-primary"
                        : "text-on-surface-variant"
                    }`}
                  >
                    <span>{t(key)}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        mobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileProductsOpen ? (
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
                              href={getCategoryHref(category.slug)}
                              className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-white/80 px-4 py-3"
                              onClick={closeMobileMenu}
                            >
                              <span className="font-body text-sm font-semibold text-on-surface">
                                {category.name}
                              </span>
                              <span className="text-[10px] font-label font-semibold uppercase tracking-[0.18em] text-outline">
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
                  ) : null}
                </div>
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
        </div>
      ) : null}
    </header>
  );
}
