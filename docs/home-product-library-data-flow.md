# Home Product Library Data Flow

## Muc tieu

- Section `San Pham Cua Chung Toi` tren homepage khong con dung mang text tinh trong `messages`.
- Section nay hien thi toi da `9` san pham co anh, thong tin tom tat va link vao trang chi tiet.

## Rule du lieu

- Homepage product library:
  - Nguon du lieu: `fetchVisibleProducts(locale)`
  - Fallback: `getAllProducts(locale)`
  - So luong hien thi mac dinh: `6` item dau tien
  - Nut `Show more` se hien them toi da `3` item nua
  - Dieu kien: `isVisible = true`

- Homepage featured products:
  - Nguon du lieu: `fetchFeaturedProducts(locale, 6)`
  - Fallback: `getFeaturedProducts(locale)`
  - Dieu kien: `featured = true` va `isVisible = true`

## File lien quan

- `src/app/[locale]/page.tsx`
- `src/components/sections/home/ProductLibrarySection.tsx`
- `src/components/sections/home/FeaturedProductsSection.tsx`
- `src/components/sections/home/FeaturedProductsCarousel.tsx`

## Luu y cho backend

- Neu muon homepage `San Pham Cua Chung Toi` giong web cu, backend chi can dam bao co du danh sach san pham visible voi hinh anh, slug va noi dung co ban.
- Neu muon `San Pham Noi Bat` chay dung theo tung nhom, nen co it nhat `6` san pham duoc danh dau `featured = true`.
- Khong can tao endpoint rieng cho homepage. Homepage va `/products` dang dung chung source data san pham, chi khac quy tac loc va so luong hien thi.
