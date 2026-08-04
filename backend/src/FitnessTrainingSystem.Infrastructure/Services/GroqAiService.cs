using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class GroqAiService : IGroqAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly ILogger<GroqAiService> _logger;
    private static readonly Random _jitter = new();

    // Groq API endpoint
    private const string GroqBaseUrl = "https://api.groq.com/openai/v1/chat/completions";

    public GroqAiService(HttpClient httpClient, IConfiguration configuration, ILogger<GroqAiService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Groq:ApiKey"] ?? configuration["GROQ_API_KEY"] ?? "";
        _model = configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";
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
- TUYỆT ĐỐI KHÔNG thêm đơn vị (như "g", "kcal", "ml") vào các trường số.
- Ví dụ ĐÚNG: "protein": 15. Ví dụ SAI: "protein": "15g".
- TẤT CẢ các tên thuộc tính đều phải được đặt trong dấu ngoặc kép.
- TUYỆT ĐỐI KHÔNG giải thích, không trình bày quá trình tính toán.
- Chỉ trả về duy nhất một chuỗi JSON hợp lệ theo schema sau, không có bất kỳ văn bản nào khác:
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
THÔNG TIN HỘI VIÊN:
{userInfo}

DANH SÁCH MÓN ĂN (JSON):
{foodListJson}

HÃY TẠO THỰC ĐƠN NGAY BÂY GIỜ. CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON.
""";

        var resultJson = await CallGroqWithRetryAsync(systemInstruction, userPrompt, isJsonMode: true);

        string cleanJson = ExtractPureJson(resultJson);

        if (string.IsNullOrWhiteSpace(cleanJson))
        {
            _logger.LogError("Groq Response bị thiếu khối JSON. Content nhận được: {RawResponse}", resultJson);
            throw new Exception("Không tìm thấy dữ liệu JSON hợp lệ trong câu trả lời của Groq AI.");
        }

        var options = new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true,
            NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString | System.Text.Json.Serialization.JsonNumberHandling.WriteAsString
        };
        return JsonSerializer.Deserialize<DietPlanResponse>(cleanJson, options)
            ?? throw new Exception("Không đọc được JSON từ Groq AI.");
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
3. Nếu hội viên ĐÃ TRẢ LỜI về dị ứng/thực phẩm kiêng:
   -> TUYỆT ĐỐI KHÔNG HỎI THÊM BẤT CỨ CÂU NÀO KHÁC.
   -> TRẢ LỜI CHÍNH XÁC DUY NHẤT CỤM TỪ: READY_TO_GENERATE

QUY TẮC:
- TUYỆT ĐỐI KHÔNG giải thích, không phân tích các bước suy luận.
- CHỈ TRẢ LỜI bằng câu hỏi thân thiện dành cho hội viên HOẶC cụm từ READY_TO_GENERATE.
- Khi đã sẵn sàng tạo thực đơn, CHỈ TRẢ VỀ: READY_TO_GENERATE.
""";

        var prompt = $"""
{userInfo}

LỊCH SỬ CHAT:
{conversation}
""";

        var reply = await CallGroqWithRetryAsync(systemInstruction, prompt, isJsonMode: false);
        return reply.Trim().Trim('"', '\'');
    }

    private async Task<string> CallGroqWithRetryAsync(string systemInstruction, string userPrompt, bool isJsonMode, int maxRetries = 3)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                return await CallGroqAsync(systemInstruction, userPrompt, isJsonMode);
            }
            catch (HttpRequestException ex) when (attempt < maxRetries && IsTransientError(ex))
            {
                var delay = TimeSpan.FromMilliseconds((int)Math.Pow(2, attempt) * 1000 + _jitter.Next(0, 1000));
                _logger.LogWarning(ex, "Groq API transient error (attempt {Attempt}/{MaxRetries}), retrying in {Delay}ms", attempt, maxRetries, delay.TotalMilliseconds);
                await Task.Delay(delay);
            }
        }

        return await CallGroqAsync(systemInstruction, userPrompt, isJsonMode);
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

    private async Task<string> CallGroqAsync(string systemInstruction, string userPrompt, bool isJsonMode)
    {
        var requestBody = isJsonMode
            ? (object)new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = systemInstruction },
                    new { role = "user", content = userPrompt }
                },
                temperature = 0.4,
                max_tokens = 8192,
                response_format = new { type = "json_object" }
            }
            : (object)new
            {
                model = _model,
                messages = new[]
                {
                    new { role = "system", content = systemInstruction },
                    new { role = "user", content = userPrompt }
                },
                temperature = 0.7,
                max_tokens = 1024
            };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, GroqBaseUrl);
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = content;

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Groq API error ({response.StatusCode}): {errorContent}", null, response.StatusCode);
        }

        var rawJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(rawJson);

        if (!doc.RootElement.TryGetProperty("choices", out var choices) || choices.GetArrayLength() == 0)
            return "{}";

        var message = choices[0].GetProperty("message");
        var text = message.GetProperty("content").GetString() ?? "";

        return text;
    }

    private static string ExtractPureJson(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        // Xóa markdown code block nếu có
        input = Regex.Replace(input, @"```json\s*|\s*```", "", RegexOptions.IgnoreCase).Trim();

        int startIndex = input.IndexOf('{');
        int endIndex = input.LastIndexOf('}');

        if (startIndex >= 0 && endIndex > startIndex)
        {
            return input.Substring(startIndex, endIndex - startIndex + 1);
        }

        return string.Empty;
    }
}
