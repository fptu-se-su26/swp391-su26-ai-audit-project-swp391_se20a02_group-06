using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class BodyMetric
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal? Height { get; set; }

    public decimal Weight { get; set; }

    public decimal? BodyFatPercentage { get; set; }

    public decimal? MuscleMass { get; set; }

    public decimal? Bmi { get; set; }

    public DateTime? RecordedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
