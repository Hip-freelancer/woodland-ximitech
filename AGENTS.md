<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Rules

1. Luôn trả lời bằng tiếng việt, viết code bằng tiếng anh
2. Không tự động push lên git
3. Luôn bám sát tài liệu, không tự ý thay đổi cấu trúc dự án.
4. Template mẫu của dự án ở trong thư mục `templateUi` nhưng màu đã được chuyển sang màu xanh như file tailwind.config.ts.
5. Khi yêu cầu thay đổi giao diện, hãy ưu tiên sử dụng các component có sẵn trong dự án, nếu không có thì hãy tạo mới theo đúng style của dự án và bám sát layout + animation mẫu.