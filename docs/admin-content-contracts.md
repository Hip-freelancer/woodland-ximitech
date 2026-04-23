# Admin Content Contracts

## Mục tiêu

Tài liệu này mô tả các contract dữ liệu mới ở admin sau đợt refresh ngày `2026-04-23`, để Backend hoặc Developer khác không đổ dữ liệu theo assumptions cũ.

## 1. Category đã tách loại

Collection `categories` hiện dùng thêm field:

- `contentType: "product" | "news"`

Uniqueness mới:

- unique theo cặp `(contentType, slug)`

Ý nghĩa:

- `product`:
  - dùng cho sản phẩm
  - dùng cho menu sản phẩm
  - dùng cho filter catalog
- `news`:
  - dùng cho bài viết
  - dùng cho category label ở news listing / news detail

Mapping ở frontend:

- product forms chỉ nạp category có `contentType = "product"`
- news forms chỉ nạp category có `contentType = "news"`
- public serializers cũng map label theo đúng loại category tương ứng

Migration một lần đang dùng:

- `npm run migrate:categories`

Script này:

- chuyển category cũ sang `product`
- bỏ hậu tố legacy như `-tieng-viet`
- tạo news categories từ `NewsArticle.category`
- chuẩn hóa lại `NewsArticle.category`

## 2. Remote image re-host từ woodland.vn

Admin không đổi URL ngay khi người dùng dán link.

Khi bấm lưu, server sẽ:

- kiểm tra các URL bắt đầu bằng `https://woodland.vn/`
- tải ảnh về server
- upload lại lên R2
- ghi đè URL cũ bằng URL R2

Phạm vi áp dụng:

- `categories.image`
- `products.image`
- `products.galleryImages`
- `products.applications[].image`
- `products.description` trong mọi `img src`
- `news.image`
- `news.content` trong mọi `img src`
- `team.image`
- `home-settings.heroSlides[].mediaUrl` nếu là ảnh
- `home-settings.heroSlides[].posterUrl`

Không áp dụng cho:

- thẻ `a href`
- domain khác ngoài `https://woodland.vn/`
- video local hero

Backfill dữ liệu cũ:

- `npm run backfill:legacy-images`

Script này sẽ quét DB hiện tại và re-host toàn bộ ảnh cũ còn trỏ về `woodland.vn`.

## 3. Product admin form

Admin sản phẩm không còn dùng JSON textarea cho 2 field này:

- `specifications`
- `applications`

UI mới là editor có cấu trúc, nhưng DB output giữ nguyên schema cũ.

### specifications

Mỗi item gồm:

- `attribute.en`
- `attribute.vi`
- `specification.en`
- `specification.vi`
- `tolerance`
- `standard`

### applications

Mỗi item gồm:

- `image`
- `order`
- `title.en`
- `title.vi`
- `subtitle.en`
- `subtitle.vi`

`order` được frontend normalize lại theo vị trí trong editor.

## 4. Home settings và hero media

Collection `home-settings` đang dùng:

- `contactEmail`
- `contactPhone`
- `heroSlides`
- `heroStats`

### heroSlides

Mỗi slide gồm:

- `mediaType: "image" | "video"`
- `mediaUrl`
- `posterUrl`
- `alt.en`
- `alt.vi`
- `order`
- `isVisible`

Lưu ý:

- video upload local nằm ở `public/uploads/hero-media`
- nếu người dùng xóa hoặc đổi loại media trước khi lưu, frontend sẽ gọi API để dọn file local ngay
- backup JSON sẽ bỏ qua các slide video local

### heroStats

Mỗi stat gồm:

- `value.en`
- `value.vi`
- `label.en`
- `label.vi`
- `order`
- `isVisible`

## 5. Backup / Import trong admin

Dashboard `/admin` hiện có export/import JSON.

Backup format:

- `version`
- `exportedAt`
- `data`

`data` hiện gồm:

- `categories`
- `contacts`
- `home-settings`
- `news`
- `products`
- `projects`
- `team`

Import behavior:

- xóa toàn bộ dữ liệu hiện tại trong các collection trên
- normalize lại entity payload
- re-host lại ảnh `https://woodland.vn/` nếu có
- bỏ qua local hero video assets trong backup

## 6. SEO fields đã đọc từ DB

Các entity dưới đây đã có `seo` được dùng ở frontend:

- `categories.seo`
- `products.seo`
- `news.seo`

Hiện tại public pages đang đọc:

- `seo.title`
- `seo.description`
- `seo.keywords`

Nếu thiếu, frontend sẽ fallback về title/description thực tế từ nội dung.
