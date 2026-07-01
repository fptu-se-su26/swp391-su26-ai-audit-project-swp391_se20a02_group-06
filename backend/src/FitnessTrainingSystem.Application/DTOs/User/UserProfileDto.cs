namespace FitnessTrainingSystem.Application.DTOs.User;

public class UserProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Tier { get; set; } = "Member";
    public string JoinDate { get; set; } = string.Empty;
    public string? PasswordChangedAt { get; set; }
    public int WorkoutsCompleted { get; set; }
    public int CurrentStreak { get; set; }
    public string ActivePlan { get; set; } = "None";
}
