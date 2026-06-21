using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class MealScheduleItem
{
    public int Id { get; set; }

    public int MealScheduleId { get; set; }

    public int FoodId { get; set; }

    public string Amount { get; set; } = null!;

    public bool? IsEaten { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Food Food { get; set; } = null!;

    public virtual MealSchedule MealSchedule { get; set; } = null!;
}
