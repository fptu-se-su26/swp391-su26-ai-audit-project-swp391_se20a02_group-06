# Hướng Dẫn Cập Nhật Codebase (Dành Cho Team)

Do project vừa có một số cập nhật quan trọng về tính năng **Đổi mật khẩu**, **OTP Quên mật khẩu**, và đặc biệt là **Nâng cấp lên .NET 9**, các thành viên trong team khi pull code mới về **BẮT BUỘC** phải thực hiện các bước sau để hệ thống có thể chạy trơn tru, tránh lỗi Database và lỗi môi trường.

---

## 0. Nâng cấp SDK lên .NET 9 (Bắt Buộc)

**Tại sao phải nâng cấp?**
Trước đây team sử dụng .NET 8 và `Pomelo.EntityFrameworkCore.MySql 8.0.2`. Tuy nhiên, thư viện này có một bug chí mạng nếu vô tình chạy trên runtime .NET 9 (gây ra lỗi `NullReferenceException` ở hàm `OnModelFinalizing` khi thêm bảng `EmailOTP` mới). Để triệt để khắc phục lỗi sập hệ thống này, codebase hiện tại đã được nâng cấp đồng bộ lên **.NET 9.0** và thư viện **Pomelo 9.0.0-preview**.

**Team cần làm gì?**
1. **Tải .NET 9.0 SDK**: 
   Truy cập link chính thức của Microsoft: [Download .NET 9.0](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
   - Chọn bản cài đặt tương ứng với hệ điều hành (Windows x64, macOS Arm64/x64, Linux).
   - Tải file Installer và cài đặt bình thường (Next -> Finish).
2. **Kiểm tra cài đặt**:
   Sau khi cài xong, mở terminal/CMD lên và gõ:
   ```bash
   dotnet --version
   ```
   Nếu màn hình hiển thị `9.0.xxx` là đã cài đặt thành công.
3. **Cập nhật IDE (Visual Studio / VS Code)**:
   - Nếu bạn dùng **Visual Studio 2022**, hãy update nó lên bản mới nhất (version 17.12 trở lên) vì các bản cũ không hỗ trợ .NET 9.
   - Nếu bạn dùng **VS Code**, hãy khởi động lại ứng dụng và đảm bảo extension C# (Dev Kit) đã được cập nhật.
- *Lưu ý: Nếu bạn không cài .NET 9 mà cố build code mới, IDE sẽ báo lỗi không tìm thấy `TargetFramework net9.0` ngay lập tức!*

---

## 1. Cập Nhật Database (Quan trọng nhất)

Chúng ta đã thêm bảng `EmailOTP` để xử lý logic Quên Mật Khẩu, đồng thời thêm cột `password_changed_at` vào bảng `users`. Bạn hãy mở MySQL/DataGrip/DBeaver và chạy 2 lệnh SQL sau vào database `FitnessProject`:

**Lệnh 1: Thêm bảng EmailOTP**
(Bạn có thể chạy thẳng file `data/Add_EmailOTP_Table.sql` hoặc copy đoạn code sau)

```sql
USE `FitnessProject`;

DROP TABLE IF EXISTS `EmailOTP`;

CREATE TABLE `EmailOTP` (
    `Id` CHAR(36) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `OTPCode` VARCHAR(10) NOT NULL,
    `Purpose` VARCHAR(50) NOT NULL,
    `ExpiredAt` DATETIME NOT NULL,
    `IsUsed` BIT(1) NOT NULL DEFAULT b'0',
    `AttemptCount` INT NOT NULL DEFAULT 0,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `IX_EmailOTP_Email` ON `EmailOTP` (`Email`);
CREATE INDEX `IX_EmailOTP_Purpose` ON `EmailOTP` (`Purpose`);
CREATE INDEX `IX_EmailOTP_ExpiredAt` ON `EmailOTP` (`ExpiredAt`);
```

**Lệnh 2: Thêm cột vào bảng Users**
```sql
ALTER TABLE FitnessProject.users ADD COLUMN password_changed_at DATETIME NULL;
```

---

## 2. Cập Nhật Biến Môi Trường (Backend `.env`)

Hệ thống giờ đây có khả năng gửi Email OTP, do đó cần phải bổ sung các cấu hình SMTP vào file `.env` nằm trong thư mục `backend/`. 

Mở file `backend/.env` của bạn lên và copy đoạn sau chèn vào cuối file (có thể dùng chung email này của dự án để test nội bộ):

```env
# ===========================
# Gmail SMTP
# ===========================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ecodanarentcar@gmail.com
SMTP_PASS=vubq phgb ytwf nrdf
SMTP_FROM=AISTHEA <ecodanarentcar@gmail.com>
SMTP_ENABLE_SSL=true

# OTP Configs
OTP_LENGTH=6
OTP_EXPIRE_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_MAX_VERIFY_ATTEMPTS=5
```

---

## 3. Cài Đặt Lại Packages

**Frontend (Cập nhật SWR, Zustand, v.v):**
```bash
cd frontend
npm install
npm run dev
```

**Backend (.NET Core):**
Do có thêm các Service (như OTP Service, Email Service) nên hãy rebuild lại:
```bash
cd backend
dotnet restore
dotnet build
cd src/FitnessTrainingSystem.WebApi
dotnet run
```

---

## 4. Test Lại Các Tính Năng Mới
Sau khi chạy lên, team có thể test các flow sau đã hoạt động hoàn thiện:
1. **Quên Mật Khẩu**: Đã có thể gửi OTP qua email và tạo mật khẩu mới.
2. **Đăng nhập & Profile**: 
   - Vào mục Profile, hệ thống đã lấy đúng tên người dùng (VD: `Dat Le Profile`).
   - Ảnh đại diện Google (Avatar) đã hiển thị chính xác.
   - Nút `Two-Factor Auth` tạm thời bị ẩn.
3. **Đổi mật khẩu trong Profile**: Tính năng đã được map đầy đủ auth token (`Bearer {token}`) và không còn bị lỗi 401 Unauthorized hay báo sai mật khẩu hiện tại nữa.

Chúc team code vui vẻ! 🚀
