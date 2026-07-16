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

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 02/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Đồng bộ hoá giao diện (UI Consistency), tái cấu trúc (Refactor) Header Component, và dọn dẹp code. |
| Phần việc liên quan | Frontend |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
"sửa lại chiều cao của các oo nhập liệu cho đúng với dự án nó đang bị nhỏ... ở đâu có notification, setting, avatar thì lấy giống ở dashboard cho tôi... avatar ở dashboard chưa đúng... xoá search, notification, và avatar, 3 cái trên đó luôn"
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất kế hoạch (Implementation Plan):
1. Chuẩn hoá toàn bộ chiều cao các thẻ Input (Quên mật khẩu, Đổi mật khẩu) về 42px.
2. Tạo shared component `HeaderActions.tsx` gọi trực tiếp `getProfile` API để hiển thị đúng Avatar Google và tái sử dụng cho Dashboard, PT Booking.
3. Xoá trắng HStack thừa thãi ở trang Profile theo yêu cầu.
4. Tự động chạy TypeScript check (`tsc`) và xoá các import dư thừa (unused variables) để tránh lỗi build.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Chấp thuận toàn bộ code do AI sửa đổi (Refactor) bao gồm component `HeaderActions.tsx` và các sửa đổi UI trên `Dashboard.tsx`, `PTBooking.tsx`, `Profile.tsx`, `ChangePasswordModal.tsx`, `ForgotPassword.tsx`.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Bổ sung yêu cầu chi tiết ("xoá search, notification, và avatar, 3 cái trên đó luôn") khi AI hỏi lại trong file Plan để tránh việc AI xoá nhầm các component khác của trang Profile. Trực tiếp chạy lệnh git để commit và lưu trữ lại phiên bản hoàn chỉnh.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit sau khi hoàn tất Lần 4) |
| File liên quan | `HeaderActions.tsx`, `Dashboard.tsx`, `Profile.tsx`, `PTBooking.tsx`, `ForgotPassword.tsx` |
| Screenshot | Giao diện Header đồng nhất, Avatar hiển thị chuẩn xác ở mọi trang |
| Kết quả chạy/test | Build thành công, `npm run build` không báo lỗi unused variables |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được tư duy Component hóa (Componentization) trong React. Thay vì copy-paste cùng một khối UI (chuông, settings, avatar) ở nhiều trang, việc gom lại thành một Shared Component giúp dễ bảo trì và đồng bộ. 
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 04/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Tích hợp Database thực tế cho luồng Tập Luyện (Workout Flow), lưu trữ Session, History và sửa lỗi Routing. |
| Phần việc liên quan | Fullstack (Frontend & Backend) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
"tôi có bảng này dùng thật vào dự án luôn cho tôi hiện tại tạo bài tập ra nó chưa có dữ liệu, xử lý và gắn vào luồn hiện tại. và làm chức năng lưu lích sử bài tập của người dụng lại cho tôi... Complete Workout xong nó nhảy ra trang chủ luôn... thanh tiếng trình phải đầy có nghĩa phải tập đủ hoặc đáng dấu đã tập xong thì mới bấm nút complete workout được. và bấm xong thì nhảy đến tab nutrition."
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và thực hiện Implementation Plan chi tiết:
1. Backend: Dựng `WorkoutService.cs`, `WorkoutsController.cs` và các DTOs để INSERT trực tiếp `WorkoutPlan` và `WorkoutSession` xuống bảng MySQL thông qua Entity Framework.
2. Frontend: Viết `api/workouts.ts` gọi backend. Cập nhật `useWorkoutStore.ts` lưu `activePlanId`, `activeSessionId`.
3. Cập nhật `WorkoutResults.tsx`: Thêm logic kiểm tra điều kiện `completedCount === exercises.length` để khoá/mở nút "Complete Workout".
4. Fix lỗi nhảy trang chủ: Sửa sai lệch Route từ `/member/nutrition` sang `/nutrition` để không dính Default Catch-all Route `*`.
5. Cập nhật `Progress.tsx`: Call API fetch dữ liệu History thật từ DB lên thay vì dùng UI tĩnh.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ logic tương tác Entity Framework của Backend do AI thiết kế và các luồng gọi axios (API calls) trên Frontend. Chấp thuận phương pháp phân luồng logic session: Create Plan -> Start Session -> Complete Session.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Sinh viên theo dõi tab Console, phân tích các bug 404 và báo lại cho AI để AI nhận diện được đó là log rác cũ hoặc lỗi do Backend chưa restart. Yêu cầu AI chuyển hướng từ Progress sang Nutrition theo đúng flow UX mới của dự án.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit thay đổi Database Workout) |
| File liên quan | `WorkoutService.cs`, `WorkoutsController.cs`, `WorkoutResults.tsx`, `Progress.tsx`, `router-container.tsx` |
| Screenshot | Đã kiểm tra UI: Nút Complete Workout bị mờ, dữ liệu lịch sử hiện đúng ngày và danh sách bài tập. |
| Kết quả chạy/test | Thành công, dữ liệu WorkoutSessionDetails ghi nhận chính xác xuống MySQL Workbench. |
| Link video demo | N/A |
| Ghi chú khác | Flow AI tạo bài tập đã gắn chặt chẽ vào DB |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách debug lỗi Routing trong React Router v6 (nhầm path dẫn đến rơi vào Route Catch-all và bị đẩy về trang chủ). Hiểu rõ quy trình map dữ liệu phức tạp từ 1 chiều (Plan -> PlanExercises) sang 1 chiều song song (Session -> SessionDetails) bằng Entity Framework.
```

---

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Xây dựng chức năng Nutrition: Tính toán mục tiêu Calories/Macros hàng ngày (BMR, TDEE), lưu log hydration và setup DB mock data |
| Phần việc liên quan | Fullstack (React UI + .NET Core API + MySQL) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- "tôi muốn bạn làm 2 phần cho tôi là phần calories, và hydation, dailysummary, phân tích ra cần nạp bao nhiêu protein, cab, fat, uống bao nhiêu nước, dựa trên thể trạng profile."
- "cho tôi plan để duyệt nữa nhé /feature"
- "chạy DB cho đồng bộ đi nào /commit"
```

#### 4.2. Kết quả AI gợi ý

```text
- Thiết kế Database bảng DailyNutritionLog lưu targets & consumed macros.
- Viết API GET /api/nutrition/daily và POST /api/nutrition/water.
- Tự động tính toán BMR (Mifflin-St Jeor), TDEE, lượng nước mục tiêu theo thông số BodyMetrics.
- Tích hợp giao diện Frontend Nutrition với React + ChakraUI, fetch data bằng SWR.
- Tạo file dữ liệu mẫu `mock_data.sql` và fix các bug 404, lỗi liên quan đến React StrictMode.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- Tái sử dụng 100% cấu trúc Backend (Controller, Service, Entity).
- Giữ nguyên các công thức tính toán y khoa (BMR, TDEE, Macros) từ gợi ý của AI.
- Sử dụng UI components và SWR fetching do AI sinh ra.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Cung cấp DB file mock_data.sql mẫu của project để AI đồng bộ thay vì tự generate data random.
- Yêu cầu sửa lỗi logic khi bấm tăng giảm ngày trên UI (bị nhảy 2 ngày do React StrictMode).
- Yêu cầu AI fix lỗi lệch cấu trúc schema khi insert `exercises` mock data.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | c9c75ad |
| File liên quan | DailyNutritionLog.cs, NutritionService.cs, NutritionController.cs, Nutrition.tsx, mock_data.sql |
| Screenshot | Đã check UI các vòng tròn phần trăm hiển thị data chuẩn |
| Kết quả chạy/test | Build FE/BE pass |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách áp dụng công thức BMR/TDEE vào code logic Backend. Thấy được sức mạnh của việc đồng bộ DB mock. Rút kinh nghiệm việc React StrictMode gây double render làm sai logic cộng trừ Date.
```

---

### Lần sử dụng AI số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Thiết kế và tích hợp Hệ thống thông báo Realtime đa chiều dùng SignalR (Backend) và React Context (Frontend). |
| Phần việc liên quan | Fullstack (SignalR, BackgroundServices, Controllers, React Context, Dropdown UI) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Thiết kế chức năng thông báo realtime:
1. PT nhận thông báo khi Admin yêu cầu request tạo bài tập mới, cảnh báo deadline sắp hết và thông báo duyệt/từ chối.
2. Admin nhận thông báo khi PT nộp/upload bài tập.
3. User (Member) nhận thông báo nhắc nhở uống nước định kỳ (tương tác trực tiếp trên thông báo để log nước + chuyển trang Nutrition).
Thông báo phải realtime, hiển thị trên toàn bộ các trang.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và sinh toàn bộ mã nguồn cho:
- NotificationHub, INotificationService & NotificationService ở Backend.
- Hai Hosted Service chạy ngầm: ExerciseDeadlineReminderService (quét deadline PT) và WaterReminderBackgroundService (quét nhắc nhở uống nước cho Member).
- API Controller và thiết lập CORS credentials, JWT query string extractor.
- React Context NotificationContext để tự kết nối SignalR, lưu trữ danh sách thông báo và số lượng chưa đọc.
- Component dùng chung NotificationBell thay thế chuông tĩnh ở cả giao diện Admin và Member/PT.
- Nút Test Water Reminder nổi góc màn hình để trigger kiểm thử nhanh.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ cấu trúc Service, Hub, Background Services, React Context, và UI dropdown của NotificationBell.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Chuyển lệnh cài đặt từ npm sang pnpm vì dự án sử dụng pnpm-lock.yaml.
- Thêm FrameworkReference cho Microsoft.AspNetCore.App vào file .csproj của Infrastructure để nhận diện các lớp SignalR và BackgroundService.
- Sửa lỗi build TypeScript do unused import FiBell trong AdminPrimitives.tsx.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | N/A |
| File liên quan | NotificationHub.cs, NotificationService.cs, ExerciseDeadlineReminderService.cs, WaterReminderBackgroundService.cs, NotificationsController.cs, NotificationBell.tsx, NotificationContext.tsx, App.tsx, HeaderActions.tsx, AdminPrimitives.tsx, Program.cs, DependencyInjection.cs, FitnessTrainingSystem.Infrastructure.csproj |
| Screenshot | Chuông thông báo hiển thị số lượng chưa đọc, bấm "I drank a glass" tự động log nước và chuyển trang |
| Kết quả chạy/test | Build FE/BE thành công, SignalR connect và push realtime chuẩn xác |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Nắm được cách thức triển khai realtime với SignalR trong dự án thực tế. Biết cách tích hợp tương tác trực tiếp lên thông báo (uống nước) và tối ưu hóa trải nghiệm người dùng trên tất cả các trang. Học hỏi thêm cách xử lý background task chạy ngầm hiệu quả trong .NET Core.
```

---

### Lần sử dụng AI số 8

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Sửa lỗi phân quyền chéo vai trò, lệch múi giờ hiển thị thông báo và triển khai cấu hình giờ Thức/Ngủ cho người dùng với cơ chế tính tần suất nhắc nước động. |
| Phần việc liên quan | Fullstack (Database, Backend, BackgroundServices, Frontend UI & API) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- "đang ở admin bấm test water reminder thì vẫn nhận đưuocj thông báo và bấm vào thì lại nhảy sang user, fix lại lỗi, hiển thị thông báo đúng role, chặt chẽ, không ở role này mà hiển thị thoong báo role kia."
- "láy thời gian đúng real -time cho tôi"
- "ở phần user thông báo nhắc nhở uống nước phải là tự động. chia đúng thời gian chuẩn trừ thời gian ngủ buổi tối đến sáng là không thông báo uóng nước. uống phải tính từ lúc thức dậy đến trước lúc đi ngủ. thêm UI thời gian bắt đầu và kết thúc nhắc nhở uống nước. là trong thời gian đó thì phải tính toán nhắc nhở thời gian uống nước sao cho đúng với thẻ trạng mà đã tính số lượng nước. cho tôi plan của bạn về việc này đẻ tôi củng cố cho đúng logic của tôi"
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và triển khai:
- Sửa đổi phân quyền chéo: Ẩn nút test nước với Admin/PT, áp dụng [Authorize(Roles = "Member,MEMBER")] ở backend controller, và thêm role check trước khi chuyển trang ở client.
- Múi giờ: Tự động chèn hậu tố 'Z' vào chuỗi thời gian UTC trần từ DB để trình duyệt parse đúng giờ địa phương Việt Nam (GMT+7).
- Cấu hình giờ Thức/Ngủ: Thêm các cột WaterReminderStartTime/EndTime vào User entity, tạo EF migration, viết API lưu cài đặt, tự động bật popup modal khi user chưa cấu hình, hiển thị panel cấu hình và tính toán tần suất nhắc nước động trong WaterReminderBackgroundService.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ logic phân quyền, format múi giờ, modal popup, sidebar panel và thuật toán lập lịch nhắc nước động.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Chạy lệnh dotnet ef migrations & database update để cập nhật DB vật lý, build kiểm tra TypeScript compile lỗi unused import.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 78d5b981ae67b60af43751fda748eb369a60a549 |
| File liên quan | User.cs, NutritionService.cs, NutritionController.cs, WaterReminderBackgroundService.cs, Nutrition.tsx, NotificationBell.tsx, NotificationTestWidget.tsx, UpdateReminderSettingsDto.cs, NutritionDtos.cs, INutritionService.cs |
| Screenshot | Giao diện panel cấu hình giờ nhắc nước, Modal popup tự động hiện ra |
| Kết quả chạy/test | Build pass thành công, database migration chạy chuẩn |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Cải thiện khả năng phân quyền hệ thống chặt chẽ hơn. Hiểu thêm về xử lý timezone và kỹ thuật lập lịch background động dựa trên tương tác thực tế của người dùng.
```

---

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 02/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Đồng bộ hoá giao diện (UI Consistency), tái cấu trúc (Refactor) Header Component, và dọn dẹp code. |
| Phần việc liên quan | Frontend |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
"sửa lại chiều cao của các oo nhập liệu cho đúng với dự án nó đang bị nhỏ... ở đâu có notification, setting, avatar thì lấy giống ở dashboard cho tôi... avatar ở dashboard chưa đúng... xoá search, notification, và avatar, 3 cái trên đó luôn"
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất kế hoạch (Implementation Plan):
1. Chuẩn hoá toàn bộ chiều cao các thẻ Input (Quên mật khẩu, Đổi mật khẩu) về 42px.
2. Tạo shared component `HeaderActions.tsx` gọi trực tiếp `getProfile` API để hiển thị đúng Avatar Google và tái sử dụng cho Dashboard, PT Booking.
3. Xoá trắng HStack thừa thãi ở trang Profile theo yêu cầu.
4. Tự động chạy TypeScript check (`tsc`) và xoá các import dư thừa (unused variables) để tránh lỗi build.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Chấp thuận toàn bộ code do AI sửa đổi (Refactor) bao gồm component `HeaderActions.tsx` và các sửa đổi UI trên `Dashboard.tsx`, `PTBooking.tsx`, `Profile.tsx`, `ChangePasswordModal.tsx`, `ForgotPassword.tsx`.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Bổ sung yêu cầu chi tiết ("xoá search, notification, và avatar, 3 cái trên đó luôn") khi AI hỏi lại trong file Plan để tránh việc AI xoá nhầm các component khác của trang Profile. Trực tiếp chạy lệnh git để commit và lưu trữ lại phiên bản hoàn chỉnh.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit sau khi hoàn tất Lần 4) |
| File liên quan | `HeaderActions.tsx`, `Dashboard.tsx`, `Profile.tsx`, `PTBooking.tsx`, `ForgotPassword.tsx` |
| Screenshot | Giao diện Header đồng nhất, Avatar hiển thị chuẩn xác ở mọi trang |
| Kết quả chạy/test | Build thành công, `npm run build` không báo lỗi unused variables |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được tư duy Component hóa (Componentization) trong React. Thay vì copy-paste cùng một khối UI (chuông, settings, avatar) ở nhiều trang, việc gom lại thành một Shared Component giúp dễ bảo trì và đồng bộ. 
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 04/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Tích hợp Database thực tế cho luồng Tập Luyện (Workout Flow), lưu trữ Session, History và sửa lỗi Routing. |
| Phần việc liên quan | Fullstack (Frontend & Backend) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
"tôi có bảng này dùng thật vào dự án luôn cho tôi hiện tại tạo bài tập ra nó chưa có dữ liệu, xử lý và gắn vào luồn hiện tại. và làm chức năng lưu lích sử bài tập của người dụng lại cho tôi... Complete Workout xong nó nhảy ra trang chủ luôn... thanh tiếng trình phải đầy có nghĩa phải tập đủ hoặc đáng dấu đã tập xong thì mới bấm nút complete workout được. và bấm xong thì nhảy đến tab nutrition."
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và thực hiện Implementation Plan chi tiết:
1. Backend: Dựng `WorkoutService.cs`, `WorkoutsController.cs` và các DTOs để INSERT trực tiếp `WorkoutPlan` và `WorkoutSession` xuống bảng MySQL thông qua Entity Framework.
2. Frontend: Viết `api/workouts.ts` gọi backend. Cập nhật `useWorkoutStore.ts` lưu `activePlanId`, `activeSessionId`.
3. Cập nhật `WorkoutResults.tsx`: Thêm logic kiểm tra điều kiện `completedCount === exercises.length` để khoá/mở nút "Complete Workout".
4. Fix lỗi nhảy trang chủ: Sửa sai lệch Route từ `/member/nutrition` sang `/nutrition` để không dính Default Catch-all Route `*`.
5. Cập nhật `Progress.tsx`: Call API fetch dữ liệu History thật từ DB lên thay vì dùng UI tĩnh.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ logic tương tác Entity Framework của Backend do AI thiết kế và các luồng gọi axios (API calls) trên Frontend. Chấp thuận phương pháp phân luồng logic session: Create Plan -> Start Session -> Complete Session.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Sinh viên theo dõi tab Console, phân tích các bug 404 và báo lại cho AI để AI nhận diện được đó là log rác cũ hoặc lỗi do Backend chưa restart. Yêu cầu AI chuyển hướng từ Progress sang Nutrition theo đúng flow UX mới của dự án.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | (Commit thay đổi Database Workout) |
| File liên quan | `WorkoutService.cs`, `WorkoutsController.cs`, `WorkoutResults.tsx`, `Progress.tsx`, `router-container.tsx` |
| Screenshot | Đã kiểm tra UI: Nút Complete Workout bị mờ, dữ liệu lịch sử hiện đúng ngày và danh sách bài tập. |
| Kết quả chạy/test | Thành công, dữ liệu WorkoutSessionDetails ghi nhận chính xác xuống MySQL Workbench. |
| Link video demo | N/A |
| Ghi chú khác | Flow AI tạo bài tập đã gắn chặt chẽ vào DB |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách debug lỗi Routing trong React Router v6 (nhầm path dẫn đến rơi vào Route Catch-all và bị đẩy về trang chủ). Hiểu rõ quy trình map dữ liệu phức tạp từ 1 chiều (Plan -> PlanExercises) sang 1 chiều song song (Session -> SessionDetails) bằng Entity Framework.
```

---

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Xây dựng chức năng Nutrition: Tính toán mục tiêu Calories/Macros hàng ngày (BMR, TDEE), lưu log hydration và setup DB mock data |
| Phần việc liên quan | Fullstack (React UI + .NET Core API + MySQL) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- "tôi muốn bạn làm 2 phần cho tôi là phần calories, và hydation, dailysummary, phân tích ra cần nạp bao nhiêu protein, cab, fat, uống bao nhiêu nước, dựa trên thể trạng profile."
- "cho tôi plan để duyệt nữa nhé /feature"
- "chạy DB cho đồng bộ đi nào /commit"
```

#### 4.2. Kết quả AI gợi ý

```text
- Thiết kế Database bảng DailyNutritionLog lưu targets & consumed macros.
- Viết API GET /api/nutrition/daily và POST /api/nutrition/water.
- Tự động tính toán BMR (Mifflin-St Jeor), TDEE, lượng nước mục tiêu theo thông số BodyMetrics.
- Tích hợp giao diện Frontend Nutrition với React + ChakraUI, fetch data bằng SWR.
- Tạo file dữ liệu mẫu `mock_data.sql` và fix các bug 404, lỗi liên quan đến React StrictMode.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- Tái sử dụng 100% cấu trúc Backend (Controller, Service, Entity).
- Giữ nguyên các công thức tính toán y khoa (BMR, TDEE, Macros) từ gợi ý của AI.
- Sử dụng UI components và SWR fetching do AI sinh ra.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Cung cấp DB file mock_data.sql mẫu của project để AI đồng bộ thay vì tự generate data random.
- Yêu cầu sửa lỗi logic khi bấm tăng giảm ngày trên UI (bị nhảy 2 ngày do React StrictMode).
- Yêu cầu AI fix lỗi lệch cấu trúc schema khi insert `exercises` mock data.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | c9c75ad |
| File liên quan | DailyNutritionLog.cs, NutritionService.cs, NutritionController.cs, Nutrition.tsx, mock_data.sql |
| Screenshot | Đã check UI các vòng tròn phần trăm hiển thị data chuẩn |
| Kết quả chạy/test | Build FE/BE pass |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách áp dụng công thức BMR/TDEE vào code logic Backend. Thấy được sức mạnh của việc đồng bộ DB mock. Rút kinh nghiệm việc React StrictMode gây double render làm sai logic cộng trừ Date.
```

---

### Lần sử dụng AI số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Thiết kế và tích hợp Hệ thống thông báo Realtime đa chiều dùng SignalR (Backend) và React Context (Frontend). |
| Phần việc liên quan | Fullstack (SignalR, BackgroundServices, Controllers, React Context, Dropdown UI) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Thiết kế chức năng thông báo realtime:
1. PT nhận thông báo khi Admin yêu cầu request tạo bài tập mới, cảnh báo deadline sắp hết và thông báo duyệt/từ chối.
2. Admin nhận thông báo khi PT nộp/upload bài tập.
3. User (Member) nhận thông báo nhắc nhở uống nước định kỳ (tương tác trực tiếp trên thông báo để log nước + chuyển trang Nutrition).
Thông báo phải realtime, hiển thị trên toàn bộ các trang.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và sinh toàn bộ mã nguồn cho:
- NotificationHub, INotificationService & NotificationService ở Backend.
- Hai Hosted Service chạy ngầm: ExerciseDeadlineReminderService (quét deadline PT) và WaterReminderBackgroundService (quét nhắc nhở uống nước cho Member).
- API Controller và thiết lập CORS credentials, JWT query string extractor.
- React Context NotificationContext để tự kết nối SignalR, lưu trữ danh sách thông báo và số lượng chưa đọc.
- Component dùng chung NotificationBell thay thế chuông tĩnh ở cả giao diện Admin và Member/PT.
- Nút Test Water Reminder nổi góc màn hình để trigger kiểm thử nhanh.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ cấu trúc Service, Hub, Background Services, React Context, và UI dropdown của NotificationBell.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Chuyển lệnh cài đặt từ npm sang pnpm vì dự án sử dụng pnpm-lock.yaml.
- Thêm FrameworkReference cho Microsoft.AspNetCore.App vào file .csproj của Infrastructure để nhận diện các lớp SignalR và BackgroundService.
- Sửa lỗi build TypeScript do unused import FiBell trong AdminPrimitives.tsx.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | N/A |
| File liên quan | NotificationHub.cs, NotificationService.cs, ExerciseDeadlineReminderService.cs, WaterReminderBackgroundService.cs, NotificationsController.cs, NotificationBell.tsx, NotificationContext.tsx, App.tsx, HeaderActions.tsx, AdminPrimitives.tsx, Program.cs, DependencyInjection.cs, FitnessTrainingSystem.Infrastructure.csproj |
| Screenshot | Chuông thông báo hiển thị số lượng chưa đọc, bấm "I drank a glass" tự động log nước và chuyển trang |
| Kết quả chạy/test | Build FE/BE thành công, SignalR connect và push realtime chuẩn xác |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Nắm được cách thức triển khai realtime với SignalR trong dự án thực tế. Biết cách tích hợp tương tác trực tiếp lên thông báo (uống nước) và tối ưu hóa trải nghiệm người dùng trên tất cả các trang. Học hỏi thêm cách xử lý background task chạy ngầm hiệu quả trong .NET Core.
```

---

### Lần sử dụng AI số 8

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Sửa lỗi phân quyền chéo vai trò, lệch múi giờ hiển thị thông báo và triển khai cấu hình giờ Thức/Ngủ cho người dùng với cơ chế tính tần suất nhắc nước động. |
| Phần việc liên quan | Fullstack (Database, Backend, BackgroundServices, Frontend UI & API) |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
- "đang ở admin bấm test water reminder thì vẫn nhận đưuocj thông báo và bấm vào thì lại nhảy sang user, fix lại lỗi, hiển thị thông báo đúng role, chặt chẽ, không ở role này mà hiển thị thoong báo role kia."
- "láy thời gian đúng real -time cho tôi"
- "ở phần user thông báo nhắc nhở uống nước phải là tự động. chia đúng thời gian chuẩn trừ thời gian ngủ buổi tối đến sáng là không thông báo uóng nước. uống phải tính từ lúc thức dậy đến trước lúc đi ngủ. thêm UI thời gian bắt đầu và kết thúc nhắc nhở uống nước. là trong thời gian đó thì phải tính toán nhắc nhở thời gian uống nước sao cho đúng với thẻ trạng mà đã tính số lượng nước. cho tôi plan của bạn về việc này đẻ tôi củng cố cho đúng logic của tôi"
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất và triển khai:
- Sửa đổi phân quyền chéo: Ẩn nút test nước với Admin/PT, áp dụng [Authorize(Roles = "Member,MEMBER")] ở backend controller, và thêm role check trước khi chuyển trang ở client.
- Múi giờ: Tự động chèn hậu tố 'Z' vào chuỗi thời gian UTC trần từ DB để trình duyệt parse đúng giờ địa phương Việt Nam (GMT+7).
- Cấu hình giờ Thức/Ngủ: Thêm các cột WaterReminderStartTime/EndTime vào User entity, tạo EF migration, viết API lưu cài đặt, tự động bật popup modal khi user chưa cấu hình, hiển thị panel cấu hình và tính toán tần suất nhắc nước động trong WaterReminderBackgroundService.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ logic phân quyền, format múi giờ, modal popup, sidebar panel và thuật toán lập lịch nhắc nước động.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Chạy lệnh dotnet ef migrations & database update để cập nhật DB vật lý, build kiểm tra TypeScript compile lỗi unused import.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 78d5b981ae67b60af43751fda748eb369a60a549 |
| File liên quan | User.cs, NutritionService.cs, NutritionController.cs, WaterReminderBackgroundService.cs, Nutrition.tsx, NotificationBell.tsx, NotificationTestWidget.tsx, UpdateReminderSettingsDto.cs, NutritionDtos.cs, INutritionService.cs |
| Screenshot | Giao diện panel cấu hình giờ nhắc nước, Modal popup tự động hiện ra |
| Kết quả chạy/test | Build pass thành công, database migration chạy chuẩn |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Cải thiện khả năng phân quyền hệ thống chặt chẽ hơn. Hiểu thêm về xử lý timezone và kỹ thuật lập lịch background động dựa trên tương tác thực tế của người dùng.
```

---

---

### Lần sử dụng AI số 9

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 08/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Sửa lỗi không hiển thị Lịch sử bài tập và danh sách Bài tập (Workout) |
| Phần việc liên quan | Backend / Database |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
- tại sao lịch sử bài tập của tôi không hiển thị nữa. ở role user.
- nó chưa hiển thị được bài tập nữa vì thế nên không có lịch sử bài tập là đúng rồi
- đây nó lỗi đâu có bài tập đâu
```

#### 4.2. Kết quả AI gợi ý

```text
- AI đọc log lỗi Backend, phát hiện ra lỗi System.InvalidCastException khi EF Core ánh xạ cột difficulty kiểu INT trong database sang string.
- Phát hiện lỗi EF Core sinh ra shadow property `user_id` do cấu hình mapping navigation chưa đúng.
- Xóa cấu hình `.HasConversion<string>()` cho `Exercise.Difficulty` và chỉnh sửa `.WithMany(u => u.CreatedExercises)`.
- Ánh xạ thuộc tính `DurationMinutes` vào cột `duration`.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Giữ nguyên toàn bộ các thay đổi sửa lỗi EF Core mapping của AI trong ApplicationDbContext và Exercise.cs.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Cung cấp screenshot giao diện lỗi cho AI để khoanh vùng và xác nhận lỗi danh sách bài tập.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 40c88051b1ad8cb8fd3127f510e1e39a827f4980 |
| File liên quan | Exercise.cs, ApplicationDbContext.cs |
| Screenshot | Đã cung cấp lỗi UI "0 Exercises" |
| Kết quả chạy/test | Build pass, Backend lấy danh sách bài tập thành công |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
- Quá trình merge code có thể sinh ra các lỗi ngầm về Database Schema mismatch so với Code (đặc biệt là Enum mapping).
- Việc đọc backend server log là rất quan trọng để phát hiện ra nguyên nhân gốc rễ thay vì chỉ nhìn vào UI bị lỗi.
```

---

### Lần sử dụng AI số 12

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 14/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Thêm Scalar API Reference thay thế Swagger UI cho .NET 9 |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
- "BE có swagger đâu" — yêu cầu thêm giao diện API docs cho backend
- "có đâu tôi thấy gì đâu" — phản hồi Swagger UI vẫn không hoạt động
- "vẫn không được" — tiếp tục yêu cầu fix
```

#### 4.2. Kết quả AI gợi ý

```text
- Ban đầu thử cài Swashbuckle.AspNetCore (Swagger UI truyền thống) nhưng không tương thích tốt với .NET 9 OpenAPI mới.
- Chuyển sang dùng Scalar.AspNetCore — thư viện API docs hiện đại, tương thích native với .NET 9 MapOpenApi().
- Cấu hình MapScalarApiReference() trong Program.cs để tạo giao diện API docs tại /scalar/v1.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- Cấu hình Scalar.AspNetCore trong Program.cs (using directive + MapScalarApiReference)
- Thêm package reference vào .csproj
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Sinh viên kiểm tra và phản hồi rằng Swagger UI không hoạt động, yêu cầu tìm giải pháp thay thế.
- Tự test trên trình duyệt để xác nhận kết quả.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 7de96b23db92899152bce1def1f7b3343b925e5d |
| File liên quan | Program.cs, FitnessTrainingSystem.WebApi.csproj |
| Screenshot | N/A |
| Kết quả chạy/test | Build succeeded — 0 Warning(s), 0 Error(s) |
| Link video demo | N/A |
| Ghi chú khác | Scalar API docs truy cập tại http://localhost:5007/scalar/v1 |

#### 4.6. Nhận xét cá nhân/nhóm

```text
- .NET 9 đã thay đổi cách tích hợp API docs — Swashbuckle không còn là default, cần dùng Scalar hoặc các thư viện tương thích OpenAPI mới.
- Scalar có giao diện hiện đại hơn Swagger UI và tích hợp tốt hơn với MapOpenApi() của .NET 9.
```

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
| Lê Văn Đạt | DE180983 | Code giao diện FE, API Auth/Profile, Review & Merge Code nhánh `feature/dat/fe` | Có | Git commit trên `feature/dat/fe` & `dev` |
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

---

### Lần sử dụng AI số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 08/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Xóa quyền CRUD của PT trên giao diện và Tích hợp API cho User Dashboard |
| Phần việc liên quan | Fullstack |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
- ở phần role PT chỉ cho xem danh sách user, danh sách bào tập chứ không có crud như role admin đưuocj sửa lại cho tôi /feature
- code tiếp phần dashboard của user cho tôi. phải hoạt đồng được chuẩn /refactor hỏi tôi về chức năng của các tab thì cứ hỏi tôi nhé.
```

#### 4.2. Kết quả AI gợi ý

```text
- Ẩn các nút Add User, Edit, Delete và Create Exercise đối với tài khoản có role PT (roleId != 1).
- Xây dựng DashboardSummaryDto, DashboardService, DashboardController để trả về dữ liệu Calories, Streak, và Macros từ Database.
- Kết nối API `GET /api/dashboard/summary` vào giao diện Frontend Dashboard bằng `useSWR`.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng toàn bộ mã nguồn Backend (Controller, Service, DTO) và mã nguồn Frontend cho phần ẩn nút và kết nối dữ liệu.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Phản hồi cho AI về việc giữ nguyên các chức năng (UI) chưa phát triển và giải thích logic tính Current Streak và Calories.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 0b5a897 |
| File liên quan | backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/DashboardSummaryDto.cs, backend/src/FitnessTrainingSystem.Application/Interfaces/IDashboardService.cs, backend/src/FitnessTrainingSystem.Infrastructure/DependencyInjection.cs, backend/src/FitnessTrainingSystem.Infrastructure/Services/DashboardService.cs, backend/src/FitnessTrainingSystem.WebApi/Controllers/DashboardController.cs, frontend/src/features/dashboard/components/DashboardWidgets.tsx, frontend/src/pages/admin/AdminUsers.tsx, frontend/src/pages/admin/AdminWorkouts.tsx, frontend/src/pages/member/Dashboard.tsx |
| Screenshot | Đã kiểm tra UI thực tế |
| Kết quả chạy/test | Build pass 100% FE & BE |
| Link video demo | N/A |
| Ghi chú khác | N/A |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc thiết kế Dashboard API tập trung trả về một DTO tổng hợp duy nhất giúp tối ưu hiệu suất, tránh việc Frontend phải gọi nhiều API nhỏ lẻ.
```

---

### Lần sử dụng AI số 11

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 09/07/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Phát triển logic tự tạo bài tập dựa trên thông tin người dùng, tối ưu UI chuyển bài, và fix Database Khóa Ngoại |
| Phần việc liên quan | Fullstack (React FE + .NET Core BE + MySQL) |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
- "đã có phần lịch sử tôi biết vì sao nó đang lấy theo ngày, thêm filter để lấy lịch sử bài tập theo tuần, theo tháng nữa /feature"
- "logic tạo bài tập phải phù hợp và thực tế từ yêu cầu người dùng đã chọn trước đó... và mở bài tập lên chuển bài mà không cần đóng popup lại, thêm nút chuyển bài sau khi bấm complete"
- "ở phần DB của tôi phần creator_id đang trống lại thiếu chỉnh lại DB cho đúng PT thêm bài cho tôi"
```

#### 4.2. Kết quả AI gợi ý

```text
- Viết kế hoạch tính toán logic cho bài tập tự sinh (Sets, Reps, Thời gian nghỉ dựa trên Level và Goal).
- Sửa đổi UI của modal hiển thị bài tập để thêm nút `<` và `>` lướt bài tập.
- Đổi nút 'Complete' thành 'Complete & Next' để hoàn thành và xem ngay bài kế.
- Tạo Migration mới bằng EF Core để fix cấu trúc bảng `exercises` (Xóa bỏ `creator_id` thừa, đưa Foreign Key về đúng cột `created_by`).
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Toàn bộ logic tính toán trong `workoutExercises.ts`, UI cải tiến trong `WorkoutResults.tsx`, API filter thời gian tại Backend (`WorkoutService.cs`), và file EF Migration (`FixCreatorId.cs`).
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Yêu cầu AI cập nhật thêm luồng lọc bài tập theo chính xác nhóm cơ (body_group / muscles) do người dùng chọn, và chỉ định cụ thể các nút cần có trong UI Popup.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | ead4498 |
| File liên quan | workoutExercises.ts, WorkoutResults.tsx, ApplicationDbContextModelSnapshot.cs, FixCreatorId.cs, WorkoutsController.cs |
| Screenshot | Đã kiểm tra UI và MySQL Workbench Database |
| Kết quả chạy/test | FE build thành công (`npm run build`), BE build thành công (`dotnet build`), Database Update thành công |
| Link video demo | N/A |
| Ghi chú khác | DB Migration được update trực tiếp bằng command line. |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Cấu trúc Database do EF Core sinh ra cần phải theo dõi cẩn thận vì có thể phát sinh cột phụ nếu cấu hình Fluent API và Attributes không thống nhất.
Trải nghiệm UX/UI trên các luồng luyện tập cần được tối ưu hóa số lượng thao tác click cho người dùng.
```
