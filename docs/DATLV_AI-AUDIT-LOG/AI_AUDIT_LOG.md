# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | SWP391 |
| Mã môn học | SWP391 |
| Lớp | SE20A02 |
| Học kỳ | SU26 |
| Tên bài tập / Project | AI Audit Project - Fitness Training System |
| Tên sinh viên / Nhóm | Lê Văn Đạt (Dat Le) / Group 06 |
| MSSV / Danh sách MSSV | (Sinh viên tự điền MSSV) |
| Giảng viên hướng dẫn | (Sinh viên tự điền tên GV) |
| Ngày bắt đầu | 21/06/2026 |
| Ngày hoàn thành | 01/07/2026 |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [ ] ChatGPT
- [ ] Gemini
- [ ] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [x] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác: ....................................

---

## 3. Mục tiêu sử dụng AI

Mô tả ngắn gọn sinh viên/nhóm đã sử dụng AI để hỗ trợ những công việc nào.

Ví dụ:
- Phân tích yêu cầu bài toán
- Gợi ý ý tưởng giải pháp
- Thiết kế database
- Thiết kế giao diện
- Viết code mẫu
- Debug lỗi
- Tối ưu code
- Viết test case
- Kiểm tra bảo mật
- Viết báo cáo
- Chuẩn bị slide thuyết trình
- Tìm hiểu công nghệ mới

### Mô tả mục tiêu sử dụng AI

```text
Sử dụng AI chủ yếu cho nhánh `feature/dat/fe` để thiết kế giao diện Frontend (React, Chakra UI) cho các tính năng: Workout Setup, Profile, Đổi mật khẩu, Quên mật khẩu. Đồng thời sử dụng AI để xây dựng các API Backend tương ứng (.NET Core), xử lý Database (MySQL, Entity Framework) và debug các lỗi phức tạp như lỗi cấu hình, lỗi HTTP 401/404, lỗi NullReferenceException của thư viện Pomelo. Cuối cùng dùng AI để tổng hợp báo cáo Audit Log và tài liệu hướng dẫn (UPDATE_GUIDE.md) cho team.
```

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 30/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Phát triển tính năng hiển thị danh sách bài tập, tạo Modal xem chi tiết video, xử lý luồng Daily/Weekly. |
| Phần việc liên quan | Frontend |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- Phát triển giao diện Workout Setup (chia Daily / Weekly).
- Làm UI danh sách bài tập, làm nút Mark Done / Skip.
- Thêm Popup hiển thị video hướng dẫn dạng Youtube Player (size to, tỷ lệ 16:9).
- Tích hợp thumbnail hình ảnh ngoài danh sách bài tập.
```

#### 4.2. Kết quả AI gợi ý

Tóm tắt nội dung AI đã trả lời hoặc gợi ý.

```text
AI cung cấp mã nguồn (React, Chakra UI) để:
- Sửa đổi WorkoutSetup thêm bước chọn Plan Type.
- Sửa đổi WorkoutResults & ExerciseCard để thay đổi trạng thái UI mờ/sáng tuỳ theo trạng thái Done/Skip/Active.
- Tạo ExerciseModal nhúng iframe video.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

Mô tả rõ phần nào được sử dụng lại từ gợi ý của AI.

```text
Sử dụng toàn bộ cấu trúc Component được AI sinh ra, bao gồm logic xử lý state trong `useWorkoutStore` và giao diện Chakra UI.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với gợi ý ban đầu của AI.

```text
Kiểm tra lại UI trên trình duyệt, feedback lại cho AI để sửa lỗi hiển thị màu sắc và bổ sung ảnh thumbnail cho danh sách cũ.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit sau khi hoàn tất) |
| File liên quan | `WorkoutSetup.tsx`, `WorkoutResults.tsx`, `workout.ts`, `workoutExercises.ts` |
| Screenshot | Đã kiểm tra UI ngoài thực tế |
| Kết quả chạy/test | Thành công |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

Sinh viên/nhóm học được gì sau lần sử dụng AI này?

```text
Học được cách ứng dụng AspectRatio của Chakra UI để render video 16:9, cũng như xử lý logic render danh sách liên tiếp với trạng thái (active, done, skipped).
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 30/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Phát triển API BodyMetrics và thiết kế lại trang Profile |
| Phần việc liên quan | Fullstack (Frontend & Backend) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- Viết API C# để cập nhật BodyMetrics (thêm chiều cao, cân nặng, tính BMI).
- Xoá bước nhập thông tin cơ bản trong Workout Setup (giảm từ 5 bước xuống 4 bước).
- Code lại giao diện trang Profile, thêm Popup để người dùng nhập Body Metrics.
- Chạy npm run build và fix các lỗi build (TypeScript).
```

#### 4.2. Kết quả AI gợi ý

```text
AI cung cấp mã nguồn cho cả Backend và Frontend:
- Cập nhật entity `BodyMetric` và chạy EF migrations.
- Tạo `BodyMetricsController`, `IBodyMetricService` và `BodyMetricService`.
- Sửa lại file `WorkoutSetup.tsx` để xóa bước thông tin cơ bản.
- Tạo component `BodyMetricsModal.tsx` và code trang `Profile.tsx` với Chakra UI.
- Fix lỗi cấu hình Axios gây ra URL trùng lặp `/api/api/...`.
- Fix toàn bộ lỗi unused variables khi chạy `npm run build`.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ source code Entity, API Controller, các Service ở Backend và toàn bộ giao diện React, Chakra UI được AI thiết kế cho Profile.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Phát hiện lỗi 404 khi POST API, kiểm tra tab Network và yêu cầu AI sửa lại đường dẫn Axios cũng như restart lại tiến trình Backend server.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit sau khi hoàn tất) |
| File liên quan | `Profile.tsx`, `BodyMetricsModal.tsx`, `BodyMetricService.cs`, `BodyMetricsController.cs` |
| Screenshot | Đã kiểm tra UI Profile thực tế hiển thị form điền BMI |
| Kết quả chạy/test | Thành công, API gọi trả về 200 OK |
| Link video demo | N/A |
| Ghi chú khác | Build dự án thành công không còn lỗi |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách debug lỗi HTTP 404 khi kết hợp giữa Frontend và Backend, cũng như cách AI đọc lỗi log từ console để fix TypeScript build error (unused imports, type-only import).
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 01/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Sửa lỗi 401 Unauthorized ở Profile, hiển thị Avatar Google, fix lỗi NullReferenceException của EF Core, và viết file UPDATE_GUIDE.md |
| Phần việc liên quan | Frontend / Backend / Database / Report |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
"không đăng nhập được là vì sao tìm hiểu nguyên nhân cho tôi... lấy tên user chưa đúng, không lấy được ảnh avatar google... thêm tài liệu UPDATE_GUIDE.md để team pull code về chạy trơn tru"
```

#### 4.2. Kết quả AI gợi ý

```text
AI phát hiện lỗi do frontend đang đọc token sai (dùng Zustand để lưu nhưng lại gọi localStorage.getItem('token')). AI cũng phát hiện bug phiên bản của Pomelo 8.0.2 khi chạy trên .NET 9 gây lỗi khởi động DB. AI gợi ý nâng lên .NET 9, map trường AvatarUrl và tạo task list chi tiết.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- Sử dụng đoạn code fix Token ở `user.ts` (lấy từ `useAuthStore`).
- Dùng đoạn code map `AvatarUrl` vào `UserProfileDto.cs` ở Backend.
- Sử dụng file tài liệu hướng dẫn `UPDATE_GUIDE.md` AI viết cho team.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Nhóm đã chủ động yêu cầu AI ẩn các button tính năng chưa hoàn thiện (Two-Factor Auth) trên giao diện, và yêu cầu AI bổ sung link tải .NET 9 SDK chi tiết vào document để đảm bảo toàn đội có thể cài đặt chính xác. Tự merge nhánh `feature/dat/fe` vào `dev`.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 926f38b (trên nhánh dev) |
| File liên quan | `user.ts`, `UserController.cs`, `Profile.tsx`, `UPDATE_GUIDE.md` |
| Screenshot | UI hiển thị tên và Avatar Google |
| Kết quả chạy/test | Profile tải đầy đủ thông tin, hiển thị Avatar Google, đổi mật khẩu thành công. Backend chạy ổn định không lỗi EF Core. |
| Link video demo | N/A |
| Ghi chú khác | Update hệ thống lên .NET 9 |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI phân tích lỗi rất nhanh (từ lỗi logic FE đến lỗi thư viện hệ thống BE) và đưa ra các giải pháp toàn diện. Rất hữu ích trong việc tiết kiệm thời gian debug hệ thống phức tạp.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  | X |  | Phân tích lỗi logic và luồng OTP |
| Viết user story/use case | X |  |  |  | Tự phân tích luồng người dùng |
| Thiết kế database |  |  | X |  | AI viết SQL Schema cho bảng EmailOTP |
| Thiết kế kiến trúc hệ thống |  | X |  |  |  |
| Thiết kế giao diện |  |  |  | X | AI thiết kế giao diện React + Chakra UI |
| Code frontend |  |  |  | X | AI code logic Auth, Profile, BodyMetrics |
| Code backend |  |  |  | X | AI code API Controller, DTO, Service |
| Debug lỗi |  |  |  | X | AI phân tích log lỗi 401, 404, EF Core |
| Viết test case | X |  |  |  | Chưa áp dụng Automation Test |
| Kiểm thử sản phẩm |  | X |  |  | Sinh viên tự test tay, báo lỗi cho AI |
| Tối ưu code |  |  | X |  | Xoá code rác, fix type error |
| Viết báo cáo |  |  |  | X | Viết AI_AUDIT_LOG và UPDATE_GUIDE |
| Làm slide thuyết trình | X |  |  |  | (Sinh viên tự làm) |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | Nâng cấp .NET 9 nhưng không nâng cấp thư viện Pomelo tương thích. | Khởi động Backend bị sập lỗi `NullReferenceException` ở `OnModelFinalizing`. | Đọc log console, yêu cầu AI update thư viện lên `9.0.0-preview` và viết tài liệu `UPDATE_GUIDE.md` cho team. |
| 2 | Code frontend API gọi sai endpoint do baseURL bị config lặp `/api/api/...`. | Bật tab Network trên Chrome xem HTTP status (404 Not Found). | Gửi thông tin lỗi mạng cho AI để AI xoá đi phần `/api` dư thừa trong URL. |
| 3 | AI đọc auth-token sai do nhầm lẫn giữa localStorage mặc định và Zustand persist. | Test gọi API lấy Profile nhưng nhận lỗi 401 Unauthorized và dữ liệu trống. | Chỉ rõ cho AI việc project dùng thư viện `zustand` lưu trong key `auth-storage` để AI viết lại logic `getAuthHeaders`. |

---

## 7. Kiểm chứng kết quả AI

Mô tả cách sinh viên/nhóm kiểm tra lại kết quả do AI gợi ý.

### Nội dung kiểm chứng

```text
- Chạy thử chương trình liên tục (`npm run dev` ở nhánh `feature/dat/fe` và `dotnet run`).
- Bật tab Network và Console (Chrome DevTools) để kiểm tra các Payload Request và Response của API xem AI trả về đúng status 200 OK hay không.
- Tự tay test các form nhập liệu (đăng nhập, đổi mật khẩu, quên mật khẩu, cập nhật BMI) bằng các kịch bản đúng và kịch bản cố tình làm sai để kiểm tra logic validate.
- Truy vấn trực tiếp xuống Database (MySQL Workbench) để đảm bảo AI đã lưu đúng thông tin (mã OTP, password hash, Avatar URL).
- Đọc và review code AI sinh ra trước khi commit và merge vào nhánh `dev` để chắc chắn không vi phạm cấu trúc sẵn có của nhóm.
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến.

```text
- Tự làm: Cung cấp yêu cầu hệ thống, mô tả kịch bản lỗi, trực tiếp test sản phẩm trên trình duyệt, review code, và quản lý git nhánh `feature/dat/fe` lên `dev`.
- AI hỗ trợ: Sinh code Frontend/Backend cực nhanh, thiết kế UI đẹp mắt bằng Chakra UI, phân tích lỗi sâu từ Error Log hệ thống.
- Cải tiến: Ngăn AI xoá nhầm code cũ, phát hiện các bug liên quan đến thư viện/phiên bản hệ thống để bắt AI sửa lại hoặc nâng cấp. Yêu cầu AI làm thêm document cho team.
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
| Lê Văn Đạt | (Tự điền) | Code giao diện FE, API Auth/Profile, Review & Merge Code nhánh `feature/dat/fe` | Có | Git commit trên `feature/dat/fe` & `dev` |
| (Thành viên 2) | (Tự điền) | (Bổ sung nhiệm vụ thực tế) | Có/Không | (Bổ sung sau) |
| (Thành viên 3) | (Tự điền) | (Bổ sung nhiệm vụ thực tế) | Có/Không | (Bổ sung sau) |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI tăng tốc độ lập trình lên đáng kể (đặc biệt là việc dựng UI bằng Chakra UI mất nhiều thời gian chia grid/flex). Cung cấp boilerplate chuẩn cho Backend (.NET Core). Cực kỳ hữu ích trong quá trình debug, AI đọc lỗi từ Terminal và giải thích cặn kẽ nguyên nhân gốc rễ (như lỗi thư viện Pomelo).
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
- Không sử dụng toàn bộ cấu trúc kết nối DB nếu AI đề xuất thay thế `ApplicationDbContext` có sẵn của nhóm. 
- Yêu cầu AI xoá/ẩn các button (Two-Factor Auth) sinh dư thừa không đúng flow hiện tại.
- Không nghe theo AI nếu AI cố xoá nhầm các component chưa liên quan trên Frontend.
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Kiểm tra chéo 3 vòng: 
1) Xem UI hiển thị trên trình duyệt có đúng thiết kế không. 
2) Theo dõi log API (Network tab) xem dữ liệu gửi lên đúng cấu trúc không. 
3) Mở Database check xem dữ liệu lưu trữ vật lý (như password hash) có hợp lý hay chưa.
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Khó khăn nhất là fix lỗi tương thích phiên bản thư viện (Bug của EF Core MySQL với .NET 9). Đây là lỗi ngầm dưới framework, nếu tra Google/StackOverflow sẽ tốn vài ngày để tìm ra. Ngoài ra, việc code chay toàn bộ giao diện Responsive bằng Chakra UI cũng sẽ mất hàng tuần.
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Học được quy trình thiết kế và tích hợp Fullstack chặt chẽ giữa Frontend (React/Zustand/ChakraUI) và Backend (.NET Core/EF Core). Nắm rõ hơn về bảo mật JWT, mã hóa Password, và xử lý luồng Quên mật khẩu qua Email OTP.
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
Sử dụng AI có trách nhiệm là không copy-paste mù quáng mà phải hiểu từng dòng code AI sinh ra. Phải có khả năng tự kiểm chứng (testing), tự phát hiện khi AI "ảo giác" (hallucinate) làm sập hệ thống (ví dụ sập DB). Phải biết viết tài liệu (như file UPDATE_GUIDE) để đảm bảo đồng bộ môi trường với team thay vì chỉ biết code một mình trên máy cá nhân.
```

---

## 10. Cam kết học thuật

Sinh viên/nhóm cam kết rằng:

- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.
- Hiểu rằng việc sử dụng AI không khai báo có thể ảnh hưởng đến kết quả đánh giá.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Lê Văn Đạt | 01/07/2026 |
