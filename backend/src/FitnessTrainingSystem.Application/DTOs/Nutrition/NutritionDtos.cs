namespace FitnessTrainingSystem.Application.DTOs.Nutrition;

/// <summary>
/// Response cho trang Nutrition — daily summary
/// </summary>
public class DailyNutritionSummaryDto
{
    public DateTime Date { get; set; }

    // Calorie overview
    public int CaloriesTarget { get; set; }
    public int CaloriesConsumed { get; set; }
    public decimal CaloriesBurned { get; set; }
    public int CaloriesRemaining { get; set; }
    public int NetCalories { get; set; } // Consumed - Burned

    // Macro breakdown
    public MacroSummaryDto Protein { get; set; } = new();
    public MacroSummaryDto Carbs { get; set; } = new();
    public MacroSummaryDto Fat { get; set; } = new();

    // Hydration
    public int WaterTargetGlasses { get; set; }
    public int WaterConsumedGlasses { get; set; }

    // User state
    public bool HasBodyMetrics { get; set; }
    public string FitnessGoal { get; set; } = "MAINTAIN";

    // Water Reminder Preferences
    public string? WaterReminderStartTime { get; set; }
    public string? WaterReminderEndTime { get; set; }
}

public class MacroSummaryDto
{
    public decimal CurrentGrams { get; set; }
    public decimal TargetGrams { get; set; }
    public int Percentage { get; set; } // current/target * 100
}

/// <summary>
/// Request body to log water intake
/// </summary>
public class LogWaterDto
{
    public int Glasses { get; set; } = 1;
}
