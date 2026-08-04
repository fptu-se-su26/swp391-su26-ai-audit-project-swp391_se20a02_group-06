using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class DirectGeminiService : IGeminiAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string _baseUrl;
    private readonly ILogger<DirectGeminiService> _logger;
    private static readonly Random _jitter = new();

    public DirectGeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<DirectGeminiService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] ?? configuration["GEMINI_API_KEY"] ?? "";
        _model = configuration["Gemini:Model"] ?? "gemini-2.5-flash";
        _baseUrl = configuration["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/";
        _logger = logger;
    }

    public async Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson)
    {
        var systemInstruction = """
Bạn là một Chuyên gia Dinh dưỡng cấp cao được tích hợp vào phần mềm quản lý phòng gym.

Nhiệm vụ của bạn là tiếp nhận thông tin hội viên và danh sách món ăn từ Database để tạo thực đơn.

======================
QUY TẮC TÍNH CALORIES
======================
1. Tính TDEE dựa trên: Giới tính, Tuổi, Chiều cao, Cân nặng, Mức độ vận động
2. Nếu mục tiêu: Giảm cân → Calories = TDEE - 300~500, Protein 30%, Carbs 40%, Fat 30%
3. Tăng cân → Calories = TDEE + 300~500, Protein 30%, Carbs 50%, Fat 20%
4. Giữ cân → Calories = TDEE, Protein 25%, Carbs 50%, Fat 25%
5. Body Recomposition → Calories = TDEE - 150, Protein 40~45%, Carbs 35~40%

=======================
QUY TẮC THỰC ĐƠN
=======================
- CHỈ được sử dụng món ăn có trong Database.
- KHÔNG được tự tạo món ăn mới.
- KHÔNG được thay đổi food_id, food_name.
- Khẩu phần ăn phải phù hợp với người trưởng thành Việt Nam.
- Calories phải được phân bổ hợp lý (KHÔNG để một bữa ăn chiếm quá 50% tổng calories).
- Protein phải được phân bổ tương đối đồng đều giữa các bữa ăn.
- LƯU Ý QUAN TRỌNG: TUYỆT ĐỐI KHÔNG thêm đơn vị (như "g", "kcal", "ml") vào các trường số (ví dụ: daily_calories, protein, carbs, fat). Chỉ trả về số nguyên hoặc số thập phân hợp lệ của JSON.
- Ví dụ ĐÚNG: "protein": 15. Ví dụ SAI: "protein": 15g hoặc "protein": "15g".

Output phải là JSON hợp lệ theo schema:
{
  "diet_title": "...",
  "daily_calories": 0,
  "protein_target_g": 0,
  "carbs_target_g": 0,
  "fat_target_g": 0,
  "meals": [
    {
      "name": "...",
      "calories": 0,
      "foods": [
        {
          "food_id": 0,
          "food_name": "...",
          "amount": "...",
          "calories": 0,
          "protein": 0.0,
          "carbs": 0.0,
          "fat": 0.0
        }
      ]
    }
  ]
}
""";

        var userPrompt = $"""
THÔNG TIN HỘI VIÊN
{userInfo}

DANH SÁCH MÓN ĂN DATABASE
{foodListJson}
""";

        var resultJson = await CallGeminiWithRetryAsync(systemInstruction, userPrompt);
        
        // Clean up markdown block if API returns it
        if (resultJson.StartsWith("```json")) resultJson = resultJson.Substring(7);
        if (resultJson.StartsWith("```")) resultJson = resultJson.Substring(3);
        if (resultJson.EndsWith("```")) resultJson = resultJson.Substring(0, resultJson.Length - 3);
        resultJson = resultJson.Trim();

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<DietPlanResponse>(resultJson, options)
            ?? throw new Exception("Không đọc được JSON từ AI.");
    }

    public async Task<string> ChatAsync(string conversation, string userInfo)
    {
        var systemInstruction = """
Bạn là AI Nutrition Assistant của hệ thống quản lý phòng gym.
Nhiệm vụ: thu thập thông tin dinh dưỡng từ hội viên.

LƯU Ý QUAN TRỌNG:
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
""";

        var prompt = $"""
{userInfo}
LỊCH SỬ CHAT
{conversation}
""";

        var reply = await CallGeminiWithRetryAsync(systemInstruction, prompt);
        return reply.Trim().Trim('"', '\'');
    }

    private async Task<string> CallGeminiWithRetryAsync(string systemInstruction, string userPrompt, int maxRetries = 3)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                return await CallGeminiAsync(systemInstruction, userPrompt);
            }
            catch (HttpRequestException ex) when (attempt < maxRetries && IsTransientError(ex))
            {
                var delay = TimeSpan.FromMilliseconds((int)Math.Pow(2, attempt) * 1000 + _jitter.Next(0, 1000));
                _logger.LogWarning(ex, "Gemini API transient error (attempt {Attempt}/{MaxRetries}), retrying in {Delay}ms", attempt, maxRetries, delay.TotalMilliseconds);
                await Task.Delay(delay);
            }
        }

        return await CallGeminiAsync(systemInstruction, userPrompt);
    }

    private static bool IsTransientError(HttpRequestException ex)
    {
        return ex.StatusCode switch
        {
            System.Net.HttpStatusCode.TooManyRequests => true,
            System.Net.HttpStatusCode.ServiceUnavailable => true,
            System.Net.HttpStatusCode.BadGateway => true,
            System.Net.HttpStatusCode.GatewayTimeout => true,
            _ => false
        };
    }

    private async Task<string> CallGeminiAsync(string systemInstruction, string userPrompt)
    {
        var requestBody = new
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = userPrompt } } }
            },
            systemInstruction = new { parts = new[] { new { text = systemInstruction } } },
            generationConfig = new { responseMimeType = "application/json", temperature = 0.2 }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(
            $"{_baseUrl}{_model}:generateContent?key={_apiKey}",
            content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Gemini API error ({response.StatusCode}): {errorContent}", null, response.StatusCode);
        }

        var rawJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(rawJson);
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        return text ?? "{}";
    }

    public async Task<AiWorkoutPlanResponseDto> GenerateWorkoutPlanAsync(int userId, string muscleGroup, int targetCalories, int durationMinutes, string availableExercisesJson, string? injuredMuscleGroups = null)
    {
        var systemInstruction = @"You are an elite AI Personal Trainer and a strict mathematician. You build safe workout plans using ONLY the provided input exercises. Your calculations for calories and duration MUST be mathematically flawless.
[ĐỊNH DẠNG ĐẦU RA BẮT BUỘC]
Bạn bắt buộc phải trả về chuỗi định dạng JSON thuần khớp hoàn toàn với cấu trúc sau mà không kèm theo bất kỳ ký tự markdown nào:
{
  ""title"": ""Tiêu đề giáo án tập luyện hấp dẫn."",
  ""goal"": ""Mục tiêu cụ thể ngắn gọn của giáo án."",
  ""target_calories"": 0,
  ""target_duration_minutes"": 0,
  ""exercises"": [
    {
      ""exercise_id"": 0,
      ""exercise_title"": ""Tên bài tập"",
      ""sets"": 3,
      ""reps"": 12,
      ""duration_seconds"": 0,
      ""rest_seconds"": 60,
      ""exercise_order"": 1,
      ""calories_burned"": 30
    }
  ]
}";

        var userPrompt = $@"Hãy thiết kế một kế hoạch bài tập (Workout Plan) tối ưu cho hội viên dựa trên các thông số sau:
- Nhóm cơ đích cần tập: {muscleGroup}
- Mục tiêu tiêu hao năng lượng hướng tới: {targetCalories} kcal
- Tổng thời gian giới hạn: {durationMinutes} phút

BẮT BUỘC CHỈ ĐƯỢC CHỌN CÁC BÀI TẬP CÓ TRONG DANH SÁCH DƯỚI ĐÂY (Tuyệt đối không tự bịa ra bài tập ngoài danh sách này):
{availableExercisesJson}

Yêu cầu thuật toán phân bổ (RẤT QUAN TRỌNG - PHẢI CHÍNH XÁC VỀ MẶT TOÁN HỌC):
1. Tổng calories_burned của tất cả bài tập CỘNG LẠI phải bằng ĐÚNG {targetCalories} kcal (du di tối đa +-10%).
2. Tổng duration_seconds của tất cả bài tập (tính cả thời gian nghỉ rest_seconds) CỘNG LẠI phải bằng ĐÚNG {durationMinutes * 60} giây (du di tối đa +-10%).
3. Tính toán logic cho MỖI BÀI TẬP:
   - Thời gian tập mỗi hiệp (phút) = (reps * 3 giây)/60 HOẶC (duration_seconds)/60.
   - Tổng thời gian tập bài đó (phút) = (Thời gian tập mỗi hiệp) * sets.
   - Lượng calo đốt của bài (calories_burned) = (Tổng thời gian tập bài đó) * calories_burn_per_min.
   => BẠN PHẢI TỰ ĐIỀU CHỈNH sets, reps, duration_seconds ĐỂ ĐẠT ĐƯỢC CON SỐ CALO VÀ THỜI GIAN MONG MUỐN!
4. TUYỆT ĐỐI CHỈ ĐƯỢC CHỌN bài tập từ danh sách được cung cấp. Danh sách này đã được lọc chính xác cho nhóm cơ: {muscleGroup}. KHÔNG được chọn các bài tập thuộc nhóm cơ khác ngoài danh sách này.";

        if (!string.IsNullOrWhiteSpace(injuredMuscleGroups))
        {
            userPrompt += $"\n\n[LƯU Ý QUAN TRỌNG VỀ CHẤN THƯƠNG]\nHội viên đang bị đau hoặc chấn thương ở các vị trí và mức độ (1-5) như sau: {injuredMuscleGroups}.\nYÊU CẦU BẮT BUỘC:\n- Nếu mức độ chấn thương từ 1 đến 3: Hãy giảm số lượng bài tập cho nhóm cơ đó xuống tối đa 1 bài tập nhẹ nhàng.\n- Nếu có BẤT KỲ vị trí nào có mức độ chấn thương từ 4 đến 5: TUYỆT ĐỐI BỎ HẲN, KHÔNG CHỌN bất kỳ bài tập nào tác động trực tiếp vào các nhóm cơ bị chấn thương này. ĐỒNG THỜI, TUYỆT ĐỐI KHÔNG CHỌN CÁC BÀI TẬP TOÀN THÂN (Full Body). Nếu mục tiêu của hội viên là tập 'Full Body', hãy tự động chuyển sang chọn phối hợp các bài tập an toàn từ các nhóm cơ khác (trừ vùng chấn thương) để tạo thành một buổi tập đa nhóm cơ.";
        }

        var resultJson = await CallGeminiWithRetryAsync(systemInstruction, userPrompt);
        
        // Clean up markdown block and extra text
        int firstBrace = resultJson.IndexOf('{');
        int lastBrace = resultJson.LastIndexOf('}');
        if (firstBrace >= 0 && lastBrace >= firstBrace)
        {
            resultJson = resultJson.Substring(firstBrace, lastBrace - firstBrace + 1);
        }
        else
        {
            throw new Exception("Không tìm thấy JSON hợp lệ trong phản hồi của AI.");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var planOutput = JsonSerializer.Deserialize<WorkoutPlanOutput>(resultJson, options);

        return new AiWorkoutPlanResponseDto
        {
            Success = planOutput != null,
            UserId = userId,
            Model = _model,
            Recommendation = planOutput!
        };
    }

    public async Task<AiWeeklyWorkoutPlanResponseDto> GenerateWeeklyWorkoutPlanAsync(int userId, string muscleGroup, int targetCaloriesPerDay, int durationMinutesPerDay, int frequency, string availableExercisesJson, string? injuredMuscleGroups = null)
    {
        var systemInstruction = @"You are an elite AI Personal Trainer and a strict mathematician. You build safe, mathematically accurate weekly split workout plans using ONLY the provided input exercises. Your calculations for calories and duration MUST be mathematically flawless.
[ĐỊNH DẠNG ĐẦU RA BẮT BUỘC]
Bạn bắt buộc phải trả về chuỗi định dạng JSON thuần khớp hoàn toàn với cấu trúc sau mà không kèm theo bất kỳ ký tự markdown nào:
{
  ""days"": [
    {
      ""title"": ""Tiêu đề buổi tập"",
      ""goal"": ""Mục tiêu buổi tập"",
      ""target_calories"": 0,
      ""target_duration_minutes"": 0,
      ""exercises"": [
        {
          ""exercise_id"": 0,
          ""exercise_title"": ""Tên bài tập"",
          ""sets"": 3,
          ""reps"": 12,
          ""duration_seconds"": 0,
          ""rest_seconds"": 60,
          ""exercise_order"": 1,
          ""calories_burned"": 30
        }
      ]
    }
  ]
}";

        var userPrompt = $@"Hãy thiết kế một lịch tập luyện hàng tuần (Weekly Workout Plan) gồm {frequency} buổi tập tối ưu cho hội viên dựa trên các thông số sau:
- Nhóm cơ đích tập trung: {muscleGroup}
- Mục tiêu tiêu hao năng lượng mỗi buổi: {targetCaloriesPerDay} kcal
- Tổng thời gian giới hạn mỗi buổi: {durationMinutesPerDay} phút
- Số buổi tập trong tuần: {frequency} buổi.

BẮT BUỘC CHỈ ĐƯỢC CHỌN CÁC BÀI TẬP CÓ TRONG DANH SÁCH DƯỚI ĐÂY (Tuyệt đối không tự bịa ra bài tập ngoài danh sách này):
{availableExercisesJson}

Yêu cầu thuật toán phân bổ (RẤT QUAN TRỌNG - PHẢI CHÍNH XÁC VỀ MẶT TOÁN HỌC):
1. CHỈ CHỌN CÁC BÀI TẬP PHÙ HỢP VỚI NHÓM CƠ '{muscleGroup}' (Dựa đúng theo danh sách đã cung cấp). Nếu '{muscleGroup}' là Split hoặc Full Body thì mới luân phiên các nhóm cơ giữa các buổi để tối ưu hóa phục hồi cơ bắp, nếu là một nhóm cơ cụ thể thì chỉ tập trung vào nhóm cơ đó.
2. Mỗi ngày trong danh sách 'days' đại diện cho 1 buổi tập riêng biệt, có đầy đủ tiêu đề (title), mục tiêu (goal), và mảng bài tập (exercises).
3. Tính toán logic calo cho TỪNG BUỔI TẬP:
   - Tổng calories_burned của tất cả bài tập trong 1 buổi CỘNG LẠI phải bằng ĐÚNG {targetCaloriesPerDay} kcal (du di tối đa +-10%).
   - Tổng duration_seconds của tất cả bài tập trong 1 buổi (tính cả thời gian nghỉ rest_seconds) CỘNG LẠI phải bằng ĐÚNG {durationMinutesPerDay * 60} giây (du di tối đa +-10%).
   - Thời gian tập mỗi hiệp (phút) = (reps * 3 giây)/60 HOẶC (duration_seconds)/60.
   - Tổng thời gian tập bài đó (phút) = (Thời gian tập mỗi hiệp) * sets.
   - Lượng calo đốt của bài (calories_burned) = (Tổng thời gian tập bài đó) * calories_burn_per_min.
   => BẠN PHẢI TỰ ĐIỀU CHỈNH sets, reps, duration_seconds ĐỂ ĐẠT ĐƯỢC CON SỐ CALO VÀ THỜI GIAN MONG MUỐN!";

        if (!string.IsNullOrWhiteSpace(injuredMuscleGroups))
        {
            userPrompt += $"\n\n[LƯU Ý QUAN TRỌNG VỀ CHẤN THƯƠNG]\nHội viên đang bị đau hoặc chấn thương ở các vị trí và mức độ (1-5) như sau: {injuredMuscleGroups}.\nYÊU CẦU BẮT BUỘC:\n- Nếu mức độ chấn thương từ 1 đến 3: Hãy giảm số lượng bài tập cho nhóm cơ đó xuống tối đa 1 bài tập nhẹ nhàng.\n- Nếu có BẤT KỲ vị trí nào có mức độ chấn thương từ 4 đến 5: TUYỆT ĐỐI BỎ HẲN, KHÔNG CHỌN bất kỳ bài tập nào tác động trực tiếp vào các nhóm cơ bị chấn thương này. ĐỒNG THỜI, TUYỆT ĐỐI KHÔNG CHỌN CÁC BÀI TẬP TOÀN THÂN (Full Body). Nếu mục tiêu của hội viên là tập 'Full Body', hãy tự động chuyển sang chọn phối hợp các bài tập an toàn từ các nhóm cơ khác (trừ vùng chấn thương) để tạo thành một buổi tập đa nhóm cơ.";
        }

        var resultJson = await CallGeminiWithRetryAsync(systemInstruction, userPrompt);
        
        // Clean up markdown block and extra text
        int firstBrace = resultJson.IndexOf('{');
        int lastBrace = resultJson.LastIndexOf('}');
        if (firstBrace >= 0 && lastBrace >= firstBrace)
        {
            resultJson = resultJson.Substring(firstBrace, lastBrace - firstBrace + 1);
        }
        else
        {
            throw new Exception("Không tìm thấy JSON hợp lệ trong phản hồi của AI.");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var planOutput = JsonSerializer.Deserialize<WeeklyWorkoutPlanOutput>(resultJson, options);

        return new AiWeeklyWorkoutPlanResponseDto
        {
            Success = planOutput != null,
            UserId = userId,
            Model = _model,
            Recommendation = planOutput!
        };
    }
}
