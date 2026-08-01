using System;
using System.Collections.Generic;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class PtUploadRequest
{
    public int Id { get; set; }

    public int PtId { get; set; }

    public int? ExerciseId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? VideoUrl { get; set; }

    public string? Status { get; set; }

    public int? AdminId { get; set; }

    public string? ReviewNote { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    // Admin request fields
    public int? RequestedBy { get; set; }
    public string? MuscleGroup { get; set; }
    public string? Difficulty { get; set; }
    public string? Instructions { get; set; }
    public string? Priority { get; set; } // LOW, MEDIUM, HIGH
    public DateTime? Deadline { get; set; }
    public int? Duration { get; set; }

    public virtual User? Admin { get; set; }
    public virtual User? RequestedByUser { get; set; }
    public virtual Exercise? Exercise { get; set; }
    public virtual User Pt { get; set; } = null!;
}
