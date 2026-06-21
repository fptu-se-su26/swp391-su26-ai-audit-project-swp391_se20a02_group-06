using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class PtProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? Bio { get; set; }

    public string? Specialization { get; set; }

    public int? ExperienceYears { get; set; }

    public string? CertificateUrl { get; set; }

    public decimal? Rating { get; set; }

    public decimal? HourlyRate { get; set; }

    public virtual User User { get; set; } = null!;
}
