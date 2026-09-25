# Hướng Dẫn Vận Hành Backend, Database & Ngrok Cho Frontend Deployed (Vercel)

Tài liệu này hướng dẫn chi tiết cách khởi động lại hệ thống (MySQL DB, Backend .NET, Ngrok), kiểm tra kết nối với Frontend trên Vercel, và các bước khắc phục tất cả các lỗi thường gặp.

---

## I. Thứ Tự Khởi Động Chuẩn (Làm Theo 3 Bước)

### Bước 1: Khởi động Database (MySQL)
Mở Terminal và kiểm tra/khởi động dịch vụ MySQL:
```bash
# Khởi động dịch vụ MySQL (nếu dùng Homebrew trên macOS)
brew services start mysql

# Hoặc kiểm tra xem MySQL đã chạy trên cổng 3306 chưa
lsof -i :3306
```
> **Thông tin kết nối DB:**  
> - User: `root`  
> - Password: `Levandat2004^` (hoặc mật khẩu trong file `.env`)  
> - Database name: `FitnessProject`  

---

### Bước 2: Khởi động Backend (.NET WebApi)
Chạy Backend tại cổng **5007**:
```bash
cd /Users/mac/Subject/SWP-projectFitness/swp391-su26-ai-audit-project-swp391_se20a02_group-06/backend/src/FitnessTrainingSystem.WebApi

# Chạy Backend trực tiếp
dotnet run --urls http://localhost:5007
```
Khi thấy dòng log sau là Backend đã sẵn sàng:
```text
Now listening on: http://localhost:5007
Application started. Press Ctrl+C to shut down.
```

---

### Bước 3: Khởi động Ngrok (Tạo đường hầm kết nối Internet)
Mở một tab Terminal mới và chạy:
```bash
ngrok http 5007
```
Ngrok sẽ cung cấp một đường link công khai (Public URL) dạng:
`https://hammeringly-xerophytic-marcelino.ngrok-free.dev`

---

## II. Kiểm Tra Nhanh Trạng Thái Kết Nối (Health Check)

Sau khi bật xong 3 bước trên, bạn có thể mở Terminal gõ các lệnh sau để test nhanh:

1. **Kiểm tra Backend local:**
   ```bash
   curl http://localhost:5007/
   # Kết quả mong muốn: {"status":"healthy","message":"Fitness Training System WebAPI is running!",...}
   ```

2. **Kiểm tra kết nối qua Ngrok:**
   ```bash
   curl -H "ngrok-skip-browser-warning: 1" https://hammeringly-xerophytic-marcelino.ngrok-free.dev/
   # Kết quả: Trả về JSON status: healthy
   ```

3. **Kiểm tra Database thông qua API:**
   ```bash
   curl https://hammeringly-xerophytic-marcelino.ngrok-free.dev/api/product-packages
   # Kết quả: Trả về danh sách 3 gói tập (1-Month, 3-Month, 1-Year)
   ```

---

## III. Bảng Xử Lý Các Lỗi Thường Gặp & Cách Khắc Phục Chuẩn

### 1. Lỗi màn hình đen `HTTP ERROR 404` khi mở link Ngrok trên Chrome
- **Hiện tượng:** Truy cập `https://<ngrok-url>.ngrok-free.dev/` thì Chrome báo "Không thể tìm thấy trang... HTTP ERROR 404".
- **Nguyên nhân:** Đường dẫn gốc `/` không có endpoint xử lý (Backend chỉ có các route `/api/...`).
- **Cách xử lý:** 
  - Trong `Program.cs` đã được thêm endpoint gốc `app.MapGet("/", ...)`. Nếu gặp lại lỗi này, hãy đảm bảo Backend đã build và chạy bản mới nhất.
  - Luôn kiểm tra API bằng đường dẫn đầy đủ: `https://<ngrok-url>/api/product-packages`.

---

### 2. FE Vercel báo `Failed to load packages` hoặc vào trong bị trắng màn hình / lỗi dữ liệu
- **Hiện tượng:** 
  - Ngoài trang Pricing hiện chữ đỏ: `Failed to load packages.`
  - Đăng nhập được nhưng khi vào Dashboard, Nutrition, Profile thì không có dữ liệu hoặc quay tròn.
- **Nguyên nhân cốt lõi:**
  - Đây là cơ chế của **Ngrok Free (mã lỗi `ERR_NGROK_6024`)**.
  - Khi FE trên Vercel gọi AJAX sang Ngrok, trình duyệt Chrome chặn cookie bên thứ ba (Third-party cookie), làm Ngrok trả về trang **HTML cảnh báo màu xanh** thay vì dữ liệu JSON của Backend. FE đọc HTML bị lỗi cú pháp nên báo lỗi.
- **Cách xử lý chuẩn 100%:**
  - **Cách 1 (Vĩnh viễn):** Đảm bảo file `frontend/src/lib/axios.ts` có header:
    ```typescript
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    }
    ```
    và trong interceptor:
    ```typescript
    config.headers['ngrok-skip-browser-warning'] = 'true';
    ```
    Sau đó push lên GitHub để Vercel build lại.
  - **Cách 2 (Mẹo kiểm tra nhanh trên máy):**
    Mở một tab Chrome mới, dán link `https://hammeringly-xerophytic-marcelino.ngrok-free.dev/api/product-packages`. Nếu thấy trang Ngrok có nút xanh **"Visit Site"**, bấm vào đó một lần, rồi quay lại Vercel bấm **Cmd + Shift + R**.

---

### 3. Lỗi CORS (`Blocked by CORS policy: No 'Access-Control-Allow-Origin'`)
- **Hiện tượng:** F12 Console trên trình duyệt báo lỗi đỏ liên quan đến CORS khi gọi API.
- **Nguyên nhân:** Domain Frontend deploy (ví dụ: `https://net-fit-rho.vercel.app`) chưa được cấp phép trong Backend.
- **Cách xử lý:**
  Mở `backend/src/FitnessTrainingSystem.WebApi/Program.cs` và đảm bảo chính sách CORS dùng `SetIsOriginAllowed`:
  ```csharp
  builder.Services.AddCors(options =>
  {
      options.AddPolicy("AllowFrontend", policy =>
          policy.SetIsOriginAllowed(_ => true) // Cho phép tất cả domain Vercel/Localhost
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
  });
  ```
  Sau khi sửa, nhớ tắt và chạy lại Backend.

---

### 4. Lỗi cổng bị chiếm dụng (`Port 5007 already in use` hoặc `Address already in use`)
- **Hiện tượng:** Chạy `dotnet run` bị báo lỗi cổng 5007 đã có tiến trình khác sử dụng.
- **Cách xử lý:** Chạy lệnh sau để giải phóng cổng ngay lập tức:
  ```bash
  lsof -ti :5007 | xargs kill -9
  ```

---

### 5. Link Ngrok bị đổi URL mới (khi tắt Ngrok bật lại)
- **Hiện tượng:** Bật lại Ngrok nhận được một link mới khác với link cũ.
- **Cách xử lý:**
  1. Copy link mới từ cửa sổ Ngrok (ví dụ: `https://xxxx.ngrok-free.dev`).
  2. Vào trang quản lý **Vercel Project Settings** -> mục **Environment Variables**.
  3. Cập nhật biến `VITE_API_URL`:
     ```env
     VITE_API_URL=https://xxxx.ngrok-free.dev/api
     ```
  4. Bấm **Redeploy** bản mới nhất trên Vercel để FE nhận đường dẫn API mới.

---

## IV. Tóm Tắt Lệnh Khởi Động Nhanh (Cheatsheet)

Mở 2 cửa sổ Terminal:

| Cửa sổ | Thư mục | Lệnh thực thi |
| :--- | :--- | :--- |
| **Terminal 1 (Backend)** | `backend/src/FitnessTrainingSystem.WebApi` | `dotnet run --urls http://localhost:5007` |
| **Terminal 2 (Ngrok)** | Bất kỳ đâu | `ngrok http 5007` |

*(Trước khi chạy nhớ đảm bảo MySQL đã bật qua lệnh `brew services start mysql`).*
