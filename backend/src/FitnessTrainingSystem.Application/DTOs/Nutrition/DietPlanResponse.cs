using System.Text.Json.Serialization;

namespace FitnessTrainingSystem.Application.DTOs.Nutrition;

public class DietPlanResponse
{
    [JsonPropertyName("diet_title")]
    public string DietTitle { get; set; } = "";

    [JsonPropertyName("daily_calories")]
    public double DailyCalories { get; set; }

    [JsonPropertyName("protein_target_g")]
    public double ProteinTargetG { get; set; }

    [JsonPropertyName("carbs_target_g")]
    public double CarbsTargetG { get; set; }

    [JsonPropertyName("fat_target_g")]
    public double FatTargetG { get; set; }

    [JsonPropertyName("meals")]
    public List<MealDto> Meals { get; set; } = new();
}

public class MealDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("calories")]
    public double Calories { get; set; }

    [JsonPropertyName("foods")]
    public List<FoodItemDto> Foods { get; set; } = new();
}

public class FoodItemDto
{
    [JsonPropertyName("food_id")]
    public int FoodId { get; set; }

    [JsonPropertyName("food_name")]
    public string FoodName { get; set; } = "";

    [JsonPropertyName("amount")]
    public string Amount { get; set; } = "";

    [JsonPropertyName("calories")]
    public double Calories { get; set; }

    [JsonPropertyName("protein")]
    public double Protein { get; set; }

    [JsonPropertyName("carbs")]
    public double Carbs { get; set; }

    [JsonPropertyName("fat")]
    public double Fat { get; set; }
}