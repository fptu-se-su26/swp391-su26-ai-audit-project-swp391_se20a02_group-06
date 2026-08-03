using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class PtProfile : BaseEntity
{
    public int UserId { get; set; }
    public string? Bio { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal Rating { get; set; } = 5.0m;
    
    public string? CoachingPhilosophy { get; set; }
    public decimal? SessionRate { get; set; }

    public User User { get; set; } = null!;
}
