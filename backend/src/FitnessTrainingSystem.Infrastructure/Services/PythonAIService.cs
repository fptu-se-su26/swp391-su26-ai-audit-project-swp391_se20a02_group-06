using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PythonGeminiAiService : IGeminiAiService // 🟢 Kế thừa đúng Interface có sẵn của bạn
{
    private readonly HttpClient _httpClient;

    public PythonGeminiAiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson)
    {
        // 1. Gói dữ liệu vào một object trùng khớp với Request Model bên Python FastAPI
        var payload = new
        {
            user_info = userInfo,
            food_list_json = foodListJson
        };

        // 2. Bắn HTTP POST sang Python Microservice (Đang chạy port 8000)
        var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/api/ai/generate-diet-plan", payload);
        response.EnsureSuccessStatusCode();

        // 3. Đọc chuỗi JSON kết quả từ Python trả về
        string rawJsonFromPython = await response.Content.ReadAsStringAsync();

        // 4. Map chuỗi JSON đó trực tiếp thành Object DietPlanResponse của bạn
        var dietPlanResponse = JsonSerializer.Deserialize<DietPlanResponse>(rawJsonFromPython, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return dietPlanResponse!;
    }
}