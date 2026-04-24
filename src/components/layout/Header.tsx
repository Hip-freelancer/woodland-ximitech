import { fetchNewsMenu, fetchProductMenu } from "@/lib/content";
import type { Locale, NewsMenuCategory, ProductMenuCategory } from "@/types";
import HeaderClient from "./HeaderClient";

interface HeaderProps {
  locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
  let productMenu: ProductMenuCategory[] = [];
  let newsMenu: NewsMenuCategory[] = [];

  try {
    [productMenu, newsMenu] = await Promise.all([
      fetchProductMenu(locale),
      fetchNewsMenu(locale),
    ]);
  } catch {
    productMenu = [];
    newsMenu = [];
  }

  return (
    <HeaderClient locale={locale} productMenu={productMenu} newsMenu={newsMenu} />
  );
}
