using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class WorkoutPlan
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? AiRecommendationId { get; set; }

    public string Title { get; set; } = null!;

    public string? Goal { get; set; }

    public int? TargetCalories { get; set; }

    public int? TargetDurationMinutes { get; set; }

    public bool? CreatedByAi { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual AiRecommendation? AiRecommendation { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual ICollection<WorkoutPlanExercise> WorkoutPlanExercises { get; set; } = new List<WorkoutPlanExercise>();

    public virtual ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
}
