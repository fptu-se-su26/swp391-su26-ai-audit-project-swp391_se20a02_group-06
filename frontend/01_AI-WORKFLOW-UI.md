# AI WORKFLOW: Tích hợp giao diện từ Stitch vào React (Chakra UI)

Tài liệu này đóng vai trò là "SOP" (Quy trình chuẩn) dành cho AI khi thực hiện việc lấy giao diện từ Stitch và code vào dự án. Lần tới, bạn chỉ cần yêu cầu AI đọc file này để nó tự động tuân thủ theo luồng làm việc tối ưu nhất.

## Bước 1: Trích xuất và Phân tích HTML từ Stitch
- Dùng MCP để xuất giao diện (HTML/CSS) từ Stitch ra các file `.html` nháp (như `landing.html`, `about.html`, `login.html`, v.v.).
- Các file này sẽ được lưu tạm ở ngoài thư mục code chính (vd: lưu ở thư mục gốc của workspace).
- AI cần đọc qua các file này để nắm bắt tổng thể layout, hệ màu, typography và các thành phần (components) lặp đi lặp lại.

## Bước 2: Thiết kế Shared Components (Nguyên tắc DRY)
Tuyệt đối KHÔNG code lặp lại các thành phần giống nhau ở các trang khác nhau.
- Các thành phần dùng chung BẮT BUỘC phải được đưa vào thư mục `frontend/src/components/shared/`.
- **Ví dụ điển hình:**
  - `Navbar/PublicNavbar.tsx`: Thanh điều hướng chung.
  - `Footer/PublicFooter.tsx`: Chân trang chung.
  - `Button/AppButton.tsx`: Wrapper bao bọc Component `<Button>` của Chakra UI. Tận dụng `chakra-theme.ts` đã có để tự động style cho các `variant` (như `solid`, `outline`). `AppButton` phải mở rộng `ButtonProps`, nhận prop `label` (chấp nhận `React.ReactNode`) để dùng chung ở mọi nơi.

## Bước 3: Triển khai Pages & Chuyển đổi sang Chakra UI
- Xây dựng các trang trong `frontend/src/pages/`.
- Chuyển đổi mã HTML thuần/CSS sang các Component của Chakra UI (`Box`, `Flex`, `Grid`, `Stack`, `Text`, `Heading`...).
- Import và tái sử dụng các Shared Components đã tạo ở Bước 2 thay vì code cứng (hard-code).

## Bước 4: Clean Code và Fix Lỗi (Critical Step)
Trong quá trình code và refactor, AI phải tuân thủ nghiêm ngặt các quy tắc TypeScript và ESLint của dự án:
- **Xoá thư viện thừa:** Loại bỏ ngay lập tức các `import` không còn được sử dụng (Unused variables/imports). Ví dụ: Khi thay bằng `AppButton`, phải xoá `Button` của `@chakra-ui/react`.
- **Tuân thủ Type-Only Import:** Sử dụng `import type {...}` cho các TypeScript Interfaces/Types để tránh lỗi Vite/TS config (`verbatimModuleSyntax`).
- **Double Check bằng Build:** Sau khi hoàn thành một file hoặc 1 luồng thay đổi, AI phải TỰ ĐỘNG chạy lệnh `pnpm run build` (tại thư mục `frontend/`) để đảm bảo không có lỗi biên dịch (Exit code 0).

## Bước 5: Dọn dẹp (Cleanup)
- Sau khi toàn bộ các file TSX đã chạy hoàn hảo và build thành công, AI phải sử dụng terminal lệnh (ví dụ: `rm`) để **XOÁ BỎ** các file `.html` nháp đã tạo ở Bước 1. 
- Đảm bảo dự án quay về trạng thái Clean & Gọn gàng nhất.

---
> **Lưu ý cho AI:** Khi User yêu cầu "Áp dụng giao diện theo Flow chuẩn", AI hãy đọc kĩ các Bước trên, lên `implementation_plan` xin ý kiến trước khi làm, và thực hiện tuần tự để đảm bảo chất lượng code tốt nhất.
