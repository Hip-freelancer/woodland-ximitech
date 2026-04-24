# Gallery Page

## Muc tieu

- Them duong vao `/gallery` ro rang hon trong header va footer.
- Doi nhan dieu huong tu `Hinh anh` sang `Thu vien` de phan nay bao gom ca video va anh.
- Tach trang gallery thanh 2 khu rieng:
  - 4 video
  - kho anh
- Hero cua gallery dung nen anh dong bo voi cac page hero khac.

## File lien quan

- `src/components/layout/HeaderClient.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/[locale]/gallery/page.tsx`
- `messages/vi.json`
- `messages/en.json`

## Rule giao dien

- Header co link truc tiep den `/gallery`.
- Footer tiep tuc giu link `/gallery` trong nhom navigation.
- Hero gallery dung component `PageHero`.
- Video va anh khong tron chung trong cung mot grid nua.
- Card video co `controls` de nguoi dung xem tung video rieng tren page.
