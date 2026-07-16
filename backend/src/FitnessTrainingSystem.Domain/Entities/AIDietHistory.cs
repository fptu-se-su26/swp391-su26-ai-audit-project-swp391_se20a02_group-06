namespace FitnessTrainingSystem.Domain.Entities;

public class AIDietHistory
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public int SessionId { get; set; }

    public AIChatSession Session { get; set; } = null!;

    public string DietTitle { get; set; } = string.Empty;

    public string DietJson { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}