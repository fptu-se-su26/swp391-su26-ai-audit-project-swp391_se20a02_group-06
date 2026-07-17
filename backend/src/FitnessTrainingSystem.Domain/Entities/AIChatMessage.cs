namespace FitnessTrainingSystem.Domain.Entities;

public class AIChatMessage
{
    public int Id { get; set; }

    public int SessionId { get; set; }

    public AIChatSession Session { get; set; } = null!;

    /// <summary>
    /// Maps to "sender" column in DB. Values: "user" | "assistant" | "system"
    /// </summary>
    public string Role { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}