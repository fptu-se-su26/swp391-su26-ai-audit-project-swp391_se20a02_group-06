namespace FitnessTrainingSystem.Application.DTOs.User;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Plan { get; set; }
    public string? PlanStartDate { get; set; }
    public string? PlanEndDate { get; set; }
    public string JoinDate { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
