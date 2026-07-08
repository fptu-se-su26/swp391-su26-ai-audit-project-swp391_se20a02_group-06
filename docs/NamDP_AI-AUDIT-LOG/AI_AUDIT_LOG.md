# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Engineering Project |
| Mã môn học | SWP391 |
| Lớp | SE20A02 |
| Học kỳ | Summer 2026 (SU26) |
| Tên bài tập / Project | FitnessTrainingSystem – AI Audit Project |
| Tên sinh viên / Nhóm | Đặng Phương Nam – Group 6 |
| MSSV / Danh sách MSSV | DE190177 |
| Giảng viên hướng dẫn | QUANGLTN3 |
| Ngày bắt đầu | 20/05/2026 |
| Ngày hoàn thành | 02/07/2026 |

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

- [x] Thiết kế kiến trúc hệ thống
- [x] Viết code mẫu
- [x] Tìm hiểu công nghệ mới
- [x] Tối ưu code
- [x] Debug lỗi

### Mô tả mục tiêu sử dụng AI

```text
Là leader của nhóm, tôi sử dụng AI (Antigravity) chủ yếu trong hai giai đoạn có ảnh hưởng lớn nhất
đến toàn bộ project:

1. Giai đoạn khởi tạo: Xác định cấu trúc dự án theo Clean Architecture (Onion Model), bao gồm việc
   phân tách 4 layer (Domain, Application, Infrastructure, WebApi), thiết lập quy ước đặt tên file,
   và soạn thảo SOP (Standard Operating Procedure) để cả nhóm làm việc nhất quán.

2. Giai đoạn implementation: Xây dựng các chức năng liên quan đến người dùng (User functions), bao
   gồm hệ thống xác thực (Register, Login, Google OAuth), tạo JWT Token, và quản lý thông tin User.
```

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/05/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Xác định cấu trúc project theo Clean Architecture và soạn SOP cho toàn nhóm |
| Phần việc liên quan | Design / Backend |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
We are building a fitness training web application using ASP.NET Core 9 Web API with MySQL.
The project must follow Clean Architecture (Onion Architecture) with 4 layers: Domain,
Application, Infrastructure, and WebApi.

Please help me:
1. Define the exact folder and file structure for each layer.
2. List the naming conventions for entities, DTOs, interfaces, commands, queries, controllers.
3. Define the dependency rules (which layer can reference which).
4. Write an SOP document (AI_Workflow_BackEnd.md) that my team members and AI tools must
   follow when adding new features.
5. Scaffold the initial feature modules: Auth, Users, Exercises, Memberships, Nutrition,
   Schedules.

Tech stack: .NET 9, Pomelo EF Core MySQL 9.0.0, MediatR 14.1.0, FluentValidation 12.1.1.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã trả về:
- Sơ đồ 4-layer rõ ràng với luồng phụ thuộc một chiều:
  Domain ← Application ← Infrastructure ← WebApi
- Bảng quy ước đặt tên đầy đủ cho từng loại file (Entity, Enum, Interface, Command,
  Query, Controller, Middleware, v.v.)
- Danh sách ràng buộc kiến trúc: Domain và Application không được tham chiếu đến
  Infrastructure hay WebApi
- File AI_Workflow_BackEnd.md hoàn chỉnh gồm 6 phần: Architectural Rules, Tech Stack,
  Repository Layout, Step-by-Step Workflow, Verification Checkpoints, Common Pitfalls
- Scaffold cấu trúc thư mục cho 6 feature modules (Auth, Users, Exercises, Memberships,
  Nutrition, Schedules) dưới Application/Features/
- ApplicationDbContext với 20 DbSet tương ứng các entity của hệ thống
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- Toàn bộ file AI_Workflow_BackEnd.md được sử dụng trực tiếp làm tài liệu hướng dẫn
  cho cả nhóm và cho các phiên làm việc AI sau này.
- Cấu trúc 4 layer và quy tắc phụ thuộc được áp dụng ngay khi khởi tạo solution.
- Bảng quy ước đặt tên được theo chuẩn hóa xuyên suốt codebase.
- 6 feature module folders (Auth, Users, Exercises, Memberships, Nutrition, Schedules)
  được scaffold dưới Application/Features/.
- ApplicationDbContext với đầy đủ DbSet được tạo trong Infrastructure/Persistence/.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- Điều chỉnh danh sách DbSet trong ApplicationDbContext cho phù hợp với database schema
  thực tế của nhóm (thêm MealSchedule, MealScheduleItem, MuscleGroup, PtUploadRequest).
- Bổ sung logic xử lý quan hệ nhiều-nhiều cho Schedule (PT vs Member) trực tiếp trong
  OnModelCreating thay vì dùng auto-discovery configuration vì có self-referencing key.
- Thêm các ràng buộc HasConversion<string>() cho các Enum property (Exercise.Difficulty,
  ProductPackage.Type) sau khi test thấy EF Core không tự chuyển đổi enum sang string.
- Điều chỉnh UseCollation("utf8mb4_unicode_ci") để hỗ trợ tiếng Việt trong database.
- Tự viết thêm phần "Common Pitfalls" trong SOP dựa trên kinh nghiệm thực tế của nhóm.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| File liên quan | `backend/AI_Workflow_BackEnd.md` |
| File liên quan | `backend/src/FitnessTrainingSystem.Infrastructure/Persistence/ApplicationDbContext.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.Domain/Entities/` (22 entity files) |
| File liên quan | `backend/src/FitnessTrainingSystem.Application/Features/` (6 module folders) |
| Ghi chú khác | Cấu trúc này là nền tảng cho toàn bộ codebase của cả nhóm |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc dùng AI để thiết kế kiến trúc ngay từ đầu giúp cả nhóm tránh được nhiều sai lầm
phổ biến như circular dependency giữa các layer, hoặc đặt business logic vào controller.
Tuy nhiên, tôi nhận ra rằng cần đọc kỹ và hiểu từng quy tắc trước khi phổ biến cho nhóm,
vì AI đôi khi gợi ý theo best practice lý thuyết nhưng không hoàn toàn phù hợp với
timeline và scope thực tế của dự án sinh viên. Bài học lớn nhất: dùng AI để học kiến
trúc, nhưng quyết định cuối cùng về scope phải do con người đưa ra.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Xây dựng hệ thống xác thực người dùng (Register, Login, Google OAuth) và quản lý User |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Based on the Clean Architecture SOP in AI_Workflow_BackEnd.md, implement the full user
authentication system for FitnessTrainingSystem:

1. User entity already exists in Domain/Entities/User.cs with: Fullname, Email,
   PasswordHash, GoogleId, Phone, AvatarUrl, Gender, DateOfBirth, Status, RoleId.

2. Implement the following:
   a. IAuthService interface in Application/Interfaces/ with: RegisterAsync, LoginAsync,
      GoogleLoginAsync methods.
   b. AuthService implementation in Infrastructure/Services/ using BCrypt for password
      hashing and Google.Apis.Auth for Google token validation.
   c. IJwtTokenGenerator interface and JwtTokenGenerator implementation that returns a
      signed JWT with claims: userId, email, role.
   d. DTOs: RegisterRequestDto, LoginRequestDto, GoogleLoginRequestDto, AuthResponseDto.
   e. AuthController with POST /api/auth/register, /api/auth/login, /api/auth/google.
   f. UserController with GET /api/user that returns members (RoleId = 3).
   g. UserDto with fields: Id, Name, Email, Plan, JoinDate, Status.

Tech stack: ASP.NET Core 9, BCrypt.Net-Next, Google.Apis.Auth, System.IdentityModel.Tokens.Jwt.
Default member RoleId = 3.
```

#### 4.2. Kết quả AI gợi ý

```text
AI trả về đầy đủ các file:
- IAuthService.cs: interface với 3 phương thức RegisterAsync, LoginAsync, GoogleLoginAsync
- AuthService.cs: implementation với BCrypt password hashing, email duplicate check,
  password confirmation check, Google token validation bằng GoogleJsonWebSignature
- IJwtTokenGenerator.cs + JwtTokenGenerator.cs: tạo JWT với claims userId/email/role,
  thời hạn 7 ngày, ký bằng HMAC-SHA256
- RegisterRequestDto, LoginRequestDto, GoogleLoginRequestDto, AuthResponseDto
- AuthController với 3 endpoint: /register, /login, /google – đều dùng try/catch
- UserController với GET /api/user lọc theo RoleId == 3
- UserDto với Id, Name, Email, Plan, JoinDate, Status
- Hướng dẫn đăng ký service trong DependencyInjection.cs
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
- IAuthService.cs: sử dụng trực tiếp 3 signature phương thức.
- AuthService.cs: sử dụng toàn bộ logic Register (duplicate check, BCrypt hash, default
  RoleId = 3), Login (BCrypt verify, Google-linked account detection), GoogleLoginAsync
  (validate credential, auto-create user hoặc link Google ID).
- JwtTokenGenerator: sử dụng cấu trúc claims và signing algorithm.
- Tất cả 4 DTO classes.
- AuthController với 3 endpoint.
- UserController với endpoint GET /api/user.
- UserDto structure.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
- AuthService.GoogleLoginAsync: AI ban đầu set PasswordHash = null cho Google user,
  nhưng tôi đổi thành empty string ("") vì MySQL column có NOT NULL constraint – đây là
  lỗi AI không biết vì thiếu ngữ cảnh database schema cụ thể.
- AuthService: bổ sung logic "link Google account to existing user" (user đăng ký email
  trước, sau đó đăng nhập Google cùng email thì link GoogleId vào tài khoản cũ) – AI
  không tự gợi ý phần này.
- UserController: AI gợi ý inject ISender (MediatR) nhưng tôi giữ lại inject trực tiếp
  ApplicationDbContext vì UserController chưa có CQRS handler – đây là trade-off có chủ
  ý để tiết kiệm thời gian trong sprint đầu.
- Thêm comment inline trong UserController để ghi rõ ràng RoleId = 3 là "MEMBER" và
  TODO về Status field.
- Tự test toàn bộ 3 auth endpoint bằng Swagger/Postman và sửa lỗi config JWT trong
  appsettings.json mà AI không cung cấp.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| File liên quan | `backend/src/FitnessTrainingSystem.Application/Interfaces/IAuthService.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.Infrastructure/Services/AuthService.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.WebApi/Controllers/AuthController.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.WebApi/Controllers/UserController.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.Application/DTOs/Auth/` (4 DTO files) |
| File liên quan | `backend/src/FitnessTrainingSystem.Application/DTOs/User/UserDto.cs` |
| Kết quả chạy/test | API POST /api/auth/register, /api/auth/login, /api/auth/google hoạt động đúng |
| Kết quả chạy/test | API GET /api/user trả về danh sách Member đúng định dạng |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Lần sử dụng AI này cho thấy rõ tầm quan trọng của việc cung cấp ngữ cảnh đầy đủ trong
prompt. Khi tôi đưa cho AI cấu trúc entity hiện có, tech stack cụ thể và SOP document
đã soạn trước, AI trả về code rất sát với yêu cầu thực tế và ít phải sửa hơn so với
prompt chung chung. Tuy nhiên, lỗi về PasswordHash = null cho thấy AI không tự biết
các ràng buộc database – điều này nhắc nhở tôi rằng developer vẫn phải chịu trách nhiệm
kiểm tra tính đúng đắn của kết quả, đặc biệt là các edge case liên quan đến dữ liệu.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  | ✓ |  |  | Tự phân tích, AI hỗ trợ tổ chức |
| Viết user story/use case | ✓ |  |  |  | Tự làm |
| Thiết kế database |  |  | ✓ |  | AI gợi ý entity, tự điều chỉnh schema |
| Thiết kế kiến trúc hệ thống |  |  | ✓ |  | Clean Architecture SOP |
| Thiết kế giao diện | ✓ |  |  |  | Không phụ trách frontend |
| Code frontend | ✓ |  |  |  | Không phụ trách frontend |
| Code backend |  |  | ✓ |  | Auth system, User management |
| Debug lỗi |  | ✓ |  |  | Tự debug là chính |
| Viết test case | ✓ |  |  |  | Test thủ công qua Swagger |
| Kiểm thử sản phẩm | ✓ |  |  |  | Tự test |
| Tối ưu code |  | ✓ |  |  | AI review, tự quyết định áp dụng |
| Viết báo cáo |  | ✓ |  |  | Tự viết, AI hỗ trợ format |
| Làm slide thuyết trình | ✓ |  |  |  | Tự làm |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | AI set `PasswordHash = null` cho Google OAuth user nhưng MySQL column có NOT NULL constraint | Runtime exception khi gọi SaveChangesAsync | Đổi thành `PasswordHash = ""` (empty string) |
| 2 | AI không gợi ý logic link Google account vào existing email account | Review logic nghiệp vụ thủ công | Tự thêm else-if block kiểm tra `GoogleId == null` và link account |
| 3 | AI gợi ý inject ISender (MediatR) vào UserController nhưng chưa có handler | Compile error khi không có IRequest registered | Giữ lại inject ApplicationDbContext trực tiếp như giải pháp tạm |

---

## 7. Kiểm chứng kết quả AI

### Nội dung kiểm chứng

```text
1. Chạy thử chương trình: Sau khi implement, chạy dotnet build để đảm bảo zero compile
   error, sau đó dotnet run và test qua Swagger UI.

2. Kiểm tra output từng endpoint:
   - POST /api/auth/register: kiểm tra trả về token và userId đúng, email duplicate
     trả về 400 với message rõ ràng.
   - POST /api/auth/login: kiểm tra BCrypt verify đúng, Google-linked account trả về
     error message phù hợp.
   - POST /api/auth/google: dùng real Google credential từ frontend để test.
   - GET /api/user: kiểm tra chỉ trả về user có RoleId = 3.

3. Kiểm tra database: Query trực tiếp MySQL để xác nhận dữ liệu được lưu đúng,
   PasswordHash không phải plaintext, GoogleId được set đúng khi link account.

4. Review code: Đọc lại toàn bộ AuthService.cs line-by-line để đảm bảo không có
   security hole (e.g. timing attack trên password comparison).

5. Đối chiếu với tài liệu: Kiểm tra JwtTokenGenerator tạo claims đúng theo yêu cầu
   frontend (userId, email, role phải có trong payload).
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

```text
- Tự phân tích yêu cầu hệ thống và xác định scope cho từng sprint.
- Tự quyết định kiến trúc Clean Architecture sau khi tham khảo AI và đọc tài liệu.
- Tự chỉnh sửa và verify toàn bộ code AI gợi ý trước khi commit.
- Tự phát hiện và sửa lỗi PasswordHash null và logic link Google account.
- Tự soạn thảo SOP và distribute cho cả nhóm.
- Tự test API qua Swagger và Postman.
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
| Đặng Phương Nam | DE190177 | Leader, Backend Architecture, Auth System | Có | AI_Workflow_BackEnd.md, AuthService.cs, ApplicationDbContext.cs |
| Nguyễn Hoài Nam | SE183193 | Backend Member | Có | Xem NamNH_AI_AUDIT_LOG |
| Cao Điền Hưng | SE183792 | Backend Member | Có | Xem HungCD_AuditLOG |
| Giàng Anh Tuấn | DE190974 | Backend/Frontend Member | Có | Xem TuanGA_AI_AUDIT_LOG |
| Lê Văn Đạt | DE180983 | Backend Member | Có | Xem DATLV_AI-AUDIT-LOG |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI hỗ trợ nhiều nhất ở hai điểm: (1) Rút ngắn thời gian thiết kế kiến trúc từ vài ngày
xuống còn vài giờ bằng cách gợi ý cấu trúc Clean Architecture hoàn chỉnh ngay từ đầu;
(2) Sinh code boilerplate cho Auth system (BCrypt, JWT, Google OAuth) mà nếu tự viết từ
đầu sẽ mất rất nhiều thời gian tra cứu tài liệu và debug.
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
- AI gợi ý dùng MediatR ISender trong UserController nhưng tôi quyết định inject trực
  tiếp DbContext vì chưa có CQRS handler cho Users – ưu tiên tiến độ trong sprint đầu.
- AI gợi ý thêm Refresh Token mechanism ngay từ đầu nhưng tôi bỏ qua vì nằm ngoài
  scope MVP và sẽ làm phức tạp thêm khi nhóm đang học làm quen với kiến trúc mới.
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Đọc kỹ code line-by-line, chạy dotnet build, test qua Swagger UI, kiểm tra database
trực tiếp, và review với thành viên khác trong nhóm trước khi merge vào main branch.
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Thiết kế Clean Architecture từ đầu sẽ khó nhất – đây là lần đầu cả nhóm áp dụng Onion
Architecture trong thực tế, và việc tự tìm hiểu từ documentation rồi áp dụng nhất quán
cho cả nhóm sẽ mất rất nhiều thời gian và dễ bị inconsistent giữa các thành viên.
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Hiểu rõ hơn về tầm quan trọng của kiến trúc phần mềm ngay từ đầu dự án. Clean
Architecture không chỉ là lý thuyết – khi áp dụng thực tế, nó giúp cả nhóm làm việc
song song mà không conflict, dễ test từng layer riêng biệt, và dễ thêm tính năng mới
mà không ảnh hưởng đến code cũ.
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
AI là công cụ hỗ trợ rất hiệu quả khi được cung cấp ngữ cảnh đầy đủ và kết quả được
kiểm tra kỹ trước khi dùng. Không nên copy paste code AI mà không hiểu – đặc biệt với
authentication code vì lỗi ở đây ảnh hưởng trực tiếp đến bảo mật hệ thống. Mọi output
của AI đều cần được developer verify bằng kiến thức chuyên môn và test thực tế.
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
| Đặng Phương Nam – DE190177 | 02/07/2026 |
