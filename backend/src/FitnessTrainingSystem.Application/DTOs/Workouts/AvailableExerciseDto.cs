using System.Text.Json.Serialization;

namespace FitnessTrainingSystem.Application.DTOs.Workouts;

public class AvailableExerciseDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("muscle_group_id")]
    public int? MuscleGroupId { get; set; }

    [JsonPropertyName("muscle_group_name")]
    public string? MuscleGroupName { get; set; }

    [JsonPropertyName("equipment")]
    public string? Equipment { get; set; }

    [JsonPropertyName("duration_minutes")]
    public int? DurationMinutes { get; set; }

    [JsonPropertyName("calories_burn_per_min")]
    public double CaloriesBurnPerMin { get; set; }

    [JsonPropertyName("difficulty")]
    public string? Difficulty { get; set; }
}