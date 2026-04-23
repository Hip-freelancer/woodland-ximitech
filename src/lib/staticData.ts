import type { Locale, Product, Project, NewsArticle, TeamMember } from "@/types";

export const FEATURED_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "Plywood Melamine nhập khẩu",
    series: "Plywood Melamine",
    slug: "plywood-melamine-nhap-khau-p2",
    description:
      "<p>Dòng plywood phủ melamine cao cấp phù hợp cho nội thất hiện đại, dễ vệ sinh và có tính thẩm mỹ cao.</p><p>Sản phẩm phù hợp cho tủ, kệ, hệ vách và nhiều ứng dụng cần bề mặt hoàn thiện đồng đều.</p>",
    grade: "CARB P2",
    category: "Plywood Melamine",
    thickness: [12, 18, 24],
    material: "Plywood phủ Melamine",
    bonding: "CARB P2",
    dimensions: ["1220×2440mm", "1525×3050mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS_-cCku_CTugd29Q4FXxJrE57ECOuRBDLSjrygWILiJB85-T88MDbUPrdnldSkFxaAEIBzOl0kKUr4qKJ16CWjTDHzCjAd0nAgi-SCK_YT3WJ1kbYmMgvQn7m5yj1dhmZXa8xoEoAQC1UhGY2FPqFqJQmDh5RAvf9CqjsZE6lX-qV7APdZRWIlN-pRpZNck1jIwUXiXN9YFHtABz7b9GmddyoHN5yA3IDHDdGsAQcHyZWS177ESPWCkeKbIvcELF_i_zWxq2JFvMi",
    galleryImages: [],
    certifications: ["FSC", "PEFC"],
    availability: "In Stock",
    specifications: [
      { attribute: "Cốt ván", specification: "Plywood phủ melamine", tolerance: "—", standard: "Ref." },
      { attribute: "Tiêu chuẩn keo", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Kích thước", specification: "1220×2440mm, 1525×3050mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Độ dày", specification: "12mm, 18mm, 24mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
    applications: [],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "2",
    name: "Plywood Marine tiêu chuẩn Carb P2",
    series: "Plywood Marine",
    slug: "plywood-marine-tieu-chuan-carb-p2",
    description:
      "<p>Ván ép chống nước chuyên dụng cho môi trường ẩm ướt và các ứng dụng yêu cầu độ bền cao.</p><p>Phù hợp cho các hạng mục cần vật liệu ổn định hơn khi gặp nước và điều kiện sử dụng khắt khe.</p>",
    grade: "Marine",
    category: "Plywood Nhập Khẩu",
    thickness: [9, 12, 15, 18],
    material: "Marine Plywood",
    bonding: "CARB P2",
    dimensions: ["1220×2440mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDM7i8QoD7tKWOrufhBjrVQqaYwGcA5IypeE3-mdzqPlMbsL80brsMPFSJL8VV6qD3MYk7FI563i7MseubLk9udY3x0Jn1xnWfIsFzA2mJy0ECkc-7aRbY1KJAufUcQ-QyCkqt_Mn-d-5Mvl7PkUraH2UHInU_IHsKmZFkLhmyM7-r297RLWITKNKM4qk4k1UiZC9b-VohVRmFz1d8cNfjK81DxGECgHB9sV2KBO2sZmDySHSBCQTVqqfICw9wiw94mZ9GzYEWLjxWQ",
    galleryImages: [],
    certifications: ["BS 1088", "FSC"],
    availability: "In Stock",
    specifications: [
      { attribute: "Dòng sản phẩm", specification: "Marine plywood", tolerance: "—", standard: "Ref." },
      { attribute: "Tiêu chuẩn keo", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Kích thước", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Độ dày", specification: "9mm, 12mm, 15mm, 18mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
    applications: [],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "3",
    name: "Plywood Poplar 100% Carb P2",
    series: "Plywood Việt Nam",
    slug: "van-go-plywood-poplar",
    description:
      "<p>Plywood Poplar đáp ứng tốt cho sản xuất đồ trang trí, nội thất nhẹ và các ứng dụng yêu cầu bề mặt ổn định.</p><p>Dòng sản phẩm này thường được lựa chọn cho các hạng mục cần tối ưu trọng lượng và dễ gia công.</p>",
    grade: "CARB P2",
    category: "Plywood Việt Nam",
    thickness: [18, 21],
    material: "Poplar",
    bonding: "CARB P2",
    dimensions: ["1220×2440mm", "1250×2500mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCl7YZ8FYIXQg-oN-R0I-1ENMUHwtGA8YAqHpsln4NwoDjwCIC8JWL_kcJpoq9SmdsICBKo0L-mvWqxlG65zcY4LDFJm6al4d_f_4G28VVHwgcp_ksOhLicuTIfPquq-oKjgxUAt4NARZtFHJgnxbnfz6Uw8Yu0l63NE6aXe9D7YiNbIu7Ezwm32ZwnSNZrTlURit_Kx6FnPlzBYjC-XXit24ibK5oJoB1GydGDqmh-BAPNSFylRSTF1ERnncMmoGvEyVsNX4RSm9Zx",
    galleryImages: [],
    certifications: ["ISO-14001", "FSC"],
    availability: "In Stock",
    specifications: [
      { attribute: "Cốt gỗ", specification: "Poplar 100%", tolerance: "—", standard: "Ref." },
      { attribute: "Tiêu chuẩn keo", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Kích thước", specification: "1220×2440mm, 1250×2500mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Độ dày", specification: "18mm, 21mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
    applications: [],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "4",
    name: "Plywood Full Birch Nhập Khẩu",
    series: "Plywood Nhập Khẩu",
    slug: "van-go-plywood-full-birch",
    description:
      "<p>Full Birch phù hợp cho nội thất cao cấp và các sản phẩm đòi hỏi độ cứng, độ ổn định và bề mặt đẹp.</p><p>Đây là lựa chọn phù hợp cho các ứng dụng ưu tiên thẩm mỹ hoàn thiện và độ chắc chắn.</p>",
    grade: "Full Birch",
    category: "Plywood Nhập Khẩu",
    thickness: [12, 18],
    material: "Full Birch",
    bonding: "Import Standard",
    dimensions: ["1220×2440mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAscm9XraAQLEfVa9VUAwtvNpFYsVlf89oG1XphH-iUV_wZw_RRlPIbZ5WjU46dIa3jUiWmQwaCcm9D4P39BJBM6H5bp5xH_feUsw10q0PZz47fJV8FcER-bUbYReMWM-OQ2bhsah3S1rMmo5Bu9VdDELM0Ju1SApX0KbYSFKddoKCYD7usUvooAtGS-B5zR7u-5RCuhESNv0AIegKCDJNv8j-wJiC4GwzmxUAffR8S_F6ZWVIfIOz8vYL2ftchLCSmXhzCKYJbswuT",
    galleryImages: [],
    certifications: ["Import", "Quality Controlled"],
    availability: "In Stock",
    specifications: [
      { attribute: "Cốt gỗ", specification: "Full Birch", tolerance: "—", standard: "Ref." },
      { attribute: "Liên kết", specification: "Import Standard", tolerance: "—", standard: "Ref." },
      { attribute: "Kích thước", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Độ dày", specification: "12mm, 18mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
    applications: [],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "5",
    name: "Plywood Polownia Flexible (Gỗ Hong) Uốn Cong Linh Hoạt",
    series: "Flexible Plywood",
    slug: "plywood-polownia-flexible-go-hong-uon-cong-linh-hoat",
    description:
      "<p>Dòng plywood uốn cong linh hoạt, phù hợp cho các chi tiết bo cong và thiết kế nội thất sáng tạo.</p><p>Sản phẩm thường được dùng cho các bề mặt cong, chi tiết bo mềm và các ý tưởng thiết kế cần độ linh hoạt cao.</p>",
    grade: "Flexible",
    category: "Plywood Việt Nam",
    thickness: [5, 8, 12],
    material: "Polownia",
    bonding: "Flexible Core",
    dimensions: ["1220×2440mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWiHOBLmTASfz1I_dkMNi6tnfRoErm6VaIkMeqJ9D0ynu89oIhDbew5OMtkPRek5dL8lWdw9P3szRFhOGzIGlORojTu3IxNDcDhpECguEA_Xfwgzt-Hh7wony4dEGANpYFYYIsbFWS5dDzcRiDckkE0dDi6dmvbsVcC1Zc1dA2rwa9_adQJ-pTjkRiCTej1B8evjNzwMT_T2PTCLpr_9wnG8829d1bH-WJQbxu1y-Ec-FV2EAEBdeVnm27PGgcQs33Efl6netCWtVW",
    galleryImages: [],
    certifications: ["Flexible", "Interior"],
    availability: "In Stock",
    specifications: [
      { attribute: "Cốt gỗ", specification: "Polownia flexible core", tolerance: "—", standard: "Ref." },
      { attribute: "Tính năng", specification: "Uốn cong linh hoạt", tolerance: "—", standard: "Ref." },
      { attribute: "Kích thước", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Độ dày", specification: "5mm, 8mm, 12mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
    applications: [],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export const ALL_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS,
  {
    _id: "6",
    name: "Plywood Phủ Veneer Walnut",
    series: "Plywood Phủ Veneer",
    slug: "plywood-phu-veneer-walnut",
    description: "Plywood phủ veneer walnut mang lại bề mặt sang trọng cho nội thất cao cấp.",
    grade: "Veneer Walnut",
    category: "Plywood Phủ Veneer",
    thickness: [24],
    material: "Walnut Veneer",
    bonding: "Interior",
    dimensions: ["1525×3050mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAscm9XraAQLEfVa9VUAwtvNpFYsVlf89oG1XphH-iUV_wZw_RRlPIbZ5WjU46dIa3jUiWmQwaCcm9D4P39BJBM6H5bp5xH_feUsw10q0PZz47fJV8FcER-bUbYReMWM-OQ2bhsah3S1rMmo5Bu9VdDELM0Ju1SApX0KbYSFKddoKCYD7usUvooAtGS-B5zR7u-5RCuhESNv0AIegKCDJNv8j-wJiC4GwzmxUAffR8S_F6ZWVIfIOz8vYL2ftchLCSmXhzCKYJbswuT",
    galleryImages: [],
    certifications: ["FSC"],
    availability: "In Stock",
    specifications: [],
    applications: [],
    featured: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "7",
    name: "Gỗ Cao Su Ghép Finger",
    series: "Gỗ Cao Su Ghép",
    slug: "go-cao-su-ghep-finger",
    description: "Gỗ cao su ghép finger phù hợp cho nội thất và các ứng dụng thân thiện môi trường.",
    grade: "Finger Joint",
    category: "Gỗ Cao Su Ghép Finger",
    thickness: [12],
    material: "Rubberwood",
    bonding: "Finger Joint",
    dimensions: ["1220×2440mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAa1Sl6Jkqh3jvel4xhyGVhtdr5RTriPfPnjEoRnVyhJlf6akMlatSzjVmnjWpcXSTK2hqQ3I1uVmmoOMjgyy8N66Jc68DN_t1K7xAkTg52OzHs5PSfyWtxc5fqoVnnnp4STGZAdXcTfDL2iha_GDq4ayJ4I0OA950voyzotUIhrz8Bveo4Ut_vIVkIAodNFvqZCPfW4seMpkX5QcO7SfaFr86Gl589athJdpknCKvfK_x5ST1mzVbTRPERiMV79-Jfs7G0qVWrhZU",
    galleryImages: [],
    certifications: ["PEFC"],
    availability: "In Stock",
    specifications: [],
    applications: [],
    featured: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    _id: "8",
    name: "Ván MDF",
    series: "MDF",
    slug: "van-mdf",
    description:
      "MDF bề mặt mịn, dễ gia công, phù hợp cho nhiều nhu cầu nội thất và trang trí.",
    grade: "MDF",
    category: "Ván MDF",
    thickness: [21],
    material: "MDF",
    bonding: "Interior",
    dimensions: ["1220×2440mm"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWiHOBLmTASfz1I_dkMNi6tnfRoErm6VaIkMeqJ9D0ynu89oIhDbew5OMtkPRek5dL8lWdw9P3szRFhOGzIGlORojTu3IxNDcDhpECguEA_Xfwgzt-Hh7wony4dEGANpYFYYIsbFWS5dDzcRiDckkE0dDi6dmvbsVcC1Zc1dA2rwa9_adQJ-pTjkRiCTej1B8evjNzwMT_T2PTCLpr_9wnG8829d1bH-WJQbxu1y-Ec-FV2EAEBdeVnm27PGgcQs33Efl6netCWtVW",
    galleryImages: [],
    certifications: ["ISO-14001"],
    availability: "In Stock",
    specifications: [],
    applications: [],
    featured: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export const PROJECTS: Project[] = [
  {
    _id: "1",
    title: "WOODLAND PROFILE",
    description: "Hồ sơ năng lực và hình ảnh thương hiệu từ web cũ.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-XGKrwtgZlDj2laoH2DsjfoXq3XNqZTLcGBvALocxLxmoNmBwz4ee3XkYOq8Wy854wWOdMjsm8TJvZhHNpUp4SoRznwV5kQwV6SAfUytP53EOZjJANxvnFv7jCpDwH6BYgowKgfbKABPgb6MIBoBr2imrvIydPVVfS_gF3ZRITc7-hXjyGg5EXiuDSRadtN_GSeUI87uVCdivb6XfSz2mpGFjxHNSd0BPZ8LWxznjEFJ6h_cYAMxk_BN1Jl6imbuqLoNkyTettEJ",
    category: "Profile",
    location: "Woodland",
    year: 2026,
    featured: true,
    createdAt: "2024-01-01",
  },
  {
    _id: "2",
    title: "PLYWOOD FULL BIRCH",
    description: "Hình ảnh ứng dụng và trưng bày dòng Full Birch.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBX_A_FkU1yiAYYPdpxLINnFEPmPwNi63SHjtJg3ss6P3RpsS4IgfCcWyuZu7P3lsu9sfZGNp0xZeIQIAzf_F_1iPbXVTG6tHqpfYVm9paP35hrG3YBr3O-uWV9sY2auEw52DRqldixhIPkhlD5uY0vkt4t5zDJEW9lZDvKpdq5X2L0hQShx6OtxuDAchV85xB-idssSkbj-HLkZEkyqN16uVhzLWgBMRLS-coI4LMQ_5yL9dztIGFhHdAFen5kgMmnqaF0rHlnEG8n",
    category: "Product Gallery",
    location: "Woodland",
    year: 2026,
    featured: true,
    createdAt: "2024-01-01",
  },
  {
    _id: "3",
    title: "Hình Ảnh Nhà Máy Ghép Cao Su",
    description: "Kho xưởng, vận hành và dây chuyền gia công tại Woodland.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr",
    category: "Factory Gallery",
    location: "Bình Dương",
    year: 2026,
    featured: true,
    createdAt: "2024-01-01",
  },
];

export const GALLERY_ITEMS: Project[] = [
  ...PROJECTS,
  {
    _id: "4",
    title: "Plywood Melamine",
    description: "Hình ảnh bề mặt, màu sắc và ứng dụng thực tế của dòng plywood melamine.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrePdByVR1rY-wxi1XXaLVYeWphWFqoxJIUugWshNOcD741FXxs_Tz_-FVRB3QxXWgmblRYIIct8Vi0p-hmC6liQcEkMhkZ3k-iRbl_D9btYfdiFPlvIqOfHr9KjMnwsnyP9QRkN-SGZb6-94cXMEhYbXmK2oXetSSigCKhC9yCoSRrCWTacjx6MsDl9dI8YCMGJHPoki02GhmhNEVMitnmRraY9kY4Qgzb0ZqtL2UTWw7eRxYvwUr1QkW_1rTYhvBZmkpfnoK1J2a",
    category: "Product Gallery",
    location: "Woodland",
    year: 2026,
    featured: false,
    createdAt: "2024-01-01",
  },
  {
    _id: "5",
    title: "Kho Hàng Và Điều Phối",
    description: "Không gian lưu trữ và điều phối giúp Woodland chủ động giao hàng nhanh theo tiến độ.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-XGKrwtgZlDj2laoH2DsjfoXq3XNqZTLcGBvALocxLxmoNmBwz4ee3XkYOq8Wy854wWOdMjsm8TJvZhHNpUp4SoRznwV5kQwV6SAfUytP53EOZjJANxvnFv7jCpDwH6BYgowKgfbKABPgb6MIBoBr2imrvIydPVVfS_gF3ZRITc7-hXjyGg5EXiuDSRadtN_GSeUI87uVCdivb6XfSz2mpGFjxHNSd0BPZ8LWxznjEFJ6h_cYAMxk_BN1Jl6imbuqLoNkyTettEJ",
    category: "Warehouse",
    location: "Bình Dương",
    year: 2026,
    featured: false,
    createdAt: "2024-01-01",
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    _id: "1",
    title: "Woodland và sứ mệnh dành cho Gỗ",
    content:
      "<h2>Khái niệm về gỗ không chỉ là vật liệu</h2><p>Gỗ không đơn thuần là nguyên liệu cho thi công và sản xuất. Với nhiều người, gỗ gắn với cảm giác ấm áp, bền vững và có chiều sâu thẩm mỹ trong không gian sống.</p><h2>Giá trị mà gỗ mang lại</h2><p>Từ nội thất dân dụng đến sản xuất xuất khẩu, gỗ luôn là vật liệu tạo ra cảm giác tin cậy, gần gũi và linh hoạt. Vì vậy việc chọn đúng chủng loại gỗ công nghiệp phù hợp đóng vai trò rất quan trọng với hiệu quả sử dụng và chi phí đầu tư.</p><h2>Woodland và sứ mệnh dành cho gỗ</h2><p>WOODLAND theo đuổi định hướng cung cấp các giải pháp gỗ công nghiệp chất lượng cao, từ plywood, gỗ ghép đến MDF, để khách hàng có thêm lựa chọn ổn định cho nội thất, xây dựng và sản xuất. Mục tiêu của Woodland là đưa vật liệu phù hợp đến đúng nhu cầu, đúng tiêu chuẩn và đúng tiến độ.</p>",
    excerpt:
      "Khám phá lý do con người luôn tìm về gỗ và sứ mệnh của Woodland trong việc cung cấp vật liệu gỗ chất lượng cao cho không gian sống hiện đại.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUDYgbU7TCCCFJehhLd9OR-JeuFU3Qy4UX9HrCLfJ3Om3Qu3dy4FKxD12oliP82Y-2Pp-0JfoldrkfKKjHzvIIi3lhpMALPlHkNkfc9UYolceIso2DdC6a63d62e3pwqWLWbX2D4L6Gsmi46JL7u3GAET2y-3BPXtST3PyJ-Yrg_6Ee4FgoBQmKFw8dR_oG_OmVZD0IqLd_Lr81s2rI_LdfBNkxgUDkAzoucQ_Zcb5eqd1T1I3fFIW_GYVTcz07qw3Sg-Kd_ewyQ_O",
    author: "Woodland",
    publishDate: "2026-01-26",
    slug: "woodland-va-su-menh-danh-cho-go",
    category: "company",
    categoryLabel: "Thương hiệu Woodland",
    tags: ["woodland", "go-cong-nghiep", "thuong-hieu"],
    createdAt: "2026-01-26",
  },
  {
    _id: "2",
    title: "Marine Plywood: Hướng Dẫn Toàn Diện Cho Người Tiêu Dùng Việt Nam",
    content:
      "<h2>Marine Plywood là gì?</h2><p>Marine Plywood là loại ván ép nhiều lớp được sản xuất từ gỗ cứng và keo chịu nước, hướng đến môi trường ẩm ướt hoặc yêu cầu độ bền cao. So với ván ép thông thường, dòng marine có khả năng chống tách lớp và ổn định tốt hơn khi gặp nước.</p><h2>Các tiêu chuẩn được quan tâm</h2><p>Khi chọn Marine Plywood, người mua thường quan tâm tới chất lượng lõi, loại keo liên kết, độ ổn định bề mặt và tiêu chuẩn áp dụng. Đây là những yếu tố ảnh hưởng trực tiếp đến độ bền của công trình.</p><h2>Ứng dụng phổ biến</h2><p>Marine Plywood phù hợp cho tủ bếp, khu vực ẩm, đồ nội thất cần độ bền cao, hạng mục ven biển và nhiều ứng dụng cần vật liệu chịu ẩm tốt hơn plywood phổ thông.</p>",
    excerpt:
      "Tổng hợp kiến thức cần biết về marine plywood, tiêu chuẩn sử dụng, đặc điểm vật liệu và các lưu ý khi lựa chọn.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeA6vuIfSZh8XEl4eRZkhqoa5fCGDhJEiV_PJJBVTRKZCRwnulEtuun89xHeFFXWC2PV5xg8oqPHHSTI1v1SCn-q3zR7S4y8PGZG0bPmpdRrHVP4tGZrCYAwEFP1NE1YBeLZJ88KQ7yvfcC2qP6V_hAG3pY73frCJbCmnFAbQfm8H1TEesxsW7QM8zUNOurovBMNXNkbFXcJ75lpVEqoPLKn_ePB_DCSWiOoMRtgAGCAdcWN6h5fVg34bA46C2If8ucNa6NKvRHF-M",
    author: "Woodland",
    publishDate: "2025-09-20",
    slug: "marine-plywood-huong-dan-toan-dien-cho-nguoi-tieu-dung-viet-nam",
    category: "industry",
    categoryLabel: "Tư vấn vật liệu",
    tags: ["marine-plywood", "huong-dan", "tu-van"],
    createdAt: "2025-09-20",
  },
  {
    _id: "3",
    title: "Plywood Melamine CARB P2 Nhập Khẩu – 13 Mã Màu Mới Nhất",
    content:
      "<h2>Cập nhật bảng màu melamine</h2><p>Plywood Melamine CARB P2 nhập khẩu tại Woodland được cập nhật nhiều mã màu mới để đáp ứng xu hướng nội thất hiện đại và nhu cầu đồng bộ bề mặt cho sản xuất.</p><h2>Vì sao dòng này được quan tâm?</h2><p>Bề mặt melamine dễ vệ sinh, chống trầy xước tốt và tạo cảm giác hoàn thiện đồng đều cho nhiều hạng mục nội thất. Khi kết hợp với cốt plywood ổn định, sản phẩm phù hợp với nhiều công trình đòi hỏi cả thẩm mỹ lẫn độ bền.</p><h2>Phù hợp cho ứng dụng nào?</h2><p>Dòng sản phẩm này phù hợp cho tủ bếp, tủ áo, hệ tủ âm tường, nội thất căn hộ, showroom và các hạng mục xuất khẩu cần vật liệu hoàn thiện ổn định.</p>",
    excerpt:
      "Cập nhật nhóm mã màu melamine mới, phù hợp cho xu hướng nội thất hiện đại và nhu cầu thẩm mỹ cao.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrePdByVR1rY-wxi1XXaLVYeWphWFqoxJIUugWshNOcD741FXxs_Tz_-FVRB3QxXWgmblRYIIct8Vi0p-hmC6liQcEkMhkZ3k-iRbl_D9btYfdiFPlvIqOfHr9KjMnwsnyP9QRkN-SGZb6-94cXMEhYbXmK2oXetSSigCKhC9yCoSRrCWTacjx6MsDl9dI8YCMGJHPoki02GhmhNEVMitnmRraY9kY4Qgzb0ZqtL2UTWw7eRxYvwUr1QkW_1rTYhvBZmkpfnoK1J2a",
    author: "Woodland",
    publishDate: "2025-08-04",
    slug: "plywood-melamine-carb-p2-nhap-khau-13-ma-mau-moi-nhat",
    category: "industry",
    categoryLabel: "Sản phẩm mới",
    tags: ["melamine", "carb-p2", "ma-mau"],
    createdAt: "2025-08-04",
  },
  {
    _id: "4",
    title: "Woodland và xu hướng “Xanh hoá vật liệu” cùng Plywood Melamine cao cấp",
    content:
      "<h2>Plywood Melamine Woodland và xu hướng vật liệu xanh</h2><p>Plywood Melamine Woodland được nhấn mạnh như một lựa chọn phù hợp với xu hướng xanh hoá vật liệu nhờ bề mặt hoàn thiện đẹp, độ bền cao và khả năng ứng dụng linh hoạt cho nhiều không gian nội thất hiện đại.</p><h2>Giá trị sử dụng lâu dài</h2><p>Khi lựa chọn vật liệu cho dự án, khách hàng không chỉ quan tâm tới thẩm mỹ mà còn chú trọng độ ổn định, khả năng vệ sinh và tác động lâu dài tới môi trường sử dụng. Dòng plywood melamine của Woodland hướng tới các tiêu chí đó.</p><h2>Lựa chọn cho tương lai</h2><p>Woodland định hướng cung cấp những dòng vật liệu vừa đáp ứng nhu cầu thi công thực tế, vừa phù hợp với xu hướng sử dụng vật liệu bền vững trong sản xuất và nội thất.</p>",
    excerpt:
      "Khám phá cách Woodland đưa plywood melamine cao cấp vào xu hướng xanh hoá vật liệu cho nội thất và sản xuất hiện đại.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrePdByVR1rY-wxi1XXaLVYeWphWFqoxJIUugWshNOcD741FXxs_Tz_-FVRB3QxXWgmblRYIIct8Vi0p-hmC6liQcEkMhkZ3k-iRbl_D9btYfdiFPlvIqOfHr9KjMnwsnyP9QRkN-SGZb6-94cXMEhYbXmK2oXetSSigCKhC9yCoSRrCWTacjx6MsDl9dI8YCMGJHPoki02GhmhNEVMitnmRraY9kY4Qgzb0ZqtL2UTWw7eRxYvwUr1QkW_1rTYhvBZmkpfnoK1J2a",
    author: "Woodland",
    publishDate: "2025-07-18",
    slug: "woodland-va-xu-huong-xanh-hoa-vat-lieu-cung-plywood-melamine-cao-cap",
    category: "sustainability",
    categoryLabel: "Xu hướng xanh",
    tags: ["xanh-hoa-vat-lieu", "plywood-melamine", "woodland"],
    createdAt: "2025-07-18",
  },
  {
    _id: "5",
    title: "Tiêu chuẩn Marine Plywood – Tất cả những gì bạn cần biết",
    content:
      "<h2>Marine Plywood là gì?</h2><p>Marine Plywood là ván ép nhiều lớp được sản xuất với keo chịu nước và cấu trúc lõi phù hợp cho môi trường ẩm, ven biển hoặc các ứng dụng đòi hỏi độ ổn định cao.</p><h2>Các tiêu chuẩn thường được quan tâm</h2><p>Người mua thường chú ý đến tiêu chuẩn keo, chất lượng lõi, khả năng chịu nước, độ bền cơ học và mức độ ổn định của bề mặt. Đây là các yếu tố quyết định tuổi thọ sử dụng thực tế.</p><h2>Lưu ý khi lựa chọn</h2><p>Chọn đúng Marine Plywood giúp giảm rủi ro tách lớp, cong vênh và chi phí bảo trì về sau, đặc biệt trong các hạng mục tủ bếp, khu vực ẩm và công trình cần độ bền lâu dài.</p>",
    excerpt:
      "Tổng hợp các tiêu chuẩn, yêu cầu kỹ thuật và lưu ý quan trọng khi lựa chọn marine plywood cho công trình.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeA6vuIfSZh8XEl4eRZkhqoa5fCGDhJEiV_PJJBVTRKZCRwnulEtuun89xHeFFXWC2PV5xg8oqPHHSTI1v1SCn-q3zR7S4y8PGZG0bPmpdRrHVP4tGZrCYAwEFP1NE1YBeLZJ88KQ7yvfcC2qP6V_hAG3pY73frCJbCmnFAbQfm8H1TEesxsW7QM8zUNOurovBMNXNkbFXcJ75lpVEqoPLKn_ePB_DCSWiOoMRtgAGCAdcWN6h5fVg34bA46C2If8ucNa6NKvRHF-M",
    author: "Woodland",
    publishDate: "2025-06-11",
    slug: "tieu-chuan-marine-plywood-tat-ca-nhung-gi-ban-can-biet",
    category: "industry",
    categoryLabel: "Tư vấn vật liệu",
    tags: ["marine-plywood", "tieu-chuan", "plywood-chiu-nuoc"],
    createdAt: "2025-06-11",
  },
  {
    _id: "6",
    title: "Ván Gỗ công nghiệp nào phù hợp cho tủ bếp? Plywood Melamine hay MDF Melamine?",
    content:
      "<h2>Tổng quan hai lựa chọn phổ biến</h2><p>Plywood Melamine và MDF Melamine đều được dùng rộng rãi cho tủ bếp nhờ bề mặt hoàn thiện đẹp và nhiều mã màu. Tuy nhiên, mỗi loại vật liệu có đặc điểm khác nhau về khả năng chịu ẩm, độ bền cơ học và mức độ phù hợp với từng ngân sách.</p><h2>Khi nào nên chọn Plywood Melamine?</h2><p>Plywood Melamine thường phù hợp hơn cho các hạng mục ưu tiên độ bền, khả năng bắt vít, độ ổn định và điều kiện sử dụng có độ ẩm cao hơn.</p><h2>Khi nào nên chọn MDF Melamine?</h2><p>MDF Melamine phù hợp khi cần bề mặt mịn, đồng đều và tối ưu chi phí cho các khu vực ít chịu tác động ẩm hoặc lực hơn.</p>",
    excerpt:
      "So sánh nhanh giữa plywood melamine và MDF melamine để chọn vật liệu phù hợp cho hệ tủ bếp và nội thất bếp.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUDYgbU7TCCCFJehhLd9OR-JeuFU3Qy4UX9HrCLfJ3Om3Qu3dy4FKxD12oliP82Y-2Pp-0JfoldrkfKKjHzvIIi3lhpMALPlHkNkfc9UYolceIso2DdC6a63d62e3pwqWLWbX2D4L6Gsmi46JL7u3GAET2y-3BPXtST3PyJ-Yrg_6Ee4FgoBQmKFw8dR_oG_OmVZD0IqLd_Lr81s2rI_LdfBNkxgUDkAzoucQ_Zcb5eqd1T1I3fFIW_GYVTcz07qw3Sg-Kd_ewyQ_O",
    author: "Woodland",
    publishDate: "2025-05-02",
    slug: "van-go-cong-nghiep-nao-phu-hop-cho-tu-bep-plywood-melamine-hay-mdf-melamine",
    category: "industry",
    categoryLabel: "Tư vấn vật liệu",
    tags: ["tu-bep", "plywood-melamine", "mdf-melamine"],
    createdAt: "2025-05-02",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    _id: "1",
    name: "Hotline Woodland",
    title: "Tư vấn sản phẩm, báo giá và hỗ trợ đơn hàng",
    region: "Bình Dương",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr",
    email: "lienphuonghl@yahoo.com",
    phone: "0908 759 007",
    whatsapp: "84908759007",
    zalo: "",
    order: 1,
  },
  {
    _id: "2",
    name: "Giao Nhận Woodland",
    title: "Hỗ trợ kho hàng và giao nhận",
    region: "Kho hàng",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-XGKrwtgZlDj2laoH2DsjfoXq3XNqZTLcGBvALocxLxmoNmBwz4ee3XkYOq8Wy854wWOdMjsm8TJvZhHNpUp4SoRznwV5kQwV6SAfUytP53EOZjJANxvnFv7jCpDwH6BYgowKgfbKABPgb6MIBoBr2imrvIydPVVfS_gF3ZRITc7-hXjyGg5EXiuDSRadtN_GSeUI87uVCdivb6XfSz2mpGFjxHNSd0BPZ8LWxznjEFJ6h_cYAMxk_BN1Jl6imbuqLoNkyTettEJ",
    email: "lienphuonghl@yahoo.com",
    phone: "0979 685 971",
    whatsapp: "",
    zalo: "0979685971",
    order: 2,
  },
  {
    _id: "3",
    name: "Woodland Online",
    title: "Kênh tiếp nhận yêu cầu trực tuyến và thông tin website",
    region: "Online",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBX_A_FkU1yiAYYPdpxLINnFEPmPwNi63SHjtJg3ss6P3RpsS4IgfCcWyuZu7P3lsu9sfZGNp0xZeIQIAzf_F_1iPbXVTG6tHqpfYVm9paP35hrG3YBr3O-uWV9sY2auEw52DRqldixhIPkhlD5uY0vkt4t5zDJEW9lZDvKpdq5X2L0hQShx6OtxuDAchV85xB-idssSkbj-HLkZEkyqN16uVhzLWgBMRLS-coI4LMQ_5yL9dztIGFhHdAFen5kgMmnqaF0rHlnEG8n",
    email: "lienphuonghl@yahoo.com",
    phone: "0908 759 007",
    whatsapp: "",
    zalo: "",
    order: 3,
  },
];

const PRODUCT_EN: Record<string, Partial<Product>> = {
  "plywood-melamine-nhap-khau-p2": {
    name: "Imported Melamine Plywood",
    description:
      "<p>A premium melamine-faced plywood line suitable for modern interiors, easy cleaning and refined visual consistency.</p><p>It is suitable for cabinets, shelving, wall systems and applications that require a stable finished surface.</p>",
    category: "Melamine Plywood",
    material: "Melamine-Faced Plywood",
    specifications: [
      { attribute: "Core", specification: "Melamine-faced plywood", tolerance: "—", standard: "Ref." },
      { attribute: "Bonding Standard", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Dimensions", specification: "1220×2440mm, 1525×3050mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Thickness", specification: "12mm, 18mm, 24mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
  },
  "plywood-marine-tieu-chuan-carb-p2": {
    name: "Marine Plywood CARB P2 Standard",
    description:
      "<p>A water-resistant plywood line for humid environments and demanding applications requiring higher durability.</p><p>It is suitable for applications that need better dimensional stability when exposed to moisture and tougher operating conditions.</p>",
    category: "Imported Plywood",
    specifications: [
      { attribute: "Product Line", specification: "Marine plywood", tolerance: "—", standard: "Ref." },
      { attribute: "Bonding Standard", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Dimensions", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Thickness", specification: "9mm, 12mm, 15mm, 18mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
  },
  "van-go-plywood-poplar": {
    name: "100% Poplar Plywood CARB P2",
    series: "Vietnam Plywood",
    description:
      "<p>Poplar plywood works well for decorative items, lightweight interiors and applications that need a stable surface.</p><p>This line is often selected for projects that need lower weight and easier fabrication.</p>",
    category: "Vietnam Plywood",
    specifications: [
      { attribute: "Wood Core", specification: "100% Poplar", tolerance: "—", standard: "Ref." },
      { attribute: "Bonding Standard", specification: "CARB P2", tolerance: "—", standard: "Ref." },
      { attribute: "Dimensions", specification: "1220×2440mm, 1250×2500mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Thickness", specification: "18mm, 21mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
  },
  "van-go-plywood-full-birch": {
    name: "Imported Full Birch Plywood",
    description:
      "<p>Full Birch is suitable for premium interiors and products that require rigidity, stability and a refined face.</p><p>It is a practical choice for applications that prioritize finishing quality and structural firmness.</p>",
    category: "Imported Plywood",
    specifications: [
      { attribute: "Wood Core", specification: "Full Birch", tolerance: "—", standard: "Ref." },
      { attribute: "Bonding", specification: "Import Standard", tolerance: "—", standard: "Ref." },
      { attribute: "Dimensions", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Thickness", specification: "12mm, 18mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
  },
  "plywood-polownia-flexible-go-hong-uon-cong-linh-hoat": {
    name: "Flexible Polownia Plywood",
    series: "Flexible Plywood",
    description:
      "<p>A flexible plywood line suitable for curved details and creative interior designs.</p><p>It is often used for curved surfaces, soft profiles and concepts that require higher bending flexibility.</p>",
    category: "Vietnam Plywood",
    specifications: [
      { attribute: "Wood Core", specification: "Polownia flexible core", tolerance: "—", standard: "Ref." },
      { attribute: "Feature", specification: "Flexible bending", tolerance: "—", standard: "Ref." },
      { attribute: "Dimensions", specification: "1220×2440mm", tolerance: "±2mm", standard: "Ref." },
      { attribute: "Thickness", specification: "5mm, 8mm, 12mm", tolerance: "±0.1mm", standard: "Ref." },
    ],
  },
  "plywood-phu-veneer-walnut": {
    name: "Walnut Veneered Plywood",
    series: "Veneered Plywood",
    description: "Walnut veneered plywood brings a refined premium surface for high-end interiors.",
    grade: "Walnut Veneer",
    category: "Veneered Plywood",
  },
  "go-cao-su-ghep-finger": {
    name: "Finger-Joint Rubberwood",
    series: "Finger-Joint Rubberwood",
    description: "Finger-joint rubberwood is suitable for interiors and environmentally conscious applications.",
    grade: "Finger Joint",
    category: "Finger-Joint Rubberwood",
  },
  "van-mdf": {
    name: "MDF Board",
    description: "MDF has a smooth surface, is easy to machine and suits a wide range of interior and decorative uses.",
    category: "MDF",
  },
};

const PROJECT_EN: Record<string, Partial<Project>> = {
  "1": { description: "Company profile and brand visuals adapted from the original website.", location: "Woodland" },
  "2": { description: "Application and showcase visuals for the Full Birch line.", category: "Product Gallery", location: "Woodland" },
  "3": { title: "Rubberwood Jointing Factory Visuals", description: "Warehouse, operations and processing line visuals from Woodland.", category: "Factory Gallery", location: "Binh Duong" },
  "4": { description: "Surface, color and application imagery of the melamine plywood line.", category: "Product Gallery", location: "Woodland" },
  "5": { title: "Warehouse And Dispatch", description: "Storage and dispatch spaces that help Woodland keep delivery lead times under control.", category: "Warehouse", location: "Binh Duong" },
};

const NEWS_EN: Record<string, Partial<NewsArticle>> = {
  "woodland-va-su-menh-danh-cho-go": {
    title: "Woodland And The Mission For Wood",
    content:
      "<h2>Wood is more than just a material</h2><p>Wood is not merely a raw material for construction and manufacturing. For many people, it brings warmth, durability and aesthetic depth to living spaces.</p><h2>The value of wood</h2><p>From residential interiors to export manufacturing, wood remains a material associated with trust, familiarity and flexibility. Choosing the right engineered wood therefore plays an important role in performance and investment efficiency.</p><h2>Woodland's mission</h2><p>WOODLAND focuses on supplying high-quality engineered wood solutions, from plywood and finger-joint wood to MDF, giving customers stable material choices for interiors, construction and manufacturing. Woodland's goal is to deliver the right material to the right need, standard and schedule.</p>",
    excerpt: "Discover why people continue to value wood and Woodland's mission in supplying quality wood materials for modern living spaces.",
    categoryLabel: "Woodland Brand",
  },
  "marine-plywood-huong-dan-toan-dien-cho-nguoi-tieu-dung-viet-nam": {
    title: "Marine Plywood: A Practical Guide For Buyers In Vietnam",
    content:
      "<h2>What is marine plywood?</h2><p>Marine plywood is a multi-layer plywood made with hardwood veneers and water-resistant bonding, intended for humid environments and higher durability requirements. Compared with standard plywood, marine-grade panels offer better stability and resistance to delamination under moisture exposure.</p><h2>Key standards buyers care about</h2><p>Buyers usually look at core quality, bonding type, surface stability and applicable standards. These factors directly affect service life in real projects.</p><h2>Common applications</h2><p>Marine plywood is suitable for kitchen cabinets, humid zones, durable furniture, coastal applications and other uses that require better moisture performance than standard plywood.</p>",
    excerpt: "A practical overview of marine plywood, the standards that matter and key considerations before selecting the material.",
    categoryLabel: "Material Insights",
  },
  "plywood-melamine-carb-p2-nhap-khau-13-ma-mau-moi-nhat": {
    title: "Imported CARB P2 Melamine Plywood: 13 Latest Color Options",
    content:
      "<h2>Updated melamine color range</h2><p>Imported CARB P2 melamine plywood at Woodland has been updated with new color codes to match modern interior trends and the demand for more consistent finished surfaces in manufacturing.</p><h2>Why this line is popular</h2><p>Melamine surfaces are easy to clean, resist scratches well and provide a more uniform finish across many interior applications. Combined with a stable plywood core, the product suits projects that require both appearance and durability.</p><h2>Where it fits best</h2><p>This product line is suitable for kitchens, wardrobes, built-in cabinets, apartment interiors, showrooms and export items that need stable finished materials.</p>",
    excerpt: "An update on Woodland's newer melamine color options for modern interiors and projects requiring stronger visual consistency.",
    categoryLabel: "New Product",
  },
  "woodland-va-xu-huong-xanh-hoa-vat-lieu-cung-plywood-melamine-cao-cap": {
    title: "Woodland And The Green Material Trend With Premium Melamine Plywood",
    content:
      "<h2>Melamine plywood and greener material choices</h2><p>Woodland's melamine plywood is positioned as a practical option for greener material selection thanks to its refined finish, durability and flexible use across modern interior applications.</p><h2>Long-term value</h2><p>When selecting materials for a project, customers care not only about appearance but also about stability, maintenance and long-term environmental impact. Woodland's melamine plywood is aligned with those criteria.</p><h2>A material for the future</h2><p>Woodland aims to provide materials that work in real construction and manufacturing conditions while fitting broader sustainable material trends.</p>",
    excerpt: "See how Woodland positions premium melamine plywood within the broader green-material direction for interiors and manufacturing.",
    categoryLabel: "Green Trend",
  },
  "tieu-chuan-marine-plywood-tat-ca-nhung-gi-ban-can-biet": {
    title: "Marine Plywood Standards: What You Need To Know",
    content:
      "<h2>What is marine plywood?</h2><p>Marine plywood is a multi-layer board produced with water-resistant bonding and a core structure suited to humid, coastal or technically demanding conditions.</p><h2>Standards often considered</h2><p>Buyers typically review bonding standards, core quality, water resistance, mechanical durability and surface stability. These criteria determine long-term performance in use.</p><h2>Selection notes</h2><p>Choosing the right marine plywood helps reduce delamination, warping and later maintenance costs, especially in kitchens, wet areas and projects that need longer service life.</p>",
    excerpt: "A practical summary of marine plywood standards, key technical considerations and selection notes for long-term performance.",
    categoryLabel: "Material Insights",
  },
  "van-go-cong-nghiep-nao-phu-hop-cho-tu-bep-plywood-melamine-hay-mdf-melamine": {
    title: "Which Engineered Wood Fits Kitchen Cabinets Better: Melamine Plywood Or Melamine MDF?",
    content:
      "<h2>Two common choices</h2><p>Melamine plywood and melamine MDF are both popular for kitchen cabinets because of their finished surface and wide color range. However, each material behaves differently in moisture resistance, mechanical strength and budget fit.</p><h2>When to choose melamine plywood</h2><p>Melamine plywood is often better suited for applications that prioritize durability, screw holding, dimensional stability and higher moisture exposure.</p><h2>When to choose melamine MDF</h2><p>Melamine MDF is suitable when a smooth, even surface and cost efficiency are the main priorities in areas with lower moisture or impact demands.</p>",
    excerpt: "A quick comparison between melamine plywood and melamine MDF for kitchen cabinetry and related interior applications.",
    categoryLabel: "Material Insights",
  },
};

const TEAM_EN: Record<string, Partial<TeamMember>> = {
  "1": { name: "Woodland Hotline", title: "Product consultation, quotations and order support", region: "Binh Duong" },
  "2": { name: "Woodland Delivery", title: "Warehouse and delivery support", region: "Warehouse" },
  "3": { name: "Woodland Online", title: "Online inquiry and website information channel", region: "Online" },
};

function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "vi") return product;
  const overrides = PRODUCT_EN[product.slug] ?? {};
  return { ...product, ...overrides };
}

function localizeProject(project: Project, locale: Locale): Project {
  if (locale === "vi") return project;
  const overrides = PROJECT_EN[project._id] ?? {};
  return { ...project, ...overrides };
}

function localizeNews(article: NewsArticle, locale: Locale): NewsArticle {
  if (locale === "vi") return article;
  const overrides = NEWS_EN[article.slug] ?? {};
  return { ...article, ...overrides };
}

function localizeTeamMember(member: TeamMember, locale: Locale): TeamMember {
  if (locale === "vi") return member;
  const overrides = TEAM_EN[member._id] ?? {};
  return { ...member, ...overrides };
}

export function getFeaturedProducts(locale: Locale) {
  return FEATURED_PRODUCTS.map((item) => localizeProduct(item, locale));
}

export function getAllProducts(locale: Locale) {
  return ALL_PRODUCTS.map((item) => localizeProduct(item, locale));
}

export function getProjects(locale: Locale) {
  return PROJECTS.map((item) => localizeProject(item, locale));
}

export function getGalleryItems(locale: Locale) {
  return GALLERY_ITEMS.map((item) => localizeProject(item, locale));
}

export function getNewsArticles(locale: Locale) {
  return NEWS_ARTICLES.map((item) => localizeNews(item, locale));
}

export function getTeamMembers(locale: Locale) {
  return TEAM_MEMBERS.map((item) => localizeTeamMember(item, locale));
}
