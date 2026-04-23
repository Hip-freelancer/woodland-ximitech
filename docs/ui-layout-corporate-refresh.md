# UI Layout Corporate Refresh

## Mục tiêu

Tài liệu này ghi lại các thay đổi UI/UX mới ở frontend để Backend hoặc Developer khác hiểu cách dữ liệu đang được ưu tiên hiển thị trong layout kiểu catalog corporate.

## Phạm vi đã đổi

- Trang `products`
- Trang `products/[slug]`
- Trang `news`
- Trang `news/[slug]`
- Một số block tại `home`
- Một số block tại `about`
- Trang `sales-team`
- `footer`

## Sản phẩm

### Trang danh mục

Frontend đang ưu tiên các trường sau để tạo cảm giác catalog rõ hơn:

- `name`
- `slug`
- `image`
- `grade`
- `category`
- `categoryLabel`
- `material`
- `thickness`

Layout hiện tại có:

- khối tổng quan catalog ở đầu trang
- sidebar filter sticky
- card sản phẩm lớn hơn, nhấn mạnh ảnh, grade, category, material, thickness

Không có field mới bắt buộc từ backend cho block này.

### Trang chi tiết

Frontend đang ưu tiên:

- `image`
- `galleryImages`
- `name`
- `series`
- `categoryLabel`
- `material`
- `thickness`
- `description`
- `availability`
- `certifications`
- `dimensions`
- `specifications`

Layout mới dùng:

- gallery trái với thumbnail click được
- panel thông tin phải dạng sticky
- summary specs ở khối hero phải
- CTA/contact block rõ hơn
- section applications nếu sản phẩm có dữ liệu ứng dụng
- section technical data nhịp rõ hơn
- block `recent products`
- block `recent news`

`galleryImages` hiện rất quan trọng vì đã được đẩy lên thành gallery thumbnail thực tế. Nếu backend chưa có, frontend fallback về `image`.

## Tin tức

Frontend đang ưu tiên:

- `title`
- `slug`
- `image`
- `excerpt`
- `publishDate`
- `category`
- `categoryLabel`

Layout mới của trang danh sách:

- 1 bài featured lớn ở đầu
- các bài còn lại thành grid/card
- meta được rút gọn còn category + date

### Trang chi tiết tin tức

Layout mới dùng:

- hero editorial gồm category, date, title, excerpt
- ảnh cover lớn theo kiểu feature article
- phần body nằm trong khối nội dung riêng
- tag/meta tách ra rõ hơn
- related sections ở cuối trang đồng bộ với product detail

Không có field mới bắt buộc, nhưng `excerpt` và `image` cần ổn định hơn vì đã được dùng nổi bật hơn trước.

## Home

Các section ở home đang dùng lại data cũ nhưng theo bố cục mạnh hơn:

- `about preview`: ảnh lớn + panel nội dung
- `featured products`: heading + subtitle + product cards lớn hơn
- `operations`: chia block lead/support rõ hơn
- `news`: 1 bài featured + 2 bài phụ

Không có model mới bắt buộc.

## About

Trang about đang dùng các namespace text cũ nhưng đã đổi cách hiển thị:

- hero overlay mạnh hơn
- vision/mission chia 2 mảng rõ
- portfolio/value cards chắc hơn
- operations/team/gallery chia thành các block xen kẽ

Không có model mới bắt buộc.

## Sales Team

Frontend public đã chuyển sang đọc DB thật thay vì fallback tĩnh.

Layout mới:

- intro panel ở đầu trang
- sales cards lớn hơn, đậm ảnh hơn
- CTA block cuối trang rõ hơn

Chi tiết data flow nằm ở:

- `docs/team-sales-data-flow.md`

## Footer

Footer đã được đổi sang hướng light corporate:

- tone trắng xanh, không còn là block nền xanh đậm toàn phần
- khối brand + contact chính nằm nổi bật ở hàng đầu
- map nằm thành panel riêng để cân bố cục
- hàng dưới chia card điều hướng, nhóm sản phẩm, direct channels rõ hơn
- dùng các field contact ổn định từ `companyInfo`

## Gợi ý dữ liệu thật nên có trong backend

Nếu backend muốn hỗ trợ layout này tốt hơn trong các phase sau, có thể cân nhắc thêm:

- cờ `featured` cho news
- ảnh cover chất lượng cao riêng cho about/home sections
- field `shortSpecs` hoặc `summarySpecs` cho product detail hero panel

Các field trên hiện chỉ là gợi ý mở rộng, chưa phải dependency bắt buộc của frontend.
