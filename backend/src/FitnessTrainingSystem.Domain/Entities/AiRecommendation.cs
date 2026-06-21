using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class AiRecommendation
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Type { get; set; } = null!;

    public string? UserRequest { get; set; }

    public string AiResponse { get; set; } = null!;

    public string? ModelName { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
}
