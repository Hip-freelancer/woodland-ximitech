import "./globals.css";

import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/animation/ScrollRevealProvider";
import { COMPANY_INFO } from "@/lib/companyInfo";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_INFO.website),
  icons: {
    apple: "/logowoodland.png",
    icon: "/logowoodland.png",
    shortcut: "/logowoodland.png",
  },
  openGraph: {
    images: ["/logowoodland.png"],
    siteName: COMPANY_INFO.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    images: ["/logowoodland.png"],
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
