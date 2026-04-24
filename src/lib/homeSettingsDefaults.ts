import type { HomeSettings } from "@/types";

export const DEFAULT_HOME_SETTINGS: Omit<HomeSettings, "_id" | "createdAt" | "updatedAt"> =
  {
    contactEmail: "lienphuonghl@yahoo.com",
    contactPhone: "(+84) 0908 759 007",
    heroSlides: [
      {
        alt: {
          en: "Woodland hero background",
          vi: "Hinh nen hero Woodland",
        },
        isVisible: true,
        mediaType: "image",
        mediaUrl:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg",
        order: 0,
        posterUrl: "",
      },
    ],
    heroStats: [
      {
        isVisible: true,
        label: { en: "Annual Supply Capacity", vi: "Năng lực cung ứng mỗi năm" },
        order: 0,
        value: { en: "500,000m³+", vi: "500,000m³+" },
      },
      {
        isVisible: true,
        label: { en: "Warehouse Area", vi: "Diện tích kho xưởng" },
        order: 1,
        value: { en: "10,000m²", vi: "10,000m²" },
      },
      {
        isVisible: true,
        label: { en: "Logistics Fleet", vi: "Phương tiện logistics" },
        order: 2,
        value: { en: "5 Trucks / 3 Forklifts", vi: "5 xe tải / 3 xe nâng" },
      },
      {
        isVisible: true,
        label: { en: "Team Members", vi: "Nhân sự đồng hành" },
        order: 3,
        value: { en: "50+", vi: "50+" },
      },
    ],
  };
