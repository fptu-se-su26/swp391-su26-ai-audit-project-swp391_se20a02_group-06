using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class Exercise
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public User? Creator { get; set; }
    public ICollection<WorkoutSessionDetail> WorkoutSessionDetails { get; set; } = new List<WorkoutSessionDetail>();
}
