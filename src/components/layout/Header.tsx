import { fetchProductMenu } from "@/lib/content";
import type { Locale, ProductMenuCategory } from "@/types";
import HeaderClient from "./HeaderClient";

interface HeaderProps {
  locale: Locale;
}

export default async function Header({ locale }: HeaderProps) {
  let productMenu: ProductMenuCategory[] = [];

  try {
    productMenu = await fetchProductMenu(locale);
  } catch {
    productMenu = [];
  }

  return <HeaderClient locale={locale} productMenu={productMenu} />;
}
