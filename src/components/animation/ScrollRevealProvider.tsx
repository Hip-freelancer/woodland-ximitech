"use client";

// React
import { useEffect } from "react";

// Next
import { usePathname } from "next/navigation";

type ScrollRevealProviderProps = {
  selector?: string;
};

function parseBool(value: string | undefined, defaultValue: boolean) {
  if (value == null) return defaultValue;
  return value === "true";
}

function parseNumber(value: string | undefined, defaultValue: number) {
  if (value == null) return defaultValue;
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
}

export default function ScrollRevealProvider({
  selector = "[data-anim]",
}: ScrollRevealProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    const explicitElements = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    const autoEnabled = document.body.dataset.animAuto === "true";
    const main = document.querySelector("main");
    const mainAutoDisabled = main?.getAttribute("data-anim-auto") === "false";

    const autoElements =
      autoEnabled && !mainAutoDisabled
        ? Array.from(
            document.querySelectorAll<HTMLElement>(
              [
                "main section",
                "main article",
                "main figure",
              ].join(","),
            ),
          )
        : [];

    const elements = Array.from(
      new Set<HTMLElement>([...explicitElements, ...autoElements]),
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const repeat = parseBool(el.dataset.animRepeat, true);

          if (entry.isIntersecting) {
            el.classList.add("is-in");

            if (!repeat) {
              observer.unobserve(el);
            }

            continue;
          }

          if (repeat) {
            el.classList.remove("is-in");
          }
        }
      },
      {
        root: null,
        threshold: 0.01,
        rootMargin: "12% 0px 18% 0px",
      },
    );

    for (const el of elements) {
      if (el.hasAttribute("data-anim-ignore")) continue;
      if (el.classList.contains("anim")) continue;

      const idx = autoEnabled ? getAutoIndex(el) : 0;
      const chosenAnim = (
        el.dataset.anim?.trim() ||
        (autoEnabled ? getAutoAnimName(el, idx) : "fade-up")
      ).toLowerCase();

      el.classList.add("anim", `anim--${chosenAnim}`);

      const delayBase =
        el.dataset.animDelay == null
          ? autoEnabled
            ? getAutoDelayMs(el)
            : 0
          : parseNumber(el.dataset.animDelay, 0);

      const durationDefault = autoEnabled ? getAutoDurationMs(el) : 650;
      const durationMs = parseNumber(el.dataset.animDuration, durationDefault);

      if (autoEnabled) {
        const variant = getVariantFromIndex(idx);
        el.style.setProperty("--anim-x", variant.x);
        el.style.setProperty("--anim-y", variant.y);
        el.style.setProperty("--anim-rot", variant.rot);
      }

      el.style.setProperty("--anim-delay", `${delayBase}ms`);
      el.style.setProperty("--anim-duration", `${durationMs}ms`);

      if (el.dataset.animEase) {
        el.style.setProperty("--anim-ease", el.dataset.animEase);
      }

      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname, selector]);

  return null;
}

function getAutoAnimName(el: HTMLElement, idx: number) {
  const tag = el.tagName.toLowerCase();

  if (tag === "img" || tag === "figure") {
    return idx % 2 === 0 ? "ken-burns" : "zoom-in";
  }

  if (tag.startsWith("h")) {
    return idx % 3 === 0 ? "wipe-up" : idx % 3 === 1 ? "glow-rise" : "elastic-up";
  }

  if (tag === "li") return idx % 2 === 0 ? "fade-left" : "skew-in";

  if (tag === "section" || tag === "article") {
    return idx % 2 === 0 ? "float-in" : "fade-up";
  }

  return idx % 4 === 0 ? "pop-in" : "fade-in";
}

function getAutoDelayMs(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent) return 0;

  const siblings = Array.from(
    parent.querySelectorAll<HTMLElement>(
      ":scope > section, :scope > article, :scope > figure, :scope > [data-anim], :scope > .anim",
    ),
  );

  const idx = siblings.indexOf(el);
  if (idx < 0) return 0;

  return Math.min(600, idx * 110);
}

function getAutoDurationMs(el: HTMLElement) {
  const tag = el.tagName.toLowerCase();
  if (tag === "img" || tag === "figure") return 1200;
  if (tag.startsWith("h")) return 980;
  return 900;
}

function getAutoIndex(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent) return 0;

  const siblings = Array.from(
    parent.querySelectorAll<HTMLElement>(
      ":scope > section, :scope > article, :scope > figure, :scope > [data-anim], :scope > .anim",
    ),
  );

  const idx = siblings.indexOf(el);
  return idx < 0 ? 0 : idx;
}

function getVariantFromIndex(idx: number) {
  const variants = [
    { x: "10px", y: "6px", rot: "-1.6deg" },
    { x: "-8px", y: "10px", rot: "1.3deg" },
    { x: "12px", y: "-6px", rot: "-1deg" },
    { x: "-10px", y: "-8px", rot: "1.8deg" },
  ];

  return variants[idx % variants.length];
}
