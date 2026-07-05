using System;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.Exercises;

public class CreateExerciseRequestDto
{
    public int PtId { get; set; }
    public string? MuscleGroup { get; set; }
    public ExerciseDifficulty Difficulty { get; set; }
    public string? Instructions { get; set; }
    public string Priority { get; set; } = "MEDIUM"; // LOW, MEDIUM, HIGH
    public DateTime? Deadline { get; set; }
}

public class PtSubmitExerciseDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public int? Duration { get; set; }
}

public class ReviewExerciseRequestDto
{
    public string Status { get; set; } = "APPROVED"; // APPROVED, REJECTED
    public string? ReviewNote { get; set; }
}

public class ExerciseRequestDto
{
    public int Id { get; set; }
    public int PtId { get; set; }
    public string PtName { get; set; } = string.Empty;
    public int? ExerciseId { get; set; }
    public string? ExerciseTitle { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? VideoUrl { get; set; }
    public string? Status { get; set; }
    public int? AdminId { get; set; }
    public string? AdminName { get; set; }
    public string? ReviewNote { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }

    // Request fields
    public int? RequestedBy { get; set; }
    public string? RequestedByName { get; set; }
    public string? MuscleGroup { get; set; }
    public ExerciseDifficulty? Difficulty { get; set; }
    public string? Instructions { get; set; }
    public string? Priority { get; set; }
    public DateTime? Deadline { get; set; }
    public int? Duration { get; set; }
}
