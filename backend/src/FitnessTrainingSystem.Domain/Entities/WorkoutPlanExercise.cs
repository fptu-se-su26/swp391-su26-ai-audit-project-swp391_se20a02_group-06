using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class WorkoutPlanExercise
{
    public int Id { get; set; }

    public int WorkoutPlanId { get; set; }

    public int ExerciseId { get; set; }

    public int? Sets { get; set; }

    public int? Reps { get; set; }

    public int? DurationSeconds { get; set; }

    public int? RestSeconds { get; set; }

    public int? ExerciseOrder { get; set; }

    public virtual Exercise Exercise { get; set; } = null!;

    public virtual WorkoutPlan WorkoutPlan { get; set; } = null!;
}
