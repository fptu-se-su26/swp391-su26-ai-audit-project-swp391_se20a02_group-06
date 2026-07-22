namespace FitnessTrainingSystem.Application.DTOs.User;

public class UpdateUserRequest
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Status { get; set; }
}
