import React from "react";

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
}

export default function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="bg-primary pt-32 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        {label && (
          <p className="font-label text-xs font-semibold uppercase tracking-widest text-primary-fixed mb-4">
            {label}
          </p>
        )}
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase text-white leading-none tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="font-body text-base text-white/60 max-w-xl mt-6">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
