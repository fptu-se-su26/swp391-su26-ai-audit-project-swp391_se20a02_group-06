namespace FitnessTrainingSystem.Application.DTOs.Nutrition;

public class DietPlanResponse
{
    public string DietTitle { get; set; } = string.Empty;
    public int DailyCalories { get; set; }
    public int ProteinTargetG { get; set; }
    public int CarbsTargetG { get; set; }
    public int FatTargetG { get; set; }
    public List<MealDto> Meals { get; set; } = new();
}

public class MealDto
{
    public string Name { get; set; } = string.Empty; // Breakfast, Lunch...
    public int Calories { get; set; }
    public List<FoodItemDto> Foods { get; set; } = new();
}

public class FoodItemDto
{
    public int FoodId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
    public int Calories { get; set; }
    public double Protein { get; set; }
    public double Carbs { get; set; }
    public double Fat { get; set; }
}