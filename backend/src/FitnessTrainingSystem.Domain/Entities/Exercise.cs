using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class Exercise
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? VideoUrl { get; set; }

    public string? ThumbnailUrl { get; set; }

    public int? MuscleGroupId { get; set; }

    public string Difficulty { get; set; } = null!;

    public string? Equipment { get; set; }

    public int? DurationMinutes { get; set; }

    public decimal? CaloriesBurnPerMin { get; set; }

    public int? CreatedBy { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual MuscleGroup? MuscleGroup { get; set; }

    public virtual ICollection<PtUploadRequest> PtUploadRequests { get; set; } = new List<PtUploadRequest>();

    public virtual ICollection<WorkoutPlanExercise> WorkoutPlanExercises { get; set; } = new List<WorkoutPlanExercise>();

    public virtual ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
