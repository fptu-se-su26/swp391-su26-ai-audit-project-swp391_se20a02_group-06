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

@app.get("/")
async def root():
    return {"status": "healthy", "message": "Fitness AI Agent - Nutrition Expert is running"}

@app.post("/api/ai/generate-diet-plan")
async def generate_diet_plan(request: DietPlanRequest):

    try:

        system_instruction = """
Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym.
Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn từ Database để tạo thực đơn.

========================
QUY TẮC TÍNH CALORIES
========================
1. Tính TDEE dựa trên: Giới tính, Tuổi, Chiều cao, Cân nặng, Mức độ vận động.
2. Nếu mục tiêu:
• Giảm cân: Calories = TDEE - 300~500 (Protein 30%, Carbs 40%, Fat 30%)
• Tăng cân: Calories = TDEE + 300~500 (Protein 30%, Carbs 50%, Fat 20%)
• Giữ cân: Calories = TDEE (Protein 25%, Carbs 50%, Fat 25%)
• Body Recomposition: Calories = TDEE - 150 (Protein 40~45%, Carbs 35~40%, Fat phần còn lại)

=========================
QUY TẮC THỰC ĐƠN
=========================
CHỈ được sử dụng món ăn có trong Database. KHÔNG được tự tạo món ăn mới.
KHÔNG được thay đổi: food_id, food_name.

Loại bỏ món ăn không phù hợp nếu người dùng bị dị ứng, ăn chay, không thích, có bệnh lý.
Khẩu phần ăn phải phù hợp với người trưởng thành Việt Nam.
Calories phải phân bổ hợp lý giữa các bữa (Breakfast ~25%, Lunch ~35%, Dinner ~30%, Snack ~10%).
Protein phân bổ tương đối đồng đều.

Output phải đúng Response Schema. KHÔNG markdown. KHÔNG giải thích. KHÔNG thêm ```json.
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

        if not response.candidates or not response.candidates[0].content:
            raise Exception("AI did not generate a response. It might be blocked by safety filters.")
            
        raw_json = response.text
        if not raw_json:
             raise Exception("AI returned empty text.")

        print("\n========== GEMINI RESPONSE ==========")
        print(raw_json)
        print("=====================================\n")

        # Clean markdown formatting if present
        if raw_json.startswith("```json"):
            raw_json = raw_json[7:]
        if raw_json.startswith("```"):
            raw_json = raw_json[3:]
        if raw_json.endswith("```"):
            raw_json = raw_json[:-3]
        
        raw_json = raw_json.strip()

        result = json.loads(raw_json)
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
LUỒNG TƯƠNG TÁC SIÊU TẮT (TEST MODE)
=========================

Nhiệm vụ duy nhất của bạn:

1. Kiểm tra LỊCH SỬ CHAT.
2. Nếu hội viên CHƯA được hỏi về dị ứng hoặc thực phẩm kiêng khem:
   -> Hãy hỏi ĐÚNG 1 CÂU THÂN THIỆN: "Bạn có bị dị ứng với loại thực phẩm nào hoặc có lưu ý kiêng khem gì đặc biệt không?"

3. Nếu hội viên ĐÃ TRẢ LỜI về dị ứng/thực phẩm kiêng (hoặc nói không dị ứng, hoặc tin nhắn đầu tiên đã đề cập):
   -> TUYỆT ĐỐI KHÔNG HỎI THÊM BẤT CỨ CÂU NÀO KHÁC.
   -> TRẢ LỜI CHÍNH XÁC DUY NHẤT CỤM TỪ: 
   READY_TO_GENERATE

QUY TẮC:
- Không hỏi thêm mục tiêu, số bữa, ngân sách hay bất kỳ thứ gì khác.
- Khi đã sẵn sàng, CHỈ TRẢ VỀ: READY_TO_GENERATE (Không thêm khoảng trắng thừa, không thêm dấu chấm).
"""

        prompt = f"""
THÔNG TIN HỘI VIÊN:
{request.user_info}

LỊCH SỬ CHAT:
{request.conversation}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.1
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