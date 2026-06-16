using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class MealSchedule : BaseAuditableEntity
{
    public int UserId { get; set; }
    public int? AiRecommendationId { get; set; }
    public string ScheduleName { get; set; } = string.Empty;
    public TimeSpan? EatTime { get; set; }
    public int? TotalCaloriesTarget { get; set; }

    public User User { get; set; } = null!;
    public AiRecommendation? AiRecommendation { get; set; }
    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
