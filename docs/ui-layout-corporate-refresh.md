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
- `quick contact rail`
- `home hero admin`

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
- desktop dùng sidebar filter sticky
- mobile dùng nút mở filter và panel trượt từ cạnh phải
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

- flow 1 cột từ trên xuống dưới, không còn chia 2 cột ở phần hero
- gallery nằm trước phần thông tin chi tiết và thumbnail vẫn click được
- panel thông tin không còn sticky sidebar trên desktop
- summary specs nằm trong khối thông tin chính và chỉ render dữ liệu thật có trong DB
- CTA/contact block rõ hơn
- section applications nếu sản phẩm có dữ liệu ứng dụng
- section technical data chỉ dùng:
  - `specifications` nếu có
  - nếu chưa có `specifications` thì dùng chính các field thật như `material`, `grade`, `bonding`, `dimensions`, `thickness`
  - không còn fallback sang bảng thông số “giả”
- block `recent products`
- block `recent news`

`galleryImages` hiện rất quan trọng vì đã được đẩy lên thành gallery thumbnail thực tế. Nếu backend chưa có, frontend fallback về `image`.

`applications` hiện đã được dùng đúng thứ tự `order` từ admin, mỗi item cần:

- `image`
- `title`
- `subtitle`
- `order`

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

- flow 1 cột cho toàn bộ article detail
- hero editorial gồm category, date, title, excerpt, author
- ảnh cover lớn theo kiểu feature article nằm trong cùng trục dọc với intro
- meta cards được đưa vào giữa intro và body thay vì sidebar desktop
- phần body nằm trong một khối nội dung duy nhất để ưu tiên đọc liên tục
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

### Hero và contact nổi

Frontend public hiện đang đọc `home-settings` thật từ DB cho:

- `heroSlides`
- `heroStats`
- `contactPhone`
- `contactEmail`

Lưu ý UI:

- quick contact rail mặc định ở trạng thái thu gọn
- CTA đóng là pill có chữ `Liên hệ` hoặc `Contact us`
- các nút liên hệ chỉ bung ra sau khi người dùng bấm
- hero hỗ trợ cả ảnh và video, nhưng video local chỉ dùng cho render, không nằm trong backup JSON

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

## Mobile Notes

Các tối ưu mobile hiện đã được áp vào các route chính:

- `products`: filter panel riêng cho mobile
- `products/[slug]`: spacing gọn hơn, các section bám dữ liệu thật
- `news/[slug]`: intro + cover + content chia nhịp rõ hơn trên màn hình hẹp
- `quick contact rail`: đóng gọn để không che nội dung

Backend không cần field mới riêng cho mobile, nhưng cần giữ dữ liệu ngắn gọn và nhất quán hơn ở:

- `excerpt`
- `categoryLabel`
- `series`
- `availability`
- `heroStats`

## Gợi ý dữ liệu thật nên có trong backend

Nếu backend muốn hỗ trợ layout này tốt hơn trong các phase sau, có thể cân nhắc thêm:

- cờ `featured` cho news
- ảnh cover chất lượng cao riêng cho about/home sections
- field `shortSpecs` hoặc `summarySpecs` cho product detail hero panel

Các field trên hiện chỉ là gợi ý mở rộng, chưa phải dependency bắt buộc của frontend.
