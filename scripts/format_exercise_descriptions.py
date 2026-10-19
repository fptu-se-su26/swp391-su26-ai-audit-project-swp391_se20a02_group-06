#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script chuẩn hóa cột `description` trong bảng `exercises` của database `fitnessproject`.
Chuyển đổi các câu hướng dẫn thành từng bước đánh số rõ ràng:
Bước 1: ...
Bước 2: ...
Bước 3: ...
"""

import re
import subprocess
import os

# Cấu hình DB cục bộ
DB_USER = "root"
DB_PASS = "Levandat2004^"
DB_NAME = "fitnessproject"

# Hướng dẫn chi tiết cho các bài tập khởi động / đặc biệt có 1 câu ngắn
SPECIAL_EXERCISES = {
    1: (
        "Bước 1: Đứng thẳng người, hai chân mở rộng bằng vai, hai tay buông thả lỏng hoặc co nhẹ bên hông.\n"
        "Bước 2: Nâng luân phiên từng đầu gối lên cao ngang đùi giống như động tác giậm chân tại chỗ.\n"
        "Bước 3: Đánh nhẹ hai tay theo nhịp bước chân để khởi động tuần hoàn máu toàn thân.\n"
        "Bước 4: Duy trì nhịp thở đều đặn trong suốt thời gian khởi động."
    ),
    2: (
        "Bước 1: Đứng thẳng người, hai chân khép gần nhau, mắt nhìn về phía trước.\n"
        "Bước 2: Bước một chân sang ngang, đồng thời giơ hai tay lên cao qua đầu.\n"
        "Bước 3: Thu chân và hạ hai tay về vị trí ban đầu, sau đó đổi sang chân đối diện.\n"
        "Bước 4: Lặp lại nhịp nhàng liên tục theo nhịp điệu đều đặn."
    ),
    3: (
        "Bước 1: Đứng thẳng người, hai chân rộng bằng hông, hai tay chống hông hoặc thả lỏng.\n"
        "Bước 2: Bước một chân ra sau, hạ thấp hông sao cho cả hai đầu gối gập khoảng 90 độ.\n"
        "Bước 3: Dùng lực gót chân trước đẩy người đứng thẳng dậy về vị trí ban đầu.\n"
        "Bước 4: Đổi sang chân còn lại và lặp lại động tác luân phiên."
    ),
    4: (
        "Bước 1: Đứng thẳng với tư thế thoải mái, hai bàn chân bám chắc trên mặt sàn.\n"
        "Bước 2: Xoay tròn nhẹ nhàng các khớp cổ tay, cổ chân, vai và hông theo chiều kim đồng hồ.\n"
        "Bước 3: Đảo chiều xoay sau mỗi 10-15 giây để bôi trơn toàn diện các khớp xương.\n"
        "Bước 4: Hít sâu thở chậm, sẵn sàng bước vào bài tập chính."
    ),
    5: (
        "Bước 1: Đứng hai chân rộng hơn vai một chút, hai tay đan vào nhau trước ngực.\n"
        "Bước 2: Vươn hai tay thẳng lên trần nhà, kéo giãn toàn bộ cột sống và cơ liên sườn.\n"
        "Bước 3: Nghiêng nhẹ người sang trái, giữ 3-5 giây rồi đổi sang bên phải.\n"
        "Bước 4: Thở ra nhẹ nhàng và hạ tay xuống thả lỏng cơ thể."
    ),
    6: (
        "Bước 1: Đứng thẳng, nhón nhẹ gót chân và thực hiện động tác nhảy nhẹ tại chỗ.\n"
        "Bước 2: Thả lỏng hai vai và cổ tay theo từng nhịp nảy của cơ thể.\n"
        "Bước 3: Kết hợp xoay nhẹ mũi chân và vung tay nhịp nhàng để tăng nhịp tim.\n"
        "Bước 4: Duy trì nhịp độ ổn định từ 30 đến 45 giây."
    ),
    7: (
        "Bước 1: Đứng thẳng, hai tay giơ ngang vai tạo thành đường thẳng song song mặt sàn.\n"
        "Bước 2: Xoay hai cánh tay thành các vòng tròn nhỏ theo chiều tiến về phía trước.\n"
        "Bước 3: Tăng dần biên độ vòng xoay sau mỗi 10 giây, sau đó đảo chiều xoay ngược lại.\n"
        "Bước 4: Cảm nhận sự ấm lên của cơ vai và lưng trên trước khi tập luyện."
    ),
    8: (
        "Bước 1: Bắt đầu ở tư thế chống đẩy (plank cao), hai bàn tay thẳng dưới vai, giữ lưng và hông thẳng.\n"
        "Bước 2: Gồng chặt cơ bụng, kéo gối phải về phía ngực nhanh nhưng có kiểm soát.\n"
        "Bước 3: Đưa chân phải về vị trí cũ và đồng thời kéo gối trái về phía ngực.\n"
        "Bước 4: Luân phiên đổi chân liên tục nhịp nhàng, duy trì hơi thở đều."
    ),
    9: (
        "Bước 1: Bắt đầu ở tư thế plank trên khuỷu tay hoặc bàn tay, siết chặt cơ bụng và cơ mông.\n"
        "Bước 2: Co một bên đầu gối đưa lên hướng về phía cùi chỏ cùng bên hoặc chéo bên.\n"
        "Bước 3: Siết chặt cơ liên sườn trong 1 giây ở điểm co cơ tối đa.\n"
        "Bước 4: Đưa chân trở về vị trí plank ban đầu và đổi sang chân còn lại."
    ),
    10: (
        "Bước 1: Bắt đầu ở tư thế plank cao với hai tay chống sàn rộng bằng vai.\n"
        "Bước 2: Siết chặt cơ lõi (core), nhún nhẹ đầu gối và nhảy bật cả hai chân về phía trước gần bàn tay.\n"
        "Bước 3: Tiếp đất êm bằng mũi chân, giữ trọng tâm ổn định.\n"
        "Bước 4: Nhảy bật cả hai chân lùi về lại tư thế plank ban đầu."
    ),
}

def escape_sql(text: str) -> str:
    """Escape các ký tự đặc biệt cho câu lệnh SQL"""
    if not text:
        return ""
    return text.replace("\\", "\\\\").replace("'", "''").replace("\r", "")

def split_sentences_into_steps(description: str) -> str:
    """Tách câu từ description tiếng Anh hoặc tiếng Việt thành từng Bước 1, Bước 2..."""
    clean = description.strip()
    if not clean:
        return ""
    
    # Nếu đã có Bước 1 / Step 1 / 1. xuống dòng sẵn thì giữ nguyên
    if re.search(r'^(Bước|Step)\s*1[:\.]|^1[\.\)]\s+', clean, re.IGNORECASE) and '\n' in clean:
        return clean
    
    # Xoá các ký tự tiền tố cũ nếu có
    clean = re.sub(r'^(Bước|Step)\s*\d+[:\.]?\s*|^\d+[\.\)]\s*', '', clean, flags=re.IGNORECASE)
    
    # Tách câu theo dấu chấm, chấm than, hỏi chấm kèm ký tự viết hoa tiếp theo
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9À-Ỹ])', clean)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Nếu tách được nhiều câu
    if len(sentences) > 1:
        steps = []
        for i, s in enumerate(sentences, 1):
            # Đảm bảo câu kết thúc có dấu chấm
            s_clean = s.rstrip('.') + '.'
            steps.append(f"Bước {i}: {s_clean}")
        return "\n".join(steps)
    elif len(sentences) == 1:
        return f"Bước 1: {sentences[0].rstrip('.') + '.'}"
    return clean

def main():
    print("=== BẮT ĐẦU CHUẨN HÓA BẢNG EXERCISES ===")
    
    # 1. Lấy dữ liệu bài tập hiện tại
    query_cmd = f"mysql -u {DB_USER} -p'{DB_PASS}' {DB_NAME} -N -e 'SELECT id, description FROM exercises;'"
    res = subprocess.run(query_cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Lỗi khi đọc exercises: {res.stderr}")
        return

    lines = res.stdout.strip().split("\n")
    print(f"Tổng số bài tập tìm thấy: {len(lines)}")
    
    sql_statements = []
    updated_count = 0

    for line in lines:
        if not line.strip():
            continue
        parts = line.split("\t", 1)
        ex_id = int(parts[0])
        old_desc = parts[1] if len(parts) > 1 else ""

        # Kiểm tra nếu là bài tập khởi động/đặc biệt
        if ex_id in SPECIAL_EXERCISES:
            new_desc = SPECIAL_EXERCISES[ex_id]
        else:
            new_desc = split_sentences_into_steps(old_desc)

        if new_desc and new_desc != old_desc:
            escaped_desc = escape_sql(new_desc)
            sql_statements.append(f"UPDATE exercises SET description = '{escaped_desc}' WHERE id = {ex_id};")
            updated_count += 1

    print(f"Số bài tập cần cập nhật định dạng: {updated_count}")

    if not sql_statements:
        print("Tất cả bài tập đã đúng định dạng!")
        return

    # Lưu SQL ra file tạm
    temp_sql_file = "/tmp/update_exercises_steps.sql"
    with open(temp_sql_file, "w", encoding="utf-8") as f:
        f.write("START TRANSACTION;\n")
        f.write("\n".join(sql_statements))
        f.write("\nCOMMIT;\n")

    print(f"Đã tạo file SQL: {temp_sql_file}. Đang thực thi vào MySQL...")

    exec_cmd = f"mysql -u {DB_USER} -p'{DB_PASS}' {DB_NAME} < {temp_sql_file}"
    exec_res = subprocess.run(exec_cmd, shell=True, capture_output=True, text=True)
    if exec_res.returncode != 0:
        print(f"Lỗi khi thực thi SQL: {exec_res.stderr}")
        return

    print("✅ CẬP NHẬT THÀNH CÔNG VÀO DATABASE LOCAL!")
    print(f"Đã cập nhật {updated_count} bài tập sang định dạng Bước 1, Bước 2...")

if __name__ == "__main__":
    main()
