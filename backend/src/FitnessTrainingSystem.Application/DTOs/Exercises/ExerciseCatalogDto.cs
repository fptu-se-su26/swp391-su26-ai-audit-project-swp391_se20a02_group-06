namespace FitnessTrainingSystem.Application.DTOs.Exercises;

public class ExerciseCatalogDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? MuscleGroup { get; set; }
    public int? MuscleGroupId { get; set; }
    public int Difficulty { get; set; }
    public int? DurationMinutes { get; set; }
    public int? PackageId { get; set; }
    public string? PackageName { get; set; }
    public bool IsLocked { get; set; }
    public string? ThumbnailUrl { get; set; }
}
