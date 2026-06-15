using System.Collections.Generic;
using Newtonsoft.Json;

namespace FitnessTrainingSystem.Application.DTOs.Nutrition
{
    // Lớp bọc ngoài cùng của kết quả trả về
    public class DietPlanResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("data")]
        public DietData? Data { get; set; }
    }

    // Lớp chứa thông tin calo mục tiêu và danh sách các bữa ăn
    public class DietData
    {
        [JsonProperty("total_calories_target")]
        public int TotalCaloriesTarget { get; set; }

        [JsonProperty("meal_plan")]
        public List<MealPlanItem>? MealPlan { get; set; }
    }

    // Lớp đại diện cho từng bữa ăn (Ví dụ: Bữa sáng, Bữa trưa...)
    public class MealPlanItem
    {
        [JsonProperty("meal_time")]
        public string? MealTime { get; set; }

        [JsonProperty("foods")]
        public List<FoodItemResult>? Foods { get; set; }
    }

    // Lớp chi tiết của từng món ăn trong bữa ăn đó
    public class FoodItemResult
    {
        [JsonProperty("food_id")]
        public string? FoodId { get; set; }

        [JsonProperty("amount")]
        public string? Amount { get; set; }

        [JsonProperty("protein")]
        public double Protein { get; set; }

        [JsonProperty("carbs")]
        public double Carbs { get; set; }

        [JsonProperty("fat")]
        public double Fat { get; set; }

        [JsonProperty("calories")]
        public double Calories { get; set; }

        [JsonProperty("sugar")]
        public double Sugar { get; set; } 
    }
}