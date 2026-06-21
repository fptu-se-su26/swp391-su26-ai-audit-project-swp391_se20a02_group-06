namespace FitnessTrainingSystem.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
