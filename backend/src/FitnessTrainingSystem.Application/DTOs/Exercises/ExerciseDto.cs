using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.Exercises;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? VideoUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? MuscleGroup { get; set; }
    public int? MuscleGroupId { get; set; }
    public ExerciseDifficulty Difficulty { get; set; }
    public int? Duration { get; set; }
    public int? CreatedBy { get; set; }
    public string? CreatorName { get; set; }
}
