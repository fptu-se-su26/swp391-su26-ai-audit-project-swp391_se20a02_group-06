using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class AiRecommendation : BaseAuditableEntity
{
    public int? UserId { get; set; }
    public RecommendationType Type { get; set; }
    public string? UserRequest { get; set; }
    public string AiResponse { get; set; } = string.Empty;

    public User? User { get; set; }
    public ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();
}
