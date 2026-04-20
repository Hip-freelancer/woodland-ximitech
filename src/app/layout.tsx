import "./globals.css";

import ScrollRevealProvider from "@/components/animation/ScrollRevealProvider";

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
