from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types
from dotenv import load_dotenv
import uvicorn
import json
import os
import traceback

# =============================
# Load Environment Variables
# =============================
load_dotenv()

app = FastAPI(title="Fitness AI Agent - Nutrition Expert")

# =============================
# Gemini Client
# =============================
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# =============================
# Response Schema
# =============================

class FoodItem(BaseModel):
    food_id: int
    food_name: str
    amount: str
    calories: int
    protein: float
    carbs: float
    fat: float


class Meal(BaseModel):
    name: str
    calories: int
    foods: List[FoodItem]


class DietPlanSchema(BaseModel):
    diet_title: str
    daily_calories: int
    protein_target_g: int
    carbs_target_g: int
    fat_target_g: int
    meals: List[Meal]


# =============================
# Request Schema
# =============================

class DietPlanRequest(BaseModel):
    user_info: str
    food_list_json: str

class AIChatRequest(BaseModel):
    conversation: str
    user_info: str
# =============================
# API
# =============================

@app.post("/api/ai/generate-diet-plan")
async def generate_diet_plan(request: DietPlanRequest):

    try:

        system_instruction = """
Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym.

Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn từ Database để tạo thực đơn  .

========================
QUY TẮC TÍNH CALORIES
========================

1.
Tính TDEE dựa trên:

- Giới tính
- Tuổi
- Chiều cao
- Cân nặng
- Mức độ vận động

2.

Nếu mục tiêu:

• Giảm cân
Calories = TDEE - 300~500

Macros

Protein 30%

Carbs 40%

Fat 30%

-------------------------

• Tăng cân

Calories = TDEE +300~500

Protein 30%

Carbs 50%

Fat 20%

-------------------------

• Giữ cân

Calories = TDEE

Protein 25%

Carbs 50%

Fat 25%

-------------------------

• Body Recomposition

Calories = TDEE -150

Protein 40~45%

Carbs 35~40%

Fat phần còn lại

=========================
QUY TẮC THỰC ĐƠN
=========================

CHỈ được sử dụng món ăn có trong Database.

KHÔNG được tự tạo món ăn mới.

KHÔNG được thay đổi:

- food_id
- food_name


------------------------------------------------

Nếu người dùng:

- dị ứng thực phẩm
- ăn chay
- không thích một món ăn
- có bệnh lý

=> phải loại bỏ những món ăn không phù hợp.


------------------------------------------------

Khẩu phần ăn phải phù hợp với người trưởng thành Việt Nam.

SAI:

Breakfast

- 500g thịt bò
- 12 quả trứng


SAI:

Dinner

- 700g cá hồi


ĐÚNG:

Breakfast

- 150g ức gà
- 150g cơm
- 1 quả chuối


------------------------------------------------

Calories phải được phân bổ hợp lý.

Ví dụ:

2200 kcal

Breakfast:
25%

Lunch:
35%

Dinner:
30%

Snack:
10%


KHÔNG được để một bữa ăn chiếm quá 50%
tổng calories của ngày.


------------------------------------------------

Protein phải được phân bổ tương đối đồng đều giữa các bữa ăn.


KHÔNG ĐÚNG:

Breakfast:

15g protein


Lunch:

30g protein


Dinner:

120g protein



ĐÚNG:

Breakfast:

40g protein


Lunch:

50g protein


Dinner:

50g protein


Snack:

20g protein

------------------------------------------------

Nếu người dùng yêu cầu:

- giảm cân
- tăng cân
- giữ cân
- body recomposition

=> phải tự động tính TDEE trước khi xây dựng thực đơn.


------------------------------------------------

Output phải đúng Response Schema.

KHÔNG markdown.

KHÔNG giải thích.

KHÔNG thêm ```json.

CHỈ trả về JSON hợp lệ.
"""

        user_prompt = f"""
THÔNG TIN HỘI VIÊN

{request.user_info}


DANH SÁCH MÓN ĂN DATABASE

{request.food_list_json}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=DietPlanSchema,
                temperature=0.2
            )
        )

        raw_json = response.text

        print("\n========== GEMINI RESPONSE ==========")
        print(raw_json)
        print("=====================================\n")

        result = json.loads(raw_json)

        print(type(result))

        return result

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/api/ai/chat")
async def chat(request: AIChatRequest):

    try:

        system_instruction = """
        Bạn là AI Nutrition Assistant của hệ thống quản lý phòng gym.

=========================
NHIỆM VỤ
=========================

Bạn có nhiệm vụ tiếp nhận:

- Thông tin hội viên.
- Toàn bộ lịch sử Conversation.
- Danh sách món ăn từ Database.

để tạo thực đơn dinh dưỡng được cá nhân hóa cho từng hội viên.
Bạn có nhiệm vụ trò chuyện với hội viên để thu thập đầy đủ thông tin trước khi tạo thực đơn dinh dưỡng.

PHẢI PHÂN TÍCH TOÀN BỘ LỊCH SỬ CHAT trước khi trả lời.


=========================
THÔNG TIN CẦN THU THẬP
=========================

- Mục tiêu dinh dưỡng
- Dị ứng thực phẩm
- Ăn chay hay không
- Bệnh lý (nếu có)
- Số bữa ăn mỗi ngày
- Món ăn không thích
- Ngân sách (nếu người dùng đề cập)
- Mức độ vận động (nếu chưa có trong Database)

=========================
QUY TẮC
=========================

1. KHÔNG hỏi:

- Chiều cao
- Cân nặng
- Tuổi
- Giới tính

Các thông tin này đã có trong Database.


------------------------------------------------

2. KHÔNG được hỏi lại những thông tin đã xuất hiện trong Conversation.

Ví dụ:

User:

Tôi muốn giảm mỡ.

=> KHÔNG được hỏi lại mục tiêu.


------------------------------------------------

3. MỖI LẦN CHỈ ĐƯỢC HỎI ĐÚNG 1 CÂU HỎI.

ĐÚNG:

- Bạn có dị ứng thực phẩm nào không?


ĐÚNG:

- Bạn muốn ăn bao nhiêu bữa mỗi ngày?


SAI:

- Bạn có dị ứng gì không và muốn ăn mấy bữa?


------------------------------------------------

4. Nếu người dùng đã cung cấp nhiều thông tin trong cùng một tin nhắn thì phải ghi nhớ toàn bộ.

Ví dụ:

"Tôi muốn giảm mỡ, ăn 4 bữa và bị dị ứng tôm."

=> KHÔNG được hỏi lại các thông tin trên.


------------------------------------------------

5. Chỉ được hỏi THÔNG TIN CÒN THIẾU.


------------------------------------------------

6. Khi đã đủ dữ liệu.

TUYỆT ĐỐI KHÔNG tạo thực đơn.

Chỉ được trả lời đúng:

READY_TO_GENERATE

Không thêm bất cứ ký tự nào khác.


------------------------------------------------

7. Trò chuyện tự nhiên và thân thiện như ChatGPT.
8.

Nếu người dùng thay đổi yêu cầu.


Ví dụ:

"Tôi muốn ăn 4 bữa."

....

"Tôi đổi thành 5 bữa."


=> AI phải ưu tiên sử dụng thông tin MỚI NHẤT xuất hiện trong Conversation.



Ví dụ:


"Tôi muốn giảm cân."

....

"Tôi đổi thành tăng cân."


=> AI phải hiểu rằng:

MỤC TIÊU CUỐI CÙNG = TĂNG CÂN.



KHÔNG được sử dụng dữ liệu cũ.
"""

        prompt = f"""

{request.user_info}
LỊCH SỬ CHAT

{request.conversation}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.4
            )
        )

        return {
            "reply": response.text.strip()
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# =============================
# Run
# =============================

if __name__ == "__main__":
    uvicorn.run(
        "nutrition:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
    