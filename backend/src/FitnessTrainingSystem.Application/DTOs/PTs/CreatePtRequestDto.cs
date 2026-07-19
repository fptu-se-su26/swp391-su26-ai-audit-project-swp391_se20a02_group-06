namespace FitnessTrainingSystem.Application.DTOs.PTs;

public class CreatePtRequestDto
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int? ExperienceYears { get; set; }
}
