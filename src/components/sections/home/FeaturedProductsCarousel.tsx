"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface FeaturedProductsCarouselProps {
  products: Product[];
}

const ITEMS_PER_SLIDE = 3;
const AUTOPLAY_DELAY = 5000;

function chunkProducts(products: Product[], size: number) {
  const chunks: Product[][] = [];

  for (let index = 0; index < products.length; index += size) {
    chunks.push(products.slice(index, index + size));
  }

  return chunks;
}

export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const slides = chunkProducts(products, ITEMS_PER_SLIDE);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const updateHeight = () => {
      const nextHeight = slideRefs.current.reduce((maxHeight, slide) => {
        if (!slide) {
          return maxHeight;
        }

        return Math.max(maxHeight, slide.offsetHeight);
      }, 0);

      if (nextHeight > 0) {
        setContainerHeight(nextHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    slideRefs.current.forEach((slide) => {
      if (slide) {
        resizeObserver.observe(slide);
      }
    });

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [slides]);

  if (slides.length <= 1) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={containerHeight ? { height: `${containerHeight}px` } : undefined}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const shouldReserveLayout = isActive && containerHeight === null;

          return (
            <div
              key={`featured-products-slide-${index}`}
              aria-hidden={!isActive}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              className={`transition-all duration-700 ${
                isActive
                  ? shouldReserveLayout
                    ? "relative translate-y-0 opacity-100"
                    : "absolute inset-0 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 translate-y-4 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {slide.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {slides.map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`featured-products-dot-${index}`}
              type="button"
              aria-label={`Go to featured products slide ${index + 1}`}
              aria-pressed={isActive}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-10 bg-primary"
                  : "w-2.5 bg-outline-variant hover:bg-primary/60"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
