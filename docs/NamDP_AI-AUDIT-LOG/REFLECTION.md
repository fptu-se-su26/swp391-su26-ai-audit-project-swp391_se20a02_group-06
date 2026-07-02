# AI Learning Reflection

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
| Ngày hoàn thành reflection | 02/07/2026 |

---

## 2. Mục đích Reflection

File này ghi lại quá trình tự đánh giá việc sử dụng AI trong hai giai đoạn có tác động lớn nhất đến project:
1. **Thiết kế kiến trúc hệ thống** – Clean Architecture / Onion Model, SOP cho nhóm.
2. **Xây dựng User functions** – Authentication (Register/Login/Google OAuth), JWT, User management.

---

## 3. Tóm tắt quá trình sử dụng AI

```text
Tôi sử dụng Antigravity (AI coding assistant) trong hai thời điểm chính:

Giai đoạn 1 – Ngày 20/05/2026 (Khởi tạo project):
Dùng AI để thiết kế kiến trúc Clean Architecture và tạo file AI_Workflow_BackEnd.md –
tài liệu SOP hướng dẫn cách tổ chức code cho toàn bộ nhóm. Đây là lần dùng AI có
ảnh hưởng diện rộng nhất vì kết quả quyết định cách mọi thành viên viết code từ
ngày đó cho đến hết project.

Giai đoạn 2 – Ngày 28/05/2026 (Implement User functions):
Dùng AI để sinh code cho hệ thống xác thực người dùng: IAuthService interface,
AuthService implementation (BCrypt + Google OAuth), JwtTokenGenerator, các DTOs,
AuthController và UserController. Đây là tập hợp các chức năng cốt lõi nhất liên
quan đến người dùng trong hệ thống.

Công cụ chính: Antigravity – được chọn vì tích hợp trực tiếp vào IDE (VS Code),
có thể đọc file trong project và hiểu context codebase mà không cần copy-paste thủ công.

Nhìn chung, AI đã cải thiện đáng kể chất lượng và tốc độ làm việc ở những phần
đòi hỏi kiến thức sâu (kiến trúc phần mềm, security/auth implementation).
```

---

## 4. Công cụ AI đã sử dụng

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

### Công cụ được sử dụng nhiều nhất

```text
Antigravity – sử dụng cho cả 2 giai đoạn chính.
```

### Lý do sử dụng công cụ đó

```text
Antigravity tích hợp trực tiếp vào VS Code và có khả năng đọc toàn bộ codebase,
giúp tôi không phải copy-paste code vào chat box. Khi tôi hỏi AI implement một feature
mới, AI đã tự đọc các file liên quan (entity, SOP, existing controllers) và sinh code
phù hợp với pattern đang dùng trong project – điều này không thể làm được với ChatGPT
hay các tool chat thông thường nếu không paste toàn bộ context thủ công.
```

---

## 5. AI đã hỗ trợ em/nhóm ở điểm nào?

- [ ] Hiểu yêu cầu đề bài
- [x] Phân tích bài toán
- [x] Tìm ý tưởng giải pháp
- [ ] Thiết kế database
- [ ] Thiết kế giao diện
- [x] Thiết kế kiến trúc hệ thống
- [x] Viết code mẫu
- [x] Debug lỗi
- [ ] Viết test case
- [x] Review code
- [ ] Tối ưu code
- [x] Kiểm tra bảo mật
- [ ] Viết báo cáo
- [ ] Chuẩn bị thuyết trình
- [x] Tìm hiểu công nghệ mới
- [ ] Khác: ....................................

### Mô tả chi tiết

```text
1. Thiết kế kiến trúc hệ thống:
   AI giúp tôi áp dụng Clean Architecture / Onion Model cho ASP.NET Core 9 một cách
   nhất quán. Thay vì phải đọc nhiều bài blog và trial-error, AI tổng hợp ngay cấu
   trúc folder, naming convention và dependency rules phù hợp với tech stack cụ thể
   của project. Kết quả là file AI_Workflow_BackEnd.md được dùng như "source of truth"
   cho cả nhóm.

2. Viết code mẫu:
   AI sinh ra toàn bộ Auth system boilerplate: interface, service, controller, DTOs.
   Phần này đặc biệt hữu ích vì authentication/JWT/Google OAuth là domain kiến thức
   rộng với nhiều best practice, potential pitfall và security consideration mà nếu
   tự nghiên cứu sẽ mất nhiều ngày.

3. Debug lỗi:
   Khi gặp runtime error (PasswordHash = null → MySQL NOT NULL violation), AI giải
   thích nguyên nhân và gợi ý fix ngay lập tức.

4. Review code & kiểm tra bảo mật:
   AI review AuthService và chỉ ra một số điểm có thể cải thiện về security: error
   message generic (không expose "email exists"), timing consistency trong password check.
```

---

## 6. AI có giúp em/nhóm học tốt hơn không?

### 6.1. Những điểm AI giúp em/nhóm học tốt hơn

```text
1. Hiểu Clean Architecture thực tế:
   Trước đây tôi biết lý thuyết về Clean Architecture nhưng chưa từng áp dụng vào
   project ASP.NET Core thực tế. AI giúp tôi thấy ngay cách áp dụng cụ thể: file
   nào đặt ở đâu, layer nào reference layer nào, tại sao không được inject DbContext
   vào controller. Hiểu thông qua "làm" nhanh hơn nhiều so với đọc tài liệu thuần lý thuyết.

2. Hiểu cơ chế JWT và OAuth:
   AI giải thích claims structure trong JWT (userId, email, role), cách Google OAuth
   flow hoạt động (validate token → extract payload → create/link user). Tôi không chỉ
   copy code mà đọc kỹ và hiểu từng bước trước khi commit.

3. Hiểu tầm quan trọng của error message trong authentication:
   AI nhắc tôi dùng generic error message ("Invalid email or password") thay vì message
   cụ thể ("Email not found") để tránh user enumeration attack – đây là kiến thức
   security tôi chưa nghĩ đến trước đó.

4. Hiểu BCrypt và password hashing:
   Thông qua code AI sinh ra, tôi học được tại sao dùng BCrypt.Verify thay vì tự
   hash và compare, và tại sao không nên dùng SHA256 cho password.
```

### 6.2. Những điểm AI chưa giúp tốt hoặc gây khó khăn

```text
1. Không biết database constraints cụ thể:
   AI không biết rằng PasswordHash có NOT NULL constraint trong MySQL schema của chúng
   tôi → gợi ý PasswordHash = null → gây runtime error. AI không có khả năng tự query
   database để check constraints.

2. Không tự gợi ý business logic edge case:
   Case "user đăng ký email trước, sau đó Google login với cùng email cần link account"
   là business requirement mà AI không tự nghĩ ra – tôi phải tự identify và implement.

3. Đôi khi gợi ý over-engineering:
   AI gợi ý thêm Refresh Token mechanism và nhiều security layer khác ngay từ MVP sprint
   đầu – những thứ đúng về mặt best practice nhưng không phù hợp với timeline sinh viên.
   Developer phải tự quyết định scope phù hợp.

4. Không hiểu project-specific conventions:
   AI đôi khi gợi ý inject ISender (MediatR) vào controller vì đó là "correct" Clean
   Architecture way, nhưng không biết rằng chúng tôi chưa có CQRS handlers cho feature
   đó → compile error nếu áp dụng nguyên xi.
```

### 6.3. Em/nhóm có bị phụ thuộc vào AI không?

- [ ] Không phụ thuộc
- [x] Phụ thuộc ít
- [ ] Phụ thuộc trung bình
- [ ] Phụ thuộc nhiều

Giải thích:

```text
Tôi sử dụng AI như một công cụ tăng tốc độ (accelerator), không phải thay thế hoàn
toàn việc suy nghĩ và quyết định. Quy trình thực tế của tôi là:
1. Tự phân tích yêu cầu và xác định approach
2. Hỏi AI để sinh code boilerplate theo approach đã xác định
3. Đọc kỹ code AI sinh ra, verify logic, test
4. Chỉnh sửa những phần AI hiểu sai hoặc thiếu context

Tôi không hỏi AI "làm cái này giúp tôi" mà hỏi "implement X theo cách Y với constraint Z".
Điều này đảm bảo tôi luôn là người quyết định, AI chỉ là người thực thi.
```

---

## 7. Em/nhóm đã kiểm tra kết quả AI như thế nào?

- [x] Chạy thử chương trình
- [x] Kiểm tra output
- [ ] Viết test case
- [x] So sánh với yêu cầu đề bài
- [ ] Đối chiếu với tài liệu môn học
- [x] Review code
- [ ] Hỏi lại giảng viên
- [x] Tra cứu tài liệu chính thống
- [ ] Thảo luận với thành viên nhóm
- [x] Kiểm tra bằng dữ liệu mẫu
- [ ] So sánh trước và sau khi dùng AI
- [ ] Khác: ....................................

### Mô tả quá trình kiểm chứng

```text
1. Compile check: Chạy "dotnet build" để đảm bảo code compile không lỗi.

2. Runtime test qua Swagger UI:
   - POST /api/auth/register: test với email mới, email duplicate, password mismatch
   - POST /api/auth/login: test đúng password, sai password, Google-linked account
   - POST /api/auth/google: dùng real Google credential từ frontend
   - GET /api/user: verify chỉ trả về users có RoleId = 3

3. Database verification:
   - Query MySQL trực tiếp: SELECT * FROM users WHERE email = '...'
   - Verify PasswordHash là BCrypt hash (bắt đầu bằng $2a$), không phải plaintext
   - Verify GoogleId được set đúng khi link account

4. JWT decode:
   - Paste JWT token vào jwt.io để verify claims (userId, email, role) đúng format
   - Verify signature với secret key trong config

5. Code review:
   - Đọc AuthService.cs line-by-line để check logic flow
   - Verify error messages không expose sensitive information
   - Check không có N+1 query issue trong UserController
```

### Ví dụ cụ thể về một lần kiểm chứng

| Nội dung | Mô tả |
|---|---|
| AI đã gợi ý gì? | AuthService.GoogleLoginAsync với `PasswordHash = null` cho Google user mới |
| Em/nhóm đã kiểm tra bằng cách nào? | Chạy POST /api/auth/google → nhận runtime exception từ EF Core SaveChangesAsync |
| Kết quả kiểm tra | Sai – MySQL column NOT NULL constraint bị vi phạm |
| Em/nhóm đã xử lý tiếp như thế nào? | Đổi thành `PasswordHash = ""` (empty string) và verify lại bằng cách chạy lại endpoint |

---

## 8. Ví dụ AI gợi ý sai hoặc chưa phù hợp

| Nội dung | Mô tả |
|---|---|
| AI đã gợi ý gì? | `PasswordHash = null` khi tạo user mới qua Google OAuth |
| Vì sao gợi ý đó sai/chưa phù hợp? | MySQL column có NOT NULL constraint – AI không biết constraint này vì không có database schema trong context |
| Em/nhóm phát hiện bằng cách nào? | Runtime exception khi chạy POST /api/auth/google: "Column 'password_hash' cannot be null" |
| Em/nhóm đã sửa như thế nào? | Thay `PasswordHash = null` bằng `PasswordHash = ""` và thêm comment giải thích lý do |
| Bài học rút ra | Luôn thêm database schema/constraints vào prompt khi implement persistence-related code. AI rất giỏi về logic nhưng không tự biết database-specific constraints. |

---

## 9. Phần đóng góp thật sự của sinh viên/nhóm

```text
Phần tôi tự làm, không phải chỉ copy từ AI:

1. Phân tích yêu cầu và xác định scope:
   Tự quyết định tính năng nào cần có trong MVP (Register/Login/Google OAuth, User list)
   và tính năng nào để lại cho sprint sau (Refresh Token, Password Reset).

2. Thiết kế database schema:
   Tự xác định 22 entity và relationship giữa chúng dựa trên requirements của hệ thống
   fitness training (User-Role, User-Schedule PT/Member, Exercise-MuscleGroup, v.v.)

3. Phát hiện và sửa lỗi:
   Tự phát hiện lỗi PasswordHash = null qua runtime test và tự fix.
   Tự phát hiện thiếu logic "link Google account to existing email" và implement.

4. Trade-off decisions:
   Tự quyết định inject DbContext trực tiếp vào UserController (thay vì ISender)
   để ưu tiên tiến độ – đây là quyết định kỹ thuật có chủ ý, không phải sai lầm.

5. Security review:
   Tự đọc và verify AuthService về timing attack, error message exposure trước khi commit.

6. Testing:
   Tự test toàn bộ auth endpoints qua Swagger với nhiều test cases (happy path + edge cases).

7. Phổ biến kiến trúc cho nhóm:
   Tự tổ chức session giải thích SOP document cho 4 thành viên còn lại,
   giải đáp thắc mắc về Clean Architecture trong suốt project.
```

---

## 10. So sánh trước và sau khi dùng AI

| Nội dung | Trước khi dùng AI | Sau khi dùng AI | Cải thiện đạt được |
|---|---|---|---|
| Hiểu yêu cầu | Hiểu nghiệp vụ nhưng chưa rõ cách implement | Hiểu rõ cách map yêu cầu vào các layer | Rõ ràng hơn về architecture |
| Phân tích bài toán | Có thể tự làm nhưng chậm | Nhanh hơn 2-3 lần với AI support | Tốc độ phân tích tốt hơn |
| Thiết kế giải pháp | Chưa biết cách áp dụng Clean Architecture vào ASP.NET Core | Có SOP cụ thể, áp dụng được ngay | Từ lý thuyết sang thực tế |
| Code/Implementation | 3-4 ngày để research + implement auth từ đầu | ~4 giờ với AI assistance | Giảm 80% thời gian implementation |
| Debug/Testing | Mất nhiều thời gian tra cứu error | AI giải thích nguyên nhân nhanh | Debug nhanh hơn 50% |
| Báo cáo/Thuyết trình | Chưa đánh giá | Chưa đánh giá | – |
| Làm việc nhóm | Khó đồng thuận về code structure | SOP chung giúp nhóm nhất quán | Ít conflict hơn khi merge code |

---

## 11. Bài học về môn học

```text
Sau project này, tôi hiểu rõ hơn rất nhiều về:

1. Clean Architecture (Onion Architecture):
   Không chỉ là lý thuyết – khi áp dụng thực tế, tôi thấy rõ lợi ích: test từng layer
   độc lập, thêm tính năng mới mà không ảnh hưởng code cũ, các thành viên có thể làm
   việc song song trên các layer khác nhau mà ít conflict hơn.

2. Authentication & Security:
   BCrypt vs SHA256, JWT structure (header/payload/signature), Google OAuth flow,
   tầm quan trọng của generic error messages để chống user enumeration attack.

3. CQRS pattern với MediatR:
   Dù chưa implement đầy đủ, tôi hiểu pattern này và biết khi nào nên áp dụng
   (khi cần separate read/write operations hoặc cần decoupling mạnh hơn).

4. Entity Framework Core với MySQL:
   Pomelo provider, charset/collation configuration, relationship configuration,
   enum-to-string conversion, auto-discovered configurations.

5. Teamwork trong software project:
   SOP document quan trọng không kém code – nó đảm bảo consistency và onboarding
   nhanh cho thành viên mới hoặc khi AI assistant cần hiểu project.
```

---

## 12. Bài học về sử dụng AI có trách nhiệm

```text
1. AI không thay thế được domain knowledge:
   AI biết rất nhiều về technology nhưng không biết business requirements cụ thể của
   project. Tôi phải tự quyết định "link Google account to existing email" là một
   requirement – AI không tự phát hiện được điều này.

2. Không copy-paste nguyên xi – always verify:
   Lỗi PasswordHash = null là ví dụ điển hình. Code trông đúng về mặt logic nhưng
   fail ở runtime vì AI thiếu context về database constraints. Developer phải là
   người verify "code này có chạy đúng trong môi trường thực tế không?"

3. Cung cấp context đầy đủ để AI hoạt động hiệu quả:
   AI + context đầy đủ = kết quả tốt. AI + prompt mơ hồ = kết quả chung chung
   và mất thời gian chỉnh sửa nhiều hơn. Đầu tư 10 phút viết prompt chi tiết
   tiết kiệm được 2-3 giờ sửa code sau đó.

4. AI biết best practice nhưng không biết project scope:
   AI gợi ý Refresh Token, Refresh Token rotation, Rate Limiting, v.v. – tất cả
   đều đúng về best practice. Nhưng developer phải tự quyết định cái gì nằm
   trong scope của sprint hiện tại. AI không có deadline, dev thì có.

5. Ghi chép trung thực là quan trọng:
   Việc phải viết audit log này buộc tôi phải suy nghĩ kỹ hơn về "tôi đã dùng AI
   làm gì, kết quả nào tôi tự làm, kết quả nào từ AI". Điều này giúp tôi nhận ra
   rằng mình hiểu code mình commit hay chỉ đang paste mà không hiểu.
```

---

## 13. Điều em/nhóm sẽ không làm khi sử dụng AI

- [x] Không dùng AI để làm toàn bộ bài mà không hiểu nội dung.
- [x] Không nộp nguyên văn kết quả AI nếu chưa kiểm tra.
- [x] Không che giấu việc sử dụng AI trong các phần quan trọng.
- [x] Không dùng AI để tạo nội dung sai lệch hoặc gian lận.
- [x] Không dùng AI thay thế hoàn toàn quá trình học.
- [x] Không bỏ qua yêu cầu, rubric hoặc hướng dẫn của giảng viên.

### Giải thích thêm nếu có

```text
Nguyên tắc tôi đặt ra cho bản thân: "Nếu giảng viên hỏi về bất kỳ dòng code nào
trong codebase, tôi phải giải thích được tại sao nó ở đó và nó làm gì."

Điều này có nghĩa là tôi không được commit code mà mình không hiểu, dù AI sinh ra.
Mỗi lần nhận code từ AI, tôi đọc kỹ, test, và đảm bảo mình có thể giải thích
logic đó trước người khác.
```

---

## 14. Kế hoạch cải thiện lần sau

```text
1. Viết prompt tốt hơn:
   - Luôn thêm database schema/constraints vào prompt khi implement data persistence code.
   - Thêm "list all assumptions you are making" để AI reveal những điều nó assume.
   - Specify "do NOT use X" khi muốn tránh một approach cụ thể.

2. Test kỹ hơn trước khi commit:
   - Viết ít nhất 1 unit test cho mỗi service method được AI sinh ra.
   - Test edge cases: null input, empty string, database constraint violations.

3. Ghi log thường xuyên hơn:
   - Ghi ngay sau mỗi lần dùng AI thay vì để cuối project mới ghi lại từ ký ức.
   - Attach link commit vào mỗi log entry.

4. Review với thành viên nhóm:
   - Trước khi merge code AI-assisted vào main, nhờ ít nhất 1 thành viên khác review.
   - Đặc biệt với authentication/security code vì ảnh hưởng đến toàn hệ thống.

5. Hiểu trước, hỏi AI sau:
   - Với tính năng mới, tự nghĩ về approach trước, sau đó hỏi AI để validate hoặc
     tìm implementation nhanh hơn. Không để AI quyết định approach thay mình.
```

---

## 15. Tự đánh giá mức độ hoàn thành

| Tiêu chí | Điểm tự đánh giá 1-5 | Ghi chú |
|---|:---:|---|
| Ghi nhận việc dùng AI trung thực | 5 | Ghi đầy đủ cả lỗi AI và phần tự sửa |
| Prompt có mục tiêu rõ ràng | 4 | Prompt 2 rất chi tiết; còn thiếu database constraints |
| Kiểm chứng kết quả AI | 4 | Test qua Swagger + DB; chưa có unit test |
| Tự chỉnh sửa/cải tiến | 4 | Sửa PasswordHash, thêm link account logic |
| Hiểu nội dung đã nộp | 5 | Có thể giải thích từng dòng trong AuthService |
| Reflection có chiều sâu | 4 | Nêu được cả điểm tốt và hạn chế của AI |
| Sử dụng AI có trách nhiệm | 5 | Verify trước khi commit, ghi nhận trung thực |

---

## 16. Câu hỏi tự vấn cuối bài

### 16.1. Nếu giảng viên hỏi về phần AI đã hỗ trợ, em/nhóm có giải thích lại được không?

```text
Có. Tôi có thể giải thích:
- Tại sao chọn Clean Architecture và từng layer có trách nhiệm gì.
- Tại sao dùng BCrypt thay vì SHA256 cho password hashing.
- JWT payload gồm những claims gì và tại sao chọn những claims đó.
- Google OAuth flow: frontend lấy credential → gửi lên backend → validate bằng
  GoogleJsonWebSignature → create/link user → return JWT.
- Tại sao error message là "Invalid email or password" thay vì "Email not found".
- Logic "link Google account to existing email user" và tại sao cần thiết.
```

### 16.2. Nếu không có AI, em/nhóm có thể tự làm lại phần quan trọng nhất không?

```text
Có, nhưng sẽ mất nhiều thời gian hơn đáng kể:
- Clean Architecture: cần đọc tài liệu của Jason Taylor, xem nhiều example projects,
  mất 2-3 ngày để thiết kế và thống nhất với nhóm.
- Auth system với BCrypt + Google OAuth + JWT: cần đọc documentation của từng library,
  tìm hiểu security best practices, mất 3-5 ngày để implement và debug.

Tôi tự tin mình có thể làm được vì tôi đã đọc, hiểu và test kỹ toàn bộ code trước
khi sử dụng – không phải chỉ copy-paste mù quáng.
```

### 16.3. Phần nào trong bài thể hiện rõ nhất năng lực thật sự của em/nhóm?

```text
1. Phát hiện và sửa lỗi business logic:
   Logic "link Google account to existing email user" không phải do AI gợi ý –
   tôi tự identify từ requirements và implement. Đây là phần thể hiện tôi hiểu
   domain problem, không chỉ biết code.

2. Trade-off decisions:
   Quyết định inject DbContext vào UserController thay vì ISender là quyết định
   có chủ ý, cân bằng giữa clean architecture và tiến độ thực tế. AI luôn gợi ý
   "perfect" solution nhưng developer phải biết khi nào đủ là đủ.

3. Tạo và phổ biến SOP cho nhóm:
   Không chỉ dùng AI generate document mà tự hiểu, verify, chỉnh sửa và explain
   cho 4 thành viên khác. Đây là kỹ năng leadership và technical communication.
```

### 16.4. Em/nhóm muốn cải thiện kỹ năng nào sau bài này?

```text
1. Viết unit test: Project này thiếu automated test hoàn toàn – lần sau tôi sẽ
   viết unit test cho service layer (đặc biệt AuthService) ngay khi implement.

2. Prompt engineering: Tôi muốn học cách viết prompt tốt hơn, đặc biệt cách
   cung cấp database schema và constraints một cách hiệu quả cho AI.

3. Security knowledge: Muốn học sâu hơn về OWASP Top 10 để biết các attack vector
   phổ biến và cách AI có thể bỏ sót chúng trong code review.

4. CQRS implementation: Muốn fully implement CQRS với MediatR cho tất cả features
   thay vì trade-off như hiện tại.
```

---

## 17. Cam kết Reflection

Em/nhóm cam kết rằng nội dung reflection này phản ánh trung thực quá trình sử dụng AI và quá trình học tập trong project FitnessTrainingSystem.

Sinh viên/nhóm hiểu rằng:

- AI là công cụ hỗ trợ học tập, không thay thế hoàn toàn năng lực cá nhân.
- Mọi kết quả AI gợi ý cần được kiểm tra trước khi sử dụng.
- Sinh viên/nhóm chịu trách nhiệm với sản phẩm cuối cùng.
- Sinh viên/nhóm cần giải thích được các phần đã nộp.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Đặng Phương Nam – DE190177 | 02/07/2026 |
