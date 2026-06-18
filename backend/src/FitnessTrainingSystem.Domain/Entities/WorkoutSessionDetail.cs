using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class WorkoutSessionDetail : BaseEntity
{
    public int WorkoutSessionId { get; set; }
    public int ExerciseId { get; set; }
    public int? SetsDone { get; set; } = 0;
    public int? RepsDone { get; set; } = 0;
    public int? DurationSeconds { get; set; } = 0;
    public decimal? CaloriesBurned { get; set; } = 0.0m;

    public WorkoutSession WorkoutSession { get; set; } = null!;
    public Exercise Exercise { get; set; } = null!;
}
