import Image from "next/image";
import React from "react";
import { DEFAULT_PAGE_HERO_BACKGROUND_IMAGE } from "@/lib/pageHeroMedia";

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  backgroundImage?: string;
}

export default function PageHero({
  label,
  title,
  description,
  backgroundImage = DEFAULT_PAGE_HERO_BACKGROUND_IMAGE,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary px-6 pt-32 pb-20">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,55,31,0.92)_0%,rgba(18,55,31,0.82)_42%,rgba(18,55,31,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,195,74,0.18),transparent_42%)]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        {label && (
          <p className="font-label text-xs font-semibold uppercase tracking-widest text-primary-fixed mb-4">
            {label}
          </p>
        )}
        <h1 className="pt-[0.1em] pb-[0.08em] font-headline font-black text-4xl sm:text-5xl md:text-7xl uppercase text-white leading-[1.04] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="font-body text-base text-white/72 max-w-2xl mt-6 md:text-lg md:leading-8">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
