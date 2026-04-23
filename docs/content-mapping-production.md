# Content Mapping Production Notes

## Mục tiêu

Đẩy nhanh tiến độ production song ngữ bằng cách map nội dung từ `woodland.vn` vào site hiện tại trước khi polish UI/UX theo layout tham chiếu.

## Những gì đã map

- `company info`
  - Frontend đang ưu tiên bộ thông tin lặp ổn định nhất từ web cũ:
    - Trụ sở chính: `121/62 Phạm Ngọc Thạch, Tổ 73, Khu 5, P. Hiệp Thành, TP. Thủ Dầu Một, Bình Dương`
    - Kho hàng / VPGD: `Đường DT 747B, KP. Khánh Vân, P. Khánh Bình, TP. Tân Uyên, Bình Dương`
    - Hotline: `(+84) 0908 759 007`
    - Giao nhận: `(+84) 0979 685 971`
    - Email: `lienphuonghl@yahoo.com`
  - Lý do:
    - Bộ địa chỉ Bình Dương xuất hiện nhiều và nhất quán hơn bộ `Phú Lợi / TP. Hồ Chí Minh`
    - Tuy vậy vẫn cần business xác minh lần cuối trước khi hardcode vào backend/CMS
- `about`
  - Bám theo các block từ web cũ:
    - `Sứ Mệnh & Tầm Nhìn`
    - `Chất Lượng Đảm Bảo – Uy Tín Hàng Đầu`
    - `Danh Mục Sản Phẩm Chủ Lực`
    - `Hệ Thống Cơ Sở Hạ Tầng Bền Vững`
    - `Đội Ngũ Nhân Sự Tận Tâm & Chuyên Nghiệp`
- `contact`
  - Wording và field labels đã đổi sang giọng Woodland cũ hơn.
  - Giữ payload tương thích backend hiện tại: `fullName`, `email`, `phone`, `company`, `message`.
- `product detail`
  - Fallback data đã có mô tả và bảng specs cho các sản phẩm chủ lực.
  - Metadata detail page lấy theo sản phẩm.
- `news detail`
  - Fallback data đã có `content`, `excerpt`, `category`, `categoryLabel`.
  - Metadata detail page lấy theo bài viết.
- `gallery`
  - Đã thêm route mới: `/[locale]/gallery`
  - Dùng fallback data từ `src/lib/staticData.ts`
- `footer`, `news`, `sales-team`
  - Dọn lại label/meta để giảm nội dung generic còn sót từ template.
  - Đã map thêm các bài viết và đầu mối liên hệ theo web cũ để fallback hiển thị sát hơn.

## Dữ liệu fallback hiện tại

File nguồn chính:

- `src/lib/staticData.ts`

Các collection fallback đáng chú ý:

- `FEATURED_PRODUCTS`
- `ALL_PRODUCTS`
- `PROJECTS`
- `GALLERY_ITEMS`
- `NEWS_ARTICLES`
- `TEAM_MEMBERS`

## Gợi ý backend nếu muốn thay fallback bằng data thật

- `gallery`
  - Nên có model riêng hoặc tái sử dụng `projects/media gallery`
  - Trường tối thiểu:
    - `title`
    - `description`
    - `image`
    - `category`
    - `priority`
    - `isVisible`
- `about page blocks`
  - Nếu cần admin hóa hoàn toàn, nên có model page content dạng section-based:
    - `hero`
    - `visionMission`
    - `portfolioItems`
    - `operations`
    - `team`
- `news detail`
  - Nên đảm bảo CMS có:
    - `excerpt`
    - `content`
    - `category`
    - `categoryLabel`
- `product detail`
  - Nên đảm bảo CMS có:
    - `description`
    - `specifications`
    - `applications`
    - `galleryImages`

## Ghi chú

- Khi chưa có data thật từ backend, site vẫn render được bằng fallback map từ web cũ.
- Từ ngày `2026-04-23`, frontend đã chuẩn hóa wording core ở:
  - `messages/vi.json`
  - `messages/en.json`
  - `src/lib/companyInfo.ts`
  - `src/lib/staticData.ts`
- Giai đoạn tiếp theo chỉ nên tập trung vào polish UI/UX theo ảnh tham chiếu, không nên đổi lại wording nếu không có nguồn nội dung mới từ phía Woodland.
