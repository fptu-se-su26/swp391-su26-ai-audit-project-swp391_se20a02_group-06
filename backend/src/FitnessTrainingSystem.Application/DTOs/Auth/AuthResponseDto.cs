namespace FitnessTrainingSystem.Application.DTOs.Auth;

public class AuthResponseDto
{
    public int UserId { get; set; }
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public int? RoleId { get; set; }
}
