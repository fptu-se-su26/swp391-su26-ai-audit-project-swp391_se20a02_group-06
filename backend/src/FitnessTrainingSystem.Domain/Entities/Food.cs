using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class Food
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ServingSize { get; set; }

    public string? Unit { get; set; }

    public int Calories { get; set; }

    public decimal? Protein { get; set; }

    public decimal? Carbs { get; set; }

    public decimal? Fat { get; set; }

    public string? ImageUrl { get; set; }

    public virtual ICollection<MealScheduleItem> MealScheduleItems { get; set; } = new List<MealScheduleItem>();
}
