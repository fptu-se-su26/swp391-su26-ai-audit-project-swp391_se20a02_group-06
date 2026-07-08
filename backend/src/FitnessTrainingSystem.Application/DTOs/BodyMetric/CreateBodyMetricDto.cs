using System.ComponentModel.DataAnnotations;

namespace FitnessTrainingSystem.Application.DTOs.BodyMetric;

public class CreateBodyMetricDto
{
    public decimal? Height { get; set; }
    
    [Required]
    [Range(20, 300, ErrorMessage = "Weight must be between 20 and 300 kg")]
    public decimal Weight { get; set; }
    
    public decimal? BodyFatPercentage { get; set; }
    public decimal? MuscleMass { get; set; }
    public decimal? Bmi { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
}
