using System.Collections.Generic;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace FitnessTrainingSystem.Application.DTOs.Nutrition
{
    // Lớp bọc ngoài cùng của kết quả trả về
    public class DietPlanResponse
    {
        [JsonProperty("success")]
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonProperty("data")]
        [JsonPropertyName("data")]
        public DietData? Data { get; set; }

        [JsonProperty("diet_title")]
        [JsonPropertyName("diet_title")]
        public string? DietTitle { get; set; }

        [JsonProperty("daily_calories")]
        [JsonPropertyName("daily_calories")]
        public double DailyCalories { get; set; }

        [JsonProperty("protein_target_g")]
        [JsonPropertyName("protein_target_g")]
        public double ProteinTargetG { get; set; }

        [JsonProperty("carbs_target_g")]
        [JsonPropertyName("carbs_target_g")]
        public double CarbsTargetG { get; set; }

        [JsonProperty("fat_target_g")]
        [JsonPropertyName("fat_target_g")]
        public double FatTargetG { get; set; }

        [JsonProperty("calories")]
        [JsonPropertyName("calories")]
        public double Calories { get; set; }

        [JsonProperty("meals")]
        [JsonPropertyName("meals")]
        public List<MealPlanItem>? Meals { get; set; }
    }

    // Lớp chứa thông tin calo mục tiêu và danh sách các bữa ăn
    public class DietData
    {
        [JsonProperty("total_calories_target")]
        [JsonPropertyName("total_calories_target")]
        public int TotalCaloriesTarget { get; set; }

        [JsonProperty("meal_plan")]
        [JsonPropertyName("meal_plan")]
        public List<MealPlanItem>? MealPlan { get; set; }
    }

    // Lớp đại diện cho từng bữa ăn (Ví dụ: Bữa sáng, Bữa trưa...)
    public class MealPlanItem
    {
        [JsonProperty("name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonProperty("meal_time")]
        [JsonPropertyName("meal_time")]
        public string? MealTime { get; set; }

        [JsonProperty("calories")]
        [JsonPropertyName("calories")]
        public double Calories { get; set; }

        [JsonProperty("foods")]
        [JsonPropertyName("foods")]
        public List<FoodItemResult>? Foods { get; set; }
    }

    // Lớp chi tiết của từng món ăn trong bữa ăn đó
    public class FoodItemResult
    {
        [JsonProperty("food_id")]
        [JsonPropertyName("food_id")]
        public string? FoodId { get; set; }

        [JsonProperty("food_name")]
        [JsonPropertyName("food_name")]
        public string? FoodName { get; set; }

        [JsonProperty("amount")]
        [JsonPropertyName("amount")]
        public string? Amount { get; set; }

        [JsonProperty("protein")]
        [JsonPropertyName("protein")]
        public double Protein { get; set; }

        [JsonProperty("carbs")]
        [JsonPropertyName("carbs")]
        public double Carbs { get; set; }

        [JsonProperty("fat")]
        [JsonPropertyName("fat")]
        public double Fat { get; set; }

        [JsonProperty("calories")]
        [JsonPropertyName("calories")]
        public double Calories { get; set; }

        [JsonProperty("sugar")]
        [JsonPropertyName("sugar")]
        public double Sugar { get; set; } 
    }
}