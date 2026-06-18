using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class WorkoutSession : BaseEntity
{
    public int UserId { get; set; }
    public int? WorkoutPlanId { get; set; }
    public int? TotalDurationMinutes { get; set; }
    public decimal? TotalCaloriesBurned { get; set; }
    public string Status { get; set; } = "IN_PROGRESS";
    public DateTime? StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public User User { get; set; } = null!;
    // Note: If you add WorkoutPlan entity later, add the navigation property here
    // public WorkoutPlan? WorkoutPlan { get; set; }

    public ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
