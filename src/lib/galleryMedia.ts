import type { Locale } from "@/types";

export interface GalleryMediaItem {
  _id: string;
  category: string;
  description: string;
  mediaType: "image" | "video";
  posterImage?: string;
  src: string;
  title: string;
}

const sharedVideos = [
  {
    _id: "video-1",
    mediaType: "video" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-5-1756113789-1776991728254-7bcae808.mp4",
  },
  {
    _id: "video-2",
    mediaType: "video" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1753758982-1776991730670-330e3e54.mp4",
  },
  {
    _id: "video-3",
    mediaType: "video" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-2-1754043266-1776991732435-8f057eba.mp4",
  },
  {
    _id: "video-4",
    mediaType: "video" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-featured-videos/thiet-ke-chua-co-ten-1-1754042973-1776991734171-28704fca.mp4",
  },
];

const sharedImages = [
  {
    _id: "image-1",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/home-hero-seed/558244530-122155559126625053-6958421341796759826-n-1776988673733-a64a87be.jpg",
  },
  {
    _id: "image-2",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883554356606-4fb0ede1f2a7bc28155c0740878990c1-1776990909858-55d44038.jpg",
  },
  {
    _id: "image-3",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553537093-a2cfcc8f14d0d08763206220ab8eb182-1776990911296-9f7f4568.jpg",
  },
  {
    _id: "image-4",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553031437-24d20b340019500ce8a23dc7b0c1696b-1776990911647-56cdc735.jpg",
  },
  {
    _id: "image-5",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/w2-1752936398-1776990912075-1f7367cf.png",
  },
  {
    _id: "image-6",
    mediaType: "image" as const,
    src: "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6917722294521-ed9ce7375865466db016067c8744cc72-1776990912969-1f7a9e0a.jpg",
  },
];

const galleryMediaByLocale: Record<Locale, GalleryMediaItem[]> = {
  vi: [
    {
      ...sharedVideos[0],
      category: "Video profile",
      description: "Video giới thiệu nhanh về năng lực thương hiệu, kho xưởng và cách WOODLAND vận hành thực tế.",
      title: "WOODLAND PROFILE",
    },
    {
      ...sharedVideos[1],
      category: "Video sản phẩm",
      description: "Video trưng bày và đóng hàng dòng plywood full birch cho nhu cầu nội thất và sản xuất.",
      title: "PLYWOOD FULL BIRCH",
    },
    {
      ...sharedVideos[2],
      category: "Video nhà máy",
      description: "Video quy cách tấm cao su ghép và bề mặt hoàn thiện trong quá trình gia công thực tế.",
      title: "Cao Su Ghép Quy Cách",
    },
    {
      ...sharedVideos[3],
      category: "Video vận hành",
      description: "Video thực tế từ khu vực nhà máy ghép cao su và các công đoạn xử lý, hoàn thiện vật liệu.",
      title: "Hình Ảnh Nhà Máy Ghép Cao Su",
    },
    {
      ...sharedImages[0],
      category: "Hình ảnh thương hiệu",
      description: "Hình ảnh tổng quan thương hiệu WOODLAND với bố cục chủ đạo đang dùng cho trang giới thiệu tổng quan.",
      title: "Tổng Quan Thương Hiệu",
    },
    {
      ...sharedImages[1],
      category: "Hình ảnh kho xưởng",
      description: "Không gian vận hành và lưu trữ vật liệu tại WOODLAND, phản ánh quy mô và năng lực xử lý đơn hàng.",
      title: "Kho Xưởng Woodland",
    },
    {
      ...sharedImages[2],
      category: "Hình ảnh chất lượng",
      description: "Hình ảnh phục vụ nội dung chất lượng đảm bảo và kiểm soát sản phẩm trước khi giao đến khách hàng.",
      title: "Chất Lượng Đảm Bảo",
    },
    {
      ...sharedImages[3],
      category: "Hình ảnh sản phẩm",
      description: "Hình ảnh đại diện cho danh mục sản phẩm chủ lực từ plywood, gỗ ghép đến vật liệu hoàn thiện.",
      title: "Danh Mục Sản Phẩm Chủ Lực",
    },
    {
      ...sharedImages[4],
      category: "Hình ảnh hạ tầng",
      description: "Hình ảnh hệ thống cơ sở hạ tầng, kho bãi và mặt bằng phục vụ hoạt động giao nhận và bảo quản hàng hóa.",
      title: "Hệ Thống Cơ Sở Hạ Tầng",
    },
    {
      ...sharedImages[5],
      category: "Hình ảnh đội ngũ",
      description: "Hình ảnh đội ngũ nhân sự và môi trường làm việc thể hiện tính chủ động và hỗ trợ thực tế của WOODLAND.",
      title: "Đội Ngũ Woodland",
    },
  ],
  en: [
    {
      ...sharedVideos[0],
      category: "Profile video",
      description: "A quick brand and operations overview covering Woodland's warehouse setup and overall company profile.",
      title: "WOODLAND PROFILE",
    },
    {
      ...sharedVideos[1],
      category: "Product video",
      description: "A product-focused video showing the full birch plywood line and its delivery-ready presentation.",
      title: "PLYWOOD FULL BIRCH",
    },
    {
      ...sharedVideos[2],
      category: "Factory video",
      description: "A video focused on standard rubberwood panel sizing and surface finishing in real production flow.",
      title: "Standard Rubberwood Panels",
    },
    {
      ...sharedVideos[3],
      category: "Operations video",
      description: "Factory-floor footage from Woodland's rubberwood jointing process and day-to-day production work.",
      title: "Rubberwood Jointing Factory Visuals",
    },
    {
      ...sharedImages[0],
      category: "Brand visual",
      description: "A general Woodland brand visual currently used to support the overview-oriented about experience.",
      title: "Brand Overview",
    },
    {
      ...sharedImages[1],
      category: "Warehouse visual",
      description: "A warehouse and production-floor image representing handling capacity and day-to-day operations.",
      title: "Woodland Warehouse",
    },
    {
      ...sharedImages[2],
      category: "Quality visual",
      description: "A supporting visual for Woodland's quality assurance and controlled product delivery workflow.",
      title: "Quality Assurance",
    },
    {
      ...sharedImages[3],
      category: "Product visual",
      description: "A representative image for Woodland's core material portfolio across plywood and finished panels.",
      title: "Main Product Portfolio",
    },
    {
      ...sharedImages[4],
      category: "Infrastructure visual",
      description: "An infrastructure image reflecting storage, warehousing and the physical setup behind fulfillment.",
      title: "Infrastructure System",
    },
    {
      ...sharedImages[5],
      category: "Team visual",
      description: "A people-focused visual representing Woodland's operational team and service support environment.",
      title: "Woodland Team",
    },
  ],
};

export function getGalleryMedia(locale: Locale) {
  return galleryMediaByLocale[locale];
}
