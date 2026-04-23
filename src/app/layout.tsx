import "./globals.css";

import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/animation/ScrollRevealProvider";
import { COMPANY_INFO } from "@/lib/companyInfo";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: COMPANY_INFO.name,
    template: "%s | Woodland",
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    siteName: COMPANY_INFO.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface font-body text-on-surface" data-anim-auto="true">
        <ScrollRevealProvider />
        {children}
      </body>
    </html>
  );
}
