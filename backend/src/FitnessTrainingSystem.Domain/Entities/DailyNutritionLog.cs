using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class DailyNutritionLog : BaseEntity
{
    public int UserId { get; set; }
    public DateTime LogDate { get; set; }

    // Targets (calculated from body metrics + TDEE)
    public int CaloriesTarget { get; set; }
    public decimal ProteinTargetGrams { get; set; }
    public decimal CarbsTargetGrams { get; set; }
    public decimal FatTargetGrams { get; set; }
    public int WaterTargetGlasses { get; set; }

    // Consumed (accumulated from logged meals)
    public int CaloriesConsumed { get; set; }
    public decimal ProteinConsumedGrams { get; set; }
    public decimal CarbsConsumedGrams { get; set; }
    public decimal FatConsumedGrams { get; set; }
    public int WaterConsumedGlasses { get; set; }

    // Burned (total from workout sessions that day)
    public decimal CaloriesBurned { get; set; }

    // Navigation
    public User User { get; set; } = null!;
}
