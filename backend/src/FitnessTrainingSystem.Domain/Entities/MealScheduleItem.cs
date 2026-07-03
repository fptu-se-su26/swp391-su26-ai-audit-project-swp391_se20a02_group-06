using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class MealScheduleItem : BaseAuditableEntity
{
    public int MealScheduleId { get; set; }
    public int FoodId { get; set; }
    public string Amount { get; set; } = string.Empty;
    public bool IsEaten { get; set; } = false;

    public MealSchedule MealSchedule { get; set; } = null!;
    public Food Food { get; set; } = null!;
}
