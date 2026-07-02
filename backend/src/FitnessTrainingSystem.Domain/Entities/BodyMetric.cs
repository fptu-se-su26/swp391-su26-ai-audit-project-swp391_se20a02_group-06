using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class BodyMetric : BaseEntity
{
    public int UserId { get; set; }
    public decimal? Height { get; set; }
    public decimal Weight { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? MuscleMass { get; set; }
    public decimal? Bmi { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
