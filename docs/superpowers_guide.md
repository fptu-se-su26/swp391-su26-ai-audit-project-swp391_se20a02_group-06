# Hướng dẫn sử dụng bộ kỹ năng (Skills) Superpowers

**Superpowers** là một phương pháp luận (methodology) phát triển phần mềm toàn diện dành cho AI coding agents (như Antigravity, Claude Code, Cursor, v.v.), được xây dựng trên một tập hợp các "kỹ năng" (skills) có thể kết hợp với nhau.

Khi cài đặt Superpowers, agent của bạn sẽ tự động "học" cách làm việc một cách có hệ thống, thay vì chỉ nhào vô viết code ngay lập tức.

## Luồng làm việc cơ bản (The Basic Workflow)

Superpowers định hình cách agent làm việc theo các bước sau, các kỹ năng sẽ **tự động kích hoạt** đúng thời điểm:

1. **Brainstorming (`brainstorming`)**
   - Kích hoạt **trước khi viết code**. Agent sẽ đặt câu hỏi để làm rõ ý tưởng, đưa ra các giải pháp thay thế, và trình bày thiết kế từng phần để bạn duyệt. Sau đó, nó tự tạo một tài liệu thiết kế (design document).

2. **Dùng Git Worktrees (`using-git-worktrees`)**
   - Kích hoạt **sau khi thiết kế được duyệt**. Tạo một môi trường làm việc cô lập trên một branch mới, setup project và kiểm tra baseline (đảm bảo test chạy ok).

3. **Viết Plan (`writing-plans`)**
   - Kích hoạt **khi đã có bản thiết kế**. Chia nhỏ công việc thành các task siêu nhỏ (chỉ tốn 2-5 phút mỗi task). Mỗi task có đường dẫn file cụ thể, code cần thiết và các bước verify.

4. **Code qua Subagent (`subagent-driven-development` hoặc `executing-plans`)**
   - Kích hoạt **dựa trên Plan đã viết**. Agent sẽ tự động tạo ra một Subagent (một luồng phụ) cho mỗi task. Subagent sẽ thực hiện code, sau đó sẽ qua 2 bước review (review tính tuân thủ spec, sau đó review chất lượng code). Quá trình này hoàn toàn tự động, bạn có thể thiết lập các điểm dừng (checkpoint) để duyệt.

5. **Test-Driven Development - TDD (`test-driven-development`)**
   - Kích hoạt **trong lúc viết code**. Ép agent tuân thủ chu trình RED-GREEN-REFACTOR: Viết test fail -> chạy thấy fail -> viết code tối giản để pass -> chạy thấy pass -> commit. Code nào viết trước khi có test sẽ bị xoá!

6. **Yêu cầu Review Code (`requesting-code-review`)**
   - Kích hoạt **giữa các task**. Kiểm tra code dựa trên Plan, báo cáo các vấn đề theo độ nghiêm trọng. Lỗi nghiêm trọng (Critical) sẽ chặn không cho làm tiếp đến khi sửa xong.

7. **Kết thúc Branch (`finishing-a-development-branch`)**
   - Kích hoạt **khi mọi task hoàn thành**. Xác nhận lại test, đưa ra các lựa chọn (merge/PR/keep/discard) và dọn dẹp worktree.

## Danh sách các "Siêu năng lực" (Skills Library)

### Kiểm thử (Testing)
- `test-driven-development` - Chu trình TDD chuẩn.

### Gỡ lỗi (Debugging)
- `systematic-debugging` - Quy trình tìm nguyên nhân gốc rễ 4 bước.
- `verification-before-completion` - Xác minh chắc chắn lỗi đã được fix.

### Phối hợp & Kế hoạch (Collaboration)
- `brainstorming` - Tinh chỉnh thiết kế kiểu Socrates.
- `writing-plans` - Lập kế hoạch triển khai chi tiết.
- `executing-plans` - Chạy batch các task có điểm dừng.
- `dispatching-parallel-agents` - Chạy các subagent song song.
- `requesting-code-review` / `receiving-code-review` - Quy trình review code.
- `using-git-worktrees` - Quản lý branch song song.
- `finishing-a-development-branch` - Đóng branch.
- `subagent-driven-development` - Lặp vòng lặp nhanh với review 2 lớp.

### Khác (Meta)
- `writing-skills` - Hướng dẫn tạo skill mới.
- `using-superpowers` - Giới thiệu về hệ thống skills.

## Triết lý hoạt động
- **TDD:** Luôn luôn viết test trước.
- **Có hệ thống thay vì làm bừa:** Đặt quy trình lên trên việc đoán mò.
- **Giảm độ phức tạp:** Đơn giản hóa là mục tiêu tối thượng.
- **Chứng cứ thay vì tự nhận:** Luôn xác minh trước khi tuyên bố hoàn thành.

## Lưu ý nội bộ
*Tài liệu này và thư mục code của skill `superpowers` đã được chặn trong `.gitignore` để lưu hành nội bộ ở local, không bị đẩy lên GitHub.*
