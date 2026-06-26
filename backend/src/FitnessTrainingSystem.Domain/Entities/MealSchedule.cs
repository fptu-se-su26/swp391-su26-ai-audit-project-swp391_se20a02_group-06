using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class MealSchedule
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;
    public AiRecommendation? AiRecommendation { get; set; }
    public ICollection<MealScheduleItem> MealScheduleItems { get; set; } = new List<MealScheduleItem>();
}
