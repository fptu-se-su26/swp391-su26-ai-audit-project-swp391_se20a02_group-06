using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using Newtonsoft.Json;

namespace FitnessTrainingSystem.Infrastructure.Services
{
    public class GeminiAiService : IGeminiAiService
    {
        private readonly HttpClient _httpClient;
        
        // API Key Gemini của bạn
        private readonly string ApiKey;
        private readonly string ModelUrl;

        public GeminiAiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            ApiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? "";
            ModelUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={ApiKey}";
        }

        public async Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson)
        {
            var systemInstruction = @"Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym. Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn có sẵn từ Database để thiết kế một thực đơn cá nhân hóa tối ưu.

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
  + sugar: Lượng đường tự nhiên hoặc đường thêm vào có trong món ăn đó tính bằng gam (g). Bạn bắt buộc phải tự tính toán và điền chỉ số đường này một cách hợp lý dựa trên loại thực phẩm.
- Ví dụ: Nếu 100g ức gà chứa 31g protein và 0g sugar, thì khi bạn bốc 300g ức gà, bạn phải tính toán và ghi rõ trong JSON là 93g protein và 0g sugar.

[QUY TẮC RÀNG BUỘC THỰC ĐƠN & SỨC KHỎE]
1. CHỈ ĐƯỢC PHÉP sử dụng các món ăn nằm trong danh sách [DANH SÁCH MÓN ĂN TRONG DATABASE] được cung cấp. Tuyệt đối không tự bịa ra món mới nằm ngoài danh sách.
2. Khi chọn món nào, bắt buộc phải giữ nguyên chính xác mã food_id của món đó từ Database.
3. Ước lượng khối lượng/số lượng ăn (amount) hợp lý và thực tế cho hội viên (Ví dụ: '150g', '2 quả').
4. Chia thực đơn thành các bữa rõ ràng và khoa học (Bữa sáng, Bữa trưa, Bữa tối, Bữa phụ trước/sau tập).
5. [TRƯỜNG HỢP ĐẶC BIỆT]: Luôn chú ý quét thông tin hội viên để loại bỏ món ăn nếu họ bị DỊ ỨNG hoặc ĂN CHAY.

[ĐỊNH DẠNG ĐẦU RA BẮT BUỘC]
Bạn bắt buộc phải trả về chuỗi định dạng JSON thuần khớp hoàn toàn với cấu trúc mẫu mà không kèm theo bất kỳ ký tự markdown nào.";

            var userPrompt = $"Hãy tạo thực đơn cho hội viên sau dựa trên danh sách món ăn của hệ thống:\n[THÔNG TIN HỘI VIÊN]\n{userInfo}\n\n[DANH SÁCH MÓN ĂN TRONG DATABASE (FOODS)]\n{foodListJson}";

            var requestBody = new
            {
                systemInstruction = new { parts = new[] { new { text = systemInstruction } } },
                contents = new[] { new { parts = new[] { new { text = userPrompt } } } },
                generationConfig = new { responseMimeType = "application/json" }
            };

            var jsonPayload = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            // Gửi request trực tiếp đến Google API
            var response = await _httpClient.PostAsync(ModelUrl, content);
            response.EnsureSuccessStatusCode();

            // Đọc chuỗi JSON (Chỉ giữ lại duy nhất 1 dòng khai báo này)
            var responseString = await response.Content.ReadAsStringAsync();
            
            // Sử dụng JObject để ép kiểu chặt chẽ, xóa sạch Warning
            var geminiResult = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(responseString);
            
            var candidates = geminiResult?["candidates"] as Newtonsoft.Json.Linq.JArray;
            if (candidates == null || candidates.Count == 0)
            {
                throw new Exception("Không nhận được phản hồi hợp lệ từ Gemini API.");
            }

            var firstCandidate = candidates[0];
            var rawJsonText = firstCandidate?["content"]?["parts"]?[0]?["text"]?.ToString();

            if (string.IsNullOrEmpty(rawJsonText))
            {
                throw new Exception("Nội dung cấu trúc thực đơn trả về bị trống.");
            }

            // Ép chuỗi JSON đó thành Object C# chuẩn DietPlanResponse
            var dietPlan = JsonConvert.DeserializeObject<DietPlanResponse>(rawJsonText);
            
            return dietPlan ?? new DietPlanResponse { Success = false };
        }

        public Task<string> ChatAsync(string conversation, string userInfo)
        {
            throw new NotImplementedException();
        }

        public Task<FitnessTrainingSystem.Application.DTOs.Workouts.AiWorkoutPlanResponseDto> GenerateWorkoutPlanAsync(int userId, string muscleGroup, int targetCalories, int durationMinutes, string availableExercisesJson, string? injuredMuscleGroups = null)
        {
            throw new NotImplementedException();
        }

        public Task<FitnessTrainingSystem.Application.DTOs.Workouts.AiWeeklyWorkoutPlanResponseDto> GenerateWeeklyWorkoutPlanAsync(int userId, string muscleGroup, int targetCaloriesPerDay, int durationMinutesPerDay, int frequency, string availableExercisesJson, string? injuredMuscleGroups = null)
        {
            throw new NotImplementedException();
        }
    }
}