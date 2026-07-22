using System.Text.Json.Serialization;

namespace FitnessTrainingSystem.Application.DTOs.Workouts;

public class AiWorkoutPlanResponseDto
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; } = null!;

    [JsonPropertyName("recommendation")]
    public WorkoutPlanOutput Recommendation { get; set; } = null!;
}

public class WorkoutPlanOutput
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = null!;

    [JsonPropertyName("goal")]
    public string Goal { get; set; } = null!;

    [JsonPropertyName("target_calories")]
    public int TargetCalories { get; set; }

    [JsonPropertyName("target_duration_minutes")]
    public int TargetDurationMinutes { get; set; }

    [JsonPropertyName("exercises")]
    public List<ExerciseItemOutput> Exercises { get; set; } = new();
}

public class ExerciseItemOutput
{
    [JsonPropertyName("exercise_id")]
    public int ExerciseId { get; set; }

    [JsonPropertyName("exercise_title")]
    public string ExerciseTitle { get; set; } = null!;

    [JsonPropertyName("sets")]
    public int Sets { get; set; }

    [JsonPropertyName("reps")]
    public int Reps { get; set; }

    [JsonPropertyName("duration_seconds")]
    public int DurationSeconds { get; set; }

    [JsonPropertyName("rest_seconds")]
    public int RestSeconds { get; set; }

    [JsonPropertyName("exercise_order")]
    public int ExerciseOrder { get; set; }

    [JsonPropertyName("calories_burned")]
    public int CaloriesBurned { get; set; }
}

public class AiWeeklyWorkoutPlanResponseDto
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; } = null!;

    [JsonPropertyName("recommendation")]
    public WeeklyWorkoutPlanOutput Recommendation { get; set; } = null!;
}

public class WeeklyWorkoutPlanOutput
{
    [JsonPropertyName("days")]
    public List<WorkoutPlanOutput> Days { get; set; } = new();
}