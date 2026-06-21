using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class WorkoutLog : BaseEntity
{
    public int? UserId { get; set; }
    public int? ExerciseId { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public decimal? WeightKg { get; set; }
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Exercise? Exercise { get; set; }
}
