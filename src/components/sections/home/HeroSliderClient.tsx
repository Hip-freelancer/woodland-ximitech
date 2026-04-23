"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HomeSettings, Locale } from "@/types";

interface HeroSliderClientProps {
  actions: {
    primary: string;
    secondary: string;
  };
  actionHrefs: {
    primary: string;
    secondary: string;
  };
  locale: Locale;
  settings: HomeSettings;
  subtitle: string;
  title: string;
}

function localize(value: { en: string; vi: string }, locale: Locale) {
  return locale === "vi" ? value.vi || value.en : value.en || value.vi;
}

function formatAnimatedValue(template: string, progress: number) {
  const numberPattern = /\d[\d,.]*/g;

  return template.replace(numberPattern, (match) => {
    const normalized = match.replace(/,/g, "");
    const target = Number(normalized);

    if (Number.isNaN(target)) {
      return match;
    }

    const decimalPart = normalized.split(".")[1];
    const precision = decimalPart ? decimalPart.length : 0;
    const animated = target * progress;

    if (precision > 0) {
      return animated.toLocaleString("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    }

    return Math.round(animated).toLocaleString("en-US");
  });
}

function AnimatedStatValue({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatAnimatedValue(value, 0),
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const rootRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;

    if (!node || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();
        setHasAnimated(true);

        const duration = 1600;
        const startedAt = performance.now();

        const tick = (timestamp: number) => {
          const elapsed = timestamp - startedAt;
          const ratio = Math.min(elapsed / duration, 1);
          const eased = 1 - (1 - ratio) ** 3;

          setDisplayValue(formatAnimatedValue(value, eased));

          if (ratio < 1) {
            window.requestAnimationFrame(tick);
          }
        };

        window.requestAnimationFrame(tick);
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  return (
    <p ref={rootRef} className={className}>
      {displayValue}
    </p>
  );
}

function getStatValueClasses(value: string) {
  const length = value.trim().length;

  if (length >= 18) {
    return "max-w-[13ch] text-[clamp(1.9rem,1.6vw+1.2rem,3.5rem)] leading-[0.92]";
  }

  if (length >= 11) {
    return "max-w-[12ch] text-[clamp(2.05rem,1.65vw+1.25rem,3.45rem)] leading-[0.95]";
  }

  if (length >= 9) {
    return "max-w-[11ch] text-[clamp(2.15rem,1.75vw+1.3rem,3.55rem)] leading-[0.95]";
  }

  return "max-w-[10ch] text-[clamp(2.3rem,1.9vw+1.35rem,3.8rem)] leading-[0.95]";
}

function getStatCellClasses(index: number) {
  const baseClasses =
    "flex min-h-[138px] min-w-0 items-center justify-center px-8 py-8 text-center lg:px-8";

  const mobileClasses = index > 0 ? "border-t border-white/10" : "";
  const tabletClasses = [
    index >= 2 ? "border-t border-white/10" : "",
    index % 2 === 1 ? "md:border-l md:border-white/10" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const desktopClasses = [
    "lg:border-t-0",
    index > 0 ? "lg:border-l lg:border-white/10" : "lg:border-l-0",
  ].join(" ");

  return [baseClasses, mobileClasses, tabletClasses, desktopClasses]
    .filter(Boolean)
    .join(" ");
}

export default function HeroSliderClient({
  actions,
  actionHrefs,
  locale,
  settings,
  subtitle,
  title,
}: HeroSliderClientProps) {
  const slides = settings.heroSlides.filter((slide) => slide.isVisible);
  const stats = settings.heroStats.filter((stat) => stat.isVisible);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleStats = useMemo(() => stats.slice(0, 4), [stats]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slides.length]);
  const resolvedActiveIndex =
    slides.length > 0 ? activeIndex % slides.length : 0;
  const currentSlide = slides[resolvedActiveIndex];
  const hasMediaSlide = Boolean(currentSlide);

  return (
    <section className="relative -mt-16 min-h-screen overflow-hidden bg-primary text-white">
      <div className="absolute inset-0">
        {hasMediaSlide ? (
          slides.map((slide, index) => {
            const isActive = index === resolvedActiveIndex;
            const alt = localize(slide.alt, locale) || title;

            return (
              <div
                key={`${slide._id ?? slide.mediaUrl}-${index}`}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {slide.mediaType === "video" ? (
                  <video
                    autoPlay
                    className="h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    poster={slide.posterUrl || undefined}
                    preload="metadata"
                    src={slide.mediaUrl}
                  />
                ) : (
                  <Image
                    alt={alt}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    src={slide.mediaUrl}
                  />
                )}
              </div>
            );
          })
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(118,190,125,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%),linear-gradient(135deg,#10361f_0%,#1f6f3a_44%,#28573c_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-[linear-gradient(180deg,transparent_0%,rgba(5,13,8,0.34)_100%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.58)_0%,rgba(7,17,11,0.42)_35%,rgba(7,17,11,0.72)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-[1920px] flex-1 items-center px-6 pb-36 pt-28 md:px-10 lg:px-14">
          <div className="w-full text-center">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-[360px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(3,10,6,0.58)_0%,rgba(3,10,6,0.36)_42%,transparent_75%)] blur-2xl" />
              <span className="inline-flex items-center justify-center border border-white/24 bg-black/22 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.28em] text-white/92 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                Woodland
              </span>
              <h1 className="mx-auto mt-8 max-w-6xl pt-[0.1em] pb-[0.08em] font-headline text-5xl font-black leading-[1.04] tracking-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] md:text-7xl xl:text-[5.1rem]">
                {title}
              </h1>
              <p className="mx-auto mt-5  font-body text-base leading-8 text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)] md:text-xl">
                {subtitle}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={actionHrefs.primary}
                  className="inline-flex min-w-[190px] items-center justify-center bg-white px-8 py-4 font-headline text-sm font-bold uppercase tracking-[0.16em] text-primary shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary-fixed"
                >
                  {actions.primary}
                </Link>
                <Link
                  href={actionHrefs.secondary}
                  className="inline-flex min-w-[190px] items-center justify-center border border-white/60 bg-black/12 px-8 py-4 font-headline text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                >
                  {actions.secondary}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/12 bg-black/18 backdrop-blur-sm">
          <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:px-14">
            {visibleStats.map((stat, index) =>
              (() => {
                const localizedValue = localize(stat.value, locale);

                return (
                  <div
                    key={stat._id ?? `${stat.order}-${stat.value.en}`}
                    className={getStatCellClasses(index)}
                  >
                    <div className="mx-auto flex w-full max-w-[21rem] flex-col items-center justify-center text-center">
                      <AnimatedStatValue
                        key={`${stat._id ?? stat.order}-${localizedValue}`}
                        className={`mx-auto max-w-full text-center font-headline font-black tracking-tight text-white [word-break:keep-all] ${getStatValueClasses(localizedValue)} ${
                          localizedValue.includes(" / ")
                            ? "[text-wrap:balance]"
                            : ""
                        }`}
                        value={localizedValue}
                      />
                      <p className="mt-4 whitespace-nowrap text-center font-label text-[11px] font-medium uppercase tracking-[0.18em] text-white/74 md:text-xs">
                        {localize(stat.label, locale)}
                      </p>
                    </div>
                  </div>
                );
              })(),
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            aria-label={locale === "vi" ? "Slide trước" : "Previous slide"}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition-colors hover:bg-white/28 md:left-8"
            onClick={() =>
              setActiveIndex(
                (current) => (current - 1 + slides.length) % slides.length,
              )
            }
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label={locale === "vi" ? "Slide kế tiếp" : "Next slide"}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition-colors hover:bg-white/28 md:right-8"
            onClick={() =>
              setActiveIndex((current) => (current + 1) % slides.length)
            }
            type="button"
          >
            <ArrowRight size={20} />
          </button>
        </>
      ) : null}
    </section>
  );
}
