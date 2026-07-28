# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Development Project  |
| Mã môn học | SWP391 |
| Lớp | SE20A02   |
| Học kỳ | SU26 |
| Tên bài tập / Project | AI FITNESS SYSTEM |
| Tên sinh viên / Nhóm | CAO DIEN HUNG / GROUP 6 |
| MSSV / Danh sách MSSV | SE183792 |
| Giảng viên hướng dẫn | QUANGLTN3 |
| Ngày bắt đầu | 11/05/2026  |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [X] ChatGPT
- [X] Gemini
- [X] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác: ....................................

---

## 3. Mục tiêu sử dụng AI

Mô tả ngắn gọn sinh viên/nhóm đã sử dụng AI để hỗ trợ những công việc nào.
- Phân tích yêu cầu bài toán
- Gợi ý ý tưởng giải pháp
- Debug lỗi
- Tìm hiểu công nghệ mới

### Mô tả mục tiêu sử dụng AI


## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Gemini |
| Mục đích sử dụng | promt những cách tạo con AI |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỗ trợ một phần  |

#### 4.1. Prompt đã sử dụng

```text
Tôi đang làm một dự án phần mềm có tên là "AI Fitness System". Tôi muốn tích hợp AI vào hệ thống thông qua API (như OpenAI GPT hoặc Google Gemini) để đảm nhận 2 nhiệm vụ cốt lõi sau:

1. Tính năng 1 (AI Workout): Tự động tạo menu bài tập dựa trên thông tin đầu vào của hội viên (Tuổi, Giới tính, Chiều cao, Cân nặng, Mục tiêu: Tăng cơ/Giảm cân, Mức độ thể lực).
2. Tính năng 2 (AI Nutrition): Tự động thiết kế thực đơn dinh dưỡng sau bài tập cho hội viên dựa trên thể trạng và lượng calo họ vừa đốt cháy.

Hãy đóng vai trò là một AI Engineer và cố vấn kỹ thuật chuyên sâu để hướng dẫn tôi cách xây dựng "con AI" này:

YÊU CẦU TƯ VẤN:
1. System Prompt chuẩn: Hãy viết giúp tôi 2 đoạn System Prompt chi tiết (một cho bài tập, một cho dinh dưỡng) để nạp vào API. Prompt phải ép AI đóng vai trò chuyên gia và BẮT BUỘC trả về dữ liệu dưới dạng cấu trúc JSON thuần túy (không chứa chữ giải thích dông dài, không chứa bọc định dạng ```json).
2. Cấu trúc JSON mẫu: Thiết kế cấu trúc JSON đầu ra cho cả 2 tính năng trên để code Backend của tôi có thể dễ dàng bóc tách (parse) thành các trường dữ liệu và lưu xuống Database.
3. Giải quyết bài toán "Output không ổn định": Làm thế nào để đảm bảo AI luôn trả về đúng cấu trúc JSON 100%, không bị lỗi thiếu dấu ngoặc, không bị tự ý đổi tên Key, và không trả về văn bản tự do khiến hệ thống bị crash (sập)? Có các kỹ thuật hay thiết lập tham số API nào (ví dụ: temperature, response_format) để kiểm soát việc này không?

Hãy giải thích chi tiết và cung cấp các đoạn prompt mẫu sẵn sàng để tôi đem vào chạy thử nghiệm nghiệm thu (test) API nhé.Dán nguyên văn prompt đã hỏi AI tại đây.
```

#### 4.2. Kết quả AI gợi ý


Viết tại đây...
```

Bạn đang đi đúng hướng nếu xem “AI Fitness System” như một AI recommendation engine + JSON API service, thay vì chatbot thông thường. Với use case của bạn, mục tiêu số 1 không phải “AI nói hay”, mà là AI trả về dữ liệu ổn định để backend parse được 100%.

Kiến trúc tôi khuyên dùng:

Frontend
   ↓
Backend (Java/.NET/Node)
   ↓
Prompt Builder + Validation Layer
   ↓
LLM API (GPT/Gemini)
   ↓
Strict JSON Response
   ↓
JSON Schema Validation
   ↓
Database

Đừng để Frontend gọi AI trực tiếp.

1. Thiết kế kiến trúc AI Fitness System

Bạn có 2 AI Service riêng:

AI Workout Service

Input:

{
  "age": 23,
  "gender": "male",
  "height_cm": 175,
  "weight_kg": 80,
  "goal": "muscle_gain",
  "fitness_level": "intermediate",
  "days_per_week": 5,
  "health_conditions": []
}

Output:

workout plan
exercises
reps
sets
rest time
calories estimation
safety notes
AI Nutrition Service

Input:

{
  "age": 23,
  "gender": "male",
  "height_cm": 175,
  "weight_kg": 80,
  "goal": "fat_loss",
  "calories_burned": 620,
  "diet_preference": "high_protein",
  "allergies": ["seafood"]
}

Output:

total calories recommendation
macros
meals
ingredients
portions
meal timing
2. SYSTEM PROMPT CHUẨN – AI WORKOUT

Đây là prompt production-ready.

You are an elite certified fitness coach, exercise physiologist, and sports science specialist.

Your task is to generate a personalized workout program for gym members based on their body metrics, goals, and fitness level.

STRICT RULES:

You MUST respond ONLY with valid raw JSON.
DO NOT include markdown.
DO NOT include ```json.
DO NOT explain anything outside JSON.
DO NOT add extra text before or after JSON.
Keep JSON property names EXACTLY as specified.
Return ONLY one valid JSON object.
Every exercise must contain all required fields.
If user data is incomplete, infer safely and include warning_notes.

Workout planning requirements:

Goal types:
muscle_gain
fat_loss
maintenance
endurance
Fitness level:
beginner
intermediate
advanced
Include warm-up and cool-down.
Ensure safe training volume based on experience.
Avoid dangerous exercise recommendations.
Workout duration should be realistic (45–90 mins).
Exercises must match the user's goal.

MANDATORY JSON FORMAT:

{
"member_profile": {
"age": number,
"gender": "male|female|other",
"height_cm": number,
"weight_kg": number,
"bmi": number,
"goal": "muscle_gain|fat_loss|maintenance|endurance",
"fitness_level": "beginner|intermediate|advanced"
},
"workout_plan": {
"program_name": string,
"duration_weeks": number,
"weekly_schedule": [
{
"day": string,
"focus": string,
"estimated_duration_minutes": number,
"warmup": [
{
"exercise_name": string,
"duration_minutes": number
}
],
"main_workout": [
{
"exercise_name": string,
"muscle_group": string,
"sets": number,
"reps": string,
"rest_seconds": number,
"intensity": string,
"instructions": string
}
],
"cooldown": [
{
"exercise_name": string,
"duration_minutes": number
}
],
"estimated_calories_burned": number
}
]
},
"recommendations": {
"daily_water_intake_liters": number,
"sleep_hours": number,
"recovery_tips": [string]
},
"warning_notes": [string]
}

Vì sao prompt này ổn?

Nó ép:

role = fitness expert
output = JSON only
cấm markdown
khóa tên key
schema rõ ràng
enum values cố định

=> giảm hallucination cực mạnh.

3. JSON OUTPUT MẪU – AI WORKOUT

Ví dụ response thực tế:

{
  "member_profile": {
    "age": 24,
    "gender": "male",
    "height_cm": 175,
    "weight_kg": 78,
    "bmi": 25.5,
    "goal": "muscle_gain",
    "fitness_level": "intermediate"
  },
  "workout_plan": {
    "program_name": "Lean Muscle Builder",
    "duration_weeks": 8,
    "weekly_schedule": [
      {
        "day": "Monday",
        "focus": "Chest and Triceps",
        "estimated_duration_minutes": 70,
        "warmup": [
          {
            "exercise_name": "Jump Rope",
            "duration_minutes": 5
          }
        ],
        "main_workout": [
          {
            "exercise_name": "Bench Press",
            "muscle_group": "Chest",
            "sets": 4,
            "reps": "8-10",
            "rest_seconds": 90,
            "intensity": "moderate-heavy",
            "instructions": "Maintain proper form and controlled motion."
          }
        ],
        "cooldown": [
          {
            "exercise_name": "Chest Stretch",
            "duration_minutes": 5
          }
        ],
        "estimated_calories_burned": 420
      }
    ]
  },
  "recommendations": {
    "daily_water_intake_liters": 3.2,
    "sleep_hours": 8,
    "recovery_tips": [
      "Stretch after training",
      "Consume protein after workout"
    ]
  },
  "warning_notes": []
}

Backend Java parse rất dễ:

ObjectMapper mapper = new ObjectMapper();

WorkoutResponse response =
    mapper.readValue(json, WorkoutResponse.class);
4. SYSTEM PROMPT CHUẨN – AI NUTRITION

You are an elite sports nutritionist, certified dietitian, and performance nutrition specialist.

Your task is to generate a personalized post-workout nutrition plan based on the member's body profile, fitness goal, and calories burned.

STRICT RULES:

You MUST respond ONLY with valid raw JSON.
DO NOT include markdown.
DO NOT include ```json.
DO NOT explain anything outside JSON.
Keep property names EXACTLY as defined.
Return ONLY one valid JSON object.
Meal recommendations must be realistic and nutritionally balanced.
Respect allergies and diet preferences.

Nutrition goals:

muscle_gain
fat_loss
maintenance
endurance

Diet preferences:

high_protein
balanced
vegetarian
vegan
keto

MANDATORY JSON FORMAT:

{
"member_profile": {
"age": number,
"gender": "male|female|other",
"height_cm": number,
"weight_kg": number,
"goal": string,
"calories_burned": number
},
"nutrition_plan": {
"daily_target_calories": number,
"macro_distribution": {
"protein_grams": number,
"carbs_grams": number,
"fat_grams": number
},
"recommended_meals": [
{
"meal_name": string,
"meal_time": string,
"calories": number,
"foods": [
{
"food_name": string,
"quantity": string,
"estimated_calories": number,
"protein_grams": number
}
]
}
]
},
"hydration": {
"recommended_water_liters": number,
"electrolyte_needed": boolean
},
"supplement_suggestions": [string],
"warning_notes": [string]
}

5. JSON OUTPUT MẪU – AI NUTRITION
{
  "member_profile": {
    "age": 24,
    "gender": "male",
    "height_cm": 175,
    "weight_kg": 78,
    "goal": "muscle_gain",
    "calories_burned": 500
  },
  "nutrition_plan": {
    "daily_target_calories": 2800,
    "macro_distribution": {
      "protein_grams": 180,
      "carbs_grams": 300,
      "fat_grams": 70
    },
    "recommended_meals": [
      {
        "meal_name": "Post Workout Meal",
        "meal_time": "18:00",
        "calories": 650,
        "foods": [
          {
            "food_name": "Chicken Breast",
            "quantity": "200g",
            "estimated_calories": 330,
            "protein_grams": 62
          }
        ]
      }
    ]
  },
  "hydration": {
    "recommended_water_liters": 3.5,
    "electrolyte_needed": true
  },
  "supplement_suggestions": [
    "Whey Protein",
    "Creatine Monohydrate"
  ],
  "warning_notes": []
}
6. Làm sao để output ổn định 100%?

Đây là phần quan trọng nhất.

Kỹ thuật 1: Temperature thấp

OpenAI:

{
  "temperature": 0.1
}

Khuyên dùng:

0.0 → 0.2

Vì bạn không cần sáng tạo.

Bạn cần:

deterministic structured output

Không phải “AI sáng tạo meal plan”.

Kỹ thuật 2: JSON Schema / Structured Output (CỰC QUAN TRỌNG)

Với GPT API mới:

Dùng:

response_format

Ví dụ:

{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "fitness_workout_response",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "member_profile": {
            "type": "object"
          }
        }
      }
    }
  }
}

strict: true

=> model bị ép phải theo schema.

Không được đổi key.

Không được nói linh tinh.

Đây là best practice production.

Kỹ thuật 3: Backend JSON Validation

Không bao giờ trust AI 100%.

Java:

try {
    ObjectMapper mapper = new ObjectMapper();

    WorkoutResponse response =
        mapper.readValue(aiResult,
            WorkoutResponse.class);

} catch (Exception e) {

    // Retry API
}

Nếu parse fail:

Retry mechanism
Retry 1
→ thêm message:
"The previous response was invalid JSON.
Fix it and return valid JSON only."

Retry 2
→ fallback template
Kỹ thuật 4: Function Calling / Tool Calling

Nếu dùng GPT:

Dùng structured tool.

Ví dụ:

tools

AI không generate text.

AI generate object.

Độ ổn định cao hơn prompt-only.

Kỹ thuật 5: Fixed Enum

KHÔNG cho AI tự đặt value.

Sai:

"goal": "build huge muscle"

Đúng:

"goal": "muscle_gain"

Chỉ dùng enum.

Backend dễ query DB.

Kỹ thuật 6: Versioning Prompt

Đừng hardcode prompt.

Lưu DB:

prompt_version = v1.0

Sau này:

v1.1
v2.0

Dễ rollback nếu AI trả kết quả tệ.

7. API setting khuyên dùng

Với GPT:

{
  "model": "gpt-4.1-mini",
  "temperature": 0.1,
  "top_p": 0.1,
  "response_format": {
    "type": "json_object"
  }
}

Production hơn:

"type": "json_schema"

Gemini:

dùng:

responseMimeType:
"application/json"
responseSchema

để ép schema.

Kiến trúc production-ready nhất cho đồ án của bạn là:

Prompt
    ↓
JSON Schema
    ↓
AI API
    ↓
Response Validation
    ↓
Retry if invalid
    ↓
Save DB

Cách này đủ ổn định để demo đồ án, thậm chí deploy thật ở quy mô nhỏ mà không bị “AI nói lung tung làm sập hệ thống”.#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

Mô tả rõ phần nào được sử dụng lại từ gợi ý của AI.

```text
Viết tại đây...
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với gợi ý ban đầu của AI.

```text
Tối ưu mục 1.1 (Thêm input tần suất):
-Đầu vào AI Workout:Tuổi,Giới tính,Chiều cao,Cân nặng,mục tiêu luyện tập(Tăng cơ,giảm cân,duy trì),mức độ thể lực,tần suất tập luyện mong muốn.

Tối ưu mục 3 và 6 (Kết hợp giữa pronmt và schema:
-Thiết kế Promt: Tập trung vào luật định lượng dinh dưỡng và huấn luyện
-kiểm soát định dạng : Giao hoàn toàn cho tính năng Structured Outputs và responseSchema để đảm bảo an toàn tuyệt đối,loại bỏ các câu lệnh cấm đoán thủ công trg text prompt.

Bổ sung mục 5.6 : quản lý trạng thái bất đồng bộ:
-GỌI APT từ cá model lớn mất 3-7s.nếu frontend đội Backend theo kiểu đòng bộ,user sẽ thấy app bị đơ.
-Nên dùng cơ chế Loadin State ỏ Frontend,hoặc Backend xử lý hàng đợi(Queue) /dùng Server-Sent Events(SSE) để tạo trải nghiệm mượt mà hơn.

```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | <img width="978" height="485" alt="image" src="https://github.com/user-attachments/assets/5bf22043-0bb9-49fa-8560-ff0245fd8197" />
 |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

Sinh viên/nhóm học được gì sau lần sử dụng AI này?

```text
Giải thích khá chi tiết và giúp tôi hình dung bao quát về cách tạo con AI và logic code của nó.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 25/6/2004  |
| Công cụ AI |  Antigravity  |
| Mục đích sử dụng | Hỏi về luồng xử lý của code dành cho AI tư vấn bài tập cho users  |
| Phần việc liên quan |  Other |
| Mức độ sử dụng |  Hỗ trợ nhiều  |

#### 4.1. Prompt đã sử dụng

```text
Hãy giúp tôi hình dung ra luồng xử lý code đầy đủ nhắt về AI tạo bài tậpDán nguyên văn prompt đã hỏi AI tại đây.
```

#### 4.2. Kết quả AI gợi ý

```text
1. Người dùng (Frontend / UI)
Người dùng chọn thông số (nhóm cơ, mục tiêu calo, thời gian tập) và nhấn nút "Tạo lịch tập AI".

Giao diện gửi yêu cầu (HTTP Request) chứa các thông số này lên Backend C#.

2. Hệ thống C# (.NET 9 Backend)
Nhận Yêu Cầu: C# tiếp nhận yêu cầu từ Frontend.

Đọc Database: C# truy vấn Database MySQL để lọc ra danh sách các bài tập thực tế tương ứng (đã được duyệt) đang có trong hệ thống.

Đóng Gói: C# gom thông số của người dùng cùng danh sách bài tập thực tế từ Database lại thành một gói dữ liệu.

Chuyển Tiếp: C# gửi gói dữ liệu này sang dịch vụ Python.

3. Dịch vụ AI (Python FastAPI Microservice)
Tiếp Nhận: Python nhận gói dữ liệu từ C#.

Gửi tới AI: Python xây dựng câu lệnh (Prompt) kèm kho bài tập thực tế và gửi sang Gemini API.

Ép Khuôn Data: Nhờ cơ chế Định dạng Đầu ra (Structured Output), Gemini buộc phải sắp xếp lịch tập bằng chính các bài tập có trong kho, tính toán số set/rep/thời gian nghỉ và trả về kết quả đúng cấu trúc JSON quy định.

4. Xử lý phản hồi (Python ➔ C#)
Python nhận kết quả từ Gemini, kiểm tra tính hợp lệ rồi gửi ngược về cho C#.

C# nhận kết quả, lưu lịch sử tạo (Audit Log) để phục vụ kiểm tra/báo cáo, sau đó chuyển kết quả về lại cho Frontend.

5. Hiển thị & Lưu trữ (Frontend & Database)
Hiển Thị: Giao diện Frontend nhận dữ liệu và vẽ ra lịch luyện tập chi tiết cho người dùng xem.

Lưu Bảng: Khi người dùng bấm "Lưu lịch tập", Frontend gửi xác nhận để C# lưu chính thức kế hoạch tập luyện này vào các bảng lưu trữ trong MySQL.Viết tại đây...
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Khi người dùng chọn mục tiêu trên Frontend, yêu cầu được gửi tới Backend C# . Tại đây, C# sẽ truy vấn Database MySQL để lấy danh sách các bài tập hợp lệ, đóng gói cùng thông tin người dùng rồi gửi sang (FastAPI). Python chuyển dữ liệu này tới Gemini AI để tính toán set, rep và thời gian nghỉ dựa trên đúng kho bài tập thực tế. Sau khi Gemini trả về kết quả chuẩn khung, Python chuyển ngược lại cho C# lưu lịch sử (Audit Log), rồi trả về Frontend để hiển thị lịch tập hoàn chỉnh cho người dùng lưu vào hệ thống.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | <img width="1091" height="302" alt="image" src="https://github.com/user-attachments/assets/c2ac414a-cbb2-4fc8-88a7-ec26563c5222" />
  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Giúp hình dung rõ luồng xử lý của AI tư vấn bài tập cho users,từ đó dễ test và tìm kiếm bug khi có sai sót.
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 6/7/2026 |
| Công cụ AI | Gemini  |
| Mục đích sử dụng |  |
| Phần việc liên quan |  Backend  |
| Mức độ sử dụng | Hỗ trợ một phần  |

#### 4.1. Prompt đã sử dụng

```text
Làm sao để đảm bảo AI Gemini không bao giờ tự bịa ra bài tập không có trong Database?Dán nguyên văn prompt đã hỏi AI tại đây.
```

#### 4.2. Kết quả AI gợi ý

```text
Dùng kỹ thuật RAG (Retrieval-Augmented Generation) đơn giản bằng cách lọc danh sách bài tập từ MySQL trước rồi mới gửi sang Python, kết hợp với tính năng Structured Output (Pydantic Schema) của Gemini để khóa chặt đầu ra.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
để triệt tiêu hoàn toàn hiện tượng bị ảo (Hallucination) của AI, nhóm không cho phép Gemini tự do sáng tạo bài tập. Thay vào đó, nhóm áp dụng mô hình RAG thu nhỏ.Trước khi gửi yêu cầu sang AI, Backend C# (.NET 9) sẽ truy vấn MySQL để lọc ra danh sách các bài tập hợp lệ (Status = Approved) thuộc đúng nhóm cơ người dùng yêu cầu. Danh sách này được đóng gói và ném sang cho AI làm ngữ cảnh cố định (Context Boundary). AI chỉ được phép lựa chọn và sắp xếp dựa trên tập dữ liệu thực tế.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Để triệt tiêu hoàn toàn hiện tượng AI tự bịa ra bài tập (Hallucination), hệ thống áp dụng mô hình RAG thu nhỏ kết hợp kiểm soát dữ liệu hai lớp: Đầu tiên, Backend C# sẽ truy vấn MySQL để lọc ra danh sách bài tập hợp lệ và truyền sang cho Python làm ngữ cảnh cố định; tại Microservice Python, nhóm sử dụng tính năng Structured Output của Gemini kết hợp Pydantic Schema để ép AI bắt buộc phải trả về JSON chuẩn chứa đúng các ID bài tập có trong danh sách. Nhờ đó, AI chỉ đóng vai trò tính toán số Set, Rep và thời gian nghỉ tối ưu chứ không thể tự sáng tạo bài tập nằm ngoài Database
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | <img width="1197" height="652" alt="image" src="https://github.com/user-attachments/assets/fb46d2cb-6528-4ea6-bf30-86a23e204319" />
 |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Viết tại đây...
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
