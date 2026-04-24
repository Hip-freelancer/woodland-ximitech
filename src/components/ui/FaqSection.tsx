"use client";

import { useState } from "react";
import type { FaqItem } from "@/types";

interface FaqSectionProps {
  eyebrow?: string;
  items: FaqItem[];
  subtitle?: string;
  title: string;
}

export default function FaqSection({
  eyebrow = "Woodland",
  items,
  subtitle,
  title,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const visibleItems = items.filter(
    (item) => item.question.trim() && item.answer.trim()
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
        {eyebrow}
      </p>
      <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-3xl font-body text-sm leading-7 text-on-surface-variant">
          {subtitle}
        </p>
      ) : null}

      <div className="mt-9 overflow-hidden border border-outline-variant/40 bg-white">
        {visibleItems.map((item, index) => {
          const isOpen = openIndex === index;
          const contentId = `faq-panel-${index}-${item.order ?? "item"}`;

          return (
          <div
            className="border-b border-outline-variant/30 last:border-b-0"
            key={`${item.order}-${item.question}`}
          >
            <button
              aria-controls={contentId}
              aria-expanded={isOpen}
              className={`flex w-full cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-left font-headline text-lg font-bold uppercase tracking-tight text-primary transition-colors duration-300 md:px-8 ${
                isOpen ? "bg-surface-container-low/60" : "bg-white hover:bg-surface-container-low/35"
              }`}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              type="button"
            >
              <span>{item.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center border border-outline-variant/50 font-body text-xl leading-none text-secondary transition-transform duration-500 ease-out ${
                  isOpen ? "rotate-45 bg-primary text-on-primary" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              id={contentId}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl px-6 pb-6 pt-1 font-body text-sm leading-7 text-on-surface-variant md:px-8 md:text-base md:leading-8">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
