using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Application.DTOs.Workouts;

public class CreateWorkoutPlanDto
{
    public string Title { get; set; } = null!;
    public string? Goal { get; set; }
    public int? TargetCalories { get; set; }
    public int? TargetDurationMinutes { get; set; }
    public List<CreateWorkoutPlanExerciseDto> Exercises { get; set; } = new();
}

public class CreateWorkoutPlanExerciseDto
{
    public int ExerciseId { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public int? DurationSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public int? ExerciseOrder { get; set; }
}

public class WorkoutPlanDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string? Goal { get; set; }
    public int? TargetCalories { get; set; }
    public int? TargetDurationMinutes { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class CreateWorkoutSessionDto
{
    public int? WorkoutPlanId { get; set; }
}

public class CompleteWorkoutSessionDto
{
    public int TotalDurationMinutes { get; set; }
    public decimal TotalCaloriesBurned { get; set; }
    public List<WorkoutSessionDetailDto> Details { get; set; } = new();
}

public class WorkoutSessionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? WorkoutPlanId { get; set; }
    public int? TotalDurationMinutes { get; set; }
    public decimal? TotalCaloriesBurned { get; set; }
    public string Status { get; set; } = null!;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public List<WorkoutSessionDetailDto> Details { get; set; } = new();
}

public class WorkoutSessionDetailDto
{
    public int ExerciseId { get; set; }
    public string? ExerciseName { get; set; }
    public int? SetsDone { get; set; }
    public int? RepsDone { get; set; }
    public int? DurationSeconds { get; set; }
    public decimal? CaloriesBurned { get; set; }
}
