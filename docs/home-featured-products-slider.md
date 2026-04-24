# Home Featured Products Slider

## Muc tieu

- Section `home.featuredProducts` o trang chu khong con co dinh 3 card.
- Homepage se uu tien lay toi da `6` san pham noi bat de hien thi thanh `2` nhom slide.
- Moi slide hien thi toi da `3` san pham, tu dong chuyen vong lap sau `5` giay.

## Hanh vi hien tai

- Neu du lieu co `1-3` san pham noi bat: giu nguyen dang grid tinh, khong bat slider.
- Neu du lieu co tu `4` san pham tro len: giao dien tu dong chia thanh nhieu slide, moi slide toi da `3` card.
- Co them dot navigation ben duoi de frontend/backend de kiem tra so nhom dang hien thi.

## Nguon du lieu

- File page: `src/app/[locale]/page.tsx`
- Query homepage: `fetchFeaturedProducts(locale, 6)`
- UI client slider: `src/components/sections/home/FeaturedProductsCarousel.tsx`

## Luu y cho backend

- De section nay hoat dong dung nhu mong muon, nen co it nhat `6` product co `featured = true` va `isVisible = true`.
- Thu tu slide dang bam theo sort hien tai cua query:
  - `priority` tang dan
  - `createdAt` giam dan
- Khong co thay doi schema moi. Backend chi can quan ly du lieu featured nhu hien tai.
