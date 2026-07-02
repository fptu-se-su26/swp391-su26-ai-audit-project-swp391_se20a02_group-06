# Prompt Log

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
| Ngày cập nhật gần nhất | 02/07/2026 |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện project
FitnessTrainingSystem.

Hai nhóm prompt có ảnh hưởng lớn nhất đến project:
1. **Prompt thiết kế kiến trúc** – Xác định Clean Architecture, tạo SOP, scaffold cấu trúc dự án.
2. **Prompt xây dựng User functions** – Implement Auth (Register/Login/Google OAuth), JWT, UserController.

---

## 3. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng.

- [ ] ChatGPT
- [ ] Gemini
- [ ] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [x] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [ ] Công cụ khác: ....................................

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 | 20/05/2026 | Antigravity | Thiết kế kiến trúc Clean Architecture | "Build ASP.NET Core 9 API with Onion Architecture, define folder structure, naming conventions, SOP" | AI_Workflow_BackEnd.md, 4-layer structure, 6 feature modules | Có | AI_Workflow_BackEnd.md |
| 2 | 20/05/2026 | Antigravity | Scaffold ApplicationDbContext | "Scaffold ApplicationDbContext với 20 DbSet cho các entity của hệ thống fitness" | ApplicationDbContext.cs với đầy đủ DbSet | Có | ApplicationDbContext.cs |
| 3 | 28/05/2026 | Antigravity | Implement Auth system | "Implement IAuthService, AuthService với BCrypt + Google OAuth, JWT, AuthController, DTOs" | Toàn bộ Auth layer (interface, service, controller, DTOs) | Có | AuthService.cs, AuthController.cs |
| 4 | 28/05/2026 | Antigravity | Implement User management | "Implement UserController GET /api/user trả về Member list (RoleId=3) với UserDto" | UserController.cs, UserDto.cs | Có | UserController.cs |
| 5 | 28/05/2026 | Antigravity | Debug Google OAuth null PasswordHash | "MySQL NOT NULL error khi tạo Google user với PasswordHash = null, how to fix" | Dùng empty string thay vì null | Có | AuthService.cs line 116 |
| 6 | 30/05/2026 | Antigravity | Review AuthService security | "Review AuthService.cs for potential security issues: timing attack, password exposure" | Nhận xét về error message generic, không expose email existence | Áp dụng một phần | AuthService.cs |

---

## 5. Prompt chi tiết

---

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/05/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Thiết kế kiến trúc toàn bộ backend theo Clean Architecture và tạo SOP cho nhóm |
| Phần việc liên quan | Design / Backend |
| Mức độ sử dụng | Hỏi sinh code / Hỏi thiết kế giải pháp |

#### 5.1. Prompt nguyên văn

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

#### 5.2. Bối cảnh khi viết prompt

```text
Đây là ngày đầu tiên của project. Cả nhóm chưa có kinh nghiệm thực tế với Clean
Architecture. Tôi cần một cấu trúc rõ ràng và một tài liệu SOP để tất cả 5 thành viên
có thể làm việc nhất quán, tránh conflict khi làm song song trên cùng codebase.

Tôi đã nghiên cứu Clean Architecture qua tài liệu của Jason Taylor (Clean Architecture
template) và quyết định dùng AI để áp dụng nó vào context cụ thể của project này.
```

#### 5.3. Kết quả AI trả về

```text
AI trả về toàn bộ file AI_Workflow_BackEnd.md bao gồm:

1. Sơ đồ dependency flow:
   Domain ← Application ← Infrastructure ← WebApi

2. Bảng 4 layer với responsibilities:
   - Domain: Entities, Enums, Exceptions, Value Objects
   - Application: CQRS (MediatR), FluentValidation, DTOs, Interfaces, Behaviours
   - Infrastructure: EF Core DbContext, Services implementations, DI registration
   - WebApi: Controllers, Middleware, Program.cs

3. Bảng đặt tên file đầy đủ (17 loại file khác nhau) với ví dụ cụ thể.

4. Step-by-step workflow 7 bước cho AI khi implement feature mới:
   Step 1: Domain entities → Step 2: Application interfaces → Step 3: EF Config
   → Step 4: CQRS Slice → Step 5: Controller → Step 6: DI Registration
   → Step 7: Migration

5. Verification Checkpoints: build check, architecture dependency check,
   nullable reference types, code quality rules.

6. Common Pitfalls: 6 điều không được làm.

7. Cấu trúc thư mục đầy đủ cho toàn bộ backend.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
- File AI_Workflow_BackEnd.md được dùng trực tiếp và share cho cả nhóm ngay ngày đầu.
- 4-layer structure được áp dụng khi tạo 4 .csproj files trong solution.
- 6 feature module folders scaffold dưới Application/Features/.
- Naming conventions được áp dụng nhất quán cho tất cả entity, DTO, interface,
  service files trong suốt project.
- Verification Checkpoints được dùng như checklist trước mỗi PR merge.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Thêm mục "Existing Feature Modules" vào SOP để reference các module đã có.
- Bổ sung connection string format cụ thể (Server=localhost;Database=fitness_training_db).
- Thêm note về MySQL target version (8.0.36) vì Pomelo cần biết version này.
- Điều chỉnh ApplicationDbContext để dùng inline OnModelCreating thay vì
  ApplyConfigurationsFromAssembly vì có một số relationship phức tạp (Schedule PT vs Member).
- Tự thêm phần Common Pitfalls số 5 và 6 dựa trên những lỗi nhóm gặp trong tuần đầu.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| File liên quan | `backend/AI_Workflow_BackEnd.md` |
| File liên quan | `backend/src/FitnessTrainingSystem.Application/Features/` (6 module folders) |
| File liên quan | `backend/FitnessTrainingSystem.sln` (4 projects) |
| Ghi chú khác | SOP này là tài liệu nền tảng cho toàn bộ nhóm làm việc |

#### 5.8. Ghi chú thêm

```text
Đây là prompt quan trọng nhất của cả project. Nếu kiến trúc không được xác định đúng
ngay từ đầu, việc refactor sau này sẽ rất tốn kém. AI giúp tôi tiết kiệm khoảng 2-3
ngày nghiên cứu và thiết kế so với việc tự làm từ đầu.
```

---

### Prompt số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Implement toàn bộ hệ thống xác thực người dùng (Auth System) |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

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

#### 5.2. Bối cảnh khi viết prompt

```text
Đây là lần đầu tiên nhóm implement authentication trong ASP.NET Core. Tôi đã có sẵn:
- User entity đầy đủ từ Domain layer
- SOP document từ Prompt số 1 mà AI cần follow
- Quyết định dùng BCrypt (industry standard) thay vì SHA256 (insecure)
- Quyết định support cả email/password login và Google OAuth

Tôi viết prompt chi tiết kèm theo danh sách các file cần tạo và tech stack cụ thể
để AI không phải guess và tạo ra code không dùng được.
```

#### 5.3. Kết quả AI trả về

```text
AI trả về đầy đủ các file với code hoàn chỉnh:

IAuthService.cs:
- 3 phương thức: RegisterAsync, LoginAsync, GoogleLoginAsync
- Tất cả nhận DTO và return AuthResponseDto

AuthService.cs (154 dòng):
- RegisterAsync: check email duplicate, verify password match, BCrypt hash, default RoleId=3
- LoginAsync: BCrypt verify, detect Google-linked account
- GoogleLoginAsync: validate Google credential, auto-create user nếu mới
- Tất cả return AuthResponseDto với userId, fullname, email, token, roleId

IJwtTokenGenerator.cs + JwtTokenGenerator.cs:
- Tạo JWT với claims: userId, email, role
- Signing: HMAC-SHA256
- Expiry: 7 ngày
- Key và Issuer đọc từ IConfiguration

4 DTO classes: RegisterRequestDto (Fullname, Email, Password, ConfirmPassword),
LoginRequestDto (Email, Password), GoogleLoginRequestDto (Credential),
AuthResponseDto (UserId, Fullname, Email, Token, RoleId)

AuthController.cs (60 dòng):
- 3 POST endpoints với try/catch và BadRequest error handling
- Inject IAuthService

UserController.cs:
- GET /api/user lọc RoleId == 3
- Project sang UserDto

UserDto: Id, Name, Email, Plan, JoinDate, Status
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
- IAuthService.cs: áp dụng trực tiếp, không sửa.
- AuthService.cs: áp dụng phần lớn, sửa 2 điểm (xem 5.5).
- JwtTokenGenerator.cs: áp dụng trực tiếp.
- Tất cả 4 DTO: áp dụng trực tiếp.
- AuthController.cs: áp dụng trực tiếp.
- UserController.cs: áp dụng với minor adjustment (inject DbContext thay ISender).
- UserDto: áp dụng trực tiếp.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Sửa lỗi 1 – PasswordHash null cho Google user:
- AI gợi ý: PasswordHash = null
- Lỗi: MySQL NOT NULL constraint violation khi SaveChangesAsync
- Sửa thành: PasswordHash = "" (empty string)

Thêm tính năng – Link Google account to existing email user:
- AI không tự gợi ý case: user đã đăng ký bằng email, sau đó login bằng Google
  cùng email → cần link GoogleId vào account cũ
- Thêm else-if block: if (user.GoogleId == null) { user.GoogleId = payload.Subject; ... }

Đổi inject trong UserController:
- AI gợi ý inject ISender (MediatR) để follow CQRS pattern
- Tôi giữ inject ApplicationDbContext trực tiếp vì chưa có GetUsersQuery handler
  → quyết định có chủ ý (trade-off giữa clean architecture và tiến độ)

Thêm comment:
- Inline comment "// Default role: MEMBER" và "// Only get Members (RoleId = 3)"
  để future developer hiểu intent mà không cần đọc database schema
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [x] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| File liên quan | `backend/src/FitnessTrainingSystem.Application/Interfaces/IAuthService.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.Infrastructure/Services/AuthService.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.WebApi/Controllers/AuthController.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.WebApi/Controllers/UserController.cs` |
| File liên quan | `backend/src/FitnessTrainingSystem.Application/DTOs/Auth/` |
| Kết quả chạy/test | POST /api/auth/register, /login, /google – hoạt động đúng qua Swagger |
| Kết quả chạy/test | GET /api/user – trả về member list đúng format |

#### 5.8. Ghi chú thêm

```text
Prompt này hiệu quả vì tôi cung cấp: (1) context về entity đã có, (2) danh sách cụ thể
các file cần tạo, (3) tech stack version cụ thể, (4) tham chiếu đến SOP document.
AI không phải guess bất kỳ điều gì quan trọng → kết quả rất sát với yêu cầu thực tế.
Lỗi duy nhất (PasswordHash = null) là do tôi không cung cấp database schema chi tiết.
Bài học: cần thêm "database constraints" vào prompt khi implement persistence layer.
```

---

## 6. Prompt quan trọng nhất

Chọn một prompt có ảnh hưởng lớn nhất đến bài tập/project.

### 6.1. Prompt được chọn

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

### 6.2. Vì sao prompt này quan trọng?

```text
Prompt này quan trọng nhất vì kết quả của nó (AI_Workflow_BackEnd.md và kiến trúc 4-layer)
là nền tảng cho toàn bộ codebase. Tất cả 5 thành viên trong nhóm đều phải tuân theo
cấu trúc và quy ước này. Sai lầm ở đây sẽ kéo theo hàng chục file sai cấu trúc và
cần refactor toàn bộ – chi phí sửa sai rất cao.

Thêm vào đó, file AI_Workflow_BackEnd.md được sử dụng như system prompt cho tất cả
các phiên làm việc với AI sau này, giúp AI luôn sinh code đúng pattern của project.
```

### 6.3. Kết quả prompt này mang lại

```text
- File AI_Workflow_BackEnd.md (252 dòng) – SOP cho cả nhóm và AI tools
- Cấu trúc 4-layer rõ ràng, áp dụng ngay từ ngày đầu
- 6 feature module folders scaffold sẵn
- Quy ước đặt tên chuẩn hóa cho 17 loại file
- 7-step workflow cho AI khi implement feature mới
- Toàn nhóm đồng thuận về kiến trúc → không có conflict về cách tổ chức code
```

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?

```text
1. Đọc kỹ toàn bộ SOP document và so sánh với tài liệu gốc về Clean Architecture.
2. Tạo solution với 4 projects và verify dependency references đúng theo SOP.
3. Tạo một entity mẫu (User) và trace qua toàn bộ 7 bước workflow để test xem SOP
   có thực tế và khả thi không.
4. Share với nhóm, thu thập feedback và điều chỉnh trước khi lock down.
5. Build solution (dotnet build) để đảm bảo không có compile error với cấu trúc này.
```

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?

```text
- Thêm MySQL-specific configurations (charset, collation, version target).
- Bổ sung note về connection string key "DefaultConnection".
- Thêm 2 Common Pitfalls từ kinh nghiệm thực tế của nhóm trong tuần đầu.
- Adjust OnModelCreating để handle relationship phức tạp inline thay vì auto-discovery.
```

---

## 7. Prompt chưa hiệu quả

### 7.1. Prompt chưa hiệu quả

```text
How to implement authentication in ASP.NET Core?
```

### 7.2. Vì sao prompt này chưa hiệu quả?

```text
Prompt này quá chung chung và thiếu hoàn toàn context:
- Không nêu kiến trúc đang dùng (Clean Architecture)
- Không nêu tech stack cụ thể (BCrypt, Google OAuth, JWT)
- Không nêu entity structure đã có
- Không nêu các DTOs cần tạo
- Không nêu endpoint cần expose

Kết quả AI trả về là một tutorial chung chung về Identity framework của ASP.NET Core –
hoàn toàn không phù hợp với project vì chúng tôi không dùng ASP.NET Identity.
```

### 7.3. Cách cải thiện prompt

```text
- Cung cấp entity structure đã có (User.cs với các fields)
- Nêu rõ tech stack: BCrypt.Net-Next, Google.Apis.Auth, JWT
- Liệt kê danh sách cụ thể các file cần tạo
- Tham chiếu đến SOP/architecture document
- Nêu rõ default values (RoleId = 3 cho Member)
- Nêu database constraints (NOT NULL cho PasswordHash)
```

### 7.4. Prompt sau khi cải tiến

```text
Based on the Clean Architecture SOP in AI_Workflow_BackEnd.md, implement the full user
authentication system for FitnessTrainingSystem:

1. User entity already exists in Domain/Entities/User.cs with: Fullname, Email,
   PasswordHash (NOT NULL in DB), GoogleId, Phone, AvatarUrl, Gender, DateOfBirth,
   Status, RoleId.

2. Implement the following:
   a. IAuthService interface in Application/Interfaces/ with: RegisterAsync, LoginAsync,
      GoogleLoginAsync methods.
   b. AuthService implementation in Infrastructure/Services/ using BCrypt.Net-Next for
      password hashing and Google.Apis.Auth for Google token validation.
   c. IJwtTokenGenerator interface and JwtTokenGenerator implementation...
   [... rest of detailed prompt]
```

### 7.5. Kết quả sau khi cải tiến prompt

```text
Với prompt cải tiến (Prompt số 2 ở trên), AI trả về code rất sát với yêu cầu thực tế:
- Đúng kiến trúc (interface ở Application, implementation ở Infrastructure)
- Đúng tech stack (BCrypt, Google OAuth, JWT)
- Đúng cấu trúc DTO và Controller

Lỗi duy nhất còn lại (PasswordHash = null) có thể tránh được hoàn toàn nếu tôi thêm
"PasswordHash is NOT NULL in MySQL" vào prompt.
```

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, em/nhóm cần cung cấp thông tin gì để AI trả lời tốt hơn?

```text
1. Mục tiêu cụ thể: liệt kê từng file cần tạo, không nói chung chung.
2. Context kiến trúc: tham chiếu đến SOP hoặc mô tả ngắn gọn layer structure.
3. Entity/DTO đã có: paste hoặc mô tả cấu trúc để AI không phải assume.
4. Tech stack version: package name + version cụ thể (BCrypt.Net-Next, không phải "BCrypt").
5. Database constraints: NOT NULL, unique, foreign key constraints quan trọng.
6. Default values: RoleId = 3 cho Member, Status = "ACTIVE" mặc định.
7. Yêu cầu đặc biệt: "follow the SOP in AI_Workflow_BackEnd.md".
```

### 8.2. Em/nhóm đã học được gì về cách đặt câu hỏi cho AI?

```text
- AI chỉ giỏi khi có đủ context – garbage in, garbage out vẫn đúng với AI.
- Prompt càng cụ thể thì kết quả càng ít phải sửa.
- Tham chiếu đến tài liệu nội bộ (SOP) giúp AI hiểu convention của project.
- Nên chia bài toán lớn thành các prompt nhỏ hơn, mỗi prompt một mục tiêu rõ ràng.
- Luôn cung cấp existing code/structure để AI không bắt đầu từ scratch.
```

### 8.3. Lần sau em/nhóm sẽ cải thiện prompt như thế nào?

```text
- Luôn thêm database schema/constraints khi implement persistence-related code.
- Thêm "return ONLY the code, no explanation" khi cần code ngắn gọn không có boilerplate.
- Thêm "list all assumptions you are making" để phát hiện sớm những điểm AI assume sai.
- Sử dụng structured format (numbered list) thay vì paragraph để AI hiểu rõ từng yêu cầu.
- Thêm "do NOT use X" khi muốn AI tránh một approach cụ thể.
```

---

## 9. Phân loại prompt đã sử dụng

Đánh dấu số lượng prompt theo từng nhóm.

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt phân tích yêu cầu | 0 | – |
| Prompt giải thích kiến thức | 1 | "Explain Clean Architecture dependency rules" |
| Prompt thiết kế giải pháp | 1 | "Design Onion Architecture for ASP.NET Core 9 project" |
| Prompt thiết kế database | 1 | "Scaffold ApplicationDbContext với 20 DbSet" |
| Prompt sinh code mẫu | 2 | "Implement AuthService with BCrypt and Google OAuth" |
| Prompt debug lỗi | 1 | "MySQL NOT NULL error on PasswordHash = null" |
| Prompt viết test case | 0 | – |
| Prompt review code | 1 | "Review AuthService.cs for security issues" |
| Prompt tối ưu code | 0 | – |
| Prompt viết báo cáo | 0 | – |
| Prompt chuẩn bị thuyết trình | 0 | – |
| Prompt khác | 0 | – |

---

## 10. Checklist chất lượng prompt

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng | ✓ | Liệt kê từng file cần tạo |
| Prompt có đủ bối cảnh | ✓ | Cung cấp entity structure, tech stack, SOP reference |
| Prompt có nêu công nghệ/ngôn ngữ sử dụng | ✓ | ASP.NET Core 9, BCrypt.Net-Next, Google.Apis.Auth |
| Prompt có nêu yêu cầu đầu ra | ✓ | Danh sách file a, b, c, d, e, f, g |
| Prompt không yêu cầu AI làm toàn bộ bài một cách máy móc | ✓ | Mỗi prompt một phần cụ thể |
| Prompt có yêu cầu AI giải thích hoặc phân tích | Một phần | Chủ yếu yêu cầu sinh code |
| Kết quả AI được kiểm tra lại | ✓ | Test qua Swagger, check database |
| Kết quả AI được chỉnh sửa trước khi sử dụng | ✓ | Sửa PasswordHash, thêm link account logic |
| Prompt quan trọng được ghi lại đầy đủ | ✓ | File này |
| Prompt sai/chưa hiệu quả được rút kinh nghiệm | ✓ | Mục 7 |

---

## 11. Cam kết sử dụng prompt minh bạch

Sinh viên/nhóm cam kết rằng:

- Các prompt quan trọng đã được ghi lại trung thực.
- Không che giấu việc sử dụng AI trong các phần quan trọng của bài.
- Không nộp nguyên văn kết quả AI nếu chưa kiểm tra và chỉnh sửa.
- Có khả năng giải thích các phần đã sử dụng từ AI.
- Chịu trách nhiệm với sản phẩm cuối cùng.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Đặng Phương Nam – DE190177 | 02/07/2026 |
