using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class PtUploadRequest
{
    public int Id { get; set; }

    public int PtId { get; set; }

    public int? ExerciseId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string VideoUrl { get; set; } = null!;

    public string? Status { get; set; }

    public int? AdminId { get; set; }

    public string? ReviewNote { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public virtual User? Admin { get; set; }

    public virtual Exercise? Exercise { get; set; }

    public virtual User Pt { get; set; } = null!;
}
