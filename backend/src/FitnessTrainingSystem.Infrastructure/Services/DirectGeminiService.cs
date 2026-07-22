using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class DirectGeminiService : IGeminiAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ILogger<DirectGeminiService> _logger;
    private static readonly Random _jitter = new();

    public DirectGeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<DirectGeminiService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GEMINI_API_KEY"] ?? configuration["GeminiApiKey"] ?? "";
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
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<DietPlanResponse>(resultJson, options)
            ?? throw new Exception("Không đọc được JSON từ AI.");
    }

    public async Task<string> ChatAsync(string conversation, string userInfo)
    {
        var systemInstruction = """
Bạn là AI Nutrition Assistant của hệ thống quản lý phòng gym.
Nhiệm vụ: thu thập thông tin dinh dưỡng từ hội viên.
QUY TẮC:
- KHÔNG hỏi chiều cao, cân nặng, tuổi, giới tính (đã có trong Database).
- MỖI LẦN CHỈ ĐƯỢC HỎI ĐÚNG 1 CÂU HỎI.
- Khi đã đủ dữ liệu, chỉ trả lời đúng: READY_TO_GENERATE
- Trò chuyện tự nhiên và thân thiện như ChatGPT.
""";

        var prompt = $"""
{userInfo}
LỊCH SỬ CHAT
{conversation}
""";

        return await CallGeminiWithRetryAsync(systemInstruction, prompt);
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
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}",
            content);

        response.EnsureSuccessStatusCode();
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
}
