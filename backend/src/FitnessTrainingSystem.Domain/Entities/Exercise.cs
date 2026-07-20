using System.ComponentModel.DataAnnotations.Schema;
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
    [System.ComponentModel.DataAnnotations.Schema.Column("duration")]
    public int? DurationMinutes { get; set; }
    public int? CreatedBy { get; set; }

    [ForeignKey("CreatedBy")]
    public User? Creator { get; set; }

    public int? PackageId { get; set; }

    [ForeignKey("PackageId")]
    public ProductPackage? Package { get; set; }
    public ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
