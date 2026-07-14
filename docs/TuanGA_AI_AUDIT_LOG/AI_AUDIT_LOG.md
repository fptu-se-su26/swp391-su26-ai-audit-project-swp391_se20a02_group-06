# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Development Project |
| Mã môn học | SWP391 |
| Lớp | SE20A02 |
| Học kỳ | Summer 2026 (SU26) |
| Tên bài tập / Project | FitnessTrainingSystem – AI Audit Project |
| Tên sinh viên / Nhóm | Giàng Anh Tuấn / Group 06 |
| MSSV / Danh sách MSSV | DE190974 |
| Giảng viên hướng dẫn | QuangLTN3 |
| Ngày bắt đầu | 20/05/2026 |
| Ngày hoàn thành | 02/07/2026 |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [ ] ChatGPT
- [x] Gemini
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

- [x] Gợi ý ý tưởng giải pháp
- [x] Thiết kế database
- [x] Viết code mẫu
- [x] Viết báo cáo
- [x] Chuẩn bị slide thuyết trình
- [x] Tìm hiểu công nghệ mới

### Mô tả mục tiêu sử dụng AI

```text
Mục tiêu chính của việc ứng dụng công cụ AI trong dự án này là nhằm tối ưu hóa hiệu suất làm việc cá nhân và nâng cao chất lượng các cấu phần kỹ thuật của hệ thống. Cụ thể AI được tích hợp như một trợ lý lập trình để hỗ trợ các đầu việc sau:

Hỗ trợ kỹ thuật và Cú pháp: Tra cứu nhanh các cấu trúc cú pháp mã nguồn, giúp giảm thiểu thời gian đọc tài liệu thủ công.
Thiết kế và Khởi tạo dữ liệu: Gợi ý và tối ưu hóa cấu trúc lược đồ cơ sở dữ liệu, đồng thời sinh dữ liệu mẫu.
```
## 4. Nhật ký sử dụng AI chi tiết
---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 24/05/2026 |
| Công cụ AI | Gemini |
| Mục đích sử dụng | Chuyển đổi tài liệu đặc tả Use Case thành sơ đồ Use Case Diagram hoàn chỉnh |
| Phần việc liên quan | Design / Presentation / Other |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
I have a detailed Use Case specification sheet for a fitness training system's features. 
guideme through the steps to draw a proper Use Case Diagram based on this data.
```


#### 4.2. Kết quả AI gợi ý

Tóm tắt nội dung AI đã trả lời hoặc gợi ý.

```text
AI đã phân tích cấu trúc từ prompt và phản hồi bằng cách phân loại hệ thống thành các nhóm cụ thể:
-Liệt kê nhóm Use Case cốt lõi tương ứng với từng tác vụ trong Use Case sheet.
-Chỉ ra các mối quan hệ logic quan trọng
-Cung cấp khung sơ đồ thô để định hình bố cục trước khi vẽ.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

Mô tả rõ phần nào được sử dụng lại từ gợi ý của AI.

```text
Sử dụng toàn bộ phân tích logic này làm tài liệu chuẩn bị cho thuyết trình, giúp giải thích về phần Use Case Diagram.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với gợi ý ban đầu của AI.

```text
Rà soát lại các quan hệ include/extend mà AI gợi ý để đối chiếu sát với yêu cầu thực tế của đề tài nhóm, loại bỏ các Use case dư thừa không nằm trong phạm vi phát triển của dự án.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Screenshot | <img width="1220" height="989" alt="image1" src="https://github.com/user-attachments/assets/96818412-0d23-44ab-92c9-f89d02af2b41" /> |
| Screenshot | <img width="1080" height="1018" alt="image2" src="https://github.com/user-attachments/assets/71d32ea5-b707-451a-8f7f-cde0b2373d85" /> |

#### 4.6. Nhận xét cá nhân/nhóm

Sinh viên/nhóm học được gì sau lần sử dụng AI này?

```text
Học được cách chuyển dịch Use Case từ dạng bảng biểu đặc tả sang sơ đồ một cách có hệ thống.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 07/06/2026 |
| Công cụ AI | Gemini |
| Mục đích sử dụng | Khởi tạo dữ liệu mẫu cho các bảng trong cơ sở dữ liệu  |
| Phần việc liên quan | Database / Testing |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
I need realistic mock data for the fitness training project based on this database: [AI_Fitness_21_tables.sql]
Based on the sql file's data schema, generate mock data for each table. Ensure that referential integrity is maintained.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã phân tích cấu trúc lược đồ cơ sở dữ liệu và tự động sinh ra một file mã nguồn SQL chứa các câu lệnh INSERT INTO dữ liệu mẫu:
-Đảm bảo tính nhất quán về kiểu dữ liệu (Data types) và độ dài của các trường dữ liệu.
-Sắp xếp thứ tự chèn dữ liệu một cách logic: chèn dữ liệu vào các bảng cha trước, sau đó mới chèn vào các bảng con để tránh lỗi vi phạm ràng buộc.
-Tạo ra các trường thông tin giả lập khá thực tế như tên người dùng, email, ngày tháng, và trạng thái hệ thống.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng hầu hết toàn bộ các đoạn mã lệnh INSERT dữ liệu mẫu do AI sinh ra để import vào MySQL database, trừ bảng Foods ra.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI đã tự động sinh thêm các câu lệnh để tạo tài khoản người dùng mới một cách dư thừa, thay vì tận dụng dữ liệu người dùng đã có sẵn trong hệ thống. Để khắc phục, em đã xóa bỏ các câu lệnh tạo user mới này.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/swp391-su26-ai-audit-project-swp391_se20a02_group-06/commit/889676e9918e14ad0ca64c7ac34dce8c9a676530 |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc sử dụng AI giúp tiết kiệm đến 90% thời gian tạo dữ liệu mock để test hệ thống MySQL. Tuy nhiên vẫn cần có sự giám sát, rà soát kỹ lưỡng. 
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  | x |  |  | Chuyển đổi Use Case sheet sang cấu trúc Diagram |
| Viết user story/use case | x |  |  |  |  |
| Thiết kế database |  |  |  | x | Sinh dữ liệu mẫu |
| Thiết kế kiến trúc hệ thống | x |  |  |  |  |
| Thiết kế giao diện | x |  |  |  |  |
| Code frontend | x |  |  |  |  |
| Code backend | x |  |  |  |  |
| Debug lỗi |  | x |  |  |  |
| Viết test case | x |  |  |  |  |
| Kiểm thử sản phẩm | x |  |  |  |  |
| Tối ưu code | x |  |  |  |  |
| Viết báo cáo |  | x |  |  | Tham khảo cấu trúc trình bày logic hệ thống |
| Làm slide thuyết trình |  | x |  |  | Tóm tắt luồng Use Case |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | Sinh dư thừa dữ liệu người dùng mới thay vì dùng user có sẵn trong DB. | Review mã nguồn SQL trước khi chạy | Xóa các lệnh tạo user thừa, map lại thủ công các ID khóa ngoại cho đúng với DB thực tế. |
| 2 | Sinh dữ liệu ngẫu nhiên cho bảng Foods, không sát thực tế. (Nhiều mục có thêm ghi chú là "cooked", trong khi những mục khác thì không có) | Đọc lướt qua nội dung dữ liệu được sinh ra |  |

---

## 7. Kiểm chứng kết quả AI

### Nội dung kiểm chứng

```text
-Đối chiếu trực tiếp cấu trúc sơ đồ AI gợi ý với bảng Use case
-
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
| Đặng Phương Nam | DE190177 | Leader, Backend Architecture, Auth System | Có | AI_Workflow_BackEnd.md, AuthService.cs, ApplicationDbContext.cs |
| Nguyễn Hoài Nam | SE183193 | Backend Member | Có | Xem NamNH_AI_AUDIT_LOG |
| Cao Điền Hưng | SE183792 | Backend Member | Có | Xem HungCD_AuditLOG |
| Giàng Anh Tuấn | DE190974 | Backend/Frontend Member | Có | Xem TuanGA_AI_AUDIT_LOG |
| Lê Văn Đạt | DE180983 | Backend Member | Có | Xem DATLV_AI-AUDIT-LOG |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI đóng vai trò tăng tốc độ phát triển dự án.
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
Nhận thức rõ AI chỉ là "trợ lý", không phải là "người ra quyết định".
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
| Giàng Anh Tuấn | 03/07/2026 |
