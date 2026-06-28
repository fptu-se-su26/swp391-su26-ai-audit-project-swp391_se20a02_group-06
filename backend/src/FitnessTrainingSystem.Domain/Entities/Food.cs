using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class Food : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? ServingSize { get; set; }
    public string? Unit { get; set; }
    public int Calories { get; set; }
    public decimal Protein { get; set; } = 0.0m;
    public decimal Carbs { get; set; } = 0.0m;
    public decimal Fat { get; set; } = 0.0m;
    public string? ImageUrl { get; set; }

    public ICollection<MealScheduleItem> MealScheduleItems { get; set; } = new List<MealScheduleItem>();
}
