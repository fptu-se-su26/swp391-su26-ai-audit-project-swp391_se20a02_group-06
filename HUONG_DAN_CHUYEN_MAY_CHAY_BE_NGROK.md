# Hướng Dẫn Chi Tiết Chuyển Backend, Database & Ngrok Sang Máy Khác (Máy Luôn Mở)

Tài liệu này hướng dẫn chi tiết từng bước để đưa Backend (.NET 9), MySQL Database và Ngrok Tunnel sang một máy tính mới (máy luôn mở 24/7) để phục vụ Frontend đang chạy trên Vercel:
🌐 **Frontend Vercel:** [https://net-fit-rho.vercel.app](https://net-fit-rho.vercel.app)

> [!IMPORTANT]
> **Điểm mấu chốt quan trọng nhất:**  
> Toàn bộ Frontend trên Vercel đang kết nối tới URL Backend cố định:  
> `https://hammeringly-xerophytic-marcelino.ngrok-free.dev/api`  
> Do đó, khi sang máy mới, bạn chỉ cần chạy Ngrok với **cùng domain tĩnh này**, Frontend Vercel sẽ tự động kết nối sang máy mới ngay lập tức mà **KHÔNG CẦN chỉnh sửa biến môi trường hay redeploy trên Vercel**.

---

## I. Chuẩn Bị File Dữ Liệu (Đã Có Sẵn Trong Mã Nguồn)

Bạn không cần tự export database nữa vì tôi đã dump sẵn toàn bộ cơ sở dữ liệu mới nhất (gồm 28 bảng: Admin, PT, Member, Bài tập, Lịch tập, Đánh giá Reviews, Nước uống...):
📁 **File SQL:** `data/fitnessproject_latest.sql`

---

## II. Các Bước Thực Hiện Trên Máy Mới (Làm Lần Lượt 6 Bước)

### Bước 1: Cài đặt phần mềm cần thiết trên máy mới
Đảm bảo máy mới đã cài đặt 4 công cụ sau:
1. **Git:** Để clone mã nguồn.
2. **.NET 9 SDK:** Tải từ trang chủ Microsoft: [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0).
   - Kiểm tra bằng lệnh: `dotnet --version` (kết quả hiển thị `9.x.x`).
3. **MySQL Server:**
   - **Trên macOS:** `brew install mysql` rồi chạy `brew services start mysql`.
   - **Trên Windows:** Tải và cài đặt MySQL Community Server từ trang chủ MySQL.
4. **Ngrok:** Tải từ [https://ngrok.com/download](https://ngrok.com/download).

---

### Bước 2: Clone source code về máy mới
Mở Terminal / PowerShell trên máy mới và chạy:
```bash
git clone https://github.com/datlee27/NetFit.git
cd NetFit
git checkout main
```
*(Hoặc clone repository của nhóm `swp391-su26-ai-audit-project-swp391_se20a02_group-06` và checkout nhánh `production`).*

---

### Bước 3: Tạo Database & Import Dữ Liệu SQL
1. **Khởi động dịch vụ MySQL trên máy mới:**
   - macOS: `brew services start mysql`
   - Windows: Kiểm tra dịch vụ MySQL trong `services.msc` đã ở trạng thái `Running`.

2. **Chạy lệnh tạo Database và import file `data/fitnessproject_latest.sql`:**
   ```bash
   # 1. Tạo database (nhập mật khẩu root MySQL của máy mới khi được hỏi)
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fitnessproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

   # 2. Import dữ liệu từ file sql có sẵn trong repo
   mysql -u root -p fitnessproject < data/fitnessproject_latest.sql
   ```
3. **Kiểm tra nhanh xem import thành công chưa:**
   ```bash
   mysql -u root -p -e "USE fitnessproject; SHOW TABLES;"
   ```
   *(Thấy hiển thị danh sách 28 bảng như `users`, `product_packages`, `website_reviews`, `exercises`... là thành công 100%).*

---

### Bước 4: Tạo và cấu hình file `backend/.env`
1. Tại thư mục gốc của dự án, sao chép file mẫu:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Mở file `backend/.env` bằng VS Code hoặc Notepad:
   - Tìm dòng đầu tiên:
     ```env
     ConnectionStrings__DefaultConnection=Server=localhost;Port=3306;Database=fitnessproject;User=root;Password=Levandat2004^;
     ```
   - **Thay đổi mật khẩu:** Sửa `Levandat2004^` thành **mật khẩu root MySQL của máy mới**.
   - Các dòng khác (JWT, Google OAuth, Gmail SMTP OTP, Gemini API Key, Cloudinary...) giữ nguyên theo file mẫu vì đã được điền sẵn chính xác.
3. Lưu file `backend/.env`.

---

### Bước 5: Cấu hình Ngrok với Domain Cố Định
Để Vercel tự động nhận Backend từ máy mới, bạn phải dùng chung tài khoản Ngrok có domain tĩnh `hammeringly-xerophytic-marcelino.ngrok-free.dev`.

1. **Thêm Authtoken tài khoản Ngrok vào máy mới:**
   ```bash
   ngrok config add-authtoken <NGROK_AUTHTOKEN_CỦA_BẠN>
   ```
   *(Lấy token tại [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)).*

2. **Khởi động Ngrok trỏ về cổng 5007:**
   Mở một cửa sổ Terminal riêng (Terminal 1) và chạy lệnh:
   ```bash
   ngrok http --domain=hammeringly-xerophytic-marcelino.ngrok-free.dev 5007
   ```
   Khi thấy dòng sau là thành công:
   ```text
   Forwarding   https://hammeringly-xerophytic-marcelino.ngrok-free.dev -> http://localhost:5007
   ```
   > ⚠️ **LƯU Ý:** Luôn giữ cửa sổ Terminal này mở để Ngrok duy trì đường truyền.

---

### Bước 6: Khởi động Backend WebApi
Mở cửa sổ Terminal thứ 2 (Terminal 2) trên máy mới và chạy:
```bash
cd backend/src/FitnessTrainingSystem.WebApi

# Khởi chạy Backend trên cổng 5007
dotnet run --urls http://localhost:5007
```

Khi Terminal hiển thị dòng:
```text
Now listening on: http://localhost:5007
Application started. Press Ctrl+C to shut down.
```
tức là Backend đã sẵn sàng phục vụ!

---

## III. Kiểm Tra Kết Nối (Health Check)

Sau khi hoàn tất Bước 5 và Bước 6 trên máy mới, mở một tab Terminal thứ 3 hoặc trình duyệt để kiểm tra:

1. **Kiểm tra Backend qua Ngrok:**
   ```bash
   curl -H "ngrok-skip-browser-warning: 1" https://hammeringly-xerophytic-marcelino.ngrok-free.dev/
   ```
   *Kết quả mong muốn:*
   ```json
   {"status":"healthy","message":"Fitness Training System WebAPI is running!","timestamp":"..."}
   ```

2. **Kiểm tra Database đã đọc được dữ liệu qua API chưa:**
   ```bash
   curl https://hammeringly-xerophytic-marcelino.ngrok-free.dev/api/product-packages
   ```
   *Kết quả mong muốn:* Trả về JSON danh sách các gói tập (1-Month, 3-Month, 1-Year).

3. **Kiểm tra Frontend trên Vercel:**
   - Mở trình duyệt truy cập: [https://net-fit-rho.vercel.app](https://net-fit-rho.vercel.app)
   - Thử bấm **Đăng nhập bằng Google** hoặc đăng nhập tài khoản thường:
     - Admin: `admin@fitness.com` / `Admin@123`
     - Member: `member1@fitness.com` / `Member@123`
   - Kiểm tra các trang: Pricing (xem các gói tập), Dashboard (thấy phần nước uống Hydration), v.v.

---

## IV. Tắt Backend Ở Máy Cũ
Sau khi máy mới đã chạy ổn định và Vercel kết nối bình thường:
1. Quay lại máy tính cũ này.
2. Bấm `Ctrl + C` ở cửa sổ chạy `dotnet run` và `ngrok` để tắt tiến trình (hoặc đóng Terminal).
3. Từ bây giờ máy mới sẽ đảm nhận toàn bộ việc xử lý API và Database 24/7.
