namespace FitnessTrainingSystem.Application.DTOs.PTs;

public class PTProfileDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SessionRate { get; set; }
    public decimal? Rating { get; set; }
    public string? CoachingPhilosophy { get; set; }
}
