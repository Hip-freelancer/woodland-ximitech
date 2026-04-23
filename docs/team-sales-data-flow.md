# Team Sales Data Flow

## Mục tiêu

Tài liệu này mô tả luồng dữ liệu thật cho trang `sales-team` sau khi frontend đã bỏ fallback tĩnh và chuyển sang đọc trực tiếp từ database.

## Trạng thái hiện tại

- Admin đã có trang quản trị mới:
  - `/admin/team`
- Public page:
  - `/[locale]/sales-team`
- Frontend public không còn fallback từ `staticData`
- Nếu database chưa có nhân sự đang hiển thị, trang public sẽ render empty state

## Model đang dùng

Collection:

- `TeamMember`

Schema frontend/backend đang bám:

```ts
interface TeamMember {
  _id: string;
  name: {
    en: string;
    vi: string;
  };
  title: {
    en: string;
    vi: string;
  };
  region: {
    en: string;
    vi: string;
  };
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  zalo: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Quy ước hiển thị public

Frontend public đang:

- chỉ lấy record có `isVisible = true`
- sort theo `order asc`, sau đó `createdAt desc`
- localize theo `locale`

Các field đang hiển thị trực tiếp ra giao diện:

- `name`
- `title`
- `region`
- `image`
- `email`
- `phone`
- `whatsapp`
- `zalo`

## Admin

Admin page mới hỗ trợ:

- tạo nhân sự mới
- sửa nhân sự
- upload/chọn ảnh
- bật tắt hiển thị
- chỉnh thứ tự ưu tiên
- nhập song ngữ cho:
  - `name`
  - `title`
  - `region`

## Tương thích dữ liệu cũ

Frontend serializer hiện vẫn có xử lý an toàn nếu một số record cũ còn lưu `name/title/region` dưới dạng string đơn.

Tuy nhiên để đồng bộ lâu dài, backend nên chuẩn hóa toàn bộ sang object `vi/en`.

## Gợi ý mở rộng phase sau

Nếu muốn tăng chất lượng page sales-team hơn nữa, backend có thể cân nhắc thêm:

- `avatarFocusX/avatarFocusY` để crop ảnh chân dung đẹp hơn
- `department`
- `languages`
- `responseTimeLabel`
- `ctaLink`

Các field trên hiện chưa bắt buộc cho frontend.
