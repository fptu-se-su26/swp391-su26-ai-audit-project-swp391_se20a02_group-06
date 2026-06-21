using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class WorkoutSession
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? WorkoutPlanId { get; set; }

    public int? TotalDurationMinutes { get; set; }

    public decimal? TotalCaloriesBurned { get; set; }

    public string? Status { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual WorkoutPlan? WorkoutPlan { get; set; }

    public virtual ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
