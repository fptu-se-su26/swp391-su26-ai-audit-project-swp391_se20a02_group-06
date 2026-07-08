namespace FitnessTrainingSystem.Application.DTOs.PTs;

public class UpdatePtRequest
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int? ExperienceYears { get; set; }
    public string? Bio { get; set; }
    public string? Status { get; set; }
}
