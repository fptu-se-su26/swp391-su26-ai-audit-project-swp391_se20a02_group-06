using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class DirectGemmaService : IGemmaAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string _baseUrl;
    private readonly ILogger<DirectGemmaService> _logger;
    private static readonly Random _jitter = new();

    public DirectGemmaService(HttpClient httpClient, IConfiguration configuration, ILogger<DirectGemmaService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["AiService:ApiKey"] ?? configuration["AI_SERVICE_API_KEY"] ?? configuration["GEMINI_API_KEY"] ?? "";
        
        // Mặc định dùng mô hình Gemma 4 MoE tối ưu tốc độ
        _model = configuration["AiService:Model"] ?? "gemma-4-26b-a4b-it";
        
        // Chuẩn hóa Base URL, xóa chữ "models/" ở đuôi nếu bị thừa
        var rawBaseUrl = configuration["AiService:BaseUrl"] ?? "[https://generativelanguage.googleapis.com/v1beta/](https://generativelanguage.googleapis.com/v1beta/)";
        _baseUrl = rawBaseUrl.EndsWith("models/") ? rawBaseUrl.Replace("models/", "") : rawBaseUrl;
        
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
- TẤT CẢ các tên thuộc tính (property name) đều phải được đặt trong dấu ngoặc kép.
- TUYỆT ĐỐI KHÔNG giải thích, không trình bày quá trình tính toán, không nháp hay suy luận ra văn bản.
- KẾT QUẢ TRẢ VỀ CHỈ ĐƯỢC PHÉP BẮT ĐẦU BẰNG DẤU `{` VÀ KẾT THÚC BẰNG DẤU `}`. KHÔNG ĐƯỢC CÓ BẤT KỲ VĂN BẢN NÀO KHÁC BÊN NGOÀI KHỐI JSON.

Output phải là JSON hợp lệ và CHUẨN XÁC tuyệt đối theo schema sau:
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

HÃY TẠO THỰC ĐƠN NGAY BÂY GIỜ. CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON BẮT ĐẦU BẰNG DẤU MỞ NGOẶC NHỌN VÀ KẾT THÚC BẰNG ĐÓNG NGOẶC NHỌN. TUYỆT ĐỐI KHÔNG SUY LUẬN HOẶC GIẢI THÍCH!
""";

        var resultJson = await CallGemmaWithRetryAsync(systemInstruction, userPrompt, isJsonMode: true);
        
        string cleanJson = ExtractPureJson(resultJson);

        if (string.IsNullOrWhiteSpace(cleanJson))
        {
            _logger.LogError("Gemma Response bị thiếu khối JSON. Content nhận được: {RawResponse}", resultJson);
            throw new Exception("Không tìm thấy dữ liệu JSON hợp lệ trong câu trả lời của Gemma AI.");
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        return JsonSerializer.Deserialize<DietPlanResponse>(cleanJson, options)
            ?? throw new Exception("Không đọc được JSON từ Gemma AI.");
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
   -> TRẢ LỜI CHÍNH XÁC DUY NHẤT CỤM TỪ: 
   READY_TO_GENERATE

QUY TẮC:
- TUYỆT ĐỐI KHÔNG giải thích, không phân tích các bước suy luận.
- CHỈ TRẢ LỜI bằng câu hỏi thân thiện dành cho hội viên HOẶC cụm từ READY_TO_GENERATE.
- Khi đã sẵn sàng tạo thực đơn, CHỈ TRẢ VỀ: READY_TO_GENERATE.
""";

        var prompt = $"""
{userInfo}
LỊCH SỬ CHAT
{conversation}
""";

        var reply = await CallGemmaWithRetryAsync(systemInstruction, prompt, isJsonMode: false);
        return reply.Trim().Trim('"', '\'');
    }

    private async Task<string> CallGemmaWithRetryAsync(string systemInstruction, string userPrompt, bool isJsonMode, int maxRetries = 3)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                return await CallGemmaAsync(systemInstruction, userPrompt, isJsonMode);
            }
            catch (HttpRequestException ex) when (attempt < maxRetries && IsTransientError(ex))
            {
                var delay = TimeSpan.FromMilliseconds((int)Math.Pow(2, attempt) * 1000 + _jitter.Next(0, 1000));
                _logger.LogWarning(ex, "Gemma API transient error (attempt {Attempt}/{MaxRetries}), retrying in {Delay}ms", attempt, maxRetries, delay.TotalMilliseconds);
                await Task.Delay(delay);
            }
        }

        return await CallGemmaAsync(systemInstruction, userPrompt, isJsonMode);
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

    private async Task<string> CallGemmaAsync(string systemInstruction, string userPrompt, bool isJsonMode)
    {
        // Cấu hình tối ưu cho Gemma: Tránh temperature=0 và topP quá thấp để không bị lỗi lặp từ vô hạn (stuttering loop)
        var generationConfig = isJsonMode 
            ? (object)new 
            { 
                responseMimeType = "application/json", 
                temperature = 0.3,
                maxOutputTokens = 8192
            }
            : (object)new 
            { 
                temperature = 0.7, 
                maxOutputTokens = 2048 
            };

        var combinedPrompt = $"{systemInstruction}\n\n{userPrompt}";
        object contents;

        // Ép AI không được phân tích nháp bằng cách mớm trước dấu ngoặc nhọn JSON
        if (isJsonMode)
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = combinedPrompt } } },
                new { role = "model", parts = new[] { new { text = "{\n" } } }
            };
        }
        else
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = combinedPrompt } } }
            };
        }

        var requestBody = new
        {
            contents = contents,
            generationConfig = generationConfig
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var requestUrl = $"{_baseUrl.TrimEnd('/')}/models/{_model}:generateContent?key={_apiKey}";

        var response = await _httpClient.PostAsync(requestUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Gemma API error ({response.StatusCode}): {errorContent}", null, response.StatusCode);
        }

        var rawJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(rawJson);
        
        var candidatesElem = doc.RootElement.GetProperty("candidates");
        if (candidatesElem.GetArrayLength() == 0) return "{}";

        var partsElem = candidatesElem[0].GetProperty("content").GetProperty("parts");
        if (partsElem.GetArrayLength() == 0) return "{}";

        var text = partsElem[0].GetProperty("text").GetString() ?? "";

        // Nếu có mớm lời, AI chỉ sinh ra phần sau dấu `{`, nên ta cần cộng lại `{` vào
        if (isJsonMode && !string.IsNullOrWhiteSpace(text))
        {
            text = "{\n" + text;
        }

        return text;
    }

    private static string ExtractPureJson(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        // Xóa các ký tự markdown block nếu có
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