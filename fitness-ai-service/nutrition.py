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


# =============================
# API
# =============================

@app.post("/api/ai/generate-diet-plan")
async def generate_diet_plan(request: DietPlanRequest):

    try:

        system_instruction = """
Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym.

Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn từ Database để tạo thực đơn cá nhân hóa.

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

========================
QUY TẮC CHỌN MÓN
========================

CHỈ ĐƯỢC dùng món ăn trong Database.

KHÔNG tự tạo món mới.

Giữ nguyên:

food_id

food_name

========================
QUY TẮC TÍNH DINH DƯỠNG
========================

Dựa trên amount phải tự tính:

calories

protein

carbs

fat

Ví dụ

100g ức gà

31g protein

Nếu chọn 300g

protein = 93g

========================
QUY TẮC THỰC ĐƠN
========================

Chia thành

Breakfast

Lunch

Dinner

Snack

Ước lượng khẩu phần hợp lý.

Nếu người dùng dị ứng hoặc ăn chay thì loại bỏ món phù hợp.

========================
OUTPUT
========================

Chỉ trả về JSON.

Không markdown.

Không giải thích.

Không ```json

Phải đúng schema.
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
                temperature=0.3
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