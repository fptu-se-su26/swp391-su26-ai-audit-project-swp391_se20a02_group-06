using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class Menu : BaseAuditableEntity
{
    public int UserId { get; set; }
    public int MealScheduleId { get; set; }
    public int FoodId { get; set; }
    public string Amount { get; set; } = string.Empty;
    public bool IsEaten { get; set; } = false;

    public User User { get; set; } = null!;
    public MealSchedule MealSchedule { get; set; } = null!;
    public Food Food { get; set; } = null!;
}
