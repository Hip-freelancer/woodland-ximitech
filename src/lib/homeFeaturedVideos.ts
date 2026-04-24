import type { Locale } from "@/types";

export interface HomeFeaturedVideo {
  _id: string;
  href: string;
  title: string;
  videoUrl: string;
}

const HOME_FEATURED_VIDEOS: Record<Locale, HomeFeaturedVideo[]> = {
  vi: [
    {
      _id: "video-1",
      title: "WOODLAND PROFILE",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-5-1756113789-1776991728254-7bcae808.mp4",
    },
    {
      _id: "video-2",
      title: "PLYWOOD FULL BIRCH",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1753758982-1776991730670-330e3e54.mp4",
    },
    {
      _id: "video-3",
      title: "Cao Su Ghép Quy Cách",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-2-1754043266-1776991732435-8f057eba.mp4",
    },
    {
      _id: "video-4",
      title: "Hình Ảnh Nhà Máy Ghép Cao Su",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1-1754042973-1776991734171-28704fca.mp4",
    },
  ],
  en: [
    {
      _id: "video-1",
      title: "WOODLAND PROFILE",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-5-1756113789-1776991728254-7bcae808.mp4",
    },
    {
      _id: "video-2",
      title: "PLYWOOD FULL BIRCH",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1753758982-1776991730670-330e3e54.mp4",
    },
    {
      _id: "video-3",
      title: "Standard Rubberwood Panels",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-2-1754043266-1776991732435-8f057eba.mp4",
    },
    {
      _id: "video-4",
      title: "Rubberwood Jointing Factory Visuals",
      href: "/gallery",
      videoUrl:
        "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1-1754042973-1776991734171-28704fca.mp4",
    },
  ],
};

export function getHomeFeaturedVideos(locale: Locale) {
  return HOME_FEATURED_VIDEOS[locale];
}
