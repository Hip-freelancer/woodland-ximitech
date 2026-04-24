# Operations Page

## Muc tieu

- Tao route rieng `/operations` de hien thi trang `N?ng L?c Ho?t ??ng`.
- Them link den trang nay trong header va footer.
- Noi dung tham khao tu `https://woodland.vn/gioi-thieu`.
- Toan bo anh dung trong page moi da duoc tai ve va upload len R2, khong dung link legacy trong code.

## Route va dieu huong

- Route moi: `src/app/[locale]/operations/page.tsx`
- Header: them nav item `operations`
- Footer: them nav item `operations`
- Sitemap: them `/operations`

## Data page

- File noi dung: `src/lib/operationsPageContent.ts`
- Noi dung duoc chia thanh:
  - hero co anh nen bg + overlay xanh, dung cung anh hero voi homepage
  - intro + stats
  - 6 block noi dung co anh
  - closing statement

## Hero dung chung

- File media chung: `src/lib/pageHeroMedia.ts`
- Cac page hero co nen anh dang dung chung 1 anh voi hero homepage de dong bo nhan dien

## Anh R2

- Prefix upload: `operations-page/`
- Nguon anh legacy tham khao tu trang cu `https://woodland.vn/gioi-thieu`
- Script da dung de rehost: `scripts/rehostOperationsPageImages.ts`

## Luu y

- Khong dat link `https://woodland.vn/...` trong page moi.
- Neu can thay anh hoac cap nhat noi dung, uu tien tiep tuc rehost len R2 truoc khi sua data page.
