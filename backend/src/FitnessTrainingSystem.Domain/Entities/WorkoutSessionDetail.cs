using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class WorkoutSessionDetail
{
    public int Id { get; set; }

    public int WorkoutSessionId { get; set; }

    public int ExerciseId { get; set; }

    public int? SetsDone { get; set; }

    public int? RepsDone { get; set; }

    public int? DurationSeconds { get; set; }

    public decimal? CaloriesBurned { get; set; }

    public virtual Exercise Exercise { get; set; } = null!;

    public virtual WorkoutSession WorkoutSession { get; set; } = null!;
}
