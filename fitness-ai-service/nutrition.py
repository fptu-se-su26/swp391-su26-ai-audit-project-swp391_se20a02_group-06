from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types
import uvicorn
import os
from dotenv import load_dotenv

# Nạp cấu hình từ file .env
load_dotenv()

app = FastAPI(title="Fitness AI Agent - Nutrition Expert")

# Khởi tạo Gemini Client
client = genai.Client()

# ---- ĐỊNH NGHĨA CẤU TRÚC JSON MONG MUỐN BẮT GEMINI TRẢ VỀ ----
class FoodItem(BaseModel):
    food_id: int
    food_name: str
    amount: str
    calories: int
    protein: float
    carbs: float
    fat: float

class Meal(BaseModel):
    name: str  # Ví dụ: "Breakfast", "Lunch", "Dinner", "Snack"
    foods: List[FoodItem]
    calories: int

class DietPlanSchema(BaseModel):
    diet_title: str
    daily_calories: int
    protein_target_g: int
    carbs_target_g: int
    fat_target_g: int
    meals: List[Meal]


# ---- CẤU TRÚC REQUEST NHẬN TỪ C# BACKEND ----
class DietPlanRequest(BaseModel):
    user_info: str       # Chuỗi chứa thông tin chiều cao, cân nặng, mục tiêu, dị ứng...
    food_list_json: str  # Chuỗi JSON chứa toàn bộ danh sách 30 món ăn từ Database C# truyền sang


# ---- ENDPOINT XỬ LÝ CHÍNH ----
@app.post("/api/ai/generate-diet-plan")
async def generate_diet_plan(request: DietPlanRequest):
    try:
        # Prompt hệ thống - Đã ĐƯỢC LƯỢC BỎ SUGAR và tối ưu hóa theo yêu cầu
        system_instruction = """
        Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym. Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn có sẵn từ Database để thiết kế một thực đơn cá nhân hóa tối ưu.

        [QUY TẮC TÍNH TOÁN CALORIES & MACROS CHUNG CỦA NGÀY]
        1. Dựa vào chiều cao, cân nặng, tuổi, giới tính và tần suất tập luyện của hội viên để tính TDEE (Tổng lượng calo tiêu thụ).
        2. Dựa vào mục tiêu cụ thể để tính toán lượng calo đích (total_calories_target) và phân bổ dinh dưỡng (Macros) như sau:
           - Nếu mục tiêu là Giảm cân/Giảm mỡ: Calo đích = TDEE - (300 đến 500 Calo). Tỷ lệ Macros: 30% Protein, 40% Carbs, 30% Fat.
           - Nếu mục tiêu là Tăng cơ/Tăng cân: Calo đích = TDEE + (300 đến 500 Calo). Tỷ lệ Macros: 30% Protein, 50% Carbs, 20% Fat.
           - Nếu mục tiêu là Giữ cân: Calo đích = TDEE. Tỷ lệ Macros: 25% Protein, 50% Carbs, 25% Fat.
           - Nếu mục tiêu là TĂNG CƠ GIẢM MỠ ĐỒNG THỜI (Body Recomposition): Calo đích = TDEE - 150 Calo (Thâm hụt nhẹ). Bắt buộc phải đẩy lượng Protein (Đạm) lên rất cao (chiếm 40-45% tổng calo), cắt giảm Carbs xuống còn 35-40%.

        [QUY TẮC TÍNH DINH DƯỠNG CHO TỪNG MÓN ĂN]
        - Dựa trên khối lượng ăn (amount) mà bạn chỉ định cho món đó, bạn phải tự động tính toán chính xác hàm lượng dinh dưỡng đi kèm của lượng thức ăn đó, bao gồm:
          + protein: Lượng chất đạm tính bằng gam (g).
          + carbs: Lượng tinh bột tính bằng gam (g).
          + fat: Lượng chất béo tính bằng gam (g).
          + calories: Lượng calo của riêng món ăn đó tính bằng kcal.
        - Ví dụ: Nếu 100g ức gà chứa 31g protein, thì khi bạn bốc 300g ức gà, bạn phải tính toán và ghi rõ trong JSON là 93g protein.

        [QUY TẮC RÀNG BUỘC THỰC ĐƠN & SỨC KHỎE]
        1. CHỈ ĐƯỢC PHÉP sử dụng các món ăn nằm trong danh sách [DANH SÁCH MÓN ĂN TRONG DATABASE] được cung cấp trong Prompt. Tuyệt đối không tự bịa ra món mới nằm ngoài danh sách.
        2. Khi chọn món nào, bắt buộc phải giữ nguyên chính xác mã food_id và food_name của món đó từ Database cung cấp.
        3. Ước lượng khối lượng/số lượng ăn (amount) hợp lý và thực tế cho hội viên (Ví dụ: '150g', '2 quả').
        4. Chia thực đơn thành các bữa rõ ràng và khoa học (Breakfast, Lunch, Dinner, Snack).
        5. [TRƯỜNG HỢP ĐẶC BIỆT]: Luôn chú ý quét thông tin hội viên để loại bỏ món ăn nếu họ bị DỊ ỨNG hoặc ĂN CHAY.

        [ĐỊNH DẠNG ĐẦU RA BẮT BUỘC]
        Bạn bắt buộc phải trả về chuỗi định dạng JSON thuần khớp hoàn toàn với cấu trúc Schema được định nghĩa, không kèm theo bất kỳ ký tự markdown nào như ```json.
        """

        # Tổng hợp prompt gửi tới Gemini
        user_prompt = f"""
        [THÔNG TIN HỘI VIÊN]:
        {request.user_info}

        [DANH SÁCH MÓN ĂN TRONG DATABASE]:
        {request.food_list_json}
        """

        # Gọi API Gemini (Sử dụng Model mới nhất 2.5-flash và Structured Outputs)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=DietPlanSchema,
                temperature=0.3,  # Thấp để đảm bảo tính toán chuẩn xác và bám sát thực phẩm DB
            ),
        )

        # Trả chuỗi JSON sạch về cho C# bóc tách lưu DB
        return response.text

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


# Khởi chạy server FastAPI tại Port 8000
if __name__ == "__main__":
    uvicorn.run("nutrition:app", host="127.0.0.1", port=8000, reload=True)