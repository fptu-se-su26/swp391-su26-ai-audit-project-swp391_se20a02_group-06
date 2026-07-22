from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
import json
import os

app = FastAPI(title="Fitness Training AI Service with Gemini - Full Data Mapping")

# 1. Cấu trúc DTO đầu vào khớp với bảng `exercises` từ MySQL
class AvailableExerciseDto(BaseModel):
    id: int
    title: str
    description: str | None = None
    muscle_group_id: int | None = None
    equipment: str | None = None
    duration_minutes: int | None = None  
    calories_burn_per_min: float
    difficulty: str | None = None  # ĐỔI THÀNH STR để khớp với 'BEGINNER', 'INTERMEDIATE', 'ADVANCED' trong DB

class WorkoutAiRequest(BaseModel):
    user_id: int
    muscle_group: str  # Ví dụ: "Chest", "Legs", "Full Body"
    target_calories: int  
    duration_minutes: int
    available_exercises: list[AvailableExerciseDto]

# 2. Định nghĩa Pydantic Model để ép Gemini sinh đúng khuôn mẫu JSON
class ExerciseItemOutput(BaseModel):
    exercise_id: int = Field(description="ID (int) của bài tập được chọn chính xác từ danh sách đầu vào.")
    exercise_title: str = Field(description="Tên chính xác (title) của bài tập.")
    sets: int = Field(description="Số set tập khuyến nghị (ví dụ: 3, 4). Mặc định là 3.", default=3)
    reps: int = Field(description="Số reps mỗi set nếu tính theo cái. Nếu tập theo thời gian như Plank thì điền 0.", default=0)
    duration_seconds: int = Field(description="Nếu tính bằng thời gian (Plank, HIIT) thì điền số giây, ngược lại điền 0.", default=0)
    rest_seconds: int = Field(description="Thời gian nghỉ giữa các hiệp tính bằng giây. Mặc định là 60.", default=60)
    exercise_order: int = Field(description="Thứ tự thực hiện bài tập trong giáo án, tăng dần từ 1, 2, 3...")
    calories_burned: int = Field(description="Số calo ước tính bài tập này đốt cháy dựa vào: (calories_burn_per_min * sets * thời gian tập mỗi set thực tế tính bằng phút), kiểu số NGUYÊN (int).", default=30)

class WorkoutPlanOutput(BaseModel):
    title: str = Field(description="Tiêu đề giáo án tập luyện hấp dẫn.")
    goal: str = Field(description="Mục tiêu cụ thể ngắn gọn của giáo án.")
    target_calories: int = Field(description="TỔNG số calo ước tính thực tế sau khi cộng các bài tập lại (Kiểu số NGUYÊN - INT).")
    target_duration_minutes: int = Field(description="TỔNG thời gian ước tính thực tế sau khi cộng các bài tập (Kiểu số NGUYÊN - INT).")
    exercises: list[ExerciseItemOutput]

class WeeklyWorkoutPlanOutput(BaseModel):
    days: list[WorkoutPlanOutput] = Field(description="Danh sách các giáo án tập luyện cho từng buổi trong tuần.")

class WorkoutWeeklyAiRequest(BaseModel):
    user_id: int
    muscle_group: str
    target_calories_per_day: int
    duration_minutes_per_day: int
    frequency: int
    available_exercises: list[AvailableExerciseDto]

# Cấu hình Gemini Client sử dụng bộ SDK mới của Google
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_KEY)

@app.post("/api/ai/generate-workout")
async def generate_workout_plan(request: WorkoutAiRequest):
    exercises_pool = [exe.model_dump() for exe in request.available_exercises]
    print(f"\n[FASTAPI] generate_workout_plan: user={request.user_id}, muscle_group='{request.muscle_group}', target_calories={request.target_calories}, duration={request.duration_minutes}")
    print(f"[FASTAPI] Available Exercises count: {len(exercises_pool)}")
    for ex in exercises_pool:
        print(f"  - ID {ex['id']}: {ex['title']} (MuscleGroupId: {ex['muscle_group_id']})")
    
    prompt = f"""
    Hãy thiết kế một kế hoạch bài tập (Workout Plan) tối ưu cho hội viên dựa trên các thông số sau:
    - Nhóm cơ đích cần tập: {request.muscle_group}
    - Mục tiêu tiêu hao năng lượng hướng tới: {request.target_calories} kcal
    - Tổng thời gian giới hạn: {request.duration_minutes} phút

    BẮT BUỘC CHỈ ĐƯỢC CHỌN CÁC BÀI TẬP CÓ TRONG DANH SÁCH DƯỚI ĐÂY (Tuyệt đối không tự bịa ra bài tập ngoài danh sách này):
    {json.dumps(exercises_pool, ensure_ascii=False)}

    Yêu cầu thuật toán phân bổ (RẤT QUAN TRỌNG - PHẢI CHÍNH XÁC VỀ MẶT TOÁN HỌC):
    1. Tổng calories_burned của tất cả bài tập CỘNG LẠI phải bằng ĐÚNG {request.target_calories} kcal (du di tối đa +-10%).
    2. Tổng duration_seconds của tất cả bài tập (tính cả thời gian nghỉ rest_seconds) CỘNG LẠI phải bằng ĐÚNG {request.duration_minutes * 60} giây (du di tối đa +-10%).
    3. Tính toán logic cho MỖI BÀI TẬP:
       - Thời gian tập mỗi hiệp (phút) = (reps * 3 giây)/60 HOẶC (duration_seconds)/60.
       - Tổng thời gian tập bài đó (phút) = (Thời gian tập mỗi hiệp) * sets.
       - Lượng calo đốt của bài (calories_burned) = (Tổng thời gian tập bài đó) * calories_burn_per_min.
       => BẠN PHẢI TỰ ĐIỀU CHỈNH sets, reps, duration_seconds ĐỂ ĐẠT ĐƯỢC CON SỐ CALO VÀ THỜI GIAN MONG MUỐN!
    4. Chỉ được chọn bài tập từ danh sách được cung cấp. Khuyến khích chọn các bài tập thuộc các nhóm cơ sau: {request.muscle_group} (hoặc lấy tất cả nếu là Full Body).
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                # Sử dụng system_instruction để định hình vai trò cứng cho AI
                system_instruction="You are an elite AI Personal Trainer and a strict mathematician. You build safe workout plans using ONLY the provided input exercises. Your calculations for calories and duration MUST be mathematically flawless.",
                response_mime_type="application/json",
                response_schema=WorkoutPlanOutput,  # Khóa chặt đầu ra tự động bằng Pydantic
                temperature=0.1 # Để nhiệt độ thấp để AI tính toán calo chuẩn xác nhất, không bao hoa vẽ vời
            ),
        )
        
        ai_json_output = json.loads(response.text)
        
        return {
            "success": True,
            "user_id": request.user_id,
            "model": "gemini-2.5-flash",
            "recommendation": ai_json_output
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI trả về dữ liệu không đúng định dạng JSON chuẩn.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi kết nối hoặc xử lý dữ liệu với Gemini API: {str(e)}")

@app.post("/api/ai/generate-weekly-workout")
async def generate_weekly_workout_plan(request: WorkoutWeeklyAiRequest):
    exercises_pool = [exe.model_dump() for exe in request.available_exercises]
    
    prompt = f"""
    Hãy thiết kế một lịch tập luyện hàng tuần (Weekly Workout Plan) gồm {request.frequency} buổi tập tối ưu cho hội viên dựa trên các thông số sau:
    - Nhóm cơ đích tập trung: {request.muscle_group}
    - Mục tiêu tiêu hao năng lượng mỗi buổi: {request.target_calories_per_day} kcal
    - Tổng thời gian giới hạn mỗi buổi: {request.duration_minutes_per_day} phút
    - Số buổi tập trong tuần: {request.frequency} buổi.

    BẮT BUỘC CHỈ ĐƯỢC CHỌN CÁC BÀI TẬP CÓ TRONG DANH SÁCH DƯỚI ĐÂY (Tuyệt đối không tự bịa ra bài tập ngoài danh sách này):
    {json.dumps(exercises_pool, ensure_ascii=False)}

    Yêu cầu thuật toán phân bổ (RẤT QUAN TRỌNG - PHẢI CHÍNH XÁC VỀ MẶT TOÁN HỌC):
    1. Chia đều hoặc luân phiên các nhóm cơ giữa các buổi (ví dụ: Buổi 1 tập Ngực/Vai, Buổi 2 tập Lưng/Tay, Buổi 3 tập Chân/Bụng...) tùy theo các bài tập có sẵn để tối ưu hóa phục hồi cơ bắp.
    2. Mỗi ngày trong danh sách 'days' đại diện cho 1 buổi tập riêng biệt, có đầy đủ tiêu đề (title), mục tiêu (goal), và mảng bài tập (exercises).
    3. Tính toán logic calo cho TỪNG BUỔI TẬP:
       - Tổng calories_burned của tất cả bài tập trong 1 buổi CỘNG LẠI phải bằng ĐÚNG {request.target_calories_per_day} kcal (du di tối đa +-10%).
       - Tổng duration_seconds của tất cả bài tập trong 1 buổi (tính cả thời gian nghỉ rest_seconds) CỘNG LẠI phải bằng ĐÚNG {request.duration_minutes_per_day * 60} giây (du di tối đa +-10%).
       - Thời gian tập mỗi hiệp (phút) = (reps * 3 giây)/60 HOẶC (duration_seconds)/60.
       - Tổng thời gian tập bài đó (phút) = (Thời gian tập mỗi hiệp) * sets.
       - Lượng calo đốt của bài (calories_burned) = (Tổng thời gian tập bài đó) * calories_burn_per_min.
       => BẠN PHẢI TỰ ĐIỀU CHỈNH sets, reps, duration_seconds ĐỂ ĐẠT ĐƯỢC CON SỐ CALO VÀ THỜI GIAN MONG MUỐN!
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are an elite AI Personal Trainer and a strict mathematician. You build safe, mathematically accurate weekly split workout plans using ONLY the provided input exercises.",
                response_mime_type="application/json",
                response_schema=WeeklyWorkoutPlanOutput,
                temperature=0.1
            ),
        )
        
        ai_json_output = json.loads(response.text)
        
        return {
            "success": True,
            "user_id": request.user_id,
            "model": "gemini-2.5-flash",
            "recommendation": ai_json_output
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI trả về dữ liệu không đúng định dạng JSON chuẩn.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi kết nối hoặc xử lý dữ liệu với Gemini API: {str(e)}")