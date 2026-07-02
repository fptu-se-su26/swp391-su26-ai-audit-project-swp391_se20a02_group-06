using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class Exercise : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? VideoUrl { get; set; }
    public int? MuscleGroupId { get; set; }
    public MuscleGroup? MuscleGroup { get; set; }
    public ExerciseDifficulty Difficulty { get; set; }
    public int? DurationMinutes { get; set; }
    public int? CreatedBy { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.ForeignKey("CreatedBy")]
    public User? Creator { get; set; }
    public ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
