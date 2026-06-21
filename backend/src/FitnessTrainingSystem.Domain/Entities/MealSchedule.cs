using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class MealSchedule
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? AiRecommendationId { get; set; }

    public string ScheduleName { get; set; } = null!;

    public TimeOnly? EatTime { get; set; }

    public int? TotalCaloriesTarget { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual AiRecommendation? AiRecommendation { get; set; }

    public virtual ICollection<MealScheduleItem> MealScheduleItems { get; set; } = new List<MealScheduleItem>();

    public virtual User User { get; set; } = null!;
}
