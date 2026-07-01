# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học |  |
| Mã môn học |  |
| Lớp |  |
| Học kỳ |  |
| Tên bài tập / Project |  |
| Tên sinh viên / Nhóm |  |
| MSSV / Danh sách MSSV |  |
| Giảng viên hướng dẫn |  |
| Ngày bắt đầu |  |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [ ] ChatGPT
- [ ] Gemini
- [ ] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
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
Viết tại đây...

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
Nhóm đã chủ động yêu cầu AI ẩn các button tính năng chưa hoàn thiện (Two-Factor Auth) trên giao diện, và yêu cầu AI bổ sung link tải .NET 9 SDK chi tiết vào document để đảm bảo toàn đội có thể cài đặt chính xác.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Bổ sung sau) |
| File liên quan | `user.ts`, `UserController.cs`, `Profile.tsx`, `UPDATE_GUIDE.md` |
| Screenshot | (Bổ sung sau) |
| Kết quả chạy/test | Profile tải đầy đủ thông tin, hiển thị Avatar Google, đổi mật khẩu thành công. Backend chạy ổn định không lỗi EF Core. |
| Link video demo | (Bổ sung sau) |
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
| Phân tích yêu cầu |  |  |  |  |  |
| Viết user story/use case |  |  |  |  |  |
| Thiết kế database |  |  |  |  |  |
| Thiết kế kiến trúc hệ thống |  |  |  |  |  |
| Thiết kế giao diện |  |  |  |  |  |
| Code frontend |  |  |  |  |  |
| Code backend |  |  |  |  |  |
| Debug lỗi |  |  |  |  |  |
| Viết test case |  |  |  |  |  |
| Kiểm thử sản phẩm |  |  |  |  |  |
| Tối ưu code |  |  |  |  |  |
| Viết báo cáo |  |  |  |  |  |
| Làm slide thuyết trình |  |  |  |  |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

---

## 7. Kiểm chứng kết quả AI

Mô tả cách sinh viên/nhóm kiểm tra lại kết quả do AI gợi ý.

Có thể bao gồm:

- Chạy thử chương trình
- Viết test case
- So sánh với yêu cầu đề bài
- Kiểm tra output
- Đối chiếu tài liệu môn học
- Hỏi lại giảng viên
- Review cùng thành viên nhóm
- Kiểm tra lỗi bảo mật
- Kiểm tra bằng dữ liệu mẫu
- So sánh trước và sau khi dùng AI

### Nội dung kiểm chứng

```text
Viết tại đây...
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến.

```text
Viết tại đây...
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
Viết tại đây...
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
Viết tại đây...
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Viết tại đây...
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Viết tại đây...
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Viết tại đây...
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
Viết tại đây...
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
|  |  |
