namespace FitnessTrainingSystem.Application.DTOs.PTs;

public class PtDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal? Rating { get; set; }
    public string Experience { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? CoachingPhilosophy { get; set; }
    public decimal? SessionRate { get; set; }
}
