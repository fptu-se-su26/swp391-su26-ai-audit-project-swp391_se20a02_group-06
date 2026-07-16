using System.Text;
using System.Text.Json;
using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PythonAiService : IGeminiAiService
{
    private readonly HttpClient _httpClient;

    public PythonAiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<DietPlanResponse> GenerateDietPlanAsync(
        string userInfo,
        string foodListJson)
    {
        var payload = new
        {
            user_info = userInfo,
            food_list_json = foodListJson
        };

        var json = JsonSerializer.Serialize(payload);

        var content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.PostAsync(
            "http://localhost:8000/api/ai/generate-diet-plan",
            content);

        response.EnsureSuccessStatusCode();

        var rawJson = await response.Content.ReadAsStringAsync();

        Console.WriteLine("========== PYTHON RESPONSE ==========");
        Console.WriteLine(rawJson);
        Console.WriteLine("====================================");

        // FastAPI đôi khi trả về string JSON
        if (rawJson.StartsWith("\"{"))
        {
            rawJson = JsonSerializer.Deserialize<string>(rawJson)!;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var plan = JsonSerializer.Deserialize<DietPlanResponse>(
            rawJson,    
            options);

        if (plan == null)
            throw new Exception("Không đọc được JSON từ AI.");

        Console.WriteLine("========== DESERIALIZE ==========");

        Console.WriteLine(plan.DietTitle);

        foreach (var meal in plan.Meals)
        {
            Console.WriteLine($"Meal: {meal.Name}");

            foreach (var food in meal.Foods)
            {
                Console.WriteLine(
                    $"FoodId={food.FoodId} | FoodName={food.FoodName} | Amount={food.Amount}");
            }
        }

        Console.WriteLine("===============================");

        return plan;
    }
    public async Task<string> ChatAsync(
    string conversation,
    string userInfo)
{
    var payload = new
    {
        conversation,
        user_info = userInfo
    };

    var json = JsonSerializer.Serialize(payload);

    var content = new StringContent(
        json,
        Encoding.UTF8,
        "application/json");

    var response = await _httpClient.PostAsync(
        "http://localhost:8000/api/ai/chat",
        content);

    response.EnsureSuccessStatusCode();

    var rawJson = await response
                    .Content
                    .ReadAsStringAsync();

        Console.WriteLine();
        Console.WriteLine("===== CHAT API =====");
        Console.WriteLine(rawJson);
        Console.WriteLine("====================");
        Console.WriteLine();

var document =
        JsonDocument.Parse(
            rawJson);


if (!document.RootElement
        .TryGetProperty(
            "reply",
            out var replyElement))
{
    throw new Exception(
        "Python Chat API không trả về reply.");
}


return replyElement
            .GetString()
            ?? string.Empty;
}
}