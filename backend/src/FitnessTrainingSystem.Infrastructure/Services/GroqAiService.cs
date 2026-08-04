using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class GroqAiService : IGeminiAiService, IGroqAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string _baseUrl;
    private readonly ILogger<GroqAiService> _logger;
    private static readonly Random _jitter = new();

    public GroqAiService(HttpClient httpClient, IConfiguration configuration, ILogger<GroqAiService> logger)
    {
        _httpClient = httpClient;
        var apiKey = configuration["Groq:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            apiKey = configuration["GROQ_API_KEY"];
        }
        _apiKey = apiKey ?? throw new InvalidOperationException("Missing Groq:ApiKey");
        _model = configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";
        _baseUrl = configuration["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1/chat/completions";
        _logger = logger;
        
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
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

Trả lời bằng JSON hợp lệ.
""";

        var userPrompt = $"""
THÔNG TIN HỘI VIÊN
{userInfo}

DANH SÁCH MÓN ĂN DATABASE
{foodListJson}
""";

        var resultJson = await CallGroqWithRetryAsync(systemInstruction, userPrompt, isJsonMode: true);
        
        // Clean up markdown block if API returns it
        if (resultJson.Contains("```json"))
        {
            var startIndex = resultJson.IndexOf("```json") + 7;
            var endIndex = resultJson.LastIndexOf("```");
            if (endIndex > startIndex)
            {
                resultJson = resultJson.Substring(startIndex, endIndex - startIndex);
            }
        }
        else if (resultJson.Contains("```"))
        {
            var startIndex = resultJson.IndexOf("```") + 3;
            var endIndex = resultJson.LastIndexOf("```");
            if (endIndex > startIndex)
            {
                resultJson = resultJson.Substring(startIndex, endIndex - startIndex);
            }
        }

        var jsonStart = resultJson.IndexOf('{');
        var jsonEnd = resultJson.LastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            resultJson = resultJson.Substring(jsonStart, jsonEnd - jsonStart + 1);
        }
        
        resultJson = resultJson.Trim();

        var options = new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true,
            NumberHandling = JsonNumberHandling.AllowReadingFromString
        };
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

        var reply = await CallGroqWithRetryAsync(systemInstruction, prompt, isJsonMode: false);
        return reply.Trim().Trim('"', '\'');
    }

    private async Task<string> CallGroqWithRetryAsync(string systemInstruction, string userPrompt, bool isJsonMode = false, int maxRetries = 3)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                return await CallGroqAsync(systemInstruction, userPrompt, isJsonMode);
            }
            catch (Exception ex) when (attempt < maxRetries && IsTransientError(ex))
            {
                var delay = TimeSpan.FromMilliseconds((int)Math.Pow(2, attempt) * 1000 + _jitter.Next(0, 1000));
                _logger.LogWarning(ex, "Groq API transient error (attempt {Attempt}/{MaxRetries}), retrying in {Delay}ms", attempt, maxRetries, delay.TotalMilliseconds);
                await Task.Delay(delay);
            }
        }

        throw new Exception("Exceeded max retries for Groq API.");
    }

    private static bool IsTransientError(Exception ex)
    {
        if (ex is TaskCanceledException) return true;
        if (ex is HttpRequestException httpEx && httpEx.StatusCode.HasValue)
        {
            var code = (int)httpEx.StatusCode.Value;
            if (code == 429 || code == 500 || code == 502 || code == 503 || code == 504)
                return true;
        }
        return false;
    }

    private async Task<string> CallGroqAsync(string systemInstruction, string userPrompt, bool isJsonMode)
    {
        var messages = new[]
        {
            new { role = "system", content = systemInstruction },
            new { role = "user", content = userPrompt }
        };

        var requestBody = new Dictionary<string, object>
        {
            { "model", _model },
            { "messages", messages },
            { "temperature", isJsonMode ? 0.2 : 0.7 }
        };

        if (isJsonMode)
        {
            requestBody.Add("response_format", new { type = "json_object" });
        }

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(_baseUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Groq API error ({StatusCode}): {ErrorContent}", response.StatusCode, errorContent);
            throw new HttpRequestException($"Groq API error ({response.StatusCode}): {errorContent}", null, response.StatusCode);
        }

        var rawJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(rawJson);
        var root = doc.RootElement;

        if (!root.TryGetProperty("choices", out var choices) || choices.ValueKind != JsonValueKind.Array || choices.GetArrayLength() == 0)
        {
            throw new Exception("Invalid response format: 'choices' array is missing or empty.");
        }

        var choice = choices[0];
        
        if (choice.TryGetProperty("finish_reason", out var finishReason) && finishReason.GetString() == "length")
        {
            _logger.LogWarning("Groq API warning: finish_reason is 'length' (response was cut off).");
        }

        if (!choice.TryGetProperty("message", out var message) || !message.TryGetProperty("content", out var textElement))
        {
            throw new Exception("Invalid response format: 'message.content' is missing.");
        }

        var text = textElement.GetString();
        return text ?? "{}";
    }
}
