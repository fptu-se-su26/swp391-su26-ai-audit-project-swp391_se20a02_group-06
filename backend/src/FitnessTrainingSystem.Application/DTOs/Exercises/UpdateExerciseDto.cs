using System.ComponentModel.DataAnnotations;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.Exercises;

public class UpdateExerciseDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title must not exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? VideoUrl { get; set; }

    public int? MuscleGroupId { get; set; }

    [Required(ErrorMessage = "Difficulty is required")]
    public ExerciseDifficulty Difficulty { get; set; }

    [Range(1, 1000, ErrorMessage = "Duration must be between 1 and 1000 minutes")]
    public int? Duration { get; set; }
}
