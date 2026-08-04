namespace FitnessTrainingSystem.Application.DTOs.PTs;

public class UpdatePTProfileDto
{
    public string? FullName { get; set; }
    public string? Bio { get; set; }
    public int? ExperienceYears { get; set; }
    public decimal? SessionRate { get; set; }
    public string? CoachingPhilosophy { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
}
