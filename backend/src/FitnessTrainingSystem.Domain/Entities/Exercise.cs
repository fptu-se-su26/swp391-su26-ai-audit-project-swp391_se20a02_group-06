using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class Exercise : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? VideoUrl { get; set; }
    public string? MuscleGroup { get; set; }
    public ExerciseDifficulty Difficulty { get; set; }
    public int? Duration { get; set; }
    public int? CreatedBy { get; set; }

    public User? Creator { get; set; }
    public ICollection<WorkoutLog> WorkoutLogs { get; set; } = new List<WorkoutLog>();
}
