"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductDetailGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductDetailGallery({
  images,
  productName,
}: ProductDetailGalleryProps) {
  const gallery = images.length > 0 ? images : [];
  const [selectedImage, setSelectedImage] = useState(gallery[0] ?? "");
  const [animationKey, setAnimationKey] = useState(0);

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden border border-outline-variant/30 bg-surface-container-low p-3">
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <div
            key={`${selectedImage}-${animationKey}`}
            className="absolute inset-0 animate-[anim-fade-in_450ms_cubic-bezier(0.2,0.8,0.2,1)_both]"
          >
            <Image
              alt={productName}
              className="object-cover"
              fill
              priority
              src={selectedImage}
            />
          </div>
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 sm:gap-3">
          {gallery.map((image, index) => {
            const isActive = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                className={`overflow-hidden border bg-surface-container-low p-1.5 transition-all duration-200 ${
                  isActive
                    ? "border-primary/40 shadow-[0_14px_26px_rgba(18,55,31,0.12)]"
                    : "border-outline-variant/30 hover:border-primary/30"
                }`}
                onClick={() => {
                  setSelectedImage(image);
                  setAnimationKey((current) => current + 1);
                }}
                type="button"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    alt={`${productName} ${index + 1}`}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    fill
                    src={image}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
