"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCountTextProps {
  className?: string;
  duration?: number;
  value: string;
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

export default function AnimatedCountText({
  className,
  duration = 1600,
  value,
}: AnimatedCountTextProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatAnimatedValue(value, 0)
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
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [duration, hasAnimated, value]);

  return (
    <p ref={rootRef} className={className}>
      {displayValue}
    </p>
  );
}
