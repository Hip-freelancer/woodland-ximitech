# Home Hero Settings

## Mục tiêu

Tài liệu này mô tả dữ liệu cần có để Backend/Developer khác hiểu và tiếp tục đổ dữ liệu thật cho hero mới của trang chủ.

## Phạm vi UI mới

- Hero trang chủ đã chuyển sang slider trung tâm hỗ trợ cả `image` và `video`.
- Có 2 nút contact nổi ở góc phải dưới:
  - `contactEmail`
  - `contactPhone`
- Có dải chỉ số ở chân hero gồm nhiều item có thể bật/tắt.

## Entity mới

Entity admin đang dùng tên:

- `home-settings`

Model Mongoose:

- `HomeSettings`

Hiện tại giao diện admin đang thao tác với 1 record cấu hình chính. Nếu chưa có record thì frontend dùng dữ liệu mặc định.

## Cấu trúc dữ liệu

```ts
interface HomeSettings {
  _id: string;
  contactEmail: string;
  contactPhone: string;
  heroSlides: HomeHeroSlide[];
  heroStats: HomeHeroStat[];
  createdAt: string;
  updatedAt: string;
}

interface HomeHeroSlide {
  _id?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
  alt: {
    en: string;
    vi: string;
  };
  order: number;
  isVisible: boolean;
}

interface HomeHeroStat {
  _id?: string;
  value: {
    en: string;
    vi: string;
  };
  label: {
    en: string;
    vi: string;
  };
  order: number;
  isVisible: boolean;
}
```

## Quy ước media

- `image`:
  - Có thể dùng URL ngoài hoặc ảnh upload như flow hiện tại.
- `video`:
  - Upload từ admin qua route `POST /api/admin/home-media`
  - File được nén bằng `ffmpeg`
  - File sau nén đang lưu local tại `public/uploads/hero-media/`
  - URL public trả ra dạng `/uploads/hero-media/<file>.mp4`
  - Khi thay hoặc xóa video trong cấu hình rồi lưu, file local cũ sẽ bị dọn

## API admin liên quan

- `GET /api/admin/home-settings`
- `POST /api/admin/home-settings`
- `PUT /api/admin/home-settings/:id`
- `DELETE /api/admin/home-settings/:id`
- `POST /api/admin/home-media`

## Ghi chú vận hành

- Hero text chính hiện vẫn lấy từ `messages/en.json` và `messages/vi.json` trong namespace `home.hero`.
- Logo chính thức và favicon đang dùng `public/logowoodland.png`.
- Server production cần có `ffmpeg` trong PATH để upload video hero hoạt động.
